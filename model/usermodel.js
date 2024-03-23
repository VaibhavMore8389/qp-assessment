var db = require('../db');

exports.getAllGrocery = function(pageSize, pageNumber, callback){
	let query = ` select id,item_name,item_price, item_quantity from grocery_items where deleted_date is null and is_deleted = 0 order by id asc limit `+pageSize+` offset `+((pageSize*(pageNumber-1)) )+` `;
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

exports.insertIntoOrderDetails = function(insertQuery, callback){
	console.log(insertQuery);
	db.doQuery(insertQuery, function(resultSet){
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


exports.runQuery = function(query, callback){
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
