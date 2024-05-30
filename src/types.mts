export type RuleSeverity = "error" | "warning" | "off";

export type Config = {
  defaultLocale: string;
  sourceFile: string;
  supportedTranslations: string[];
  pathToTranslatedFiles: string;
  rules: {
    [key: string]: RuleSeverity;
  };
  dryRun: boolean;
  enabled: boolean;
};

export type Problem = {
  severity: RuleSeverity;
  name: string;
  locale: string;
  url: string;
  message: string;
  expected?: string;
  recieved?: string;
};

export type RuleMeta = {
  name: string;
  defaultSeverity: RuleSeverity;
  description: string;
  type: "configuration" | "validation";
  url: string;
};

export type Rule = {
  meta: RuleMeta;
  run: (fileContent: string, config: Config) => Problem[];
};
