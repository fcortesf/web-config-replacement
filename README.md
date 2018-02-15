# WebConfig Replacer
With this script you can modify a web.config by a json config file with enviromental keys within. If  your project has a client with multiple enviroments, 
you can create a config.json per client with each enviromental configuration inside.

See config.json example.

## Installation

```bash
npm i --save web-config-replacer
```
## Use it

> Include execution on package.json
```json
"scripts": {
 "replaceConfig": "web-config-replacer --configXmlFile:test.config --envConfigFile:config.json --envKey:UAT"
}
```

## Scripts

> Test

```bash
npm run test
```

```bash
npm run test:watch
```

> Build

```bash
npm run build
```

> Execute
```bash
 web-config-replacer --configXmlFile:test.config --envConfigFile:config.json --envKey:UAT
```


## Execution parameters
| Parameter          | Description                                                  | Optional  |
| -------------------|--------------------------------------------------------------| :---------:|
| --configXmlFile    | Web.config file path                                         |           |
| --envConfigFile    | Configuration by enviroment file (JSON)                      |           |
| --envKey           | Enviroment to select into Json config                        |           |
| --replacers        | Web config replacers functions to execute, separated by ','  |     X     |

## Configuration file basic structure
Configuration file __must__ be a json file. The root elements of the json must be properties with enviromental keys.
```json
{
    "env1":{... env config},
    "env2":{... env config}
}
```

The env config depends on the replacer you want to execute, because every replacer has its own JSON config format.

## Config replacers
The system has 3 replacer currently: 
* connectionStringsReplacer
* appSettingsReplacers
* log4netAppenderChildNodesReplacer..

By default, it executes every replacer, but you can choose the replacers to execute by 2 ways:
- Skipping the replacer config on config file.
- Via '--replacers' parameter. 

>Note: you can contribute creating new replacers. You must create a function that implements ```IConfigReplacer``` and adding your function to ```configReplacersFactory```.

### connectionStringsReplacer
The connectionStringsReplacer manages the web.config connectionStrings. With this you can use different connectionStrings by enviroment. 

__Format__: inside an enviroment you must create a property called "connectionStrings", this property contains an object whose properties are connectionStrings names and the value is the connectionString itself.

```json
{
    "env1":{
        ...
        "connectionStrings":{
            "connectionName1": "connection string value",
            "connectionName2": "connection string value"
        }
        ...
    }
    ...
}
```

### appSettingsReplacer
The appSettingsReplacer manages the web.config appSettings. With this you can use a different value by enviroment. 

__Format__: into a enviroment you must create a property called "appSettings", this property contains an object whose properties are appSettings names and the value is the value for that appSetting.

```json
{
    "env1":{
        ...
        "appSettings":{
            "secret": "value for this appSetting",
            "otherSetting": "value for this appSetting"
        }
        ...
    }
    ...
}
```

### log4netAppenderChildNodesReplacer
This replacer is a little bit different, it changes the value of an appender's child.

__What?__ I have a log4net configuration into a web.config file. This log4net node has an specific structure with nodes into him, like this:
```xml
<log4net>
    <appender type="log4net.Appender.RollingFileAppender" name="RollingLogFileAppender">
      <file value="C:\dev\Log_"/>
      <appendtofile value="true"/>
      <staticlogfilename value="false"/>
      <rollingstyle value="Composite"/>
      <datepattern value="yyyyMMdd.lo\g"/>
      <maxsizerollbackups value="5"/>
      <maximumfilesize value="100MB"/>
      <layout type="log4net.Layout.PatternLayout">
        <conversionpattern value="%newline#############################################################%newline %date [%thread] %-5level %logger - %message%newline"/>
      </layout>
    </appender>
    <appender name="aiAppender" type="Microsoft.ApplicationInsights.Log4NetAppender.ApplicationInsightsAppender, Microsoft.ApplicationInsights.Log4NetAppender">
      <layout type="log4net.Layout.PatternLayout">
        <conversionPattern value="%message%newline"/>
      </layout>
    </appender>
    <root>
      <level value="INFO"/>
      <appender-ref ref="RollingLogFileAppender"/>
      <appender-ref ref="aiAppender"/>
    </root>
  </log4net>
```

Format: inside an enviroment you must create a property called "log4net", this property must be an object with an "appenders" property that contains an array. This array must contain objects with: "name" and "nodes" properties. "name" is the specific name for the appender and nodes must be an object whose properties must be the node type of the node you want to switch the value.

```json
{
    "env1":{
        ...
        "log4net": {
        "appenders": [
            {
                "name": "RollingLogFileAppender",
                "nodes": {
                    "file": "C:\\env1\\Log_"
                }
            }]
        }
        ...
    }
    ...
}
```

## Basic example
>web.config example
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<configuration>
  <connectionStrings>
    <add name="connection1" providerName="System.Data.SqlClient" connectionString="initial value"/>
    <add name="connection2" providerName="System.Data.SqlClient" connectionString="initial value"/>
  </connectionStrings>
  <appSettings>
    <add key="setting1" value="test1"/>
    <add key="setting2" value="test2"/>
  </appSettings>

</configuration>
```

>Config.json example
```json
{
  "UAT":{
    "connectionStrings": {
      "connection1": "UAT connection string for connection 1",
      "connection2": "UAT connection string for connection 2"
    },
    "appSettings": {
      "setting1": "value for UAT"
    }
  },
  "QA":{
    "connectionStrings": {
      "connection1": "QA connection string for connection 1",
      "connection2": "QA connection string for connection 2"
    },
    "appSettings": {
      "setting1": "value for QA"
    }
  },
  "dev":{
    "connectionStrings": {
      "connection1": "dev connection string for connection 1",
      "connection2": "dev connection string for connection 2"
    },
    "appSettings": {
      "setting1": "value for dev"
    }
  }  
}
```
>Package.json script example
```json
 "scripts": {
    "replaceConfig": "node ./build/index.js --configXmlFile:test.config --envConfigFile:config.json --envKey:UAT"
    }
```

>Result
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<configuration>
  <connectionStrings>
    <add name="connection1" providerName="System.Data.SqlClient" connectionString="UAT connection string for connection 1"/>
    <add name="connection2" providerName="System.Data.SqlClient" connectionString="UAT connection string for connection 2"/>
  </connectionStrings>
  <appSettings>
    <add key="setting1" value="value for UAT"/>
    <add key="setting2" value="test2"/>
  </appSettings>

</configuration>
```

## MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.