const { promise, reject } = require('bcrypt/promises');
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;



const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM users', (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const someUser = () => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM users WHERE id = 1;', (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const addUser = (username, password) => {
  return new Promise((resolve, reject) => {
    pool.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, password],
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
};

const delUser = (username) => {
  return new Promise((resolve, reject) => {
    pool.query('DELETE FROM users Where username = ?',
      [username],
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
};

const loginUser = async (username, password) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(false); // user not found

      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      resolve(match ? user : false);
    });
  });
};

module.exports = { getAllUsers, loginUser, someUser, addUser,delUser};
