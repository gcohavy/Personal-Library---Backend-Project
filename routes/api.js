/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;



module.exports = function (app) {


  app.route('/api/books')
    .get(function (req, res){
      MongoClient.connect(MONGODB_CONNECTION_STRING, {useUnifiedTopology: true, useNewUrlParser: true}, function(err, client) {
        if (err) console.log('Error connecting to DB:\n' + err);     
        var db = client.db('test');
        var collection = db.collection('library');     
        
        collection.find((err, doc)=>{
          if(err) console.log(err);
          res.json(doc.ops);
        })
      });
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(function (req, res){  
      MongoClient.connect(MONGODB_CONNECTION_STRING, {useUnifiedTopology: true, useNewUrlParser: true}, function(err, client) {
        if (err) console.log('Error connecting to DB:\n' + err);     
        var db = client.db('test');
        var collection = db.collection('library');      
        //console.log('MongoDB initialization successful');
        
        var title = req.body.title;
        if(!title) return res.send('Missing title');
        var book = {title: title, comments: []};
        collection.insertOne(book, function (err, doc) {
          if(err) console.log('Error posting book to library:\n' + err);
          //console.log(doc);
          doc.ops[0]._id = doc.ops.length;
          return res.json(doc.ops[0]);
        });
      });
    })

    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    })

    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    });


};