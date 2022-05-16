var assert = require('assert');

class optimization_solution {
	constructor(data, fitness) {
		this.data = data;
		this.fitness = fitness;
	}
	
	static parse_data(raw) {
		assert(void 0) // rewrite in subclass
	}
	
	// are two sols identical (not comparably good/bad, but identical)
	identical(another_solution){ 
		assert(void 0) // implement in subs
	}
}

module.exports = optimization_solution