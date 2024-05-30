import { Config } from "../types.mjs";

const config: Config = {
  defaultLocale: "en",
  sourceFile: "en.json",
  supportedTranslations: [],
  pathToTranslatedFiles: "i18n",
  rules: {
    "no-untranslated-files": "error",
  },
  dryRun: false,
  enabled: true,
};

export { config };
