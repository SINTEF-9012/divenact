from z3 import *

x = Bool('x')
solver = Optimize()

solver.add_soft(x, 1)
solver.add_soft(Not(x), 2)

print(solver.check())
print(solver.statistics())

