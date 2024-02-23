const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');
const User = require('./user-model')
router.post('/register', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Check if username or password is missing
    if (!username || !password) {
      return res.status(400).json({ message: "username and password required" });
    }

    // Check if username is already taken
    const existingUser = await User.findBy({ username }).first();
    if (existingUser) {
      return res.status(400).json({ message: "username taken" });
    }

    // Hash the password
    const hash = bcrypt.hashSync(password, 8);

    // Add the new user to the database
    const newUser = await User.add({ username, password: hash });
console.log(newUser);
    // Respond with the new user's information
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */


router.post('/login', async(req, res) => {
  const { username, password } = req.body;

  try {
    // Check if username or password is missing
    if (!username || !password) {
      return res.status(400).json({ message: "username and password required" });
    }

    // Find user by username
    const user = await User.findBy({ username }).first();
    if (!user) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    // Check if password is correct
    const passwordValid = bcrypt.compareSync(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({
      userId: user.id,
      username: user.username,
    }, JWT_SECRET, { expiresIn: '1h' });

    // Respond with success message and token
    res.status(200).json({
      message: `welcome, ${user.username}`,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

module.exports = router;