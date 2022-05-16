const three_to_one_table = {
	'ALA': 'A',
	'CYS': 'C',
	'ASP': 'D',
	'GLU': 'E',
	'PHE': 'F',
	'GLY': 'G',
	'HIS': 'H',
	'ILE': 'I',
	'LYS': 'K',
	'LEU': 'L',
	'MET': 'M',
	'ASN': 'N',
	'PRO': 'P',
	'GLN': 'Q',
	'ARG': 'R',
	'SER': 'S',
	'THR': 'T',
	'VAL': 'V',
	'TRP': 'W',
	'TYR': 'Y'
}

const inverse_three_to_one_table = {
	'A': 'ALA', 
	'C': 'CYS', 
	'D': 'ASP', 
	'E': 'GLU', 
	'F': 'PHE', 
	'G': 'GLY', 
	'H': 'HIS', 
	'I': 'ILE', 
	'K': 'LYS', 
	'L': 'LEU', 
	'M': 'MET', 
	'N': 'ASN', 
	'P': 'PRO', 
	'Q': 'GLN', 
	'R': 'ARG', 
	'S': 'SER', 
	'T': 'THR', 
	'V': 'VAL', 
	'W': 'TRP', 
	'Y': 'TYR'
}

const three_to_one = (three_letter_code) => {
	return three_to_one_table[three_letter_code.toUpperCase()]
}

const one_to_three = (one_letter_code) => {
	return inverse_three_to_one_table[one_letter_code.toUpperCase()]
}

const three_letter_array_to_three_letter_line = (three_letter_array) => {
	let str = ''
	
	for (let i = 0; i < three_letter_array.length; i++) {
		let res = three_letter_array[i]
		res = res[0].toUpperCase() + res.substr(1).toLowerCase()
		
		str += res
	}
	
	return str
}

const one_letter_array_to_one_letter_line = (one_letter_array) => {
	let str = ''
	
	for (let i = 0; i < one_letter_array.length; i++) {
		let res = one_letter_array[i]
		str += res
	}
	
	return str
}

const one_letter_array_to_three_letter_line = (one_letter_array) => {
	let str = ''
	
	for (let i = 0; i < one_letter_array.length; i++) {
		let res = one_letter_array[i]
		res = inverse_three_to_one_table[res]
		res = res[0].toUpperCase() + res.substr(1).toLowerCase()
		
		str += res
	}
	
	return str
}

const three_letter_array_to_one_letter_line = (three_letter_array) => {
	let str = ''
	
	for (let i = 0; i < three_letter_array.length; i++) {
		let res = three_letter_array[i].toUpperCase()
		res = three_to_one_table[res]
		
		str += res
	}
	
	return str
}

const fastify_line = (line) => {
	return '>FASTA\n' + line
}
const defastify_line = (line) => {
	return line.split('\r\n')[1]
}

export default {
	three_letter_array_to_one_letter_line,
	one_letter_array_to_three_letter_line,
	one_letter_array_to_one_letter_line,
	three_letter_array_to_three_letter_line,
	
	one_to_three,
	three_to_one,
	three_to_one_table,
	inverse_three_to_one_table,
	
	fastify_line,
	defastify_line
}

