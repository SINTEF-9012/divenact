'use strict';

var iothub = require('azure-iothub');
var yaml = require('node-yaml');

var credential = yaml.readSync('../azureiot.credential');
var connectionString = credential.iothub.connection;
var registry = iothub.Registry.fromConnectionString(connectionString);

var pool = yaml.readSync('./pool.yaml')
console.log(pool);

var baseDeploymentId = 'base'
var productDeploymentId = 'production'

var resolve = function(input_pool){
    var result = {}
    var variants = input_pool.variants;
    for (var varname in variants){
        var variant = variants[varname];
        var valuestr = JSON.stringify(input_pool.templates[variant.template])
        for (var param in variant.parameter){
            valuestr = valuestr.replace('{{'+param+'}}', variant.parameter[param])
        }
        JSON.parse(valuestr)
        result[varname] = JSON.parse(valuestr)
    }
    return result;
}

var candidates = resolve(pool);

var createEdgeDeployment = function(deploymentId, modules, condition, done) {
    console.log('Set deploymment ' + deploymentId + ' to product' );
    var baseDeployment = require('./base_deployment.json')
    baseDeployment.id = deploymentId;
    baseDeployment.content.modulesContent.$edgeAgent['properties.desired'].modules=modules;
    baseDeployment.targetCondition = condition; //"tags.environment='product'";
    console.log(JSON.stringify( baseDeployment, null, 2));
    registry.removeConfiguration(deploymentId, function(err) {
        if(err){
            console.log(deploymentId + " not found");
        }
        registry.addConfiguration(baseDeployment, function(err) {
            if (err) {
                console.log('add configuration failed: ' + err);
                if(done) { done(); };
            } else {
                console.log('add configuration succeeded');
                if (done) { done(); }
            }
        });
    }); 
};

//console.log(JSON.stringify(resolve(pool)))
var setProduction = function(varname){
    createEdgeDeployment(
        'production',
        candidates[varname],
        "tags.environment='product'"
    )
}

setProduction('led-red')
