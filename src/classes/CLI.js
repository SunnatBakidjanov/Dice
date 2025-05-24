import readlineSync from 'readline-sync';
import ProbabilityTable from './ProbabilityWinCalculator.js';

export default class CLI {
	constructor(diceSets) {
		this.diceSets = diceSets;

		this.actions = {
			1: () => this.playGame(),
			2: () => this.showProbabilityTable(),
			3: () => this.showHelp(),
			4: () => this.exitGame(),
		};
	}

	startMenuLoop() {
		while (true) {
			this.displayMenu();
			const choice = readlineSync.question('\nYour choice: ').trim();
			if (this.handleChoice(choice)) break;
		}
	}

	handleChoice(choice) {
		const action = this.actions[choice];

		if (action) {
			action();
			return choice === '1';
		} else {
			console.log('\nInvalid option. Please choose between 1 - 4.\n');
			return false;
		}
	}

	displayMenu() {
		console.log('\nChoose an option (1 - 4):\n');
		console.log('1. Play');
		console.log('2. Show probability table');
		console.log('3. Help');
		console.log('4. Exit');
	}

	playGame() {
		console.log('\nStarting the game...\n');
	}

	showProbabilityTable() {
		console.log('\nProbability table:\n');
		const probabilityTable = new ProbabilityTable(this.diceSets);
		probabilityTable.generateTable();
	}

	showHelp() {
		console.log('\nHelp:\n');
		console.log('1. Play - start the game');
		console.log('2. Show probability table - see win/loss chancess for all dice combinations');
		console.log('3. Help - you ar here');
		console.log('4. Exit - quit the game\n');
	}

	exitGame() {
		console.log('\nGet Away\n');
		process.exit(0);
	}
}
