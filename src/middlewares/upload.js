const multer = require('multer');
const path = require('path');
const util = require('util')
// define storage engine
let storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,'../../public/resources/uploads/'));
    },
    filename:(req,file,cb)=>{
        console.log(file.originalname)
        cb(null, file.originalname);
    }
})

const maxSize = 2 * 1024 * 1024;// size in bytes, 1 MB = 1024 KB, 1KB=1024 Bytes
let uploadFile = multer({
    storage: storage,
    limits: { fileSize:  maxSize},
  }).single("file");

  let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;