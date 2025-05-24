export default class DiceParser {
	static parseArgs(args) {
		const diceSets = [];

		for (const arg of args) {
			const parts = this.splitAndTrim(arg);
			this.validateLength(parts, arg);
			const values = this.validateAndConvert(parts, arg);
			diceSets.push(values);
		}

		return diceSets;
	}

	static splitAndTrim(arg) {
		return arg.split(',').map(p => p.trim());
	}

	static validateLength(parts, arg) {
		if (parts.length !== 6) {
			throw new Error(`Invalid die "${arg}": must contain exactly 6 values`);
		}
	}

	static validateAndConvert(parts, arg) {
		return parts.map(p => {
			const num = Number(p);
			if (!Number.isInteger(num)) {
				throw new Error(`Invalid number "${p}" in die "${arg}": must be an integer`);
			}
			return num;
		});
	}
}
