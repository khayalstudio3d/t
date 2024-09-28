const express = require('express');
const cors = require('cors'); // For handling cross-origin requests
const bodyParser = require('body-parser'); // Middleware for parsing request body
const mysql = require('mysql');

const app = express();
const PORT = 443;

// Middleware to parse incoming JSON and handle CORS
app.use(cors());
app.use(bodyParser.json()); // Parse JSON bodies

// Sample data (like a mock database)
// const users = [
//     { id: '12345', username: 'JohnDoe' },
//     { id: '67890', username: 'JaneDoe' },
// ];
const db = mysql.createConnection({
    host: 'sv1628.hstgr.io',  // Your MySQL host
    user: 'u309289193_t',        // Your MySQL username
    password: 'ghA32fg$', // Your MySQL password
    database: 'u309289193_t', 
    port : 3306,  // Your MySQL database name
  });
  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
  });
  
// POST route to handle login by ID
app.post('/login', (req, res) => {
    const { id } = req.body; // Destructure 'id' from the request body

    // Check if the ID exists in the sample database
    //const query = 'SELECT * FROM users WHERE id = ?';
  
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
      if (err) {
        console.error('Error querying MySQL:', err);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
      }
  
      if (results.length > 0) {
        // Login successful
        res.json({
          success: true, // Returning true for a successful login
          message: 'Login successful!',
          user: {
            id: results[0].id,
            username: results[0].username,
            privileges : results[0].privileges,
          },
        });
      } else {
        // User with this ID does not exist
        res.json({ success: false, message: 'User not found.' });
      }
    });
  });
  app.get('/dashboard', (req, res) => {
    const id = req.query.id; // This will fetch the 'id' from the query parameters
    console.log('User ID:', id);
    db.query('SELECT * FROM tasks JOIN users ON tasks.userid = ?', [id], (err, results) => {
        if (err) {
          console.error('Error querying MySQL:', err);
          return res.status(500).json({ success: false, message: 'Internal server error.' });
        }
          // console.log(id);
          
        if (results.length > 0) {
          // Login successful
          res.json({
            success: true, // Returning true for a successful login
            message: 'Login successful!',
            results
            ,
          });
        } else {
          // User with this ID does not exist
          res.json({ success: false, message: 'User not found.' });
        }
      });
    // Do something with the id, like fetching tasks for this user
    
  });
  app.put('/dashboard', (req, res) => {
    const id = req.query.id; // This will fetch the 'id' from the query parameters
    const task_id = req.query.task_id;
    const task_status = req.query.task_status;
    console.log('User ID:', id);
    db.query('UPDATE tasks SET task_status = ? WHERE task_id =? ', [task_status,task_id], (err, results) => {
        console.log(task_status,task_id,id);
        
        console.log(results);
        
        if (err) {
          console.error('Error querying MySQL:', err);
          return res.status(500).json({ success: false, message: 'Internal server error.' });
        }
          // console.log(id);
          
        if (results.length > 0) {
          // Login successful
          res.json({
            success: true, // Returning true for a successful login
            message: 'update successful!',
            results
            ,
          });
        } else {
          // User with this ID does not exist
          res.json({ success: false, message: 'User not found.' });
        }
      });
    });
//       app.get('/dashboard', (req, res) => {
//     const id = req.query.id; // This will fetch the 'id' from the query parameters
//     console.log('User ID:', id);
//     db.query('SELECT * FROM tasks JOIN users ON tasks.userid = ?', [id], (err, results) => {
//         if (err) {
//           console.error('Error querying MySQL:', err);
//           return res.status(500).json({ success: false, message: 'Internal server error.' });
//         }
//           // console.log(id);
          
//         if (results.length > 0) {
//           // Login successful
//           res.json({
//             success: true, // Returning true for a successful login
//             message: 'Login successful!',
//             results
//             ,
//           });
//         } else {
//           // User with this ID does not exist
//           res.json({ success: false, message: 'User not found.' });
//         }
//       });
     
//     // Do something with the id, like fetching tasks for this user
    
//   });
  app.get('/tasks', (req, res) => {
        
    db.query('SELECT * FROM tasks JOIN users on tasks.userid = users.id ',  (err, results) => {
        if (err) {
          console.error('Error querying MySQL:', err);
          return res.status(500).json({ success: false, message: 'Internal server error.' });
        }
          // console.log(id);
          
        if (results.length > 0) {
          // Login successful
          res.json({
           results
            
          });
        } else {
          // User with this ID does not exist
          res.json({ success: false, message: 'User not found.' });
        }
      });});
      app.get('/users', (req, res) => {
        
        db.query('SELECT * FROM users ',  (err, results) => {
            if (err) {
              console.error('Error querying MySQL:', err);
              return res.status(500).json({ success: false, message: 'Internal server error.' });
            }
              // console.log(id);
              
            if (results.length > 0) {
              // Login successful
              res.json({
               results
                
              });
            } else {
              // User with this ID does not exist
              res.json({ success: false, message: 'User not found.' });
            }
          });});
          
    app.post('/login', (req, res) => {
        const { id } = req.body; // Destructure 'id' from the request body
    
        // Check if the ID exists in the sample database
        //const query = 'SELECT * FROM users WHERE id = ?';
      
        db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
          if (err) {
            console.error('Error querying MySQL:', err);
            return res.status(500).json({ success: false, message: 'Internal server error.' });
          }
      
          if (results.length > 0) {
            // Login successful
            res.json({
              success: true, // Returning true for a successful login
              message: 'Login successful!',
              user: {
                id: results[0].id,
                username: results[0].username,
                privileges : results[0].privileges,
              },
            });
          } else {
            // User with this ID does not exist
            res.json({ success: false, message: 'User not found.' });
          }
        });
      });
     
          app.post('/create-task', (req, res) => {
            const {userid} = req.body;
                const {task_name} = req.body;
                const {task_status} = req.body;
                const values = [userid,task_name,task_status]
            db.query('INSERT INTO tasks (userid, task_name, task_status) VALUES (?)',[values] , (err, results) => {
            
                if (err) {
                  console.error('Error querying MySQL:', err);
                  return res.status(500).json({ success: false, message: 'Internal server error.' });
                }
                  // console.log(id);
                  
                if (results.length > 0) {
                  // Login successful
                  res.json({
                   results
                    
                  });
                } else {
                  // User with this ID does not exist
                  res.json({ success: false, message: 'User not found.' });
                }
              });
            });

//   app.get('/dashboard', (req, res) => {
//     const { id } = req.body; // Destructure 'id' from the request body
//     console.log(id);

    
  
//     db.query('SELECT * FROM tasks JOIN users ON tasks.userid = ?', [id], (err, results) => {
//       if (err) {
//         console.error('Error querying MySQL:', err);
//         return res.status(500).json({ success: false, message: 'Internal server error.' });
//       }
//         // console.log(id);
        
//       if (results.length > 0) {
//         // Login successful
//         res.json({
//           success: true, // Returning true for a successful login
//           message: 'Login successful!',
//           results
//           ,
//         });
//       } else {
//         // User with this ID does not exist
//         res.json({ success: false, message: 'User not found.' });
//       }
//     });
//   });

   

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})
