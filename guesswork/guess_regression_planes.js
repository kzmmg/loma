const guess_generic = require("./guess_generic.js")

const THREE = require("./three.js")
const {Matrix, $M, Vector, $V, Line, $L, Plane, $P} = require("./sylvester.js")

const HACK = 1000

// 3d plane co-planarization "strategy"
class guess_regression_planes extends guess_generic {
	
	_to_arr(atoms) {
		let arr = []
		let z = []
		
		for(let i = 0; i < atoms.length; i++) {
			let atom = atoms[i]
			
			arr.push([1, atom.x, atom.y])
			z.push([atom.z])
		}
		
		return [ arr, z ]
	}
	
	guess(molecule1, molecule2) {
		let [ arr1, z1 ] = this._to_arr(molecule1.atoms)
		let [ arr2, z2 ] = this._to_arr(molecule2.atoms)
		
		// console.log(z1)
		
		let mx1 = $M(arr1)
		let my1 = $M(z1)
		
		let mx2 = $M(arr2)
		let my2 = $M(z2)
		
		// https://youtu.be/xVgqM35YSDY?t=99
		let b1 = mx1.transpose().multiply(mx1).inverse().multiply(mx1.transpose()).multiply(my1)
		let b2 = mx2.transpose().multiply(mx2).inverse().multiply(mx2.transpose()).multiply(my2)
		
		// console.log("b1", b1)
		
		// A B C D = [ b1[1], b1[2], -1, b1[0]]
		
		let A1 = b1.elements[1][0]
		let B1 = b1.elements[2][0]
		let C1 = -1            
		let D1 = b1.elements[0][0]
							   
		let A2 = b2.elements[1][0]
		let B2 = b2.elements[2][0]
		let C2 = -1           
		let D2 = b2.elements[0][0]
		
		if (A1 / A2 === B1 / B2) return
		
		// https://sites.math.washington.edu/~king/coursedir/m445w04/notes/vector/normals-planes.html
		
		let normal1 = [A1, B1, C1]
		let normal2 = [A2, B2, C2]
		
		// console.log(normal1, normal2)
		
		normal1 = $V(normal1)
		normal2 = $V(normal2)
		
		let normal_dot = normal1.dot(normal2)
		
		let modulus1 = normal1.modulus()
		let modulus2 = normal2.modulus()
		
		let cos_theta = normal_dot / (modulus1 * modulus2)
		
		// unitcross: https://stackoverflow.com/questions/9423621/3d-rotations-of-a-plane
		
		let cross = normal1.cross(normal2)
		let modulus_cross = cross.modulus()
		
		let unit_cross = cross.x(1 / modulus_cross)
		
		let x = unit_cross.e(0)
		let y = unit_cross.e(1)
		let z = unit_cross.e(2)
		
		let sin_theta = Math.sqrt(1 - Math.pow(cos_theta, 2))
		
		let c = cos_theta
		let s = sin_theta
		let C = 1 - cos_theta
		
		let rot_mat = $M([
			[ x * x * C + c,      x * y * C - z * s,  x * z * C + y * s ],
            [ y * x * C + z * s,  y * y * C + c,      y * z * C - x * s ],
            [ z * x * C - y * s,  z * y * C + x * s,  z * z * C + c  	]
		])
		
		let atoms1 = molecule1.atoms
		
		atoms1.forEach((atom) => {
			let v = $V([atom.x, atom.y, atom.z])
			
			let v1 = rot_mat.x(v)
			
			console.log(v1)
			
			atom.x = v1.elements[0]
			atom.y = v1.elements[1]
			atom.z = v1.elements[2]
		})
	}
}

module.exports = guess_regression_planes