const express = require('express')
const app = express()
const router = require('./route/router');
app.all('/', (req, res) => {
    // console.log("Just got a request!")
    // res.send('Dev Branch!')
    router.handleRequest(req, res);
})
app.listen(process.env.PORT || 3000)
