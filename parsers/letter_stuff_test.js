const assert = require('assert')

const {
	three_letter_array_to_one_letter_line,
	one_letter_array_to_three_letter_line,
	one_letter_array_to_one_letter_line,
	three_letter_array_to_three_letter_line,
	
	one_to_three,
	three_to_one,
	
	fastify_line,
	defastify_line
} = require('./letter_stuff.js')


let three_letter_array = ['ALA',
	'CYS',
	'ASP',
	'GLU',
	'PHE',
	'GLY',
	'HIS',
	'ILE',
	'LYS',
	'LEU',
	'MET',
	'ASN',
	'PRO',
	'GLN',
	'ARG',
	'SER',
	'THR',
	'VAL',
	'TRP',
	'TYR'
	]
let one_letter_line = three_letter_array_to_one_letter_line(three_letter_array)

assert(one_letter_line === 'ACDEFGHIKLMNPQRSTVWY')

let three_letter_line = three_letter_array_to_three_letter_line(three_letter_array)

assert(three_letter_line === 'AlaCysAspGluPheGlyHisIleLysLeuMetAsnProGlnArgSerThrValTrpTyr')

let one_letter_array = ['A',
	'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'K',
    'L',
    'M',
    'N',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'V',
    'W',
    'Y'
	]   
	
one_letter_line = one_letter_array_to_one_letter_line(one_letter_array)

assert(one_letter_line === 'ACDEFGHIKLMNPQRSTVWY')

three_letter_line = one_letter_array_to_three_letter_line(three_letter_array)

assert(three_letter_line === 'AlaCysAspGluPheGlyHisIleLysLeuMetAsnProGlnArgSerThrValTrpTyr')

assert(one_to_three('A') === 'ALA')
assert(one_to_three('C') === 'CYS')
assert(one_to_three('D') === 'ASP')
assert(one_to_three('E') === 'GLU')
assert(one_to_three('F') === 'PHE')
assert(one_to_three('G') === 'GLY')
assert(one_to_three('H') === 'HIS')
assert(one_to_three('I') === 'ILE')
assert(one_to_three('K') === 'LYS')
assert(one_to_three('L') === 'LEU')
assert(one_to_three('M') === 'MET')
assert(one_to_three('N') === 'ASN')
assert(one_to_three('P') === 'PRO')
assert(one_to_three('Q') === 'GLN')
assert(one_to_three('R') === 'ARG')
assert(one_to_three('S') === 'SER')
assert(one_to_three('T') === 'THR')
assert(one_to_three('V') === 'VAL')
assert(one_to_three('W') === 'TRP')
assert(one_to_three('Y') === 'TYR')

assert(three_to_one('ALA') === 'A')
assert(three_to_one('CYS') === 'C')
assert(three_to_one('ASP') === 'D')
assert(three_to_one('GLU') === 'E')
assert(three_to_one('PHE') === 'F')
assert(three_to_one('GLY') === 'G')
assert(three_to_one('HIS') === 'H')
assert(three_to_one('ILE') === 'I')
assert(three_to_one('LYS') === 'K')
assert(three_to_one('LEU') === 'L')
assert(three_to_one('MET') === 'M')
assert(three_to_one('ASN') === 'N')
assert(three_to_one('PRO') === 'P')
assert(three_to_one('GLN') === 'Q')
assert(three_to_one('ARG') === 'R')
assert(three_to_one('SER') === 'S')
assert(three_to_one('THR') === 'T')
assert(three_to_one('VAL') === 'V')
assert(three_to_one('TRP') === 'W')
assert(three_to_one('TYR') === 'Y')

assert(fastify('line') === 'FASTA\nline')

assert(defastify('FASTA\nline') === 'line')
assert(defastify('FASTA\r\nline') === 'line')