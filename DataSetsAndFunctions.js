let fs = require('fs');

// read our txt files and store the strings in three different arrays
// cities, gradings and names. 
let CityArr = fs.readFileSync('./patientCity.txt').toString().split("\r\n");
let GradingArr = fs.readFileSync('./patientGrade.txt').toString().split("\r\n");
let NameArr = fs.readFileSync('./patientData.txt').toString().split("\r\n");

// contains our data arrays in an object.
let patientObj = {
    CityArr,
    GradingArr,
    NameArr
}

function patientData(dataReady){
    if(dataReady == true){
       return patientObj;
    }
}
 
function greetUsers(){
         let today = new Date().toString();
         return console.log(`Welcome to our prototype -> Today is: -> ${today}`);     
}

// export all functions, objects, arrays etc with the exports module 
module.exports = {
    patientObj,
    patientData,
    greetUsers
 }