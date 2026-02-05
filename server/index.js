const express = require("express");
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const { Mongo_DB_URL, PORT } = require('./src/config/db.config');
const mongoose = require('mongoose');

const http = require("http");
const server = http.createServer(app);

const userRoutes = require ('./src/routes/user.routes');
const providerRoutes = require ('./src/routes/provider.routes');
const availabilityRoutes = require ('./src/routes/availibility.routes')
const serviceRoutes = require ('./src/routes/service.routes')
const appointmentRoutes = require ('./src/routes/appointment.routes')

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, x-access-token");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

app.use ('/auth', userRoutes);
app.use ('/provider', providerRoutes);
app.use ('/availability', availabilityRoutes);
app.use ('/services', serviceRoutes);
app.use ('/appointment', appointmentRoutes);

app.use ((err,req,res,next) => {
    const {statusCode = 500 , message = "Something went wrong"} = err;
    res.status(statusCode).send({
        msg : message
    })
})

app.use (cors());

async function ConnectToDb () {
    try {
      await mongoose.connect (Mongo_DB_URL);
      console.log("Connected to DB");
    } catch (error) {
        console.log ("Connection to DB failed");
        console.log (error);
    }

}

ConnectToDb ();

server.listen (PORT, () => {
    console.log (`Listening to port ${PORT}!`);
})