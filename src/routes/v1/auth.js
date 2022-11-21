const express = require('express')
const router = express.Router()
const {signup,signin} = require('../../controllers/v1/auth/AuthController')
const { checkUserDuplicate,checkRoles } = require('../../middlewares/verifySignup')
const {check, body} = require('express-validator')
router.post('/signup', [
    checkUserDuplicate,
    checkRoles
],signup )
router.post('/signin', check('username').not().isEmpty().withMessage('username is required'), body('password').not().isEmpty().isLength({min:4}),signin )

module.exports = router;