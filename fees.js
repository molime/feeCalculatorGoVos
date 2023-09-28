const fs = require('fs');
const {
    flattenFeesObject,
    flattenFees,
    calculateFees,
    flatenOrderObject
} = require('./functions');

let feesRaw = fs.readFileSync('fees.json');
let fees = JSON.parse(feesRaw);

let ordersRaw = fs.readFileSync('orders.json');
let orders = JSON.parse(ordersRaw);

const flattenedFees = flattenFeesObject(fees);
const flattenedOrders = flatenOrderObject(orders);

let indexEdit = 0;
let orderNumber = "";

let finalOrderList = []

flattenedOrders.forEach((order) => {
    if (orderNumber !== order["order_number"]) {
        finalOrderList.push({ "order_number": order["order_number"], "total": 0, "class": "order_main" });
        finalOrderList.push(order);
        orderNumber = order["order_number"];
    } else {
        finalOrderList.push(order);
    }
});

for (let i = 0; i < finalOrderList.length; i++) {
    let order = finalOrderList[i];

    if (order["class"] == "order_main") {
        indexEdit = i;
        continue;
    }

    const extractedFees = flattenFees(flattenedFees[order["type"]]["fees"]);

    finalOrderList[i]["total"] = calculateFees(extractedFees["flat_fee"], extractedFees["per_page_fee"], order["pages"]);

    if (i == indexEdit + 1) {
        finalOrderList[i]["n"] = 1
    } else {
        finalOrderList[i]["n"] = finalOrderList[i - 1]["n"] + 1
    }

    finalOrderList[indexEdit]["total"] += finalOrderList[i]["total"];
}

indexEdit = 0;


for (let i = 0; i < finalOrderList.length; i++) {
    let order = finalOrderList[i];

    if (order["class"] == "order_main" && i == 0) {
        console.log("Order ID: " + order["order_number"]);
        continue;
    }

    if (order["class"] == "order_main" && i !== 0) {
        console.log("\n   Order total: " + finalOrderList[indexEdit]["total"] + "\n");
        console.log("Order ID: " + order["order_number"]);
        indexEdit = i;
        continue;
    }
    console.log("   Order item " + order["n"] + ": $" + order["total"]);

    if (i == finalOrderList.length - 1) {
        console.log("\n   Order total: " + finalOrderList[indexEdit]["total"]);
    }
}