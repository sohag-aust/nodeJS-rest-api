// Main File

const express = require('express')
const app = express()

app.listen(4000)

const router = express.Router()

const url = function (req, res, next) {
    console.log('Original URL: ', req.originalUrl)
    next()
}

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/Home.html')
})

router.get('/login', url, function (req, res) {
    res.sendFile(__dirname + '/Login.html')
})

app.get('/about', function (req, res) {
    res.sendFile(__dirname + '/About.html')
})

app.set('view engine', 'ejs')

app.get('/profile/:name', function (req, res) {
    let _name = req.params.name
    let _data = {
        email: 'covid19@gmail.com',
        address: 'wuhan',
        symptoms: ['vomit', 'fever', 'body pain']
    }

    res.render('Profile', { name: _name, data: _data })
})

app.get('/login2', function (req, res) {
    res.render('Login')

    const query = req.query
    console.log('Query String: ', query)
})

const bodyParser = require('body-parser')
const encoder = bodyParser.urlencoded()

app.post('/login2', encoder, function (req, res) {
    console.log('Body: ', req.body)

    const _email = req.body.email
    const _pass = req.body.password

    res.render('Home', { email: _email, pass: _pass })

    const query = req.query
    console.log('Query String: ', query)
})

app.get('/home', function (req, res) {
    res.render('Home')
})

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://avenger:AgRojH24Pmf96j4P@cluster0-adm4t.mongodb.net/tutorial?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => {
    console.log('db connection done !!!')
})

const User = require('./models/users')

app.get('/users', function (req, res) {
    User.find().then(function (data) {
        res.send(data)
    })
})

const jsonParser = bodyParser.json()

app.post('/user', jsonParser, function (req, res) {

    const data = new User({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        email: req.body.email,
        address: req.body.address
    })

    data.save().then(function (result) {
        res.status(201).send(result)
    }).catch(function (err) {
        console.log(err)
    })
})

app.delete('/user/:id', jsonParser, function (req, res) {
    User.deleteOne({ _id: req.params.id })
        .then(function (result) {
            res.status(200).send(result)
        })
        .catch(function (err) {
            console.log(err)
        })
})

app.put('/user/:id', jsonParser, function (req, res) {
    User.updateOne({ _id: req.params.id },

        {
            $set: {
                name: req.body.name,
                email: req.body.email,
                address: req.body.address
            }
        }

    ).then(function (result) {
        res.status(200).send(result)
    })
        .catch(function (err) {
            console.log(err)
        })
})

app.get('/user/:name', function (req, res) {

    let regex = new RegExp(req.params.name, 'i')

    User.find({ name: regex })
        .then(function (result) {
            res.status(200).send(result)
        })
        .catch(function (err) {
            console.log(err)
        })
})

const userJWT = require('./models/userJWT')

const crypto = require('crypto')
const key = 'password'
const algo = 'aes256'
const cipher = crypto.createCipher(algo, key)

const jwt = require('jsonwebtoken')
const jwtkey = 'jwt'

app.post('/register', jsonParser, function (req, res) {
    const encrypted = cipher.update(req.body.password, 'utf8', 'hex') + cipher.final('hex')

    const myData = new userJWT({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        password: encrypted
    })

    myData.save().then(function (result) {
        jwt.sign({ result }, jwtkey, { expiresIn: '10h' }, function (err, token) {
            if (err) console.log(err)
            else {
                res.status(201).json({ token })
            }
        })

    }).catch(function (err) {
        console.log(err)
    })
})

app.post('/mylogin', jsonParser, function (req, res) {
    userJWT.findOne({ email: req.body.email })
        .then(function (data) {

            let decipher = crypto.createDecipher(algo, key)
            let decrypted = decipher.update(data.password, 'hex', 'utf8') + decipher.final('utf8')

            console.log('Decrypted Password: ', decrypted)

            if (decrypted == req.body.password) {

                jwt.sign({ data }, jwtkey, { expiresIn: '10h' }, function (err, token) {
                    if (err) console.log(err)
                    else {
                        res.status(200).json({ token })
                    }
                })
            }
        })
        .catch(function (err) {
            console.log(err)
        })
})

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization']

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ')

        req.token = bearer[1]

        jwt.verify(req.token, jwtkey, function (err, authData) {
            if (err) res.send({ result: err })
            else {
                next()
            }
        })
    }
    else {
        res.send({ 'result': 'Token not provided' })
    }
}

app.get('/allUser', verifyToken, function (req, res) {
    User.find()
        .then(function (result) {
            res.status(200).send(result)
        })
})
