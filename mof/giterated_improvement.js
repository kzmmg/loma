const assert = require('assert')

const optimization_solution 	= require('./optimization_solution.js')
const optimization_problem 	= require('./optimization_problem.js')

const basic_algorithm = require('./basic_algorithm.js')

// generic iterated improvement algorithm

class giterated_improvement extends basic_algorithm {
	// general iterative improvement 
	// takes the best neighborhood solution and move into it 
	// runtime: O(K) - K is total of neighborhood count
	//
	step(step){
		assert(!this.local_trap, "local optima trapped, no steps")
						
		let neiburrs = this.neighbors(this.current_sol)
		let best_neiburr = neighbors[0]
		
		for (let i = 0; i < neiburrs.length; i++) {
			let neiburr = neiburrs[i]
			
			if(this._better(neiburr,best_neiburr))
				best_neiburr = neighbor
		}
		
		// if previous found solution is better than best neighbor, 
		// we reached local optima
		if (this._better(this.current_sol,best_neiburr)) 
			this.local_trap = true
		
		// if best neighbor is same as previous found, and platau move not allowed
		// consider as trapped as well
		else if(this._equal(this.current_sol, best_neiburr) 
					&& !this.plateau_move)
			this.lo_trap = true;
		else 
			this.current_sol = best_neiburr
	}
}