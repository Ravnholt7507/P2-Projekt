const { patientObj } = require("./DataProjekt");
let fs = require('fs');
const { systemStart } = require('./RegionMan');

// read our txt files and store the strings in three different arrays
// cities, gradings and names. 
let CityArr = fs.readFileSync('./city.txt').toString().split("\r\n");
let GradingArr = fs.readFileSync('./patientGrade.txt').toString().split("\r\n");
let NameArr = fs.readFileSync('./patientData.txt').toString().split("\r\n");
let regionArr = [0,0,0,0,0];
regionArr[0] = [];
regionArr[1] = [];
regionArr[2] = [];
regionArr[3] = [];
regionArr[4] = [];
let regionCities = [0,0,0,0,0];
regionCities[0] = ['aalborg', 'laeso', 'frederikshavn', 'jammerbugt', 'thisted', 'rebild', 'mariagerfjord'];
regionCities[1] = ['favrskov', 'hedensted', 'herning', 'holstebro', 'horsens', 'ikast'];
regionCities[2] = ['assens', 'billund', 'esbjerg', 'frederecia', 'faaborg', 'haderslev'];
regioncities[3] = ['faxe', 'greve', 'holdbaek', 'koege', 'lolland', 'lejre', 'kalundborg'];
regionCities[4] = ['koebenhavn', 'albertslund', 'alleroed', 'ballerup', 'bornholm', 'broendby', 'egedal'];


// this function needs to divide the patient's cities into a group of 5 (since 5 regions) so we can create a distance constraint
// if grading level > 0, emergency, relocate person to nearest hospital, if grading level == 0, don't register them, send them home via homeAllocation 
function regionOnePatients(arrayOfCities){
   // resets regioninventory (from region 1)
   let inventory = [];
   let i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, p;
   let placeholder = 0;

   // checks how many patients are in region 1, returns an "inventory" with a number of patients to be admitted in said region

   for(index in regioncities){
      if(placeholder < regionCities[index].length)
         placeholder = regionCities[index].length
   }

   for(index in arrayOfCities){
       for(i = 0; i < placeholder; i++){
            if(regionCities[0][i] == arrayOfCities[index]){
               regionArr[0][p] = GradingArr[index];
               p++
               inventory[0] += 1
            }
            else if(regionCities[1][i] == arrayOfCities[index]){
               regionArr[1][k] = GradingArr[index];
               k++
               inventory[1] += 1;
            }
            else if(regionCities[2][i] == arrayOfCities[index]){
               regionArr[2][l] = GradingArr[index];
               l++
               inventory[2] += 1;
            }
            else if(regionCities[3][i] == arrayOfCities[index]){
               regionArr[3][m] = GradingArr[index];
               m++;
               inventory[3] += 1; 
            }
            else if(regionCities[4][i] == arrayOfCities[index]){
               regionArr[4][n] = GradingArr[index];
               n++;
               inventory[4] += 1;
            }
          }
    }
   return inventory;
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
          let regionOneGradings = [];
          let regionTwoGradings = [];
          let regionThreeGradings = [];
          let regionFourGradings = [];
          let regionFiveGradings = [];
          let regionsTotal = [0,0,0,0,0];
          // below inserts the amount of grading "1" patients into the different regions (
          // One = north jutland, Two = mid jutland until five = capital.
         
          for(index in regionArr[0]){
            if(regionArr[0][index] == 0)
                regionOneGradings[0] += 1;
            else if(regionArr[0][index] == 1)
                regionOneGradings[1] += 1;
            else if (regionOneArr[index] == 2)
                regionOneGradings[2] += 1;
          }

          for(index in regionTwoArr){
            if(regionTwoArr[index] == 0)
                regionTwoGradings[0] += 1;
            else if(regionTwoArr[index] == 1)
                regionTwoGradings[1] += 1;
            else if (regionTwoArr[index] == 2)
                regionTwoGradings[2] += 1;
          }

          for(index in regionThreeArr){
            if(regionThreeArr[index] == 0)
                regionThreeGradings[0] += 1;
            else if(regionThreeArr[index] == 1)
                regionThreeGradings[1] += 1;
            else if (regionThreeArr[index] == 2)
                regionThreeGradings[2] += 1;
          }

          for(index in regionFourArr){
            if(regionFourArr[index] == 0)
                regionFourGradings[0] += 1;
            else if(regionFourArr[index] == 1)
                regionFourGradings[1] += 1;
            else if (regionFourArr[index] == 2)
                regionFourGradings[2] += 1;
          }

          for(index in regionFiveArr){
            if(regionFiveArr[index] == 0)
                regionFiveGradings[0] += 1;
            else if(regionFiveArr[index] == 1)
                regionFiveGradings[1] += 1;
            else if (regionFiveArr[index] == 2)
                regionFiveGradings[2] += 1;
          }

         // inserting into the correct array spots in our region total array. 

         regionsTotal[0] = regionOneArr.length; 
         regionsTotal[1] = regionTwoArr.length; 
         regionsTotal[2] = regionThreeArr.length; 
         regionsTotal[3] = regionFourArr.length; 
         regionsTotal[4] = regionFiveArr.length; 

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
