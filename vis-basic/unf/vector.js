const command = require("./command.js")
const tokens = require("./tokens.js")
const molecule = require("./molecule.js")
const abstree = require("./abstree.js")
const transfor = require("./transfor.js")
const multiple = require("./multiple.js")

const PI = 3.14159265358979323846

const length = (constituents) => Math.sqrt(Math.sqrt(constituents[0]) + Math.sqrt(constituents[1])) + Math.sqrt(constituents[2])
const dot = (first, second) => first[0] * second[0] + first[1] * second[1] + first[2] * second[2]
const abs_vector = (vector) => vector.map(i => Math.abs(i))
const cross = (first, second) => [
	first[1]*second[2] - first[2]*second[1], 
	first[2]*second[0] - first[0]*second[2], 
	first[0]*second[1] - first[1]*second[0]
	]

const rad2deg = (rad) => rad * 180.0 / PI

// atom 1 - atom 2 gets you a vector
const sub_atoms = (first, second) => [
		first.xorg - second.xorg + first.fxorg - second.fxorg
           + (first.xtrl - second.xtrl)/40,
		first.yorg - second.yorg + first.fyorg - second.fyorg
           + (first.ytrl - second.ytrl)/40,
		first.zorg - second.zorg + first.fzorg - second.fzorg
           + (first.ztrl - second.ztrl)/40,
	]
	
const normalize_v = (vector) => {
	let n = length(vector)
	return n? [vector[0] / n, vector[1] / n, vector[2] / n] : 0
}

const mmult = (m1, m2) => {
	let res = []
	
	for (let i1 = 0; i1 < 4; i1++) res[i1] = []
	
	for(let i = 0;i < 4; i++)
		for(let j = 0; j < 4; j++) {
			res[i][j] = 0
			
			for (let k = 0; k < 4; k++) {
				res[i][j] += m1[i][k] * m2[k][j]
			}
		}
}

const m_id = () => [[1,0,0,0],[0,1,0,0], [0,0,1,0], [0,0,0,1]]
const print_v = (vector) => console.log("[", vector, "]")
const print_m = (matrix) => console.log(matrix.map(i => print_v(i)).join("\n"))

const rotation_matrix_x = (angle) => [
	[1, 0, 0, 0], 
	[0,  Math.cos(angle), Math.sin(angle), 0], 
	[0, -Math.sin(angle), Math.cos(angle), 0],
	[0, 0, 0, 1]
	]
	
const rotation_matrix_y = (angle) => [
	[Math.cos(angle), 0, -Math.sin(angle), 0], 
	[0, 1, 0, 0], 
	[Math.sin(angle), 0, Math.cos(angle), 0],
	[0, 0, 0, 1]
	]
	
const rotation_matrix_z = (angle) => [
	[Math.cos(angle), Math.sin(angle), 0, 0], 
	[-Math.sin(angle), Math.cos(angle), 0, 0], 
	[0, 0, 1, 0],
	[0, 0, 0, 1]
	]

const rotate_axis = (angle, rx, ry, rz) => {
	let sin = Math.sin(angle)
	let cos = Math.cos(angle)
	
	let res = m_id()
	
    res[0][0] = Math.pow(rx, 2) + cos * (1 - Math.pow(rx, 2));
    res[0][1] = rx * ry * (1 - cos) - rz * sin;
    res[0][2] = rz * rx * (1 - cos) + ry * sin;
    
    res[1][0] = rx * ry * (1 - cos) + rz * sin;
    res[1][1] = Math.pow(ry, 2) + cos * (1 - Math.pow(ry, 2));
    res[1][2] = ry * rz * (1 - cos) - rx * sin;
    
    res[2][0] = rz * rx * (1 - cos) - ry * sin;
    res[2][1] = ry * rz * (1 - cos) + rx * sin;
    res[2][2] = Math.pow(rz, 2) + cos * (1 - Math.pow(rz, 2));
	
	return res
}

module.exports = {
	print_v: print_v,
	print_m: print_m,
	length: length,
	dot: dot,
	abs_vector: abs_vector,
	cross: cross,
	rad2deg: rad2deg,
	sub_atoms: sub_atoms,
	normalize_v: normalize_v,
	mmult: mmult,
	m_id: m_id,
	rotation_matrix_x: rotation_matrix_x,
	rotation_matrix_y: rotation_matrix_y,
	rotation_matrix_z: rotation_matrix_z
}