// app.js
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();  // Import sqlite3 module



const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

let db = new sqlite3.Database('/volumes/blog_data/articles.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
// let db = new sqlite3.Database('./articles.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the articles database.');
});

db.run(`CREATE TABLE IF NOT EXISTS articles(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    date TEXT
)`, (err) => {
    if (err) {
        console.log(err);
    }
});

app.get('/download', function(req, res){
    // check if the user is logged in
    if (!req.session.loggedin) {
        res.send('Please login to view this page!');
        return;
    }
    
    // define the path to the database file
    const dbPath = path.resolve(__dirname, '/volumes/blog_data/articles.db');

    // check if the file exists
    fs.access(dbPath, fs.constants.F_OK, (err) => {
        // file doesn't exist
        if (err) {
            console.error('Database file does not exist!');
            res.status(404).send('File not found!');
            return;
        }

        // file exists, download it
        res.download(dbPath);
    });
});

app.get('/', function(req, res) {
    db.all('SELECT * FROM articles ORDER BY id DESC', [], (err, rows) => {
        if (err) {
            throw err;
        }
        console.log(rows); // log the fetched articles
        res.render('index', {articles: rows});
    });
});

// Define the /delete route
app.post('/delete', (req, res) => {
    const id = req.body.id;
    db.run('DELETE FROM articles WHERE id = ?', id, (err) => {
        if(err) {
            console.log(err.message);
            return res.send(err.message);
        }
        res.redirect('/admin');
    });
});

app.post('/edit/:id', (req, res) => {
    if (req.session.loggedin) {
        const id = req.params.id;
        const { title, content } = req.body;
        db.run('UPDATE articles SET title = ?, content = ? WHERE id = ?', [title, content, id], (err) => {
            if (err) {
                console.error(err.message);
            }
            res.redirect('/admin');
        });
    } else {
        res.send('Please login to view this page!');
    }
});


app.get('/edit/:id', (req, res) => {
    if (req.session.loggedin) {
        const id = req.params.id;
        db.get('SELECT * FROM articles WHERE id = ?', id, (err, article) => {
            if (err) {
                console.error(err.message);
            }
            res.render('edit', { article: article });
        });
    } else {
        res.send('Please login to view this page!');
    }
});


app.get('/admin', function(request, response) {
    if (request.session.loggedin) {
        let sql = `SELECT * FROM articles ORDER BY id DESC`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            response.render('admin', { articles: rows });
        });
    } else {
        response.redirect('/login');
    }
});

app.post('/admin', function(request, response) {
    console.log(request.session);  // add this line
    if (request.session.loggedin) {
        const title = request.body.title;
        const content = request.body.content;

        // get the current date and time
        const now = new Date();
        
        // format the date and time as a string
        const date = now.toLocaleString();

        // Insert article into the database
        db.run(`INSERT INTO articles(title, content, date) VALUES(?, ?, ?)`, [title, content, date], (err) => {
            if (err) {
                return console.error(err.message);
                response.status(500).send(err.message);
            }
            console.log('Article saved to the database.');
        });

        response.redirect('/admin');
    } else {
        response.send('Please login to view this page!');
    }
});


app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', function(request, response) {
    const username = request.body.username;
    const password = request.body.password;
    
    console.log('Login request received:', username, password); // Add this line

    if (username && password) {
        if (username === 'YOUR-ADMIN-USERNAME' && password === 'YOUR-ADMIN-PASSWORD') {
            request.session.loggedin = true;
            request.session.username = username;
            console.log('Session after setting:', request.session);  // add this line to debug
            response.redirect('/admin');
        } else {
            response.send('Incorrect Username and/or Password!');
        }       
    } else {
      response.send('Please enter Username and Password!');
      response.end();
    }
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
