import { Config } from "../types.ts";

const config: Config = {
	defaultLocale: "en",
	sourceFile: "en.json",
	translationFiles: {},
	pathToTranslatedFiles: "i18n",
	rules: {
		"no-untranslated-messages": "error",
		"no-empty-messages": "error",
		"no-invalid-variables": "error",
		"no-html-messages": "error",
	},
	dryRun: false,
	enabled: true,
};

export { config };
