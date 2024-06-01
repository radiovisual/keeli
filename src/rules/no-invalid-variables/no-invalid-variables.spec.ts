import { createMockProblemReporter } from "../../tests/utils/test-helpers.ts";
import {
	Config,
	RuleContext,
	RuleSeverity,
	TranslationFiles,
} from "../../types.js";
import { noInvalidVariables } from "./no-invalid-variables.ts";
import {
	getMismatchedVariableFromSourceProblem,
	getMissingVariableFromSourceProblem,
	getInvalidVariableSyntaxProblem,
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

		const expectedProblem1 = getMissingVariableFromSourceProblem({
			key: "greeting",
			locale: "fr",
			severity,
			ruleMeta,
			expected: "firstName",
			received: "",
		});

		const expectedProblem2 = getMissingVariableFromSourceProblem({
			key: "farewell",
			locale: "fr",
			severity,
			ruleMeta,
			expected: "firstName",
			received: "",
		});

		expect(problemReporter.report).toHaveBeenCalledTimes(2);
		expect(problemReporter.report).toHaveBeenCalledWith(expectedProblem1);
		expect(problemReporter.report).toHaveBeenCalledWith(expectedProblem2);
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

		const expectedProblem1 = getMismatchedVariableFromSourceProblem({
			key: "greeting",
			locale: "fr",
			severity,
			ruleMeta,
			expected: "",
			received: "unexpectedVariable",
		});

		const expectedProblem2 = getMismatchedVariableFromSourceProblem({
			key: "farewell",
			locale: "fr",
			severity,
			ruleMeta,
			expected: "",
			received: "unexpectedVariable",
		});

		expect(problemReporter.report).toHaveBeenCalledTimes(2);
		expect(problemReporter.report).toHaveBeenCalledWith(expectedProblem1);
		expect(problemReporter.report).toHaveBeenCalledWith(expectedProblem2);
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

		const expectedProblem1 = getInvalidVariableSyntaxProblem({
			key: "greeting",
			locale: "en",
			severity,
			ruleMeta,
			expected: undefined,
			received: "[EN] {greetingName",
		});

		const expectedProblem2 = getInvalidVariableSyntaxProblem({
			key: "farewell",
			locale: "en",
			severity,
			ruleMeta,
			expected: undefined,
			received: "[EN] {farewellName",
		});

		const expectedProblem3 = getMismatchedVariableFromSourceProblem({
			key: "greeting",
			locale: "fr",
			severity,
			ruleMeta,
			expected: "",
			received: "greetingName",
		});

		const expectedProblem4 = getMismatchedVariableFromSourceProblem({
			key: "farewell",
			locale: "fr",
			severity,
			ruleMeta,
			expected: "",
			received: "farewellName",
		});

		expect(problemReporter.report).toHaveBeenCalledTimes(4);
		expect(problemReporter.report).toHaveBeenCalledWith(expectedProblem1);
		expect(problemReporter.report).toHaveBeenCalledWith(expectedProblem2);
		expect(problemReporter.report).toHaveBeenCalledWith(expectedProblem3);
		expect(problemReporter.report).toHaveBeenCalledWith(expectedProblem4);
	});

	it(`should ignore keys in ignoreKeys with severity ${severity}`, () => {
		const problemReporter = createMockProblemReporter();

		const translationFiles: TranslationFiles = {
			en: { greeting: "[EN] {firstName}", farewell: "[EN] {firstName}" },
			fr: { greeting: "[FR]", farewell: "[FR]" },
		};

		const ignoreKeysContext = {
			...context,
			ignoreKeys: ["farewell", "greeting"],
		};

		rule.run(translationFiles, baseConfig, problemReporter, ignoreKeysContext);

		expect(problemReporter.report).not.toHaveBeenCalled();
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

		const expectedProblem1 = getMissingVariableFromSourceProblem({
			key: "greeting",
			locale: "fr",
			severity,
			ruleMeta,
			expected: "firstName",
			received: "",
		});

		const expectedProblem2 = getMissingVariableFromSourceProblem({
			key: "greeting",
			locale: "de",
			severity,
			ruleMeta,
			expected: "firstName",
			received: "",
		});

		const ignoredProblem1 = getMissingVariableFromSourceProblem({
			key: "chocolate",
			locale: "fr",
			severity,
			ruleMeta,
			expected: "firstName",
			received: "",
		});

		const ignoredProblem2 = getMissingVariableFromSourceProblem({
			key: "chocolate",
			locale: "de",
			severity,
			ruleMeta,
			expected: "chocolate",
			received: "",
		});

		const ignoredProblem3 = getMissingVariableFromSourceProblem({
			key: "farewell",
			locale: "fr",
			severity,
			ruleMeta,
			expected: "firstName",
			received: "",
		});

		const ignoredProblem4 = getMissingVariableFromSourceProblem({
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

		expect(problemReporter.report).not.toHaveBeenCalledWith(ignoredProblem1);
		expect(problemReporter.report).not.toHaveBeenCalledWith(ignoredProblem2);
		expect(problemReporter.report).not.toHaveBeenCalledWith(ignoredProblem3);
		expect(problemReporter.report).not.toHaveBeenCalledWith(ignoredProblem4);
		expect(problemReporter.report).toHaveBeenCalledWith(expectedProblem1);
		expect(problemReporter.report).toHaveBeenCalledWith(expectedProblem2);
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
