const guess_generic = require("./guess_generic.js")
const THREE = require("./three.js")

require("./geometry.js")(THREE)

// bounding box-based "strategies"

class guess_bounding_box_generic extends guess_generic {
	guess(molecule1, molecule2) {
		let atoms1 = molecule1.atoms
		let atoms2 = molecule2.atoms
		
		const geometry1 = new THREE.Geometry()
		const geometry2 = new THREE.Geometry()
		
		atoms1.forEach((atom) => {
			const vertex = new THREE.Vector3(atom.x, atom.y, atom.z)
			geometry1.vertices.push(vertex)
		});

		geometry1.computeBoundingBox()
		let bounding_box1 = geometry1.boundingBox
		
		atoms2.forEach((atom) => {
			const vertex = new THREE.Vector3(atom.x, atom.y, atom.z)
			geometry2.vertices.push(vertex)
		});

		geometry2.computeBoundingBox()
		let bounding_box2 = geometry2.boundingBox
		
		this.guess_bb(molecule1, molecule2, bounding_box1, bounding_box2, geometry1, geometry2)
	}
	
	guess_bb(molecule1, molecule2, bb1, bb2) {
		throw 0 // implement in subs
	}
}

module.exports = guess_bounding_box_generic