import Table from 'cli-table3';

export default class ProbabilityTable {
	constructor(diceSets) {
		this.diceSets = diceSets;
	}

	generateTable() {
		const results = this.diceSets.flatMap((setA, i) =>
			this.diceSets.map((setB, j) => {
				const prob = ProbabilityTable.calculateWinProbability(setA, setB);
				return { i, j, prob };
			})
		);

		this.printTable(results);
	}

	static calculateWinProbability(setA, setB) {
		const outcomes = setA.flatMap(a => setB.map(b => (a > b ? 1 : a === b ? 0.5 : 0)));
		const totalWins = outcomes.reduce((sum, val) => sum + val, 0);
		return totalWins / outcomes.length;
	}

	printTable(results) {
		const headers = ['User dice v', ...this.diceSets.map(set => set.join(','))];

		const table = new Table({
			head: headers,
			colWidths: headers.map(() => 15),
			style: { head: ['cyan'], border: ['gray'] },
		});

		this.calculateRows(results, table);
		console.log(`\n${table.toString()}\n`);
	}

	calculateRows(results, table) {
		const rows = this.diceSets.map((setA, i) => {
			const row = [setA.join(',')];

			const cols = this.diceSets.map((_, j) => {
				if (i === j) return '- (0.3333)';
				const result = results.find(r => r.i === i && r.j === j);
				return result ? result.prob.toFixed(4) : '';
			});

			return row.concat(cols);
		});

		rows.forEach(row => table.push(row));
	}
}
