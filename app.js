const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// load dotenv to read environment variables
require("dotenv").config();

// template view engine
app.set("view engine", "ejs");

// Serve Static Files
app.use(express.static("public"));

//routes
const dashboardRouter = require("./routes/dashboard");

app.get("/mqttConnDetails", (req, res) => {
  res.send(
    JSON.stringify({
      mqttServer: process.env.MQTT_BROKER,
      mqttTopic: process.env.MQTT_TOPIC,
      mqttUsername: process.env.MQTT_USERNAME,
      mqttPassword: process.env.MQTT_PASSWORD,
    })
  );
});

app.get("/", dashboardRouter);

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;