from z3 import *
from diversifier import *
import yaml
import json
import time

DEBUG = True # load yml, print results for debuging purpose, and result in a yaml file
# DEBUG = False  # load JSON, clean stdout with only json output

all_names = {}
def add_name(*names):
    for v in names:
        if str(v) in all_names:
            raise NameError('Name %s is used' % v)
        all_names[str(v)] = v

solver = Optimize()

if DEBUG:
    with open('./sample_input.yml', 'r') as inputfile:
        inputstring = inputfile.read()
    inputdata = yaml.load(inputstring, Loader=yaml.FullLoader)
else:
    with open('./sample_input.json', 'r') as inputfile:
        inputstring = inputfile.read()
    inputdata = json.loads(inputstring)

if DEBUG:
    None
    # print(inputdata)

dp_names = [x for x in inputdata['deployments'].keys()] + ['nodp']
dv_names = [x for x in inputdata['devices'].keys()]


#Main types and functions
Deployment, deployments = EnumSort('Deployment', dp_names)
nodp = deployments[-1]
Device, devices = EnumSort('Device', dv_names)
deploy = Function('deploy', Device, Deployment)
add_name(deploy)
add_name(*deployments)
add_name(*devices)

dvx, dvy = Consts('dvx dvy', Device)
dpx, dpy = Consts('dpx dpy', Deployment)

#Tags
Environment, (e_staging, e_production) = EnumSort('Environment', ('staging', 'production'))
env = Function('env', Device, Environment)
Version, (v_development, v_preview, v_release) = EnumSort('Version', ('development', 'preview', 'release'))
vsn = Function('vsn', Deployment, Version)
add_name(env, e_staging, e_production, vsn, v_development, v_preview, v_release)

Accelerator, (a_tpu, a_gpu, acc_none) = EnumSort('Accelerator', ('tpu', 'gpu', 'acc_none'))
dv_acc = Function('dv_acc', Device, Accelerator)
dp_acc = Function('dp_acc', Deployment, Accelerator)
add_name(a_tpu, a_gpu, acc_none, dv_acc, dp_acc)

Network, (n_wifi, n_3g, n_4g, n_offline) = EnumSort('Network', ('wifi', '3g', '4g', 'offline'))
network = Function('network', Device, Network)
PowerSource, (p_fixed, p_battery, p_ac) = EnumSort('PowerSource', ('fixed', 'battery', 'ac'))
powersource = Function('powersource', Device, PowerSource)
add_name(n_wifi, n_3g, n_4g, n_offline, network, p_fixed, p_battery, p_ac, powersource)

IntlModule, (o_edge, o_cloud, o_flex) = EnumSort('IntlModule', ('edge', 'cloud', 'flexible'))
intlmodule = Function('intlmodule', Deployment, IntlModule)
add_name(o_edge, o_cloud, o_flex, intlmodule)

compu_lvl_dv = Function('compu_lvl_dv', Device, IntSort())
comm_lvl_dv = Function('comm_lvl_dv', Device, IntSort())
compu_lvl = Function('compu_lvl', Deployment, IntSort())
solver.add(ForAll(dpx, And(compu_lvl(dpx)>0, compu_lvl(dpx)<4)))
comm_lvl = Function('comm_lvl', Deployment, IntSort())
solver.add(ForAll(dpx, And(comm_lvl(dpx)>0, comm_lvl(dpx)<4)))
add_name(compu_lvl, compu_lvl_dv, comm_lvl, comm_lvl_dv)

intledge = Function('intledge', Device, BoolSort())
acclr = Function('acclr', Device, BoolSort())
add_name(intledge, acclr)

solver.add(
    ForAll(dvx, And(
        Implies(network(dvx) == n_3g, comm_lvl_dv(dvx) < 2),
        Implies(comm_lvl_dv(dvx)==3, network(dvx) == n_wifi),
        Implies(compu_lvl_dv(dvx)==3, powersource(dvx)==p_fixed),
        Implies(
            powersource(dvx) == p_battery,
            And(compu_lvl_dv(dvx) == 1, comm_lvl_dv(dvx) == 1)
        )
    )),
    ForAll([dvx, dpx], Implies(And(deploy(dvx) == dpx, Not(dpx == nodp)), And(
        comm_lvl_dv(dvx) == If(
            And(intlmodule(dpx) == o_flex, intledge(dvx)),
            comm_lvl(dpx) - 1,
            comm_lvl(dpx)
        ),
        compu_lvl_dv(dvx) == If(
            And(intlmodule(dpx) == o_flex, Not(intledge(dvx))),
            compu_lvl(dpx) - 1,
            If(
                acclr(dvx),
                compu_lvl(dpx) - 1,
                compu_lvl(dpx)
            )
        ),
        Implies(acclr(dvx), And(intledge(dvx), Not(dv_acc(dvx)== acc_none), dv_acc(dvx) == dp_acc(dpx))),
        And(
            Implies(intlmodule(dpx) == o_cloud, Not(intledge(dvx))),
            Implies(intlmodule(dpx) == o_edge, intledge(dvx))
        ),
        Implies(vsn(dpx) == v_development, env(dvx) == e_staging)
    )))
)


#try your best to assign a deployment to every device
for dv in devices:
    solver.add_soft(Not(deploy(dv) == nodp), 200)



elem_by_attr = lambda elem, attr, val: [x
    for x in inputdata[elem]
    if inputdata[elem][x][attr] == val
]
dev_by_env = lambda envstr: elem_by_attr('devices', 'env', envstr)

solver.add_soft(Distinct(*[
    deploy(all_names[dvs]) 
    for dvs in dev_by_env('staging')
]), 50)  #Staging devices should be used for different deployments

#All development versions should be deployed to a device
for devlp in elem_by_attr('deployments', 'vsn', 'development'):
    solver.add_soft(Exists(dvx, deploy(dvx) == all_names[devlp]), 30)

products = dev_by_env('production')
num_prod = len(products)

# Pick up 20% production devices to deploy preview version (like A/B Testing)
for prev_dep in elem_by_attr('deployments', 'vsn', 'preview'):
    solver.add_soft(
        Sum(*[
            If(deploy(all_names[devstr]) == all_names[prev_dep], 1, 0) 
            for devstr in products 
        ]) == num_prod / 5 + 1,
        40
    )

#Generate all the attribute values
for group in inputdata.values():
    for k in group:
        element = group[k]
        host = all_names[k]
        for prop in element:
            func = all_names[prop]
            val = element[prop]
            constraint = None;
            if isinstance(val, str):
                constraint = func(host) == all_names[val]
            else:
                constraint = func(host) == val
            # print(constraint)
            solver.add(constraint)
diversifier = Diversifier(solver, deploy, devices, deployments[:-1])
#diversifier.mini_dep(deployments[0])
diversifier.penalty_steps()

def put_result(m, group, elem, func):
    output_obj = inputdata[group][elem]
    val = m.eval(all_names[func](all_names[elem]))
    if isinstance(val, BoolRef):
        val = str(val) == 'True'
    elif isinstance(val, IntNumRef):
        val = int(str(val))
    else:
        val = str(val)
    output_obj[func] = val
start_time = time.perf_counter()
if str(solver.check()) == 'sat':
    time_duration = time.perf_counter() - start_time
    m = solver.model()
    for func in ['deploy', 'acclr', 'intledge']:
        for dev in inputdata['devices']:
            put_result(m, 'devices', dev, func)
    for dep in inputdata['deployments']:
        devs = [str(x) for x in devices if str(m.eval(deploy(x))) == dep]
        inputdata['deployments'][dep]['deployed'] = devs
    if DEBUG:
        # print(m)
        deparray = []
        for vi in range(0, 25):
            v = 'dv%d' % vi
            device = all_names[v]
            deployment = m.eval(deploy(device))
            # print("{0} <- {1}".format(device, deployment))
            deparray.append("%s"%(str(deployment)))
        print(inputdata['deployments'].keys())
        print(','.join(deparray))
        for p in deployments[:-1]:
            print("{0} is deployed on {1} devices.".format(p, m.eval(diversifier.count_deploy(p))))
        with open('./output.json', 'w') as outfile:
            json.dump(inputdata, outfile, indent=2)
        print ('Constraint solving in %s seconds.' % time_duration)
    else:
        print(json.dumps(inputdata, indent=2))
else:
    print(solver.unsat_core())

