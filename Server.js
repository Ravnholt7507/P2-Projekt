// Importing pakages and other files for functionality
const express = require('express');
const ejs = require('ejs');
const app = express();
const SolverFlag = require('./SolverFlag');
const SolverNoFlag = require('./SolverNoFlag'); 
const branch = require('./branch');
const fs = require('fs');

// Port for the server to listen on
const port = 3000;

//Global solver variable is used as a setting -> determines which solver to use
let solver = 1;
let List = [];

//Load Previous 
let GetPreviousPatients = fs.readFileSync('PatientList.json').toString().split('\r\n')
if (GetPreviousPatients != "")
  List = JSON.parse(GetPreviousPatients);

app.set('view-engine', 'ejs');
app.use(express.json());

//Render Html files when url matches
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
  var Index = findPatientIndex(request.body.index);
  if (Index == undefined){
    response.json("Could not find patient");
    return;
  }
  response.json('Succesfully unadmitted '+ List[Index].Name);
  SolverFlag.HospitalTracker(List[Index].region, List[Index].grading, 1)
  List.splice(Index, 1); // remove patient from list
  let JsonList = JSON.stringify(List);
  fs.writeFileSync('PatientList.json', JsonList, (err) => {
    if (err)
      throw err;
  });
});

function findPatientIndex(value) {
    for (index in List) {
        if (List[index].PID == value) {
            return index;
        }
    }
}

app.get('/unadmit', (req, res) => {
    res.redirect('/main');
});

// Functionality for sending statistics about current hospital capacity to client
app.post('/stats', (req, res) => {
    let Stats = {
        region1 : {Beds: SolverFlag.HospitalList[0].Beds, Equipment: SolverFlag.HospitalList[0].eqp, Admitted: SolverFlag.HospitalList[0].admitted},
        region2 : {Beds: SolverFlag.HospitalList[1].Beds, Equipment: SolverFlag.HospitalList[1].eqp, Admitted: SolverFlag.HospitalList[1].admitted},
        region3 : {Beds: SolverFlag.HospitalList[2].Beds, Equipment: SolverFlag.HospitalList[2].eqp, Admitted: SolverFlag.HospitalList[2].admitted},
        region4 : {Beds: SolverFlag.HospitalList[3].Beds, Equipment: SolverFlag.HospitalList[3].eqp, Admitted: SolverFlag.HospitalList[3].admitted},
        region5 : {Beds: SolverFlag.HospitalList[4].Beds, Equipment: SolverFlag.HospitalList[4].eqp, Admitted: SolverFlag.HospitalList[4].admitted}
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
        res.json({ status: "Succes", solver: solver});
    } else if(data.change == "false") {
        res.json({ status: "Succes", solver: solver});
    } else {
        res.json({ status: "failure" });
    }
});

//Inventory management uses Put method when updated hospitallist on the server
app.put('/Inventory', (req, res) =>{
  console.log("i got inventory response");
  const data = req.body;
  console.log(data);
  let From = parseInt(data.From,10);
  let To = parseInt(data.To,10);
  let Amount = parseInt(data.Amount,10);

  if (SolverFlag.HospitalList[From].eqp >= Amount){
    EqpChange(From, To, Amount);
    res.json("Equipment properly changed");
  }
  else if (SolverFlag.HospitalList[From].eqp < Amount)
    res.json("no");
});

// Functionality for when client is submitting a patient
app.post('/api', (request, response) => {
  console.log("I got a request!" + '\n' + 'Name: ' + request.body.iname + ' Grade: ' + request.body.igrade + ' City: ' + request.body.icity);
  const data = request.body;
  let timestamp = Date.now();
  //define a patient Obj given the form data, and verify it. Also converts city to region.
  let Patient = { Name: data.iname, grading: ((request.body.igrade == 0) ? 0 : ((request.body.igrade == 1) ? 1 : ((request.body.igrade == 2) ? 2 : 3))), region: 0, flag: 0, PID: timestamp}
  patient = branch.cityToRegion(Patient, data.icity);
  validatePatientData(Patient);

  //Three Special cases where no patient can be admitted
  if ((Patient.grading == 3) && (SolverFlag.HospitalList[0].Beds == 0 || SolverFlag.HospitalList[0].eqp == 0) && (SolverFlag.HospitalList[1].Beds == 0 || SolverFlag.HospitalList[1].eqp == 0) && (SolverFlag.HospitalList[2].Beds == 0 || SolverFlag.HospitalList[2].eqp == 0) &&
  (SolverFlag.HospitalList[3].Beds == 0 || SolverFlag.HospitalList[3].eqp == 0) && (SolverFlag.HospitalList[4].Beds == 0 || SolverFlag.HospitalList[4].eqp == 0)){
    response.json("no Space or Eqp")
  }

  else if (SolverFlag.HospitalList[0].Beds == 0 && SolverFlag.HospitalList[1].Beds == 0 && SolverFlag.HospitalList[2].Beds == 0 && SolverFlag.HospitalList[3].Beds == 0 && SolverFlag.HospitalList[4].Beds == 0){
    response.json("no Space");
  }
  
  else if (Patient.grading == 3 && SolverFlag.HospitalList[0].eqp == 0 && SolverFlag.HospitalList[1].eqp == 0 && SolverFlag.HospitalList[2].eqp == 0 && SolverFlag.HospitalList[3].eqp == 0 && SolverFlag.HospitalList[4].eqp == 0){
    response.json("no Eqp");
  }
  else{
    //If solver is 1 call the solver with flags, also send array with all affected patients as response to client 
    if (solver == 1){
      List = SolverFlag.BatchPatients(Patient, List);
      let JsonList = JSON.stringify(List);
      fs.writeFileSync('PatientList.json', JsonList, (err) => {
        if (err)
        throw err;
      });
      response.json(SolverFlag.PH_array);
      SolverFlag.Delete_PH_array();
      console.log(List);
    }
    else if (solver == 2){
      //If solver is 2 call the solver with no flags, also send array with all affected patients as response to client 
      List = SolverNoFlag.BatchPatients(Patient, List);
      let JsonList = JSON.stringify(List);
      fs.writeFileSync('PatientList.json', JsonList, (err) => {
        if (err)
        throw err;
      });
      response.json(SolverNoFlag.PH_array);
      SolverNoFlag.Delete_PH_array();
      console.log(List);
    }
  }
});

//Validation of data given on clientside patient form, when admitting patient
function validatePatientData(NewPatient) {
      try {
          if(nameValidation(NewPatient.Name) == false) throw "Patient name";
          if(gradingValidation(NewPatient.grading) == false) throw "Patient grading";
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

//Used to change equipment, is called in inventory management
function EqpChange(From, To, Amount){
  SolverFlag.HospitalList[From].eqp -= Amount;
  SolverFlag.HospitalList[To].eqp += Amount;
  fs.writeFileSync('HospitalList.json', JSON.stringify(SolverFlag.HospitalList), (err) => {
    if (err)
      throw err;
  });
}

app.listen(port);




















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


