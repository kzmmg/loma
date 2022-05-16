const assert = require('assert')

const optimization_problem = 	require('./optimization_problem.js')
const optimization_solution = 	require('./optimization_solution.js')

const max_steps = 1000;

// base algorithm
class basic_algorithm {
	constructor(problem, config) {
		this.problem = problem
		this.config = config
		
		// plateau_move : true to allow local search to move into a solution having the same quality as the previous one。 
		// default true
		if(config && config.plateu_move !== void 0) 
			this.plateau_move = config.plateau_move
		else
			this.plateau_move = true
		
		// terminate_ls_steps : search step threshold for stoping the ls
		// default max_steps constant
		if(config && config.terminate_ls_steps !== void 0) 
			this.terminate_ls_steps = config.terminate_ls_steps
		else
			this.terminate_ls_steps = max_steps
		
		// terminate_fitness : fitness threshhold for stopping 
		if(config && config.terminate_fitness !== void 0) 
			this.terminate_fitness = config.terminate_fitness	
	}
	
	// initialize search state, to be overwritten in subs
	init() {
		//search state 
		
		this.init_sol = this.init_solution() 	//initial starting solution 
		this.current_sol = this.init_sol 		//current solution during the search process
		this.best_sol = this.init_sol 			//best found solution so far
		this.current_step = 0 					//current local search steps
		this.local_trap = false 				//flag whether current solution is trapped in local optima
			
	}
	
	// operator is given a current step number
	run(operator) {
		
		assert(!operator || typeof(operator) == "function")
		
		this.init()
		
		if(operator) 
			operator(0)
		
		while(true){
			if(this.terminate()) 
				break
			
			this.step(this.current_step)	
			this.current_step += 1
			
			if(this._better(this.current_sol, this.best_sol))  
				this.best_sol = this.current_sol //best known solution
			if(operator) 
				operator(this.current_step)					
		}
	}
	
	terminate() {
		let threshold_fit_solution = new optimization_solution(null,this.terminate_fitness);

		if(this.local_trap) 
			return true //if previous step hit local optima
		
		if(this.cur_step >= this.terminate_ls_steps)  
			return true //reaching user-specified max steps
		
		if(this.terminate_fitness && 
			(this._equal(this.best_sol, threshold_fit_solution) 
				|| this._better(this.best_sol, threshold_fit_solution))) 
			return true //if use threshold fitness and we found better, break 
			
		if(this.cur_step > max_steps) 
			return true; //reaching system-defined max steps
		return false;
	}
	
	init_solution(){
		return this.problem.random_solution()
	}
	
	//given two problem solution, determine which solution is better
	//return true is solution1 is better than solution2
	_better (solution1, solution2){  
		return this.problem.minimization ? 
			(solution1.fitness < solution2.fitness) : 
			(solution1.fitness > solution2.fitness) 
	}	
	//given two problem solution ,determine if they have equal quality / fitness
	_equal (solution1, solution2){ 
		return Math.abs(solution1.fitness - solution2.fitness) <= basic_algorithm.SOLUTION_QUALITY_MIN_DIFFERENCE 
	}
	
	// single step
	step (n) {
		assert(void 0) // for subs
	}
		
	//define the transient operator / neighborhood structure
	//returns the set of ALL neighbor candidates 
	//Time Complexity O(K) where K is the branching factor from a single solution node in the app's search landscape 
	neighbors (solution){
		assert(void 0) // for subs
	}
		
	//given a solution, returns a RANDOM neighbors of it 
	neighbor (solution){
		assert(void 0) // for subs
	}
}

module.exports = basic_algorithm;