var admincontroller = require('../controller/admincontroller');
var usercontroller = require('../controller/usercontroller');
var middleware = require('../middleware/middleware')

exports.do_routing = function(server){
	server.post('/addNewItemInSystem',[admincontroller.addNewItem]);
	server.post('/getGroceryList',[admincontroller.viewGroceryItems]);
	server.post('/removeFromGrocery',[admincontroller.removeGroceryItem]);
	server.post('/updateItemValues',[admincontroller.updateGroceryDetails]);
	server.post('/increaseQuantity',[admincontroller.increaseItemQuantity]);
	server.post('/decreaseQuantity',[admincontroller.decreaseItemQuantity]);
	server.post('/viewListOfGrocery',[usercontroller.viewGroceryList]);
	server.post('/confirmorder',[usercontroller.orderConfirmed]);
}