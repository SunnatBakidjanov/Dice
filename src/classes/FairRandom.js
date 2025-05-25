import crypto from 'crypto';

export default class FairRandom {
	constructor(max) {
		this.max = max;
	}

	startDraw() {
		const secret = crypto.randomBytes(32).toString('hex');
		const number = crypto.randomInt(0, this.max + 1);
		const hmac = crypto.createHmac('sha256', secret).update(String(number)).digest('hex');

		this._secret = secret;
		this._number = number;
		this._hmac = hmac;
	}

	verifyHmac() {
		const expectedHmac = crypto.createHmac('sha256', this._secret).update(String(this._number)).digest('hex');
		return expectedHmac === this._hmac;
	}

	reveal() {
		console.log(`\nReveal:`);
		console.log(`Computer's number: ${this._number}`);
		console.log(`Secret: ${this._secret}`);
		console.log(`HMAC verification: ${this.verifyHmac() ? 'valid' : 'invalid'}\n`);
	}
}
