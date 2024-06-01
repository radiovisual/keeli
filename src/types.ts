import { ProblemReporter } from "./classes/problem-reporter.ts";
import { SEVERITY_LEVEL } from "./constants.ts";

export type RuleSeverity = keyof typeof SEVERITY_LEVEL;

export type Config = {
	defaultLocale: string;
	sourceFile: string;
	translationFiles: { [key: string]: string };
	pathToTranslatedFiles: string;
	rules: {
		[key: string]: RuleSeverity;
	};
	dryRun: boolean;
	enabled: boolean;
};

export type Problem = {
	ruleMeta: RuleMeta;
	severity: RuleSeverity;
	locale: string;
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

export type RuleContext = {
	severity: RuleSeverity;
};

export type TranslationFiles = {
	[key: string]: { [key: string]: string };
};

export type Rule = {
	meta: RuleMeta;
	run: (
		translationFiles: TranslationFiles,
		config: Config,
		problemReporter: ProblemReporter,
		context: RuleContext
	) => void;
};
