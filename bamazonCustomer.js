// OVERVIEW:
// Runs startBamazon, to initialize the app.
// startBamazon connects us, runs talkShop.
// talkShop loads the inventory up, 
    // then either readProducts up the current inventory and prompts to buy, or just prompts to buy.
// Shop runs the prompt to queue them for an interest in purchasing. If interested, continues.
// PromptSequence prompts for which item to purchase. If valid, continues.
// QuantityChoice prompts for the number of items to buy. If valid, continues.
// Purchase updates the quantity based off of the purchase, then runs Shop.

// Dependencies necessary
let mysql = require("promise-mysql"),
    inquirer = require("inquirer"),
// Global variables: https://i.redd.it/ex3kek4l97511.png
    id = '',
    quantity = '',
    inventory,
    total = '',
    connection,
    buyMore = '',
// Indicates whether this is the first instance or subsequent, which controls some layout choices.
    firstTime = true;

// Initializes the connection.
function startBamazon() {
    mysql.createConnection({
        host: "localhost",
        port: 8889,
        user: "root",
        password: "root",
        database: "bamazon"
// Only after connecting does it define connection, and then run talkShop.
    }).then(function (conn) {
        connection = conn;
        talkShop();
    })
}

// Updates our inventory, for initial loadout and subsequently so we make sure we do not oversell.
function talkShop() {
    connection.query("SELECT * FROM products"
    ).then(function (res) {
        // Stores the response as the global Inventory variable.
        inventory = res
        // If this is the first instance, we load up inventory before queueing for interest in a purchase.
        if (firstTime) {
            readProducts();
            shop();
        }
        // If not first the instance, queues for interest in purchase.
        else {
            shop();
        }
    });

}

// Posts the current inventory for review.
function readProducts() {
console.log("Searching index...\n");
    console.log("SALES INVENTORY:")
    for (let i = 0; i < inventory.length; i++) {
        console.log(
            "Product: " + inventory[i].product_name + "\n" +
            "Cost: " + inventory[i].price + "\n" +
            "Available: " + inventory[i].stock_quantity + "\n" +
            "Product ID: " + inventory[i].item_id + "\n-----------------------"
        )
    }
}

// Prompts the user for their interest in purchasing an item. 
function shop() {
    // Offers different prompt words depending on whether its the First or Subsequent time purchasing.
    if (firstTime) {
        buyMore = "Would you like to purchase an item?"
    }
    else {
        buyMore = "Would you like to buy another item today?"
    }
    // The prompt handler itself
    inquirer.prompt([{
        name: "buy",
        type: "confirm",
        message: buyMore
    }]).then(answers => {
        if (answers.buy) {
            // If it is a subsequent purchase, it also now provides the current inventory.
            if (!firstTime) {
                readProducts()
            }
            // Prompts to select an item to buy, and ensures firstTime is marked false.
            promptSequence();
            firstTime = false;
        }
        // If not interested in purchasing an item, closes the connection.
        else {
            console.log("Thanks for shopping with us! Have a great day.");
            connection.end();
        }
    })
};

// Controls the prompts for choosing an item to purchase.
function promptSequence() {
    inquirer.prompt([
        {
            type: "input",
            message: "Select an item ID to bid on!",
            name: "item",
        }
    ]).then(answers => {
        if (parseInt(answers.item) > 0 && parseInt(answers.item) <= parseInt(inventory.length)) {
            // ID is used to grab product ID later.
            id = answers.item;
            // If the choice is valid, runs the next prompt sequence, of quantity selection.
            quantityChoice();
        }
        else {
            console.log("That is not a valid selection.");
            // Restart this function if the choice is invalid 
            promptSequence();
        }
    })
}

// Chooses a quantity for purchase.
function quantityChoice() {
    inquirer.prompt([
        {
            type: "input",
            message: "How many would you like to buy?",
            name: "quantity",
        }
    ]).then(answers => {
        // Quantity tells us how many they want to buy, a variable we set for later.
        quantity = answers.quantity;
        // If the choice is valid, runs the next sequence of purchase.
        if (parseInt(quantity) > 0 && parseInt(quantity) < 10000000000000000000) {
            purchase();
        }
        // If the choice is invalid, restarts the function.
        else {
            console.log("That is not a valid selection.");
            quantityChoice();
        }
    })

};

// If there's enough in stock, purchases the item by updating the stock and giving them the cost of it.
function purchase() {
    // Runs a for loop to grab the correct inventory item.
    for (let i = 0; i < inventory.length; i++) {
        if (parseFloat(inventory[i].item_id) === parseFloat(id)) {
            // If the requested amount exceeds our stock, denies the purchase and resets them to the choose item screen.
            if (parseFloat(inventory[i].stock_quantity) < parseFloat(quantity)) {
                console.log("Sorry, there is not enough inventory in stock.")
                setTimeout(function () { promptSequence() }, 500);
            }
            // If the requested amount meets our stock, approves it, updates the stock, offers more purchases.
            else {
                total = (parseFloat(inventory[i].price) * parseFloat(quantity)).toFixed(2);
                newQuantity = parseFloat(inventory[i].stock_quantity) - parseFloat(quantity);
                console.log("Your total purchase costs $" + total);
                connection.query("UPDATE products SET ? WHERE ?",
                    [
                        { stock_quantity: newQuantity },
                        { item_id: inventory[i].item_id }
                    ],
                    function (err, res) {
                        if (err) throw err;

                    })
                talkShop();
            }
        }
    }
};

// Starts the whole deal.
startBamazon();