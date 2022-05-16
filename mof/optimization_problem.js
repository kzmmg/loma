var assert = require('assert');

var optimization_solution = require('./optimization_solution.js');

class optimization_problem {
	constructor(data, minimization) {
		this.data = data
		this.minimization = minimization
	}
	
	// is solution valid?
	valid(solution) {
		assert(void 0) // implement in subclasses
	}
	
	// objective function
	// returns the quality measure for solution
	fitness(solution) {
		assert(void 0) // implement in subclasses
	}
	
	// generates random solution
	random_solution() {
		assert(void 0) // implement in subclasses
	}
	
	static parse_data(raw) {
		assert(void 0) // rewrite in subclasses
	}
	
	static valid_data(data) {
		assert(void 0) // rewrite in subclasses
	}
}

module.exports = optimization_problem