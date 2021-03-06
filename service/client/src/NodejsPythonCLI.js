var spawn = require("child_process").spawn;

// Parameters passed in spawn -
// 1. type_of_script
// 2. list containing Path of the script
// and arguments for the script

// E.g : http://localhost:3000/name?firstname=Mike&lastname=Will
// so, first name = Mike and last name = Will
var process = spawn("python", ["../../public/genobj.py"]);
process.stdout.on("data", data => {
  // Do something with the data returned from python script
  console.log(data.toString());
});
