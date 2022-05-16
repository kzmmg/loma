class coulomb_docking_problem extends docking_problem {
	get_scoring_function() {
		this.scoring_function = new coulomb_scoring_function(this)
	}
}

module.exports = coulomb_docking_problem