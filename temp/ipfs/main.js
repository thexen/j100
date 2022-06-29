const ipfsAPI = require('ipfs-api');
const express = require('express');
const fs = require('fs');
const app = express();

//Connceting to the ipfs network via infura gateway
const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})

//Reading file from computer
let testFile = fs.readFileSync("D:/doc/icon/com.publishinc.app.publishid_1.png");
//Creating buffer for ipfs function to add file to the system
let testBuffer = new Buffer(testFile);

//Addfile router for adding file a local file to the IPFS network without any local node
app.get('/addfile', function(req, res) {

    ipfs.files.add(testBuffer, function (err, file) {
        if (err) {
          console.log(err);
        }
        console.log(file)
        res.end( file );
      })
      res.statusCode = 200;
})
//Getting the uploaded file via hash code.
app.get('/getfile', function(req, res) {
    
    //This hash is returned hash of addFile router.
    const validCID = 'QmYBzrkNqyNnW6HcXfUvpnPmoPRy75wJVhAgCudyjshf2N'
            
    ipfs.files.get(validCID, function (err, files) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'image/png');
        files.forEach((file) => {
          console.log(file.path)
          //console.log(file.content.toString('utf8'))
          res.end( file.content );
        })
      })
    
     

})

app.listen(3000, () => console.log('App listening on port 3000!'))