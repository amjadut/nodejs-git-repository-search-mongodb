<p align="center">Nodejs - Git Repository Search By Topic</p>

## About

A program that let's user search for repositories in GitHub by language or topic using GitHub’s well documented APIs with the search results paginated.

## Prerequisite

* Node js installed on the system
* Mongo DB

## Steps

* Create a folder for your project go to that path in CMD
* Initialize and install common libraries
	* npm init  :- To create your package.json file which have all the details about the projects.
	* npm install nodemon --save-dev
	* npm install express --save  :- Install express and save that dependency.
	* npm install body-parser ejs --save  :- Request parser and ejs template for frontend
* Create index.js inside src folder and configure that
* Point index.js as startup script inside package.json
* Set up Mongo DB
	* npm install mongodb
	* Add var mongo = require('mongodb'); inside src/index.js
	* Add a DB file inside database folder and node gitSearchDB.js
	* Add a Collection file inside database folder and node gitSearchCollection.js