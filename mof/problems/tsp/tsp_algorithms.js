const assert = require('assert')

const matrix = require('sylvester').Matrix
const vector = require('sylvester').Vector

const tsp_solution = require('./tsp_solution.js')

const giterative_improvement = require('../../giterative_improvement.js')
const simulated_annealing = require('../../simulated_annealing.js')
const tabu_search = require('../../tabu_search.js')

// a 2-k neighborhood gives N*(N-1) candidates where N is number of nodes
// MAKE SURE evaluate neighbor's fitness before returning
const neighbors = (candidate) => {
	assert(this.problem.valid(candidate))
	
	let self = this
	let neiburrs = []
	
	//number of city nodes
	let n = this.problem.dimension() 
	
	//number of travel paths 
	let e = n 
	
	//enumerate all possible pair of edges to remove 
	let origin = candidate.data.elements.slice(0)
	
	// e*(e-1)/2 elements in total  
	for (let i = 0; i < e - 1; i++) {
		for (let j = i + 1; j < e; j++) {
			
			//remove edge i connecting node i and i+1
			//remove edge j connecting node j and j+1
			//connect node i and j 
			//connect node i+1 and j+1 to form the new circle
			//new arrya is //  n1 ... ni  nj n(j-1) ... n(i+1) n(j+1) ... nn 		
			let arr = []
			
			//  n1 ... ni
			arr = arr.concat(origin.slice(0, i + 1))
			
			// nj, n(j-1) ... n(i+1)
			arr = arr.concat(origin.slice(i + 1, j + 1).reverse())
			
			//  n(j+1) .. nn 
			arr = arr.concat(origin.slice(j + 1, e))
			
			neiburrs.push(new tsp_solution(vector.create(arr)))
		}
	}
	//filter identical set  O(n^2) time 
	var unique_neighbors = [];
	neighbors.forEach(function(neighbor) {
		var duplicate = unique_neighbors.some(function(elem) {
			return neighbor.identical(elem);
		});
		//consider candiate itself 
		duplicate = duplicate || candidate.identical(neighbor);
		if (!duplicate) {
			neighbor.fitness = self.problem.fitness(neighbor); //make sure we evaluate the neighbor before returning
			unique_neighbors.push(neighbor);
		}
	});
	
	assert(unique_neighbors.length > 0, "unique neighborhood set is empty!");
	return unique_neighbors;
}
		
// return a random neighbor from candidate's 2-k neighborhood
// MAKE SURE evaluate neighbor's fitness before returning 
const neighbor = (candidate) => {
	assert(this.problem.valid(candidate))
	
	//number of city nodes
	let n = this.problem.dimension() 
	
	//number of travel paths 
	let e = n 
	
	let origin = candidate.data.elements.slice(0)
	
	// generate two random indices to resplice array
	let i = Math.round( Math.random() * (e-2))
	let j = i + 1 + Math.round( Math.random() * (e-1-(i+1)) )
	let arr = []
	
	arr = arr.concat(origin.slice(0, i + 1)) //  n1 ... ni
	arr = arr.concat(origin.slice(i + 1, j + 1).reverse()) // nj, n(j-1) ... n(i+1)
	arr = arr.concat(origin.slice(j + 1, e)) //  n(j+1) .. nn 		

	let neiburr = new tsp_solution(vector.create(arr))
	
	assert.ok(this.problem.valid(neiburr))
	neiburr.fitness = this.problem.fitness(neiburr)
	
	return neiburr
}


// === ALGORITHM

/**
 Tabu Search for SAT 
**/
var TSP_TS = defineClass({
	name : "TSP_TS",
	extend : TS, 
	methods : {
		'neighbors': neighbors,
		'neighbor' : neighbor
	}	
});

var TSP_IIA = defineClass({
	name : "TSP_IIA",
	extend : IIA, 
	methods : {
		'neighbors' : neighbors,
		'neighbor' : neighbor
	}
});

var TSP_SA = defineClass({
	name : "TSP_SA",
	extend : SA,
	methods : {
		'neighbors' : neighbors,
		'neighbor' : neighbor
	}
});

module.exports.TSP_TS = TSP_TS;
module.exports.TSP_SA = TSP_SA;
module.exports.TSP_IIA = TSP_IIA;