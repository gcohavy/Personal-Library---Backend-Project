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

  //insert a book for testing purposes
  MongoClient.connect(MONGODB_CONNECTION_STRING, {useUnifiedTopology: true, useNewUrlParser: true}, function(err, client) {
        if (err) console.log('Error connecting to DB:\n' + err);     
        var db = client.db('test');
        var collection = db.collection('library');      
        console.log('MongoDB initialization successful');
        collection.deleteOne({_id: 1000}, (err, ret)=>{
          if(err) console.log(err);
          else console.log('delete successfull');
        })
        collection.insertOne({_id: 1000, title: 'This is the title', comments: ['First comment']}, (err, ret)=>{
          if(err) console.log(err);
          else console.log('book successfully inserted: ' + ret);
        })
  });
  
//routing begins
  app.route('/api/books')
    .get(function (req, res){
      MongoClient.connect(MONGODB_CONNECTION_STRING, {useUnifiedTopology: true, useNewUrlParser: true}, function(err, client) {
        if (err) console.log('Error connecting to DB:\n' + err);     
        var db = client.db('test');
        var collection = db.collection('library'); 
        collection.find((err, doc)=>{
          if(err) console.log(err);
          var result = [];
          //console.log(doc);
          if(doc.ops){
            for (var book in doc.ops) {
              result.push({title: book.title, _id: book._id, commentcount: book.comments.length()})
            }
          }
          else {
            result.push({title: 'No Titles', _id:0, commentcount: 0});
          }
          
          //console.log(result);
          return res.json(result);
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
          doc.ops[0]._id = doc.ops.length;
          //console.log(doc.ops);
          return res.json(doc.ops[0]);
        });
      });
    })

    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      console.log('in the get function');
      var bookid = req.params.id;
      var uid = new ObjectId(bookid);
      console.log(uid);
      console.log(req.params.id);
      MongoClient.connect(MONGODB_CONNECTION_STRING, {useUnifiedTopology: true, useNewUrlParser: true}, function(err, client) {
        if (err) console.log('Error connecting to DB:\n' + err);     
        var db = client.db('test');
        var collection = db.collection('library');      
        //console.log('MongoDB initialization successful');
        console.log(bookid);
        collection.findOne({_id: 1000}).then(result=>{
          result ? console.log(result) : console.log('no result'); 
        });
        
      });
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