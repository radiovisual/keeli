export type RuleConfig = "error" | "warning" | "off";

export interface Config {
  defaultLocale: string;
  sourceFile: string;
  supportedTranslations: string[];
  pathToTranslatedFiles: string;
  rules: {
    [key: string]: RuleConfig;
  };
  dryRun: boolean;
  enabled: boolean;
}

export interface Problem {
  name: string;
  locale: string;
  url: string;
  message: string;
  expected?: string;
  recieved?: string;
}

export interface RuleMeta {
  name: string;
  defaultConfig: RuleConfig;
  description: string;
  type: "configuration" | "validation";
  url: string;
}

export interface Rule {
  meta: RuleMeta;
  run: (fileContent: string, config: Config) => Problem[];
}
