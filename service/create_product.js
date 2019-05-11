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

var createEdgeDeployment = function(done) {
    console.log();
    console.log('Set deploymment ' + productDeploymentId + ' to product' );
    
    registry.getConfiguration(baseDeploymentId, function(err, baseDeployment) {
        if (err) {
            console.log('getConfiguration failed: ' + err);
        } else {
            console.log(baseDeployment);
            baseDeployment.id = productDeploymentId;
            baseDeployment.content.modulesContent.$edgeAgent['properties.desired'].modules=candidates['text-red'];
            baseDeployment.targetCondition = "tags.environment='product'";
            console.log(baseDeployment);
            registry.removeConfiguration(productDeploymentId, function(err) {
                if(err){
                    console.log(productDeploymentId + " not found");
                }
            });
            registry.addConfiguration(baseDeployment, function(err) {
                if (err) {
                  console.log('add configuration failed: ' + err);
                } else {
                  console.log('add configuration succeeded');
                }
              });
        }
    });
};

//console.log(JSON.stringify(resolve(pool)))
createEdgeDeployment()

