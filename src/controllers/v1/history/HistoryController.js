const Patient = require('../../../models/Patient');
const {History} = require('../../../models/History');

const {success, error} = require('../../../utils/responser')



const getAllHistory = async (req, res)=>{
    let historyList = await History.find()
    return res.status(200).json(success(200,historyList,"Success"))
}

const deleteHistory = async (req, res)=>{
    const id = req.params.id;
    try {
        const h = await History.findByIdAndDelete(id);
        if(!h)
            return res.status(404).json(error(200,"History Not Found"))

        return res.status(200).json(success(200,h,"Ok"))
    } catch (e) {
        return res.status(500).json(error(500,"Server Side Error"))
    }

}



module.exports = {
    getAllHistory,
    deleteHistory
}