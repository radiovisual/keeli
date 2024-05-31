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

  // Ensure that the source file is included in the dataset of all translations.
  // This helps catch situations where the source locale was not included in 'supportedTranslations'
  const defaultSourceLocale = config.sourceFile.replace(".json", "");
  const allSupportedLocales = new Set([
    ...config.supportedTranslations,
    defaultSourceLocale,
  ]);

  // Load translation files
  Array.from(allSupportedLocales).forEach((locale) => {
    const translatedFilePath = path.join(
      config.pathToTranslatedFiles,
      `${locale}.json`
    );
    try {
      files[locale] = JSON.parse(fs.readFileSync(translatedFilePath, "utf8"));
    } catch (err: unknown) {
      console.error(
        `There was an error trying to read the file at path: '${translatedFilePath}' for the locale: '${locale}'. Please ensure that this is a valid JSON file and try again.`
      );
    }
  });

  return files;
}
