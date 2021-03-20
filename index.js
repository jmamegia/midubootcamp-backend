/* eslint-disable eqeqeq */
const express = require('express')
const cors = require('cors')

let notes = require('./notes.json')
const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('<h1>Hi</h1>')
})

// api
app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id
  const note = notes.find((note) => note.id == id)
  note ? res.json(note) : res.status(404).end()
})

app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id
  const note = notes.find((note) => note.id == id)
  if (note) {
    notes = notes.filter((note) => note.id != id)
    res.status(204).end()
  } else res.status(404).end()
})

app.post('/api/notes', (req, res) => {
  let note = req.body
  if (!note || !note.content) { res.status(400).json({ error: 'Void fields' }) } else {
    note = {
      id: parseInt(notes.length + 100),
      ...note,
      important: note.important || false,
      date: new Date().toISOString()
    }
    try {
      notes = [...notes, note]
      res.status(201).json(note)
    } catch {
      res.status(400).json({ error: 'server error' })
    }
  }
})

app.use((req, res) => {
  res.status(404).json({ error: 'Page not found' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server on port : ${PORT}`))
