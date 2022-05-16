const mmcif_to_pdb = (mmcif) => {
	let pdb = {}
	
	let atoms = mmcif.atoms
	
	for (let i = 0; i < atoms.length; i++) {
		let atom = atoms[i]
		
		let pdb_atom = {}
		
		pdb_atom.serial 		= atom.id
		pdb_atom.name 			= atom.label_atom_id
        pdb_atom.alt_loc 		= atom.label_alt_id === '.' ? '' : atom.label_alt_id
        pdb_atom.res_name 		= atom.label_comp_id
        pdb_atom.chain_id 		= atom.label_asym_id
        pdb_atom.res_seq 		= atom.auth_seq_id
        pdb_atom.i_code 		= void 0
        pdb_atom.x 				= atom.x
        pdb_atom.y 				= atom.y
        pdb_atom.z 				= atom.z
        pdb_atom.occupancy 		= atom.occupancy
        pdb_atom.temp_factor 	= atom.B_iso_or_equiv
        pdb_atom.element 		= atom.type_symbol
        pdb_atom.charge 		= void 0
	}
}