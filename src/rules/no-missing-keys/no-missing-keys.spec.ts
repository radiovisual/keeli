import { createMockProblemReporter } from "../../utils/test-helpers.ts";
import {
	Config,
	RuleContext,
	RuleSeverity,
	TranslationFiles,
} from "../../types.ts";
import { noMissingKeys } from "./no-missing-keys.ts";
import {
	getMissingExpectedKeyFoundProblem,
	getUnexpectedKeyFoundProblem,
} from "./problems.ts";

const ruleMeta = noMissingKeys.meta;
const rule = noMissingKeys;

const defaultLocale = "en";

const baseConfig: Config = {
	defaultLocale,
	sourceFile: "en.json",
	translationFiles: { fr: "fr.json", de: "de.json" },
	pathToTranslatedFiles: "i18n",
	rules: {
		"no-missing-keys": "error",
	},
	dryRun: false,
	enabled: true,
};

describe.each([["error"], ["warning"]])(`${rule.meta.name}`, (severityStr) => {
	const severity = severityStr as unknown as RuleSeverity;

	const context: RuleContext = {
		severity,
		ignoreKeys: [],
	};

	it(`should report missing keys in translation files with ${severity}`, () => {
		const problemStore = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: { expected1: "[EN] expected one", expected2: "[EN] expected two" },
			fr: {},
		};

		rule.run(translationFiles, baseConfig, problemStore, context);

		const expected1 = getMissingExpectedKeyFoundProblem({
			key: "expected1",
			locale: "fr",
			severity,
			ruleMeta,
		});

		const expected2 = getMissingExpectedKeyFoundProblem({
			key: "expected2",
			locale: "fr",
			severity,
			ruleMeta,
		});

		expect(problemStore.report).toHaveBeenCalledTimes(2);
		expect(problemStore.report).toHaveBeenCalledWith(expected1);
		expect(problemStore.report).toHaveBeenCalledWith(expected2);
	});

	it(`should report missing keys and unexpected keys in translation files with ${severity}`, () => {
		const problemStore = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: { expected1: "[EN] expected one", expected2: "[EN] expected two" },
			fr: { unexpected: "[FR] expected one", expected2: "[FR] expected two" },
		};

		rule.run(translationFiles, baseConfig, problemStore, context);

		const expected1 = getUnexpectedKeyFoundProblem({
			key: "unexpected",
			locale: "fr",
			severity,
			ruleMeta,
		});

		const expected2 = getMissingExpectedKeyFoundProblem({
			key: "expected1",
			locale: "fr",
			severity,
			ruleMeta,
		});

		expect(problemStore.report).toHaveBeenCalledTimes(2);
		expect(problemStore.report).toHaveBeenCalledWith(expected1);
		expect(problemStore.report).toHaveBeenCalledWith(expected2);
	});
});

describe(`${rule.meta.name}: off`, () => {
	const problemStore = createMockProblemReporter();

	const context: RuleContext = {
		severity: "off",
		ignoreKeys: [],
	};

	const translationFiles: TranslationFiles = {
		en: { expected1: "[EN] expected one", expected2: "[EN] expected two" },
		fr: { unexpected: "[FR] expected one", expected2: "[FR] expected two" },
	};

	rule.run(translationFiles, baseConfig, problemStore, context);
	expect(problemStore.report).not.toHaveBeenCalled();
});
