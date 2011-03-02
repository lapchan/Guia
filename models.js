var ghttp = require('./modules/ghttp').ghttp,
		gm = require('./modules/googlemaps'),
		Business;
		
function defineModels(mongoose, fn) {
	
	var mongoose = require('mongoose'),
			Schema = mongoose.Schema,
			ObjectId = Schema.ObjectId;
			
	Business = new Schema({
		id 			: ObjectId,
		name 		: String,
		address : String,
		city 		: String,
		state		: String,
		zip 		: String,
		loc     : { 
			lat : Number, 
			lng : Number 
		}
	});
	
	Business.virtual('fulladdress').get(function(){
		return this.address + ', ' + this.city + ', ' + this.state;
	});

	Business.pre('save', function(next){
		var querystring = require('querystring');
		var qs = querystring.stringify({
			address : this.fulladdress,
			sensor 	: false,
			key 		: "ABQIAAAAnudFE0wUU-3cEuAnntBdGhRi_j0U6kJrkFvY4-OX2XYmEAa76BQSbPilpNwbeQoyvzGKSdRJH2eFtA"
		});
		
		var uri = 'http://maps.googleapis.com/maps/api/geocode/json?' + qs;
		
		console.log(uri);
		ghttp.createRequest(uri);
		next();
	});
	
	/*
	Business.pre('save', function(next){
		
		gm.geocode(this.fulladdress, function(err, data){
		    console.log(JSON.stringify(data));
		}, 'false');
		next();
	});
	*/
	
	Business.index( { loc : "2d" } )
	
	mongoose.model('Business', Business);
	
	fn();
}

exports.defineModels = defineModels;