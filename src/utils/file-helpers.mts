import path from "node:path";
import fs from "node:fs";
import { Config, TranslationFiles } from "../types.mts";

/**
 * Import all of the translation files in the current project and bundle their data into a single object.
 * Note: This bundled object will get passed into each rule so it can run its validation(s).
 * @param config
 * @returns TranslationFiles
 */
export function loadLanguageFiles(config: Config): TranslationFiles {
	let files: TranslationFiles = {};

	const allTranslationFiles = {
		...config.translationFiles,
	};

	// Make sure that the source file is included in the translation files
	if (!Object.keys(config.translationFiles).includes(config.defaultLocale)) {
		allTranslationFiles[config.defaultLocale] = config.sourceFile;
	}

	// Load translation files
	for (let [locale, translationFileName] of Object.entries(
		allTranslationFiles
	)) {
		const translatedFilePath = path.join(
			config.pathToTranslatedFiles,
			translationFileName
		);

		try {
			// TODO: convert to JSON before parsing if the file is not JSON. https://github.com/radiovisual/i18n-validator/issues/2
			files[locale] = JSON.parse(fs.readFileSync(translatedFilePath, "utf8"));
		} catch (err: unknown) {
			console.error(
				`There was an error trying to read the file at path: '${translatedFilePath}' for the locale: '${locale}'. Please ensure that this is a valid translation file and try again.`
			);
		}
	}

	return files;
}
