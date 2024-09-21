import { createMockProblemReporter } from "../../utils/test-helpers.ts";
import {
	Config,
	RuleContext,
	RuleSeverity,
	TranslationFiles,
} from "../../types.ts";
import { noInvalidSeverity } from "./no-invalid-severity.ts";
import { getInvalidSeverityProblem } from "./problems.ts";

const ruleMeta = noInvalidSeverity.meta;
const rule = noInvalidSeverity;

const defaultLocale = "en";

const baseConfig: Config = {
	defaultLocale,
	sourceFile: "en.json",
	translationFiles: { fr: "fr.json" },
	pathToTranslatedFiles: "i18n",
	rules: {},
	dryRun: false,
	enabled: true,
};

const translationFiles: TranslationFiles = {
	en: { greeting: "Hello" },
	fr: { greeting: "Bonjour" },
};

const context: RuleContext = {
	severity: ruleMeta.defaultSeverity,
	ignoreKeys: [],
};

describe(`${rule.meta.name}`, () => {
	it(`should report invalid rule severities`, () => {
		const problemStore = createMockProblemReporter();

		const { severity } = context;

		const inValidSeverity = "foo" as RuleSeverity;

		const config: Config = {
			...baseConfig,
			rules: {
				"no-html-messages": inValidSeverity,
			},
		};

		rule.run(translationFiles, config, problemStore, context);

		const expectedProblem = getInvalidSeverityProblem(
			{
				severity: severity as RuleSeverity,
				ruleMeta,
			},
			inValidSeverity,
			"no-html-messages"
		);

		expect(problemStore.report).toHaveBeenCalledWith(expectedProblem);
		expect(problemStore.report).toHaveBeenCalledTimes(1);
	});
});
