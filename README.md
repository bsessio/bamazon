#~~amazon~~ ... I mean bamazon

##Overview

Shop to your heart's content with this absolutely intolerably simple Bamazon app, that will 100% not send you any item you buy. But good news: it won't cost you anything!

##Instructions
Opening it, you just need to run ```node bamazonCustomer.js``` to get going. This will provide you with a full inventory and a buying prompt, allowing you to choose whether or not you want to pick any of our ~~diverse~~ minimal inventory!

If you do decide to buy, it will prompt you to select an item ID! Why not just the name of the item? Because the scope specified an item ID!

Upon choosing an item, you'll be asked to choose the quantity you want to buy, answering for us the age old question: how many things of toothpaste can one person purchase?

Assuming you choose a valid pretend quantity, the items will pretend to be purchased, give you a pretend receipt, and let you pretend to buy more items if you choose! You can keep doing this forever and ever, even if we run out of pretend stock, because I didn't set it up to just tell you to leave when everything is at 0. (But I could...)

##Package Dependencies

* promise-mysql is an NPM package that uses mysql, but adds some functionality for promise statements.
* inquirer is an NPM package that manages a prompt system for our game handling.

## Screenshots
#Initial screen
![alt text](2.png)
#Initialize the node.
![alt text](3.png)
![alt text](4.png)
#Answer the prompt Yes to buy.
![alt text](5.png)
#Select the item ID to buy.
![alt text](6.png)
#Select the quantity to buy. I chose too many.
![alt text](7.png)
#Select the quantity to buy.
![alt text](8.png)
#Choose to buy another item.
![alt text](9.png)
#It gives a new screen of updated inventory.
![alt text](10.png)
#The rest still works
![alt text](11.png)
![alt text](12.png)
![alt text](13.png)

#Some foolproofing against erroneous entries.
![alt text](14.png)
![alt text](15.png)
![alt text](16.png)

## Authors

* **Bowie Sessions** - *Initial work* 

## Acknowledgments

* Thanks to Lynn for her assistance!
* Thanks to Joe and Rory for their hard work and advice!