import { IConfigReplacer } from '../IConfigReplacer';
import { parseString, Builder } from 'xml2js';

let appSettingsReplacer: IConfigReplacer;

appSettingsReplacer = function (webConfigSource: string, config: any, configKey: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const actualEnviromentAppSettings = config[configKey].appSettings;
        // Convert XML to JSON
        parseString(webConfigSource,
            function (err: any, webConfigTree: any) {
                if (err) reject(err);
                // Discover enviroment config appSettings keys to change       
                for (let appSeettingsToChangeKey in actualEnviromentAppSettings) {
                    let appSettingToReplace = webConfigTree.configuration.appSettings[0]
                        .add.find((appSettingElement: any) => appSettingElement.$.key === appSeettingsToChangeKey);
                        
                    if (appSettingToReplace) {
                        appSettingToReplace.$.value
                            = actualEnviromentAppSettings[appSeettingsToChangeKey];
                    }
                }
                const actualBuilder = new Builder();
                const convertedConfig = actualBuilder.buildObject(webConfigTree);
                resolve(convertedConfig);
            });
    });
}

export { appSettingsReplacer };