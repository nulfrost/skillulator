#!/usr/bin/env tsx

import {
	generateAllSkillCSS,
	validateSkillConfigs,
} from "../src/utils/cssGenerator";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Migration script to generate CSS files from the new generator system
 * This replaces the old manual CSS files with dynamically generated ones
 */

function migrateCSS() {
	console.log("🔧 Starting CSS migration...");

	// Validate configurations first
	const validation = validateSkillConfigs();
	if (!validation.valid) {
		console.error("❌ Configuration validation failed:");
		for (const error of validation.errors) {
			console.error(`  - ${error}`);
		}
		process.exit(1);
	}

	console.log("✅ All skill configurations are valid");

	// Generate CSS for all classes
	const cssMap = generateAllSkillCSS();

	// Create output directory
	const outputDir = join(process.cwd(), "src", "css", "generated");
	mkdirSync(outputDir, { recursive: true });

	// Write individual CSS files
	for (const [className, css] of Object.entries(cssMap)) {
		const filePath = join(outputDir, `${className}.css`);
		writeFileSync(filePath, css, "utf8");
		console.log(`📝 Generated ${className}.css`);
	}

	// Generate a combined CSS file
	const combinedCSS = Object.values(cssMap).join("\n\n");
	const combinedPath = join(outputDir, "all-skills.css");
	writeFileSync(combinedPath, combinedCSS, "utf8");
	console.log("📝 Generated all-skills.css");

	// Generate index file for easy imports
	const indexContent = Object.keys(cssMap)
		.map((className) => `@import './${className}.css';`)
		.join("\n");
	const indexPath = join(outputDir, "index.css");
	writeFileSync(indexPath, indexContent, "utf8");
	console.log("📝 Generated index.css");

	console.log("\n🎉 CSS migration completed successfully!");
	console.log(`📁 Generated files in: ${outputDir}`);
	console.log("\n📋 Next steps:");
	console.log("1. Update your build process to use the generated CSS files");
	console.log("2. Remove the old CSS files from src/css/");
	console.log("3. Update imports to use the new generated CSS files");
	console.log("4. Test that all skill trees display correctly");
}

// Run migration if this script is executed directly

migrateCSS();

export { migrateCSS };
