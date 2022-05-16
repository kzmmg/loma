const weights = {
	C: 12
	O: 16
	N: 15
	P: 32
	S: 36
}

class cartesian_atom {
	constructor(type, x, y, z) {
		this.type = t
		this.x = x
		this.y = y
		this.z = z
		this.w = get_w()
	}
	
	get_w() {
		return weights[this.type]
	}
	
	translate(dx, dy, dz) {
		this.x += dx
		this.y += dy
		this.z += dz
	}
	
	
	revolve(dx, dy, dz) {
		// z
		
		let x1, y1, z1
		
		let [x,y,z] = [this.x, this.y, this.z]
		
		x1 = x * Math.cos(dz) - y * Math.sin(dz)
		y1 = x * Math.sin(dz) - y * Math.cos(dz)
		z1 = z
		
		// y
		
		x1 = x1 * Math.cos(dy) + z1 * Math.sin(dy)
		y1 = y1
		z1 = -x1 * Math.sin(dy) + z * Math.cos(dy)
		
		// x
		
		x1 = x1
		y1 = y1 * Math.cos(dx) - z1 * Math.sin(dx)
		z1 = y1 * Math.sin(dx) + z1 * Math.sin(dx)
		
		this.x = x1
		this.y = y1
		this.z = z1
		
		x1 = 
	}
}