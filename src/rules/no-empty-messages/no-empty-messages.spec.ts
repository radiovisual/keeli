import { createMockProblemReporter } from "../../utils/test-helpers.js";
import {
	Config,
	RuleContext,
	RuleSeverity,
	TranslationFiles,
} from "../../types.js";
import { noEmptyMessages } from "./no-empty-messages.js";
import {
	getEmptySourceMessageProblem,
	getEmptyTranslatedMessageProblem,
} from "./problems.js";

const ruleMeta = noEmptyMessages.meta;
const rule = noEmptyMessages;

const defaultLocale = "en";

const baseConfig: Config = {
	defaultLocale,
	sourceFile: "en.json",
	translationFiles: { fr: "fr.json" },
	pathToTranslatedFiles: "i18n",
	rules: {
		"no-empty-messages": "error",
	},
	dryRun: false,
	enabled: true,
};

describe.each([["error"], ["warning"]])(`${rule.meta.name}`, (severity) => {
	const context: RuleContext = {
		severity: severity as RuleSeverity,
		ignoreKeys: [],
	};

	it(`should report empty messages in the source file with severity: ${severity}`, () => {
		const problemStore = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: { greeting: "Hello", empty: "" },
			fr: { greeting: "Bonjour", empty: "not empty" },
		};

		rule.run(translationFiles, baseConfig, problemStore, context);

		const expectedProblem = getEmptySourceMessageProblem({
			key: "empty",
			locale: "en",
			severity: severity as RuleSeverity,
			ruleMeta,
			isIgnored: false,
		});

		expect(problemStore.report).toHaveBeenCalledWith(expectedProblem);
		expect(problemStore.report).toHaveBeenCalledTimes(1);
	});

	it(`should report empty messages in translation file with severity: ${severity}`, () => {
		const problemStore = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: { greeting: "Hello", empty: "not empty" },
			fr: { greeting: "Bonjour", empty: "" },
		};

		rule.run(translationFiles, baseConfig, problemStore, context);

		const expectedProblem = getEmptyTranslatedMessageProblem({
			key: "empty",
			locale: "fr",
			severity: severity as RuleSeverity,
			ruleMeta,
			isIgnored: false,
		});

		expect(problemStore.report).toHaveBeenCalledWith(expectedProblem);
		expect(problemStore.report).toHaveBeenCalledTimes(1);
	});

	it(`should ignore keys in ignoreKeys with severity: ${severity}`, () => {
		const problemStore = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: { greeting: "Hello", empty: "not empty" },
			fr: { greeting: "Bonjour", empty: "" },
		};

		const ignoreKeys = ["empty"];

		const ignoreKeysContext = {
			...context,
			ignoreKeys,
		};

		rule.run(translationFiles, baseConfig, problemStore, ignoreKeysContext);

		const ignoredProblem = getEmptyTranslatedMessageProblem({
			key: "empty",
			locale: "fr",
			severity: severity as RuleSeverity,
			ruleMeta,
			isIgnored: true,
		});

		expect(problemStore.report).toHaveBeenCalledWith(ignoredProblem);
	});

	it(`should not report problems for keys to ignore with severity ${severity}`, () => {
		const problemStore = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: { greeting: "", farewell: "", chocolate: "" },
			fr: { greeting: "", farewell: "", chocolate: "" },
		};

		const expected1 = getEmptySourceMessageProblem({
			key: "greeting",
			locale: "en",
			severity: severity as RuleSeverity,
			ruleMeta,
			isIgnored: false,
		});

		const ignored1 = getEmptySourceMessageProblem({
			key: "farewell",
			locale: "en",
			severity: severity as RuleSeverity,
			ruleMeta,
			isIgnored: true,
		});

		const ignored2 = getEmptySourceMessageProblem({
			key: "chocolate",
			locale: "en",
			severity: severity as RuleSeverity,
			ruleMeta,
			isIgnored: true,
		});

		const ignored3 = getEmptyTranslatedMessageProblem({
			key: "chocolate",
			locale: "fr",
			severity: severity as RuleSeverity,
			ruleMeta,
			isIgnored: true,
		});

		const ignored4 = getEmptyTranslatedMessageProblem({
			key: "farewell",
			locale: "fr",
			severity: severity as RuleSeverity,
			ruleMeta,
			isIgnored: true,
		});

		const expected2 = getEmptyTranslatedMessageProblem({
			key: "greeting",
			locale: "fr",
			severity: severity as RuleSeverity,
			ruleMeta,
			isIgnored: false,
		});

		const ignoreKeysContext = {
			...context,
			ignoreKeys: ["farewell", "chocolate"],
		};

		rule.run(translationFiles, baseConfig, problemStore, ignoreKeysContext);

		expect(problemStore.report).toHaveBeenCalledWith(expected1);
		expect(problemStore.report).toHaveBeenCalledWith(expected2);
		expect(problemStore.report).toHaveBeenCalledWith(ignored1);
		expect(problemStore.report).toHaveBeenCalledWith(ignored2);
		expect(problemStore.report).toHaveBeenCalledWith(ignored3);
		expect(problemStore.report).toHaveBeenCalledWith(ignored4);
		expect(problemStore.report).toHaveBeenCalledTimes(6);
	});

	it("should not report non-empty messages", () => {
		const problemStore = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: { greeting: "Hello", farewell: "Goodbye" },
			fr: { greeting: "Bonjour", farewell: "Au revoir" },
		};

		rule.run(translationFiles, baseConfig, problemStore, context);

		expect(problemStore.report).not.toHaveBeenCalled();
	});
});

describe(`${rule.meta.name}: off`, () => {
	it("should not report problems when severity = off", () => {
		const problemStore = createMockProblemReporter();

		const context: RuleContext = {
			severity: "off",
			ignoreKeys: [],
		};

		const translationFiles: TranslationFiles = {
			en: { greeting: "Hello", empty: "" },
			fr: { greeting: "Bonjour", empty: "" },
		};

		rule.run(translationFiles, baseConfig, problemStore, context);
		expect(problemStore.report).not.toHaveBeenCalled();
	});
});
