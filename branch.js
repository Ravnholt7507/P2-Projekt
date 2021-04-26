// const { patientObj } = require("./DataProjekt");
let fs = require('fs');
// const { systemStart } = require('./RegionMan');

// read our txt files and store the strings in three different arrays
// cities, gradings and names. 

let CityArr = fs.readFileSync('./Cities.txt').toString().split("\r\n");
let GradingArr = fs.readFileSync('./Grades.txt').toString().split("\r\n");
let NameArr = fs.readFileSync('./Names.txt').toString().split("\r\n");
let regionArr = [0,0,0,0,0];
regionArr[0] = [];
regionArr[1] = [];
regionArr[2] = [];
regionArr[3] = [];
regionArr[4] = [];
let regionCities = [0,0,0,0,0];
regionCities[0] = ['Brønderslev','Frederikshavn','Hjørring','Jammerbugt','Læsø','Mariagerfjord','Morsø','Rebild','Thisted','Vesthimmerland','Aalborg'];
regionCities[1] = ['Favrskov','Hedensted','Herning','Holstebro','Horsens','Ikast','Lemvig','Norddjurs','Odder','Randers','Ringkøbing-Skjern','Samsø','Silkeborg','Skanderborg','Skive','Struer','Syddjurs','Viborg','Aarhus'];
regionCities[2] = ['Assens','Billund','Esbjerg','Fanø','Fredericia','Faaborg-Midtfyn','Haderslev','Kerteminde','Kolding','Langeland','Middelfart','Nordfyns','Nyborg','Odense','Svendborg','Sønderborg','Tønder','Varde','Vejen','Vejle','Ærø','Aabenraa'];
regionCities[3] = ['Faxe', 'Greve', 'Guldborgsund', 'Holbæk', 'Kalundborg', 'Køge', 'Lejre', 'Lolland', 'Næstved', 'Odsherred', 'Ringsted', 'Roskilde', 'Slagelse', 'Solrød', 'Sorø', 'Stevns', 'Vordingborg'];
regionCities[4] = ['Albertslund','Allerød','Ballerup','Bornholm','Brøndby','Københavns','Dragør','Egedal','Fredensborg','Frederiksberg','Frederikssund','Furesø','Gentofte','Gladsaxe','Glostrup','Gribskov','Halsnæs','Helsingør','Herlev','Hillerød','Hvidovre','Høje-Taastrup','Hørsholm','Ishøj','Lyngby-Taarbæk','Rudersdal','Rødovre','Tårnby','Vallensbæk'];

// this function needs to divide the patient's cities into a group of 5 (since 5 regions) so we can create a distance constraint
// if grading level > 0, emergency, relocate person to nearest hospital, if grading level == 0, don't register them, send them home via homeAllocation 
function regionPatients(CityArr){
   // resets regioninventory (from region 1)
   let inventory = [0,0,0,0,0];
   let i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, p = 0;
   let placeholder = 0;

   // checks how many patients are in region 1, returns an "inventory" with a number of patients to be admitted in said region

   for(index in regionCities){
      if(placeholder < regionCities[index].length)
         placeholder = regionCities[index].length;
   }


   for(index in CityArr){
       for(i = 0; i < placeholder; i++){
            if(regionCities[0][i] == CityArr[index]){
               regionArr[0][p] = GradingArr[index];
               p++;
               inventory[0] += 1;
            }
            else if(regionCities[1][i] == CityArr[index]){
               regionArr[1][k] = GradingArr[index];
               k++;
               inventory[1] += 1;
            }
            else if(regionCities[2][i] == CityArr[index]){
               regionArr[2][l] = GradingArr[index];
               l++;
               inventory[2] += 1;
            }
            else if(regionCities[3][i] == CityArr[index]){
               regionArr[3][m] = GradingArr[index];
               m++;
               inventory[3] += 1; 
            }
            else if(regionCities[4][i] == CityArr[index]){
               regionArr[4][n] = GradingArr[index];
               n++;
               inventory[4] += 1;
            }
        }
    }
   
    console.log(regionArr[2])
    console.log(regionArr[0])

   return inventory;
}

regionPatients(CityArr);

// for (index in regionArr[4]){
// console.log(regionArr[4][index])
// }


// testing
// let test = regionInventoryTotal(CityArr);
// console.log(test);

// region object holding all the different region functions for further calcs.
// let regionObj = {
//    regionOnePatients,
//    regionTwoPatients,
//    regionThreePatients,
//    regionFourPatients,
//    regionFivesPatients
// }


// ---- creating the code for grading levels now, this purely takes in immediate patients to be admitted. 
//------------------------------------

// validate the different grading levels (1 == immediate care, needs to be admitted )
function gradingEval(gradingArray,startElem,EndElement){
   // calling .splice method to partition the arrays into five halves and return it into another array with different values in the 0-4 positions.
   return  gradingArray.splice(startElem,EndElement);
 }

// returns an array indiced from 0-4, holding in each array index an amount of patients to be admitted 
function regionGradingsInTotal(){
    let regionGradings = [0,0,0,0,0]
    regionGradings[0] = {grade0: 0, grade1:0, grade2: 0, grade3: 0}
    regionGradings[1] = {grade0: 0, grade1:0, grade2: 0, grade3: 0}
    regionGradings[2] = {grade0: 0, grade1:0, grade2: 0, grade3: 0}
    regionGradings[3] = {grade0: 0, grade1:0, grade2: 0, grade3: 0}
    regionGradings[4] = {grade0: 0, grade1:0, grade2: 0, grade3: 0}

          let regionsTotal = [0,0,0,0,0];
          // below inserts the amount of grading "1" patients into the different regions (
          // One = north jutland, Two = mid jutland until five = capital.
         
        for (let i = 0; i<5; i++)  
          for(index in regionArr[i]){
            if(regionArr[i][index] == 0) 
              regionGradings[i].grade0 += 1;
            else if(regionArr[i][index] == 1)
              regionGradings[i].grade1 += 1;
            else if (regionArr[i][index] == 2)
              regionGradings[i].grade2 += 1;
            else if (regionArr[i][index] == 3)
              regionGradings[i].grade3 += 1;
          }


         // inserting into the correct array spots in our region total array. 
         console.log(regionGradings[0])

        //  regionsTotal[0] = regionArr[0].length; 
        //  regionsTotal[1] = regionArr[1].length; 
        //  regionsTotal[2] = regionArr[2].length; 
        //  regionsTotal[3] = regionArr[3].length; 
        //  regionsTotal[4] = regionArr[4].length; 

  return regionsTotal;    
}

regionGradingsInTotal()

// testing 
// let test7 = regionGradingsInTotal(GradingArr);
// console.log(test7);


// exporting all objs,functions
module.exports = {
   regionGradingsInTotal
}
