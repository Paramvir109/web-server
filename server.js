const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000; //Heroku sets an env key value pair for port(But not set when we run locally)

//nodemon server.js -e js,hbs(AS by default it doesnt watch hbs files)
var app = express();

app.set('template engine' , 'hbs')//This sets hbs as template engine for express for rendering templates
app.use(express.static(__dirname + '/public'));//Servin the whole public folder(eg of express middleware)
app.use((req, res, next) => {//Takes only one function as arg(This is middleware)
    //customising functioning of express
    var now = new Date().toString();
    let log = `${now} ${req.method} ${req.path}`//Refresh the page to see this(as req has to be made)
    fs.appendFileSync('server.log', `${log}
    `)
    next(); //Must provide this otherwise handler request wont be completed(Would seem cant connect to server)
})
// app.use((req, res, next) => {
//         res.render('maintenance.hbs')//That's why no next(It stops execution of code below it)
//         //Only executes till this point  but (abc.txt) updated everytime on refreshing
//         //Order is important. static middleware(help page can be viewed) and maintenance middleware doesnt get a chance
//         //to be executed
// })

hbs.registerHelper('currentYear' , () => {
    return new Date().getFullYear();
})
hbs.registerHelper('screamIt' , (text) => {
    return text.toUpperCase();
})
hbs.registerPartials(__dirname + '/views/partials')//hbs knows now where are the partial templates being kept


app.get('/', (req, res) => {//It is handler for making request
    //res.send("<h1>Hello Express</h1>")// '/' is used for the root directory
    //By default it returns text/html
    res.render('home.hbs', { 
        pageTitle : 'Home page',
        welcome : 'Welcome to the homepage'
    })
});

app.get('/about', (req, res) => {
    //res.send('About Page');
    res.render('about.hbs', {//It by default searches for template in viws directory
        pageTitle : 'About Page',
    })//2nd param would be data we like to inject
});

// /bad - send back json with errorMessage
app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to handle request'
    });
});

app.listen(port ,() => {
    console.log(`Server is up and running on ${port} port`);
});//Never stops actually

//id_rsa --Private key(DONT GIVE TO ANYONE)
//id_rsa.pub - (GIven to github etc)
//heroku create(remote is added)
//git push heroku