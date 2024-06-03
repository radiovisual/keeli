import { ProblemStore } from "./classes/problem-store.class.ts";
import { SEVERITY_LEVEL, RULE_TYPE } from "./constants.ts";

export type RuleSeverity = keyof typeof SEVERITY_LEVEL;
export type RuleAdvancedConfig = {
	severity: RuleSeverity;
	ignoreKeys?: string[];
};

export type Config = {
	defaultLocale: string;
	sourceFile: string;
	translationFiles: { [key: string]: string };
	pathToTranslatedFiles: string;
	rules: {
		[key: string]: RuleSeverity | RuleAdvancedConfig;
	};
	dryRun: boolean;
	enabled: boolean;
};

export type Problem = {
	ruleMeta: RuleMeta;
	severity: RuleSeverity;
	locale: string;
	message: string;
	isIgnored: boolean;
	expected?: string | number | object;
	received?: string | number | object;
};

export interface ProblemContext extends Problem {
	key: string;
}

export type RuleMeta = {
	name: string;
	defaultSeverity: RuleSeverity;
	description: string;
	type: keyof typeof RULE_TYPE;
	url: string;
};

export type RuleContext = {
	severity: RuleSeverity;
	ignoreKeys: string[];
};

export type TranslationFiles = {
	[key: string]: { [key: string]: string };
};

export type Rule = {
	meta: RuleMeta;
	run: (
		translationFiles: TranslationFiles,
		config: Config,
		problemStore: ProblemStore,
		context: RuleContext
	) => void;
};
