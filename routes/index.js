const prefix = 'STSY';

class Room {
  constructor(id, subject, password) {
      this.id = id;
      this.name = prefix + subject + 'room' + id.toString();
      this.subject = subject;
      this.password = password;
      this.numMembers = 0;
      this.maxRoomSize = 8;
  }
}

var express = require('express');
const app = require('../app');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

rooms = [];

router.param('room', function(req, res, next, id){
  req.room = rooms.find(room => room.id == id);
  next();
});

/* Returns the room at an index in json */
router.get('/room/:room', function(req, res, next) {
  res.json(req.room);
});

router.param('subject', function(req, res, next, subject){
  req.subject = subject;
  next();
});

/* Returns all rooms of a subject in json */
router.get('/subject/:subject', function(req, res, next) {
  res.json(rooms.filter(room => room.subject == req.subject));
});

router.param('increment', function(req, res, next, amount) {
  req.increment = Number(amount);
  next();
});

/* Increments the numMembers of a specific index by an amount */
router.put('/room/:room/:increment', function(req, res, next) {
  if (req.room.numMembers + req.increment <= req.room.maxRoomSize && req.room.numMembers + req.increment >= 0) {
    req.room.numMembers += req.increment;
    res.send('Success');
  } else {
    res.send('Failure');
  }
});

router.param('password', function(req, res, next, password) {
  req.password = password;
  next();
});

/* Adds a new room of a certain subject and password */
router.put('/add/:subject/:password', function(req, res, next) {
  rooms.push(new Room(rooms.length, req.subject, req.password));
  res.send('Success');
});

/* Increments the numMembers of a room in a subject and returns that room */
router.put('/subject/:subject/:increment', function(req, res, next) {
  targetRoom = rooms.filter(room => room.subject == req.subject && room.numMembers + req.increment <= room.maxRoomSize).sort(function(a,b){return b - a})[0]; // TODO use a more efficient sort
  if (targetRoom == undefined) {
    res.send('Failure');
    return;
  }
  targetRoom.numMembers += req.increment;
  res.send(targetRoom.id.toString());
});

var users = {};

router.param('user', function(req, res, next, email) {
  if (users[email]) {
    req.user = users[email];
  } else {
    req.user = [];
  }
  next();
});

/* Gets the specified subjects for the user */
router.get('/user/:user', function(req, res, next) {
  res.json(req.user);
});

router.param('email', function(req, res, next, email) {
  req.email = email;
  next();
});

router.param('subjects', function(req, res, next, subjects) {
  req.subjects = subjects.split(',');
  next();
});

/* Sets the user's subjects to a list of comma-separated subjects */
router.put('/user/:email/:subjects', function(req, res, next) {
  users[req.email] = req.subjects;
  res.send('Success');
});

module.exports = router;
