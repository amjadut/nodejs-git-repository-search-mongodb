const express = require('express');
const app = express();
const port = 3000;
const baseUrl = `http://localhost:${port}`;
const bodyParser = require('body-parser');
var mongo = require('mongodb');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', 'views');
var gitsearchFn = require('./gitsearchModule');
var gitsearchReportFn = require('./gitsearchReportsModule');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get('/', (req, res) => {
	res.render('gitsearch',{totalCount: 0, totalPages: 0, takeCount: 0, currentPage: 1, searchValue: '', data: []});
});

app.get('/gitsearch', urlencodedParser, function (req, res) {
	gitsearchFn.performGitSearch(req,res);
});

app.get('/reports', urlencodedParser, function (req, res) {
	gitsearchReportFn.gitSearchReportAction(req,res);
});

// Server
app.listen(port, () => {
   console.log(`Listening on: http://localhost:${port}`);
});