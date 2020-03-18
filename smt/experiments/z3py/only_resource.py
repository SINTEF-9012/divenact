from z3 import *

solver = Optimize()

####Generate: device and deployment instances ####
dp_names = ['dp0', 'dp1', 'dp2', 'dp3']
dv_names = ['dv0', 'dv1', 'dv2', 'dv3']
############


#Main types and functions
Deployment, deployments = EnumSort('Deployment', dp_names)
Device, devices = EnumSort('Device', dv_names)
deploy = Function('deploy', Device, Deployment)

dvx, dvy = Consts('dvx dvy', Device)
dpx, dpy = Consts('dpx, dpy', Deployment)

#Tags
Environment, (e_preview, e_production, e_default) = EnumSort('Environment', ('preview', 'production', 'default'))
dv_env = Function('dv_evn', Device, Environment)
dp_env = Function('dp_env', Deployment, Environment)

Network, (n_3g, n_4g, n_offline) = EnumSort('Network', ('3g', '4g', 'offline'))
network = Function('network', Device, Network)
PowerSource, (p_battery, p_ac) = EnumSort('PowerSource', ('battery', 'ac'))
powersource = Function('powersource', Device, PowerSource)

compu_lvl = Function('compu_lvl', Deployment, IntSort())
solver.add(ForAll(dpx, And(compu_lvl(dpx)>0, compu_lvl(dpx)<4)))

comm_lvl = Function('comm_lvl', Deployment, IntSort())
solver.add(ForAll(dpx, And(comm_lvl(dpx)>0, comm_lvl(dpx)<4)))

solver.add(
    ForAll(dvx, 
        Implies(network(dvx) == n_3g, comm_lvl(deploy(dvx)) < 3)
    ),
    ForAll([dvx, dpx],
        Implies(
            And(deploy(dvx) == dpx, powersource(dvx) == p_battery),
            And(compu_lvl(dpx) == 1, comm_lvl(dpx) == 1)
        )
    )
)

######Generate System instance ######
solver.add(
    comm_lvl(deployments[0]) == 2,
    compu_lvl(deployments[0]) == 3,
    comm_lvl(deployments[1]) == 1,
    compu_lvl(deployments[1]) == 1,
    comm_lvl(deployments[2]) == 2,
    comm_lvl(deployments[3]) == 3,
    #powersource(devices[0]) == p_battery,
    powersource(devices[1]) == p_battery
)
##############

solver.add(Distinct(*(deploy(i) for i in devices)))
print(solver.check())
print(solver.model())
