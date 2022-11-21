const express = require('express')
const app = express()
const patientsRouter = require('./src/routes/v1/patients')
const historyRouter = require('./src/routes/v1/history')
const AuthRouter = require('./src/routes/v1/auth')
const {verifyToken} = require('./src/middlewares/verifyJWT')
const {isAdmin} = require('./src/middlewares/IsAdmin')

require('dotenv').config()

const LOCALHOST = process.env.HOST;
const DB_PORT = process.env.PORT;
const DATABASE = process.env.DATABASE;
const APP_PORT = process.env.APP_PORT;
const MONGODB_CLOUD_CON = process.env.MONGODB_CLOUD_CON;
// Connecting to  MongoDB
const mongoose = require('mongoose')
console.log('Starting...')

if(process.env.ENVIRONMENT == 'development')
{
    mongoose.connect(`mongodb://${LOCALHOST}:${DB_PORT}/${DATABASE}`);
}
else{
    console.log(MONGODB_CLOUD_CON)
    mongoose.connect(MONGODB_CLOUD_CON);
}

const db = mongoose.connection;
db.on('error',(e)=>{
    console.error(e)
})

db.once('open', ()=>{
    console.log('Connected to DB successfully')
})

const PORT = 5000;
// middlwares
app.use(express.json())
app.use(express.static('public'))

// for testing
app.get('/', (req, res)=>{
    res.send('<h1>This is Clinic Restful API</h1>')
});

// call routers

app.use('/api/v1/patients',[
    verifyToken,
    isAdmin
],patientsRouter);
app.use('/api/v1/history',[
    verifyToken
],historyRouter);
app.use('/api/v1/auth',AuthRouter);

app.listen(APP_PORT)