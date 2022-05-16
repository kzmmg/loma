import visualizer from './visualizer.js'

const INITIAL_PDB_ID = '6a5j'

function fetch_pdb(pdb_id1, pdb_id2) {
	
	window.fetch('./doobie.pdb')
		.then(response => response.text())
		.then((pdb1) => {
			
			window.fetch('./doobie2.pdb')
				.then(response => response.text())
				.then((pdb2) => {
					window.document.body.innerHtml = ''
					
					visualizer(window.document.body, pdb1, pdb2, {
						radius: slider.value,
						bonds: Boolean(check.checked),
						light: light_slider.value,
						zoom: zoom_slider.value,
						ambient: ambient_slider.value,
						bond_top_radius: bond_top_slider.value,
						bond_bottom_radius: bond_bottom_slider.value,
						fov: fov_slider.value,
						bb: Boolean(bb_check.checked),
					})
				})
				.catch(console.error.bind(console))
		})
		.catch(console.error.bind(console))
}

// create pdbid input
const input = window.document.createElement('input')

input.value = INITIAL_PDB_ID
input.title = "pdb id"

input.addEventListener('keydown', (event) => {
  if (event.which === 13) {
    fetch_pdb(event.target.value.toUpperCase(), input2.value)
  }
})

window.document.body.append(input)

// create pdbid2 input
const input2 = window.document.createElement('input')

input2.value = INITIAL_PDB_ID
input2.title = "pdb2 id"

input2.addEventListener('keydown', (event) => {
  if (event.which === 13) {
    fetch_pdb(input.value, event.target.value.toUpperCase())
  }
})

window.document.body.append(input2)

// create radius slider
const slider = window.document.createElement('input')

slider.type = 'range'
slider.title = "atom radius"

slider.addEventListener('change', (event) => {
  fetch_pdb(input.value, input2.value)
})

window.document.body.append(slider)

// create bonds checkbox
const check = window.document.createElement('input')

check.type = 'checkbox'
check.title = "draw bonds"

check.addEventListener('change', (event) => {
  fetch_pdb(input.value, input2.value)
})

window.document.body.append(check)

// create light slider
const light_slider = window.document.createElement('input')

light_slider.type = 'range'
light_slider.value = 0
light_slider.title = "background"

light_slider.addEventListener('change', (event) => {
  fetch_pdb(input.value, input2.value)
})

window.document.body.append(light_slider)

// create ambient slider
const ambient_slider = window.document.createElement('input')

ambient_slider.type = 'range'
ambient_slider.value = 0
ambient_slider.title = "ambient"

ambient_slider.addEventListener('change', (event) => {
  fetch_pdb(input.value, input2.value)
})

window.document.body.append(ambient_slider)

// create zoom slider
const zoom_slider = window.document.createElement('input')

zoom_slider.type = 'range'
zoom_slider.value = 10
zoom_slider.title = "zoom"

zoom_slider.addEventListener('change', (event) => {
  fetch_pdb(input.value, input2.value)
})

window.document.body.append(zoom_slider)


// create bond top radius slider
const bond_top_slider = window.document.createElement('input')

bond_top_slider.type = 'range'
bond_top_slider.value = 10
bond_top_slider.title = "bond top radius"

bond_top_slider.addEventListener('change', (event) => {
  fetch_pdb(input.value, input2.value)
})

window.document.body.append(bond_top_slider)

// create bond bottom radius slider
const bond_bottom_slider = window.document.createElement('input')

bond_bottom_slider.type = 'range'
bond_bottom_slider.value = 10
bond_bottom_slider.title = "bond top radius"

bond_bottom_slider.addEventListener('change', (event) => {
  fetch_pdb(input.value, input2.value)
})

window.document.body.append(bond_bottom_slider)

// create fov slider
const fov_slider = window.document.createElement('input')

fov_slider.type = 'range'
fov_slider.value = 55
fov_slider.title = "field of view grad"
fov_slider.min = 0
fov_slider.max = 180

fov_slider.addEventListener('change', (event) => {
  fetch_pdb(input.value, input2.value)
})

window.document.body.append(fov_slider)

// create bonds checkbox
const bb_check = window.document.createElement('input')

bb_check.type = 'checkbox'
bb_check.title = "draw bounding boxes"

bb_check.addEventListener('change', (event) => {
  fetch_pdb(input.value, input2.value)
})

window.document.body.append(bb_check)

fetch_pdb(INITIAL_PDB_ID, INITIAL_PDB_ID)