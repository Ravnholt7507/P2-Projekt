const express = require('express');
const app = express();
//const fs = require('fs');
const port = 3000;

var solver = 1;

var Stats = {
region1 : {Beds: 267, Staff: 567, Equipment: 109},
region2 : {Beds: 327, Staff: 645, Equipment: 122},
region3 : {Beds: 149, Staff: 322, Equipment: 78},
region4 : {Beds: 23, Staff: 99, Equipment: 16},
region5 : {Beds: 290, Staff: 568, Equipment: 189}
};

var patientlist = [];
patientlist[0] = {name: "Frederik", grade: 2, region: 5};
patientlist[1] = {name: "Patrick", grade: 2, region: 5};
patientlist[2] = {name: "Frederik", grade: 3, region: 4};

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

// app.post('/', (req, res) => {
//     console.log(req.body),
//     res.render('loggedIn.ejs', {Beds: 1, Staff: 2, Equipment: 1});
// });

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
         response.json({ status: "succes", Name: data.iname, Grade: data.igrade, City: data.icity})
});

app.post('/patients', (request, response) => {
    response.json(patientlist);
});

app.get('/patients', (req, res) => {
    res.redirect('/main');
});

app.post('/unadmit', (request, response) => {
    console.log(request.body);
    response.json('Succesfully unadmitted '+ patientlist[request.body.index].name);
    patientlist.splice(request.body.index, 1); // remove patient from list
    console.log(patientlist); //test
});

app.get('/unadmit', (req, res) => {
    res.redirect('/main');
});

app.post('/stats', (req, res) => {
    res.json(Stats);
});

app.get('/stats', (req, res) => {
    res.redirect('/main');
});

app.listen(port);
