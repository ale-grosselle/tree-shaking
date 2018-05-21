import "regenerator-runtime/runtime";

export default class AsynchCall {
	constructor(){
		this.sum();
		this.sumParallel();
	}

	/**
	 * @description
	 * More quicky then sum
	 * @returns {Promise<void>}
	 */
	async sumParallel(){
		let op1 = this.asyncCall();
		let op2 = this.asyncError();
		console.log("SUM Parallel =>", await op1 + await op2);
	}

	/**
	 * @description
	 * Uncorrect uses of asynch
	 * @returns {Promise<void>}
	 */
	async sum(){
		let op1 = await this.asyncCall();
		let op2 = await this.asyncError();
		console.log("SUM =>", op1 + op2);
	}

	/**
	 * @description
	 * Handle promise properly
	 * @returns {Promise<number>}
	 */
	async asyncCall() {
		let result = await this.resolveAfter2Seconds();
		console.log(result);
		return 2;
	}

	/**
	 * @description
	 * Handle an error from promise
	 * @returns {Promise<number>}
	 */
	async asyncError() {
		try {
			await this.rejectAfter2Seconds();
			return 0;
		}catch (e) {
			console.log("Error: ", e);
			return 1;
		}
	}

	/**
	 * @description
	 * Resolve promise
	 * @returns {Promise<any>}
	 */
	resolveAfter2Seconds() {
		return new Promise(resolve => {
			setTimeout(() => {
				resolve('resolved');
			}, 2000);
		});
	}

	/**
	 * @description
	 * Reject promise
	 * @returns {Promise<any>}
	 */
	rejectAfter2Seconds() {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				reject('Here simulates error!!');
			}, 2000);
		});
	}

}
