
// this function calls several functions
function startSystem(){
    // this should start it all...at some point!

}

// checks if the patient is in a serious case needing asap treatment (1) (0)
function patientGrade(gradeBool){
   if(gradeBool == 0){
      console.log('The grade evaluates to 0: Starting up AllocateHome');
   }else if(gradeBool == 1) {
       console.log('The grade evaluates to 1: Serious case:');
       console.log('Calling medical equipment function');
       //call medicalEquip
   }
}

// takes in a bool between (0) and (1) , if there is available equipment
function medicalEquip(HasEquipBool){
   if(HasEquipBool == 1){
      console.log('There is enough equipment, calling BedAllocation function'); 
      //call BedAllocation
   }else if(HasEquipBool == 0){

   }
}

function BedAllocation(SpaceBool){
    if(SpaceBool == 1){
       console.log('Equipment & Space available');
       // check database
    }
}

function staffAvailable(StaffBool){

}

// we're diving this function below into 5 regions (1-5)
// the function will check all regions in regards to capacity, staff, equipment
function CheckRegion(Number){
  
}

// create a server and write to html
const http = require('http');
const fs = require('fs');
const port = 3000;


const server = http.createServer(function(req,res){
    res.writeHead(200,{'Content-type': 'text/html'})
    fs.readFileSync('./projekt.html',function(error,dataSample){
        if(error){
            res.writeHead(404);
            res.write('Error: cannot read the file');
        }else {
          res.write(dataSample);
        }
    })
    res.end();
})
server.listen(port,function(error){
    if(error){
        console.log('something went wrong', error);
    }else {
        console.log('Server is listening on port ' + port);
    }
})



// read a file
 let Data = fs.readFile('./projekt.json','utf8',(err,data) => {
     if(err){
         console.log(err);
     }else {
         console.log('Can read the file');
     }
 });

 let NamesAndGradeLvl = JSON.parse(Data);
 console.log(NamesAndGradeLvl);

// this function will add a name and a grade (0-1) 
//  where the last grade will display how serious their illness is 
function addPatient(request,response){
      let data = request.params;
      let name = data.name;
      let grade = getRandomInt(2);
      let reply;
      if(!grade){
          reply = {
             msg: 'The grade is needed'
          }
      }else {
          NamesAndGradeLvl[name] = grade;
          let data = JSON.stringify(NamesAndGradeLvl,null,2);
          fs.writeFile('projekt.json', NamesAndGradeLvl, finished);
          function finished(err){
              console.log('all ready for extraction');
          }
      }
}



// // returns a random number between 0 and 1
function getRandomInt(max){
   return Math.floor(Math.random() * Math.floor(max));
}
