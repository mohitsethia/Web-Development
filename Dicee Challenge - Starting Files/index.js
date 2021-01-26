var n = Math.floor(Math.random() * 6) + 1;
var m = Math.floor(Math.random() * 6) + 1;
var randomDiceImage1 = "images/dice" + n + ".png";
var randomDiceImage2 = "images/dice" + m + ".png";
document.querySelectorAll("img")[0].setAttribute("src", randomDiceImage1);
document.querySelectorAll("img")[1].setAttribute("src", randomDiceImage2);
if(n > m){
	document.querySelector("h1").innerHTML = "🚩Player 1 Wins!";
}
else if(n === m){
	document.querySelector("h1").innerHTML = "Draw!";
}
else{
	document.querySelector("h1").innerHTML = "Player 2 Wins!🚩";
}
