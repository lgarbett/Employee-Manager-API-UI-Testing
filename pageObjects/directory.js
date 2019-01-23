


module.exports = {
    url: "https://devmountain-qa.github.io/employee-manager-v2/build/index.html",
    elements: {
        nameInput: "input[name='nameEntry']",
        phoneInput: "input[name='phoneEntry']",
        emailInput: "input[name='emailEntry']",
        titleInput: "input[name='titleEntry']",
        idNumber: "#employeeID",
        save: "#saveBtn",
        addEmployee: "li[name='addEmployee']",
        searchInput: "input[name='searchBox']",
        clearSearchButton: "button[name='clearSearch']"
    },
    commands: [
        {
            getEmployeeSelector: function (id) {
                return `li[name="employee${id}"]`
            }
        }
    ]
}