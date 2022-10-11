//To encrypt our passwords install npm  install  bcrypt
const fs_promises = require('fs').promises;
const path = require('path')
const bcrypt = require('bcrypt')


const usersDB = {
    users: require('../models/users.json'),
    setUsers:function(data){this.users=data}
}

//handler for our user information (Registering a new user)
const handlerNewUser = async (req, res) => {
    const { user, password } = req.body
    if (!user || !password) {
        return res.status(400).json({ 'message':'Username and password are required'})
    }
    //check for duplicate username in the database
    //console.log(usersDB.users)
    const duplicate = usersDB.users.find(person => person.username === user)
    if (duplicate) {
        return res.sendStatus(409) //conflict
    }
    else {
        try {
        //encrypt the password
            const hashed_password = await bcrypt.hash(password, 10)
        //store the new user
        const newUser = { "username": user, "password": hashed_password }
        usersDB.setUsers([...usersDB.users, newUser])
        await fs_promises.writeFile(path.join(__dirname, '..', 'models', 'users.json'), JSON.stringify(usersDB.users))
        console.log(usersDB.users)
        res.status(201).json({'success':`New user ${user} created`})
    }
    catch (err) {
        res.status(500).json({'message':err.message})
    }
    }
    
}

module.exports = {handlerNewUser}