// callback function

// let sum = function (a, b){
//     return a + b
// }

// function anonymousSum(sum){
//     console.log('Sum anonymous: ', sum(10, 20))
// }

// function callbackSum(sum){
//     console.log('Sum callback: ', sum(50, 100))
// }

// anonymousSum(sum)
// callbackSum(function(a, b){
//     return a+b
// })

// console.log('Sum outside: ', sum(5, 10))

const http = require('http')

// let data = [
//     {
//         id:19,
//         name:'Shohag',
//         cgpa:2.956
//     }
// ]

// http.createServer( function (req, res) {
//     res.writeHead(200, {'content-type':'application-json'})
//     res.write(JSON.stringify(data))
//     res.end()
// }).listen(4000)

// const fs = require('fs')

// http.createServer(function(req, res){
//     fs.readFile('demo.html', function(err, data){
//         res.writeHead(200, {'content-type':'text/html'})
//         res.write(data)
//         return res.end()
//     })
// }).listen(4000)

const mysql = require('mysql')
const con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"interview"
})

con.connect(function(err){
    if(err){
        throw err
    }else{
        console.log('Connected !!!')

        // writing query
        con.query('select * from EmployeeDetails', function(err, result){

            if(err) throw err
            else{
                console.log('All Data: ', result)
                console.log('First Employee info: ', result[0])
                console.log('First Employee Name: ', result[0].FullName)
            }
        })
    }
})

// Event Emitter
// const events = require('events')
// const eventEmitter = new events.EventEmitter()

// eventEmitter.on("speak", function(name){
//     console.log(name, ' is speaking !!')
// })

// eventEmitter.emit("speak", 'Shohag')
