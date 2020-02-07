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

var sampleId = new ObjectId(1000);

module.exports = function (app) {

  //insert a book for testing purposes
  MongoClient.connect(MONGODB_CONNECTION_STRING, {useUnifiedTopology: true, useNewUrlParser: true}, function(err, client) {
        if (err) console.log('Error connecting to DB:\n' + err);     
        var db = client.db('test');
        var collection = db.collection('library'); 
        var wait = false;
        console.log('MongoDB initialization successful');    
        collection.deleteOne({_id: '1000'}, (err, ret)=>{
          if(err) console.log(err);
          else console.log('delete successfull');
        })
          collection.insertOne({_id: '1000', title: 'This is the title', comments: ['First comment']}, (err, ret)=>{
            if(err) console.log(err);
            else console.log(ret.ops[0]);
          })        
        setTimeout(function (){
          //console.log('Happening');
          collection.findOne({_id: '1000'}, (err, ret) => {
            //console.log('We have made it inside the findone function')
            if(err) console.log('ERROR: ' + err);
            if(!ret) {
              return console.log('No success fam');
            } else{
              return Promise.resolve(ret).then(console.log('success fam: ' + JSON.stringify(ret)));
            }
          })}, 100
          )
        
          
        //console.log(sampleId)
  });
  
//routing begins
  app.route('/api/books')
    .get(function (req, res){
      MongoClient.connect(MONGODB_CONNECTION_STRING, {useUnifiedTopology: true, useNewUrlParser: true}, function(err, client) {
        if (err) console.log('Error connecting to DB:\n' + err);     
        var db = client.db('test');
        var collection = db.collection('library'); 
        var arr = collection.find().toArray();
        var result = [];
        Promise.resolve(arr).then(array => {
          array.forEach(element => {
            element.commentcount = element.comments.length;
            result.push(element); 
          });
          res.json(result);}                      
        );
      });
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
          return res.json(doc.ops[0]);
        });
      });
    })

    .delete(function(req, res){
        MongoClient.connect(MONGODB_CONNECTION_STRING, {useUnifiedTopology: true, useNewUrlParser: true}, function(err, client) {
        if (err) console.log('Error connecting to DB:\n' + err);     
        var db = client.db('test');
        var collection = db.collection('library');
          collection.deleteMany({}, (err, ret) => {
            if(err) console.log(err)
            else res.send('complete delete successful');
          });
        });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      MongoClient.connect(MONGODB_CONNECTION_STRING, {useUnifiedTopology: true, useNewUrlParser: true}, function(err, client) {
        if (err) console.log('Error connecting to DB:\n' + err);     
        var db = client.db('test');
        var collection = db.collection('library');  
        //console.log('MongoDB initialization successful');
        collection.findOne({_id:bookid},(error,result)=>{
          if(error) console.log(error)
          if (!result) {
            res.send('Book does not exist');
          } else {
            res.json(result);
          }
      });
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    });
  })

    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      MongoClient.connect(MONGODB_CONNECTION_STRING, {useUnifiedTopology: true, useNewUrlParser: true}, function(err, client) {
        if (err) console.log('Error connecting to DB:\n' + err);     
        var db = client.db('test');
        var collection = db.collection('library');
        var comarray = collection.findOne({_id: bookid}, (err, ret)=> {
          if(err) console.log(err);
          return ret.comments;
        });
        Promise.resolve(comarray).then( result => {
          console.log(result);
          comarray.push(comment);
          collection.findOneAndUpdate({_id: bookid}, {comments:comarray}, (err, ret) =>{
            if(err) console.log(err);
            return res.json(ret);
          })
        })
       
      });
      //json res format same as .get
    })

    .delete(function(req, res){
      var bookid = req.params.id;
      MongoClient.connect(MONGODB_CONNECTION_STRING, {useUnifiedTopology: true, useNewUrlParser: true}, function(err, client) {
        if (err) console.log('Error connecting to DB:\n' + err);     
        var db = client.db('test');
        var collection = db.collection('library'); 
      });
      //if successful response will be 'delete successful'
    });


};
