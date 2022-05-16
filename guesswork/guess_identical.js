const guess_generic = require("./guess_generic.js")

// this hypothesis says:
// "leave it as is"
class guess_identical extends guess_generic {
	guess(molecule1, molecule2) {
		void 0
	}
}

module.exports = guess_identical