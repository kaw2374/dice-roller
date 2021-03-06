/*
 * Module dependencies
 */
var express = require('express');
var app = express();
var stylus = require('stylus');
var nib = require('nib');
var exphbs = require('express-handlebars');
var bodyparser = require('body-parser');
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);


http.listen(8080);
console.log('listening on 8080');

/* 
 * Stylus styling setup
 *
 */
 function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))

/* 
 * Handlebars templating setup
 *
 */
app.set('views', __dirname + '/views');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


app.use(express.logger('dev'));

app.use(express.static(__dirname + '/public'));
app.use(bodyparser.urlencoded({extended: false}));


/*
 * loads template dice.handlebars
 *
 */
app.get('/', function (req, res) {
  res.render('dice.handlebars');
})

/*
 * CURRENTLY IRRELEVANT WITH SOCKET.IO SETUP
 * loads template dice.handlebars with result of dice roll
 *
 */
app.post('/', function(req, res) {
  res.render('dice.handlebars', {result: calculateRoll(req.body.sides, req.body.how_many)});
})


/*
 * receives dice roll emission on submission, emits values back to template
 *
 */
io.on('connection', function(socket){
  console.log('made connection');
  socket.on('dice roll', function(vars){
    socket.emit('dice roll', vars);
  });
});



