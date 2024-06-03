import { createMockProblemReporter } from "../../utils/test-helpers.ts";
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
		const problemStore = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: { greeting: "Hello", farewell: "Goodbye" },
			fr: { greeting: "Bonjour", farewell: "Goodbye" },
		};

		rule.run(translationFiles, baseConfig, problemStore, context);

		const expectedProblem = getUntranslatedMessageProblem({
			key: "farewell",
			locale: "fr",
			severity,
			ruleMeta,
			isIgnored: false,
		});

		expect(problemStore.report).toHaveBeenCalledTimes(1);
		expect(problemStore.report).toHaveBeenCalledWith(expectedProblem);
	});

	it(`should not report translated messages witn severity ${severity}`, () => {
		const problemStore = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: { greeting: "Hello", farewell: "Goodbye" },
			fr: { greeting: "Bonjour", farewell: "[FR] Goodbye" },
		};

		rule.run(translationFiles, baseConfig, problemStore, context);

		expect(problemStore.report).not.toHaveBeenCalled();
	});

	it(`should ignore keys in ignoreKeys with severity ${severity}`, () => {
		const problemStore = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: { greeting: "Hello", farewell: "Goodbye", chocolate: "chocolate" },
			fr: { greeting: "Bonjour", farewell: "Goodbye", chocolate: "chocolate" },
		};

		const ignored1 = getUntranslatedMessageProblem({
			key: "farewell",
			locale: "fr",
			severity,
			ruleMeta,
			isIgnored: true,
		});

		const ignored2 = getUntranslatedMessageProblem({
			key: "chocolate",
			locale: "fr",
			severity,
			ruleMeta,
			isIgnored: true,
		});

		const ignoreKeysContext = {
			...context,
			ignoreKeys: ["farewell", "chocolate"],
		};

		rule.run(translationFiles, baseConfig, problemStore, ignoreKeysContext);

		expect(problemStore.report).toHaveBeenCalledWith(ignored1);
		expect(problemStore.report).toHaveBeenCalledWith(ignored2);
	});

	it(`should not report problems for keys to ignore with severity ${severity}`, () => {
		const problemStore = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: { greeting: "Hello", farewell: "Goodbye", chocolate: "chocolate" },
			fr: { greeting: "Hello", farewell: "Goodbye", chocolate: "chocolate" },
		};

		const expectedProblem = getUntranslatedMessageProblem({
			key: "greeting",
			locale: "fr",
			severity,
			ruleMeta,
			isIgnored: false,
		});

		const ignored1 = getUntranslatedMessageProblem({
			key: "farewell",
			locale: "fr",
			severity,
			ruleMeta,
			isIgnored: true,
		});

		const ignored2 = getUntranslatedMessageProblem({
			key: "farewell",
			locale: "fr",
			severity,
			ruleMeta,
			isIgnored: true,
		});

		const ignoreKeysContext = {
			...context,
			ignoreKeys: ["farewell", "chocolate"],
		};

		rule.run(translationFiles, baseConfig, problemStore, ignoreKeysContext);

		expect(problemStore.report).toHaveBeenCalledWith(expectedProblem);
		expect(problemStore.report).toHaveBeenCalledWith(ignored1);
		expect(problemStore.report).toHaveBeenCalledWith(ignored2);
		expect(problemStore.report).toHaveBeenCalledTimes(3);
	});
});

describe(`${rule.meta.name}: off`, () => {
	const problemStore = createMockProblemReporter();

	const context: RuleContext = {
		severity: "off",
		ignoreKeys: [],
	};

	const translationFiles: TranslationFiles = {
		en: { greeting: "Hello", farewell: "Goodbye" },
		fr: { greeting: "Bonjour", farewell: "Goodbye" },
	};

	rule.run(translationFiles, baseConfig, problemStore, context);
	expect(problemStore.report).not.toHaveBeenCalled();
});
