// definitions for problem and solution
module.exports.optimization_problem =  require('./optimization_problem.js')
module.exports.optimization_solution = require('./optimization_solution.js')

//basic stuff to get extended from
module.exports.basic_algorithm = require('./basic_algorithm.js')

// metaheurisitcs
module.exports.simulated_annealing 	 = require('./simulated_annealing.js')
module.exports.tabu_search 			 = require('./tabu_search.js')
module.exports.giterated_improvement = require('./giterated_improvement.js')

//experiment classes
module.exports.experiment = require('./src/core/experiment.js').experiment;
module.exports.analyzer = require('./src/core/experiment.js').analyzer;