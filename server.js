const fs = require('fs');
const http = require('http');
const port = 3000;

const server = http.createServer(function(req, res) {

  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    fs.readFile('main.html', function(error, data) {
        if (error) {
            res.writeHead(404);
            res.write('Error: File Not Found');
        } else {
            res.write(data);
        }
        res.end();
    })
  }

  if (req.url === '/loggedIn=true') {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    fs.readFile('loggedIn.html', function(error, data) {
        if (error) {
            res.writeHead(404);
            res.write('Error: File Not Found');
        } else {
            res.write(data);
        }
        res.end();
    })
  }

//    else {
//       res.writeHead(404); 
//       res.write('404 : Could not find path on this server'); 
//       res.end();
//    }


});

server.listen(port, function(error) {
    if (error) {
        console.log('Something went wrong', error);
    } else {
        console.log('Server is listening on port '+ port);
    }
});