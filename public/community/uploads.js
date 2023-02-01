const express = require('express')
const formidable = require('formidable')
const app = express()
const newPostformElm = document.querySelector('#postaddbtn')

app.get('/', (req, res) => {
    res.send(__dirname + '/community/index.html')
})

app.post('/', (req, res) => {
    const form = new formidable.IncomingForm()

    form.parse(req)

    form.on('fileBegin', function (name, file) {
        file.path = __dirname + '/community/uploads/' + file.name
    })

    form.on('file', function (name, file) {
        console.log("Uploaded file" + file.name)
    })

    res.send("Files Uploaded")
})

// app.listen(8080, () => {
//     console.log("App is running on Port 8080")
// })

