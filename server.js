//IMPORTS
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500;
const {logger} = require('./middleware/logEvents');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const cors_options = require('./config/corsOptions');
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')
const credentials = require('./middleware/credentials')


//WRITE CODE HERE

//JWT NEEDED INSTALLS
//cookie-parser, dotenv, jsonwebtoken

//To get a random encrypted string one node one the console and type the following
//> require('crypto').randomBytes(64).toString('hex')

//CUSTOM MIDDLEWARES
//custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

//THIRD PARTY MIDDLEWARE
//cors middleware (cross orign resource sharing)
//npm install cors
app.use(cors(cors_options));

//BUILTIN MIDDLEWARES
//built-in middleware used for handling url encoded data eg form data
//content-type:application/x-www-form-urlencoded
app.use(express.urlencoded({extended:false}));

//built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser())

//built-in middleware for serving static files
app.use('/',express.static(path.join(__dirname, '/public')))
app.use('/subdir',express.static(path.join(__dirname, '/public')))

//Routes
app.use('/', require('./routes/root'))
app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'))


//Everthing after this middleware will require jwt token to access them
app.use(verifyJWT)
app.use('/employees', require('./routes/api/employees'))
app.use('/subdir', require('./routes/subdir'))


//a catch all route
app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
            res.sendFile(path.join(__dirname,'views','404.html'))
    }
    else if (req.accepts('json')) {
        res.json({error:'404 Not Found'})
    }
    else {
        res.type('txt').send('404 Not Found')
    }
})

//custom middleware error handler
app.use(errorHandler)

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
});

/*
ROUTING
'^/$|/index(.html)?' = this is the route
(req,res)=>{
    //res.sendFile('./views/index.html',{root:__dirname})
    res.sendFile(path.join(__dirname,'views','index.html'))
} = and the callback function is the view
app.get() = you join both of them here

MIDDLEWARES
Middleware is anyhting between the request and the response
There are three types of middleware built-in,custom,thirdparty middleware
We use app.use() to apply middleware to all incoming routes
*/



/*
app.get('/hello(.html)?',(req,res,next)=>{
    console.log('attempted to load hello world')
    next()
},(req,res)=>{
    res.send('Hello World')
});

//chaining route handlers
const one = (req,res,next)=>{
    console.log('one')
    next()
};
const two = (req,res,next)=>{
    console.log('two')
    next()
};
const three = (req,res,next)=>{
    console.log('three')
    res.send('Finished')
}
app.get('/chain(.html)?',[one,two,three])
*/