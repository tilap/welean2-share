var colors = require('colors');
var moment = require('moment');

module.exports = {

	log: function(message, object, color, previousText) {
		
		if (!color) {
			color = "black";
		}
		console.log((previousText+': '+ moment().format('MMMM Do YYYY, h:mm:ss a') + "  " +  message)[color].bold);
		if (object) {
			console.log(JSON.stringify(object, null, 4)[color]);
		}	
	},

	error: function(message, object) {
		this.log(message, object, 'red', '_ERROR_');
	},

	warning: function(message, object) {
		this.log(message, object, 'cyan', 'WARNING');
	},

	success: function(message, object) {
		this.log(message, object, 'green', 'SUCCESS');
	},

	youhou: function(message, object) {
		this.log(message, object, 'rainbow', 'SUCCESS');
	},

	info: function(message, object) {
		this.log(message, object, 'blue', 'INFO');
	}


}	