const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config();
const fs_promises = require('fs').promises
const path = require('path')

const usersDB = {
    users: require('../models/users.json'),
    setUsers:function(data){this.users=data}
}

const handleLogin = async (req, res) => {
    const { user, password } = req.body
    if (!user || !password) {
        return res.status(400).json({ 'message':'Username and password are required'})
    }
    const found_user = usersDB.users.find(person => person.username === user)

    if (!found_user) {
        return res.sendStatus(401) //unauthorized
    }
    else {
        //evaluate password
        const match = await bcrypt.compare(password, found_user.password)
        if (match) {
            //create JWT
            const accessToken = jwt.sign(
                { "username": found_user.username },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn:'30s'}
            )
            const refreshToken = jwt.sign(
                { "username": found_user.username },
                process.env.REFRESH_TOKEN_SECRET,
                {expiresIn:'1d'}
            )
            //Saving refreshToken with the current user
            const otherUsers = usersDB.users.filter(person => person.username !== found_user.username)
            //adding  the refresh token to the database
            const currentUser = { ...found_user, refreshToken }
            usersDB.setUsers([...otherUsers,currentUser])
            await fs_promises.writeFile(path.join(__dirname, '..', 'models', 'users.json'), JSON.stringify(usersDB.users))
            res.cookie('jwt',refreshToken,{httpOnly:true,sameSite:'None', secure:true,maxAge:24*60*60*1000}) //maxAge=one day
            res.json({accessToken})
        }
        else {
            res.sendStatus(401)
        }
    }
}

module.exports={handleLogin}