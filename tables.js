const { patientObj } = require("./DataProjekt");
let fs = require('fs');
const { systemStart } = require('./RegionMan');

// read our txt files and store the strings in three different arrays
// cities, gradings and names. 
let CityArr = fs.readFileSync('./city.txt').toString().split("\r\n");
let GradingArr = fs.readFileSync('./patientGrade.txt').toString().split("\r\n");
let NameArr = fs.readFileSync('./patientData.txt').toString().split("\r\n");


// this function needs to divide the patient's cities into a group of 5 (since 5 regions) so we can create a distance constraint
// if grading level > 0, emergency, relocate person to nearest hospital, if grading level == 0, don't register them, send them home via homeAllocation 
function regionOnePatients(arrayOfCities){
   let regionOne = 0;
   // resets regioninventory (from region 1)
   let inventory = 0;
   // checks how many patients are in region 1, returns an "inventory" with a number of patients to be admitted in said region
   for(index in arrayOfCities){
       if(arrayOfCities[index] == 'aalborg'){
          regionOne +=1;
      }else if(arrayOfCities[index] == 'laeso'){
          regionOne +=1;
      }else if(arrayOfCities[index] == 'frederikshavn'){
          regionOne +=1;
      }else if(arrayOfCities[index] == 'jammerbugt'){
          regionOne +=1;
      }else if(arrayOfCities[index] == 'thisted'){
          regionOne +=1;
      }else if(arrayOfCities[index] == 'rebild'){
          regionOne +=1;
      }else if(arrayOfCities[index] == 'mariagerfjord'){
          regionOne +=1;
      }
   }   

   inventory = regionOne;
   return inventory;
}


function regionTwoPatients(arrayOfCities){
   let regionTwo= 0;
   // resets regioninventory (from region 2)
   let inventory = 0;
   // checks how many patients are in region 2, returns an "inventory" with a number of patients to be admitted in said region
   for(index in arrayOfCities){
       if(arrayOfCities[index] == 'favrskov'){
          regionTwo +=1;
       }else if(arrayOfCities[index] == 'hedensted'){
          regionTwo +=1;
       }else if(arrayOfCities[index] == 'herning'){
          regionTwo +=1;
       }else if(arrayOfCities[index] == 'holstebro'){
          regionTwo +=1;
       }else if(arrayOfCities[index] == 'horsens'){
          regionTwo +=1;
       }else if(arrayOfCities[index] == 'ikast'){
          regionTwo +=1;
       }
   }   

   inventory = regionTwo;
   return inventory;
}


function regionThreePatients(arrayOfCities){
   let regionThree = 0;
   // resets regioninventory (from region 1 to 5)
   let inventory = 0;
   // checks how many patients are in region one to five, inserts the 'amount' of patients from each city in said region to an inventory array to be returned
   for(index in arrayOfCities){
       if(arrayOfCities[index] == 'assens'){
          regionThree +=1;
       }else if(arrayOfCities[index] == 'billund'){
          regionThree +=1;
       }else if(arrayOfCities[index] == 'esbjerg'){
          regionThree +=1;
       }else if(arrayOfCities[index] == 'frederecia'){
          regionThree +=1;
       }else if(arrayOfCities[index] == 'faaborg'){
          regionThree +=1;
       }else if(arrayOfCities[index] == 'haderslev'){
          regionThree +=1;
       }
   }
    
   inventory = regionThree;
   return inventory;
}


function regionFourPatients(arrayOfCities){
   let regionFour = 0;
   // resets regioninventory (from region 1 to 5)
   let inventory = 0;
   // checks how many patients are in region one to five, inserts the 'amount' of patients from each city in said region to an inventory array to be returned
   for(index in arrayOfCities){
       if(arrayOfCities[index] == 'faxe'){
          regionFour +=1;
       }else if(arrayOfCities[index] == 'greve'){
          regionFour +=1;
       }else if(arrayOfCities[index] == 'holdbaek'){
          regionFour +=1;
       }else if(arrayOfCities[index] == 'koege'){
          regionFour +=1;
       }else if(arrayOfCities[index] == 'lolland'){
          regionFour +=1;
       }else if(arrayOfCities[index] == 'lejre'){
          regionFour +=1;
       }else if(arrayOfCities[index] == 'kalundborg'){
          regionFour +=1;
       }
   }   

   inventory = regionFour;
   return inventory;
}

function regionFivesPatients(arrayOfCities){
   let regionFive = 0;
   // resets regioninventory (from region 1 to 5)
   let inventory = 0;
   // checks how many patients are in region one to five, inserts the 'amount' of patients from each city in said region to an inventory array to be returned
   for(index in arrayOfCities){
       if(arrayOfCities[index] == 'koebenhavn'){
          regionFive +=1;
       }else if(arrayOfCities[index] == 'albertslund'){
          regionFive +=1;
       }else if(arrayOfCities[index] == 'alleroed'){
          regionFive +=1;
       }else if(arrayOfCities[index] == 'ballerup'){
          regionFive +=1;
       }else if(arrayOfCities[index] == 'bornholm'){
          regionFive +=1;
       }else if(arrayOfCities[index] == 'broendby'){
          regionFive +=1;
       }else if(arrayOfCities[index] == 'egedal'){
          regionFive +=1;
       }
   }   

   inventory = regionFive;
   return inventory;
}


// handles all inventories from all the regions
function regionInventoryTotal(CityArr){
   let regionInventory = [0,0,0,0,0];
       regionInventory[0] = regionOnePatients(CityArr);
       regionInventory[1] = regionTwoPatients(CityArr);
       regionInventory[2] = regionThreePatients(CityArr);
       regionInventory[3] = regionFourPatients(CityArr);
       regionInventory[4] = regionFivesPatients(CityArr);
       
   return regionInventory;
}

// testing
// let test = regionInventoryTotal(CityArr);
// console.log(test);

// region object holding all the different region functions for further calcs.
let regionObj = {
   regionOnePatients,
   regionTwoPatients,
   regionThreePatients,
   regionFourPatients,
   regionFivesPatients
}


// ---- creating the code for grading levels now, this purely takes in immediate patients to be admitted. 
//------------------------------------

// validate the different grading levels (1 == immediate care, needs to be admitted )
function gradingEval(gradingArray,startElem,EndElement){
   // calling .splice method to partition the arrays into five halves and return it into another array with different values in the 0-4 positions.
   return  gradingArray.splice(startElem,EndElement);
 }

// returns an array indiced from 0-4, holding in each array index an amount of patients to be admitted 
function regionGradingsInTotal(gradeArr){
          let regionOne = [];
          let regionTwo = [];
          let regionThree = [];
          let regionFour = [];
          let regionFive = [];
          let regionsTotal = [0,0,0,0,0];
          // below inserts the amount of grading "1" patients into the different regions (
          // One = north jutland, Two = mid jutland until five = capital.
         
          regionOne = gradingEval(gradeArr,0,87);
          regionTwo = gradingEval(gradeArr,0,45);
          regionThree = gradingEval(gradeArr,0,66);
          regionFour = gradingEval(gradeArr,0,71);
          regionFive = gradingEval(gradeArr,0,62);

         // inserting into the correct array spots in our region total array. 

         regionsTotal[0] = regionOne.length; 
         regionsTotal[1] = regionTwo.length; 
         regionsTotal[2] = regionThree.length; 
         regionsTotal[3] = regionFour.length; 
         regionsTotal[4] = regionFive.length; 

  return regionsTotal;    
}

// testing 
let test7 = regionGradingsInTotal(GradingArr);
console.log(test7);


function admitPatient(patientList){
         
}

// exporting all objs,functions
module.exports = {
   regionObj,
   regionInventoryTotal,
   regionGradingsInTotal
}
