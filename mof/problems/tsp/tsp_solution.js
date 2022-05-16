const assert = require('assert')

const matrix = require('sylvester').Matrix
const vector = require('sylvester').Vector

const optimization_solution = require('../../optimization_solution.js')


// TSP solution is a vector treated as an ordered node list, in which each city node exists at least once and only once 
// value is the index of the node in the problem's instance matrix 
// x = [n1,n2,n3,...]
class tsp_solution extends optimization_solution {
	constructor(){
		super.apply(this,arguments)
	}
	
	identical(sol) { 
		assert.ok(sol instanceof tsp_solution)
		
		if(sol.dimension() != this.dimension()) 
			return false
		for(let i = 0;i < this.dimension(); i++)
			if(sol.data.elements[i] != this.data.elements[i] ) 
				return false
			
		return true
	}
			
	dimension() {
		return this.data.elements.length
	}
	
	toString (){
		return "[" + this.data.elements + "](" + this.fitness + ")"
	}
}
module.exports = tsp_solution