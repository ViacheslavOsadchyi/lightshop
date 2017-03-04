var Product = require('./models/product');
var mongoose = require('mongoose');

mongoose.Promise = require('bluebird');

mongoose.connect('localhost:27017/liteshop');

var products = [
	new Product({
		imgPath: 'uploads/img/product1.jpg',
		title: 'Product #1',
		desc: 'Good Product',
		price: 10
	}),
	new Product({
		imgPath: 'uploads/img/product2.jpg',
		title: 'Product #2',
		desc: 'Awesome Product!!!',
		price: 20
	})
];

var saved = 0;
for (var i=0; i < products.length; i++){
	var product = products[i];
	product.save(function (){
		saved++;
		if ( saved === products.length  ){
			mongoose.disconnect();
		}	
	});
};
