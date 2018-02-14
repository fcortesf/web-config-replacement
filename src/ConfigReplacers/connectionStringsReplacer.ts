import { IConfigReplacer } from '../IConfigReplacer';
import { parseString, Builder }  from 'xml2js';

let connectionStringsReplacer: IConfigReplacer;
connectionStringsReplacer = function(webConfigSource: string, config: any, 
    configKey: string) : Promise<string> {
        return new Promise((resolve, reject) => {
            var actualEnviromentConnectionStrings = config[configKey].connectionStrings;
            // Convert XML to JSON
            parseString(webConfigSource,
                function(err:any, webConfigTree:any){
                    if(err) reject(err);                 
                    // Discover enviroment config connectionStrings names to change       
                    for(var connectionStringToChangeName in actualEnviromentConnectionStrings){                                             
                        var connectionStringToReplace = webConfigTree.configuration.connectionStrings[0]
                            .add.find((connectionStringElement:any) =>{
                                return connectionStringElement.$.name === connectionStringToChangeName;
                            });
                        if(connectionStringToReplace){
                            connectionStringToReplace.$.connectionString 
                                = actualEnviromentConnectionStrings[connectionStringToChangeName];
                        }
                    }
                    var actualBuilder = new Builder();
                    var convertedConfig = actualBuilder.buildObject(webConfigTree);
                    resolve(convertedConfig);
            });
        });
        
        
}


export {connectionStringsReplacer};