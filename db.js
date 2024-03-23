var Pool = require("pg-pool");
var setting = require("./settings");
var conn;
exports.doQuery = function (sqlQ, callback) {
	
	if(conn){
		console.log("--------IF--------------");
		conn.connect().then(function(client){
			console.log("-----database connected-------");
			// console.log("sqlQ--=========",sqlQ);
			client.query('BEGIN').then(function(res){
				// console.log("---------begin happened--------")
				// console.log("---------begin data--------",res);
			    client.query(sqlQ).then(function(res1){
			    	// console.log("---------execution done--------");
			    	// console.log("---------execution data--------",res1);
			    	client.query('COMMIT').then(function(res2){
			    		// console.log("---------commited done--------");
			    		// console.log("---------commit data--------",res2);
			    		client.release()
			    		callback({ "msg":"1", "data":res1['rows']});
			    	})
			    }).catch(function(err) {
			    	client.query('ROLLBACK').then(function(res2){
					    client.release()
					    console.error('query error', err.message, err.stack)
					    callback({ "msg":"-1", "data":err});
					    callback(err);
			    	})
				  })
			    // client.release()
		  	})
		  .catch(function(err) {
		    client.release()
		    console.error('query error', err.message, err.stack)
		    callback({ "msg":"-1", "data":err});
		    callback(err);
		  })
		})
	}else{
		console.log("--------ELSE--------------");
		conn = new Pool(setting.dbConfig);
		conn.connect().then(function(client){
			console.log("-----database connected-------");
			console.log("sqlQ--=========",sqlQ);
			client.query('BEGIN').then(function(res){
				// console.log("---------begin happened--------")
				// console.log("---------begin data--------",res);
			    client.query(sqlQ).then(function(res1){
			    	// console.log("---------execution done--------");
			    	// console.log("---------execution data--------",res1);
			    	client.query('COMMIT').then(function(res2){
			    		// console.log("---------commited done--------");
			    		// console.log("---------commit data--------",res2);
			    		client.release()
			    		callback({ "msg":"1", "data":res1['rows']});
			    	})
			    }).catch(function(err) {
				    client.query('ROLLBACK').then(function(res2){
					    client.release()
					    console.error('query error', err.message, err.stack)
					    callback({ "msg":"-1", "data":err});
			    	})
				  })
			    // client.release()
		  	})
		  .catch(function(err) {
		    client.release()
		    console.error('query error', err.message, err.stack)
		    callback({ "msg":"-1", "data":err});
		  })
		}).catch(function(err){
			console.error('query error', err.message, err.stack)
		    callback({ "msg":"-1", "data":err});
		})
	}

}