const express = require('express');
const app = express();
//const fs = require('fs');
const port = 3000;

var solver = 1;

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

app.listen(port);
