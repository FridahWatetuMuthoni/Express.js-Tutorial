//IMPORTS
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500;
const {logger} = require('./middleware/logEvents');
const cors = require('cors')

//2:49:00

//WRITE CODE HERE
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


//CUSTOM MIDDLEWARES
//custom middleware logger
app.use(logger);

//THIRD PARTY MIDDLEWARE
//cors middleware (cross orign resource sharing)
//npm install cors
const whitelist = ['https://www.google.com','http://127.0.0.1:3500','http://127.0.0.1:5500']
const cors_options = {
    origin:(origin,callback)=>{
        if(whitelist.indexOf(origin)!== -1 || !orign){
            callback(null,true)
        }
        else{
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus:200
}
app.use(cors(cors_options));

//BUILTIN MIDDLEWARES
//built-in middleware used for handling url encoded data eg form data
//content-type:application/x-www-form-urlencoded
app.use(express.urlencoded({extended:false}));

//built-in middleware for json
app.use(express.json());

//built-in middleware for serving static files
app.use(express.static(path.join(__dirname,'/public')))

//Regular expression:("^/$") must begin with a / or end with a / 
app.get('^/$|/index(.html)?',(req,res)=>{
    //res.sendFile('./views/index.html',{root:__dirname})
    res.sendFile(path.join(__dirname,'views','index.html'))
});

app.get('/new-page(.html)?',(req,res)=>{
    //res.sendFile('./views/index.html',{root:__dirname})
    res.sendFile(path.join(__dirname,'views','new-page.html'))
});


app.get('/old-page(.html)?',(req,res)=>{
    //res.sendFile('./views/index.html',{root:__dirname})
    res.redirect(301,path.join(__dirname,'views','new-page.html')) //302 by default
});

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

//a catch all route
app.get('/*',(req,res)=>{
    res.status(404).sendFile(path.join(__dirname,'views','404.html'))
})

//custom middleware error handler
app.use(function(err,req,res,next){
    console.error(err.stack)
    res.status(500).send(err.message)
})

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
});