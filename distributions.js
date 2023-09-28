"use strict";
const fs = require('fs');
const {
    flattenFeesObject,
    flattenFees,
    calculateFees,
    flatenOrderObject,
} = require('./functions');

let feesRaw = fs.readFileSync('fees.json');
let fees = JSON.parse(feesRaw);

let ordersRaw = fs.readFileSync('orders.json');
let orders = JSON.parse(ordersRaw);

const flattenedFees = flattenFeesObject(fees);
const flattenedOrders = flatenOrderObject(orders);

let indexEdit = 0;
let orderNumber = "";

let finalOrderList = [];
let typesObject = {};

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
        finalOrderList[i]["keep"] = true;
        continue;
    }

    const extractedFees = flattenFees(flattenedFees[order["type"]]["fees"]);

    finalOrderList[i]["total"] = calculateFees(extractedFees["flat_fee"], extractedFees["per_page_fee"], order["pages"]);

    finalOrderList[indexEdit]["total"] += finalOrderList[i]["total"];

    const keyString = order["order_number"] + order["type"];
    if (i == indexEdit + 1) {
        typesObject[keyString] = i;
        finalOrderList[i]["keep"] = true;
        continue;
    }

    if (keyString in typesObject) {
        const indexImportant = typesObject[keyString];
        finalOrderList[indexImportant]["total"] += order["total"];
        finalOrderList[i]["keep"] = false;
        continue;
    }

    typesObject[keyString] = i;
    finalOrderList[i]["keep"] = true;
}

let ordersDistributions = [];

finalOrderList.forEach((item) => {
    ordersDistributions.push(item);
    if (item["class"] == "order_item") {
        ordersDistributions.push(flattenedFees[item["type"]]["distributions"]);
    }

});
ordersDistributions = ordersDistributions.flat();

let mainIndexes = [];
let itemIndexes = [];
let fundIndexes = [];
let allIndexes = [];

for (let i = 0; i < ordersDistributions.length; i++) {
    allIndexes.push(i);
    let order = ordersDistributions[i];
    if (order["class"] == "order_main") {
        mainIndexes.push(i);
        continue;
    }
    if (order["class"] == "order_item") {
        itemIndexes.push(i);
        continue;
    }
    fundIndexes.push(i);
}

mainIndexes.push(allIndexes.length);

allIndexes.sort(function (a, b) { return a - b });
mainIndexes.sort(function (a, b) { return a - b });

let belongingRefs = {};

for (const index of allIndexes) {
    if (index == 0) {
        belongingRefs[index] = index.toString();
        continue;
    }
    if (index > mainIndexes[0] && index < mainIndexes[1]) {
        belongingRefs[index] = mainIndexes[0].toString();
        continue;
    }
    if (index == mainIndexes[1]) {
        belongingRefs[index] = index.toString();
        mainIndexes.shift();
        continue;
    }
}

indexEdit = 0;
let summaryList = [];

for (const [i, order] of ordersDistributions.entries()) {

    if (order["class"] == "order_main") {
        indexEdit = i;
        ordersDistributions[i]["funds_sum"] = 0;
        ordersDistributions[i]["other"] = 0;
        indexEdit = i;
        continue;
    }
    if (order["class"] == "order_item") {
        continue;
    }

    ordersDistributions[indexEdit]["funds_sum"] += Number(order["amount"]);

}

for (const [i, order] of ordersDistributions.entries()) {

    if (order["class"] == "order_item" || order["class"] == "fund_item") {
        continue;
    }
    ordersDistributions[i]["other"] = ordersDistributions[i]["total"] - ordersDistributions[i]["funds_sum"];
}

let fundsRef = {}
let indexSearch = 0;

for (const [i, order] of ordersDistributions.entries()) {

    if (order["class"] == "order_main") {
        summaryList.push(order);
        indexSearch = summaryList.length - 1;
        continue
    }
    if (order["class"] == "order_item") {
        continue;
    }
    if (order["name"] in summaryList[indexSearch]) {
        const length = summaryList[indexSearch][order["name"]];
        summaryList[indexSearch][order["name"]] = length + 1;

        const importantIndex = fundsRef[order["name"] + summaryList[indexSearch]["order_number"]];
        summaryList[importantIndex]["amount"] = summaryList[importantIndex]["amount"] + Number(order["amount"]);
        continue;
    }

    fundsRef[order["name"] + summaryList[indexSearch]["order_number"]] = summaryList.length;

    summaryList[indexSearch][order["name"]] = 1;

    const objectAdd = {
        "fund_n": order["name"],
        "amount": Number(order["amount"])
    }


    summaryList.push(objectAdd);
}

let finalFundsList = [];
let finalFundsRef = {};

let otherSum = 0;

for (const [i, order] of ordersDistributions.entries()) {
    if (order["class"] == "order_main") {
        otherSum += order["other"];
        continue;
    }

    if (order["class"] == "order_item") {
        continue;
    }

    if (order["name"] in finalFundsRef) {
        const importantIndex = finalFundsRef[order["name"]]
        finalFundsList[importantIndex]["amount"] = finalFundsList[importantIndex]["amount"] + Number(order["amount"]);
        continue;
    }

    finalFundsRef[order["name"]] = finalFundsList.length;

    const objectAdd = {
        "fund_n": order["name"],
        "amount": Number(order["amount"])
    }

    finalFundsList.push(objectAdd);
}

finalFundsList.push({
    "fund_n": "Other",
    "amount": otherSum
});

let indexFinal = 0

for (const [i, order] of summaryList.entries()) {
    if (order["class"] == "order_main") {
        indexFinal = i;
        console.log("Order ID: " + order["order_number"]);
        continue;
    }
    console.log("  Fund - " + order["fund_n"] + ": $" + order["amount"]);
    if (i == summaryList.length - 1) {
        console.log("  Fund - Other: $" + summaryList[indexFinal]["other"] + "\n");
        continue;
    }
    if (summaryList[i + 1]["class"] == "order_main") {
        console.log("  Fund - Other: $" + summaryList[indexFinal]["other"] + "\n");
    }
}

console.log("Total distributions:");
for (const [i, order] of finalFundsList.entries()) {
    console.log("  Fund - " + order["fund_n"] + ": $" + order["amount"]);
}

return;