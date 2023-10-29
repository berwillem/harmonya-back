const express = require('express')
const router = express.Router()
const {getCategories, addCategory} = require('../controllers/CategoryController')

router.get('/', getCategories)
router.post('/addCategory', addCategory)

module.exports = router