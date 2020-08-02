exports.performGitSearch = function(reqObj,renderResponse) {
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/";
	var dataFind = {username: 'amjad', searchValue: reqObj.query.search_value, currentPage: reqObj.query.current_page_num};
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("gitsearch");
		dbo.collection("gitsearch").findOne(dataFind).then(result => {
			if(result) {
				var totalPages = 1;
				if (result.totalCount!=0) {
					if (result.totalCount%result.takeCount==0) {
						totalPages = Math.floor(result.totalCount/result.takeCount);
					}
					else {
						totalPages = Math.floor(result.totalCount/result.takeCount);
						totalPages++;
					}
				}

				renderResponse.render('gitsearch',{totalCount: result.totalCount, totalPages: totalPages, takeCount: result.takeCount, currentPage: result.currentPage, searchValue: result.searchValue, data: result.results});
			}
			else {
				var https = require('https');
				var querystring = require('querystring');
				var host = 'api.github.com';
				var endpoint = '/search/repositories';
				var queryVal = querystring.stringify({page: reqObj.query.current_page_num});
				var headers = {
					'Content-Type': 'application/json',
					// 'Accept': 'application/vnd.github.v3+json',
					'Accept': 'application/vnd.github.mercy-preview+json',
					'User-Agent': 'Awesome-Octocat-App'
				};
				endpoint += '?q=topic:'+ encodeURIComponent(reqObj.query.search_value).replace(/%20/g, "+topic:") + '&' + queryVal + '&per_page=30&sort=stars&order=desc';
				var options = {
					host: host,
					path: endpoint,
					method: 'GET',
					headers: headers
				};
				var req = https.request(options, function (res) {
					var responseData = '';
					res.on('data', function (body) {
						responseData += body;
					});

					res.on('end', function () {
						responseDataTemp = JSON.parse(responseData);
						var totalPages = 1;
						var takeCountVal = 30;
						if (responseDataTemp.total_count!=0) {
							if (responseDataTemp.total_count%takeCountVal==0) {
								totalPages = Math.floor(responseDataTemp.total_count/takeCountVal);
							}
							else 
							{
								totalPages = Math.floor(responseDataTemp.total_count/takeCountVal);
								totalPages++;
							}
						}
						var newObj = {username: 'amjad', totalCount: responseDataTemp.total_count, takeCount: takeCountVal, searchValue: reqObj.query.search_value, currentPage: reqObj.query.current_page_num, results: responseDataTemp.items};
						dbo.collection("gitsearch").insertOne(newObj, function(err, resp) {
							if (err) throw err;

							db.close();
						});

						renderResponse.render('gitsearch',{totalCount: responseDataTemp.total_count, totalPages: totalPages, takeCount: takeCountVal, currentPage: reqObj.query.current_page_num, searchValue: reqObj.query.search_value, data: responseDataTemp.items});
					});
				});
				req.end();
			}
		});
	});
}