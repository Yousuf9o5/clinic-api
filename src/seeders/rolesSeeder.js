const Role = require('../models/Role')

const seed = async ()=>{
    try {
            // fetch all roles from collection model
            // decide to insert new roles or not
            let count = await Role.estimatedDocumentCount();
            if(count == 0)
            {
                await new Role({
                    name:'admin'
                }).save()

                await new Role({
                    name:'user'
                }).save()
            }
    } catch (err) {
        console.error(err)
    }
}

module.exports = seed;