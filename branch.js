//Contains all cities in arrays. 
let regionCities = [0,0,0,0,0];
regionCities[0] = ['Brønderslev','Frederikshavn','Hjørring','Jammerbugt','Læsø','Mariagerfjord','Morsø','Rebild','Thisted','Vesthimmerland','Aalborg'];
regionCities[1] = ['Favrskov','Hedensted','Herning','Holstebro','Horsens','Ikast','Lemvig','Norddjurs','Odder','Randers','Ringkøbing-Skjern','Samsø','Silkeborg','Skanderborg','Skive','Struer','Syddjurs','Viborg','Aarhus'];
regionCities[2] = ['Assens','Billund','Esbjerg','Fanø','Fredericia','Faaborg-Midtfyn','Haderslev','Kerteminde','Kolding','Langeland','Middelfart','Nordfyns','Nyborg','Odense','Svendborg','Sønderborg','Tønder','Varde','Vejen','Vejle','Ærø','Aabenraa'];
regionCities[3] = ['Faxe', 'Greve', 'Guldborgsund', 'Holdbæk', 'Kalundborg', 'Køge', 'Lejre', 'Lolland', 'Næstved', 'Odsherred', 'Ringsted', 'Roskilde', 'Slagelse', 'Solrød', 'Sorø', 'Stevns', 'Vordingborg'];
regionCities[4] = ['Albertslund','Allerød','Ballerup','Bornholm','Brøndby','København','Dragør','Egedal','Fredensborg','Frederiksberg','Frederikssund','Furesø','Gentofte','Gladsaxe','Glostrup','Gribskov','Halsnæs','Helsingør','Herlev','Hillerød','Hvidovre','Høje-Taastrup','Hørsholm','Ishøj','Lyngby-Taarbæk','Rudersdal','Rødovre','Tårnby','Vallensbæk'];
// this function needs to divide the patient's cities into a group of 5 (since 5 regions) so we can create a distance constraint

//Converts city to region
function cityToRegion(PatientObj, city){
  let placeholder = 0;
   for(index in regionCities){
     if(placeholder < regionCities[index].length)
     placeholder = regionCities[index].length;
   }
   for (index in regionCities){
     for(i = 0; i < placeholder; i++){
       if (city == regionCities[index][i])
         PatientObj.region = index;
       }
     }
   return PatientObj;
}
//Exports module
module.exports = {
   cityToRegion,
   regionCities,
}
