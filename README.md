SOLUTION:

The solution of part 1 of the exercise is in the fees.js file. The solution fot part 2 of the exercise is in the distributions.js file. Running each of this files will output the required results as specified below.

Part 1: Fees

The file fees.json describes fees that are applied to different types of items in an order. Each type of item in a order can have one or more fees associated with it.
The total cost for the order item is the aggregate of all of fees associated with that item. There are different types of fees. Flat fees are simply a single charge. Per-page fees add an additional fee on top of a flat fee for each page after the first.

Challenge:

Write Javascript that outputs to the console the prices for each order item and order in the orders.json file based on the fees in the fees.json file. 

The output should be of the form:  
```
Order ID: <order number>  
   Order item <n>: $<price>  
   ..
   ..

   Order total: <total>
```


Part 2: Distributions

Each fee has a set of funds associated with it. The money associated with each fee is split among the funds based on the amount specified in the distribution. Any extra money associated with the order that isn't allocated to a fund should be assigned to a generic "Other" fund.

Challenge:

Write Javascript that outputs to the console the fund distributions for each order in the orders.json file, and then output the totals in each fund after processing all orders.

The output should be of the form:  
```
Order ID: <order number>  
  Fund - <fund_n>: $<amount>
  Fund - <fund_m>: $<amount>
  ..  
  ..  

Order ID: <order number>
  Fund - <fund_n>: $<amount>
  Fund - <fund_m>: $<amount>
  ..  
  ..  
  ..  

Total distributions:
  Fund - <fund_n>: $<amount>
  Fund - <fund_m>: $<amount>
  ..  
  ..  
```


Returning the completed challenge:

You may choose to send us a link to a public cloud file-sharing service (google drive, dropbox, etc), or you can send an invitation to view a private github repository with your solution.  The link you provide may be used by multiple individuals from our team, so make sure your link is not limited one person.