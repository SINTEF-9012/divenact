import Router from "express";
import multer from "multer";

export let router = Router();

var folder_name = "public";
var file_name = "script.py";

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, folder_name);

  },
  filename: function(req, file, cb) {
    cb(null, file_name);
  }
});

//var storage = multer.memoryStorage();

var upload = multer({ storage: storage }).single("file");

router.post("/", (req, res) => {
  console.log("Z3 invoked!");

  // Takes stdout data from script which executed
  // with arguments and send this data to res object
  //   process.stdout.on("data", function(data) {
  //     console.log("Result", data.toString());
  //     res.send(data.toString());
  //   });

  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      console.log("multer.MulterError", err);
      return res.status(500).json(err);
    } else if (err) {
      console.log("Error", err);
      return res.status(500).json(err);
    }
    // Use child_process.spawn method from
    // child_process module and assign it
    // to variable spawn
    var spawn = require("child_process").spawn;

    // Parameters passed in spawn -
    // 1. type_of_script
    // 2. list containing Path of the script
    //    and arguments for the script

    // E.g : http://localhost:3000/name?firstname=Mike&lastname=Will
    // so, first name = Mike and last name = Will    
    var process = spawn("python",  [folder_name + "/" + file_name]);
    process.stdout.on('data', (data) => {
        // Do something with the data returned from python script
        console.log();
        return res.status(200).send(data.toString());
    });    
  });

  //res.end("File is uploaded");

  // let deployments = await listDeployments();
  // let result = [];
  // for(let id of Object.keys(deployments)){
  //     result.push({
  //         id: id,
  //         condition: deployments[id].condition
  //     })
  // }
  // res.json(result);
});
