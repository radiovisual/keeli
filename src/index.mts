#!/usr/bin/env node

import { runRules } from "./engine/rule-engine";
import * as fs from "node:fs";
import * as path from "node:path";
import { Config } from "./types.mjs";
import { config } from "./config/default-config.mjs";
import chalk from "chalk";

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
