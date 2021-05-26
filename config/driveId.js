const {google} = require('googleapis');


function getId(fileName){
    const drive = google.drive({version: 'v3', auth});
    drive.files.list({
      pageSize: 10,
      fields: 'nextPageToken, files(id, name)',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const files = res.data.files;
      if (files.length) {
        console.log('Files:');
        files.map((file) => {
          if(fileName == file.name)
           return file.id
        });
      } else {
        console.log('No files found.');
      }
    });
  }

  module.exports = getId