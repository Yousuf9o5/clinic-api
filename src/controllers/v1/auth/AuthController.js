const User = require('../../../models/User')
const Role = require('../../../models/Role')
let jwt = require('jsonwebtoken')
let bcrypt = require('bcryptjs')
require('dotenv').config()
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const {success, error} = require('../../../utils/responser')
const {validationResult} = require('express-validator')

const signup = (req, res)=>{
    const hashedPassword = bcrypt.hashSync(req.body.password,10)

    const user = new User({
        username:req.body.username,
        password:hashedPassword
    })

    user.save((err, user)=>{
        if(err)
        {
            return res.status(500).json(error(500,"Server Side Error"))
        }

        // saved
        let roles = req.body.roles;
        if(roles)
        {
            Role.find({
                name:{
                    $in:roles
                }
            },(err, roles)=>{
                user.roles = roles.map(r=>r._id)
            user.save(err=>{
                if(err)
                    return res.status(500).json(error(500,"Server Side Error"))

            })
            return res.status(201).json(error(201,user,"Registered Successfully"))
            })
            

        }
        else{// default is `user` // admin
            Role.findOne({
                name:'user'
            },(e,role)=>{
                if(e)
                    return res.status(500).json(error(500,"Server Side Error"))

                user.roles = [role._id]
                user.save(err=>{
                    if(err)
                        return res.status(500).json(error(500,"Server Side Error"))

                    return res.status(201).json(error(201,user,"Registered Successfully"))
                    
                })
            })
        }
    })
}

const signin = async (req, res)=>{
    let errors = validationResult(req).array();
    if(errors)
    {
        return res.status(400).json(error(400,errors))

    }
    try {
        let user = await User.findOne({
            username:req.body.username
        }).populate('roles')
        if(!user)
        {
            return res.status(404).json(error(404,"Not Found"))
        }
        let ok = await bcrypt.compare(req.body.password, user.password)
        if(!ok)
            return res.status(401).json(error(401,"Invalid Password"))

        
        const RolesNames = [];
        for(let i = 0; i<user.roles.length; i++)
        {
            RolesNames.push(user.roles[i].name)
        }
        let token = jwt.sign({
            id:user.id,
            roles:RolesNames
        },JWT_SECRET_KEY,{
            expiresIn:3600// 1 hour
        })
        return res.status(200).json(error(200,{
            id:user.id,
            username:user.username,
            roles:RolesNames,
            token:token
        },"Registered Successfully"))

    } catch (err) {
        console.error(err)
        return res.status(500).json(error(500,"Server Side Error"))

    }

}
module.exports = {signup, signin}