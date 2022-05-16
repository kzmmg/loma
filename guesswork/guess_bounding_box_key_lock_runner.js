const guess_bounding_box_key_lock = require("./guess_bounding_box_key_lock.js")

const guess = new guess_bounding_box_key_lock("./doobie.pdb", "./doobie2.pdb")

guess.do_guess()