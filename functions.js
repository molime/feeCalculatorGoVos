const flattenFeesObject = (fees_list) => {
    let returnObj = {};

    fees_list.forEach((feeObject) => {
        returnObj[feeObject["order_item_type"]] = feeObject;
    });

    return returnObj;
}

const flattenFees = (fees_list) => {
    let returnObj = {};

    if (fees_list.length == 1) {
        returnObj["flat_fee"] = fees_list[0]["amount"];
        returnObj["per_page_fee"] = 0;
        return returnObj;
    }
    returnObj["flat_fee"] = fees_list[0]["amount"];
    returnObj["per_page_fee"] = fees_list[1]["amount"];
    return returnObj;
}

const calculateFees = (flat_fee, per_page_fee, pages_num) => {
    let pp_num = 0;
    let flat_num = pages_num;
    if (per_page_fee > 0) {
        pp_num = pages_num - 1;
        flat_num = 1;
    }

    return (flat_fee * flat_num) + (per_page_fee * pp_num);
}

const exctractON = (order_list) => {
    let numberList = [];

    order_list.forEach((orderObj) => {
        numberList.push(orderObj["order_number"]);
    });

    return numberList;
}

const flatenOrderObject = (order_list) => {
    let returnObj = {};
    const orderNumbers = exctractON(order_list);

    let currentOrderNum = "";

    let nestedList = [];

    let returnList = [];

    order_list.forEach((orderObject) => {
        returnObj[orderObject["order_number"]] = orderObject;
    });



    orderNumbers.forEach((orderNum) => {

        nestedList.push(orderNum);

        nestedList.push(returnObj[orderNum]["order_items"]);
    });

    let flattenedList = nestedList.flat();

    flattenedList.forEach((item) => {
        if (typeof item == "string") {
            currentOrderNum = item;
        } else {
            let objectAdd = item;
            objectAdd["order_number"] = currentOrderNum;
            objectAdd["class"] = "order_item";
            objectAdd["total"] = 0;
            returnList.push(objectAdd);
        }
    });

    return returnList;
}



module.exports = {
    flattenFeesObject,
    flattenFees,
    calculateFees,
    flatenOrderObject
};
