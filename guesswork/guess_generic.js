const fs = require("fs")
const assert = require("assert")

const { pdb_parser } = require("../parsers/pdb_parser.js")

class guess_generic {
	constructor(pdb1, pdb2) {
		this.pdb1 = pdb1
		this.pdb2 = pdb2
	}
	
	_load_pdb(pdb) {
		let data = fs.readFileSync(pdb, 'utf-8')
		let atom = pdb_parser(data)
		
		return atom
	}
	
	_elongate(field, start, end, dir) {
		let len = end - start
		
		field += ''
		
		// console.log(field, start, end, len)
		while(field.length < len) {
			if (dir)
				field = field + ' '
			else 
				field = ' ' + field
		}
		
		// console.log(field, start, end, len)
		if(field.length > len) field = field.substr(0, 5)
			
		// console.log(field, start, end, len)
		return field
	}
			
	_chargify(charge) {
		if(charge === 0) return ''
		if(isNaN(charge)) return ''
		if(charge > 0) return charge + "+"
		if(charge < 0) return charge + "-"
		
		// console.log(charge)
		
		throw ["charge is", charge]
	}
	
	/*
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
	
	*/
	_atomize(atom) {
		let serial 			= this._elongate(atom.serial, 6, 11)
		let name	 		= this._elongate(atom.name, 12, 16)
		let alt_loc 		= this._elongate(atom.alt_loc, 16, 17)
		let res_name	 	= this._elongate(atom.res_name, 17, 20)
		let chain_id	 	= this._elongate(atom.chain_id, 21, 22)
		let res_seq	 		= this._elongate(atom.res_seq, 22, 26)
		let i_code	 		= this._elongate(atom.i_code, 26, 27)
		let x	 			= this._elongate(Math.round(atom.x * 1000) / 1000, 30, 38)
		let y	 			= this._elongate(Math.round(atom.y * 1000) / 1000, 38, 46)
		let z	 			= this._elongate(Math.round(atom.z * 1000) / 1000, 46, 54)
		let occupancy	 	= this._elongate(atom.occupancy, 54, 60)
		let temp_factor	 	= this._elongate(atom.temp_factor, 60, 66)
		let element	 		= this._elongate(atom.element, 76, 78)
		let charge	 		= this._elongate(this._chargify(atom.charge), 78, 80)
		
		/*console.log(atom.x, x)
		console.log(atom.y, y)
		console.log(atom.z, z)*/
		
		let atom_string = 
`ATOM  ${serial} ${name}${alt_loc}${res_name} ${chain_id}${res_seq}${i_code}   ${x}${y}${z}${occupancy}${temp_factor}          ${element}${charge}`
	
		return atom_string
	}
	
	/* 
		ser_num: parseInt(pdb_line.substring(7, 10)),
		chain_id: pdb_line.substring(11, 12).trim(),
		num_res: parseInt(pdb_line.substring(13, 17)),
		res_names: pdb_line.substring(19, 80).trim().split(' ')
	*/
	
	// SEQRES   1 A   2  ILE THR 
	// SEQRES   1 A    2  PRO GLN  
	// SEQRES   1A    2  PRO GLN  
	_sequenize(seq) {
		let ser_num 		= this._elongate(seq.ser_num, 7, 10)
		let chain_id 		= this._elongate(seq.chain_id, 11, 12)
		let num_res 		= this._elongate(seq.num_res, 13, 17)
		let res_names 		= this._elongate(seq.res_names.join(" "), 19, 80, true)
		
		console.log(seq)
		let seq_string = `SEQRES ${ser_num} ${chain_id} ${num_res}  ${res_names}`
		
		return seq_string
	}
	
	_encode_pdb(pdb, molecule) {
		let class_name = this.constructor.name
		
		let filename = pdb + ".guessed-by-" + class_name + ".pdb"
		
		let encoded_text = ""
		let seq_text = ""
		
		for(let i = 0; i < molecule.seq_res.length; i++) {
			let seq = molecule.seq_res[i]
			
			let line = this._sequenize(seq)
			
			seq_text += line + "\n"
		}
		
		encoded_text += seq_text
		
		let atom_text = ''
		for(let i = 0; i < molecule.atoms.length; i++) {
			let atom = molecule.atoms[i]
			
			let line = this._atomize(atom)
			
			atom_text += line + "\n"
		}
		
		encoded_text += atom_text
		
		console.log(filename)
		
		fs.writeFileSync("./" + filename, encoded_text)
	}
	
	guess(molecule1, molecule2) {
		assert(false) // subs should implement it
	}
	
	do_guess() {
		this.molecule1 = this._load_pdb(this.pdb1)
		this.molecule2 = this._load_pdb(this.pdb2)
		
		this.guess(this.molecule1, this.molecule2)
		
		this._encode_pdb(this.pdb1, this.molecule1)
		this._encode_pdb(this.pdb2, this.molecule2)
	}
}

module.exports = guess_generic