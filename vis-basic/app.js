import visualizer from './visualizer.js'

const INITIAL_PDB_ID = '6a5j'

function fetch_pdb(pdb_id) {
	
	window.fetch(`./doobie.pdb`)
		.then(response => response.text())
		.then((pdb) => {
			window.document.body.innerHtml = ''
			
			visualizer(window.document.body, pdb, slider.value)
		})
		.catch(console.error.bind(console))
}

// create pdbid input
const input = window.document.createElement('input')

input.value = INITIAL_PDB_ID

input.addEventListener('keydown', (event) => {
  if (event.which === 13) {
    fetch_pdb(event.target.value.toUpperCase())
  }
})

window.document.body.append(input)

// create slider
const slider = window.document.createElement('input')

slider.type = 'range'

slider.addEventListener('change', (event) => {
  fetch_pdb(input.value)
})

window.document.body.append(slider)


fetch_pdb(INITIAL_PDB_ID)