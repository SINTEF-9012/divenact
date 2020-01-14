// The entire API is exported by the cassowary object
var c = require("cassowary");

var solver = new c.SimplexSolver();
var x = new c.Variable({ value: 167 });
var y = new c.Variable({ value: 2 });
var eq = new c.Equation(x, new c.Expression(y));
solver.addConstraint(eq);

console.log(c.LEQ);
console.log("done");