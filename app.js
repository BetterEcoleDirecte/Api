const express = require('express')
const app = express()
const parkings = require('./parkings.json')

const axios = require('axios')

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.get('/', (req, res) => {
    
    axios.get('https://api.github.com/repos/BetterEcoleDirecte/Api/commits/main').then((ress) => {
        var latestCommitDate = ress.data.commit.author.date
        res.status(200).json(JSON.parse('{ "code": "200" , "message": "Api is online" , "lastUpdate": "'  + latestCommitDate +'" }'))
    }).catch((err) => { 
        res.status(200).json(JSON.parse('{ "code": "200" , "message": "Api is online" , "lastUpdate": "Error" }'))
        throw err;
    })
})

app.post('/auth/login', (req, res) => {
    if (req.headers['content-type'] == "multipart/form-data" || req.headers['content-type'] == "application/x-www-form-urlencoded" || req.headers['content-type'] == "application/json") {
        if (req.body.username && req.body.password) {
            var username = req.body.username
            var password = req.body.password

            var data = 'data= {'+
            '"identifiant": "' + username + '" , "motdepasse": "' + password + '"}';
            
            axios.post(
                "https://api.ecoledirecte.com/v3/login.awp",
                data
            ).then((apiRes) => {
                
                if (apiRes.data.code == 200) {
                    var accountData = JSON.stringify(apiRes.data.data.accounts[0])
                    res.status(200).json(JSON.parse('{ "code": "200","message": "", "token": "' + apiRes.data.token + '", "account":' + accountData + '}'))
                }else{
                    console.log(JSON.stringify(apiRes.data));
                    res.status(401).json(JSON.parse('{ "code": "401" , "message": "' + apiRes.data.message + '"}'))
                }

            }).catch((e) => {
                res.status(500).json(JSON.parse('{ "code": "500" , "message": "Internal server error : ' + e + '"}'))
            });

        }else{
            res.status(400).json(JSON.parse('{ "code": "400" , "message": "Bad input Need username and password params"}'))
        }
    } else {
        res.status(400).json(JSON.parse('{ "code": "400" , "message": "Bad headers"}'))
    }
    
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

app.get('*', function(req, res){
    res.status(404).json(JSON.parse('{ "code": 404,"message": "Not Found"  }'));
})