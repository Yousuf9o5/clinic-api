const Patient = require('../../../models/Patient')
const {History} = require('../../../models/History')

const {success, error} = require('../../../utils/responser')

const getAllPatients = async (req, res)=>{
    // let data  = await History.find();
    const gender = req.query.gender;
    const full_name = req.query.full_name
    const limit = req.query.limit?req.query.limit:10
    const offset = req.query.offset?req.query.offset:0

    const filter = {};
    if(gender)
    {
        filter.gender = gender;
    }
    if(full_name)
        filter.full_name = {
            $regex: `.*${full_name}.*`
        };
    let data = await Patient
    
    .aggregate([
        {
            $match:filter
        }
        ,
       {
        $sort:{
            full_name:-1
        }
       },
       {$limit:limit - 0},
       {$skip:offset - 0},
       {
        $project:{
            full_name:1,
            phone:1,
            history:1
        }
       }
    ])
    // .limit(limit)
    // .skip(offset)
    return res.status(200).json(success(200,data,"Success"))
}
const getPatientById = (req, res)=>{
    const id = req.params.id;
    Patient.findById(id)
    .populate('history')
    .then((r)=>{
        console.log('retreiving')
        return res.status(200).json(success(200,r,"Success"))

    })
    .catch((e)=>{
        console.error(e)
    })
}

const deletePatient = async (req, res)=>{
    const id = req.params.id;
    try {
        const p = await Patient.findByIdAndDelete(id);
        return res.status(200).json(success(200,p,"Ok"))
    } catch (error) {
        return res.status(500).json(error(500,"Server Side Error"))
    }

}

const updatePatient =  async (req, res)=>{
    const id = req.params.id;
    // TO-DO
    // let p = await Patient.findOne({
    //     _id:id
    // })
    // p.full_name = req.body.full_name
    // try {
    //     await p.save()
    //     return res.status(200).json(success(200,p,"Ok"))
        
    // } catch (error) {
    //     return res.status(500).json(success(500,"Server Side Error"))
        
    // }
    try {
        const p = await Patient.findByIdAndUpdate(id,req.body)
        return res.status(200).json(success(200,p,"Ok"))
    } catch (error) {
        return res.status(500).json(error(500,"Server Side Error"))
        
    }
}

const getHistoryOfPatient = async (req, res)=>{
    const id = req.params.id; // patient id
    // TO-DO
    const p = await Patient.findById(id)
    .populate('history')
    let history = p.history;
    return res.status(200).json(success(200,history,"Ok"))
}

const createPatient = async (req, res)=>{
    let bdy = req.body
    const p = new Patient(bdy)
    try {
        const returedObject = await p.save();
        return res.status(200).json(success(200, returedObject,"OK"))
    } catch (error) {
        return res.status(500).json(error(500,"Something went wrong"))
    }
}

const searchPatients = async (req, res)=>{
    const full_name = req.query.full_name
    // let data = await Patient.find({
    //     full_name:{
    //         $regex: `.*${full_name}.*`
    //     }
    // })
    console.log(full_name)
    let data = await Patient.find({
        gender:req.query.gender,
        full_name:{
                     $regex: `.*${full_name}.*`  
        }
    })
    .populate({
        path:'history',
        options:{
            $project:{
                _id:1,
                full_name:1,
                history:1
            },
            $sort:{
                full_name:-1
            } 
        }
    })
  
    if(data)
        return res.status(200).json(success(200, data,"OK"))
    
    return res.status(404).json(success(404,"No Results"))
    
}

const newHistory = async (req, res)=>{
    const id = req.params.id;//patient
    // TO-DO
    const errors = validationResult(req).array();
    console.error(errors)
    if(errors && errors.length > 0)
    {
        return res.status(400).json(error(400,"You have to upload a file"))

    }
    let p = await Patient.findById(id);
    console.log('p',p)
    if(!p)
        return res.status(404).json(error(404,{},"No Data"))

    
    let h = new History(req.body)
    await h.save()
    if(!p.history)
        p.history = []
        p.history.push(h._id)

    console.log('file is ',req.file)

    if(req.file)
    {
        if(!p.images)
            p.images = []
        p.images.push(req.file.originalname)
    }
    p.save()
    
    
    
    // or method 2 to update history array
    /*
    let p = await Patient.findByIdAndUpdate(id,
            {
                $push:{
                    history:req.body
                }
            }
        )
    */
    return res.status(200).json(success(200,p,"Success"))
}
module.exports = {
    getAllPatients,
    getPatientById,
    deletePatient,
    updatePatient,
    getHistoryOfPatient,
    createPatient,
    searchPatients,
    newHistory
}