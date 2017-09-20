const mysql = require('mysql');
const inquirer = require('inquirer');
let Table = require('cli-table')


// Database credentials
const connection = require('./database.js')
// Function to establish connection to the database
connection.connect(function(err) {
  if (err) throw err;
  // Use a query to get database information, and then display it in an aesthetically pleasing way
  startMenu();
})


// FUNCTION to display initial list and ask query
function startMenu() {
  inquirer.prompt([
    {
      "name": "action",
      "message": "Welcome to Bamazon, valued customer! Please select an option below to begin",
      "type": "list",
      "choices": ["Buy an item", "Exit"]
    }
  ]).then(function(answer) {
    switch (answer.action) {
      case "Buy an item":
        select();
        break;
      case "Exit":
        console.log("Exiting the program")
        connection.end()
        break;
    }
  })
}

// FUNCTION to select an item
function select() {
  console.log("Welcome to the Bamazon store! Below is a list of products that we currently offfer.")
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    let itemArr = []
    let table = new Table({
      head: ['Product ID', 'Product Name', 'Price', 'Stock', 'Department'],
      color: ["blue"],
      colAligns: ["center"]
    })
    res.forEach(function(row) {
      let newRow = [row.item_id, row.product_name, "$" + row.price, row.stock_quantity, row.department_name]
      table.push(newRow)
      itemArr.push(row.item_id)
    })
    console.log("\n" + table.toString())

    inquirer.prompt([
    {
      "name": "id",
      "message": "To purchase an item, please type the item id below.",
      "type": "input",
      "validate": function(input) {
        if (Number.isInteger(parseInt(input)) === true && (itemArr.indexOf(parseFloat(input)) !== -1)) {
          return true
        }
        else {
          console.log("\nPlease enter a valid item ID to continue.")
        }
      }
    },
    {
      "name": "quantity",
      "message": "How many of this item would you like to buy?",
      "type": "input",
      "validate": function(input) {
        if (Number.isInteger(parseInt(input)) === true) {
          return true
        }
        else {
          console.log("\nPlease enter a number.")
        }
      }
      // Add number validation later
    }
  ]).then(function(answer) {
    let selection;
    var quantity = parseInt(answer.quantity)
    connection.query("SELECT * FROM products", function(err, res) {
      res.forEach(function(row) {
        if (parseInt(answer.id) === row.item_id) {
          selection = row
        }
      })
      // If new quantity is more than zero, then continue
      if ((selection.stock_quantity - quantity) >= 0) {
        buyItem(selection, quantity)
      }
      // If new quantity is less that 0, then insufficient stock is available, and the user is redirected back to the select screen.
      else {
        console.log("Sorry, but we have insufficient stock to fulfill your order. You requested " + quantity + " of this item, but we only have " + selection.stock_quantity + " in stock. Returning to the item list now.")
        // Back to menu
        startMenu();
      }
    })
  })
  })
}

// FUNCTION to actually buy the item
function buyItem(item, quantity) {
  connection.query(`UPDATE products SET stock_quantity=(${parseFloat(item.stock_quantity)} - ${parseFloat(quantity)}), product_sales=(product_sales + (${parseFloat(item.price)} * ${parseFloat(quantity)})) WHERE item_id=${item.item_id}`, function(err, res) {
    if (err) throw err;
    let sales = (item.price * quantity)
    //--------------------------- Function to add to department product_sales column ------------------------------------//
    connection.query(`SELECT department_name FROM products WHERE item_id=${item.item_id}`, function(err, res) {
      if (err) throw err;
      let department = res[0].department_name
      connection.query(`SELECT product_sales FROM departments WHERE department_name="${department}"`, function(err, res) {
        let totalSale = res[0].product_sales;
        totalSale = parseFloat(totalSale) + parseFloat(sales);
        connection.query(`UPDATE departments SET product_sales=${totalSale} WHERE department_name="${department}"`, function(err, res) {
          if (err) throw err;
          console.log("\nYour order was placed successfully!")
          console.log("Item: " + item.product_name)
          console.log("Quantity: " + quantity)
          console.log("Total cost: " + sales + "\n")
          // Back to menu
          startMenu();
        }) 
      }) 
    })
  })
}

