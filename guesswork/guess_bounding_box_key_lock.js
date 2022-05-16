const guess_bounding_box_generic = require("./guess_bounding_box_generic.js")

const THREE = require("./three.js")

const HACK = 1000

// bounding box-based "strategies"

class guess_bounding_box_key_lock extends guess_bounding_box_generic {
	
	_compute_midpoint = (bounding_box) => {
		return new THREE.Vector3(
			bounding_box.min.x + ((bounding_box.max.x - bounding_box.min.x) / 2),
			bounding_box.min.y + ((bounding_box.max.y - bounding_box.min.y) / 2),
			bounding_box.min.z + ((bounding_box.max.z - bounding_box.min.z) / 2),
		)
	}
	
	_define_rotation(lock, lock_max, lock_x, lock_y, lock_z,
						key, key_min, key_x, key_y, key_z) {
							
		let rotation1
		let rotation2
		
		if (lock_max === lock_y) { // y
			// no angle to turn to
			if (lock_z > lock_x) {
				rotation1 = [0, 90, 0]
			} else {
				rotation1 = [0, 0, 0]
			}
		} else if (lock_max === lock_x) {
			rotation1 = [0, 0, 90]
			if (lock_y > lock_z) {
				rotation1 = [0, 90, 90]
			} else {
				rotation1 = [0, 0, 90]
			}
		} else if (lock_max === lock_z) {
			rotation1 = [90, 0, 0]
			if (lock_y > lock_x) {
				rotation1 = [90, 90, 0]
			} else {
				rotation1 = [90, 0, 0]
			}
		} else throw 0
		
		if (key_min === key_y) { // y
			// no angle to turn to
			if (key_z > key_x) {
				rotation2 = [0, 0, 0]
			} else {
				rotation2 = [0, 90, 0]
			}
		} else if (key_min === key_x) {
			rotation2 = [0, 0, 90]
			if (key_y > key_z) {
				rotation2 = [0, 90, 90]
			} else {
				rotation2 = [0, 0, 90]
			}
		} else if (key_min === key_z) {
			rotation2 = [90, 0, 0]
			if (key_y > key_x) {
				rotation2 = [90, 0, 0]
			} else {
				rotation2 = [90, 90, 0]
			}
		} else throw 0
		
		return [ rotation1, rotation2 ]
	}
	
	guess_bb(molecule1, molecule2, bb1, bb2, geometry1, geometry2) {
		let len1_1 = bb1.max.x - bb1.min.x
		let len2_1 = bb1.max.y - bb1.min.y
		let len3_1 = bb1.max.z - bb1.min.z
		
		let len1_2 = bb1.max.x - bb2.min.x
		let len2_2 = bb1.max.y - bb2.min.y
		let len3_2 = bb1.max.z - bb2.min.z
		
		// 
		
		let max_len_1 = Math.max(len1_1, len2_1, len3_1)
		let max_len_2 = Math.max(len1_2, len2_2, len3_2)
		
		let min_len_1 = Math.min(len1_1, len2_1, len3_1)
		let min_len_2 = Math.min(len1_2, len2_2, len3_2)
		
		let rotation1 = [0, 0, 0]
		let rotation2 = [0, 0, 0]
		
		if(max_len_1 > max_len_2) { // molecule1 is lock
			let result = this._define_rotation(
							molecule1, 
							max_len_1, 
							len1_1, 
							len2_1, 
							len3_1, 
							molecule2, 
							min_len_2, 
							len1_2, 
							len2_2, 
							len3_2)
							
			rotation1 = result[0]
			rotation2 = result[1]
			
		} else { // molecule2 is lock
			let result = this._define_rotation(
							molecule2, 
							max_len_2, 
							len1_2, 
							len2_2, 
							len3_2, 
							molecule1, 
							min_len_1, 
							len1_1, 
							len2_1, 
							len3_1)
							
			rotation1 = result[1]
			rotation2 = result[0]
		}
		
		let midpoint1 = this._compute_midpoint(bb1)
		let midpoint2 = this._compute_midpoint(bb2)
		
		console.log(midpoint1, midpoint2)
		
		geometry1.translate(-midpoint1.x, -midpoint1.y, -midpoint1.z)
		geometry2.translate(-midpoint2.x, -midpoint2.y, -midpoint2.z) 
		
		geometry1.computeBoundingBox()
		geometry2.computeBoundingBox()
		
		bb1 = geometry1.boundingBox
		bb2 = geometry2.boundingBox
		
		midpoint1 = this._compute_midpoint(bb1)
		midpoint2 = this._compute_midpoint(bb2)
		
		//console.log("---------------------")
		//console.log(midpoint1, midpoint2)
		
		console.log(rotation1, rotation2)
		
		geometry1.rotateX(rotation1[0] * Math.PI / 180)
		geometry1.rotateY(rotation1[1] * Math.PI / 180)
		geometry1.rotateZ(rotation1[2] * Math.PI / 180)
									   
		//console.log(geometry2.vertices)
		geometry2.rotateX(rotation2[0] * Math.PI / 180)
		geometry2.rotateY(rotation2[1] * Math.PI / 180)
		geometry2.rotateZ(rotation2[2] * Math.PI / 180)
		
		// dirty trick everyone hates
		geometry1.translate(-HACK, 0, 0)
		geometry2.translate(HACK, 0, 0)
		
		//console.log(geometry2.vertices)
		geometry1.computeBoundingBox()
		geometry2.computeBoundingBox()
		
		bb1 = geometry1.boundingBox
		bb2 = geometry2.boundingBox
		
		// first, move x.min to x.min
		
		let min_x_1 = bb1.max.x
		let min_x_2 = bb2.min.x
		
		console.log("mins", min_x_1, min_x_2)
		
		let diff_x = -min_x_1 + min_x_2
		
		console.log(diff_x)
		
		let translation = [diff_x, 0, 0]
		
		// second, move y.center to y.center
		let center_y_1 = (bb1.max.y - bb1.min.y) / 2 + bb1.min.y
		let center_y_2 = (bb2.max.y - bb2.min.y) / 2 + bb2.min.y
		
		let diff_y = -center_y_1 + center_y_2
		
		translation = [diff_x, diff_y, 0]
		
		// third, move z.center to z.center
		let center_z_1 = (bb1.max.z - bb1.min.z) / 2 + bb1.min.z
		let center_z_2 = (bb2.max.z - bb2.min.z) / 2 + bb2.min.z
		
		let diff_z = -center_z_1 + center_z_2
		
		translation = [diff_x, diff_y, diff_z]
		
		geometry1.translate(translation[0], translation[1], translation[2])
		
		geometry1.translate(-HACK, 0, 0)
		geometry2.translate(-HACK, 0, 0)
		
		geometry1.vertices.forEach((vector, i) => {
			molecule1.atoms[i].x = vector.x
			molecule1.atoms[i].y = vector.y
			molecule1.atoms[i].z = vector.z
		})
	
		geometry2.vertices.forEach((vector, i) => {
			molecule2.atoms[i].x = vector.x
			molecule2.atoms[i].y = vector.y
			molecule2.atoms[i].z = vector.z
		})
	}
}

module.exports = guess_bounding_box_key_lock