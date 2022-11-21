const express = require('express')
const router = express.Router()
const {getAllHistory} = require('../../controllers/v1/history/HistoryController')


router.get('/', getAllHistory);
module.exports = router;