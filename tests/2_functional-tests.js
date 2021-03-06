/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

var ida;

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({ title: 'Title' })
          .end((err,res)=>{
            assert.equal(res.status, 200);
            assert.exists(res.body._id);
            assert.equal(res.body.title, 'Title');
            assert.exists(res.body.comments);
            ida = res.body._id;
            //console.log(typeof(ida));
            done();
          })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .end((err, res)=> {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'Missing title');
          done();
        })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end((err,res)=>{
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.exists(res.body[0].title);
          assert.exists(res.body[0].commentcount);
          assert.exists(res.body[0]._id);
          done();
        })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/7abc' )
        .end((err,res)=>{
          assert.equal(res.status, 200);
          //console.log(res.text);
          assert.equal(res.text, 'Book does not exist');
          done();
        })        
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get('/api/books/1000')
        .end((err,res)=>{
          assert.equal(res.status, 200);
          assert.equal(res.body.title, 'This is the title');
          assert.equal(res.body.comments[0], 'First comment');
          assert.equal(res.body._id, '1000');
          done();
        })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post('/api/books/1000')
        .send({comment: 'Something random'})
        .end((err,res)=>{
          assert.equal(res.status, 200);
          assert.equal(res.body.title, 'This is the title');
          assert.equal(res.body.comments[res.body.comments.length-1], 'Something random');
          assert.equal(res.body._id, '1000');
          done();
        })        //done();
      });
      
    });

  });

});
