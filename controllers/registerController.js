//To encrypt our passwords install npm  install  bcrypt
const bcrypt = require('bcrypt')
const User = require('../models/User')



//handler for our user information (Registering a new user)
const handlerNewUser = async (req, res) => {
    const { user, password } = req.body
    if (!user || !password) {
        return res.status(400).json({ 'message':'Username and password are required'})
    }
    //check for duplicate username in the database
    //console.log(usersDB.users)
    //const duplicate = usersDB.users.find(person => person.username === user)
    const duplicate = await User.findOne({username:user}).exec()
    if (duplicate) {
        return res.sendStatus(409) //conflict
    }
    else {
        try {
        //encrypt the password
            const hashed_password = await bcrypt.hash(password, 10)
        //create and store the new user
            const result = await User.create({ "username": user, "password": hashed_password })
            console.log(result)
        /*usersDB.setUsers([...usersDB.users, newUser])
        await fs_promises.writeFile(path.join(__dirname, '..', 'models', 'users.json'), JSON.stringify(usersDB.users))
        console.log(usersDB.users)
        */
        res.status(201).json({'success':`New user ${user} created`})
    }
    catch (err) {
        res.status(500).json({'message':err.message})
    }
    }
    
}

module.exports = {handlerNewUser}