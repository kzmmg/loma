import * as THREE from './three.js'
import pdb_parser from './pdb_parser.js'

window.THREE = THREE

import OrbitControls from './OrbitControls.js'
import Geometry from './Geometry.js'

const FOV = 55

const REPRESENTATIONS = { PARTICLE: 'particle', SPHERE: 'sphere' }

let camera
let scene
let renderer
let camera_controls

let options

const clock = new THREE.Clock()

const compute_midpoint = (bounding_box) => {
	return new THREE.Vector3(
		bounding_box.min.x + ((bounding_box.max.x - bounding_box.min.x) / 2),
		bounding_box.min.y + ((bounding_box.max.y - bounding_box.min.y) / 2),
		bounding_box.min.z + ((bounding_box.max.z - bounding_box.min.z) / 2),
	)
}

const slider_factor = 1 / 50

function fill_scene(pdb) {
	scene = new THREE.Scene()

	let atoms = pdb_parser(pdb).atoms

	const geometry = new Geometry()
	
	atoms.forEach((atom) => {
		const vertex = new THREE.Vector3(atom.x, atom.y, atom.z)
		geometry.vertices.push(vertex)
	});

	// Calculate midpoint
	geometry.computeBoundingBox()
	let bounding_box = geometry.boundingBox
	let midpoint = compute_midpoint(bounding_box)

	// calculate the bounding sphere radius
	const bounding_sphere_radius = atoms.reduce((greatest_distance, atom) => {
		const atom_position = new THREE.Vector3(atom.x, atom.y, atom.z)
		const distance = midpoint.distanceTo(atom_position)
		if (distance > greatest_distance) {
		  return distance
		}
		return greatest_distance
	}, 0)

	// translate midpoint to origin and update midpoint and bounding_box
	geometry.translate(
		0 - midpoint.x,
		0 - midpoint.y,
		0 - midpoint.z
	)
	
	geometry.computeBoundingBox()
	bounding_box = geometry.boundingBox
	midpoint = compute_midpoint(bounding_box)

	let sphere_material_h = new THREE.MeshLambertMaterial({ color: 0xFFFFFF })
	let sphere_material_c = new THREE.MeshLambertMaterial({ color: 0xC8C8C8 })
	let sphere_material_n = new THREE.MeshLambertMaterial({ color: 0x8F8FFF })
	let sphere_material_o = new THREE.MeshLambertMaterial({ color: 0xff0000 })
	let sphere_material_s = new THREE.MeshLambertMaterial({ color: 0x00ffff })
	let sphere_material_d = new THREE.MeshLambertMaterial({ color: 0x573a12 })
	let sphere_geometry = new THREE.SphereGeometry(options.radius * slider_factor, 16, 16)
	
	// drawing atoms
	let prev_pos = void 0
	geometry.vertices.forEach((vector3, i) => {
		let material = atoms[i].element
		
		switch(material) {
			case 'H':
				material = sphere_material_h
				break
			case 'C':
				material = sphere_material_c
				break
			case 'N':
				material = sphere_material_n
				break
			case 'O':
				material = sphere_material_o
				break
			case 'S':
				material = sphere_material_s
				break
			default:
				material = sphere_material_d
				break
		}
		
		const sphere = new THREE.Mesh(sphere_geometry, material)
		sphere.position.set(vector3.x, vector3.y, vector3.z)
		scene.add(sphere)
		
		if(options.bonds) {
			if(prev_pos) {
				console.log("drawing bond")
				let now_pos = vector3
				let distance = prev_pos.distanceTo(now_pos)
				
				let cylind_geometry = new THREE.CylinderGeometry(
														options.bond_top_radius * slider_factor / 2, 
														options.bond_bottom_radius * slider_factor / 2, 
														distance) 
				
				
				const { x:ax, y:ay, z:az } = now_pos
				const { x:bx, y:by, z:bz } = prev_pos
				const stick_axis = new THREE.Vector3(bx - ax, by - ay, bz - az).normalize()

				//console.log(distance, ax, bx, ay, by, az, bz)
				// Use quaternion to rotate cylinder from default to target orientation
				const quaternion = new THREE.Quaternion()
				const cylinder_up_axis = new THREE.Vector3( 0, 1, 0 )
				quaternion.setFromUnitVectors(cylinder_up_axis, stick_axis)
				cylind_geometry.applyQuaternion(quaternion)

				// Translate oriented stick to location between endpoints
				cylind_geometry.translate((bx+ax)/2, (by+ay)/2, (bz+az)/2)
				
				
				const cyl_mesh = new THREE.Mesh(cylind_geometry, sphere_material_h)
				scene.add(cyl_mesh)
			}
			
			prev_pos = vector3
		}
	})

	let cam_position = new THREE.Vector3(0, 0, bounding_sphere_radius * 1.5)
	camera.position.set(cam_position.x, cam_position.y, cam_position.z)

	const ambient_light = new THREE.AmbientLight(compute_ambient_light())
	scene.add(ambient_light)
	
	const light = new THREE.DirectionalLight(0xFFFFFF, 0.6)
	light.position.set(cam_position.x, cam_position.y, cam_position.z)
	scene.add(light)
	
	const sun = new THREE.HemisphereLight(0xFFFFFF, 0.2)
	scene.add(sun)
	const sun2 = new THREE.DirectionalLight(0x222222, 0.3)
	light.position.set(0, 1, 0)
	scene.add(sun2)
	const sun3 = new THREE.DirectionalLight(0x333333, 0.4)
	light.position.set(0, -1, 0)
	scene.add(sun3)
	const sun4 = new THREE.DirectionalLight(0x353131, 0.2)
	light.position.set(1, 0, 0)
	scene.add(sun4)
	const sun5 = new THREE.DirectionalLight(0x454545, 0.3)
	light.position.set(-1, 0, 0)
	scene.add(sun5)
}

function compute_color(val) {
	let percents = slider_factor * val / 2
	
	// console.log(percents, "percents")
	
	// OxFF = 255
	let decimal_background_r = Math.round(255 * percents)
	let decimal_background_g = Math.round(255 * percents)// * (1 + Math.random()) % 255
	let decimal_background_b = Math.round(255 * percents)// * (1 + Math.random()) % 255
	
	let octal_background_r = Number(decimal_background_r).toString(16)
	let octal_background_g = Number(decimal_background_g).toString(16)
	let octal_background_b = Number(decimal_background_b).toString(16)
	
	if(octal_background_r.length === 1) octal_background_r = "0" + octal_background_r
	if(octal_background_r.length > 2) octal_background_r = octal_background_r.substr(0, 2)
	if(octal_background_g.length === 1) octal_background_g = "0" + octal_background_g
	if(octal_background_g.length > 2) octal_background_g = octal_background_g.substr(0, 2)
	if(octal_background_b.length === 1) octal_background_b = "0" + octal_background_b
	if(octal_background_b.length > 2) octal_background_b = octal_background_b.substr(0, 2)
	
	return Number("0x" + [octal_background_r, octal_background_g, octal_background_b].join(""))
}

function compute_background_color() {
	return compute_color(options.light)
}

function compute_ambient_light() {
	return compute_color(options.ambient)
}

function init() {
	const canvas_width = window.innerWidth
	const canvas_height = window.innerHeight
	const canvas_ratio = canvas_width / canvas_height

	// renderer
	renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false })
	
	renderer.setSize(canvas_width, canvas_height)
	renderer.setClearColor(compute_background_color())

	// camera
	camera = new THREE.PerspectiveCamera(FOV, canvas_ratio, 2, 8000)
	camera.position.set(10, 5, 15)
	camera.zoom = +options.zoom * slider_factor
	
	camera.updateProjectionMatrix()

	// controls
	camera_controls = new OrbitControls(camera, renderer.domElement)
	camera_controls.target.set(0, 0, 0)
	camera_controls.enablePan = false
}

function add_to_dom(element) {
	const canvas = element.getElementsByTagName('canvas')
	if (canvas.length > 0) {
		element.removeChild(canvas[0]);
	}
	
	element.appendChild(renderer.domElement);
}

function render() {
	const delta = clock.getDelta()
	camera_controls.update(delta)
	renderer.render(scene, camera)
}

function animate() {
	window.requestAnimationFrame(animate)
	render()
}

export default function visualizer(element, pdb , opts) {
	try {
		console.log("redrawing with options", opts)
		
		options = opts
		
		init()
		fill_scene(pdb)
		add_to_dom(element)
		animate()
	} catch (e) {
		let report = 'err!'
		element.append(`${report}${e}`)
		console.error(e)
	}
}