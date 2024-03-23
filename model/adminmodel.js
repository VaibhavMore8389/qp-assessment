var db = require('../db');


exports.insertIntoItemTbl = function(insertItemObj,callback){
	let query = ` insert into grocery_items(item_name, item_price, item_quantity, is_deleted ) values ('`+insertItemObj.itemName +`', `+insertItemObj.itemPrice +`, `+insertItemObj.itemPrice +`, 0 )`;
	console.log(query);
	db.doQuery(query, function(resultSet){
		if(resultSet['msg']!='1'){
			console.log("Err: ",resultSet['data']);
			callback( null ,new Error(resultSet['data']));
			// throw err;
			// callback(err);
		} else {
			callback(resultSet['data']);
		}
	})
}

exports.getAllGroceryList = function(pageSize,pageNumber,callback){
	let query = ` select id,item_name,item_price, item_quantity from grocery_items where deleted_date is null and is_deleted = 0 order by id asc limit `+pageSize+` offset `+((pageSize*(pageNumber-1)) )+` `;
	console.log(query);
	db.doQuery(query, function(resultSet, err){
		if(resultSet['msg']!='1'){
			console.log("Err: ",resultSet['data']);
			callback( null ,new Error(resultSet['data']));
		} else {

			callback(resultSet['data']);
		}
	})
}

exports.removeGroceryByItemId = function(itemId,callback){
	let query = ` update grocery_items set deleted_date = now() , is_deleted = 1 where id =  `+itemId+` `;
	console.log(query);
	db.doQuery(query, function(resultSet, err){
		if(resultSet['msg']!='1'){
			console.log("Err: ",resultSet['data']);
			callback( null ,new Error(resultSet['data']));
		} else {
			callback(resultSet['data']);
		}
	})
}

exports.updateDetailsOfItem = function(updateQuery,callback){

	console.log(updateQuery);
	db.doQuery(updateQuery, function(resultSet, err){
		if(resultSet['msg']!='1'){
			console.log("Err: ",resultSet['data']);
			callback( null ,new Error(resultSet['data']));
		} else {
			callback(resultSet['data']);
		}
	})
}


exports.updateItemQuantity = function(itemId,quantityToUpdate,method,callback){
	
	let query = '';
	if(method == 'add'){
		query = ` update grocery_items A set item_quantity = A.item_quantity + `+quantityToUpdate+ ` where id = `+itemId+` `;
	} else {
		query = ` update grocery_items A set item_quantity = A.item_quantity - `+quantityToUpdate+ ` where id = `+itemId+` `;
	}
	
	console.log(query);
	db.doQuery(query, function(resultSet, err){
		if(resultSet['msg']!='1'){
			console.log("Err: ",resultSet['data']);
			callback( null ,new Error(resultSet['data']));
		} else {
			callback(resultSet['data']);
		}
	})
}


