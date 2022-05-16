class vdw_docking_problem extends docking_problem {
	get_scoring_function() {
		this.scoring_function = new vdw_scoring_function(this)
	}
}

module.exports = vdw_docking_problem
