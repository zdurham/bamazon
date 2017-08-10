const mysql = require('mysql');
const inquirer = require('inquirer');
let Table = require('cli-table')

// Database credentials
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "codingbootcamp",
  database: "bamazon"
})

connection.connect(function(err) {
  if (err) throw err;
  
  // Initial prompt asking manager what to do
  menu();
})

function menu() {
  inquirer.prompt([
    {
      "name": "action",
      "message": "Please select an action from below to continue.",
      "type": "list",
      "choices": ["View Product Sales By Department", "Create New Department", "Exit"]
    }
  ]).then(function(answer) {
    switch (answer.action) {
      case "View Product Sales By Department":
        viewSales();
        break;
      case "Create New Department":
        newDept()
        break;
      case "Exit":
        console.log("Exiting program.")
        connection.end();
        break;
    }
  })
}

function viewSales() {
  connection.query(`SELECT * FROM departments`, function(err, res) {
    if (err) throw err;
    let table = new Table({
      head: ['Department ID', 'Department Name', 'Overhead Costs', 'Department Sales', 'Total Profit'],
      color: ["blue"],
      colAligns: ["center"]
    })
    res.forEach(function(row) {
      let totalProfit = (parseFloat(row.product_sales) - parseFloat(row.over_head_costs))
      let newRow = [row.department_id, row.department_name, row.over_head_costs, row.product_sales, totalProfit]
      table.push(newRow)
    })
    console.log("\n" + table.toString())
    menu();
  })
  
}

function newDept() {
  inquirer.prompt([
    { 
      "name": "department",
      "message": "Please type in the name of the department you would like to add. Duplicate departments will not be accepted",
      "type": "input"
    },
    {
      "name": "overhead",
      "message": "What is the overhead cost of this department?",
      "type": "input"
    }
  ]).then(function(answer) {
    // read the database to search for any duplicates. If department name is a duplicate, then return to the beginning of the prompt
    connection.query("SELECT * FROM departments", function(err, res) {
      if (err) throw err;
      let arr = [];
      res.forEach(function(row) {
        arr.push(row.department_name.toLowerCase())
      })

      // If statement to check to see if it is in the array
      if (arr.indexOf(answer.department.toLowerCase()) !== -1) {
          console.log("That department already exists!");
          newDept();
      }
      else {
        connection.query(`INSERT INTO departments (department_name, over_head_costs) VALUES ("${answer.department}", ${parseFloat(answer.overhead)})`, function(err, res) {
          if (err) throw err;
          console.log("Your department: " + answer.department + " has been entered into the database with an overhead cost value of " + answer.overhead + ".")
          menu();
        })
      }
    })
  })
}