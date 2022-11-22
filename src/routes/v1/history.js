const express = require('express')
const router = express.Router()
const {getAllHistory, deleteHistory} = require('../../controllers/v1/history/HistoryController')


router.get('/', getAllHistory);
router.delete('/:id', deleteHistory);

module.exports = router;