const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config();
const User = require('../models/User')

const handleLogin = async (req, res) => {
    const { user, password } = req.body
    if (!user || !password) {
        return res.status(400).json({ 'message':'Username and password are required'})
    }
    //const found_user = usersDB.users.find(person => person.username === user)
    const found_user = await User.findOne({username:user}).exec()


    if (!found_user) {
        return res.sendStatus(401) //unauthorized
    }
    else {
        //evaluate password
        const match = await bcrypt.compare(password, found_user.password)
        if (match) {
            const roles = Object.values(found_user.roles)
            //create JWT
            const accessToken = jwt.sign(
                //jwt payload
                { "UserInfo":{
                    "username": found_user.username,
                    "roles":roles
                } },
                //jwt access token
                process.env.ACCESS_TOKEN_SECRET,
                //jwt expiration date
                {expiresIn:'30s'}
            )
            const refreshToken = jwt.sign(
                { "username": found_user.username },
                process.env.REFRESH_TOKEN_SECRET,
                {expiresIn:'1d'}
            )
            //Saving refreshToken with the current users
            found_user.refreshToken = refreshToken
            const result = await found_user.save()
            console.log(result)
           /* 
            const otherUsers = usersDB.users.filter(person => person.username !== found_user.username)
            //adding  the refresh token to the database
            const currentUser = { ...found_user, refreshToken }
            usersDB.setUsers([...otherUsers,currentUser])
            await fs_promises.writeFile(path.join(__dirname, '..', 'models', 'users.json'), JSON.stringify(usersDB.users))
            */
            res.cookie('jwt',refreshToken,{httpOnly:true,sameSite:'None',maxAge:24*60*60*1000}) //maxAge=one day  secure:true,
            res.json({accessToken})
            
        }
        else {
            res.sendStatus(401)
        }
    }
}

module.exports={handleLogin}