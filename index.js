const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const jwt = require('./jwt')
const defaultVal = require('./defaultvalues.js');
const fs = require('fs');
const makeAdmin = require('./makeAdmin');


app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/getJWT', function (req, res) {
    
    jwt.getJWT(req.body,  function(resp)
    {
        console.log(resp);
        res.send(resp);
    });
    
    
  })

app.get('/getDefaultValues', function(req, res){
    
    var ret = defaultVal.data;
    var test = fs.existsSync(__dirname + '/certs/privatekey.pem')
    if(fs.existsSync(__dirname + '/certs/privatekey.pem')){
      cert_temp = fs.readFileSync(__dirname + '/certs/privatekey.pem')
      if(cert_temp){
        cert =cert_temp.toString();
        defaultVal.data.key = cert;
      }
    }

    res.send(defaultVal.data);
})


app.post('/makeAdmin', function(req, res){
    
    
    makeAdmin.setAdmin(req.body, function(result){
      res.send(defaultVal.data);
    })
    
})
app.listen(3000)
