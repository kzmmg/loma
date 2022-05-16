const assert = require("assert")
const { readFileSync } = require('fs')

const mmcif_parser = require('./mmcif_parser.js');

let mmcif = readFileSync('./mmcif_parser_test.fixture', 'utf8')

const { atoms } = mmcif_parser(mmcif)
const first_atom = atoms[0]

assert(atoms.length === 1846)

assert(first_atom.id 					=== 1)
assert(first_atom.type_symbol 			=== 'N')
assert(first_atom.label_atom_id 		=== 'N')
assert(first_atom.label_alt_id 			=== '.')
assert(first_atom.label_comp_id 		=== 'PRO')
assert(first_atom.label_asym_id 		=== 'A')
assert(first_atom.label_entity_id 		=== 1)
assert(first_atom.label_seq_id 			=== 1)
assert(first_atom.pdbx_PDB_ins_code 	=== '?')
assert(first_atom.Cartn_x 				=== -2.555)
assert(first_atom.Cartn_y 				=== 9.253)
assert(first_atom.Cartn_z 				=== 34.411)
assert(first_atom.x 					=== -2.555)
assert(first_atom.y 					=== 9.253)
assert(first_atom.z 					=== 34.411)
assert(first_atom.occupancy 			=== 1.0)
assert(first_atom.B_iso_or_equiv 		=== 30.6)
assert(first_atom.pdbx_formal_charge 	=== '?')
assert(first_atom.auth_seq_id 			=== 1)
assert(first_atom.auth_comp_id 			=== 'PRO')
assert(first_atom.auth_asym_id 			=== 'A')
assert(first_atom.auth_atom_id 			=== 'N')
assert(first_atom.pdbx_PDB_model_num 	=== 1)

// assert(false)