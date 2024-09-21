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
	getMissingDefaultLocaleProblem,
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
		const problemStore = createMockProblemReporter();

		const { severity } = context;

		const config: Config = {
			...baseConfig,
			// @ts-expect-error - null is unsupported in the type, but needed for the test
			defaultLocale: null,
		};

		rule.run(translationFiles, config, problemStore, context);

		const expectedProblem = getMissingDefaultLocaleProblem({
			severity: severity as RuleSeverity,
			ruleMeta,
		});

		expect(problemStore.report).toHaveBeenCalledWith(expectedProblem);
		expect(problemStore.report).toHaveBeenCalledTimes(1);
	});

	it(`should report empty defaultLocale`, () => {
		const problemStore = createMockProblemReporter();

		const { severity } = context;

		const config: Config = {
			...baseConfig,
			defaultLocale: "",
		};

		rule.run(translationFiles, config, problemStore, context);

		const expectedProblem = getMissingDefaultLocaleProblem({
			severity: severity as RuleSeverity,
			ruleMeta,
		});

		expect(problemStore.report).toHaveBeenCalledWith(expectedProblem);
		expect(problemStore.report).toHaveBeenCalledTimes(1);
	});

	it(`should report missing sourceFile`, () => {
		const problemStore = createMockProblemReporter();

		const { severity } = context;

		const config: Config = {
			...baseConfig,
			// @ts-expect-error - null is unsupported in the type, but needed for the test
			sourceFile: null,
		};

		rule.run(translationFiles, config, problemStore, context);

		const expectedProblem = getMissingSourceFileProblem({
			severity: severity as RuleSeverity,
			ruleMeta,
		});

		expect(problemStore.report).toHaveBeenCalledWith(expectedProblem);
		expect(problemStore.report).toHaveBeenCalledTimes(1);
	});

	it(`should report empty sourceFile`, () => {
		const problemStore = createMockProblemReporter();

		const { severity } = context;

		const config: Config = {
			...baseConfig,
			sourceFile: "",
		};

		rule.run(translationFiles, config, problemStore, context);

		const expectedProblem = getMissingSourceFileProblem({
			severity: severity as RuleSeverity,
			ruleMeta,
		});

		expect(problemStore.report).toHaveBeenCalledWith(expectedProblem);
		expect(problemStore.report).toHaveBeenCalledTimes(1);
	});

	it(`should report missing translationFiles`, () => {
		const problemStore = createMockProblemReporter();

		const { severity } = context;

		const config: Config = {
			...baseConfig,
			// @ts-expect-error - null is unsupported in the type, but needed for the test
			translationFiles: null,
		};

		rule.run(translationFiles, config, problemStore, context);

		const expectedProblem = getInvalidTranslationFilesProblem({
			severity: severity as RuleSeverity,
			ruleMeta,
		});

		expect(problemStore.report).toHaveBeenCalledWith(expectedProblem);
		expect(problemStore.report).toHaveBeenCalledTimes(1);
	});

	it(`should report missing translationFiles source files`, () => {
		const problemStore = createMockProblemReporter();

		const { severity } = context;

		const config: Config = {
			...baseConfig,
			translationFiles: {
				en: "",
			},
		};

		rule.run(translationFiles, config, problemStore, context);

		const expectedProblem = getInvalidTranslationFilesProblem({
			severity: severity as RuleSeverity,
			ruleMeta,
		});

		expect(problemStore.report).toHaveBeenCalledWith(expectedProblem);
		expect(problemStore.report).toHaveBeenCalledTimes(1);
	});

	it(`should report null translationFiles source files`, () => {
		const problemStore = createMockProblemReporter();

		const { severity } = context;

		const config: Config = {
			...baseConfig,
			translationFiles: {
				// @ts-expect-error - null is unsupported in the type, but needed for the test
				en: null,
			},
		};

		rule.run(translationFiles, config, problemStore, context);

		const expectedProblem = getInvalidTranslationFilesProblem({
			severity: severity as RuleSeverity,
			ruleMeta,
		});

		expect(problemStore.report).toHaveBeenCalledWith(expectedProblem);
		expect(problemStore.report).toHaveBeenCalledTimes(1);
	});

	it(`should report empty translationFiles object`, () => {
		const problemStore = createMockProblemReporter();

		const { severity } = context;

		const config: Config = {
			...baseConfig,
			translationFiles: {},
		};

		rule.run(translationFiles, config, problemStore, context);

		const expectedProblem = getInvalidTranslationFilesProblem({
			severity: severity as RuleSeverity,
			ruleMeta,
		});

		expect(problemStore.report).toHaveBeenCalledWith(expectedProblem);
		expect(problemStore.report).toHaveBeenCalledTimes(1);
	});

	it(`should report null pathToTranslatedFiles`, () => {
		const problemStore = createMockProblemReporter();

		const { severity } = context;

		const config: Config = {
			...baseConfig,
			// @ts-expect-error - null is unsupported in the type, but needed for the test
			pathToTranslatedFiles: null,
		};

		rule.run(translationFiles, config, problemStore, context);

		const expectedProblem = getInvalidPathToTranslatedFilesProblem({
			severity: severity as RuleSeverity,
			ruleMeta,
		});

		expect(problemStore.report).toHaveBeenCalledWith(expectedProblem);
		expect(problemStore.report).toHaveBeenCalledTimes(1);
	});

	it(`should report empty pathToTranslatedFiles`, () => {
		const problemStore = createMockProblemReporter();

		const { severity } = context;

		const config: Config = {
			...baseConfig,
			pathToTranslatedFiles: "",
		};

		rule.run(translationFiles, config, problemStore, context);

		const expectedProblem = getInvalidPathToTranslatedFilesProblem({
			severity: severity as RuleSeverity,
			ruleMeta,
		});

		expect(problemStore.report).toHaveBeenCalledWith(expectedProblem);
		expect(problemStore.report).toHaveBeenCalledTimes(1);
	});
});
