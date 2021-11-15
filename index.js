const express = require("express");
const app = express();
const dfff = require("dialogflow-fulfillment");
const { response } = require("express");
const request = require("request");
require("dotenv").config();
const weatherApiKey = process.env.WEATHER_API_KEY;

app.get("/", (req, res) => {
  res.send("We are live");
});

app.post("/", express.json(), (req, res) => {
  const agent = new dfff.WebhookClient({
    request: req,
    response: res,
  });

  function greeting(agent) {
    agent.add(
      "Hello! This is ultimate.ai Virtual agent. Which city are you looking for today?!"
    );
  }

  async function demo(agent) {
    // agent.add("Sending response from Webhook");
    const city = agent.parameters.city;
    // agent.add(city);
    var weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}`;
    var weatherData = await getWeather(weatherUrl);
    // console.log(weatherData);
    agent.add(weatherData);
  }

  var intentMap = new Map();
  intentMap.set("destination", demo);
  intentMap.set("initial", greeting);

  agent.handleRequest(intentMap);
});

function getWeather(url) {
  return new Promise((resolve, reject) => {
    request(url, function (err, response, body) {
      if (err) {
        console.log("error:", err);
      } else {
        let weather = JSON.parse(body);
        let dados = `What a destination! The temp. at ${weather.name} now is: ${weather.main.temp}ºC and humidity is: ${weather.main.humidity}%`;

        resolve(dados);
      }
    });
  });
}

app.listen(3000, () => console.log("Server is live at port 3000"));
