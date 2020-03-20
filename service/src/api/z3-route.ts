import Router from "express";
import multer from "multer";
import fs from 'fs';

export let router = Router();

var folder_name = "public";
var python_file = "genobj.py"; //RENAME!!!
var json_file = "sample_input.json";
var yaml_file = "sample_input.yaml";

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, folder_name);
  },
  filename: function(req, file, cb) {    
    cb(null, python_file);
  }
});

//var upload = multer({ storage: storage }).array("files");
var upload = multer({ storage: storage });

router.post("/", upload.any(), function(req, res) {
  console.log("Z3 invoked!");
  //console.log(req.body.json);
  //console.log(__dirname);
  fs.writeFileSync('./public/sample_input.json', req.body.json);

  var spawn = require("child_process").spawn;

  var process = spawn("python", [folder_name + "/" + python_file]);
  process.stdout.on("data", data => {
    // Do something with the data returned from python script
    console.log(data.toString());
    return res.status(200).send(data.toString());
  });
});
