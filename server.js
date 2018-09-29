const express = require('express');
const app = require('express')();
const fs = require('fs');

app.listen(3000);

app.use(express.static(__dirname + '/public'));

app.get('/song/:songName', (req, res)=>{
  const songName = req.params.songName;
  const path = 'assets/songs/' + songName;
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;
  console.log("Range out:" + range);
  if (range) {
      console.log("IFFFF")
      console.log("Range :" + range);
      const parts = range.replace(/bytes=/, "").split("-")
      console.log("Parts: " + parts)
      const start = parseInt(parts[0], 10)
      console.log("Start: " + start)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1
      console.log("end: " + end)
      const chunksize = (end-start)+1
      console.log("chunksize: " + chunksize)
      const file = fs.createReadStream(path, {start, end})
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'audio/mp3',
      }
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      console.log("ELSEEE");
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'audio/mp3',
      }
      res.writeHead(200, head)
      fs.createReadStream(path).pipe(res)
    }
});
