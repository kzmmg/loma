const assert = require('assert')
const { readFileSync } = require('fs');
const { pdb_parser, parse_atom, parse_seq_res, parse_charge } = require('./pdb_parser')

let pdb_3aid = readFileSync('./pdb_parser_test.fixture', 'utf8')

let parsed_data = pdb_parser(pdb_3aid)

let atoms = parsed_data.atoms
let first_atom = atoms[0]

//-----------------------------------------------------------------------------
// atoms check
assert(atoms.length === 1846)

// atom check
assert(first_atom.serial === 1) 
assert(first_atom.name === 'N') 
assert(first_atom.alt_loc === '') 
assert(first_atom.res_name === 'PRO') 
assert(first_atom.chain_id === 'A') 
assert(first_atom.res_seq === 1) 
assert(first_atom.i_code === '') 
assert(first_atom.x === -2.555) 
assert(first_atom.y === 9.253) 
assert(first_atom.z === 34.411) 
assert(first_atom.occupancy === 1.0) 
assert(first_atom.temp_factor === 30.6) 
assert(first_atom.element === 'N') 
assert(first_atom.charge === 0) 

//-----------------------------------------------------------------------------

let seq_res = parsed_data.seq_res
let first_seq_res  = seq_res[0]
let second_seq_res = seq_res[1]
let eighth_seq_res = seq_res[7]
let ninth_seq_res  = seq_res[9]

// there are 16 seq_res records in 3AID
assert(seq_res.length === 16)


assert(first_seq_res.ser_num === 1)
assert(first_seq_res.chain_id === 'A')
assert(first_seq_res.num_res === 99)

// PRO GLN ILE THR LEU TRP LYS ARG PRO LEU VAL THR ILE
assert(first_seq_res.res_names.length === 13)
assert(first_seq_res.res_names[0] === 'PRO')
assert(first_seq_res.res_names[1] === 'GLN')
assert(first_seq_res.res_names[2] === 'ILE')
assert(first_seq_res.res_names[3] === 'THR')
assert(first_seq_res.res_names[4] === 'LEU')
assert(first_seq_res.res_names[5] === 'TRP')
assert(first_seq_res.res_names[6] === 'LYS')
assert(first_seq_res.res_names[7] === 'ARG')
assert(first_seq_res.res_names[8] === 'PRO')
assert(first_seq_res.res_names[9] === 'LEU')
assert(first_seq_res.res_names[10] === 'VAL')
assert(first_seq_res.res_names[11] === 'THR')
assert(first_seq_res.res_names[12] === 'ILE')

assert(second_seq_res.ser_num === 2)
assert(second_seq_res.chain_id === 'A')
assert(second_seq_res.num_res === 99)

//ARG ILE GLY GLY GLN LEU LYS GLU ALA LEU LEU ASP THR
assert(second_seq_res.res_names.length === 13)
assert(second_seq_res.res_names[0] === 'ARG')
assert(second_seq_res.res_names[1] === 'ILE')
assert(second_seq_res.res_names[2] === 'GLY')
assert(second_seq_res.res_names[3] === 'GLY')
assert(second_seq_res.res_names[4] === 'GLN')
assert(second_seq_res.res_names[5] === 'LEU')
assert(second_seq_res.res_names[6] === 'LYS')
assert(second_seq_res.res_names[7] === 'GLU')
assert(second_seq_res.res_names[8] === 'ALA')
assert(second_seq_res.res_names[9] === 'LEU')
assert(second_seq_res.res_names[10] === 'LEU')
assert(second_seq_res.res_names[11] === 'ASP')
assert(second_seq_res.res_names[12] === 'THR')

assert(eighth_seq_res.ser_num === 8)
assert(eighth_seq_res.chain_id === 'A')
assert(eighth_seq_res.num_res === 99)

//GLN ILE GLY CYS THR LEU ASN PHE
assert(eighth_seq_res.res_names.length === 8)
assert(eighth_seq_res.res_names[0] === 'GLN')
assert(eighth_seq_res.res_names[1] === 'ILE')
assert(eighth_seq_res.res_names[2] === 'GLY')
assert(eighth_seq_res.res_names[3] === 'CYS')
assert(eighth_seq_res.res_names[4] === 'THR')
assert(eighth_seq_res.res_names[5] === 'LEU')
assert(eighth_seq_res.res_names[6] === 'ASN')
assert(eighth_seq_res.res_names[7] === 'PHE')

assert(ninth_seq_res.ser_num === 9)
assert(ninth_seq_res.chain_id === 'B')
assert(ninth_seq_res.num_res === 99)

// PRO GLN ILE THR LEU TRP LYS ARG PRO LEU VAL THR ILE
assert(second_seq_res.res_names.length === 13)
assert(second_seq_res.res_names[0] === 'PRO')
assert(second_seq_res.res_names[1] === 'GLN')
assert(second_seq_res.res_names[2] === 'ILE')
assert(second_seq_res.res_names[3] === 'THR')
assert(second_seq_res.res_names[4] === 'LEU')
assert(second_seq_res.res_names[5] === 'TRP')
assert(second_seq_res.res_names[6] === 'LYS')
assert(second_seq_res.res_names[7] === 'ARG')
assert(second_seq_res.res_names[8] === 'PRO')
assert(second_seq_res.res_names[9] === 'LEU')
assert(second_seq_res.res_names[10] === 'VAL')
assert(second_seq_res.res_names[11] === 'THR')
assert(second_seq_res.res_names[12] === 'ILE')

//-----------------------------------------------------------------------------

let residues = parsed_data.residues
let first_residue = residues[0]
let hfirst_residue = residues[100]

assert(residues.length === 198)
assert(first_residue.id === 1)
assert(first_residue.ser_num === 1)
assert(first_residue.chain_id === 'A')
assert(first_residue.res_Name === 'PRO')
assert(first_residue.atoms)
assert(first_residue.atoms.length === 9) // proline has 9
assert(first_residue.atoms[0].res_seq === 1)
assert(first_residue.atoms[0].chain_id === 'A')
assert(first_residue.atoms[0].res_name === 'PRO')
assert(first_residue.atoms[0].x === -2.555)
assert(first_residue.atoms[0].y === 9.253)
assert(first_residue.atoms[0].z === 34.411)

assert(hfirst_residue.id === 101)
assert(hfirst_residue.ser_num === 1)
assert(hfirst_residue.chain_id === 'B')
assert(hfirst_residue.res_Name === 'GLN')
assert(hfirst_residue.atoms)
assert(hfirst_residue.atoms.length === 12) // glutanine has 12
assert(hfirst_residue.atoms[0].res_seq === 1)
assert(hfirst_residue.atoms[0].chain_id === 'B')
assert(hfirst_residue.atoms[0].res_name === 'GLN')

// ATOM 934 N GLN B 2 10.289 16.963 27.520 1.00 25.28 N 
assert(hfirst_residue.atoms[0].x === 10.289)
assert(hfirst_residue.atoms[0].y === 16.963)
assert(hfirst_residue.atoms[0].z === 27.520)
  

//-----------------------------------------------------------------------------

let chains = parsed_data.chains
let chain_a = chains.get('A')
let chain_b = chains.get('B')

assert(chains.size === 2)

assert(chain_a.id === 0)
assert(chain_a.chain_id === 'A')
assert(chain_a.residues)
assert(chain_a.residues.length === 99)
assert(chain_a.residues[0].id)

assert(chain_b.id === 1)
assert(chain_b.chain_id === 'B')
assert(chain_b.residues)
assert(chain_b.residues.length === 99)
assert(chain_b.residues[0].id)

//-----------------------------------------------------------------------------

let residues_simplified = parsed_data.residues_simplified
let residues_one_letter_line = parsed_data.residues_one_letter_line
let residues_three_letter_line = parsed_data.residues_three_letter_line

assert(residues_simplified.length === 198)
assert(residues_simplified[0] === 'PRO')
assert(residues_simplified[100] === 'GLN')

// PRO GLN ILE THR LEU
assert(residues_one_letter_line.substr(0,5) === 'PQITL')
assert(residues_three_letter_line.substr(0,5) === 'ProGlnIleThrLeu')

//------------------------------------------------------------------------------

let line = 'ATOM    930  CG  PRO B   1      14.194  16.250  25.886  1.00 37.01           C  '
let parsed_atom = parse_atom(line)

assert(first_atom.serial === 930) 
assert(first_atom.name === 'CG') 
assert(first_atom.alt_loc === '') 
assert(first_atom.res_name === 'PRO') 
assert(first_atom.chain_id === 'B') 
assert(first_atom.res_seq === 1) 
assert(first_atom.i_code === '') 
assert(first_atom.x === 14.194) 
assert(first_atom.y === 16.250) 
assert(first_atom.z === 25.886) 
assert(first_atom.occupancy === 1.0) 
assert(first_atom.temp_factor === 37.01) 
assert(first_atom.element === 'C') 
assert(first_atom.charge === 0) 

line = 'ATOM    930  CG  PRO B   1      14.194  16.250  25.886  1.00 37.01           C2+'
parsed_atom = parse_atom(line)

assert(first_atom.serial === 930) 
assert(first_atom.name === 'CG') 
assert(first_atom.alt_loc === '') 
assert(first_atom.res_name === 'PRO') 
assert(first_atom.chain_id === 'B') 
assert(first_atom.res_seq === 1) 
assert(first_atom.i_code === '') 
assert(first_atom.x === 14.194) 
assert(first_atom.y === 16.250) 
assert(first_atom.z === 25.886) 
assert(first_atom.occupancy === 1.0) 
assert(first_atom.temp_factor === 37.01) 
assert(first_atom.element === 'C') 
assert(first_atom.charge === 2) 

line = 'ATOM    930  CG  PRO B   1      14.194  16.250  25.886  1.00 37.01           C2-'
parsed_atom = parse_atom(line)

assert(first_atom.serial === 930) 
assert(first_atom.name === 'CG') 
assert(first_atom.alt_loc === '') 
assert(first_atom.res_name === 'PRO') 
assert(first_atom.chain_id === 'B') 
assert(first_atom.res_seq === 1) 
assert(first_atom.i_code === '') 
assert(first_atom.x === 14.194) 
assert(first_atom.y === 16.250) 
assert(first_atom.z === 25.886) 
assert(first_atom.occupancy === 1.0) 
assert(first_atom.temp_factor === 37.01) 
assert(first_atom.element === 'C') 
assert(first_atom.charge === -2) 

//------------------------------------------------------------------------------------------

let charge = '  '
let parsed_charge = parse_charge(charge)

assert(parsed_charge === 0)

charge = '8+'
parsed_charge = parse_charge(charge)

assert(parsed_charge === 8)
charge = '3-'
parsed_charge = parse_charge(charge)

assert(parsed_charge === -3)

//-------------------------------------------------------------------------------------------

// SEQRES   5 A   99  PHE ILE LYS VAL ARG GLN TYR ASP GLN ILE PRO VAL GLU
let seq_line = 'SEQRES   5 A   99  PHE ILE LYS VAL ARG GLN TYR ASP GLN ILE PRO VAL GLU'
let parsed_seq_res = parse_seq_res(seq_line)

assert(parsed_seq_res.ser_num === 5)
assert(parsed_seq_res.chain_id === 'A')
assert(parsed_seq_res.num_res === 99)

assert(parsed_seq_res.res_names.length === 13)
assert(parsed_seq_res.res_names[0] === 'PHE')
assert(parsed_seq_res.res_names[1] === 'ILE')
assert(parsed_seq_res.res_names[2] === 'LYS')
assert(parsed_seq_res.res_names[3] === 'VAL')
assert(parsed_seq_res.res_names[4] === 'ARG')
assert(parsed_seq_res.res_names[5] === 'GLN')
assert(parsed_seq_res.res_names[6] === 'TYR')
assert(parsed_seq_res.res_names[7] === 'ASP')
assert(parsed_seq_res.res_names[8] === 'GLN')
assert(parsed_seq_res.res_names[9] === 'ILE')
assert(parsed_seq_res.res_names[10] === 'PRO')
assert(parsed_seq_res.res_names[11] === 'VAL')
assert(parsed_seq_res.res_names[12] === 'GLU')
