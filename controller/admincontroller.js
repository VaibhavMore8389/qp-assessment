var db = require('../db');
var adminmodel = require('../model/adminmodel');

exports.addNewItem = function(req,res,next){
	const userRole = req.headers['user-role']; // Assuming the user role is passed in headers
	if (userRole !== 'admin') {
	  	res.send(403, { error: 'Access Forbidden. Admin role required.' });
	} else {

		let newItemObj = req.body;

		if(!newItemObj.item_name || !newItemObj.item_price || !newItemObj.item_quantity){
			console.log("Some parameters are missing !!! ")
			res.send({
				"msg":"2",
				"result" : "Some parameters are missing! "
			})
		} else {
			let insertItemObj = {};
			insertItemObj.itemName = newItemObj.item_name;
			insertItemObj.itemPrice = newItemObj.item_price;
			insertItemObj.itemQuantity = newItemObj.item_quantity;

			if(insertItemObj.itemPrice <= 0){
				console.log("Item value cannot be zero !!! ")
				res.send({
					"msg":"3",
					"result" : "Item value cannot be zero! "
				})
			} else {
				try{ 
					adminmodel.insertIntoItemTbl(insertItemObj,function(insertRes,err){
						if(err){ 
							console.log("Error : ",err);
							res.send({
								"msg":"3",
								"result" : "Something went wrong !! "
							})
						} else { 
							console.log("Item added successfully !");
							res.send({
								"msg":"1",
								"result" : "Item added successfully ! "
							})
						}
					})
				}
				catch(err){
					
					res.send({
						"msg":"3",
						"result" : "Something went wrong !! "
					})
				}
			}


		}
	}
}


exports.viewGroceryItems = function(req,res,next){
	const userRole = req.headers['user-role']; // Assuming the user role is passed in headers
	if (userRole !== 'admin') {
	  	res.send(403, { error: 'Access Forbidden. Admin role required.' });
	} else {
		console.log("req.body : ",req.body);
		let pageSize = req.body.page_size ? req.body.page_size : 10;
		let pageNumber = req.body.page_number ? req.body.page_number : 1;
		console.log("pageSize : ",pageSize,"  ",pageNumber);
		try {
			adminmodel.getAllGroceryList(pageSize, pageNumber, function(groceryListRes,err){
				if(err){ 
					console.log("Error : ", err);
					res.send({
						"msg":"3",
						"result" : "Something went wrong !! "
					})
				} else { 
					if(groceryListRes.length > 0 ){
						let resArr = [];
						for(let i = 0; i<groceryListRes.length ; i++){
							let tempObj = {};
							tempObj.itemId = groceryListRes[i].id;
							tempObj.itemName = groceryListRes[i].item_name;
							tempObj.itemPrice = groceryListRes[i].item_price;
							tempObj.itemQuantity = groceryListRes[i].item_quantity;
							resArr.push(tempObj);
						}

						res.send({
							"msg":"1",
							"result":"success",
							"resultData":resArr
						})

					} else {
						console.log("No Grocery List Available !!! ");
						res.send({
							"msg":"2",
							"result" : "No Grocery List Available !!!"
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
}


exports.removeGroceryItem = function(req, res, next){
	const userRole = req.headers['user-role']; // Assuming the user role is passed in headers
	if (userRole !== 'admin') {
	  	res.send(403, { error: 'Access Forbidden. Admin role required.' });
	} else {
		let itemId = req.body.item_id; // we will get item_id which we have to delete from front end
		if(!itemId){
			console.log("Item Id missing foor deletion !!!");
			res.send({
				"msg":"2",
				"result" : "Item Id missing foor deletion !!!"
			})
		} else {
			try{

				adminmodel.removeGroceryByItemId(itemId, function(deleteRes, err){
					if(err){ 
						console.log("Error : ", err);
						res.send({
							"msg":"3",
							"result" : "Something went wrong !! "
						})
					} else { 
						console.log("Item removed successfully !!!");
						res.send({
							"msg":"1",
							"result":"Item removed successfully !!!"
						})
					}
				})
			} catch(err){
				console.log("Error : ", err);
				res.send({
					"msg":"3",
					"result" : "Something went wrong !! "
				})
			}
		}
	}
}


exports.updateGroceryDetails = function(req, res, next){
	const userRole = req.headers['user-role']; // Assuming the user role is passed in headers
	if (userRole !== 'admin') {
	  	res.send(403, { error: 'Access Forbidden. Admin role required.' });
	} else {
		let itemName = req.body.item_name ? req.body.item_name : '';
		let itemPrice = req.body.item_price ? req.body.item_price : '';
		let itemId = req.body.item_id;

		if(itemId){ 
			let updateQuery = '';
			if( !itemName && !itemPrice ) {
				console.log("Nothing foor updation !!!, Please check parameters . ");
				res.send({
					"msg":"2",
					"result" : "Nothing foor updation !!!, Please check parameters"
				})	
			}else if(itemName && itemPrice){
				updateQuery = `update grocery_items set item_name = '`+itemName+`' , item_price = `+itemPrice+`, updated_date = now() where id = `+itemId+`;`;
			
			} else if(itemName) { 
				updateQuery = `update grocery_items set item_name = '`+itemName+`', updated_date = now()  where id = `+itemId+`;`;
			} else if(itemPrice) { 
				updateQuery = `update grocery_items set item_price = `+itemPrice+`, updated_date = now()  where id = `+itemId+`;`;
			}

			try{

				adminmodel.updateDetailsOfItem(updateQuery,function(updateRes, err){
					if(err){ 
						console.log("Error : ", err);
						res.send({
							"msg":"3",
							"result" : "Something went wrong !! "
						})
					} else {

						console.log("Details updated successfully!!!");
						res.send({
							"msg":"1",
							"result" : "Details updated successfully!!!"
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
			console.log("Item Id missing foor updation !!!");
			res.send({
				"msg":"4",
				"result" : "Item Id missing foor updation !!!"
			})
		}

	}
}


// manage inventory levels of grocery apis


exports.increaseItemQuantity = function(req, res, next){
	try{ 
		let updationType = req.body.updateType; // update type can be "By Admin" or "By Default"

		if(updationType === 'By Admin'){
			const userRole = req.headers['user-role']; // Assuming the user role is passed in headers
			if (userRole !== 'admin') {
			  	res.send(403, { error: 'Access Forbidden. Admin role required.' });
			  	return;
			} 
		}

		let itemId = req.body.item_id;
		let increaseQuantity =  req.body.increased_quantity ? req.body.increased_quantity : 0;

		if(!itemId){
			console.log("Item Id missing foor updation !!!");
			res.send({
				"msg":"2",
				"result" : "Item Id missing foor updation !!!"
			})
		} else {

			try {

				adminmodel.updateItemQuantity(itemId, increaseQuantity, 'add', function(updateRes, err){
					if(err){ 
						console.log("Error : ", err);
						res.send({
							"msg":"3",
							"result" : "Something went wrong !! "
						})
					} else { 
						console.log("Quantity Updated !!!");
						res.send({
							"msg":"1",
							"result" : "Quantity Updated !!!"
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
		}
	}
	catch(err){
		console.log("err", err);
		res.send({
			"msg":"3",
			"result" : "Something went wrong !! "
		})
	}
}


exports.decreaseItemQuantity = function(req, res, next){
	try{ 
		let updationType = req.body.updateType; // update type can be "By Admin" or "By Default"

		if(updationType === 'By Admin'){
			const userRole = req.headers['user-role']; // Assuming the user role is passed in headers
			if (userRole !== 'admin') {
			  	res.send(403, { error: 'Access Forbidden. Admin role required.' });
			  	return;
			} 
		}

		let itemId = req.body.item_id;
		let decreaseQuantity =  req.body.decreased_quantity ? req.body.decreased_quantity : 0;

		if(!itemId){
			console.log("Item Id missing foor updation !!!");
			res.send({
				"msg":"2",
				"result" : "Item Id missing foor updation !!!"
			})
		} else {
			try{

				adminmodel.updateItemQuantity(itemId, decreaseQuantity, 'subtract', function(updateRes, err){
					if(err){ 
						console.log("Error : ", err);
						res.send({
							"msg":"3",
							"result" : "Something went wrong !! "
						})
					} else {
						console.log("Quantity Updated !!!");
						res.send({
							"msg":"1",
							"result" : "Quantity Updated !!!"
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
		}
	}
	catch(err){
		console.log("err", err);
		res.send({
			"msg":"3",
			"result" : "Something went wrong !! "
		})
	}
}







