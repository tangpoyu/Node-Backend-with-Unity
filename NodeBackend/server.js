const express = require('express');
const keys = require('./config/keys');
const app = express();
const mongoose = require('mongoose')
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended : false}));


mongoose.connect(keys.mongoURI,{useNewUrlParser: true, useUnifiedTopology: true});
require('./model/Account.js')(mongoose);
require('./routes/authenticationRoutes.js')(app,mongoose)

app.listen(keys.port, ()=>{
    console.log("Listening on " +keys.port)
});
