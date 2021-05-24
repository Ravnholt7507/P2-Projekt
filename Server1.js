// Importing pakages and other files for functionality
const express = require('express');
const ejs = require('ejs');
const app = express();
const SolverFlag = require('./SolverFlag')
const SolverNoFlag = require('./SolverNoFlag') 
const branch = require('./branch')
const fs = require('fs')

// Port for the server to listen on
const port = 3000;

// let HList = SolverFlag.HospitalList
// console.log(HList)
let solver = 1;
let List = [];

List = JSON.parse(fs.readFileSync('PatientList.json').toString().split('\r\n'));

app.set('view-engine', 'ejs');
app.use(express.json());

app.get('/main', (req, res) => {
    res.render('loggedIn.ejs');
});

app.get('/', (req, res) => {
    res.render('main.ejs');
});

app.get('/login', (req, res) => {
    res.redirect('/');
});

// Functionality to send the list of all admitted patients to the client
app.post('/patients', (request, response) => {
    response.json(List);
});

app.get('/patients', (req, res) => {
    res.redirect('/main');
});

// Functionality for when clients requests to unsubmit a patient
app.post('/unadmit', (request, response) => {
    console.log(List[request.body.index]);
    response.json('Succesfully unadmitted '+ List[request.body.index].Name);
    SolverFlag.HospitalTracker(List[request.body.index].region, List[request.body.index].grading, 1)
    List.splice(request.body.index, 1); // remove patient from list
    console.log(List); //test
});

app.get('/unadmit', (req, res) => {
    res.redirect('/main');
});

// Functionality for sending statistics about current hospital capacity to client
app.post('/stats', (req, res) => {
    let Stats = {
        region1 : {Beds: SolverFlag.HospitalList[0].Beds, Staff: SolverFlag.HospitalList[0].staff, Equipment: SolverFlag.HospitalList[0].eqp, Admitted: SolverFlag.HospitalList[0].admitted},
        region2 : {Beds: SolverFlag.HospitalList[1].Beds, Staff: SolverFlag.HospitalList[1].staff, Equipment: SolverFlag.HospitalList[1].eqp, Admitted: SolverFlag.HospitalList[1].admitted},
        region3 : {Beds: SolverFlag.HospitalList[2].Beds, Staff: SolverFlag.HospitalList[2].staff, Equipment: SolverFlag.HospitalList[2].eqp, Admitted: SolverFlag.HospitalList[2].admitted},
        region4 : {Beds: SolverFlag.HospitalList[3].Beds, Staff: SolverFlag.HospitalList[3].staff, Equipment: SolverFlag.HospitalList[3].eqp, Admitted: SolverFlag.HospitalList[3].admitted},
        region5 : {Beds: SolverFlag.HospitalList[4].Beds, Staff: SolverFlag.HospitalList[4].staff, Equipment: SolverFlag.HospitalList[4].eqp, Admitted: SolverFlag.HospitalList[4].admitted}
        };

    res.json(Stats);
});

app.get('/stats', (req, res) => {
    res.redirect('/main');
});

// Functionality for when client requests to change the solver that is being used
app.post('/solver', (req, res) => {
    const data = req.body;
    console.log(req.body);
    if(data.change == "change") {
        solver = (solver % 2) + 1;
        res.json({ status: "Succes", solver: solver})
    } else if(data.change == "false") {
        res.json({ status: "Succes", solver: solver})
    } else {
        res.json({ status: "failure" })
    }
});


// function DeleteFaultyPatientData(arr, List) {
//     for(index in arr) {
//       List.splice(arr[index], 1);
//     }
//   }

// function unadmitPatient(PatientList) {
//     let timeForUnadmitArr = [];
    
//       for(index in List) {
//         if(List[index].PID + 15000 <= Date.now())
//            timeForUnadmitArr.unshift(index); // unshift adds element to the front of array
//     }
//   DeleteFaultyPatientData(timeForUnadmitArr, List); // Reuse of delete function from validatePatientData
// }

// setInterval(unadmitPatient, 10000, List); 
// setInterval( () => console.log(List), 10000); // Test


// Functionality for when client is submitting a patient
app.post('/api', (request, response) => {
         console.log("I got a request!" + '\n' + 'Name: ' + request.body.iname + ' Grade: ' + request.body.igrade + ' City: ' + request.body.icity);
         const data = request.body;
     //    response.json({ status: "succes", Name: data.iname, Grade: data.igrade, City: data.icity})
         let timestamp = Date.now();
         let Patient = { Name: data.iname, grading: ((request.body.igrade == 0) ? 0 : ((request.body.igrade == 1) ? 1 : ((request.body.igrade == 2) ? 2 : 3))), region: 0, flag: 0, PID: timestamp}
         validatePatientData(Patient);
         if (solver == 1){
           List = SolverFlag.BatchPatients(Patient, data.icity, List);

           let JsonList = JSON.stringify(List);

           fs.writeFileSync('PatientList.json', JsonList, (err) => {
             if (err)
               throw err;
           });
           response.json(SolverFlag.PH_array);
           SolverFlag.Delete_PH_array();
           console.log(List)
         }
         else if (solver == 2){
           List = SolverNoFlag.BatchPatients(Patient, data.icity, List);
           response.json(SolverNoFlag.PH_array);
           SolverNoFlag.Delete_PH_array();
         }
});


function validatePatientData(NewPatient) {
      try {
          if(nameValidation(NewPatient.Name) == false) throw "Patient name";
          if(gradingValidation(NewPatient.grading) == false) throw "Patient grading";
//          if(regionValidation(NewPatient.region) == false) throw "Patient region";
      }
      catch(err) {
        let problem = 'Problem with patient ' + NewPatient + ' , specifically ' + err;
        console.error(problem);
        fs.appendFile('./Error.txt', problem + "\n", err => {
          if(err) console.error("Error writing to Error.txt");
        });
    }
}


function nameValidation(Name) {
  return isNaN(Name);
}

function gradingValidation(grading) {
  return (grading == 0 || grading == 1 || grading == 2 || grading == 3);
}

// function regionValidation(region) {
//   return (region == 0 || region == 1 || region == 2 || region == 3 || region == 4);
// }

app.listen(port);
