const express = require('express')
const app = express()
const parkings = require('./parkings.json')

const axios = require('axios')

app.use(express.json())

app.get('/', (req, res) => {
    
    axios.get('https://api.github.com/repos/BetterEcoleDirecte/Api/commits/main').then((ress) => {
        var latestCommitDate = ress.data.commit.author.date
        res.status(200).json(JSON.parse('{ "code": "200" , "message": "Api is online" , "lastUpdate": "'  + latestCommitDate +'" }'))
    }).catch((err) => { 
        res.status(200).json(JSON.parse('{ "code": "200" , "message": "Api is online" , "lastUpdate": "Error" }'))
        throw err;
    })
})

app.get('/parkings', (req,res) => {
    res.status(200).json(parkings)
})

app.get('/parkings/:id', (req,res) => {
    const id = parseInt(req.params.id)
    const parking = parkings.find(parking => parking.id === id)
    res.status(200).json(parking)
})

app.post('/parkings', (req,res) => {
    parkings.push(req.body)
    res.status(200).json(parkings)
})
app.put('/parkings/:id', (req,res) => {
    const id = parseInt(req.params.id)
    let parking = parkings.find(parking => parking.id === id)
    parking.name =req.body.name,
    parking.city =req.body.city,
    parking.type =req.body.type,
    res.status(200).json(parking)
})

app.delete('/parkings/:id', (req,res) => {
    const id = parseInt(req.params.id)
    let parking = parkings.find(parking => parking.id === id)
    parkings.splice(parkings.indexOf(parking),1)
    res.status(200).json(parkings)
})

app.listen(process.env.PORT || 80, () => {
    console.log("Serveur à l'écoute")
})