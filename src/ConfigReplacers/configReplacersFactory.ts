import { IConfigReplacer } from '../IConfigReplacer';
import { connectionStringsReplacer } from './connectionStringsReplacer';
import { appSettingsReplacer } from './appSettingsReplacer';
import { log4netAppenderChildNodesReplacer } from './log4netAppenderChildNodesReplacer';

const configReplacerFunctions = [
    { name: 'connectionStringsReplacer', funct: connectionStringsReplacer },
    { name: 'appSettingsReplacer', funct: appSettingsReplacer },
    { name: 'log4netAppenderChildNodesReplacer', funct: log4netAppenderChildNodesReplacer },
]

function getDefaultConfigReplacersToApply(): IConfigReplacer[] {
    return configReplacerFunctions.map((configReplacerFunc: any) => configReplacerFunc.funct);
}

function getConfigReplacersToApply(options?: string[]): IConfigReplacer[] {
    if (!options || options.length === 0) {
        return getDefaultConfigReplacersToApply();
    }
    const replacersToApply = configReplacerFunctions
        .filter((configReplacerFunc: any) => options.indexOf(configReplacerFunc.name) >= 0);
    return replacersToApply.map((configReplacerFunc: any) => configReplacerFunc.funct);
}

export { getConfigReplacersToApply };