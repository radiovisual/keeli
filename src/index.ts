#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";

import { runRules } from "./engine/rule-engine.js";
import type { Config } from "./types.js";
import { config } from "./config/default-config.js";

const defaultConfig: Config = config;

const configPath = path.join(__dirname, "../keeli.config.json");

// Only start keeli if the keeli configuration file is found.
if (fs.existsSync(configPath)) {
	const userConfig: Config = JSON.parse(fs.readFileSync(configPath, "utf8"));

	const config = { ...defaultConfig, ...userConfig };

	if (!config.enabled) {
		const message = `keeli is disabled. Exiting.`;
		console.log(chalk.yellow(message));
		process.exit(1);
	}

	runRules(config);
} else {
	const message = `You must have an keeli.config.js file in the project root to run the keeli.`;
	console.log(chalk.red(message));
	process.exit(1);
}
