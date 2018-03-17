var http = require('http');
const express = require('express');
// const morgan = require('morgan');
const path = require('path');
const app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var fs = require('fs');
// var rita = require('rita');
var PythonShell = require('python-shell');

// bodyParser to get posts from $.ajax
app.use(bodyParser.json());

// Serve static assets
app.use(express.static('./dist'));

// Setup logger
// app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// on the POST of the /classify, classify the stuff!
app.post('/classify', classify);

function classify(req, res) {
  var options = {
    scriptPath: './backend',
    args:
    [
      "--user_input=\"" + req.body.userInput + "\"", // the user input from the textfield
    ]
  }
  PythonShell.run('eval_server.py', options, function (err, data) {
    console.log(err);
    console.log(data);
    console.log(JSON.stringify(data[0]));
    if (err) res.send(err);
    res.send(JSON.stringify(data));
  });
}

server = http.createServer(app);

// listening ports
server.listen(9002);
