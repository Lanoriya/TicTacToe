const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'TicTacToe',
  password: 'artas',
  port: 5432,
});

const getUsers = () => {
  return new Promise(function(resolve, reject) {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  }) 
}

const createUser = (name, age, gender) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO users (name, age, gender) VALUES ($1, $2, $3) RETURNING *';

    pool.query(query, [name, age, gender], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.rows[0]);
      }
    });
  });
};

const deleteUser = (userId) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM users WHERE id = $1';

    pool.query(query, [userId], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(`User with ID ${userId} has been deleted.`);
      }
    });
  });
};

module.exports = {
  getUsers,
  createUser,
  deleteUser,
}