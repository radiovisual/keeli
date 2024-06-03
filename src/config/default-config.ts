import { Config } from "../types.ts";

const config: Config = {
	defaultLocale: "",
	sourceFile: "",
	translationFiles: {},
	pathToTranslatedFiles: "",
	rules: {
		"no-untranslated-messages": "error",
		"no-empty-messages": "error",
		"no-invalid-variables": "error",
		"no-html-messages": "error",
		"no-missing-keys": "error",
	},
	dryRun: false,
	enabled: true,
};

export { config };
