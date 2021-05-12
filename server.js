const express = require('express');
const app = express();
//const fs = require('fs');
const port = 3000;


app.set('view-engine', 'ejs');
//app.use(express.urlencoded({ extended: false }));


app.get('/', (req, res) => {
    res.render('loggedIn.ejs', {Beds: 1, Staff: 2, Equipment: 1});
});

app.get('/login', (req, res) => {
    res.render('main.ejs');
});

app.post('/', (req, res) => {
    console.log(req.body),
    res.render('loggedIn.ejs', {Beds: 1, Staff: 2, Equipment: 1});
});

app.use(express.json());
app.post('/api', (request, response) => {
         console.log("I got a request!" + '\n' + 'Name: ' + request.body.iname + ' Grade: ' + request.body.igrade + ' City: ' + request.body.icity);
         const data = request.body;
         response.json({ status: "succes", Name: data.iname, Grade: data.igrade, City: data.icity})
       });

app.listen(port);
