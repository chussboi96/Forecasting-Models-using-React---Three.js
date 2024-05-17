const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();

const fs = require('fs');
const filePath = 'C:/Users/HAMMAD/Desktop/data/forecast_ets.csv';

fs.access(filePath, fs.constants.F_OK, (err) => {
  if (err) {
    console.error(`${filePath} does not exist`);
  } else {
    console.log(`${filePath} exists`);
  }
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

app.get('/api/data', (req, res) => {
  const dataPath = path.resolve(__dirname, "data.csv"); 
  res.sendFile(dataPath);
});

app.get('/api/ets_forecast', (req, res) => {
  const dataPath = path.resolve(__dirname, "C:/Users/HAMMAD/Desktop/data/forecast_ets.csv");
  console.log(`Sending file from path: ${dataPath}`); 
  res.sendFile(dataPath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(404).send("File not found");
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
