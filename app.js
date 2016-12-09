var express = require('express');
var request = require('request');
var app = express();

var txUrl = "http://localhost:7474/db/data/transaction/commit";

//normal index page output
app.get('/', function (req, res) {
  res.send('<h2>This is the neo4j example TEST TEST</h2>');
});


// data get route returns the node we created
app.get('/data', function (req, res) {
	var query="MATCH (n:AdminRules) RETURN n LIMIT 100";

	var promise = doDatabaseOperation(query);
	promise.then(function (data) {
		res.send(data)
	})

});

// data post route to create a node of type "AdminRules" and name attribute as "Jeff"
app.post('/data', function (req, res) {
	var query="CREATE (n:AdminRules {name:'Jeff'}) RETURN n";

	var promise = doDatabaseOperation(query)
	promise.then(function (data) {
		res.send(data)
	})

});


// data get route returns the node with name=given parameter
app.get('/data/:name', function (req, res) {
	var query="MATCH (n:AdminRules {name: {nameParam}}) RETURN n LIMIT 100";
	var params = {
		nameParam : req.params.name
	}

	var promise = doDatabaseOperation(query, params);
	promise.then(function (data) {
		res.send(data)
	})

});

// data post route to create a node of type "AdminRules" and name attribute as given parameter
app.post('/data/:name', function (req, res) {
	var query="CREATE (n:AdminRules {name:{nameParam}}) RETURN n";
	
	var params = {
		nameParam : req.params.name
	}

	var promise = doDatabaseOperation(query, params);
	promise.then(function (data) {
		res.send(data)
	})

});





var doDatabaseOperation = function (query, params) {
	return new Promise(function (resolve, reject) {
		request.post({
			uri:txUrl,
			headers:{
				
				//*****************ENCODED USERNAME:PASSWORD BELOW*****************
				"Authorization": "Basic bmVvNGo6bmVvNGoy"									
				//*****************************************************************
			},
			json:{
				statements:[
					{
						statement:query,
						parameters:params
					}
				]
			}
		},
	    function(err,res){
	    	if(err)
	    		reject(err)
	    	else
		    	resolve(res.body)
	    })
	});	
}

module.exports = app;