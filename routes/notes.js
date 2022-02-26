const Router = require('express').Router();
const uuid = require('../tools/uuid');
const { readFromFile, readAndAppend,writeToFile } = require('../tools/fsUtils');

// GET Route for notes request
Router.get('/notes', (req, res) => {
    console.info(`${req.method} request received to update notes`);
    readFromFile('db/db.json').then((data) => res.json(JSON.parse(data)));
  });
  
// POST Route to post new note
Router.post('/notes', (req, res) => {
console.info(`${req.method} request received to add a note`);

const { title, text } = req.body;

if (req.body) {
    const newNote = {
    title,
    text,
    id: uuid(),
    };

    readAndAppend(newNote, 'db/db.json');
    res.json(`note added successfully 🚀`);
} else {
    res.error('Error in adding note');
}
});
  
// DELETE Route to delete  note
Router.delete('/notes/:id', (req, res) => {
const noteID = req.params.id;
console.log(req.params.id);
console.log(`${req.method} request received to delete a note`);
readFromFile('db/db.json').then((data) => {
    console.log(JSON.parse(data));
    res.json(JSON.parse(data))
    let notes = JSON.parse(data);
    for (let i = 0; i < notes.length; i++) {
        if (noteID === notes[i].id) {
            notes.splice(i,1)
            console.log(notes);
            writeToFile('db/db.json',notes); 
            }
    }
});

})
  
module.exports = Router;