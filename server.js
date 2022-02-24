const express = require('express');
const path = require('path');
const uuid = require('./tools/uuid');
const { readFromFile, readAndAppend,writeToFile } = require('./tools/fsUtils');
const currentNotes = require('./db/db.json');
let notes=currentNotes;
// const api = require('./routes/index.js');

const PORT =  3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for feedback page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);
// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes request
app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// POST Route to post new note
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    readAndAppend(newNote, './db/db.json');
    res.json(`note added successfully 🚀`);
  } else {
    res.error('Error in adding note');
  }
});

app.delete('/api/notes/:id', (req, res) => {
  const noteID = req.params.id;
  console.log(`${req.method} request received to delete a note`);
  res.send("DELETE Request Called");
  if (noteID) {
    for (let i = 0; i < notes.length; i++) {
      if (noteID === notes[i].id) {
        notes.splice(i,1)
        console.log(notes);
        writeToFile('./db/db.json',notes); 
      }
    }
  };
})

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

