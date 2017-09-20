// TO DO
// ADD INTEGER VALIDATION TO EACH INQUIRER FUNCTION
// LINK DEPARTMENT SELECTION TO THE LIST OF DEPARTMENTS IN THE DATABASE


const mysql = require('mysql');
const inquirer = require('inquirer');
let Table = require('cli-table')

// Database credentials
const connection = require('./database.js')
// Function to establish connection to the database
connection.connect(function(err) {
  if (err) throw err;
  // Use a query to get database information, and then display it in an aesthetically pleasing way
  menu();
})

function menu() {
  inquirer.prompt([
    {
      "name": "action",
      "message": "Welcome to the manager console of Bamazon. Please select an action below to continue.",
      "type": "list",
      "choices": ["View Products for Sale","View Low Inventory","Add to Inventory", "Add New Product", "Exit"]
    }
  ]).then(function(answer) {
    switch (answer.action) {
      case "View Products for Sale":
        list();
        break;
      case "View Low Inventory":
        lowInv();
        break;
      case "Add to Inventory":
        addInv();
        break;
      case "Add New Product":
        addProd();
        break;
      case "Exit":
        console.log("Exiting program.")
        connection.end();
        break;
    }
  })
}

// FUNCTION to view a list of current products.
function list() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    let table = new Table({
      head: ['Product ID', 'Product Name', 'Price', 'Stock', 'Department'],
      color: ["blue"],
      colAligns: ["center"]
    })
    res.forEach(function(row) {
      let newRow = [row.item_id, row.product_name, "$" + row.price, row.stock_quantity, row.department_name]
      table.push(newRow)
    })
    console.log("Current Bamazon Products")
    console.log("\n" + table.toString())
    menu();
  })
}

// FUNCTION to view a list of low inventory products (<5 quantity)
function lowInv() {
  var query = "SELECT * FROM products WHERE stock_quantity < 5"
  connection.query(query, function(err, res) {
    if (err) throw err;
    let table = new Table({
      head: ['Product ID', 'Product Name', 'Price', 'Stock', 'Department'],
      color: ["blue"],
      colAligns: ["center"]
    })
    console.log("Here is a list of low inventory products\n")
    res.forEach(function(row) {
      let newRow = [row.item_id, row.product_name, "$" + row.price, row.stock_quantity, row.department_name]
      table.push(newRow)
    })
    console.log("\n" + table.toString())
  menu();
  })
}


// FUNCTION to update the quantity of any given product
function addInv() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    let table = new Table({
      head: ['Product ID', 'Product Name', 'Price', 'Department'],
      color: ["blue"],
      colAligns: ["center"]
    })
    res.forEach(function(row) {
      let newRow = [row.item_id, row.product_name, row.price, row.stock_quantity, row.department_name]
      table.push(newRow)
    })
    console.log("Current Bamazon Products")
    console.log("\n" + table.toString())
    
    inquirer.prompt([
      {
        "name": "item_selection",
        "message": "To add inventory or an item, select the item by typing in the item id below.",
        "type": "input"
      },
      {
        "name": "quantity",
        "message": "How much inventory would you like to add?",
        "type": "input"
      }
    ]).then(function(answer) {
      connection.query(`UPDATE products SET stock_quantity=stock_quantity + ${answer.quantity} WHERE item_id=${answer.item_selection}`, function(err, res) {
        console.log("You have added " + answer.quantity + " stock to the selected item.\n")
        menu();
      })
    })
  })
}

function addProd() {
  // Grabbing department data so that they can be used as options in the department answer. This way, no non-existing departments can be created.
  connection.query("SELECT * FROM departments", function(err, res) {
    if (err) throw err;
    let departmentArr = [];
    res.forEach(function(row) {
      let departmentAdd = row.department_name;
      departmentArr.push(departmentAdd)
    })
    inquirer.prompt([
      {
        "name": "product_name",
        "message": "Please type in the name of the product you are adding.",
        "type": "input"
      },
      {
        "name": "department",
        "message": "Which department does this item belong in? If the department you wish to add does not exist, please create that department using the Supervisor program.",
        "type": "list",
        "choices": departmentArr
      },
      {
        "name": "price",
        "message": "How much does this item cost?",
        "type": "input"
      },
      {
        "name": "quantity",
        "message": "How much of this product is being added to stock?",
        "type": "input"
      }
    ]).then(function(answer) {
      let query = "INSERT INTO products SET ?"
      let values = {
      product_name: answer.product_name,
      department_name: answer.department,
      price: answer.price,
      stock_quantity: answer.quantity 
      }
      connection.query(query, values, function(err, res) {
        if (err) throw err;
        console.log("\nThe product has been added to the item list. The item parameters are listed below: ")
        console.log("Product Name: " + answer.product_name)
        console.log("Department: " + answer.department)
        console.log("Price: " + answer.price)
        console.log("Quantity: " + answer.quantity + "\n")
        menu()
      })
    })
  })
}

