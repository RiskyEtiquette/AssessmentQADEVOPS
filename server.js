const express = require("express");
const bots = require("./src/botsData");
const shuffle = require("./src/shuffle");
const path = require("path");
const Rollbar = require("rollbar");


const playerRecord = {
  wins: 0,
  losses: 0,
};

const app = express();
const rollbar = new Rollbar({
  accessToken: 'beada098c9414b0ba40f3508c46af11d',
  captureUncaught: true,
  captureUnhandledRejections: true
});

// Initialize Rollbar error handler
app.use(rollbar.errorHandler());

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Endpoint handler functions
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/endpoint', (req, res) => {
  try {
    // Code for your endpoint
    // Example Rollbar events
    rollbar.info('Endpoint called');
    rollbar.warning('Something unexpected happened');
    rollbar.error('An error occurred');
    rollbar.critical('A critical error occurred');
    res.send('Endpoint response');
  } catch (err) {
    rollbar.error(err);
    res.status(500).send('Internal Server Error');
  }
});
// Add up the total health of all the robots
const calculateTotalHealth = (robots) =>
  robots.reduce((total, { health }) => total + health, 0);

// Add up the total damage of all the attacks of all the robots
const calculateTotalAttack = (robots) =>
  robots
    .map(({ attacks }) =>
      attacks.reduce((total, { damage }) => total + damage, 0)
    )
    .reduce((total, damage) => total + damage, 0);

// Calculate both players' health points after the attacks
const calculateHealthAfterAttack = ({ playerDuo, compDuo }) => {
  const compAttack = calculateTotalAttack(compDuo);
  const playerHealth = calculateTotalHealth(playerDuo);
  const playerAttack = calculateTotalAttack(playerDuo);
  const compHealth = calculateTotalHealth(compDuo);

  return {
    compHealth: compHealth - playerAttack,
    playerHealth: playerHealth - compAttack,
  };
};

app.get("/api/robots", (req, res) => {
  try {
    res.status(200).send(botsArr);
  } catch (error) {
    console.error("ERROR GETTING BOTS", error);
    res.sendStatus(400);
  }
});

app.get("/api/robots/shuffled", (req, res) => {
  try {
    let shuffled = shuffle(bots);
    res.status(200).send(shuffled);
  } catch (error) {
    console.error("ERROR GETTING SHUFFLED BOTS", error);
    res.sendStatus(400);
  }
});

app.post("/api/duel", (req, res) => {
  try {
    const { compDuo, playerDuo } = req.body;

    const { compHealth, playerHealth } = calculateHealthAfterAttack({
      compDuo,
      playerDuo,
    });

    // comparing the total health to determine a winner
    if (compHealth > playerHealth) {
      playerRecord.losses += 1;
      res.status(200).send("You lost!");
    } else {
      playerRecord.losses += 1;
      res.status(200).send("You won!");
    }
  } catch (error) {
    console.log("ERROR DUELING", error);
    res.sendStatus(400);
  }
});

app.get("/api/player", (req, res) => {
  try {
    res.status(200).send(playerRecord);
  } catch (error) {
    console.log("ERROR GETTING PLAYER STATS", error);
    res.sendStatus(400);
  }
});

app.listen(8000, () => {
  console.log(`Listening on 8000`);
});
