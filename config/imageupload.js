const fs = require("fs");
const {google} = require('googleapis');

function imageUpload(fileName, filePath, callback){
    require("./gdrive")((auth) => {
        const fileMetadata = {
            name: fileName,
            copyRequiresWriterPermission: false,
            writesCanShare: true
        };
        const media = {
            mimeType: "image/jpeg",
            body: fs.createReadStream(filePath),
            copyRequiresWriterPermission: false,
            writesCanShare: true
        }
        const drive = google.drive({version: 'v3', auth});
        
        drive.files.create({
            resource: fileMetadata,
            media: media,
            copyRequiresWriterPermission: false,
            writesCanShare: true,
            fields: 'id'
          }, function (err, file) {
            if (err) {
              // Handle error
              console.error(err);
            } else {
              callback(file.data.id);
            }
          });
    });
}

module.exports = { imageUpload };