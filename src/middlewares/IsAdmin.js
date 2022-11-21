const User = require('../models/User')
const Role = require('../models/Role')

const {error} = require('../utils/responser')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
// for check role
isAdmin = async (req, res, next) => {


    let user = await User.findById(req.userID)
     
      Role.find(
        {
          _id: { $in: user.roles }
        },
        (err, roles) => {
        
          if (err) {
              return res.status(500).json(error(500,{},"Server Side Error"))
          }
          console.log(roles)
          for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "admin") {
                console.log(roles[i].name)
              next();
              return;
            }
          }
  
          return res.status(403).json(error(403,"You dot not have permission to this area"))
        }
      );

      
  };
  

  module.exports = {isAdmin}