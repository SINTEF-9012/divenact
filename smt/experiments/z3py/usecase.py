import yaml
import os
import copy


with open('./sample_input_expr.yml', 'r') as inputfile:
    inputstring = inputfile.read()
inputdata = yaml.load(inputstring)

deployments = copy.deepcopy(inputdata['deployments'])
inputdata['deployments'].clear()

newdep = {}

def run():
    inputdata['deployments'] = newdep
    with open('sample_input.yml', 'w') as file:
        documents = yaml.dump(inputdata, file)
    os.system('python3 genobj.py')

newdep['A'] = deployments['A']
run()

newdep['B'] = deployments['B']
newdep['B']['vsn'] = 'development'
run()

newdep['C'] = deployments['C']
newdep['B']['vsn'] = 'preview'
newdep['C']['vsn'] = 'development'
run()

newdep['D'] = deployments['D']
newdep['B']['vsn'] = 'release'
newdep['C']['vsn'] = 'preview'
newdep['D']['vsn'] = 'development'
run()

newdep['E'] = deployments['E']
newdep['C']['vsn'] = 'release'
newdep['D']['vsn'] = 'preview'
newdep['E']['vsn'] = 'development'
run()

newdep['F'] = deployments['F']
newdep['D']['vsn'] = 'release'
newdep['E']['vsn'] = 'preview'
newdep['F']['vsn'] = 'development'
run()

newdep['E']['vsn'] = 'release'
newdep['F']['vsn'] = 'preview'
run()

newdep['F']['vsn'] = 'release'
del newdep['C']
run()

del newdep['A']
run()

del newdep['B']
run()

newdep['G'] = deployments['G']
newdep['G']['vsn'] = 'release'
run()