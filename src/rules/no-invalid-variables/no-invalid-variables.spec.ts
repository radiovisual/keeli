import { createMockProblemReporter } from "../../utils/test-helpers.ts";
import {
	Config,
	RuleContext,
	RuleSeverity,
	TranslationFiles,
} from "../../types.js";
import { noInvalidVariables } from "./no-invalid-variables";
import {
	getMismatchedVariableFromSourceProblem,
	getMissingVariableFromSourceProblem,
	getInvalidVariableSyntaxProblem,
	getUnbalancedVariableBracketsSyntaxProblem,
} from "./problems.ts";

const ruleMeta = noInvalidVariables.meta;
const rule = noInvalidVariables;

const defaultLocale = "en";

const baseConfig: Config = {
	defaultLocale,
	sourceFile: "en.json",
	translationFiles: { fr: "fr.json", de: "de.json" },
	pathToTranslatedFiles: "i18n",
	rules: {
		"no-invalid-variables": "error",
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

	it(`should report missing variables in translation files with ${severity}`, () => {
		const problemReporter = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: { greeting: "[EN] {firstName}", farewell: "[EN] {firstName}" },
			fr: { greeting: "[FR]", farewell: "[FR]" },
		};

		rule.run(translationFiles, baseConfig, problemReporter, context);

		const expected1 = getMissingVariableFromSourceProblem({
			key: "greeting",
			locale: "fr",
			severity,
			ruleMeta,
			expected: "firstName",
			received: "",
		});

		const expected2 = getMissingVariableFromSourceProblem({
			key: "farewell",
			locale: "fr",
			severity,
			ruleMeta,
			expected: "firstName",
			received: "",
		});

		expect(problemReporter.report).toHaveBeenCalledTimes(2);
		expect(problemReporter.report).toHaveBeenCalledWith(expected1, false);
		expect(problemReporter.report).toHaveBeenCalledWith(expected2, false);
	});

	it(`should report unexpected variables in translation files with ${severity}`, () => {
		const problemReporter = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: { greeting: "[EN]", farewell: "[EN]" },
			fr: {
				greeting: "[FR] {unexpectedVariable}",
				farewell: "[FR] {unexpectedVariable}",
			},
		};

		rule.run(translationFiles, baseConfig, problemReporter, context);

		const expected1 = getMismatchedVariableFromSourceProblem({
			key: "greeting",
			locale: "fr",
			severity,
			ruleMeta,
			expected: "",
			received: "unexpectedVariable",
		});

		const expected2 = getMismatchedVariableFromSourceProblem({
			key: "farewell",
			locale: "fr",
			severity,
			ruleMeta,
			expected: "",
			received: "unexpectedVariable",
		});

		expect(problemReporter.report).toHaveBeenCalledTimes(2);
		expect(problemReporter.report).toHaveBeenCalledWith(expected1, false);
		expect(problemReporter.report).toHaveBeenCalledWith(expected2, false);
	});

	it(`should report malformed variables in translation files with ${severity}`, () => {
		const problemReporter = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: {
				greeting: "[EN] {expectedGreetingVariable}",
				farewell: "[EN] {expectedFarewellVariable}",
			},
			fr: {
				greeting: "[FR] {expectedGreetingVariable",
				farewell: "[FR] {expectedFarewellVariable}",
			},
		};

		rule.run(translationFiles, baseConfig, problemReporter, context);

		const expected1 = getUnbalancedVariableBracketsSyntaxProblem({
			key: "greeting",
			locale: "fr",
			severity,
			ruleMeta,
			expected: undefined,
			received: translationFiles.fr.greeting,
		});

		const expected2 = getInvalidVariableSyntaxProblem({
			key: "greeting",
			locale: "fr",
			severity,
			ruleMeta,
			expected: undefined,
			received: translationFiles.fr.greeting,
		});

		const expected3 = getMissingVariableFromSourceProblem({
			key: "greeting",
			locale: "fr",
			severity,
			ruleMeta,
			expected: "expectedGreetingVariable",
			received: "",
		});

		// expect(problemReporter.report).toHaveBeenCalledTimes(1);
		expect(problemReporter.report).toHaveBeenCalledWith(expected1, false);
		expect(problemReporter.report).toHaveBeenCalledWith(expected2, false);
		expect(problemReporter.report).toHaveBeenCalledWith(expected3, false);
	});

	it(`should report unbalanced variable brackets in the source file with ${severity}`, () => {
		const problemReporter = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: {
				greeting: "[EN] {greetingName",
				farewell: "[EN] {farewellName",
			},
			fr: {
				greeting: "[FR] {greetingName}",
				farewell: "[FR] {farewellName}",
			},
		};

		rule.run(translationFiles, baseConfig, problemReporter, context);

		const expected1 = getUnbalancedVariableBracketsSyntaxProblem({
			key: "greeting",
			locale: "en",
			severity,
			ruleMeta,
			expected: undefined,
			received: "[EN] {greetingName",
		});

		const expected2 = getUnbalancedVariableBracketsSyntaxProblem({
			key: "farewell",
			locale: "en",
			severity,
			ruleMeta,
			expected: undefined,
			received: "[EN] {farewellName",
		});

		const expected3 = getMismatchedVariableFromSourceProblem({
			key: "greeting",
			locale: "fr",
			severity,
			ruleMeta,
			expected: "",
			received: "greetingName",
		});

		const expected4 = getMismatchedVariableFromSourceProblem({
			key: "farewell",
			locale: "fr",
			severity,
			ruleMeta,
			expected: "",
			received: "farewellName",
		});

		expect(problemReporter.report).toHaveBeenCalledTimes(4);
		expect(problemReporter.report).toHaveBeenCalledWith(expected1, false);
		expect(problemReporter.report).toHaveBeenCalledWith(expected2, false);
		expect(problemReporter.report).toHaveBeenCalledWith(expected3, false);
		expect(problemReporter.report).toHaveBeenCalledWith(expected4, false);
	});

	it(`should ignore keys in ignoreKeys with severity ${severity}`, () => {
		const problemReporter = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: { greeting: "[EN] {firstName}", farewell: "[EN] {firstName}" },
			fr: { greeting: "[FR]", farewell: "[FR]" },
		};

		const ignored1 = getMissingVariableFromSourceProblem({
			key: "farewell",
			locale: "fr",
			severity,
			ruleMeta,
			expected: "firstName",
			received: "",
		});

		const ignored2 = getMissingVariableFromSourceProblem({
			key: "greeting",
			locale: "fr",
			severity,
			ruleMeta,
			expected: "firstName",
			received: "",
		});

		const ignoreKeysContext = {
			...context,
			ignoreKeys: ["farewell", "greeting"],
		};

		rule.run(translationFiles, baseConfig, problemReporter, ignoreKeysContext);

		expect(problemReporter.report).toHaveBeenCalledWith(ignored1, true);
		expect(problemReporter.report).toHaveBeenCalledWith(ignored2, true);
	});

	it(`should not report problems for keys to ignore with severity ${severity}`, () => {
		const problemReporter = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: {
				greeting: "[EN] {firstName}",
				farewell: "[EN] {firstName}",
				chocolate: "[EN] {chocolate}",
			},
			fr: { greeting: "[FR]", farewell: "[FR]", chocolate: "[FR]" },
			de: { greeting: "[DE]", farewell: "[DE]", chocolate: "[DE]" },
		};

		const expected1 = getMissingVariableFromSourceProblem({
			key: "greeting",
			locale: "fr",
			severity,
			ruleMeta,
			expected: "firstName",
			received: "",
		});

		const expected2 = getMissingVariableFromSourceProblem({
			key: "greeting",
			locale: "de",
			severity,
			ruleMeta,
			expected: "firstName",
			received: "",
		});

		const ignored1 = getMissingVariableFromSourceProblem({
			key: "chocolate",
			locale: "fr",
			severity,
			ruleMeta,
			expected: "chocolate",
			received: "",
		});

		const ignored2 = getMissingVariableFromSourceProblem({
			key: "chocolate",
			locale: "de",
			severity,
			ruleMeta,
			expected: "chocolate",
			received: "",
		});

		const ignored3 = getMissingVariableFromSourceProblem({
			key: "farewell",
			locale: "fr",
			severity,
			ruleMeta,
			expected: "firstName",
			received: "",
		});

		const ignored4 = getMissingVariableFromSourceProblem({
			key: "farewell",
			locale: "de",
			severity,
			ruleMeta,
			expected: "firstName",
			received: "",
		});

		const ignoreKeysContext = {
			...context,
			ignoreKeys: ["farewell", "chocolate"],
		};

		rule.run(translationFiles, baseConfig, problemReporter, ignoreKeysContext);

		expect(problemReporter.report).toHaveBeenCalledWith(ignored1, true);
		expect(problemReporter.report).toHaveBeenCalledWith(ignored2, true);
		expect(problemReporter.report).toHaveBeenCalledWith(ignored3, true);
		expect(problemReporter.report).toHaveBeenCalledWith(ignored4, true);
		expect(problemReporter.report).toHaveBeenCalledWith(expected1, false);
		expect(problemReporter.report).toHaveBeenCalledWith(expected2, false);
	});
});

describe(`${rule.meta.name}: off`, () => {
	const problemReporter = createMockProblemReporter();

	const context: RuleContext = {
		severity: "off",
		ignoreKeys: [],
	};

	const translationFiles: TranslationFiles = {
		en: {
			a: "[EN] {a}",
			b: "[EN] {b}",
			c: "[EN] {c}",
		},
		fr: { a: "[FR]", b: "[FR]", c: "[FR]" },
		de: { a: "[DE]", b: "[FR]", c: "[DE]" },
	};

	rule.run(translationFiles, baseConfig, problemReporter, context);
	expect(problemReporter.report).not.toHaveBeenCalled();
});
