let getEmployees = require('../functions/getEmployees')
let postEmployee = require('../functions/postEmployee')
let deleteEmployee = require('../functions/deleteEmployee')
let employeeData = require('../functions/data/employees')
let directory = {}
module.exports = {
    //setup
    beforeEach: browser => {
        directory = browser.page.directory();
        directory.navigate();
    },
    //teardown
    after: browser => {
        browser.end()
    },
    'Add test employees': ()=> {
        employeeData.forEach(employee=>{
            postEmployee(directory.api, employee)
        })
    },
    'Check for employees on page': ()=> {
        employeeData.forEach(employee=>{
            let selector = directory.getEmployeeSelector(employee.id)
            directory
                .waitForElementVisible(selector, 5000)
                .expect.element(selector).text.to.equal(employee.name)
            directory
                .click(selector)
                .waitForElementVisible('@nameInput', 500)
                .verify.value('@nameInput', employee.name, `Employee name: ${employee.name} is correct.`)
                .verify.value('@phoneInput', employee.phone, `Employee phone: ${employee.phone} is correct.`)
                .verify.value('@emailInput', employee.email, `Employee email: ${employee.email} is correct.`)
                .verify.value('@titleInput', employee.title, `Employee title: ${employee.title} is correct.`)
                .verify.containsText('@idNumber', employee.id, `Employee id: ${employee.id} is correct.`)
        })
    },
    'Modify employee': ()=>{
        directory
            .waitForElementVisible(directory.getEmployeeSelector(employeeData[0].id), 5000)
            .click(directory.getEmployeeSelector(employeeData[0].id))
            .waitForElementVisible('@nameInput', 500)
            .clearValue('@nameInput')
            .setValue('@nameInput', 'Han "I Shot First" Solo')
            .click('@save')
            .click(directory.getEmployeeSelector(employeeData[1].id))
            .expect.element('@nameInput').value.to.equal(employeeData[1].name).before(500)
        directory
            .click(directory.getEmployeeSelector(employeeData[0].id))
            .verify.value('@nameInput', 'Han "I Shot First" Solo', 'The name change persisted after navigating away and back.')
    },
    'Search for employee': ()=> {
        let employee1 = directory.getEmployeeSelector(employeeData[1].id)
        let employee2 = directory.getEmployeeSelector(employeeData[2].id)
        directory
            .waitForElementVisible('@searchInput', 5000)
            .setValue('@searchInput', employeeData[1].name)
            .verify.visible(employee1, `${employeeData[2].name} is visible.`)
            .verify.elementNotPresent(employee2, `${employeeData[2].name} is not visible.`)
            .click('@clearSearchButton')
            .verify.visible(employee1, `${employeeData[2].name} is visible.`)
            .verify.visible(employee2, `${employeeData[2].name} is visible.`)
    },
    'Delete added employees': ()=> {
        employeeData.forEach(employee=>{
            deleteEmployee(directory.api, employee.id)
        })
    },
    'Check for employees NOT on page': ()=> {
        directory.waitForElementVisible('@addEmployee', 5000)
        employeeData.forEach(employee=>{
            directory.verify.elementNotPresent(directory.getEmployeeSelector(employee.id), `Employee ${employee.id} is not present.`)
        })
    }
}