const express = require('express')
const router = express.Router()
const path = require('path')
const data = {}
data.employees = require('../../models/employees.json')
const { getAllEmployees, createNewEmployee, updateEmployee, deleteEmployee } = require('../../controllers/employeesController')
const ROLES_LIST = require('../../config/roles_list')
const verifyRoles = require('../../middleware/VerifyRoles')


router.route('/')
    .get(getAllEmployees)
    .post(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Editor),createNewEmployee)
    .put(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Editor),updateEmployee)
    .delete(verifyRoles(ROLES_LIST.Admin),deleteEmployee)

router.route('/:id')
    .get((req, res) => {
        res.json({"id":req.params.id})
    })

module.exports = router;