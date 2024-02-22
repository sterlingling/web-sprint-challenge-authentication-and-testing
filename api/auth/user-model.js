const db = require('../../data/dbConfig')

function findById(user_id) {
    return db('users').select('user_id', 'username').where('user_id', user_id).first();
}
async function add(user) {
    // Insert the user into the database
    const [userId] = await db('users').insert(user);
  
    // Retrieve the newly inserted user from the database
    const newUser = await db('users').where('id', userId).first();
  
    return newUser;
  }

// async function add(user) {
//     const [id] = await db('users').insert(user);
//     return findById(id);
// }

module.exports = {
    add,
    findById,
}