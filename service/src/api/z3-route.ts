import Router from "express";
import multer from "multer";
import fs from 'fs';

export let router = Router();

var folder_name = "public";
var python_file = "assignment.py"; //RENAME!!!
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
  if(req.body.yaml != ""){
    fs.writeFileSync('./public/sample_input.yml', req.body.yaml);
  }
  

  var spawn = require("child_process").spawn;
  console.log(process.cwd())
  //TODO: On my side, I have to run python3. I don't know if Z3 works properly under Python2
  //Is there a way to check if process works well? If "python" doesn't work, we can 
  //try again "python3"
  var child_process = spawn("python3", [python_file], {cwd: process.cwd()+"/public"});
  //var process = spawn("python", ["C:/Users/rustemd/divenact/service/public/genobj.py"]);  
  child_process.stdout.on("data", data => {
    // Do something with the data returned from python script
    console.log("from stdout");
    console.log(data.toString());
    return res.status(200).send(data.toString());
  });
  child_process.stderr.on("data", data =>{
    console.log("from stdeer");
    console.log(data.toString());
  })
});