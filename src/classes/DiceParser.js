export default class DiceParser {
	static parseArgs(args) {
		return args.map(arg => this.parseSingleDie(arg));
	}

	static parseSingleDie(arg) {
		const parts = arg.split(',').map(p => p.trim());
		if (parts.length !== 6) throw new Error(`Invalid die "${arg}": must contain exactly 6 values`);
		return this.validateAndConvert(parts, arg);
	}

	static validateAndConvert(parts, arg) {
		return parts.map(p => {
			const num = Number(p);
			if (!Number.isInteger(num)) throw new Error(`Invalid number "${p}" in die "${arg}": must be an integer`);
			return num;
		});
	}
}
