const bcrypt = require('bcrypt');

const password = 'AdminSafariJeeps'; // your predefined password
const SALT_ROUNDS = 10;

bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
  if (err) throw err;
  console.log('Hashed password:', hash);
});
