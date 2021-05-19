const express = require('express');
const ejs = require('ejs');
const app = express();
const SolverFlag = require('./SolverFlag')
const SolverNoFlag = require('./SolverNoFlag') 
const branch = require('./branch')
//const fs = require('fs');
const port = 3000;

// let HList = SolverFlag.HospitalList
// console.log(HList)
var solver = 1;
var List = [];

app.set('view-engine', 'ejs');
app.use(express.json());
//app.use(express.urlencoded({ extended: false }));

app.get('/main', (req, res) => {
    res.render('loggedIn.ejs', {solver: solver, Beds: 1, Staff: 2, Equipment: 1});
});

app.get('/', (req, res) => {
    res.render('main.ejs');
});

app.get('/login', (req, res) => {
    res.redirect('/');
});

app.post('/login', (request, response) => {
    const data = request.body;
    console.log(data);
    if ((data.un == "username") && (data.pw == "password")) {
        response.json({status: "succes"});
        response.redirect('/main');
    } else {
        response.json({status: "failure"});
    }
});

app.post('/patients', (request, response) => {
    response.json(List);
});

app.get('/patients', (req, res) => {
    res.redirect('/main');
});

app.post('/unadmit', (request, response) => {
    console.log(request.body);
    response.json('Succesfully unadmitted '+ List[request.body.index].Name);
    List.splice(request.body.index, 1); // remove patient from list
    console.log(List); //test
});

app.get('/unadmit', (req, res) => {
    res.redirect('/main');
});

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

app.post('/solver', (req, res) => {
    const data = req.body;
    console.log(req.body);
    if(data.change == "change") {
        solver = (solver % 2) + 1;
        res.json({ status: "Succes", solver: solver})
    } else {
        res.json({ status: "failure" })
    }
});

app.post('/api', (request, response) => {
         console.log("I got a request!" + '\n' + 'Name: ' + request.body.iname + ' Grade: ' + request.body.igrade + ' City: ' + request.body.icity);
         const data = request.body;
     //    response.json({ status: "succes", Name: data.iname, Grade: data.igrade, City: data.icity})
         let Patient = { Name: data.iname, grading: data.igrade, region: 0, flag: 0 }
         if (solver == 1){
           List = SolverFlag.BatchPatients(Patient, data.icity, List);
           response.json(SolverFlag.PH_array);
           SolverFlag.Delete_PH_array();
         }
         else if (solver == 2){
           List = SolverNoFlag.BatchPatients(Patient, data.icity, List);
           response.json(SolverNoFlag.PH_array);
           SolverNoFlag.Delete_PH_array();
         }
});

app.listen(port);