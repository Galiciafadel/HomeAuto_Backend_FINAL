var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://212.98.137.194:1883',{username:'iotleb',password:'iotleb'});

const topic = 'topic';
const topic1 = 'LAMP';
const topic2 = 'HEATER';

const publishMessage = (topic, message) => {
    client.publish(topic, message);
} 

client.on('connect', () => {
    
    client.subscribe(topic);
    //client.subscribe(topic2);
    
});

const handleMessage = message => {
    console.log(message.value);
}

client.on('message', (topic, message) => {
    console.log("received: " + message.toString());
});