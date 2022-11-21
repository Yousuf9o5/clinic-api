const { ROLES } = require('../config/constants')
const User = require('../models/User')
const {error} = require('../utils/responser')

const checkUserDuplicate = async (req,res, next)=>{
    let user = await User.findOne({
        username:req.body.username
    })

    if(user)
    {
        return res.status(409).json(error(409,"User already exists"))
    }
    next()
}

const checkRoles = async (req, res, next)=>{
    let roles = req.body.roles;
    for(let i =0 ; i< req.body.roles.length; i++)
    {
        if(!ROLES.includes(req.body.roles[i]))
        {
            return res.status(400).json(error(400,"Bar request input"))
        }
    }
    next();
}

module.exports = {checkUserDuplicate,checkRoles}