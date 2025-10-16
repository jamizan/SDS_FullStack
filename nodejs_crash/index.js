import getPosts, { getPostLength } from './postController.js';

// const { generateRandomNumber, celciusToFahrenheit } = require('./utils');

//console.log("Random Number:", generateRandomNumber());
//console.log("Celsius to Fahrenheit:", celciusToFahrenheit(0));
console.log(getPosts());
console.log("Posts length:", getPostLength());