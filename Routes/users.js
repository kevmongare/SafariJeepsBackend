const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

router.get('/someUser', async (req, res) => {
  try {
    const userAdmin = await User.someUser();
    res.json(userAdmin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch User Details' });
  }
});

router.post('/addUser',async (req, res) => {
  const { username, password } = req.body;
  try {
    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Call your addUser model function
    const result = await User.addUser(username, password);

    res.status(201).json({
      message: 'User created successfully',
      userId: result.insertId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});


router.delete('/deleteUser', async (req, res) => {
  const { username } = req.body;

  try {
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const result = await User.delUser(username);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const user = await User.getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});




// LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.loginUser(username, password);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({ message: 'Login successful', user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
