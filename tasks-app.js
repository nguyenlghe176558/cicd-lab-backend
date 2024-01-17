const tracer = require('dd-trace').init();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const mongoose = require('mongoose');

const app = express();
const PORT = 8000;

// MongoDB connection string from environment variable
const MONGODB_URI = `${process.env.MONGODB_URI}`;
// const MONGODB_URI = `mongodb://localhost:27017/`;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Define a MongoDB schema for tasks
const taskSchema = new mongoose.Schema({
  title: String,
  text: String,
});

const Task = mongoose.model('Task', taskSchema);

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});

// const extractAndVerifyToken = async (headers) => {
//   if (!headers.authorization) {
//     throw new Error('No token provided.');
//   }
//   const token = headers.authorization.split(' ')[1];

//   // const response = await axios.get(`http://${process.env.AUTH_ADDRESS}/verify-token/` + token);
//   const response = await axios.get(`http://${process.env.AUTH_ADDRESS}/verify-token/` + token);
//   return response.data.uid;
// };

app.get('/tasks', async (req, res) => {
  try {
    // const uid = await extractAndVerifyToken(req.headers);
    const tasks = await Task.find();
    res.status(200).json({ message: 'Tasks loaded.', tasks });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: err.message || 'Failed to load tasks.' });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    // const uid = await extractAndVerifyToken(req.headers);
    const { title, text } = req.body;
    const task = new Task({ title, text });
    await task.save();
    res.status(201).json({ message: 'Task stored.', createdTask: task });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Could not verify token.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
