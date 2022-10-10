const whitelist = [
    'https://www.google.com',
    'http://127.0.0.1:3500',
    'http://127.0.0.1:5500'
];

const cors_options = {
    origin:(origin,callback)=>{
        if(whitelist.indexOf(origin)!== -1 || !origin){
            callback(null,true)
        }
        else{
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus:200
}

module.exports=cors_options