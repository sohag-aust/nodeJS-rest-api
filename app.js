const express = require('express')
const app = express()

app.listen(4000)

const router = express.Router()

// Middleware
const url = function(req, res, next){
    console.log('Original URL: ', req.originalUrl)
    next()
}


app.get('/', function(req, res){
    //res.send('This is my HomePage !!!')
    
    //sending html page as response
    res.sendFile(__dirname + '/Home.html')
})

router.get('/login', function(req, res){ // attached middleware for login routing
    //res.send('This is my LoginPage !!!')

    res.sendFile(__dirname + '/Login.html')
})

router.get('/register', function(req, res){ // attached middleware for register routing
    res.send('This is my RegistrationPage !!!')
})

app.get('/about', function(req, res){
    //res.send('This is my AboutPage !!!')

    res.sendFile(__dirname + '/About.html')
})

app.use(url, router)

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

app.get('/home', function(req, res){ 
    res.render('Home')
})


const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://avenger:AgRojH24Pmf96j4P@cluster0-adm4t.mongodb.net/test?retryWrites=true&w=majority/tutorial',
{
    useNewUrlParser:true,
    useUnifiedTopology:true
}
).then( () => {
    console.log('db connection done !!!')
})