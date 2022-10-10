//IMPORTS
const {format} = require('date-fns')
//We are importing v4 as uuid
const{v4:uuid} = require('uuid')
const fs = require('fs')
const fs_promises = require('fs').promises
const path = require('path')


//CODE
const logEvents = async (message,logName)=>{
    const date_time = `${format(new Date(), 'yyyymmdd\tHH:mm:ss')}`
    const log_item =`${date_time}\t${uuid()}\t${message}\n` 
    console.log(log_item)
    try{
        //creating the logs directiry/folder if it does not exist
        //'..' means create it one directoy up
        if(!fs.existsSync(path.join(__dirname,'..','logs'))){
            await fs_promises.mkdir(path.join(__dirname,'..','logs'))
        }        
        //log_time is the content that we are going to append to the eventsLog.txt
        await fs_promises.appendFile(path.join(__dirname,'..','logs',logName),log_item)
    }
    catch(err){
        console.log(err)
    }
}

const logger=(req,res,next)=>{
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`,'reqLog.txt')
    console.log(`${req.method} ${req.path}`)
    next()
}

module.exports = {logEvents,logger};