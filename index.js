const express = require('express')

const app = express()

app.listen(3000, () => {
    console.log('Hearing from server with port 3000')
})

let notes = [
    {
        id:1,
        title:'Note - 1',
        description:'Description - 1'
    },
    {
        id:2,
        title:'Note - 2',
        description:'Description - 2'
    },
    {
        id:3,
        title:'Note - 3',
        description:'Description - 3'
    }
]

app.get('/', (req, res) => {  

    res.send('This is our HomePage...')
    console.log('Request URL value: ', req.url)
})

app.get('/hello/:name', (req, res) => {

    const name = req.params.name
    console.log('name: ', name)
    res.send('Hello '+ name)
})

app.get('/notes', (req, res) => {
    res.send(JSON.stringify(notes))
})

app.get('/notes/:noteId', (req, res) => {
    const noteId = parseInt(req.params.noteId)
    const note = notes.find(note => note.id === noteId)

    if(note){
        res.send(note)
    }else{
        res.send('Note not found !!')
    }
})

