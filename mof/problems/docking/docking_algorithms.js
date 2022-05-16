const assert = require('assert')

const docking_problem 	= require('./docking_problem.js')
const docking_solution 	= require('./docking_solution.js')
const docking_constant 	= require('./docking_constant.js')

const giterative_improvement 	= require('../../giterative_improvement.js')
const simulated_annealing 		= require('../../simulated_annealing.js')
const tabu_search 				= require('../../tabu_search.js')

const neighbors = (candidate) => {
	assert(this.problem.valid(candidate))
	
	let neiburrs = []
	
	// e*(e-1)/2 elements in total  
	for (let i = 0; i < 6; i++) {
		let trans  = Array(docking_constant.dim).fill(0)
		trans[i]  =  docking_constant.fixed_step
		let trans2 = Array(docking_constant.dim).fill(0)
		trans2[i] = -docking_constant.fixed_step
		
		neiburrs.push(new docking_solution(plus(candidate, trans)))
		neiburrs.push(new docking_solution(plus(candidate, trans2)))
	}
	
	return neiburrs
}
		
const neighbor = (candidate) => {
	assert(this.problem.valid(candidate))
	
	let random_element = Math.round(Math.random() * 12)
	let random_direction = Math.random() > 0.5 ? 1 : -1;
	
	let random_neighbor = Array(docking_constant.dim).fill(0)
	random_neighbor[random_element] = random_direction * docking_constant.fixed_step

	random_neighbor = new docking_solution(plus(candidate, random_neighbor))
	
	assert.ok(this.problem.valid(random_neighbor))
	random_neighbor.fitness = this.problem.fitness(random_neighbor)
	
	return random_neighbor
}

class docking_tabu_search extends tabu_search {
	neighbor(candidate) {
		return neighbor(candidate)
	}
	
	neighbors(candidate) {
		return neighbors(candidate)
	}
}

class docking_simulated_annealing extends simulated_annealing {
	neighbor(candidate) {
		return neighbor(candidate)
	}
	
	neighbors(candidate) {
		return neighbors(candidate)
	}
}

class docking_giterative_improvement extends giterative_improvement {
	neighbor(candidate) {
		return neighbor(candidate)
	}
	
	neighbors(candidate) {
		return neighbors(candidate)
	}
}

module.exports.docking_tabu_search = docking_tabu_search
module.exports.docking_simulated_annealing = docking_simulated_annealing
module.exports.docking_giterative_improvement = docking_giterative_improvement