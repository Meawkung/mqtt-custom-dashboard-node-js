export class MQTTService {
  constructor(host,clientid,username,password,messageCallbacks) {
    this.mqttClient = null;
    this.host = host;
    this.clientid = clientid;
    this.username = username;
    this.password = password;
    this.messageCallbacks = messageCallbacks;
  }

  connect() {
    this.mqttClient = mqtt.connect(this.host,
    {
      clientId: this.clientid,
      username: this.username,
      password: this.password
    }
    );

    // MQTT Callback for 'error' event
    this.mqttClient.on("error", (err) => {
      console.log(err);
      this.mqttClient.end();
      if (this.messageCallbacks && this.messageCallbacks.onError)
        this.messageCallbacks.onError(err);
    });

    // MQTT Callback for 'connect' event
    this.mqttClient.on("connect", () => {
      console.log(`MQTT client connected`);
      if (this.messageCallbacks && this.messageCallbacks.onConnect) {
        this.messageCallbacks.onConnect("Connected");
      }
    });

    // Call the message callback function when message arrived
    this.mqttClient.on("message", (topic, message) => {
      if (this.messageCallbacks && this.messageCallbacks.onMessage) {
        this.messageCallbacks.onMessage(topic, message);
      }
    });

    this.mqttClient.on("close", () => {
      console.log(`MQTT client disconnected`);
      if (this.messageCallbacks && this.messageCallbacks.onClose)
        this.messageCallbacks.onClose();
    });
  }

  // Publish MQTT Message
  publish(topic, message, options) {
    this.mqttClient.publish(topic, message);
  }

  // Subscribe to MQTT Message
  subscribe(topic, options) {
    this.mqttClient.subscribe(topic, options);
  }
}
