const User = require('../models/User')
const {error} = require('../utils/responser')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const verifyToken = async (req, res, next)=>{
    let token = req.headers['authorization']

    console.log(token)
    if(!token)
        return res.status(403).json(error(403,"Unauhtorized"))
    
        try {
            token = token.split(" ")[1];
            let decoded = await jwt.verify(token, JWT_SECRET_KEY)
            req.userID = decoded.id
            next()
        } catch (err) {
            console.error(err)
            return res.status(403).json(error(403,"Unauhtorized"))

        }
 
}


module.exports = {verifyToken}