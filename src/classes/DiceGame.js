import readlineSync from 'readline-sync';
import FairRandom from './FairRandom.js';
import DiceParser from './DiceParser.js';
import crypto from 'crypto';
import ProbabilityTable from './ProbabilityWinCalculator.js';

export default class DiceGame {
	constructor(diceSets) {
		this.diceSets = diceSets;
		this.maxFirstChoice = 1;
	}

	play() {
		console.log("\nLet's determine who makes the first move.\n");

		const playerFirst = this.showFirstMoveSelectionMenu();
		playerFirst ? this.playerMoveFirst() : this.compMoveFirst();

		this.compResult = this.roll('computer', this.compDiceIndex);
		this.playerResult = this.roll('player', this.playerDiceIndex);

		this.compareResults(this.playerResult, this.compResult);
	}

	showFirstMoveSelectionMenu() {
		const random = new FairRandom(this.maxFirstChoice);
		random.startDraw();
		console.log(`\nI selected a random value in the range 0..${this.maxFirstChoice} (HMAC=${random._hmac}).`);
		console.log('Guess my meaning\n');

		this.showSelectionMenu(this.maxFirstChoice);

		const userChoice = this.getUserChoice(this.maxFirstChoice);
		const compChoice = random._number;

		console.log(`My selection: ${compChoice} (KEY=${random._secret}).`);
		random.reveal();

		return userChoice === compChoice;
	}

	playerMoveFirst() {
		const allDice = this.diceSets.map((dice, index) => ({ dice, index }));
		this.playerDiceIndex = this.choosePlayerDice(allDice);

		const remainingDice = allDice.filter(({ index }) => index !== this.playerDiceIndex);
		this.compDiceIndex = remainingDice[0].index;
		console.log(`I choose the [${this.diceSets[this.compDiceIndex].join(', ')}] dice.`);
	}

	compMoveFirst() {
		this.compDiceIndex = crypto.randomInt(0, this.diceSets.length);
		const compDice = this.diceSets[this.compDiceIndex];
		console.log(`I make the first move and choose the [${compDice.join(', ')}] dice.`);

		const remainingDice = this.diceSets.map((dice, index) => ({ dice, index })).filter(({ index }) => index !== this.compDiceIndex);

		this.playerDiceIndex = this.choosePlayerDice(remainingDice);
	}

	showSelectionMenu(max) {
		for (let i = 0; i <= max; i++) {
			console.log(`${i} - ${i}`);
		}
		console.log('\nX - exit');
		console.log('? - help\n');
	}

	getValidatedInput(promptText, validateFn, helpText) {
		while (true) {
			const input = readlineSync.question(promptText).trim();

			if (input.toLowerCase() === 'x') {
				console.log('\nGet Away\n');
				process.exit(0);
			}

			if (input === '?') {
				console.log(helpText);
				const probabilityTable = new ProbabilityTable(this.diceSets);
				probabilityTable.generateTable();
				continue;
			}

			const result = validateFn(input);
			if (result !== null) return result;

			console.log('\nInvalid input.\n');
		}
	}

	getUserChoice(max) {
		return this.getValidatedInput(
			'Your selection: ',
			input => {
				const num = Number(input);
				return Number.isInteger(num) && num >= 0 && num <= max ? num : null;
			},
			`\nEnter a number from 0 to ${max}\n`
		);
	}

	choosePlayerDice(diceOptions) {
		this.displayDiceOptions(diceOptions);
		const validIndices = diceOptions.map(opt => opt.index);

		return this.getValidatedInput(
			'Your selection: ',
			input => {
				const idx = Number(input);
				return Number.isInteger(idx) && validIndices.includes(idx) ? idx : null;
			},
			'\nChoose a dice index from the list above.\n'
		);
	}

	displayDiceOptions(diceOptions) {
		console.log('Choose your dice:\n');
		diceOptions.forEach(({ dice, index }) => {
			console.log(`${index} - ${dice.join(', ')}`);
		});
		console.log('\nX - exit');
		console.log('? - help\n');
	}

	roll(player, diceIndex) {
		const dice = this.diceSets[diceIndex];
		const rollMax = dice.length - 1;
		const random = new FairRandom(rollMax);

		this.printRollStart(player, rollMax, random);
		const userNumber = this.getRollInput(rollMax);
		const compNumber = random._number;

		this.printRollResult(random, userNumber, compNumber, rollMax);

		const result = dice[(userNumber + compNumber) % (rollMax + 1)];
		console.log(`\n${player.toUpperCase()} ROLL RESULT IS ${result}.\n`);
		return result;
	}

	printRollStart(player, rollMax, random) {
		random.startDraw();
		console.log(`\nIt's time for ${player} roll.`);
		console.log(`\nI selected a random value in the range 0..${rollMax} (HMAC=${random._hmac}).\n`);
	}

	getRollInput(rollMax) {
		this.showSelectionMenu(rollMax);
		return this.getUserChoice(rollMax);
	}

	printRollResult(random, userNumber, compNumber, rollMax) {
		console.log(`My number is ${compNumber} (KEY=${random._secret}).`);
		random.reveal();
		const sumMod = (userNumber + compNumber) % (rollMax + 1);
		console.log(`The fair number generation result is ${compNumber} + ${userNumber} = ${sumMod} (mod ${rollMax + 1}).`);
	}

	compareResults(playerResult, compResult) {
		const outcomes = {
			win: `Player win ${playerResult} > ${compResult}!`,
			lose: `Computer win ${compResult} > ${playerResult}!`,
			tie: `It's a tie ${playerResult} = ${compResult}!`,
		};

		const outcomeKey = playerResult > compResult ? 'win' : playerResult < compResult ? 'lose' : 'tie';

		console.log(`\n${outcomes[outcomeKey]}\n`);
	}
}
