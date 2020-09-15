import yaml
import os
import copy


with open('./sample_input_expr_perf.yml', 'r') as inputfile:
    inputstring = inputfile.read()
inputdata = yaml.load(inputstring)

deployments = copy.deepcopy(inputdata['deployments'])
devices = copy.deepcopy(inputdata['devices'])

def run():
    with open('sample_input.yml', 'w') as file:
        documents = yaml.dump(inputdata, file)
    os.system('python3 genobj.py')

run();

for i in range(1,5):
    devices = copy.deepcopy(inputdata['devices'])
    for k in devices:
        inputdata['devices']["%sa%i"%(k, i)] = copy.deepcopy(devices[k])

    print("Number of devices:%d"%len(inputdata['devices']))
    run()