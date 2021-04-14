const express = require('express');
const bodyParser = require('body-parser');
var authenticate = require('../authenticate');
const cors = require('./cors');
const mqttRouter = express.Router();
mqttRouter.use(bodyParser.json());
const mqtt = require('mqtt');

const topic = 'topic';


//connect to mqtt
const client = mqtt.connect('mqtt://test.mosquitto.org');
client.on('connect', () => {
   console.log('connected to mqtt');
});


mqttRouter.route('/')
    .post((req, res) => {
        client.publish(topic, 'message from postman: ' + JSON.stringify(req.body));
        res.json(req.body);
    });

module.exports = mqttRouter;