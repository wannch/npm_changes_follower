var changes = require('concurrent-couch-follower')

// const ChangesStream = require('changes-stream');
const Request = require('request');
const fs = require('fs')
const Normalize = require('normalize-registry-metadata');

const db = 'https://replicate.npmjs.com';

// get and svae Couch DB info locally
Request.get(db, function(err, req, body) {
  var end_sequence = JSON.parse(body).update_seq;
  console.log('Current seq id: ' + end_sequence)
  var jsonData = JSON.parse(body);
  var jsonString = JSON.stringify(jsonData, null, 4);
  fs.writeFile('db_info.json', jsonString, 'utf8', function(writeErr) {
    if (writeErr) {
      console.error(writeErr);
    } else {
      console.log('JSON data is saved to db_info.json');
    }
  });
});

var configOptions = {
    db: 'https://replicate.npmjs.com/registry/_changes',
    include_docs:true,
    sequence:'sequence_ids.txt',
    now:true,
    concurrency:5    // get the number of changes one time
    // since: xx      // specify a sequence id from which we start to follow
}

var dataHandler = function(data, done) {
    console.log(data)
    // save data into file in JSON format
    // var jsonData = JSON.parse(data);
    var jsonString = JSON.stringify(data, null, 4);
    fs.writeFile('npm_changes/' + data.seq + '.json', jsonString, 'utf8', function(writeErr) {
      if (writeErr) {
        console.error(writeErr);
      } else {
        console.log(data.id + ' JSON data is saved.');
      }
    });
}

// may throw newwork access 
stream = changes(dataHandler, configOptions)
// stream.sequence()

console.log('Exit!')

// var changes = new ChangesStream({
//     db: db,
//     include_docs: true
//   });

// Request.get(db, function(err, req, body) {
//   var end_sequence = JSON.parse(body).update_seq;
//   changes.on('data', function(change) {
//     if (change.seq >= end_sequence) {
//       process.exit(0);
//     }
//     if (change.doc.name) {
//       console.log(Normalize(change.doc));
//     }
//   });
// });
