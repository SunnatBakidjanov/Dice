export default class ProbabilityTable {
	constructor(diceSets) {
		this.diceSets = diceSets;
	}

	generateTable() {
		const results = this.diceSets.flatMap((setA, i) =>
			this.diceSets
				.map((setB, j) => {
					if (i === j) return null;

					const prob = ProbabilityTable.calculateWinProbability(setA, setB);
					return { i, j, prob };
				})
				.filter(Boolean)
		);

		this.printTable(results);
	}

	static calculateWinProbability(setA, setB) {
		const outcomes = setA.flatMap(a =>
			setB.map(b => {
				if (a > b) return 1;
				if (a === b) return 0.5;
				return 0;
			})
		);

		const totalWins = outcomes.reduce((sum, val) => sum + val, 0);
		const totalGames = outcomes.length;
		return totalWins / totalGames;
	}

	printTable(results) {
		console.log('------------------------------------------\n');
		results.forEach(({ i, j, prob }) => {
			const A = `[${this.diceSets[i].join(',')}]`;
			const B = `[${this.diceSets[j].join(',')}]`;
			console.log(`A: ${A} vs B: ${B} => A wins ≈ ${(prob * 100).toFixed(2)}%`);
		});
		console.log('\n------------------------------------------\n');
	}
}
