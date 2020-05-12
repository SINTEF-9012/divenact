from z3 import *

class Diversifier:
    def __init__(self, solver, fdeploy, devices, deployments):
        self.solver = solver
        self.deploy = fdeploy
        self.devices = devices
        self.deployments = deployments

    def count_deploy(self, dp):
        return Sum(*[If(self.deploy(x)==dp, 1, 0) for x in self.devices])

    def mini_dep(self, dp):
        self.solver.minimize(self.count_deploy(dp))

    #This one does not work... Way too slow
    def low_variance(self):
        counts = [self.count_deploy(dp) for dp in self.deployments]
        self.solver.minimize(Sum(*[x * x for x in counts]))

    def penalty_steps(self):
        expect = (len(self.devices)+0.0) / len(self.deployments)
        threshold = int(expect * 0.75)
        upthreashold = int(expect * 1.25)
        for dp in self.deployments:
            None
            self.solver.add_soft(self.count_deploy(dp) > threshold, 20)
            #self.solver.add_soft(self.count_deploy(dp) < upthreashold, 20)