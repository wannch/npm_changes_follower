const ChangesStream = require('changes-stream');
const Request = require('request');
const Normalize = require('normalize-registry-metadata');
const fs = require('fs');
const path = require('path');

const db = 'https://replicate.npmjs.com';
// const db = 'https://replicate.npmjs.com/registry/_changes';

var changes = new ChangesStream({
  db: db,
  include_docs: true,
  since: 31210580
});

Request.get(db, function (err, req, body) {
  var end_sequence = JSON.parse(body).update_seq;
  changes.on('data', function (change) {
    if (change.seq >= end_sequence) {
      process.exit(0);
    }

    if (change.doc.name) {
      const norm_doc = Normalize(change.doc)
      console.log(norm_doc);

      // var jsonData = JSON.parse(norm_doc);
      // var jsonString = JSON.stringify(jsonData, null, 4);
      // save_file = path.join('npm_changes', norm_doc._id + '_' + norm_doc._rev + '.json')
      // fs.writeFile(save_file, jsonString, 'utf8', function (writeErr) {
      //   if (writeErr) {
      //     console.error(writeErr); // 写入文件错误处理
      //   } else {
      //     console.log('JSON data is saved to db_info.json'); // 成功保存的提示
      //   }
      // });

    }

  });
});
