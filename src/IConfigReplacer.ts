export interface IConfigReplacer {
    (webConfigSource: string, config: any, configKey: string) : Promise<string>
}