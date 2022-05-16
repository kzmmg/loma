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

const clock = new THREE.Clock()

const compute_midpoint = (bounding_box) => {
	return new THREE.Vector3(
		bounding_box.min.x + ((bounding_box.max.x - bounding_box.min.x) / 2),
		bounding_box.min.y + ((bounding_box.max.y - bounding_box.min.y) / 2),
		bounding_box.min.z + ((bounding_box.max.z - bounding_box.min.z) / 2),
	)
}

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

	let sphere_material = new THREE.MeshLambertMaterial({ color: 0xffffff })
	let sphere_geometry = new THREE.SphereGeometry(1, 32, 32)
	
	// drawing atoms
	geometry.vertices.forEach((vector3) => {
		const sphere = new THREE.Mesh(sphere_geometry, sphere_material)
		sphere.position.set(vector3.x, vector3.y, vector3.z)
		scene.add(sphere)
	})

	let cam_position = new THREE.Vector3(0, 0, bounding_sphere_radius * 1.5)
	camera.position.set(cam_position.x, cam_position.y, cam_position.z)

	//const ambientLight = new THREE.AmbientLight(0x222222)
	//scene.add(ambientLight)
	
	const light = new THREE.DirectionalLight(0xFFFFFF, 1.0)
	light.position.set(cam_position.x, cam_position.y, cam_position.z)
	scene.add(light)
}

function init() {
	const canvas_width = window.innerWidth
	const canvas_height = window.innerHeight
	const canvas_ratio = canvas_width / canvas_height

	// renderer
	renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false })
	
	renderer.setSize(canvas_width, canvas_height)
	renderer.setClearColor(0x000000)

	// camera
	camera = new THREE.PerspectiveCamera(FOV, canvas_ratio, 2, 100)
	camera.position.set(10, 5, 15)

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

export default function tiny_molecule(element, pdb) {
	try {
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