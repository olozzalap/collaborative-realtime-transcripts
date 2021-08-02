import request from 'superagent';
import mqtt from 'mqtt';

const LAST_WILL_TOPIC = 'last-will';
const MESSAGE_TOPIC = 'message';
const CLIENT_CONNECTED = 'client-connected';
const CLIENT_DISCONNECTED = 'client-disconnected';

const getNotification = (clientId, username) => JSON.stringify({ clientId, username });

const validateClientConnected = (client) => {
    if (!client) {
        throw new Error("Client is not connected yet. Call client.connect() first!");
    }
};

class RealtimeClient { 
    constructor({
        clientId,
        username,
    }) {
        this.options = {
            will: {
                topic: LAST_WILL_TOPIC,
                payload: getNotification(clientId, username),
            }
        };
        this.clientId = clientId;
        this.username = username;
        this.client = null;
    };

    connect = () => {
        return request('/dev/iot-presigned-url')
            .then(response => {
                this.client = mqtt.connect(response.body.url, this.options);
                this.client.on('connect', () => {
                    console.log('Connected to AWS IoT Broker');
                    this.client.subscribe(MESSAGE_TOPIC);
                    this.client.subscribe(CLIENT_CONNECTED);
                    this.client.subscribe(CLIENT_DISCONNECTED);
                    const connectNotification = getNotification(this.clientId, this.username);
                    this.client.publish(CLIENT_CONNECTED, connectNotification);
                    console.log('Sent message: ${CLIENT_CONNECTED} - ${connectNotification}');
                });
                this.client.on('close', () => {
                    console.log('Connection to AWS IoT Broker closed');
                    this.client.end();
                });
            })
    }
    onConnect = (callback) => {
        validateClientConnected(this.client)
        this.client.on('connect', callback);
        return this;
    };
    onDisconnect = (callback) => {
        validateClientConnected(this.client)
        this.client.on('close', callback);
        return this;
    };
    onMessageReceived = (callback) => {
        validateClientConnected(this.client)
        this.client.on('message', (topic, message) => {
            console.log('Received message: ${topic} - ${message}');
            callback(topic, JSON.parse(message.toString('utf8')));
        });
        return this;
    };
    sendMessage = (message) => {
        validateClientConnected(this.client)
        this.client.publish(MESSAGE_TOPIC, JSON.stringify(message));
        console.log('Sent message: ${MESSAGE_TOPIC} - ${JSON.stringify(message)}');
        return this;
    };
};

export default RealtimeClient;
