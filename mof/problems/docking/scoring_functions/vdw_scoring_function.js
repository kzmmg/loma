const scoring_function = require('../scoring_function.js')

class vdw_scoring_function extends scoring_function {
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
				
				force += _vdw_calc(atom1, atom2)
			}
		}
		
		for (let i = 0; i < molecule1.atoms.length; i++) {
			for (let j = 1; j < molecule1.atoms.length; j++) {
				let atom1 = molecule1.atoms[i]
				let atom2 = molecule1.atoms[j]
				
				force += _vdw_calc(atom1, atom2)
			}
		}
		
		for (let i = 0; i < molecule2.atoms.length; i++) {
			for (let j = 1; j < molecule2.atoms.length; j++) {
				let atom1 = molecule2.atoms[i]
				let atom2 = molecule2.atoms[j]
				
				force += _vdw_calc(atom1, atom2)
			}
		}
		
		return force
	}
	
	_vdw_calc(atom1, atom2) {
		// todo
	}
}

module.exports = coulomb_scoring_function