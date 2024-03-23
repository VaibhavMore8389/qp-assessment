var db = require('../db');
var usermodel = require('../model/usermodel');
var moment = require('moment')

exports.viewGroceryList = function(req,res,next){

	try{
		let pageSize = req.body.page_size ? req.body.page_size : 10;
		let pageNumber = req.body.page_number ? req.body.page_number : 1;

		usermodel.getAllGrocery(pageSize, pageNumber, function(groceryList,err){
			if(err){ 
				console.log("Error : ", err);
				res.send({
					"msg":"3",
					"result" : "Something went wrong !! "
				})
			} else {

				if(groceryList.length > 0 ){
					let responseArr = [];

					for(let i=0; i<groceryList.length; i++){
						
						let tempObj = {};
						tempObj.itemId = groceryList[i].id;
						tempObj.itemName = groceryList[i].item_name;
						tempObj.itemPrice = groceryList[i].item_price;
						responseArr.push(tempObj);

					}

					res.send({
						"msg":"1",
						"result":"success",
						"resultData":responseArr
					})
				} else {
					console.log("No list available !! ");
					res.send({
						"msg":"2",
						"result" : "No list available !!"
					})
				}
			}
		})
	}
	catch(err){
		console.log("Error : ", err);
		res.send({
			"msg":"3",
			"result" : "Something went wrong !! "
		})
	}
}


exports.orderConfirmed = function(req,res,next){

	let orderGroceryData = req.body.order_grocery_data; // must be array of order details
	let _self = this;

	if(orderGroceryData.length > 0 ){
		
		let insertStr = ``; 
		let orderAttributes = {};
		let orderPrice = 0;
		let paymentMethod = req.body.payment_method;
		let orderDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
		let userId = req.body.userid;
		let userName = req.body.username;
		let orderAddress = req.body.order_address;
		let pincode = req.body.pincode;
		let userMobileNo = req.body.user_mobileno;
		let updateQuantityQueryArr = [];

		for(let i=0; i<orderGroceryData.length; i++){
			orderAttributes['itemId_'+i] = orderGroceryData[i].item_id;
			orderAttributes['itemName_'+i] = orderGroceryData[i].item_name;
			orderAttributes['itemPrice_'+i] = orderGroceryData[i].item_price;
			orderAttributes['itemQuantity_'+i] = orderGroceryData[i].item_quantity;
			orderPrice += parseFloat(orderGroceryData[i].item_price);

			let tempQuery = ` update grocery_items A set item_quantity = A.item_quantity - `+orderGroceryData[i].item_quantity+ ` where id = `+orderGroceryData[i].item_id;
			updateQuantityQueryArr.push(tempQuery);

		}

		orderAttributes['orderPrice'] = orderPrice;
		orderAttributes['paymentMethod'] = paymentMethod;
		orderAttributes['orderDate'] = orderDate;
		orderAttributes['userId'] = userId;
		orderAttributes['userName'] = userName;
		orderAttributes['orderAddress'] = orderAddress;
		orderAttributes['pincode'] = pincode;
		orderAttributes['userMobileNo'] = userMobileNo;


		insertStr = `insert into order_details(order_attributes, order_price, payment_method, order_date, user_id, user_name, order_address, pincode, user_mobileno) values  ( $$`+JSON.stringify(orderAttributes)+`$$, `+orderPrice+`, '`+paymentMethod+`', '`+orderDate+`', `+userId+`, '`+userName+`', '`+orderAddress+`', `+pincode+`, `+userMobileNo+` )`;

		try{

			usermodel.insertIntoOrderDetails(insertStr, function(insertRes, err){
				if(err){ 
					console.log("Error : ", err);
					res.send({
						"msg":"3",
						"result" : "Something went wrong !! "
					})
				} else { 
					this._updateQuantityForItem(updateQuantityQueryArr,0, function(updateRes){

						console.log("Order placed successfully!!!");
						res.send({
							"msg":"1",
							"result":"Order placed successfully!!!"
						})
					})
				}
			})
		}
		catch(err){
			console.log("Error : ", err);
			res.send({
				"msg":"3",
				"result" : "Something went wrong !! "
			})
		}


	} else {
		console.log("No order data found !!! ");
		res.send({
			"msg":"2",
			"result" : "No order data found !!!"
		})
	}



}


_updateQuantityForItem = function(updateQuantityQueryArr, index, callback){
	let _self = this;
	if(index < updateQuantityQueryArr.length){
		try{

			usermodel.runQuery(updateQuantityQueryArr[index], function(updateRes){
				_updateQuantityForItem(updateQuantityQueryArr, ++index, callback)
			})
		}
		catch(err){
			console.log("Error : ", err);
			res.send({
				"msg":"3",
				"result" : "Something went wrong !! "
			})
		}
	} else {
		callback('success');
	}
}






