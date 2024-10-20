import { Config } from "../types.ts";

const defaultConfig: Config = {
	defaultLocale: "",
	sourceFile: "",
	translationFiles: {},
	pathToTranslatedFiles: "",
	rules: {
		"no-empty-messages": "error",
		"no-extra-whitespace": "error",
		"no-invalid-variables": "error",
		"no-malformed-keys": "error",
		"no-untranslated-messages": "error",
		"no-html-messages": "error",
		"no-missing-keys": "error",
	},
	dryRun: false,
	enabled: true,
	verbose: false,
};

export { defaultConfig };
