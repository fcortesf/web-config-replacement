
import { connectionStringsReplacer } from '../ConfigReplacers/connectionStringsReplacer';
import { appSettingsReplacer } from '../ConfigReplacers/appSettingsReplacer';
import { log4netAppenderChildNodesReplacer } from '../ConfigReplacers/log4netAppenderChildNodesReplacer';
describe('Connection string tests', () => {
    it('Connection string correct', () => {
        var xmlOrigin = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><configuration><connectionStrings><add name="connection1" providerName="System.Data.SqlClient" connectionString="initial value"/><add name="connection2" providerName="System.Data.SqlClient" connectionString="initial value"/></connectionStrings></configuration>';
        var jsonConfig = {
            env:{
                connectionStrings: {
                    connection1: 'test1'
                }
            }
        }
        var envKey = "env";
        
        return connectionStringsReplacer(xmlOrigin,jsonConfig,envKey).then(data => expect(data.indexOf('name="connection1" providerName="System.Data.SqlClient" connectionString="test1"')).toBeGreaterThan(-1));
    });

    it('No change Connection string', () => {
        var xmlOrigin = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><configuration><connectionStrings><add name="connection1" providerName="System.Data.SqlClient" connectionString="initial value"/><add name="connection2" providerName="System.Data.SqlClient" connectionString="initial value"/></connectionStrings></configuration>';
        var jsonConfig = {
            env:{
                connectionStrings: {
                    connection7: 'test1'
                }
            }
        }
        var envKey = "env";
        
        return connectionStringsReplacer(xmlOrigin,jsonConfig,envKey).then(data => expect(data.indexOf('add name="connection1" providerName="System.Data.SqlClient" connectionString="test1"')).toBe(-1));
    });

});

describe('AppSettings tests', () => {
    it('AppSettings correct', () => {
        var xmlOrigin = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><configuration><appSettings><add key="setting1" value="set1"/></appSettings><connectionStrings><add name="connection1" providerName="System.Data.SqlClient" connectionString="initial value"/><add name="connection2" providerName="System.Data.SqlClient" connectionString="initial value"/></connectionStrings></configuration>';
        var jsonConfig = {
            env:{
                appSettings: {
                    setting1: 'test1'
                }
            }
        }
        var envKey = "env";
        
        return appSettingsReplacer(xmlOrigin,jsonConfig,envKey).then(data => expect(data.indexOf('add key="setting1" value="test1"')).toBeGreaterThan(-1));
    });

    it('No change AppSettings', () => {
        var xmlOrigin = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><configuration><appSettings><add key="setting1" value="set1"/></appSettings><connectionStrings><add name="connection1" providerName="System.Data.SqlClient" connectionString="initial value"/><add name="connection2" providerName="System.Data.SqlClient" connectionString="initial value"/></connectionStrings></configuration>';
        var jsonConfig = {
            env:{
                appSettings: {
                    setting7: 'test1'
                }
            }
        }
        var envKey = "env";
        
        return appSettingsReplacer(xmlOrigin,jsonConfig,envKey).then(data => expect(data.indexOf('test1')).toBe(-1));
    });

});


describe('Log4net tests', () => {
    it('Log4net correct', () => {
        var xmlOrigin = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><configuration><log4net><appender name="appender1"><file value="file1"/></appender></log4net><connectionStrings><add name="connection1" providerName="System.Data.SqlClient" connectionString="initial value"/><add name="connection2" providerName="System.Data.SqlClient" connectionString="initial value"/></connectionStrings></configuration>';
        var jsonConfig = {
            env:{
                log4net: {
                    appenders:[{
                        name:'appender1',
                        nodes: {
                            file: 'test1'
                        }
                    }]
                }
            }
        }
        var envKey = "env";
        
        return log4netAppenderChildNodesReplacer(xmlOrigin,jsonConfig,envKey).then(data => expect(data.indexOf('file value="test1"')).toBeGreaterThan(-1));
    });

});