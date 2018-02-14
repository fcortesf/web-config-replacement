import {getConfigReplacersToApply} from './ConfigReplacers/configReplacersFactory';
const fs = require('fs'); 
const path = require("path");
const currentDir = process.cwd();

function processArgs(nodeArgs :any):any{
    var expectedArgsName = {
        configXmlFile:'--configXmlFile:',
        envConfigFile:'--envConfigFile:',
        envKey:'--envKey:',
        replacers:'--replacers:'
    };
    var configArgs = {
        configXmlFile:  process.argv.find((arg) => arg.startsWith(expectedArgsName.configXmlFile)),
        envConfigFile: process.argv.find((arg) => arg.startsWith(expectedArgsName.envConfigFile)),
        envKey: process.argv.find((arg) => arg.startsWith(expectedArgsName.envKey)),
        replacers: ['']
    };
    var replacers =  process.argv.find((arg) => arg.startsWith(expectedArgsName.replacers));    
    configArgs.configXmlFile = configArgs.configXmlFile ? 
        path.resolve(currentDir,configArgs.configXmlFile.substring(expectedArgsName.configXmlFile.length)) : '';
    configArgs.envConfigFile = configArgs.envConfigFile ? 
        path.resolve(configArgs.envConfigFile.substring(expectedArgsName.envConfigFile.length)) : '';
    configArgs.envKey = configArgs.envKey  ?
        configArgs.envKey.substring(expectedArgsName.envKey.length) : '';
    if(replacers){
        configArgs.replacers = replacers.substring(expectedArgsName.replacers.length).split(',');
    }
    else{
        configArgs.replacers = [];
    }
    
    return configArgs;
}

var args = processArgs(process.argv);

function configReplacement(filesArgs: any){    
    const filePath = path.resolve(process.cwd(), filesArgs.envConfigFile);
    const envConfig = require(filePath);  
    
    fs.readFile(filesArgs.configXmlFile, 'utf-8', function (err :any, configXml:any){
        if(err) process.stdout.write(JSON.stringify(err));
        var configReplacersToApply = getConfigReplacersToApply(filesArgs.replacers);

        var execConfigReplacers = function(index:number){
            return new Promise((resolve, reject) => {
                if(index >= configReplacersToApply.length){
                    resolve();
                } 
                else{
                    configReplacersToApply[index](configXml, envConfig, filesArgs.envKey).then(function(result){
                        configXml = result;
                        index++;
                        execConfigReplacers(index).then(() => resolve());
                    });
                }
            });
        }

        execConfigReplacers(0).then(() =>{
            fs.writeFile(filesArgs.configXmlFile, configXml, function(err:any, data:any){
                if (err) throw Error(err);
            })
        });

    });     
}
  
configReplacement(args);

export {configReplacement};


