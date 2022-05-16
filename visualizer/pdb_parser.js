import letter_stuff from './letter_stuff.js'

const ATOM_NAME = 'ATOM  ';
const RESIDUE_NAME = 'SEQRES';

const parse_charge = (charge) => {
	if(charge === '  ') return 0
	
	let abs = parseInt(charge[0])
	let sign = charge[1] === '+' ? 1 : -1
	
	return abs * sign
}

// http://www.wwpdb.org/documentation/file-format-content/format33/sect9.html#ATOM
const parse_atom = (pdb_line) => {
	return {
        serial: parseInt(pdb_line.substring(6, 11)),
        name: pdb_line.substring(12, 16).trim(),
        alt_loc: pdb_line.substring(16, 17).trim(),
        res_name: pdb_line.substring(17, 20).trim(),
        chain_id: pdb_line.substring(21, 22).trim(),
        res_seq: parseInt(pdb_line.substring(22, 26)),
        i_code: pdb_line.substring(26, 27).trim(),
        x: parseFloat(pdb_line.substring(30, 38)),
        y: parseFloat(pdb_line.substring(38, 46)),
        z: parseFloat(pdb_line.substring(46, 54)),
        occupancy: parseFloat(pdb_line.substring(54, 60)),
        temp_factor: parseFloat(pdb_line.substring(60, 66)),
        element: pdb_line.substring(76, 78).trim(),
        charge: parse_charge(pdb_line.substring(78, 80).trim()),
      }
}

// http://www.wwpdb.org/documentation/file-format-content/format33/sect3.html#SEQRES
const parse_seq_res = (pdb_line) => {
	// a bulk of residues described in ONE line
	const seq_res_entry = {
		ser_num: parseInt(pdb_line.substring(7, 10)),
		chain_id: pdb_line.substring(11, 12).trim(),
		num_res: parseInt(pdb_line.substring(13, 17)),
		res_names: pdb_line.substring(19, 70).trim().split(' ')
	}
	
	return seq_res_entry
}

const pdb_parser = (pdb) => {
	const pdb_lines = pdb.split('\n')

	const atoms = []
	
	const seq_res = [] // raw SEQRES entry data
	let residues = [] // individual residue data parsed from SEQRES
	const chains = new Map() // individual rchaindata parsed from SEQRES

	// iterate each line looking for atoms
	for(let i = 0; i < pdb_lines.length; i++) {
		let pdb_line = pdb_lines[i]
		let line_type = pdb_line.substr(0, 6)

		if (line_type === ATOM_NAME) {
			
			atoms.push(parse_atom(pdb_line))

		} else if (line_type === RESIDUE_NAME) {
					  
			let seq_res_entry = parse_seq_res(pdb_line)

			// adding block by block
			seq_res.push(seq_res_entry)

			// bulking all residues into one array sequentially
			residues = residues.concat(seq_res_entry.res_names.map(res_name => ({
				id: residues.length,
				ser_num: seq_res_entry.ser_num,
				chain_id: seq_res_entry.chain_id,
				res_name,
			})))

			// adding a chain if it's not already added (deduced from seq_res)
			if (!chains.get(seq_res_entry.chain_id)) {
				chains.set(seq_res_entry.chain_id, {
					id: chains.size,
					chain_id: seq_res_entry.chain_id
				})
			}
		}
	}  

	chains.forEach((chain) => {
	chain.residues = residues.filter((residue) =>
	  residue.chain_id === chain.chain_id,
	)
	})

	// Add atoms to residues
	residues.forEach((residue) => {
		residue.atoms = atoms.filter((atom) =>
		  atom.chain_id === residue.chain_id && atom.res_seq === residue.ser_num,
		)
	})
	
	let residues_simplified = residues.map((residue) => residue.res_name)
	let residues_one_letter_line = letter_stuff.three_letter_array_to_one_letter_line(residues_simplified)
	let residues_three_letter_line = letter_stuff.three_letter_array_to_three_letter_line(residues_simplified)
	
	console.log("protein contains", atoms.length, "atoms")

	return {
		// Raw data from pdb
		atoms,
		seq_res,

		// Derived
		residues, // Array of residue objects
		chains, // Map of chain objects keyed on chain_id
		
		residues_simplified,
		residues_one_letter_line,
		residues_three_letter_line
	}
}
 
export default pdb_parser