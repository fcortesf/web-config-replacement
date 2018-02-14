import { IConfigReplacer } from '../IConfigReplacer';
import { parseString, Builder }  from 'xml2js';

let appSettingsReplacer: IConfigReplacer;
appSettingsReplacer = function(webConfigSource: string, config: any, 
    configKey: string) : Promise<string> {
        return new Promise((resolve, reject) => {
            var actualEnviromentAppSettings = config[configKey].appSettings;
            // Convert XML to JSON
            parseString(webConfigSource,
                function(err:any, webConfigTree:any){
                    if(err) reject(err);                 
                    // Discover enviroment config appSettings keys to change       
                    for(var appSeettingsToChangeKey in actualEnviromentAppSettings){                                             
                        var appSettingToReplace = webConfigTree.configuration.appSettings[0]
                            .add.find((appSettingElement : any) =>{
                                return appSettingElement.$.key === appSeettingsToChangeKey;
                            });
                        if(appSettingToReplace){
                            appSettingToReplace.$.value 
                                = actualEnviromentAppSettings[appSeettingsToChangeKey];
                        }
                    }
                    var actualBuilder = new Builder();
                    var convertedConfig = actualBuilder.buildObject(webConfigTree);
                    resolve(convertedConfig);
            });
        });
        
        
}


export {appSettingsReplacer};