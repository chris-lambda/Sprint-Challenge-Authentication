const axios = require('axios');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');


const { authenticate } = require('./middlewares');
const db = require('../database/dbConfig');

const key = require('../_secrets/keys')

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

const generateToken = (user) => {

  const payload = {
      subject: user.userId,
      username: user.username,
  }

  const secret = key.jwtKey;
  const options = {
      expiresIn: '1h'
  }

  return jwt.sign(payload, secret, options)
}

function register(req, res) {
  // implement user registration
  const creds = req.body;

    if(!creds.username || !creds.password) {
        res.status(422).json({message: 'username and password both required'});
        return;
    }
    creds.password = bcrypt.hashSync(creds.password, 8);

    db('users')
        .insert(creds)
        .then(ids => {
            const token = generateToken(creds);
            res.status(201).json({ids, token})
        })
        .catch(err => res.json(err));
}

function login(req, res) {
  // implement user login
  const creds = req.body;

    if(!creds.username || !creds.password) {
        res.status(422).json({message: 'username and password both required'});
        return;
    }

    db('users').where({username: creds.username}).first()
    .then(user => {
        if (user && bcrypt.compareSync(creds.password, user.password)){
            const token = generateToken(user);
            res.status(200).json({message: 'success', token})
        } else {
            res.status(401).json({ message: 'error loggin in' });
        }
    })
    .catch(err => res.json(err))
}

function getJokes(req, res) {
  axios
    .get(
      'https://safe-falls-22549.herokuapp.com/random_ten'
    )
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
