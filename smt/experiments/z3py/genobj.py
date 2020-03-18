from z3 import *
import yaml


all_names = {}
def add_name(*names):
    for v in names:
        if str(v) in all_names:
            raise NameError('Name %s is used' % v)
        all_names[str(v)] = v

solver = Solver()

with open('./sample_input.yml', 'r') as inputfile:
  inputstring = inputfile.read()
inputdata = yaml.load(inputstring)

print(inputdata)

####Generate: device and deployment instances ####
dp_names = [x for x in inputdata['deployments'].keys()]
dv_names = [x for x in inputdata['devices'].keys()]
############

#Main types and functions
Deployment, deployments = EnumSort('Deployment', dp_names)
Device, devices = EnumSort('Device', dv_names)
deploy = Function('deploy', Device, Deployment)
add_name(deploy)
add_name(*deployments)
add_name(*devices)

dvx, dvy = Consts('dvx dvy', Device)
dpx, dpy = Consts('dpx dpy', Deployment)

#Tags
# Environment, (e_preview, e_production, e_default) = EnumSort('Environment', ('preview', 'production', 'default'))
# dv_env = Function('dv_evn', Device, Environment)
# dp_env = Function('dp_env', Deployment, Environment)

Accelerator, (a_tpu, a_gpu, acc_none) = EnumSort('Accelerator', ('tpu', 'gpu', 'acc_none'))
dv_acc = Function('dv_acc', Device, Accelerator)
dp_acc = Function('dp_acc', Deployment, Accelerator)
add_name(a_tpu, a_gpu, acc_none, dv_acc, dp_acc)

Network, (n_3g, n_4g, n_offline) = EnumSort('Network', ('3g', '4g', 'offline'))
network = Function('network', Device, Network)
PowerSource, (p_battery, p_ac) = EnumSort('PowerSource', ('battery', 'ac'))
powersource = Function('powersource', Device, PowerSource)
add_name(n_3g, n_4g, n_offline, network, p_battery, p_ac, powersource)

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
    ForAll(dvx, 
        Implies(network(dvx) == n_3g, comm_lvl_dv(dvx) < 3)
    ),
    ForAll([dvx],
        Implies(
            And(deploy(dvx) == dpx, powersource(dvx) == p_battery),
            And(compu_lvl_dv(dvx) == 1, comm_lvl_dv(dvx) == 1)
        )
    ),
    ForAll([dvx], 
        comm_lvl_dv(dvx) == If(
            And(intlmodule(deploy(dvx)) == o_flex, intledge(dvx)),
            comm_lvl(deploy(dvx)) - 1,
            comm_lvl(deploy(dvx))
        )
    ),
    ForAll([dvx],
        compu_lvl_dv(dvx) == If(
            And(intlmodule(deploy(dvx)) == o_flex, Not(intledge(dvx))),
            compu_lvl(deploy(dvx)) - 1,
            If(
                acclr(dvx),
                compu_lvl(deploy(dvx)) - 1,
                compu_lvl(deploy(dvx))
            )
        )
    ),
    ForAll([dvx],
        Implies(
            acclr(dvx), 
            And(
                intledge(dvx),
                dv_acc(dvx) == dp_acc(deploy(dvx))
            )
        )
    ),
    ForAll([dvx],
        And(
            Implies(intlmodule(deploy(dvx)) == o_cloud, Not(intledge(dvx))),
            Implies(intlmodule(deploy(dvx)) == o_edge, intledge(dvx))
        )
    )
)

######Generate System instance ######
# solver.add(
#     comm_lvl(deployments[0]) == 2,
#     compu_lvl(deployments[0]) == 3,
#     comm_lvl(deployments[1]) == 1,
#     compu_lvl(deployments[1]) == 2,
#     intlmodule(deployments[1]) == o_edge,
#     intlmodule(deployments[0]) == o_flex,
#     dv_acc(devices[1]) == a_tpu,
#     powersource(devices[1]) == p_battery,
#     network(devices[0]) == n_3g
# )
##############
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
            print(constraint)
            solver.add(constraint)

#solver.add(Distinct(*(deploy(i) for i in devices)))
if str(solver.check()) == 'sat':
    m = solver.model()
    print(solver.model())
    print(m.eval(intledge(devices[1])))
else:
    print(solver.unsat_core())

