import { getConfigReplacersToApply } from './ConfigReplacers/configReplacersFactory';
import * as fs from 'fs';
import * as path from 'path';

const currentDir = process.cwd();

function processArgs(nodeArgs: any): any {
    const expectedArgsName = {
        configXmlFile: '--configXmlFile:',
        envConfigFile: '--envConfigFile:',
        envKey: '--envKey:',
        replacers: '--replacers:'
    };

    let configArgs = {
        configXmlFile: process.argv.find((arg) => arg.startsWith(expectedArgsName.configXmlFile)),
        envConfigFile: process.argv.find((arg) => arg.startsWith(expectedArgsName.envConfigFile)),
        envKey: process.argv.find((arg) => arg.startsWith(expectedArgsName.envKey)),
        replacers: ['']
    };

    const replacers = process.argv.find((arg) => arg.startsWith(expectedArgsName.replacers));
    configArgs.configXmlFile = configArgs.configXmlFile ?
        path.resolve(currentDir, configArgs.configXmlFile.substring(expectedArgsName.configXmlFile.length)) : '';
    configArgs.envConfigFile = configArgs.envConfigFile ?
        path.resolve(configArgs.envConfigFile.substring(expectedArgsName.envConfigFile.length)) : '';
    configArgs.envKey = configArgs.envKey ?
        configArgs.envKey.substring(expectedArgsName.envKey.length) : '';
    if (replacers) {
        configArgs.replacers = replacers.substring(expectedArgsName.replacers.length).split(',');
    }
    else {
        configArgs.replacers = [];
    }

    return configArgs;
}

const args = processArgs(process.argv);

function configReplacement(filesArgs: any) {
    const filePath = path.resolve(process.cwd(), filesArgs.envConfigFile);
    const envConfig = require(filePath); //JSON

    fs.readFile(filesArgs.configXmlFile, 'utf-8', function (err, configXml) {
        if (err) process.stdout.write(JSON.stringify(err));
        const configReplacersToApply = getConfigReplacersToApply(filesArgs.replacers);

        function execConfigReplacers(index: number): Promise<void> {
            return new Promise((resolve, reject) => {
                if (index >= configReplacersToApply.length) {
                    resolve();
                }
                else {
                    configReplacersToApply[index](configXml, envConfig, filesArgs.envKey).then(function (result) {
                        configXml = result;
                        index++;
                        execConfigReplacers(index).then(() => resolve());
                    });
                }
            });
        }

        execConfigReplacers(0).then(() => {
            fs.writeFile(filesArgs.configXmlFile, configXml, (err) => {
                if (err) throw Error(err.message);
            })
        });

    });
}

configReplacement(args);

export { configReplacement };


