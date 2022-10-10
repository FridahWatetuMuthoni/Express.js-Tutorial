const express = require('express')
const router = express.Router()
const path = require('path')
const data = {}
data.employees = require('../../models/employees.json')
const{getAllEmployees,createNewEmployee,updateEmployee,deleteEmployee}=require('../../controllers/employeesController')


router.route('/')
    .get(getAllEmployees)
    .post(createNewEmployee)
    .put(updateEmployee)
    .delete(deleteEmployee)

router.route('/:id')
    .get((req, res) => {
        res.json({"id":req.params.id})
    })

module.exports = router;