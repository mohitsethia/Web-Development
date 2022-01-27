const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const https = require("https");
var ObjectId = require('mongodb').ObjectID;
let alert = require('alert'); 
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('./swagger.json');

const app = express();

const swaggerApp = express();
const swaggerPort = 8080;

app.use(cors());

swaggerApp.use(cors());

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(bodyParser.json());

//connect to local database
mongoose.connect("mongodb://localhost:27017/memeDB", {useNewUrlParser: true, useUnifiedTopology: true});

//how data in database would look like, what data to be included
const memeSchema = new mongoose.Schema({
	name: String,
	url: String,
	caption: String,
	likes: Number
});

//keeping track of id in database
const Meme = mongoose.model("Meme", memeSchema);

//route to home page to show submit form and meme posts
app.get("/", function(req, res){
	//get all the objects in database
	Meme.find({}, function(err, foundItems){
		if(err)
			res.sendStatus(500); //if there are any errors to get data, internal server error is thrown
		//rendering the frontend by passing the objects of database to show it in the page
		res.render("meme", {query: foundItems});
	});
});

//accepting the form data when the form is filled
app.post("/", function(req, res){
	const itemName = req.body.name;
	const itemCaption = req.body.caption;
	const itemUrl = req.body.url;
	//check if name data is already exists in database
	Meme.find({name: itemName}, function(err, find){
		if(!err){
			//if name is not already present
			if(!find.length){
				//check for unique caption
				Meme.find({caption: itemCaption}, function(err, found){
					if(!err){
						//if unique caption is found
						if(!found.length){
							//checking for already existing meme url
							Meme.find({url: itemUrl}, function(err, foundItems){
								if(!err){
									//if meme url is not already present in the data base
									if(!foundItems.length){
										//creating the object for database
										var  meme = new Meme({
											name: itemName,
											url: itemUrl,
											caption: itemCaption,
											likes: 0
										});
										meme.save(); //saving the object in database
										//redirecting to home page, which will also update the page with new page and also show existing memes
										res.status(201).redirect("/");
									}
									else{
										//if meme url is not unique then a popup appears with below message
										alert("This Meme url is already present!");
										//and send 409 http status with redirection to remain in home page
										res.status(409).redirect("/");
									}
								}
							});
						}
						else{
							//if caption is not unique then a pop appears with the below message
							alert("Meme is already present by this caption!");
							//and send 409 http status with redirection to remain in home page
							res.status(409).redirect("/");
						}
					}
				});
			}
			else{
				//if name is already used for a meme then a popup is shown with the below message
				alert("This name is already present");
				//and send 409 http status with redirection to remain in home page
				res.status(409).redirect("/");
			}
		}
	});
});

//to get the data of the latest 100 memes in json format
app.get("/memes", function(req, res){
	Meme.find().sort({id:-1}).limit(100).find(function(err, foundItems) {
		if(err)
			throw err;
		//creating a json object
		let found = [];
		//data present in database are sent in json format to replace _id with id
		foundItems.forEach(function(item){
			found.push({"id": item._id, "name": item.name, "url": item.url, "caption": item.caption});
		});
		//sending the json data with status code of 200
		res.status(200).json(found);
	});
});


//when data is transferred in API endpoints
app.post("/memes", function(req, res){
	let itemName = req.body.name;
	let itemUrl = req.body.url;
	let itemCaption = req.body.caption;

	// check if name is already present
	Meme.find({name: itemName}, function(err, foundItems){
		if(!err){
			if(foundItems.length){
				res.status(409).send("name already exists");
			}
		}
	});

	// check if url is already present
	Meme.find({url: itemUrl}, function(err, foundItems){
		if(!err){
			if(foundItems.length){
				res.status(409).send("url already exists");
			}
		}
	});

	// check if caption is already present
	Meme.find({caption: itemCaption}, function(err, foundItems){
		if(!err){
			if(foundItems.length){
				res.status(409).send("caption already exists");
			}
		}
	});

	//creating the object to insert it in the database with the following data
	let meme = new Meme({
		name: itemName,
		url: itemUrl,
		caption: itemCaption,
		likes: 0
	});

	//saves the data in mongodb database and returns the id
	meme.save().then(
    () => {
      	res.status(201).json({
        	"id": meme._id
      	});
    }
  	).catch(
    (error) => {
    	//if there is error in saving the data then error is thrown with status code 400
      res.status(400).json({
        error: error
      });
    }
  	);
});

//get the data of the meme with the specific id
app.get("/memes/:customId", function(req, res){
	let customId = req.params.customId;
	//check if id of any object in database matches with the provided id
	Meme.findOne({_id: ObjectId(customId)}, function(err, foundItem){
		if(!err){
			if(foundItem){
				//if object with specified id is found then return all the data of the meme in json format
				const data = {"id": foundItem._id, "name": foundItem.name, "url": foundItem.url, "caption": foundItem.caption};
				res.status(200).json(data);
			}
			else{
				//if invalid id is provided then status code 404 is sent because of user error
				res.sendStatus(404);
			}
		}
		else{
			//if error occurs while retrieving the data
			res.sendStatus(500);
		}
	});
});


//to update meme caption and url of given id
app.patch("/memes/:customId", function(req, res){
	const customId = req.params.customId;
	const itemUrl = req.body.url;
	const itemCaption = req.body.caption;

	//check if url is already present
	Meme.find({url: itemUrl}, function(err, foundItems){
		if(!err){
			if(foundItems.length){
				res.status(409).send("url already exists");
			}
		}
	});

	//check if caption is already present
	Meme.find({caption: itemCaption}, function(err, foundItems){
		if(!err){
			if(foundItems.length){
				res.status(409).send("caption already exists");
			}
		}
	});

	//updating in database with the new provided details
	Meme.updateOne({_id: ObjectId(customId)}, {url: itemUrl, caption: itemCaption}, function(err){
		if(err){
			//if new details cannot be saved there must be a user error
			res.sendStatus(500);
		}
		else{
			//sending status ok if data has successfully been updated
			res.sendStatus(200);
		}
	});
});

//route to the editor page where url and caption can be updated
app.get("/:id/edit", function(req, res){
	let customId = req.params.id;

	//getting all the details of the object by id
	Meme.findOne({_id: ObjectId(customId)}, function(err, foundItems){
		if(err)
			throw err;
		//routing to editor page where url and caption can be updated
		res.render("editor", {query: foundItems});
	});
});
//updating the post
app.post("/:id/edit", function(req,res){
	const customId = req.params.id;
	const itemUrl = req.body.url;
	const itemCaption = req.body.caption;

	//updating url and caption in database of that particular post only
	Meme.updateOne({_id: ObjectId(customId)}, {url: itemUrl, caption: itemCaption}, function(err){
		if(err){
			res.sendStatus(500);
		}
		else{
			//routing to home page with updated details
			res.status(200).redirect("/");
		}
	});
});

//to update likes in the given post
app.post("/:id/likes", function(req, res){
	const customId = req.params.id;

	//increases like count in database
	Meme.updateOne({_id: ObjectId(customId)}, {$inc: {"likes": 1} }, function(err){
		if(err){
			res.sendStatus(500);
		}
		else{
			res.status(200).redirect("/");
		}
	});
});

//swagger setup
swaggerApp.use('/swagger-ui', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc));

//swagger port
swaggerApp.listen(swaggerPort, () => {
	console.log('Swagger up and running on ' + swaggerPort);
});

//main server port
app.listen(process.env.PORT || 8081, function(){
	console.log("Server started on port 8081");
});