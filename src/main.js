import DiceParser from './classes/DiceParser.js';
import CLI from './classes/CLI.js';

function showExample() {
	console.log(`\nINVALID DICE CONFIGURATION\n`);
	console.log(`Each dice must have 6 sides`);
	console.log(`Example:`);
	console.log(`node main.js  2,2,4,4,6,6  2,4,6,2,4,6  2,6,4,6,4,2\n`);
	process.exit(1);
}

function parseArguments(args) {
	try {
		return DiceParser.parseArgs(args);
	} catch (err) {
		console.log(`\nError: ${err.message}\n`);
		showExample();
	}
}

function handleParseSuccessfully(args) {
	const diceSets = parseArguments(args);
	console.log('\nDice sets parsed successfully!', diceSets);
	const cli = new CLI(diceSets);
	cli.startMenuLoop();
}

function main() {
	const args = process.argv.slice(2);

	if (args.length < 2) {
		console.log('\nThere must be at least two dice\n');
		showExample();
	}

	handleParseSuccessfully(args);
}

main();
