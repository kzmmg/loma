const assert = require('assert')

const matrix = require('sylvester').Matrix
const vector = require('sylvester').Vector
const xml2js = require('xml2js')

const fisher_yates_permute = require('../../permute.js')

const optimization_problem = require('../../optimization_problem.js')
const tsp_solution = require('./solution.js')

// http://comopt.ifi.uni-heidelberg.de/software/TSPLIB95/
// http://comopt.ifi.uni-heidelberg.de/software/TSPLIB95/XML-TSPLIB/Description.pdf

class tsp_problem extends optimization_problem {
	 
	constructor(data){
		if (data instanceof Array) 
			data = matrix.create(data)
		
		//tsp is a minimization problem 
		super(data, true) 
	}
	
	// return true if the candidate solution satifies problem constraints , otherwise false
	// a solution is valid if all the following are satisfied 
	//   * contains each city node once and only once 		   
	// time Complexity :  O(n)
	valid(candidate) {
		assert(candidate instanceof tsp_solution)
		
		let val = {} //index from node index to occurance count 
		for (let i = 1; i <= candidate.data.elements.length; i++) {
			let idx = candidate.data.e(i);
			if (!val[idx]) 
				val[idx] = 1
			else 
				val[idx] += 1
		}
		//once and only once
		let node_count = this.data.elements.length
		for (let i = 1; i <= node_count; i++)
			if (val[i] != 1) return false
		return true;
	}
		
	// the objective function 
	// given a solution candidate, evaluate its fitness value 
	// runtime complexity : O(n) - n is # of city nodes
	fitness(candidate) {
		let total_dist = 0
		let pre = candidate.data.e(1), cur
		for (let i = 2; i <= candidate.data.elements.length; i++) {
			cur = candidate.data.e(i) //console.log("%d => %d (+%d)",pre, cur, this.instance.e(pre,cur));
			total_dist += this.data.e(pre, cur)
			pre = cur
		}
		total_dist += this.data.e(cur, candidate.data.e(1)) //final stop to start
		return total_dist
	}
		
	// generating a random solution 
	random_solution(){
		// produce a random solution 
		
		let sol = []
		
		for (var i = 1; i <= this.dimension(); i++) 
			sol.push(i)
		fisher_yates_permute(sol)			
		let ret = new tsp_solution(vector.create(sol))
		ret.fitness = this.fitness(ret)
		return ret;	
	}

	// number of city nodes 
	dimension : function(){
		return this.data.elements.length //an array of arrays
	}
	
	// raw is the data content containing the problem instance definition 
	// return an data object for TSP problem instance
	// TSP data is a matrix wrapping a 2d array 
	static parse_data(raw) {
		let parser = new xml2js.Parser()
		let data = void 0

		parser.on('end', function(result) {
			let instance = result['travellingSalesmanProblemInstance']
			
			assert.ok(instance.graph.length > 0, "no valid tsp data")
			
			let vertices = instance.graph[0]["vertex"]
			
			assert.ok(vertices instanceof Array)
			assert.ok(vertices.length >= 2)
			
			console.log("reading %d city nodes", vertices.length)
			
			// the NxN matrix representing this problem 
			data = new Array(vertices.length)
			
			for(let i = 0;i < data.length; i++) 
				data[i] = [] 	
			
			vertices.forEach(function(vertex, i){
				let edges = vertex.edge
				
				edges.forEach(function(edge) {
					let city = parseInt(edge['_'])  //linking target city's index 
					let cost = parseFloat(edge['$']['cost']) //attributes on an edge, usually the cost 
					
					//must be a valid city node index
					assert.ok(!isNaN(city) && city >=0 && city < vertices.length, 
									"city index invalid " + city);  
					assert.ok(!isNaN(cost) && cost >= 0, "cost invalid " + cost)
					
					data[i][city] = cost
				})		
				data[i][i] = 0
			})
		})
		
		//blocking call here
		parser.parseString(raw) 
		
		assert.ok(data)
		
		return matrix.create(data)
	}
		
	// make usre the problem intance is valid
	// must be a N by N matrix, with  P_ij = 0 where i==j
	// no negative distances too
	static valid_data(data){
		assert.ok(data instanceof matrix) 
		
		let d1 = data.elements
		let n = d1.length
		
		for(let i = 0; i < n; i++){
			if(d1[i].length != n){ 
				console.log("dimension not matching")
				return false
			}
			if(d1[i][i] != 0) {	
				console.log("(%d,%d) not zero", i,i, d1[i][i]);
				return false  //self path must be zero
			}
			
			for(let j = 0; j < n; j++) {
				if(d1[i][j] < 0) {
					console.log("(%d,%d) has val %s", i,j,d1[i][j]);
					return false //no negative 
				}
			}
		}
		
		return true
	}
}

	
	
module.exports = tsp_problem