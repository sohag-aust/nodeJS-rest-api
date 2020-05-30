const express = require('express')
const app = express()

app.listen(4000)

const router = express.Router()

// Middleware : it should be put as the second parameter
const url = function(req, res, next){
    console.log('Original URL: ', req.originalUrl)
    next()
}


app.get('/', function(req, res){
    //res.send('This is my HomePage !!!')
    
    //sending html page as response
    res.sendFile(__dirname + '/Home.html')
})

router.get('/login', url, function(req, res){ // attached middleware for login routing
    //res.send('This is my LoginPage !!!')

    res.sendFile(__dirname + '/Login.html')
})

// router.get('/register', url, function(req, res){ // attached middleware for register routing
//     res.send('This is my RegistrationPage !!!')
// })

app.get('/about', function(req, res){
    //res.send('This is my AboutPage !!!')

    res.sendFile(__dirname + '/About.html')
})


// template engine -> ejs
// install ejs: npm i ejs

app.set('view engine', 'ejs')

app.get('/profile/:name', function(req, res){ 
    let _name = req.params.name
    let _data = {
        email:'covid19@gmail.com',
        address:'wuhan',
        symptoms:['vomit', 'fever', 'body pain']
    }

    res.render('Profile', {name:_name, data:_data}) // profile page is resides in views folder
    // passing dynamic content to the webpage
})

app.get('/login2', function(req, res){ 
    res.render('Login')
    
    // getting query string
    const query = req.query
    console.log('Query String: ', query)
})

const bodyParser = require('body-parser')
const encoder = bodyParser.urlencoded()

app.post('/login2', encoder, function(req, res){  // for this we need body parser package. install: npm i body-parser, it works as a middleware
    console.log('Body: ', req.body)

    const _email = req.body.email
    const _pass = req.body.password

    // passing query string info to the HomePage
    res.render('Home', {email:_email, pass:_pass})
    
    // getting query string
    const query = req.query
    console.log('Query String: ', query)
})

app.get('/home', function(req, res){ 
    res.render('Home')
})

// connection of DB
// mongo user: avenger
// mongo pass: AgRojH24Pmf96j4P

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://avenger:AgRojH24Pmf96j4P@cluster0-adm4t.mongodb.net/tutorial?retryWrites=true&w=majority',
{
    useNewUrlParser:true,
    useUnifiedTopology:true
}
).then( () => {
    console.log('db connection done !!!')
})


// getting users from mongo
const User = require('./models/users')

// insert data from table
// const data = new User({
//     _id:new mongoose.Types.ObjectId,
//     name:'Ashik',
//     email:'ashik71@gmail.com',
//     address:'Khulna'
// })

// data.save().then( function(result) {
//     console.log(result)
// }).catch(function(err){
//     console.log(err)
// })

// getting data from table
// User.find({}, function(err, users){
//     if(err) console.log('Error')
//     else console.log(users)
// })


// @GetMapping
app.get('/users', function(req, res){
    User.find().then( function(data){
        res.send(data)
    })

    // User.find().select('name').then( function(data){ // if we only want to get user_name. we can also get any individual info by putting the identification
    //     res.send(data)
    // })
})

const jsonParser = bodyParser.json()

// @PostMapping
app.post('/user', jsonParser, function(req, res){
    //res.send('user is created !!')

    const data = new User({
        _id:new mongoose.Types.ObjectId,
        name:req.body.name,
        email:req.body.email,
        address:req.body.address
    })

    data.save().then( function(result) {
        res.status(201).send(result) // 201 : create status
    }).catch(function(err){
        console.log(err)
    })
})


// @DeleteMapping
app.delete('/user/:id', jsonParser, function(req, res){
    User.deleteOne({_id:req.params.id})
        .then(function(result) {
            res.status(200).send(result)
        })
        .catch(function(err){
            console.log(err)
        })
})


// @PutMapping
app.put('/user/:id', jsonParser, function(req, res){
    User.updateOne({_id:req.params.id}, 

        {
            $set:{
                name:req.body.name,
                email:req.body.email,
                address:req.body.address
            }
        }

        ).then(function(result) {
            res.status(200).send(result)
        })
        .catch(function(err){
            console.log(err)
        })
})


// search API... if we place 's' in the name param, then it shows all the data that contains 's' in the name
app.get('/user/:name', function(req, res){
    
    let regex = new RegExp(req.params.name, 'i') // accepts all the letter like small and capital

    User.find({name:regex})
        .then(function(result) {
            res.status(200).send(result)
        })
        .catch(function(err){
            console.log(err)
        })
})


// JWT authentication starts ......
const userJWT = require('./models/userJWT')

// password encryption
const crypto = require('crypto')
const key='password'
const algo='aes256'
const cipher = crypto.createCipher(algo, key)

// JWT
const jwt = require('jsonwebtoken')
const jwtkey = 'jwt'

app.post('/register', jsonParser, function(req, res){
    const encrypted = cipher.update(req.body.password, 'utf8', 'hex') + cipher.final('hex')
    
    //console.log('Encrypted Password: ', encrypted)

    const myData = new userJWT({
        _id:new mongoose.Types.ObjectId,
        name:req.body.name,
        email:req.body.email,
        address:req.body.address,
        password:encrypted
    })

    myData.save().then( function(result) {
        jwt.sign({result}, jwtkey, {expiresIn:'10h'}, function(err, token){
            if(err) console.log(err)
            else{
                res.status(201).json({token})
            }
        })

    }).catch(function(err){
        console.log(err)
    })
})


// Authentication
app.post('/mylogin', jsonParser, function(req, res){
    userJWT.findOne({email:req.body.email})
        .then(function(data) {

            let decipher = crypto.createDecipher(algo, key)
            let decrypted = decipher.update(data.password, 'hex', 'utf8') + decipher.final('utf8')
            
            console.log('Decrypted Password: ', decrypted)

            if(decrypted == req.body.password){

                jwt.sign({data}, jwtkey, {expiresIn:'10h'}, function(err, token){
                    if(err) console.log(err)
                    else{
                        res.status(200).json({token}) // send token as response
                    }
                })
            }
        })
        .catch(function(err){
            console.log(err)
        })
})


// Authorization

// middleware for verifying Token
function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization']

    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ')

        req.token = bearer[1]

        jwt.verify(req.token, jwtkey, function(err, authData){
            if(err) res.send({result: err})
            else{
                next() // it means , if error doesn't occur then hit the url, in which this middleware interacts
            }
        })
    }
    else{
        res.send({'result':'Token not provided'})
    }
}

// adding middleware for authorization purposes
app.get('/allUser', verifyToken, function(req, res){
    User.find()
        .then(function(result){
            res.status(200).send(result)
        })
})

