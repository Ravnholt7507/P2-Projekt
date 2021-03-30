//  https://www.w3schools.com/js/js_strict.asp <-- check this out
"use strict";

// require the nodejs module 'readline' (allows user input)
const readline = require('readline');

//allows us to use the filesystem module
const fs = require('fs');
// extra functions (they do not have a current use but are placeholders as of right now for others to build on)
let extraFunctions = require('./extrafuncs.js');

// allowing us to use the patientobj(object) / patientdata function
const { patientObj, patientData, greetUsers } = require('./DataProjekt.js');

// this will be our systemstart, prompts the user with a welcome msg and the current loads in each region in regards to our constraints)
function systemStart(){
// activates our greeting function. Then resumes control to the startupmsg
greetUsers();   
//setup a variable (startupmsg) and prepare the correct prepocessor directives
const startUpMsg =  readline.createInterface({
         input: process.stdin,
         output: process.stdout
});

// setup a question, this is similar to scanf and printf, we will be prompted for a string, this string will be stored in our callback function and in the parameter 'answer'
startUpMsg.question('Welcome. Type a number between 1-5 to check the current region and its capacity in terms of our constraints)', (answer) => {
            console.log(`Region to be looked into: ${answer}`); 
            // use a bool called preparedata to control the flow,
            // data should always be ready in a region, else people can easily get into trouble with their health. 
            let prepareData = 0;
            if(answer == '1'){
               console.log("Region one has been chosen");
               prepareData = 1;
               let regionOne = patientData(prepareData);
               startUpMsg.close();
            }else if(answer == '2'){
               console.log('Region 2 has been chosen');
               prepareData = 1;
               let regionTwo = patientData(prepareData);
               // debugging purpose --> console.log(regionTwo);
               startUpMsg.close;
            }else if(answer == '3'){
               console.log('Region 3 has been chosen');
               prepareData = 1;
               let regionThree = patientData(prepareData);
               startUpMsg.close();
            }else if(answer == '4'){
               console.log('Region 4 has been chosen');
               prepareData = 1;
               let regionFour = patientData(prepareData);
               startUpMsg.close();
            } else if(answer == '5'){
               console.log('Region 5 has been chosen');
               prepareData = 1;
               let regionFives = patientData(prepareData);
               startUpMsg.close();
            }     
    })   
}


// exporting systemstart function to other modules.
module.exports = {
   systemStart
}