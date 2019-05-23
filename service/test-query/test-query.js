'use strict';
     var iothub = require('azure-iothub');
     var connectionString = '';
     var registry = iothub.Registry.fromConnectionString(connectionString);

     /* registry.getRegistryStatistics(function(err, twin){        
         if (err) {
             console.error(err.constructor.name + ': ' + err.message);
         } else {
             var patch = {
                 tags: {
                     location: {
                         region: 'US',
                         plant: 'Redmond43'
                   }
                 }
             };

             twin.update(patch, function(err) {
               if (err) {
                 console.error('Could not update twin: ' + err.constructor.name + ': ' + err.message);
               } else {
                 console.log(twin.deviceId + ' twin updated successfully');
                 queryTwins();
               }
             });
         }
     }); */
     //var queryAllDevices = function() {
     
    var query = registry.createQuery("SELECT * FROM devices", 100);
        query.nextAsTwin(function(err, results) {
            if (err) {
                console.error('Failed to fetch the results: ' + err.message);
            } else {
                console.log("DEVICES:");
                results.forEach(function(device) {                    
                    console.log("-- " + device.deviceId + " ver." + device.version + " -- " + device.status);
                });
            }
        });
     
    query = registry.createQuery("SELECT * FROM devices.modules", 100);
        
        query.nextAsTwin(function(err, results) {
            if (err) {
                console.error('Failed to fetch the results: ' + err.message);
            } else {
                console.log("DEPLOYED MODULES:");
                results.forEach(function(module) {                    
                    console.log("-- " + module.moduleId + " (deployed on " + module.deviceId + " on " + module.properties.desired.$metadata.$lastUpdated + ")" + " ver." + module.version + " -- " + module.status);
                });               
            }
        });