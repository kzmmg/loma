const assert = require('assert')

const optimization_solution 	= require('./optimization_solution.js')
const optimization_problem 	= require('./optimization_problem.js')

const basic_algorithm = require('./basic_algorithm.js')

class tabu_search extends basic_algorithm {
	// tabu_tenure  : length of the tabu list 
	constructor(problem, config) {
		super(problem, config)
		
		
		// tabu_tenure - 		length of short term tabu list
		// short_mem - 			short term tabu memory structure simply contains recently K visisted solutions 
		// _cur_expire_index - 	current tabu item to be expired. the index cycled throug [0 ~ tabu_tenure-1]
		
		this.tabu_tenure = 20
		this.short_mem = void 0
		this._cur_expire_index = 0
		
		if (config && config.tabu_tenure != void 0) 
			this.tabu_tenure = config.tabu_tenure
	}
	
	// initializing a tabu list 
	init_tabu() {
		this.short_mem = new Array(this.tabu_tenure)
		this._cur_expire_index = 0
	}
	
	// update tabu with the newly added solution
	// expires old ones
	update_tabu(new_sol) {
		this.short_mem[this._cur_expire_index] = new_sol
		this._cur_expire_index = (this._cur_expire_index + 1) % this.tabu_tenure
	}
	
	// return true if the given solution is forbidden by the tabu definition
	tabued(sol) {
		let forbidden = false
		
		for (let i = 0; i < this.short_mem.length; i++) {
			let one_tabu = this.short_mem[i]
			if (one_tabu.identical(sol)) return true
		}
		
		return false
	}
	
	init() {
		super()
		this.init_tabu()
		
		// add the initial solution
		this.update_tabu(this.init_sol) 
	}
	
	step(step) {
		// unfiltered neighbors
		let neiburrs = this.neighbors(this.current_sol) 
		
		// candidates filtered by tabu 
		var filtered_candidates = []
		var best_neiburr = void 0
		
		for (let i = 0; i < neiburrs.length; i++) {
			let neiburr = neiburrs[i]
			
			if (!this.tabued(neiburr)) {
				filtered_candidates.push(neiburr)
				
				if (!best_neiburr || 
					this._better(neiburr, best_neiburr)) 
						best_neiburr = neiburr
			}
		}
		
		// choose the best solution and move into it 
		// note we alwasy move into a new neighbor, 
		// regardless whether it is a better solution than the current one 
		if (best_neiburr) 
			this.current_sol = best_neiburr
		this.update_tabu(this.current_sol)
	}
}

module.exports = tabu_search