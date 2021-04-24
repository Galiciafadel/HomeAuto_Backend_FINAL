const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path=require('path');
var mqtt = require('mqtt');
var passport = require('passport');
require('dotenv/config');


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());

const hostname = 'localhost';
const port = 3444;


//Import Routes
const apartmentsRoutes=require('./routes/apartmentController');
const equipmentRoutes = require('./routes/equipmentController');
const usersRoutes = require('./routes/userController');
const apartmentTypeRoutes=require('./routes/apartmentTypeController');
const equipmentTypeRoutes=require('./routes/equipmentTypeController');
const roomTypeRoutes=require('./routes/roomTypeController');
const roomRoutes=require('./routes/roomController');
const mqttRoutes = require('./routes/mqttController');


http://localhost:3000
app.use('/apartments', apartmentsRoutes);
app.use('/users', usersRoutes);
app.use('/equipment', equipmentRoutes);
app.use('/equipmentType',equipmentTypeRoutes);
app.use('/roomType',roomTypeRoutes);
app.use('/apartmentType',apartmentTypeRoutes);
app.use('/rooms',roomRoutes);
app.use('/mqtt', mqttRoutes);

app.use(express.static(path.join(__dirname,'public')));

//connect to DB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => {
   console.log('connected to DB');
   app.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
   });
});


const Equipment = require('./schemas/equipment');
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://212.98.137.194:1883',{username:'iotleb',password:'iotleb'});

const topic = 'topic';
const topic1 = 'MDP21HomeAuto';
// const topic2 = 'HEATER';

const publishMessage = (topic, message) => {
   client.publish(topic, message);
}

client.on('connect', () => {

   client.subscribe(topic);
   client.subscribe(topic1);

});


const handleMessage = message => {
   console.log(message.value);
}

client.on('message',(myTopic,message)=>{
   if (myTopic == topic1) {
      let resp = JSON.parse(message.toString());
      //console.log("received on topic1: "+ message);
      Equipment.findByIdAndUpdate(resp.equipmentId, {
         $set: {actual : resp.actual}
      }, { new: true })
          .then((equipment) => {
             //console.log("Updated:" + equipment);
          })
          .catch((err) => console.log(err));
   } else {
      console.log("Sent: " + message)
   }

});

