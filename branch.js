// const { patientObj } = require("./DataProjekt");

// const { systemStart } = require('./RegionMan');

// read our txt files and store the strings in three different arrays
// cities, gradings and names. 

let regionArr = [0,0,0,0,0];
regionArr[0] = [];
regionArr[1] = [];
regionArr[2] = [];
regionArr[3] = [];
regionArr[4] = [];
let regionNames = [0,0,0,0,0];
regionNames[0] = [];
regionNames[1] = [];
regionNames[2] = [];
regionNames[3] = [];
regionNames[4] = [];
let regionCities = [0,0,0,0,0];
regionCities[0] = ['Brønderslev','Frederikshavn','Hjørring','Jammerbugt','Læsø','Mariagerfjord','Morsø','Rebild','Thisted','Vesthimmerland','Aalborg'];
regionCities[1] = ['Favrskov','Hedensted','Herning','Holstebro','Horsens','Ikast','Lemvig','Norddjurs','Odder','Randers','Ringkøbing-Skjern','Samsø','Silkeborg','Skanderborg','Skive','Struer','Syddjurs','Viborg','Aarhus'];
regionCities[2] = ['Assens','Billund','Esbjerg','Fanø','Fredericia','Faaborg-Midtfyn','Haderslev','Kerteminde','Kolding','Langeland','Middelfart','Nordfyns','Nyborg','Odense','Svendborg','Sønderborg','Tønder','Varde','Vejen','Vejle','Ærø','Aabenraa'];
regionCities[3] = ['Faxe', 'Greve', 'Guldborgsund', 'Holbæk', 'Kalundborg', 'Køge', 'Lejre', 'Lolland', 'Næstved', 'Odsherred', 'Ringsted', 'Roskilde', 'Slagelse', 'Solrød', 'Sorø', 'Stevns', 'Vordingborg'];
regionCities[4] = ['Albertslund','Allerød','Ballerup','Bornholm','Brøndby','København','Dragør','Egedal','Fredensborg','Frederiksberg','Frederikssund','Furesø','Gentofte','Gladsaxe','Glostrup','Gribskov','Halsnæs','Helsingør','Herlev','Hillerød','Hvidovre','Høje-Taastrup','Hørsholm','Ishøj','Lyngby-Taarbæk','Rudersdal','Rødovre','Tårnby','Vallensbæk'];
let gradeList = []
// this function needs to divide the patient's cities into a group of 5 (since 5 regions) so we can create a distance constraint
// if grading level > 0, emergency, relocate person to nearest hospital, if grading level == 0, don't register them, send them home via homeAllocation 
function regionPatients(CityArr, NameArr, GradingArr){
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
               regionNames[0][p] = NameArr[index];
               gradeList[j] = 0;
               p++;
               j++;
               inventory[0] += 1;
            }
            else if(regionCities[1][i] == CityArr[index]){
               regionArr[1][k] = GradingArr[index];
               regionNames[1][k] = NameArr[index];
               gradeList[j] = 1;
               k++;
               j++;
               inventory[1] += 1;
            }
            else if(regionCities[2][i] == CityArr[index]){
               regionArr[2][l] = GradingArr[index];
               regionNames[2][l] = NameArr[index];
               gradeList[j] = 2;
               l++;
               j++;
               inventory[2] += 1;
            }
            else if(regionCities[3][i] == CityArr[index]){
               regionArr[3][m] = GradingArr[index];
               regionNames[3][m] = NameArr[index];
               gradeList[j] = 3;
               m++;
               j++;
               inventory[3] += 1; 
            }
            else if(regionCities[4][i] == CityArr[index]){
               regionArr[4][n] = GradingArr[index];
               regionNames[4][n] = NameArr[index];
               gradeList[j] = 4;
               n++;
               j++;
               inventory[4] += 1;
            }
        }
      }
   return inventory;
}

// returns an array indiced from 0-4, holding in each array index an amount of patients to be admitted 
function regionGradingsInTotal(){
   let regionGradings = [0,0,0,0,0]
   regionGradings[0] = {grade0: 0, grade1:0, grade2: 0, grade3: 0}
   regionGradings[1] = {grade0: 0, grade1:0, grade2: 0, grade3: 0}
   regionGradings[2] = {grade0: 0, grade1:0, grade2: 0, grade3: 0}
   regionGradings[3] = {grade0: 0, grade1:0, grade2: 0, grade3: 0}
   regionGradings[4] = {grade0: 0, grade1:0, grade2: 0, grade3: 0}

      for (let i = 0; i<5; i++){
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
      }
         
   return regionGradings;    
}



module.exports = {
   regionPatients,
   regionGradingsInTotal,
   gradeList,
}
