const assert = require('assert')

const optimization_problem   = require('./optimization_problem.js')
const optimization_solution  = require('./optimization_solution.js')

const basic_algorithm = require('./basic_algorithm.js')

const version = '0.1'

const fs = require('fs')

// an experiment utility manages a single experiment session 
// an experiment session may contain the following iterations 
// 	 * 1 or more problem instances to test against 
// 	 * 1 or more SLS algorithms to test against each problem
// 	 * for each algorithm, a number of meta-parameter settings to test 
// 	 
// 	 
// the experiment result is a set of triples (problem, alg, config):
// 	 * each triplet element represent N independent runs of an algorithm under a parameter setting against a problem instance
//		why run the same algo multiple times? because some parameters may be randomized, like init_sol
// 	 * each triplet associates a result table of the following form 
// 	    step0 step1 ... stepN
// 	   	 xx     xx        xx
// 	   	 xx
// 	   	 ..
// 	   	 N
// 	   			
// 	    where each cell records the best found solution quality at that local search step 
// 	    interally, the data is a matrix, with the ith row representing data collected at the ith local search step
// 	    	  
// 	    this format conforms to tsv with the first line being the field name 
// 	  
// 	  
// notes:
// 	* this module will be the main interface connecting UI     
// 	* handles file loading, parsing and stuff like that 
// 	* it will incrementally stream results to the files - so a watcher can still read the experimental progress
// 	
// 	
// notes: 
// 
// 	 * this class will export all experiment results to a target folder with the following structurs 
// 	 	master.tsv - the main index file for this entire experiment session
// 	 	#version xx 
// 	 	#problem  algorithm  config 	filename 
// 	 	 tsp      tsp_sa   [1,"arit"]   xxx.tsv
// 	 	 .  
// 	 			
// 	 	* problem is the problem name being tested
// 	 	* algorithm is the unique algorithm name run against the problem
// 	 	* filename is the corresponding raw data file under the same directory 
// 	 	* config is the algorithm's meta-parameter settings for this experiment
// 	 		it is an array of meta-parameter setting values for this experiment
// 	 			
// 	 	xx.tsv  - the raw experiment data corresponding to a triple (problem,alg,config). 
//			name is randomly generated and indexed from master.tsv 


function load_problem_class(problem_name){
	var problem = require('example/'+problem_name.toLowerCase()+"/problem.js")
	assert(problem && typeof(problem)=="function")
	return problem
}

class experiment {
	//
	// config is an object containing the following synatx 
	// 
	// 	{
	// 		"sat" : {    //the SAT problem name 
	// 			"instances" : ["xxx.tsv", "yyy.xml"], 	- an array of filenames represeting the problem instance to test agains
	// 			
	// 			"algorithms" : {		  				- a list of algorithms to test against. Name must be matching that algorithm's global definition name 	
	// 				"sat_iia" : [        				- meta-parameter settings for each algorithm. An object with key being the algorithm name 
	//			  		 			{"boltzmanconst":0.05, "coolingscheme":"geometric"}, 
	//			  		 			{"boltzmanconst":0.005, "coolingscheme":"geometric"},
	//			  		 			{"boltzmanconst":0.001, "coolingscheme":"geometric"},
	//			  		 			...	  								
	// 							] ,
	// 			
	// 				"sat_ts" : [
	//		  		 				{"tabu_tenure" : 10},
	//		  		 				{"tabu_tenure" : 50},
	//		  		 				{"tabu_tenure" : 100}	  			
	//		  		 				...	
	// 							],
	// 							
	// 				"sat_iia" : []
	// 			}, 
	// 			
	// 			
	// 			"runs"  :  N   								- a number specifing how many independent runs on each algorithm against each problem instance / acted as a max bound
	// 			"max_ls_steps" : M  						- an upper bound for maximu number of local search steps on algs running against this problem categor
	// 		}, 
	// 		
	// 		
	// 		"tsp" : {   //the TSP problem name 
	// 		 	...
	// 		}
	// 	
	// 	}
	// 	
	// 	
	// outdir - output directory (will create it if not exist)
	//
	
	
	constructor(config, outdir){
		this.config = void 0
		this.outdir = "mof.data"
		
		this.config = config
		if(outdir) 
			this.outdir = outdir
	}
	
	init() {
		if(!fs.existsSync(this.outdir)){
			fs.mkdirSync(this.outdir)
		} else{
			var stats = fs.statSync(this.outdir)
			if(!stats.isDirectory()){
				console.log("output dir exists and is not a directory. abort experiment")
				return false
			}
		}
		
		this.save_config()
		return true
	}
	
	// start executing the experiment 
	run() {
		
		var self = this
		if(!this.init()) 
			return
		
		//for each problem category
		for(var problem_name in this.config){
			//load the problem class
			let problem_config = this.config[problem_name]
			let problem = load_problem_class(problem_name)
			
			//load each problem instance
			for(let i = 0; i < problem_config['instances'].length; i++) {
				let instance_filename = problem_config['instances'][i]
				
				//loading the file from disk
				let fullpath = '../workspace/instances/' + instance_filename
				
				assert.ok(fs.existsSync(fullpath, "instance file not exist " + fullpath))
				
				console.log("reading " + fullpath)
				
				let content = fs.readFileSync(fullpath, {'encoding' : 'utf8'})
				
				assert.ok(content!=undefined, "error reading file")

				//parsing instance content and instantiate the problem instance object! 
				let data = problem.parse_data(content)
				assert.ok(problem.valid_data(data), "data invalid")	
				
				let instance = new problem(data)
				
				//total independent runs
				let independent_runs = parseInt(problem_config.runs)
				assert(!isNaN(independent_runs) && independent_runs > 0)
				
				let max_ls_steps = parseInt(problem_config.max_ls_steps)
				assert(!isNaN(max_ls_steps) && max_ls_steps > 0)
				
				//for each testing algorithm
				for(let alg_name in problem_config.algorithms){
					let algorithm_config = problem_config.algorithms[alg_name]
					
					//load algorithm class
					let algorithm = load_algorithm_class(problem_name, alg_name)
					
					//for each parameter setting, conduct N indepedent runs 
					if(algorithm_config.length > 0){
						for(let i = 0; i < algorithm_config.length; i++) {
							let alg_config = algorithm_config[i]
							
							//add the local search step constraint 
							alg_config['terminate_ls_steps'] = max_ls_steps 
							let alg = new algorithm(instance, alg_config)
							

							//before an independent run, add index to master file
							let exp_filename = this.outdir + 
								"/" + problem_name + 
								"-" + alg_name + 
								(new Date()).getTime() + ".tsv";
								
							this.add_master(
								problem_name, 
								instance_filename,  
								alg_name, 
								JSON.stringify(alg.config), 
								exp_filename, 
								independent_runs, 
								max_ls_steps)
							
							console.log("problem %s, instance %s, algorithm %s, experiment_file %s", 
											problem_name, 
											instance_filename, 
											alg_name, 
											exp_filename)						
							
							for(let run = 1 ; run <= independent_runs; run++){
								let stats = []; //record best found solution for each step
								
								alg.init();									
								alg.run(function(step){
									stats.push(alg.best_sol.fitness);
								});

								// if alg stopped before reaching max, 
								// add * to indicate this and fill up the entire array
								for(let i = stats.length; i <= max_ls_steps; i++) stats.push("*")		
									
								//update on experiment file 
								this.add_experiment_file(exp_filename, max_ls_steps, stats)								
							}
						}
						
					} else { //using alg's default setting and conduct N indpedent runs
						let alg = new algorithm(instance, {'terminate_ls_steps' : max_ls_steps})
						
						//before an independent run, add index to master file
						let exp_filename = 
								this.outdir + "/" + 
								problem_name + "-" + 
								alg_name + "-" + 
								(new Date()).getTime() + ".tsv"
								
						this.add_master(
								problem_name, 
								instance_filename, 
								alg_name, 
								JSON.stringify(alg.config), 
								exp_filename, 
								independent_runs, 
								max_ls_steps)
						
							console.log("problem %s, instance %s, algorithm %s, experiment_file %s",  
											problem_name, 
											instance_filename, 
											alg_name, 
											exp_filename);
																
						for(let run = 1 ; run <= independent_runs; run++){
							let stats = []; //record best found solution for each step
							alg.init();
							alg.run(function(step){
								stats.push(alg.best_sol.fitness);
							});


								
							// if alg stopped before reaching max, 
							// add * to indicate this and fill up the entire array
							for(let i=stats.length;i<=max_ls_steps;i++)
								stats.push("*");			
								
							//update on experiment file 
							this.add_experiment_file(exp_filename, max_ls_steps, stats);								
						}
					}
				}
			}
		}
	}

	// add a new entry to the master index file  
	add_master(problem, instance, algorithm, config, filename, runs, steps) {
		let path = this.outdir + "/master.tsv"
		let opt = {'encoding' : "utf8"}
		if(!fs.existsSync(path)){
			fs.appendFileSync(path, "#version " + version + "\n", opt)
			fs.appendFileSync(path, "#problem	instance	algorithm	config	filename	runs	steps\n", opt)
		}
		
		//adding the entry
		let entry = 
				problem 	+ "\t" + 
				instance 	+ "\t" + 
				algorithm 	+ "\t" + 
				config 		+ "\t" + 
				filename 	+ "\t" + 
				runs 		+ "\t" + 
				steps
		fs.appendFileSync(path, entry + "\n", opt)
	}
		
	//  FORMAT 
	//	step0 step1 ... stepN
	//	xx     xx             xx
	//	xx
	//	..
	//	N
	//   
	//   steps is total number of local search steps in this single run
	//   fitnesses is an arary of  fitness value at each local search step  [0, MAX]
	//
	add_experiment_file(filepath, steps, fitnesses) {
		
		let opt = {'encoding' : "utf8"}
		
		assert.ok(fitnesses.length == steps + 1)
		
		if(!fs.existsSync(filepath)) {
			let header = ""
			for(let i = 0; i <= steps; i++) 
				header += "step" + i + "\t" //step0  step1 ... stepN
			fs.appendFileSync(filepath, header+"\n", opt);
		}
		
		fs.appendFileSync(filepath, fitnesses.join('\t') + "\n", opt);
	}
	
	// the configuration for this entire experiment session
	save_config() {
		let opt = {'encoding' : "utf8"}
		let path = this.outdir + "/config.json"
		fs.writeFileSync(path, JSON.stringify(this.config), opt)
	}
}


function load_algorithm_class(problem_name, alg_name) {
	//load algorithm class
	let algorithm = require('example/' + problem_name + "/algorithms.js")[alg_name.toUpperCase()]
	assert.ok(algorithm && typeof(algorithm) == "function", 
				"failed to load " + 
					'example/' + 
						problem_name + 
						"/Algorithms.js - " + 
						alg_name.toUpperCase())
	return algorithm;				
}

module.exports.experiment = experiment
