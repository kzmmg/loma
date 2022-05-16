const guess_regression_planes = require("./guess_regression_planes.js")

const guess = new guess_regression_planes("./doobie.pdb", "./doobie2.pdb")

guess.do_guess()