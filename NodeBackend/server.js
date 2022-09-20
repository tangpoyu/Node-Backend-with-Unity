const express = require('express');
const keys = require('./config/keys');
const app = express();
const mongoose = require('mongoose')
mongoose.connect(keys.mongoURI,{useNewUrlParser: true, useUnifiedTopology: true});
require('./model/Account')(mongoose);
require('./routes/authenticationRoutes')(app,mongoose)

app.listen(keys.port, ()=>{
    console.log("Listening on " +keys.port)
});
