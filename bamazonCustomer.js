const mysql = require('mysql');
const inquirer = require('inquirer');

// Database credentials
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "codingbootcamp",
  database: "bamazon"
})
// Function to establish connection to the database
connection.connect(function(err) {
  if (err) throw err;

  // Use a query to get database information, and then display it in an aesthetically pleasing way
  startMenu()
  
})


// FUNCTION to display initial list and ask query
function startMenu() {
  console.log("Welcome to the Bamazon store! Below is a list of products that we currently offfer.")
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // Display section
    console.log("| List of Bamazon Products \n")
    res.forEach(function(row) {
      console.log("| Item Id: " + row.item_id + " | Department: " + row.department_name + " | Item: " + row.product_name + " | Price: $" + row.price)
    })
  select();
  })
}

// FUNCTION to select an item
function select() {
  inquirer.prompt([
    {
      "name": "id",
      "message": "To purchase an item, please type the item id below.",
      "type": "input"
      // Add number validation later
    },
    {
      "name": "quantity",
      "message": "How many of this item would you like to buy?",
      "type": "input"
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
        startMenu();
      }
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
          console.log("Your order was placed successfully!")
          console.log("Your total charge is: " + sales)
          console.log("Returning you now to the item menu.")
          startMenu();
        }) 
      }) 
    })
  })
}

