import { IConfigReplacer } from '../IConfigReplacer';
import { parseString, Builder } from 'xml2js';

let log4netAppenderChildNodesReplacer: IConfigReplacer;
log4netAppenderChildNodesReplacer = function (webConfigSource: string, config: any,
    configKey: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const actualEnviromentLog4netFile = config[configKey].log4net;
        if (!actualEnviromentLog4netFile || !actualEnviromentLog4netFile.appenders)
            resolve(webConfigSource);
        // Convert XML to JSON
        parseString(webConfigSource,
            function (err: any, webConfigTree: any) {
                if (err) reject(err);
                // Discover enviroment config Appender Childs to change value   
                actualEnviromentLog4netFile.appenders.forEach((appenderConfig: any) => {
                    var appenderNode = webConfigTree.configuration.log4net[0]
                        .appender.find((appenderNode: any) => appenderNode.$.name === appenderConfig.name);

                    if (appenderNode) {
                        for (let log4netAppenderNodeToChange in appenderConfig.nodes) {
                            const childAppenderToReplace = appenderNode[log4netAppenderNodeToChange][0];
                            if (childAppenderToReplace) {
                                childAppenderToReplace.$.value = appenderConfig.nodes[log4netAppenderNodeToChange];
                            }
                        }
                    }
                });
                const actualBuilder = new Builder();
                const convertedConfig = actualBuilder.buildObject(webConfigTree);
                resolve(convertedConfig);
            });
    });
}

export { log4netAppenderChildNodesReplacer };