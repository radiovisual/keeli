#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";

import { runRules } from "./engine/rule-engine.ts";
import { Config } from "./types.js";
import { config } from "./config/default-config.ts";

const defaultConfig: Config = config;

const configPath = path.join(__dirname, "../i18n-validator.config.json");

// Only start the routine running if the configuration file is found.
if (fs.existsSync(configPath)) {
	const userConfig: Partial<Config> = JSON.parse(
		fs.readFileSync(configPath, "utf8")
	);

	const config = { ...defaultConfig, ...userConfig };

	runRules(config);
} else {
	const message = `You must have an i18n-validator.config.js file in the project root to run the i18n-validator.`;
	console.log(chalk.red(message));
}
