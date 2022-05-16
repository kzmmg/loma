const fs = require("fs")

let dataset - fs.readFileSync("dataset.txt").toString().split("\r\n")

let pdbshka = {}

let parse
for(let i = 0; i < dataset.length; i++) {
	let record = dataset[i]
	
	parse(record)
}

/*
COLUMNS       DATA  TYPE     FIELD             DEFINITION
------------------------------------------------------------------------------------
 1 -  6       Record name    "HEADER"
11 - 50       String(40)     classification    Classifies the molecule(s).
51 - 59       Date           depDate           Deposition date. This is the date the
                                               coordinates  were received at the PDB.
63 - 66       IDcode         idCode            This identifier is unique within the PDB.
*/
let parse_header = (header_rec) => {
	let header_word    = header_rec.substring(0, 6)
	let classification = header_rec.substring(10, 50)
	let dep_date       = header_rec.substring(50, 59)
	let id_code        = header_rec.substring(62, 66)
	
	dep_date = validate_and_parse_type["Date"](dep_date)
	id_code  = validate_and_parse_type["IDcode"](id_code)
	
	pdbshka.header = {}
	
	let header = pdbshka.header
	
	header.classification = { parsed: false, word: classification }
	header.dep_date = dep_date
	header.id_code  = id_code
}

/*
COLUMNS       DATA  TYPE     FIELD         DEFINITION
---------------------------------------------------------------------------------------
 1 -  6       Record name   "OBSLTE"
 9 - 10       Continuation  continuation  Allows concatenation of multiple records
12 - 20       Date          repDate       Date that this entry was replaced.
22 - 25       IDcode        idCode        ID code of this entry.
32 - 35       IDcode        rIdCode       ID code of entry that replaced this one.
37 - 40       IDcode        rIdCode       ID code of entry that replaced this one.
42 - 45       IDcode        rIdCode       ID code of entry  that replaced this one.
47 - 50       IDcode        rIdCode       ID code of entry that replaced this one.
52 - 55       IDcode        rIdCode       ID code of entry that replaced this one.
57 - 60       IDcode        rIdCode       ID code of entry that replaced this one.
62 - 65       IDcode        rIdCode       ID code of entry that replaced this one.
67 - 70       IDcode        rIdCode       ID code of entry that replaced this one.
72 - 75       IDcode        rIdCode       ID code of entry that replaced this one.
*/
let parse_obslte = (obslte_rec) => {
	if (!pdbshka.obslte) pdbshka.obslte = []
	
	let obslte_word = obslte_rec.substring(0,6)
	let continuation = obslte_rec.substring(8,10)
	let rep_date = obslte_rec.substring(11,20)
	let rid_code1 = obslte_rec.substring(21,25)
	let rid_code2 = obslte_rec.substring(31,35)
	let rid_code3 = obslte_rec.substring(36,40)
	let rid_code4 = obslte_rec.substring(41,45)
	let rid_code5 = obslte_rec.substring(46,50)
	let rid_code6 = obslte_rec.substring(51,55)
	let rid_code7 = obslte_rec.substring(56,60)
	let rid_code8 = obslte_rec.substring(61,65)
	let rid_code9 = obslte_rec.substring(66,70)
	let rid_code10 = obslte_rec.substring(71,75)
	
	rep_date = validate_and_parse_type["Date"](rep_date)
	
	let rid_codes = []
	rid_code1 = validate_and_parse_type["Continuation"](rid_code1)
	rid_codes.push(rid_code1)
	
	if(rid_code2) {
		rid_code2 = validate_and_parse_type["Continuation"](rid_code2)
		rid_codes.push(rid_code2)
	}
	if(rid_code3) {
		rid_code3 = validate_and_parse_type["Continuation"](rid_code3)
		rid_codes.push(rid_code3)
	}
	if(rid_code4) {
		rid_code4 = validate_and_parse_type["Continuation"](rid_code4)
		rid_codes.push(rid_code4)
	}
	if(rid_code5) {
		rid_code5 = validate_and_parse_type["Continuation"](rid_code5)
		rid_codes.push(rid_code5)
	}
	if(rid_code6) {
		rid_code6 = validate_and_parse_type["Continuation"](rid_code6)
		rid_codes.push(rid_code6)
	}
	if(rid_code7) {
		rid_code7 = validate_and_parse_type["Continuation"](rid_code7)
		rid_codes.push(rid_code7)
	}
	if(rid_code8) {
		rid_code8 = validate_and_parse_type["Continuation"](rid_code8)
		rid_codes.push(rid_code8)
	}
	if(rid_code9) {
		rid_code9 = validate_and_parse_type["Continuation"](rid_code9)
		rid_codes.push(rid_code9)
	}
	if(rid_code10) {
		rid_code10 = validate_and_parse_type["Continuation"](rid_code10)
		rid_codes.push(rid_code10)
	}
	
	let obslte_rec_o = {}
	
	obslte_rec_o.rep_date = rep_date
	obslte_rec_o.rid_codes = rid_codes
	
	pdbshka.obslte.push(obslte_rec_o)
	
	// TODO: need merge ?
}

/*
COLUMNS       DATA  TYPE     FIELD         DEFINITION
----------------------------------------------------------------------------------
 1 -  6       Record name    "TITLE "
 9 - 10       Continuation   continuation  Allows concatenation of multiple records.
11 - 80       String         title         Title of the  experiment.
*/
let parse_title = (title_rec) => {
	if(!pdbshka.title) pdbshka.title = []
	
	let title_word = title_rec.substring(0,6)
	let continuation = title_rec.substring(8,10)
	let title = title_rec.substring(11,80)
	
	pdbshka.title.push(title)
}

let parse_split = (split_rec) => {
	if(!pdbshka.split) pdbshka.split = []
	
	let split_word = split_rec.substring(0, 6)
	let continuation = split_rec.substring(8,10)
	
	let id_code1  = split_rec.substring(11,15)
	let id_code2  = split_rec.substring(16,20)
	let id_code3  = split_rec.substring(21,25)
	let id_code4  = split_rec.substring(26,30)
	let id_code5  = split_rec.substring(31,35)
	let id_code6  = split_rec.substring(36,40)
	let id_code7  = split_rec.substring(41,45)
	let id_code8  = split_rec.substring(46,50)
	let id_code9  = split_rec.substring(51,55)
	let id_code10 = split_rec.substring(56,60)
	let id_code11 = split_rec.substring(61,65)
	let id_code12 = split_rec.substring(66,70)
	let id_code13 = split_rec.substring(71,75)
	let id_code14 = split_rec.substring(76,80)
	
	
	let id_codes = []
	id_code1 = validate_and_parse_type["Continuation"](id_code1)
	id_codes.push(id_code1)
	
	if(id_code2) {
		id_code2 = validate_and_parse_type["Continuation"](id_code2)
		id_codes.push(id_code2)
	}
	if(id_code3) {
		id_code3 = validate_and_parse_type["Continuation"](id_code3)
		id_codes.push(id_code3)                           
	}                                                      
	if(id_code4) {                                         
		id_code4 = validate_and_parse_type["Continuation"](id_code4)
		id_codes.push(id_code4)
	}
	if(id_code5) {
		id_code5 = validate_and_parse_type["Continuation"](id_code5)
		id_codes.push(id_code5)
	}
	if(id_code6) {
		id_code6 = validate_and_parse_type["Continuation"](id_code6)
		id_codes.push(id_code6)
	}
	if(id_code7) {
		id_code7 = validate_and_parse_type["Continuation"](id_code7)
		id_codes.push(id_code7)
	}
	if(id_code8) {
		id_code8 = validate_and_parse_type["Continuation"](id_code8)
		id_codes.push(id_code8)
	}
	if(id_code9) {
		id_code9 = validate_and_parse_type["Continuation"](id_code9)
		id_codes.push(id_code9)
	}
	if(id_code10) {
		id_code10 = validate_and_parse_type["Continuation"](id_code10)
		id_codes.push(id_code10)
	}
	if(id_code11) {
		id_code11 = validate_and_parse_type["Continuation"](id_code11)
		id_codes.push(id_code11)
	}
	if(id_code12) {
		id_code12 = validate_and_parse_type["Continuation"](id_code12)
		id_codes.push(id_code12)
	}
	if(id_code13) {
		id_code13 = validate_and_parse_type["Continuation"](id_code13)
		id_codes.push(id_code13)
	}
	if(id_code14) {
		id_code14 = validate_and_parse_type["Continuation"](id_code14)
		id_codes.push(id_code14)
	}
	
	let obslte_rec_o = {}
	
	obslte_rec_o.rep_date = rep_date
	obslte_rec_o.rid_codes = rid_codes
	
	pdbshka.obslte.push(obslte_rec_o)
	
}

let parsers = []

// TODO for each parser needs post-hooks running after END is processed
parsers["HEADER".trim()] = parse_header // +
parsers["OBSLTE".trim()] = parse_obslte // +
parsers["TITLE ".trim()] = parse_title  // +
parsers["SPLIT ".trim()] = parse_split
parsers["CAVEAT".trim()] = parse_caveat
parsers["COMPND".trim()] = parse_compnd
parsers["SOURCE".trim()] = parse_source
parsers["KEYWDS".trim()] = parse_keywds
parsers["EXPDTA".trim()] = parse_expdta
parsers["NUMMDL".trim()] = parse_nummdl
parsers["MDLTYP".trim()] = parse_mdltyp
parsers["AUTHOR".trim()] = parse_author
parsers["REVDAT".trim()] = parse_revdat
parsers["SPRSDE".trim()] = parse_sprsde
parsers["JRNL  ".trim()] = parse_jrnl
parsers["REMARK".trim()] = parse_remark
parsers["DBREF ".trim()] = parse_dbref
parsers["DBREF1".trim()] = parse_dbref1
parsers["DBREF2".trim()] = parse_dbref2
parsers["SEQADV".trim()] = parse_seqadv
parsers["SEQRES".trim()] = parse_seqres
parsers["MODRES".trim()] = parse_modres
parsers["HET   ".trim()] = parse_het
parsers["HETNAM".trim()] = parse_hetnam
parsers["HETSYN".trim()] = parse_hetsyn
parsers["FORMUL".trim()] = parse_formul
parsers["HELIX ".trim()] = parse_helix
parsers["SHEET ".trim()] = parse_sheet
parsers["SSBOND".trim()] = parse_ssbond
parsers["LINK  ".trim()] = parse_link
parsers["CISPEP".trim()] = parse_cispep
parsers["SITE  ".trim()] = parse_site
parsers["CRYST1".trim()] = parse_cryst1
parsers["ORIGX1".trim()] = parse_origx1
parsers["ORIGX2".trim()] = parse_origx2
parsers["ORIGX3".trim()] = parse_origx3
parsers["SCALE1".trim()] = parse_scale1
parsers["SCALE2".trim()] = parse_scale2
parsers["SCALE3".trim()] = parse_scale3
parsers["MTRIX1".trim()] = parse_mtrix1
parsers["MTRIX2".trim()] = parse_mtrix2
parsers["MTRIX3".trim()] = parse_mtrix3
parsers["MODEL ".trim()] = parse_model
parsers["ATOM  ".trim()] = parse_atom
parsers["ANISOU".trim()] = parse_anisou
parsers["TER   ".trim()] = parse_ter
parsers["HETATM".trim()] = parse_hetatm
parsers["ENDMDL".trim()] = parse_endmdl
parsers["CONECT".trim()] = parse_conect
parsers["MASTER".trim()] = parse_master
parsers["END   ".trim()] = parse_end

parse = (rec) => {
	let split = rec.split(/\s+/g)
	
	let rec_type = split[0]
	
	let parser = parsers[rec_type]
	
	parser(rec)
}