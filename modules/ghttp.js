var querystring = require('querystring'),
		http = require('http');
		parse = require('url').parse;
		
var ghttp = {
	createRequest : function(url) {
		console.log(url);
		var uri = parse(url, true);
		
		if (uri.protocol == "http:" && !uri.port) {
			uri.port = 80;
		}
		
		if (!uri.pathname){
			uri.pathname = "/";
		}
		
		var client = http.createClient(80, uri.hostname);
		console.log(uri);
		var request = client.request("GET", uri.pathname + uri.search, 
		{	
			'Content-Type':'application/json',
			"host" : uri.hostname
		});
		
		request.on('response', function(response){
			var result = "";
			response.on('data', function(chunk){
				result += chunk;
			})
			response.on('end', function () {
				if(response.statusCode == 200){
					console.log(result);
				}else{
					console.log(new Error('Response Status code: ' + response.statusCode), result);
				}
			});
			response.on('error', function (error) {
				console.log(error);
			});
		});
		request.end();
	}
}

exports.ghttp = ghttp;