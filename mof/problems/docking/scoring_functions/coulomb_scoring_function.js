const scoring_function = require('../scoring_function.js')

const coulomb_k = 8.987551792314 / 10

class coulomb_scoring_function extends scoring_function {
	score(candidate) {
		let molecule1 = this.problem.molecule1
		let molecule2 = this.problem.molecule2
		
		molecule1 = molecule1.transform(candidate.slice(0,6))
		molecule2 = molecule1.transform(candidate.slice(6))
		
		let force = 0
		
		for (let i = 0; i < molecule1.atoms.length; i++) {
			for (let j = 0; j < molecule2.atoms.length; j++) {
				let atom1 = molecule1.atoms[i]
				let atom2 = molecule2.atoms[j]
				
				force += _coulomb_calc(atom1, atom2)
			}
		}
		
		for (let i = 0; i < molecule1.atoms.length; i++) {
			for (let j = 1; j < molecule1.atoms.length; j++) {
				let atom1 = molecule1.atoms[i]
				let atom2 = molecule1.atoms[j]
				
				force += _coulomb_calc(atom1, atom2)
			}
		}
		
		for (let i = 0; i < molecule2.atoms.length; i++) {
			for (let j = 1; j < molecule2.atoms.length; j++) {
				let atom1 = molecule2.atoms[i]
				let atom2 = molecule2.atoms[j]
				
				force += _coulomb_calc(atom1, atom2)
			}
		}
		
		return force
	}
	
	_coulomb_calc(atom1, atom2) {
		let dist = Math.sqrt(Math.pow(atom1.x - atom2.x, 2) + 
								Math.pow(atom1.y - atom2.y, 2) + 
								Math.pow(atom1.z - atom2.z, 2))
								
		
								
		let charge_prod = atom1.charge * atom2.charge
		
		return coulomb_k * charge_prod / dist
	}
}

module.exports = coulomb_scoring_function