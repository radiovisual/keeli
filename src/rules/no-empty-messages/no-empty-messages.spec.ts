import { createMockProblemReporter } from "../../tests/utils/test-helpers.ts";
import {
	Config,
	RuleContext,
	RuleSeverity,
	TranslationFiles,
} from "../../types.ts";
import { noEmptyMessages } from "./no-empty-messages.ts";
import {
	getEmptySourceMessageProblem,
	getEmptyTranslatedMessageProblem,
} from "./problems.ts";

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
		const problemReporter = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: { greeting: "Hello", empty: "" },
			fr: { greeting: "Bonjour", empty: "not empty" },
		};

		rule.run(translationFiles, baseConfig, problemReporter, context);

		const expectedProblem = getEmptySourceMessageProblem({
			key: "empty",
			locale: "en",
			severity: severity as RuleSeverity,
			ruleMeta,
		});

		expect(problemReporter.report).toHaveBeenCalledWith(expectedProblem, false);
		expect(problemReporter.report).toHaveBeenCalledTimes(1);
	});

	it(`should report empty messages in translation file with severity: ${severity}`, () => {
		const problemReporter = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: { greeting: "Hello", empty: "not empty" },
			fr: { greeting: "Bonjour", empty: "" },
		};

		rule.run(translationFiles, baseConfig, problemReporter, context);

		const expectedProblem = getEmptyTranslatedMessageProblem({
			key: "empty",
			locale: "fr",
			severity: severity as RuleSeverity,
			ruleMeta,
		});

		expect(problemReporter.report).toHaveBeenCalledWith(expectedProblem, false);
		expect(problemReporter.report).toHaveBeenCalledTimes(1);
	});

	it(`should ignore keys in ignoreKeys with severity: ${severity}`, () => {
		const problemReporter = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: { greeting: "Hello", empty: "not empty" },
			fr: { greeting: "Bonjour", empty: "" },
		};

		const ignoreKeys = ["empty"];

		const ignoreKeysContext = {
			...context,
			ignoreKeys,
		};

		rule.run(translationFiles, baseConfig, problemReporter, ignoreKeysContext);

		const ignoredProblem = getEmptyTranslatedMessageProblem({
			key: "empty",
			locale: "fr",
			severity: severity as RuleSeverity,
			ruleMeta,
		});

		const shouldIgnore = true;

		expect(problemReporter.report).toHaveBeenCalledWith(
			ignoredProblem,
			shouldIgnore
		);
	});

	it(`should not report problems for keys to ignore with severity ${severity}`, () => {
		const problemReporter = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: { greeting: "", farewell: "", chocolate: "" },
			fr: { greeting: "", farewell: "", chocolate: "" },
		};

		const expected1 = getEmptySourceMessageProblem({
			key: "greeting",
			locale: "en",
			severity: severity as RuleSeverity,
			ruleMeta,
		});

		const ignored1 = getEmptySourceMessageProblem({
			key: "farewell",
			locale: "en",
			severity: severity as RuleSeverity,
			ruleMeta,
		});

		const ignored2 = getEmptySourceMessageProblem({
			key: "chocolate",
			locale: "en",
			severity: severity as RuleSeverity,
			ruleMeta,
		});

		const ignored3 = getEmptyTranslatedMessageProblem({
			key: "chocolate",
			locale: "fr",
			severity: severity as RuleSeverity,
			ruleMeta,
		});

		const ignored4 = getEmptyTranslatedMessageProblem({
			key: "farewell",
			locale: "fr",
			severity: severity as RuleSeverity,
			ruleMeta,
		});

		const expected2 = getEmptyTranslatedMessageProblem({
			key: "greeting",
			locale: "fr",
			severity: severity as RuleSeverity,
			ruleMeta,
		});

		const ignoreKeysContext = {
			...context,
			ignoreKeys: ["farewell", "chocolate"],
		};

		rule.run(translationFiles, baseConfig, problemReporter, ignoreKeysContext);

		expect(problemReporter.report).toHaveBeenCalledWith(expected1, false);
		expect(problemReporter.report).toHaveBeenCalledWith(expected2, false);
		expect(problemReporter.report).toHaveBeenCalledWith(ignored1, true);
		expect(problemReporter.report).toHaveBeenCalledWith(ignored2, true);
		expect(problemReporter.report).toHaveBeenCalledWith(ignored3, true);
		expect(problemReporter.report).toHaveBeenCalledWith(ignored4, true);
		expect(problemReporter.report).toHaveBeenCalledTimes(6);
	});

	it("should not report non-empty messages", () => {
		const problemReporter = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: { greeting: "Hello", farewell: "Goodbye" },
			fr: { greeting: "Bonjour", farewell: "Au revoir" },
		};

		rule.run(translationFiles, baseConfig, problemReporter, context);

		expect(problemReporter.report).not.toHaveBeenCalled();
	});
});

describe(`${rule.meta.name}: off`, () => {
	it("should not report problems when severity = off", () => {
		const problemReporter = createMockProblemReporter();

		const context: RuleContext = {
			severity: "off",
			ignoreKeys: [],
		};

		const translationFiles: TranslationFiles = {
			en: { greeting: "Hello", empty: "" },
			fr: { greeting: "Bonjour", empty: "" },
		};

		rule.run(translationFiles, baseConfig, problemReporter, context);
		expect(problemReporter.report).not.toHaveBeenCalled();
	});
});
