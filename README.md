# Bamazon
## Overview
Bamazon is an interactive command-line-interface shopping application. It has three main applications:

  - **Customer View**
  - **Manager View**
  - **Supervisor View**

### Dependencies and Setup

This application uses the following packages:
  - mysql
  - inquirer
  - cli-table
  

This application uses a sql server to store data. After downloading/cloning this repo, make sure to run the schema, bamazon.sql, from your command line to create the necessary database and tables to use with the application. There are values in the schema that will be inserted into the database to get you started.

## Customer View
To begin the program with the customer view, type `node bamazonCustomer.js` into terminal. You should be presented with a table of current products and a prompt.

[insert image here]

To select an item, type in the item id of the item you wish to buy. You will then be presented with a second prompt asking for the quantity of that item. Both prompts only accept integer values.

If the quantity you select does not exceed the current stock of the item, your request will be processed successfully, and your total charge will be displayed following the confirmation message. If your request does exceed the stock, the transaction will not complete, and you will be prompted to return to the initial menu.

To exit the program, select the exit option in the main menu prompt.

## Manager View
To begin the program with the manager view, type `node bamazonManager.js` into the terminal. 

## Supervisor View
To begin the program with the supervisor view, type `node bamazonSupervisor.js` into the terminal.
