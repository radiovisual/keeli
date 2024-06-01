import { createMockProblemReporter } from "../../tests/utils/test-helpers.ts";
import {
	Config,
	RuleContext,
	RuleSeverity,
	TranslationFiles,
} from "../../types.js";
import { noUntranslatedMessages } from "./no-untranslated-messages.ts";
import { getUntranslatedMessageProblem } from "./problems.ts";

const ruleMeta = noUntranslatedMessages.meta;
const rule = noUntranslatedMessages;

const defaultLocale = "en";

const baseConfig: Config = {
	defaultLocale,
	sourceFile: "en.json",
	translationFiles: { fr: "fr.json" },
	pathToTranslatedFiles: "i18n",
	rules: {
		"no-untranslated-messages": "error",
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

	it(`should report untranslated messages with ${severity}`, () => {
		const problemReporter = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: { greeting: "Hello", farewell: "Goodbye" },
			fr: { greeting: "Bonjour", farewell: "Goodbye" },
		};

		rule.run(translationFiles, baseConfig, problemReporter, context);

		const expectedProblem = getUntranslatedMessageProblem({
			key: "farewell",
			locale: "fr",
			severity,
			ruleMeta,
		});

		expect(problemReporter.report).toHaveBeenCalledTimes(1);
		expect(problemReporter.report).toHaveBeenCalledWith(expectedProblem);
	});

	it(`should not report translated messages witn severity ${severity}`, () => {
		const problemReporter = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: { greeting: "Hello", farewell: "Goodbye" },
			fr: { greeting: "Bonjour", farewell: "Goodbye" },
		};

		rule.run(translationFiles, baseConfig, problemReporter, context);

		const expectedProblem = getUntranslatedMessageProblem({
			key: "greeting",
			locale: "fr",
			severity,
			ruleMeta,
		});

		expect(problemReporter.report).not.toHaveBeenCalledWith(expectedProblem);
	});

	it(`should ignore keys in ignoreKeys with severity ${severity}`, () => {
		const problemReporter = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: { greeting: "Hello", farewell: "Goodbye", chocolate: "chocolate" },
			fr: { greeting: "Bonjour", farewell: "Goodbye", chocolate: "chocolate" },
		};

		const ignoreKeysContext = {
			...context,
			ignoreKeys: ["farewell", "chocolate"],
		};

		rule.run(translationFiles, baseConfig, problemReporter, ignoreKeysContext);

		expect(problemReporter.report).not.toHaveBeenCalled();
	});

	it(`should not report problems for keys to ignore with severity ${severity}`, () => {
		const problemReporter = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: { greeting: "Hello", farewell: "Goodbye", chocolate: "chocolate" },
			fr: { greeting: "Hello", farewell: "Goodbye", chocolate: "chocolate" },
		};

		const expectedProblem = getUntranslatedMessageProblem({
			key: "greeting",
			locale: "fr",
			severity,
			ruleMeta,
		});

		const ignoredProblem1 = getUntranslatedMessageProblem({
			key: "farewell",
			locale: "fr",
			severity,
			ruleMeta,
		});

		const ignoredProblem2 = getUntranslatedMessageProblem({
			key: "farewell",
			locale: "fr",
			severity,
			ruleMeta,
		});

		const ignoreKeysContext = {
			...context,
			ignoreKeys: ["farewell", "chocolate"],
		};

		rule.run(translationFiles, baseConfig, problemReporter, ignoreKeysContext);

		expect(problemReporter.report).toHaveBeenCalledWith(expectedProblem);
		expect(problemReporter.report).not.toHaveBeenCalledWith(ignoredProblem1);
		expect(problemReporter.report).not.toHaveBeenCalledWith(ignoredProblem2);
		expect(problemReporter.report).toHaveBeenCalledTimes(1);
	});
});

describe(`${rule.meta.name}: off`, () => {
	const problemReporter = createMockProblemReporter();

	const context: RuleContext = {
		severity: "off",
		ignoreKeys: [],
	};

	const translationFiles: TranslationFiles = {
		en: { greeting: "Hello", farewell: "Goodbye" },
		fr: { greeting: "Bonjour", farewell: "Goodbye" },
	};

	rule.run(translationFiles, baseConfig, problemReporter, context);
	expect(problemReporter.report).not.toHaveBeenCalled();
});
