const assert = require('assert')

const optimization_problem = require('../../optimization_problem.js')

const docking_solution = require('./docking_solution.js')
const docking_constant = require('./docking_constant.js')

class docking_problem extends optimization_problem {
	 
	constructor(data){
		if (data instanceof Array) {
			this.molecule1 = data[0]
			this.molecule2 = data[1]
		}
				
		super(data, true) 
	}
	
	// return true if the candidate solution satifies problem constraints , otherwise false
	// a solution is valid if all the following are satisfied 
	//   * contains 12 elements
	valid(candidate) {
		assert(candidate instanceof docking_solution)
		
		if (candidate.data.length === docking_constant.dim) 
			return true
		return false
	}
		
	// the objective function
	fitness(candidate) {
		assert(candidate instanceof docking_solution)
		
		return this.score(candidate)
	}
	
	score(candidate) {
		this.get_scoring_function()
		
		assert(this.scoring_function instanceof scoring_function)
		
		this.scoring_function.score(candidate)
	}
	
	get_scoring_function() {
		this.scoring_function = void 0 // redo in subs
		assert(false)
	}
		
	// generating a random solution 
	random_solution(){		
		let sol = []
		
		for (var i = 0; i <= this.dimension(); i++) 
			sol.push(docking_constant.fixed_step * Math.random() > 0.5 ? 1 : -1)
				
		let ret = new docking_solution(sol)
		ret.fitness = this.fitness(ret)
		return ret;	
	}

	dimension : function(){
		return docking_constant.dim
	}
	
	static parse_data(raw) {
		return raw
	}
	
	static valid_data(data){
		return true
	}
}

	
	
module.exports = docking_problem