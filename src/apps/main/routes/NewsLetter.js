const express = require('express')
const router = express.Router()
const {subscribeEmail} = require('../controllers/NewsletterController')

router.post('/subscribe', subscribeEmail)

module.exports = router