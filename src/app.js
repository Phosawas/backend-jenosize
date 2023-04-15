// const express = require('express')
import express from 'express'
const app = express()
const port = 5000
import dotenv from 'dotenv'
import axios, { isCancel, AxiosError } from 'axios';
import { game24, getRestaurant, botXOGameMove } from './controller/jenosize.js';
import './config/firebase-config.js';
import middleware from'./middleware/index.js';
import cors from "cors"
// const bodyParser = require('body-parser');
import bodyParser from "body-parser"

dotenv.config()
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/restaurant', async (req, res, next) => {
  getRestaurant(req, res, next)
})

app.get('/game24', async (req, res, next) => {
  game24(req, res, next)
})

// Handle POST requests to /api/move endpoint
app.post('/api/move', bodyParser.json(), (req, res) => {
  botXOGameMove(req, res)
})

app.use(middleware.decodeToken);
app.get('/api/tasks', (req, res) => {
  return res.json({
    tasks: [
      { title: 'Task1', },
      { title: 'Task2', },
    ],
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})