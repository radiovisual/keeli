import { createMockProblemReporter } from "../../utils/test-helpers";
import {
	Config,
	RuleContext,
	RuleSeverity,
	TranslationFiles,
} from "../../types.ts";
import { noInvalidConfiguration } from "./no-invalid-configuration";
import {
	getInvalidPathToTranslatedFilesProblem,
	getInvalidTranslationFilesProblem,
	getMisingDefaultLocaleProblem,
	getMissingSourceFileProblem,
} from "./problems.ts";

const ruleMeta = noInvalidConfiguration.meta;
const rule = noInvalidConfiguration;

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
	it(`should report missing defaultLocale`, () => {
		const problemReporter = createMockProblemReporter();

		const { severity } = context;

		const config: Config = {
			...baseConfig,
			// @ts-expect-error - null is unsupported in the type, but needed for the test
			defaultLocale: null,
		};

		rule.run(translationFiles, config, problemReporter, context);

		const expectedProblem = getMisingDefaultLocaleProblem({
			severity: severity as RuleSeverity,
			ruleMeta,
		});

		expect(problemReporter.report).toHaveBeenCalledWith(expectedProblem);
		expect(problemReporter.report).toHaveBeenCalledTimes(1);
	});

	it(`should report empty defaultLocale`, () => {
		const problemReporter = createMockProblemReporter();

		const { severity } = context;

		const config: Config = {
			...baseConfig,
			defaultLocale: "",
		};

		rule.run(translationFiles, config, problemReporter, context);

		const expectedProblem = getMisingDefaultLocaleProblem({
			severity: severity as RuleSeverity,
			ruleMeta,
		});

		expect(problemReporter.report).toHaveBeenCalledWith(expectedProblem);
		expect(problemReporter.report).toHaveBeenCalledTimes(1);
	});

	it(`should report missing sourceFile`, () => {
		const problemReporter = createMockProblemReporter();

		const { severity } = context;

		const config: Config = {
			...baseConfig,
			// @ts-expect-error - null is unsupported in the type, but needed for the test
			sourceFile: null,
		};

		rule.run(translationFiles, config, problemReporter, context);

		const expectedProblem = getMissingSourceFileProblem({
			severity: severity as RuleSeverity,
			ruleMeta,
		});

		expect(problemReporter.report).toHaveBeenCalledWith(expectedProblem);
		expect(problemReporter.report).toHaveBeenCalledTimes(1);
	});

	it(`should report empty sourceFile`, () => {
		const problemReporter = createMockProblemReporter();

		const { severity } = context;

		const config: Config = {
			...baseConfig,
			sourceFile: "",
		};

		rule.run(translationFiles, config, problemReporter, context);

		const expectedProblem = getMissingSourceFileProblem({
			severity: severity as RuleSeverity,
			ruleMeta,
		});

		expect(problemReporter.report).toHaveBeenCalledWith(expectedProblem);
		expect(problemReporter.report).toHaveBeenCalledTimes(1);
	});

	it(`should report missing translationFiles`, () => {
		const problemReporter = createMockProblemReporter();

		const { severity } = context;

		const config: Config = {
			...baseConfig,
			// @ts-expect-error - null is unsupported in the type, but needed for the test
			translationFiles: null,
		};

		rule.run(translationFiles, config, problemReporter, context);

		const expectedProblem = getInvalidTranslationFilesProblem({
			severity: severity as RuleSeverity,
			ruleMeta,
		});

		expect(problemReporter.report).toHaveBeenCalledWith(expectedProblem);
		expect(problemReporter.report).toHaveBeenCalledTimes(1);
	});

	it(`should report missing translationFiles source files`, () => {
		const problemReporter = createMockProblemReporter();

		const { severity } = context;

		const config: Config = {
			...baseConfig,
			translationFiles: {
				en: "",
			},
		};

		rule.run(translationFiles, config, problemReporter, context);

		const expectedProblem = getInvalidTranslationFilesProblem({
			severity: severity as RuleSeverity,
			ruleMeta,
		});

		expect(problemReporter.report).toHaveBeenCalledWith(expectedProblem);
		expect(problemReporter.report).toHaveBeenCalledTimes(1);
	});

	it(`should report null translationFiles source files`, () => {
		const problemReporter = createMockProblemReporter();

		const { severity } = context;

		const config: Config = {
			...baseConfig,
			translationFiles: {
				// @ts-expect-error - null is unsupported in the type, but needed for the test
				en: null,
			},
		};

		rule.run(translationFiles, config, problemReporter, context);

		const expectedProblem = getInvalidTranslationFilesProblem({
			severity: severity as RuleSeverity,
			ruleMeta,
		});

		expect(problemReporter.report).toHaveBeenCalledWith(expectedProblem);
		expect(problemReporter.report).toHaveBeenCalledTimes(1);
	});

	it(`should report empty translationFiles object`, () => {
		const problemReporter = createMockProblemReporter();

		const { severity } = context;

		const config: Config = {
			...baseConfig,
			translationFiles: {},
		};

		rule.run(translationFiles, config, problemReporter, context);

		const expectedProblem = getInvalidTranslationFilesProblem({
			severity: severity as RuleSeverity,
			ruleMeta,
		});

		expect(problemReporter.report).toHaveBeenCalledWith(expectedProblem);
		expect(problemReporter.report).toHaveBeenCalledTimes(1);
	});

	it(`should report null pathToTranslatedFiles`, () => {
		const problemReporter = createMockProblemReporter();

		const { severity } = context;

		const config: Config = {
			...baseConfig,
			// @ts-expect-error - null is unsupported in the type, but needed for the test
			pathToTranslatedFiles: null,
		};

		rule.run(translationFiles, config, problemReporter, context);

		const expectedProblem = getInvalidPathToTranslatedFilesProblem({
			severity: severity as RuleSeverity,
			ruleMeta,
		});

		expect(problemReporter.report).toHaveBeenCalledWith(expectedProblem);
		expect(problemReporter.report).toHaveBeenCalledTimes(1);
	});

	it(`should report empty pathToTranslatedFiles`, () => {
		const problemReporter = createMockProblemReporter();

		const { severity } = context;

		const config: Config = {
			...baseConfig,
			pathToTranslatedFiles: "",
		};

		rule.run(translationFiles, config, problemReporter, context);

		const expectedProblem = getInvalidPathToTranslatedFilesProblem({
			severity: severity as RuleSeverity,
			ruleMeta,
		});

		expect(problemReporter.report).toHaveBeenCalledWith(expectedProblem);
		expect(problemReporter.report).toHaveBeenCalledTimes(1);
	});
});
