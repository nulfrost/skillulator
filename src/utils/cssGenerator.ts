export interface SkillGridConfig {
	className: string;
	gridAreas: string[][];
	skills: string[];
}

export function generateSkillCSS(config: SkillGridConfig): string {
	const { className, gridAreas, skills } = config;

	// Generate grid-template-areas
	const gridTemplateAreas = gridAreas
		.map((row) => `"${row.join(" ")}"`)
		.join("\n    ");

	// Generate data-skill selectors
	const skillSelectors = skills
		.map(
			(skill) => `[data-skill="${skill}"] {
  grid-area: ${skill};
}`,
		)
		.join("\n\n");

	return `.${className} {
  grid-template-areas:
    ${gridTemplateAreas};
}

${skillSelectors}
`;
}

// Configuration for each class
export const skillGridConfigs: Record<string, SkillGridConfig> = {
	billposter: {
		className: "billposter",
		gridAreas: [
			["Heal", "Heal", "Heal", "MoonBeam", "MoonBeam"],
			["Patience", "QuickStep", "MentalSign", "TempingHole", "."],
			["Resurrection", "Haste", "HeapUp", "Stonehand", "."],
			["CircleHealing", "CatsReflex", "BeefUp", "BurstCrack", "."],
			["Prevention", "CannonBall", "Accuracy", "PowerFist", "."],
			[".", "Asmodeus", "PiercingSerpent", ".", "."],
			[".", "BelialSmashing", "BaraqijalEsna", ".", "."],
			[".", "BloodFist", "BgvurTialbold", ".", "."],
			["Sonichand", "Sonichand", "Sonichand", "Sonichand", "Sonichand"],
			[
				"Asalraalaikum",
				"Asalraalaikum",
				"Asalraalaikum",
				"Asalraalaikum",
				"Asalraalaikum",
			],
			[
				"SurysTenacity",
				"SurysTenacity",
				"SurysTenacity",
				"SurysTenacity",
				"SurysTenacity",
			],
		],
		skills: [
			"BeefUp",
			"CircleHealing",
			"CannonBall",
			"MentalSign",
			"TempingHole",
			"Patience",
			"Stonehand",
			"CatsReflex",
			"QuickStep",
			"Heal",
			"PowerFist",
			"Accuracy",
			"HeapUp",
			"BurstCrack",
			"MoonBeam",
			"Resurrection",
			"Haste",
			"Prevention",
			"Asmodeus",
			"PiercingSerpent",
			"BelialSmashing",
			"BaraqijalEsna",
			"BgvurTialbold",
			"Sonichand",
			"Asalraalaikum",
			"SurysTenacity",
			"BloodFist",
		],
	},
	blade: {
		className: "blade",
		gridAreas: [
			["Protection", "Protection", "Protection", "Slash", "Slash"],
			[
				"Keenwheel",
				"BloodyStrike",
				"ShieldBash",
				"Empowerweapon",
				"Empowerweapon",
			],
			["Blindside", "ReflexHit", "Sneaker", "SmiteAxe", "BlazingSword"],
			["SpecialHit", "Guillotine", ".", "AxeMastery", "SwordMastery"],
			[".", "SilentStrike", "SpringAttack", "ArmorPenetrate", "."],
			[".", "BladeDance", "HawkAttack", "Berserk", "."],
			[".", ".", "CrossStrike", "SonicBlade", "."],
			[
				"RendingEntry",
				"RendingEntry",
				"RendingEntry",
				"RendingEntry",
				"RendingEntry",
			],
		],
		skills: [
			"Protection",
			"Slash",
			"Keenwheel",
			"BloodyStrike",
			"ShieldBash",
			"Empowerweapon",
			"Blindside",
			"ReflexHit",
			"Sneaker",
			"SmiteAxe",
			"BlazingSword",
			"SpecialHit",
			"Guillotine",
			"AxeMastery",
			"SwordMastery",
			"SilentStrike",
			"SpringAttack",
			"ArmorPenetrate",
			"BladeDance",
			"HawkAttack",
			"Berserk",
			"CrossStrike",
			"SonicBlade",
			"RendingEntry",
		],
	},
	elementor: {
		className: "elementor",
		gridAreas: [
			[
				"MentalStrike",
				"MentalStrike",
				"MentalStrike",
				"Blinkpool",
				"Blinkpool",
			],
			["FlameBall", "Swordwind", "IceMissile", "LightningBall", "StoneSpike"],
			["FlameGeyser", "Strongwind", "Waterball", "LightningRam", "Rooting"],
			["FireStrike", "WindCutter", "WaterWell", "LightningShock", "RockCrash"],
			["Firebird", "StoneSpear", "Void", "LightningStrike", "Iceshark"],
			[
				"Burningfield",
				"Earthquake",
				"Windfield",
				"ElectricShock",
				"PoisonCloud",
			],
			[
				"MeteoShower",
				"Sandstorm",
				"LightningStorm",
				"LightningStorm",
				"Blizzard",
			],
			[
				"FireMastery",
				"EarthMastery",
				"WindMastery",
				"LightningMastery",
				"WaterMastery",
			],
			[
				"EyeoftheStorm",
				"EyeoftheStorm",
				"EyeoftheStorm",
				"EyeoftheStorm",
				"EyeoftheStorm",
			],
		],
		skills: [
			"RockCrash",
			"WindCutter",
			"MentalStrike",
			"IceMissile",
			"Strongwind",
			"Waterball",
			"LightningBall",
			"LightningRam",
			"FireStrike",
			"FlameBall",
			"LightningStrike",
			"WaterWell",
			"StoneSpike",
			"FlameGeyser",
			"Rooting",
			"Sandstorm",
			"Firebird",
			"MeteoShower",
			"StoneSpear",
			"LightningMastery",
			"Void",
			"LightningShock",
			"Blinkpool",
			"Swordwind",
			"FireMastery",
			"Windfield",
			"Burningfield",
			"LightningStorm",
			"WindMastery",
			"Blizzard",
			"Earthquake",
			"PoisonCloud",
			"Iceshark",
			"ElectricShock",
			"EarthMastery",
			"WaterMastery",
			"EyeoftheStorm",
		],
	},
	knight: {
		className: "knight",
		gridAreas: [
			["Protection", "Protection", "Protection", "Slash", "Slash"],
			[
				"Keenwheel",
				"BloodyStrike",
				"ShieldBash",
				"Empowerweapon",
				"Empowerweapon",
			],
			["Blindside", "ReflexHit", "Sneaker", "SmiteAxe", "BlazingSword"],
			["SpecialHit", "Guillotine", ".", "AxeMastery", "SwordMastery"],
			[".", "Charge", "PainDealer", "Guard", "HeartofFury"],
			[".", "EarthDivider", "PowerStomp", "Rage", "GrandRage"],
			[".", "PowerSwing", "PainReflection", "CallofFury", "."],
			[
				"HeartofSacrifice",
				"HeartofSacrifice",
				"HeartofSacrifice",
				"HeartofSacrifice",
				"HeartofSacrifice",
			],
		],
		skills: [
			"Protection",
			"Slash",
			"Keenwheel",
			"BloodyStrike",
			"ShieldBash",
			"Empowerweapon",
			"Blindside",
			"ReflexHit",
			"Sneaker",
			"SmiteAxe",
			"BlazingSword",
			"SpecialHit",
			"Guillotine",
			"AxeMastery",
			"SwordMastery",
			"Charge",
			"PainDealer",
			"Guard",
			"HeartofFury",
			"EarthDivider",
			"PowerStomp",
			"Rage",
			"GrandRage",
			"PowerSwing",
			"PainReflection",
			"CallofFury",
			"HeartofSacrifice",
		],
	},
	psykeeper: {
		className: "psykeeper",
		gridAreas: [
			[
				"MentalStrike",
				"MentalStrike",
				"MentalStrike",
				"Blinkpool",
				"Blinkpool",
			],
			["FlameBall", "Swordwind", "IceMissile", "LightningBall", "StoneSpike"],
			["FlameGeyser", "Strongwind", "Waterball", "LightningRam", "Rooting"],
			["FireStrike", "WindCutter", "WaterWell", "LightningShock", "RockCrash"],
			[".", "Demonology", "PsychicBomb", "CrucioSpell", "."],
			[".", "Satanology", "SpiritBomb", "MaximumCrisis", "."],
			[".", ".", "PsychicWall", "PsychicSquare", "."],
			[
				"GravityWell",
				"GravityWell",
				"GravityWell",
				"GravityWell",
				"GravityWell",
			],
		],
		skills: [
			"RockCrash",
			"WindCutter",
			"MentalStrike",
			"IceMissile",
			"Strongwind",
			"Waterball",
			"LightningBall",
			"LightningRam",
			"FireStrike",
			"FlameBall",
			"WaterWell",
			"StoneSpike",
			"FlameGeyser",
			"Rooting",
			"LightningShock",
			"Demonology",
			"PsychicBomb",
			"CrucioSpell",
			"Satanology",
			"SpiritBomb",
			"MaximumCrisis",
			"PsychicSquare",
			"Blinkpool",
			"Swordwind",
			"PsychicWall",
			"GravityWell",
		],
	},
	ringmaster: {
		className: "ringmaster",
		gridAreas: [
			["Heal", "Heal", "Heal", "MoonBeam", "MoonBeam"],
			["Patience", "QuickStep", "MentalSign", "TempingHole", "."],
			["Resurrection", "Haste", "HeapUp", "Stonehand", "."],
			["CircleHealing", "CatsReflex", "BeefUp", "BurstCrack", "."],
			["Prevention", "CannonBall", "Accuracy", "PowerFist", "."],
			["Protect", "Holycross", "MerkabaHanzelrusha", ".", "."],
			["Holyguard", "SpiritFortune", "HealRain", ".", "."],
			["GeburahTiphreth", "GvurTialla", "BarrierofLife", ".", "."],
		],
		skills: [
			"BeefUp",
			"CircleHealing",
			"CannonBall",
			"MentalSign",
			"TempingHole",
			"Patience",
			"Stonehand",
			"CatsReflex",
			"QuickStep",
			"Heal",
			"PowerFist",
			"Accuracy",
			"HeapUp",
			"BurstCrack",
			"MoonBeam",
			"Resurrection",
			"Haste",
			"Holyguard",
			"Protect",
			"GvurTialla",
			"GeburahTiphreth",
			"BarrierofLife",
			"HealRain",
			"Holycross",
			"MerkabaHanzelrusha",
			"SpiritFortune",
			"Prevention",
		],
	},
	ranger: {
		className: "ranger",
		gridAreas: [
			["Pulling", "Pulling", "SlowStep", "SlowStep", "JunkArrow"],
			[
				"FastWalker",
				"FastWalker",
				"Yo-YoMastery",
				"Yo-YoMastery",
				"BowMastery",
			],
			["DarkIllusion", "Snatch", "CrossLine", "SilentShot", "AimedShot"],
			["PerfectBlock", "DeadlySwing", "CounterAttack", "AutoShot", "ArrowRain"],
			[".", "IceArrow", "FlameArrow", "PoisonArrow", "."],
			[".", "CriticalShot", "PiercingArrow", "Nature", "."],
			[".", "Tripleshot", "Tripleshot", "SilentArrow", "."],
			["Boomburst", "Boomburst", "Boomburst", "Boomburst", "Boomburst"],
		],
		skills: [
			"Pulling",
			"SlowStep",
			"JunkArrow",
			"FastWalker",
			"Yo-YoMastery",
			"BowMastery",
			"DarkIllusion",
			"Snatch",
			"CrossLine",
			"SilentShot",
			"AimedShot",
			"PerfectBlock",
			"DeadlySwing",
			"CounterAttack",
			"AutoShot",
			"ArrowRain",
			"IceArrow",
			"FlameArrow",
			"PoisonArrow",
			"CriticalShot",
			"PiercingArrow",
			"Nature",
			"Tripleshot",
			"SilentArrow",
			"Boomburst",
		],
	},
	jester: {
		className: "jester",
		gridAreas: [
			["Pulling", "Pulling", "SlowStep", "SlowStep", "JunkArrow"],
			[
				"FastWalker",
				"FastWalker",
				"Yo-YoMastery",
				"Yo-YoMastery",
				"BowMastery",
			],
			["DarkIllusion", "Snatch", "CrossLine", "SilentShot", "AimedShot"],
			["PerfectBlock", "DeadlySwing", "CounterAttack", "AutoShot", "ArrowRain"],
			[".", "EnchantPoison", "EnchantBlood", "Escape", "."],
			[".", "CriticalSwing", "MultiStab", "EnchantAbsorb", "."],
			[".", "VitalStab", "VitalStab", "HitofPenya", "."],
			[
				"JestersBlast",
				"JestersBlast",
				"JestersBlast",
				"JestersBlast",
				"JestersBlast",
			],
		],
		skills: [
			"Pulling",
			"SlowStep",
			"JunkArrow",
			"FastWalker",
			"Yo-YoMastery",
			"BowMastery",
			"DarkIllusion",
			"Snatch",
			"CrossLine",
			"SilentShot",
			"AimedShot",
			"PerfectBlock",
			"DeadlySwing",
			"CounterAttack",
			"AutoShot",
			"ArrowRain",
			"EnchantPoison",
			"EnchantBlood",
			"Escape",
			"CriticalSwing",
			"MultiStab",
			"EnchantAbsorb",
			"VitalStab",
			"HitofPenya",
			"JestersBlast",
		],
	},
};

export function getSkillCSS(className: string): string {
	const config = skillGridConfigs[className];
	if (!config) {
		throw new Error(`No CSS configuration found for class: ${className}`);
	}
	return generateSkillCSS(config);
}

// Utility function to generate CSS for all classes at once
export function generateAllSkillCSS(): Record<string, string> {
	const cssMap: Record<string, string> = {};

	for (const [className, config] of Object.entries(skillGridConfigs)) {
		cssMap[className] = generateSkillCSS(config);
	}

	return cssMap;
}

// Utility function to validate that all skills are properly configured
export function validateSkillConfigs(): { valid: boolean; errors: string[] } {
	const errors: string[] = [];

	for (const [className, config] of Object.entries(skillGridConfigs)) {
		// Check if all skills in gridAreas are included in skills array
		const gridSkills = new Set<string>();
		for (const row of config.gridAreas) {
			for (const skill of row) {
				if (skill !== ".") {
					gridSkills.add(skill);
				}
			}
		}

		const skillsSet = new Set(config.skills);

		// Find skills in grid but not in skills array
		for (const skill of gridSkills) {
			if (!skillsSet.has(skill)) {
				errors.push(
					`${className}: Skill "${skill}" in grid but not in skills array`,
				);
			}
		}

		// Find skills in skills array but not in grid
		for (const skill of config.skills) {
			if (!gridSkills.has(skill)) {
				errors.push(
					`${className}: Skill "${skill}" in skills array but not in grid`,
				);
			}
		}
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}
