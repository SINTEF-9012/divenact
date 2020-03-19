import json
import yaml

with open('./sample_input_simpliest.yml', 'r') as inputfile:
  inputstring = inputfile.read()
inputdata = yaml.load(inputstring)

with open('./sample_input.json', 'w') as outputfile:
  json.dump(inputdata, outputfile, indent=2)

