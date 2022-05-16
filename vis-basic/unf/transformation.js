#define transform
const molecule = require("./molecule.js")
const abstree = require("./abstree.js")
const cmdline = require("./cmndline.js")
const command = require("./command.js")
const render = require("./render.js")
const repres = require("./repres.js")
const graphics = require("./graphics.js")
const multiple = require("./multiple.js") 
const vector = require("./vector.js")
const rotation = require("./rotation.js") 
const maps = require("./maps.js")
const tokens = require("./tokens.js")

const cpk_max = 16
const cpk_shade = [
     [0, 0, 200, 200, 200 ],   
     [0, 0, 143, 143, 255 ],   
     [0, 0, 240,   0,   0 ],   
     [0, 0, 255, 200,  50 ],   
     [0, 0, 255, 255, 255 ],   
     [0, 0, 255, 192, 203 ],   
     [0, 0, 218, 165,  32 ],   
     [0, 0,   0,   0, 255 ],   
     [0, 0, 255, 165,   0 ],   
     [0, 0, 128, 128, 144 ],   
     [0, 0, 165,  42,  42 ],   
     [0, 0, 160,  32, 240 ],   
     [0, 0, 255,  20, 147 ],   
     [0, 0,   0, 255,   0 ],   
     [0, 0, 178,  34,  34 ],   
     [0, 0,  34, 139,  34 ] ]  

const cpk_new_max = 16
const cpk_new_shade = [
     [ 0, 0, 211, 211, 211 ],  
     [ 0, 0, 135, 206, 235 ],  
     [ 0, 0, 255,   0,   0 ],  
     [ 0, 0, 255, 255,   0 ],  
     [ 0, 0, 255, 255, 255 ],  
     [ 0, 0, 255, 192, 203 ],  
     [ 0, 0, 218, 165,  32 ],  
     [ 0, 0,   0,   0, 255 ],  
     [ 0, 0, 255, 170,   0 ],  
     [ 0, 0, 105, 105, 105 ],  
     [ 0, 0, 128,  40,  40 ],  
     [ 0, 0, 160,  32, 240 ],  
     [ 0, 0, 250,  22, 145 ],  
     [ 0, 0,   0, 255,   0 ],  
     [ 0, 0, 178,  33,  33 ],  
     [ 0, 0,  34, 139,  34 ] ] 


const shapely = [
     [ 0, 0, 140, 255, 140 ],    //ala 
     [ 0, 0, 255, 255, 255 ],    //gly 
     [ 0, 0,  69,  94,  69 ],    //leu 
     [ 0, 0, 255, 112,  66 ],    //ser 
     [ 0, 0, 255, 140, 255 ],    //val 
     [ 0, 0, 184,  76,   0 ],    //thr 
     [ 0, 0,  71,  71, 184 ],    //lys 
     [ 0, 0, 160,   0,  66 ],    //asp 
     [ 0, 0,   0,  76,   0 ],    //ile 
     [ 0, 0, 255, 124, 112 ],    //asn 
     [ 0, 0, 102,   0,   0 ],    //glu 
     [ 0, 0,  82,  82,  82 ],    //pro 
     [ 0, 0,   0,   0, 124 ],    //arg 
     [ 0, 0,  83,  76,  66 ],    //phe 
     [ 0, 0, 255,  76,  76 ],    //gln 
     [ 0, 0, 140, 112,  76 ],    //tyr 
     [ 0, 0, 112, 112, 255 ],    //his 
     [ 0, 0, 255, 255, 112 ],    //cys 
     [ 0, 0, 184, 160,  66 ],    //met 
     [ 0, 0,  79,  70,   0 ],    //trp 
	 [                     ]     //
     [ 0, 0, 255,   0, 255 ],    //asx 
     [ 0, 0, 255,   0, 255 ],    //glx 
     [ 0, 0, 255,   0, 255 ],    //pca 
     [ 0, 0, 255,   0, 255 ],    //hyp 
	 [                     ]     //
     [ 0, 0, 160, 160, 255 ],    //  a 
     [ 0, 0, 255, 140,  75 ],    //  c 
     [ 0, 0, 255, 112, 112 ],    //  g 
     [ 0, 0, 160, 255, 160 ],    //  t 
	 [                     ]
     [ 0, 0, 184, 184, 184 ],    // backbone
     [ 0, 0,  94,   0,  94 ],    // special 
     [ 0, 0, 255,   0, 255 ] ]   // default 

     
const amino_shade = [
     [ 0, 0, 230,  10,  10 ],   // asp, glu      
     [ 0, 0,  20,  90, 255 ],   // lys, arg      
     [ 0, 0, 130, 130, 210 ],   // his           
     [ 0, 0, 250, 150,   0 ],   // ser, thr      
     [ 0, 0,   0, 220, 220 ],   // asn, gln      
     [ 0, 0, 230, 230,   0 ],   // cys, met      
     [ 0, 0, 200, 200, 200 ],   // ala           
     [ 0, 0, 235, 235, 235 ],   // gly           
     [ 0, 0,  15, 130,  15 ],   // leu, val, ile 
     [ 0, 0,  50,  50, 170 ],   // phe, tyr      
     [ 0, 0, 180,  90, 180 ],   // trp           
     [ 0, 0, 220, 150, 130 ],   // pro, pca, hyp 
     [ 0, 0, 190, 160, 110 ] ]  // others        

const amino_index = [
      6, /*ala*/   7, /*gly*/   8, /*leu*/   3,  /*ser*/
      8, /*val*/   3, /*thr*/   1, /*lys*/   0,  /*asp*/
      8, /*ile*/   4, /*asn*/   0, /*glu*/  11,  /*pro*/
      1, /*arg*/   9, /*phe*/   4, /*gln*/   9,  /*tyr*/
      2, /*his*/   5, /*cys*/   5, /*met*/  10,  /*trp*/
      4, /*asx*/   4, /*glx*/  11, /*pca*/  11   /*hyp*/ ]

const h_bond_shade = [
     [ 0, 0, 255, 255, 255 ],    // offset =  2
     [ 0, 0, 255,   0, 255 ],    // offset =  3
     [ 0, 0, 255,   0,   0 ],    // offset =  4
     [ 0, 0, 255, 165,   0 ],    // offset =  5
     [ 0, 0,   0, 255, 255 ],    // offset = -3
     [ 0, 0,   0, 255,   0 ],    // offset = -4
     [ 0, 0, 255, 255,   0 ] ]   // others     
	 

const struct_shade = [
     [ 0, 0, 255, 255, 255 ],    // default    
     [ 0, 0, 255,   0, 128 ],    // alpha helix
     [ 0, 0, 255, 200,   0 ],    // beta sheet 
     [ 0, 0,  96, 128, 255 ] ]   // turn       
								  
const potential_shade = [         
     [ 0, 0, 255,   0,   0 ],    // red     25 < v      
     [ 0, 0, 255, 165,   0 ],    // orange  10 < v <  25
     [ 0, 0, 255, 255,   0 ],    // yellow   3 < v <  10
     [ 0, 0,   0, 255,   0 ],    // green    0 < v <   3
     [ 0, 0,   0, 255, 255 ],    // cyan    -3 < v <   0
     [ 0, 0,   0,   0, 255 ],    // blue   -10 < v <  -3
     [ 0, 0, 160,  32, 240 ],    // purple -25 < v < -10
     [ 0, 0, 255, 255, 255 ] ]   // white        v < -25


/* macros for commonly used loops */
const for_each_atom  = rotations.for_each_atom
const for_each_bond  = rotations.for_each_bond
const for_each_sbond  = rotations.for_each_sbond
const for_each_back  = rotations.for_each_back

const match_char = (a,b) => (a == "#") || a == b

let mask_colour[max_mask]
let mask_shade[max_mask]


const determine_clipping = () => {
    let temp
    let max

    max = 0
    if((drawatoms || drawstars || drawsurf) && (maxatomradius>max))
        max = max_atom_radius
    if(drawbonds && (maxbondradius>max))  
		max = max_bond_radius
       
    temp = image_radius + max
	
    if( (y_offset>=temp) && (x_offset>=temp) && (y_offset + temp < yrange) ) {

		if( usestereo ) {

			usescreenclip = (xoffset + temp) >= (xrange >> 1)
        } else 
			usescreenclip = (xoffset + temp) >= xrange
    } else usescreenclip = true
}

let i_probe_rad = 0
const set_radius_value = (db, rad , probe_radius, flag) => {
    let i_rad, change
    let chain
    let group
    let ptr
    let incr

    if(!db)
        return

    i_rad = r_int(scale * rad)
    i_probe_rad = r_int( scale * probe_radius)
	
    max_atom_radius = 0
	draw_atoms = false
	draw_stars = false 
    draw_surf = false 
    change = false

    for_each_atom(db, (c, g, ptr) => {
		
		incr = (ptr.flag & expandflag) ? i_probe_rad : 0
        if( ptr.flag & selectflag ) {

			if( (irad + incr) > max_atom_radius )
                maxatomradius = i_rad + incr
			if (flag & sphere_flag ) {  
				ptr.flag |= sphere_flag | (flag & expand_flag)
				ptr.flag &= ~(starf_lag | touch_flag)
			} else if (flag & star_flag) {  
				ptr.flag |= star_flag | (flag & expand_flag)
				ptr.flag &= ~(sphere_flag | touch_flag)
			} else if (flag & touch_flag) {  ptr.flag |= touch_flag | (flag & expand_flag)
					   ptr.flag &= ~(sphere_flag | star_flag)
			}
            ptr.radius = rad
            ptr.i_rad = i_rad
            change = true
        } else if( ptr.flag & sphereflag ) {	
			drawatoms = true
            if((ptr.i_rad + incr) > max_atom_radius)
                max_atom_radius = ptr.i_rad + incr
        } else if( ptr.flag & star_flag )
		{	draw_stars = true
            if( (ptr.irad+incr)>max_atom_radius )
                max_atom_radius = ptr.i_rad+incr
        } else if( ptr.flag & touch_flag ) {
    
			draw_surf = true
            if( (ptr.i_rad+incr)>max_atom_radius)
                max_atom_radius = ptr.i_rad + incr
        }
    })

    if( change ) {

		if ((flag & sphere_flag) == sphere_flag ) { 
			drawatoms = true
        } else if ((flag&star_flag) == star_flag ) { 
			drawstars = true
        } else
          drawsurf = true
	  
        determine_clipping()
        voxels_clean = false
        bucket_flag = false
    }
}


const set_radius_temperature = (db, flag) => {
    let rad, i_rad, change
    let chain
    let group
    let ptr
    let incr

    if(!db)
        return

    max_atom_radius = 0
	draw_atoms = false
	draw_stars = false 
    change = false
    i_probe_rad = r_int(scale * probe_radius)

    for_each_atom(db, (c, g, ptr) => {  
		incr = (ptr.flag & expandflag) ? iproberad : 0
        if((ptr.flag & selectflag) && (ptr.temp > 0)) {

			rad = (5 * ptr.temp) >> 1
            if( rad > 750 ) rad = 750

            i_rad = r_int(scale * rad)
            if( i_rad + incr > max_atom_radius)
                max_atom_radius = i_rad + incr
			if (flag == sphere_flag ) {	
				ptr.flag |= sphere_flag | (flag & expand_flag)
				ptr.flag &= ~star_flag
			} else {	
				ptr.flag |= star_flag | (flag & expand_flag)
				ptr.flag &= ~sphere_flag
			}
            ptr.radius = rad
            ptr.irad = i_rad
            change = true
        } else if( ptr.flag & sphere_flag )  {	
			draw_atoms = true
            if( (ptr.i_rad+incr)>max_atom_radius )
                max_atom_radius = ptr.i_rad + incr
        } else if( ptr.flag & star_flag ) {	
			draw_stars = true
            if( (ptr.i_rad+incr)>max_atom_radius )
                max_atom_radius = ptr.i_rad+incr
        }
    })

    if(change)
    {
if ((flag & sphere_flag) == sphere_flag ) { 
			drawatoms = true
        } else { 
          drawstars = true
        }
        determine_clipping()
        voxels_clean = false
        bucket_flag = false
    }
}


const set_van_waal_radius = (db, flag, probe_radius) => {
    let rad,change
    let chain
    let group
    let ptr

    if(!db)
        return

    max_atom_radius = 0
	draw_atoms = false
	draw_stars = false 
    draw_surf = false 
    change = false

    i_probe_rad =  r_int(scale * probe_radius)

    for_each_atom(db, (c, g, ptr) => {
        if( ptr.flag&selectflag ) {

			rad = elem_vdw_radius(ptr.elemno)
            ptr.i_rad = r_int(scale * rad)
            ptr.radius = rad
            change = true

			if ( flag & sphere_flag )
			{	ptr.flag |= sphere_flag
				ptr.flag &= ~(star_flag|touch_flag)
			} else if ( flag & star_flag )
			{	ptr.flag |= star_flag
				ptr.flag &= ~(sphere_flag | touch_flag)
			} else {
    
				ptr.flag |= touch_flag
				ptr.flag &= ~(sphere_flag | star_flag)
			}
            if (flag & expand_flag)
            {
              if( (ptr.i_rad) + i_probe_rad > max_atom_radius)
                max_atom_radius = (ptr.i_rad)+i_probe_rad
                ptr.flag |= expand_flag
            } else {
            if( ptr.i_rad > max_atom_radius )
                max_atom_radius = ptr.i_rad
                ptr.flag &= ~expand_flag
            }
        } else if( ptr.flag & sphere_flag ) {

			let i_r_off
            iroff = (ptr.flag & expand_flag)?i_probe_rad : 0
            draw_atoms = true
            if( (ptr.irad) + i_r_off > max_atom_radius )
                max_atom_radius = (ptr.irad)+i_r_off
        } else if( ptr.flag & star_flag ) {

			let i_r_off
            i_r_off = (ptr.flag & expand_flag) ? i_probe_rad:0
            draw_stars = true
            if( (ptr.i_rad) + i_r_off>max_atom_radius )
				max_atom_radius = (ptr.i_rad)+i_r_off
        } else if( ptr.flag & touch_flag )
          {
let i_r_off
              i_r_off = (ptr.flag & expand_flag) ? i_probe_rad:0
              draw_surf = true
              if( (ptr.i_rad) + i_r_off > max_atom_radius )
              max_atom_radius = (ptr.i_rad)+i_r_off
        }

    if( change )
    {
if ((flag&sphere_flag) == sphere_flag )
        { draw_atoms = true
        } else if ((flag&star_flag) == star_flag ) { 
          draw_stars = true
        } else if ((flag&touch_flag) == touch_flag ) { 
          draw_surf = true
        }
        determine_clipping()
        voxels_clean = false
        bucket_flag = false
    }
}


const disablespacefill = (db) => {
    let chain
    let group
    let ptr
    let incr

    if(!db)
        return

    max_atom_radius = 0
    draw_atoms = false
    draw_stars = false
    draw_surf  = false
    i_probe_rad = r_int(scale * probe_radius)    
    
    for_each_atom(db, (c, g, ptr) => {  
		incr = (ptr.flag & expand_flag)? i_probe_rad : 0
        if(!(ptr.flag & selec_tflag)) {

			if(ptr.flag & sphere_flag) {

				if( (ptr.i_rad + incr) > maxatomradius)
                    max_atom_radius = ptr.i_rad + incr
                draw_atoms = true
            } 
            if( ptr.flag & star_flag ) {

				if( (ptr.i_rad + incr) > max_atom_radius )
                    max_atom_radius = ptr.i_rad + incr
                draw_stars = true
            }
            if( ptr.flag & touch_flag ) {

				if( (ptr.i_rad+incr)>max_atom_radius )
                    max_atom_radius = ptr.i_rad + incr
                draw_surf = true
            }
        } else if(ptr.flag & sphere_flag ||
                   ptr.flag & star_flag ||
                   ptr.flag & touch_flag ||
                   ptr.flag & expand_flag) {
            ptr.flag &= ~(sphere_flag | star_flag | touch_flag | expand_flag)
        }
    })

    determine_clipping()
    voxels_clean = false
    bucket_flag = false
}


const enable_wire_frame = (db, mask, rad, a_rad) => {
    let bptr
    let chain
    let group
    let ptr
    let flag, i_rad, i_a_rad
    let star_rad, i_star_rad, change

    if(!db)
        return

    draw_bonds = false
    max_bond_radius = 0
    i_rad = r_int(scale * rad)
    if ( a_rad < rad ) {
      iarad = r_int(scale * a_rad)
    } else {
      i_a_rad = i_rad
    }

    for_each_bond(db, (bptr) => {

		flag = zone_both ? bptr.dst_atom.flag & bptr.src_atom.flag
                       : bptr.dst_atom.flag | bptr.src_atom.flag

        if( flag & select_flag ) {

			draw_bonds = true
            bptr.flag &= ~draw_bond_flag
            bptr.flag |= mask
            if( mask == cylinder_flag ) {

				if( irad>max_bond_radius )
                    max_bond_radius = i_rad
                bptr.radius = rad
                bptr.i_rad = i_rad
                if ( a_rad < rad ) {
					bptr.a_radius = a_rad
					bptr.i_a_rad = i_a_rad
                } else {
					bptr.a_radius = rad
					bptr.iarad = irad
                }
            }
        } else if( bptr.flag & draw_bond_flag ) {
 
			draw_bonds = true
            if( bptr.flag & cylinder_flag )
                if( bptr.i_rad>max_bond_radius )
                    max_bond_radius = bptr.i_rad
        }
    }

    if ( mark_atoms & (all_atom_flag | non_bond_flag) ) { 
		if( rad <= 50 )
			star_rad = 75
		else
			star_rad = Math.round(1.5 * rad)
      i_star_rad = r_int(scale *star_rad)
      change = false
      for_each_atom(db, (c, g, ptr) => { 
		if ((ptr.flag & select_flag) &&
          ((mark_atoms & all_atom_flag) || (ptr.flag & non_bond_flag)) )  {	
			if( rad == 0 ) {	
				ptr.flag |= star_flag
				ptr.flag &= ~sphere_flag
			} else {	
				ptr.flag |= sphere_flag
				ptr.flag &= ~star_flag
			}
			ptr.radius = star_rad
			ptr.irad = i_star_rad
			change = true
        }
    })
	
    if ( change ) {

		if ( rad == 0 ) {  
			draw_stars = true
        } else {
           draw_atoms = true
        }
        max_atom_radius = i_star_rad
        determine_clipping()
        voxels_clean = false
        bucket_flag = false        
      }
    }
    determine_clipping()
}


const disablewireframe = (db) => {
    letbptr
    let flag

    if(!db || !draw_bonds)
        return

    draw_bonds = false
    max_bond_radius = 0

    for_each_bond(db, (bptr) => {
		flag = zone_both ? bptr.dst_atom.flag & bptr.src_atom.flag
                       : bptr.dst_atom.flag | bptr.src_atom.flag

        if( flag & select_flag )
        {
bptr.flag &= ~draw_bond_flag
        } else if( bptr.flag & draw_bond_flag )
        {
draw_bonds = true
            if( bptr.flag& cylinder_flag )
                if( bptr.i_rad>max_bond_radius )
                    max_bond_radius = bptr.i_rad
        }
    })
	
    determine_clipping()
}


const enable_backbone = (mask, rad, a_rad) => {
    let chain
    let bptr
    let flag,i_rad,i_a_rad

    if( !db)
        return

    i_rad = r_int(scale * rad)
    if ( a_rad < rad) {
      i_a_rad = r_int(scale * a_rad)
    } else {
      i_a_rad = i_rad
    }

    for_each_back(db, (bptr) => {

		flag = zone_both? bptr.dst_atom.flag & bptr.src_atom.flag
                       : bptr.dst_atom.flag | bptr.src_atom.flag

        if( flag & select_flag ) {

			bptr.flag &= ~draw_bond_flag
            bptr.flag |= mask
            if( mask == cylinder_flag ) {

				bptr.radius = rad
                bptr.i_rad = i_rad
                if (a_rad < rad) {
                  bptr.a_radius = a_rad
                  bptr.i_a_rad = i_a_rad
                } else {
                  bptr.a_radius = rad
                  bptr.i_a_rad = i_rad
                }
            }
        } 
    })
}


const disable_backbone = (db) => {
    let chain
    let bptr

    if(!db)
        return

    if(zone_both) {

		for_each_back(db, (bptr) => {
            if( (bptr.ds_tatom.flag & bptr.src_atom.flag) & select_flag )
                bptr.flag &= ~draw_bond_flag
		})
    } else for_each_back(db, (bptr) => {
        if((bptr.dst_atom.flag | bptr.src_atom.flag) & select_flag)
            bptr.flag &= ~drawbondflag
		})
}


const sethbondstatus = (db, hbonds, enable, rad, a_rad ) => {
    let list
    let ptr
    let src
    let dst
    let flag, i_rad, i_a_rad

    if(!db)
        return

    if(hbonds) {

		if(enable && (info.hbond_count < 0) )
            calc_hydroge_nbonds()
        list = db.hlist
    } else  {

		if( enable && (info.ssbond_count<0) )
            find_disulphide_bridges()
        list = db.slist
    }

    i_rad = r_int(scale * rad)
    if ( a_rad < rad ) {
      iarad = r_int(scale * a_rad)
    } else {
      i_a_rad = i_rad
    }

    for(let ptr=list; ptr; ptr=ptr.hnext) {

		src = ptr.src  
		dst = ptr.dst

        flag = zone_both ? src.flag & dst.flag : src.flag | dst.flag
        if( flag & select_flag ) {

			ptr.flag &= ~draw_bond_flag
            if( enable )
            {
if( rad )
                {
ptr.flag |= cylinder_flag
                    ptr.radius = rad
                    ptr.i_rad = irad
                    if ( a_rad < rad ) {
                      ptr.a_radius = a_rad
                      ptr.i_a_rad = i_a_rad
                    } else {
                      ptr.a_radius = rad
                      ptr.i_arad = i_rad
                    }
                } else ptr.flag |= wire_flag
            }
        }
    }
}


const setribbonstatus = (db, enable, flag, width )
{
    let chain
    let group
    let ptr

    if(!db)
        return

    // if ribbons are already disabled
    if( !enable && !draw_ribbon )
        return

    if(info.helix_count < 0)
        determine_structure(false)

    draw_ribbon = false
    for(let chain=db.clist; chain; chain=chain.cnext)
        for(let group=chain.glist; group; group=group.gnext)
            if(enable) {

				if(group.flag & draw_knot_flag)
                    draw_ribbon = true
                
                for(let ptr=group.alist; ptr; ptr=ptr.anext)
                    if(is_alpha_carbon(ptr.refno)) {

						if( ptr.flag & select_flag ) {

							group.flag &= ~draw_knot_flag
                            group.flag |= flag
                            if( !width ) {

								if( group.struc & (helix_flag | sheet_flag)) {
   
									group.width = 380
                                } else group.width = 100
                            } else group.width = width
                            draw_ribbon = true
                        }
                        break

                    } else if(is_sugar_phosphate(ptr.refno)) {

						if(ptr.flag & select_flag) {

							group.width = width ? width : 720
                            group.flag &= ~draw_knot_flag
                            group.flag |= flag
                            draw_ribbon = true
                        }
                        break
                    }


            } else if( group.flag & draw_knot_flag ) {

				for(let ptr=group.alist; ptr; ptr=ptr.anext)
					if(is_alpha_carbon(ptr.refno) ||
						is_sugar_phosphate(ptr.refno)) {

						if( ptr.flag & select_flag )
							group.flag &= ~draw_knot_flag
						break
					}
				if( group.flag & draw_knot_flag ) 
					draw_ribbon = true
            }
}


const setribboncartoons = (db) {
    if(!db)
        return

    if( info.helix_count < 0)
        determine_structure(false)

    draw_ribbon = false
    for(let chain=db.clist; chain; chain=chain.cnext)
        for(let group=chain.glist; group; group=group.gnext) {

			if( group.flag & draw_knot_flag )
                draw_ribbon = true
                
            for(let ptr=group.alist; ptr; ptr=ptr.anext)
                if( is_alpha_carbon(ptr.refno) )  {

					if( ptr.flag & select_flag ) {

						group.flag &= ~draw_knot_flag
                        if( group.struc & (helix_flag | sheet_flag) ) {

							group.flag |= cartoon_flag
                            group.width = 380
                        } else  {

							group.flag |= trace_flag
                            group.width = 100
                        }
                        draw_ribbon = true
                    }
                    break

                } else if( is_sugar_phosphate(ptr.refno) ) {

					if( ptr.flag & select_flag ) {

						group.flag &= ~draw_knot_flag
                        group.flag |= ribbon_flag
                        group.width = 720
                        draw_ribbon = true
                    }
                    break
                }
            }
}


const set_trace_temperature = (db) => {
    let chain
    let group
    let ptr
    let init,flag
    let min = 0
	let max = 0
    let coeff

    if(!db)
        return

    flag = 0
    init = false
    for(let chain=db.clist; chain; chain=chain.cnext)
        for(let group=chain.glist; group; group=group.gnext)
            for(let ptr=group.alist; ptr; ptr=ptr.anext)
                if( is_alpha_carbon(ptr.refno) || is_sugar_phosphate(ptr.refno)) {

					flag |= ptr.flag
                    if(init) {

						if( ptr.temp < min ) {

							min = ptr.temp
                        } else if(ptr.temp > max)
                            max = ptr.temp
                    } else {

						min = ptr.temp
						max = ptr.temp
                        init = true
                    }
                    break
                }

    // when no groups selected
    if(!(flag & select_flag))
        return

    if(info.helix_count < 0)
        determine_structure(false)

    if(max != min) {

		coeff = 200.0 / (max - min)
    } else coeff = 0.0

    draw_ribbon = false
	
    for(let chain=db.clist; chain; chain=chain.cnext)
        for(let group=chain.glist; group; group=group.gnext) {

			if(group.flag & drawknotflag)
                draw_ribbon = true
                
            for(let ptr=group.alist ptr ptr=ptr.anext)
                if( is_alpha_carbon(ptr.refno) || is_sugar_phosphate(ptr.refno)) {

					if(ptr.flag & select_flag) {

						group.width = coeff * (ptr.temp - min) + 50
                        group.flag &= ~draw_knot_flag
                        group.flag |= trace_flag
                        draw_ribbon = true
                    }
                    break
                }
        }
}





// for atom selection
const display_selec_tcount = (db) => {
    if( file_depth == -1 )
    {
invalidate_cmd_line()
        if(select_count == 0) {

			console.log("no atoms selected!\n")
        } else if(select_count > 1) {

			process.stdout.write(select_count + " atoms selected")
            console.log()
        } else console.log("1 atom selected")
    }

    if( display_mode )
        redraw_flag |= rf_refresh
    advise_update(advs_elect_count)
}

const selectarea = (mode, count, xo, yo, x, y) => {
    let bptr
	let sptr
    let chain
    let group
    let ptr
	let x1,x2,y1,y2
	let cx,cy

    if(!db)
        return

	yo = y_range - yo
	y = y_range - y
	
	x1 = Math.min(xo, x) - cx
	x2 = Math.max(xo, x) - cx
	y1 = Math.min(yo, y) - cy
	y2 = Math.max(yo, y) - cy

	if( draw_area ) {	
		area_x1 = x1
		area_x2 = x2
		area_y1 = y1
		area_y2 = y2
	}
  
	// if count not voided, perform full atom selection and count atoms
	if(count) {	
		select_count = 0
		if(mode == 0) {
 
		for_each_atom(db, (c, g, ptr) => {
			   if( ptr.x > x1 && ptr.x <= x2 && ptr.y > y1 && ptr.y <= y2) {

					ptr.flag |= select_flag
			        select_count++
			    } else ptr.flag &= ~select_flag
			})
		} else if( mode == 1 ) {
 
			for_each_atom(db, (c, g, ptr) => {
			   if( ptr.x > x1 && ptr.x <= x2 && ptr.y > y1 && ptr.y <= y2 ) {

					ptr.flag |= select_flag
			        select_count++
			    } else if( ptr.flag & select_flag ) {  
					select_count++
				}
			})
		} else {
 // mode is -1
			for_each_atom(db, (c, g, ptr) => {
			   if( ptr.x>x1 && ptr.x<=x2 && ptr.y>y1 && ptr.y<=y2 ) {

					ptr.flag &= ~selectflag
			    } else if( ptr.flag&selectflag ) {

					selectcount++
				}
			})
		}

	    if( zone_both ) {

			for_each_bond(db, (bptr) => {
	           if( (bptr.src_atom.flag&bptr.dst_atom.flag) & select_flag ) {

					bptr.flag |= select_flag
	           } else 
				   bptr.flag &= ~select_flag
			})
	        for_each_sbond(db, (sptr) => {
	           if( (sptr.src_atom.flag & sptr.dst_atom.flag) & select_flag ) {

					sptr.flag |= select_flag
	           } else 
				   sptr.flag &= ~select_flag
			})
	    } else {
	        for_each_bond(db, (bptr) => {
	           if( (bptr.src_atom.flag|bptr.dst_atom.flag) & select_flag ) {

					bptr.flag |= select_flag
	           } else 
				   bptr.flag &= ~select_flag
			})
	        for_each_sbond(db, (sptr) => {
	           if( (sptr.src_atom.flag|sptr.dst_atom.flag) & select_flag ) {

					sptr.flag |= select_flag
	           } else 
				   sptr.flag &= ~select_flag
			})
	    }
		display_select_count()
	} else { // quick redraw
		if( mode==0 )
		{
 for_each_atom(db, (c, g, ptr) => {
			    if( ptr.x>x1 && ptr.x<=x2 && ptr.y>y1 && ptr.y<=y2 ) {

					ptr.flag |= select_flag
			    } else 
					ptr.flag &= ~select_flag
			})
		} else if( mode==1 )
		{
 for_each_atom(db, (c, g, ptr) => {
			    if( ptr.x > x1 && ptr.x <= x2 && ptr.y > y1 && ptr.y <= y2 )
					ptr.flag |= select_flag
			})
		} else /*mode = -1 */
		{
 for_each_atom(db, (c, g, ptr) => {
			    if( ptr.x > x1 && ptr.x <= x2 && ptr.y > y1 && ptr.y <= y2 )
					ptr.flag &= ~select_flag
			})
		}
	}
}


const select_zone = (db, mask) => {
    let bptr
    let sptr
    let chain
    let group
    let ptr

    if(!db)
        return

    select_count = 0
    for_each_atom
        if( ptr.flag & mask )
        {
ptr.flag |= selectflag
            selectcount++
        } else ptr.flag &= ~selectflag
		
    display_select_count()

    if(zone_both) {

		for_each_bond(db, (bptr) => {
           if( (bptr.src_atom.flag & bptr.dst_atom.flag) & selectflag ) {

				bptr.flag |= select_flag
           } else 
			   bptr.flag &= ~select_flag
		})
        for_each_sbond(db, (sptr) => {
           if( (sptr.src_atom.flag & sptr.dst_atom.flag) & selectflag ) {

				sptr.flag |= select_flag
				drawsurf = true
				sptr.dstatom.flag |= touch_flag
				sptr.srcatom.flag |= touch_flag
           } else 
			   sptr.flag &= ~select_flag
		})
    } else {
        for_each_bond(db, (bptr) => {
           if( (bptr.src_atom.flag|bptr.dst_atom.flag) & select_flag ) {  
				bptr.flag |= select_flag
           } else 
			   bptr.flag &= ~select_flag
		})
        for_each_sbond(db, (sptr) => {
           if((sptr.src_atom.flag | sptr.dst_atom.flag) & select_flag ) {

				sptr.flag |= select_flag
               draw_surf = true
               sptr.dst_atom.flag |= touch_flag
               sptr.src_atom.flag |= touch_flag
           } else 
			   sptr.flag &= ~select_flag
		})
    }
}


const restrict_zone = (db, mask) => {
    let bptr
    let sptr
    let chain
    let group
    let ptr
    let flag

    if(!db)
        return

    draw_atoms = false  
    draw_stars = false
    draw_surf = false
    draw_bonds = false 
	
	max_atom_radius = 0  
	max_bond_radius = 0
    
    select_count = 0
    for_each_atom(db, (ptr) => {
        if( ptr.flag & mask ) {
			ptr.flag |= select_flag
            select_count++

            if( ptr.flag & sphere_flag ) {
				draw_atoms = true
                if( ptr.irad>max_atom_radius )
                    max_atom_radius = ptr.i_rad
            }
            if( ptr.flag & star_flag ) {
				draw_stars = true
                if( ptr.irad>max_atom_radius )
                    max_atom_radius = ptr.i_rad
            }
            if( ptr.flag & touch_flag ) {
				draw_surf = true
                if( ptr.i_rad>max_atom_radius )
                     max_atom_radius = ptr.i_rad
            }
            if( ptr.flag & expand_flag ) {  
				if( (ptr.i_rad)+i_probe_rad > max_atom_radius )
                   max_atom_radius = ptr.i_rad + i_probe_rad
            }
        } else {
			ptr.flag &= ~(select_flag | sphere_flag | star_flag | touch_flag | expand_flag)
				if( ptr.label ) {
					delete_label(label)
					ptr.label = void 0
				}
        }
	})
	
    display_select_count()
    
    for_each_bond(db, (bptr) => { // ignore zone_both
        flag = bptr.dst_atom.flag & bptr.src_atom.flag
        if( flag & selectflag ) {
			bptr.flag |= select_flag
            if( bptr.flag & draw_bond_flag ) {
				draw_bonds = true
                if( bptr.flag & cylinder_flag )
                    if( bptr.i_rad>max_bond_radius )
                        max_bond_radius = bptr.i_rad
            } 
        } else bptr.flag &= ~(select_flag|draw_bond_flag)
    })
    
    for_each_sbond(db, (sptr) => { // ignore zone_both
        flag = sptr.dst_atom.flag & sptr.src_atom.flag
        if( flag & select_flag ) {
			sptr.flag |= select_flag
            draw_surf = true
            sptr.dst_atom.flag |= touch_flag
            sptr.src_atom.flag |= touch_flag
        } else sptr.flag &= ~(select_flag)
    })

    for_each_back(db, (bptr) => { // ignore zone_both
        flag = bptr.dst_atom.flag & bptr.src_atom.flag
        if(!(flag & select_flag))
            bptr.flag &= ~(select_flag|draw_bond_flag)
    })

    if( draw_ribbon ) {
		draw_ribbon = false
        for(let chain=db.clist; chain; chain=chain.cnext)
            for(let group=chain.glist; group; group=group.gnext)
                if(group.flag & draw_knot_flag ) {
					for(let ptr=group.alist; ptr; ptr=ptr.anext)
                        if(is_alpha_carbon(ptr.refno) ||
                            is_sugar_phosphate(ptr.refno)) {
							if( !(ptr.flag & select_flag))
                                group.flag &= ~draw_knot_flag
                            break
                        }
                    if( group.flag & draw_knot_flag ) 
                        draw_ribbon = true
                }
    }

    determine_clipping()
	
    voxels_clean = false
    bucket_flag = false
}


const select_zone_expr = (db, expr) => {
    let bptr
    let sptr
    let pset
	let i

    if(!db)
        return

    select_count = 0
	
	// shortcut for defined atomsets
	if(expr.type == op_member) {	
		for(let qchain=db.clist; qchain; qchain=qchain.cnext)
		    for(let qgroup=qchain.glist; qgroup; qgroup=qgroup.gnext)
		        for(let qatom=qgroup.alist; qatom; qatom=qatom.anext)
		            qatom.flag &= ~select_flag

		p_set = expr.rgt.set
	    while( p_set ) {
			for(let i = 0 i < p_set.count;i++)  {
				qatom = p_set.data[i]
				qatom.flag |= select_flag
		        select_count++
			}
			p_set = p_set.next
		}
    } else {	
		for(let qchain=db.clist; qchain; qchain=qchain.cnext)
			for(let qgroup=qchain.glist; qgroup; qgroup=qgroup.gnext)
				for(let qatom=qgroup.alist; qatom; qatom=qatom.anext)
					if(evaluate_expr(expr)) {
						qatom.flag |= select_flag
						select_count++
					} else 
						qatom.flag &= ~select_flag
    }
    
    display_select_count()

    if(zone_both) {
		for_each_bond(db, (bptr) => {
           if( (bptr.src_atom.flag & bptr.dst_atom.flag) & select_flag ) {
				bptr.flag |= select_flag
           } else 
			   bptr.flag &= ~select_flag
		})
        for_each_sbond(db, (sptr) => {
           if( (sptr.src_atom.flag&sptr.dst_atom.flag) & select_flag ) {
				sptr.flag |= select_flag
           } else 
			   sptr.flag &= ~select_flag
		})
    } else {
        for_each_bond(db, (bptr) => {
           if( (bptr.srcatom.flag | bptr.dstatom.flag) & select_flag ) {
				bptr.flag |= select_flag
           } else 
			   bptr.flag &= ~select_flag	
		})
        for_each_sbond(db, (sptr) => {
           if( (sptr.src_atom.flag|sptr.dst_atom.flag) & select_flag ) {
				sptr.flag |= select_flag
           } else 
			   sptr.flag &= ~select_flag
		})
    }
}


const restrict_zone_expr = (expr) => {
    let bptr
    let sptr
    let chain
    let group
    let ptr
    let flag

    if(!db)
        return

    draw_atoms = false 
    draw_stars = false
    draw_bonds = false 
	
	max_atom_radius = 0  
	max_bond_radius = 0

    select_count = 0
	
    for(let qchain=db.clist; qchain; qchain=qchain.cnext)
        for(let qgroup=qchain.glist; qgroup; qgroup=qgroup.gnext)
            for(let qatom=qgroup.alist; qatom; qatom=qatom.anext)
                if( evaluateexpr(expr) ) {
					qatom.flag |= select_flag
                    select_count++

                    if( qatom.flag & sphere_flag ) {
						draw_atoms = true
                        if( qatom.irad>max_atom_radius )
                            max_atom_radius = qatom.i_rad
                    }
                    if(qatom.flag & star_flag)  {
						draw_stars = true
                        if( qatom.i_rad>max_atom_radius )
                            max_atom_radius = qatom.i_rad
                    }
                    if( qatom.flag & expandflag ) {
						if( (qatom.i_rad) + i_probe_rad>max_atom_radius)
                            max_atom_radius = (qatom.i_rad) + i_probe_rad
                    }
                }  else   {
					qatom.flag &= ~(select_flag | sphere_flag | star_flag | expand_flag)
                    if( qatom.label)  {
						delete_label(qatom.label)
                        qatom.label = void 0
                    }
                }
				
    display_select_count()

    for_each_bond(db, (bptr) => { // ignore zone_both
        flag = bptr.dst_atom.flag & bptr.src_atom.flag
        if( flag & select_flag ){
			bptr.flag |= select_flag
            if( bptr.flag & cylinder_flag ) {
				draw_bonds = true
                if( bptr.irad>max_bond_radius )
                    max_bond_radius = bptr.i_rad
            } else if( bptr.flag&wire_flag )
                draw_bonds = true
        } else bptr.flag &= ~(select_flag|draw_bond_flag)
    })
    
    for_each_sbond(db, (sptr) => { // ignore zone_both
        flag = sptr.dst_atom.flag & sptr.src_atom.flag
        if( flag & select_flag )  {
			sptr.flag |= select_flag
            draw_surf = true
            sptr.dst_atom.flag |= touch_flag
            sptr.src_atom.flag |= touch_flag
        } else sptr.flag &= ~(select_flag)
    })


    for_each_back(db, (bptr) => { // ignore zone_both
        flag = bptr.dstatom.flag & bptr.src_atom.flag
        if( !(flag & select_flag) )
            bptr.flag &= ~(select_flag | draw_bond_flag)
    })

    if(draw_ribbon) {
		draw_ribbon = false
        for(let chain=db.clist; chain; chain=chain.cnext )
            for(let group=chain.glist; group; group=group.gnext )
                if( group.flag & draw_knot_flag )  {
					for(let ptr=group.alist; ptr; ptr=ptr.anext )
                        if( is_alpha_carbon(ptr.refno) ||
                            is_sugar_phosphate(ptr.refno) ) {
							if( !(ptr.flag&select_flag) )
                                group.flag &= ~draw_knot_flag
                            break
                        }
                    if( group.flag & draw_knot_flag )
                        draw_ribbon = true
                }
    }

    determine_clipping()
    voxels_clean = false
    bucket_flag = false
}

const selectatom = (db, shift, patom, pgroup ) => {
	let bptr
    let sptr
	
	select_count = 0
	
	for(let qchain=db.clist; qchain; qchain=qchain.cnext)
		for(let qgroup=qchain.glist; qgroup; qgroup=qgroup.gnext)
			for(let qatom=qgroup.alist; qatom; qatom=qatom.anext)
				if( qatom.serno == patom.serno || 
					(model_include && 
					 qgroup.serno == pgroup.serno &&
					 qatom.serno - qgroup.alist.serno == 
					 patom.serno - pgroup.alist.serno) ) {	
						if( shift == -1 ) {	
							qatom.flag &= ~select_flag
						} else {	
							qatom.flag |= select_flag
							select_count++
						}
				} else  {	
					if(!shift)  {	
						qatom.flag &= ~select_flag
					} else {	
						if( qatom.flag & select_flag)
							select_count++
					}
				}

	display_select_count()

	if(zone_both) {
		for_each_bond(db, (ptr) => {
			if( (bptr.srcatom.flag&bptr.dstatom.flag) & selectflag ) {
				bptr.flag |= selectflag
           } else 
			   bptr.flag &= ~selectflag
		})
	} else {
	    for_each_sbond(db, (ptr) => {
			if( (sptr.srcatom.flag|sptr.dstatom.flag) & selectflag ) {  
				sptr.flag |= selectflag
           } else 
			   sptr.flag &= ~selectflag
		})
	}
}

const select_group = (shift, p_group) => {
	let bptr
    let sptr

	select_count = 0
	for(let qchain=db.clist; qchain; qchain=qchain.cnext )
		for(let qgroup=qchain.glist; qgroup; qgroup=qgroup.gnext )
			for(let qatom=qgroup.alist; qatom; qatom=qatom.anext )
				if( qgroup.serno == p_group.serno && 
					(model_include || qgroup.model == p_group.model) ) {	
						if( shift == -1 ) {	
							qatom.flag &= ~select_flag
						} else {	
							qatom.flag |= select_flag
							select_count++
						}
				} else  {	
					if(!shift)  {	
						qatom.flag &= ~select_flag
					} else {	
						if( qatom.flag & select_flag)
							select_count++
					}
				}

	display_select_count()

	if(zone_both) {
		for_each_bond(db, (bptr) => {
			if( (bptr.src_atom.flag&bptr.dst_atom.flag) & select_flag )  {
				bptr.flag |= selectflag
			} else 
				bptr.flag &= ~selectflag
		})
        for_each_sbond(db, (sptr) => {
			if( (sptr.src_atom.flag&sptr.dst_atom.flag) & select_flag ) {
				sptr.flag |= selectflag
			} else 
				sptr.flag &= ~selectflag
		})
	} else {
        for_each_bond(db, (bptr) => {
           if( (bptr.src_atom.flag|bptr.dst_atom.flag) & select_flag ) {
				bptr.flag |= selectflag
           } else 
			   bptr.flag &= ~selectflag		
		})
        for_each_sbond(db, (sptr) => {
           if( (sptr.src_atom.flag|sptr.dst_atom.flag) & select_flag ) {
				sptr.flag |= selectflag
           } else 
			   sptr.flag &= ~select_flag		
		})
	}
}

const select_chain = (shift, p_chain) {	
	let bptr
    let sptr

	select_count = 0
	for(let qchain=db.clist qchain qchain=qchain.cnext )
		for(let qgroup=qchain.glist qgroup qgroup=qgroup.gnext )
			for(let qatom=qgroup.alist qatom qatom=qatom.anext )
				if( qchain.ident == p_chain.ident &&
					(model_include || qchain.model == p_chain.model) ) {	
					if( shift == -1) {	
						qatom.flag &= ~select_flag
					} else {	
						qatom.flag |= select_flag
						select_count++
					}
				} else  {	
					if(!shift)  {	
						qatom.flag &= ~select_flag
					} else {	
						if( qatom.flag & select_flag)
							select_count++
					}
				}

	display_select_count()

	if( zoneboth ) {
		for_each_bond(db, (bptr) => {
		if( (bptr.srcatom.flag&bptr.dstatom.flag) & selectflag )  {
				bptr.flag |= selectflag
           } else 
			   bptr.flag &= ~selectflag
		})
        for_each_sbond(db, (sptr) => {
		if( (sptr.srcatom.flag&sptr.dstatom.flag) & selectflag ) {
				sptr.flag |= selectflag
           } else 
			   sptr.flag &= ~selectflag
		})
	} else {
        for_each_bond(db, (bptr) => {
           if( (bptr.srcatom.flag|bptr.dstatom.flag) & selectflag ) {
				bptr.flag |= selectflag
           } else 
			   bptr.flag &= ~selectflag
		})	
        for_each_sbond(db, (sptr) => {
           if( (sptr.srcatom.flag|sptr.dstatom.flag) & selectflag )  {
				sptr.flag |= selectflag
           } else 
			   sptr.flag &= ~selectflag
		})
	}
}


let define_shade = (db, r, g, b) => {
    let d, dr, dg, db
    let dist,best
    let i

    // already defined
    for(let i = 0; i < last_shade; i++)
        if(shade[i].ref_count)
            if((shade[i].r == r) && (shade[i].g == g) && (shade[i].b == b) )
                return i

    // allocate request
    for(let i=0 i<last_shade i++ )
         if( !shade[i].ref_count ) {
			shade[i].r = r
            shade[i].g = g
            shade[i].b = b
            shade[i].ref_count = 0
            return i
         }

    invalidate_cmd_line()
    console.log("warning: unable to allocate shade")

    //to aconst llet warning
    best = 0
	dist = 0

    //nearest match
    for(let i = 0; i < last_shade; i++ ) {
		dr = shade[i].r - r
        dg = shade[i].g - g
        db = shade[i].b - b
        d = dr * dr + dg * dg + db * db
        if( !i || (d<dist) ) {
			dist = d
            best = i
        }
    }
    return best
}


const scale_colour_map = (count) => {
    let i, r, g, b
    let fract

    scale_count = 0
	
    for(let i = 0;i < last_shade; i++)
        if(!shade[i].ref_count)
            scale_count++

    //if there are no shades free
    if( !scale_count ) 
		scale_count = last_shade

    if(count && (count < scale_count))
        scale_count = count

    if( scalecount == 1 )  {
		scaleref[i].r = 0
        scaleref[i].g = 0
        scaleref[i].b = 255
        scaleref[i].shade = 0
        scaleref[i].col = 0
        return
    }
    
    for(let i = 0; i < scalecount; i++) {
		fract = Math.round((1023 * i) / (scalecount - 1))
        if( fract < 256 )  {
			r = 0
			g = fract
			b = 255
        } else if( fract < 512 ) {
			r = 0
			g = 255
			b = 511-fract
        } else if( fract < 768 ) {
			r = fract - 512
			g = 255
			b = 0
        } else { //fract < 1024
			r = 255
			g = 1023 - fract
			b = 0
        }
        scaleref[i].r = r
        scaleref[i].g = g
        scaleref[i].b = b
        scaleref[i].shade = 0
        scaleref[i].col = 0
    }
}


const set_lut_entry = (i, r, g, b) => {
    ulut[i] = true
    rlut[i] = r
    glut[i] = g
    blut[i] = b

    lut[i] = 1
}

const define_colour_map = () => {
    let diffuse, fade
    let temp, inten
    let col, r, g, b

    for(let i = 0; i < lutsize; i++)
        ulut[i] = false

    if(!display_mode) {
		set_lut_entry(back_col, back_r, back_g, back_b)
        set_lut_entry(label_col, lab_r, lab_g, lab_b)
        set_lut_entry(box_col, box_r, box_g, box_b)
    } else setlutentry(back_col, 80, 80, 80)

    diffuse = 1.0 - ambient
    if(display_mode) {
		for(let i = 0; i < colour_depth; i++) {
			temp = i / colour_mask
            inten = diffuse * temp + ambient

            //unselected [40,40,255]
            //selected   [255,160,0]
            r = Math.round(255 * inten)
            g = Math.round(160 * inten)
            b = Math.round(40 * inten)

            // aconst borland compiler warning
            // shade2colour(0) == firstcol    
            set_lut_entry( first_col + i, b, b, r )
            set_lut_entry( shade_2_colour(1) + i, r, g, 0 )
        }
    } else
        for(let i = 0; i < colour_depth; i++) {
			temp = i / colour_mask
 			
			if( shade_power )
				temp = Math.pow(temp, shadepower / 10) // Math.exp?

            inten = diffuse * temp + ambient
            fade = 1.0 - inten

            if( fake_specular ) {
				temp = Math.pow(temp, specpower)
                k = Math.round(255 * temp)
                temp = 1.0 - temp
                inten *= temp
                fade *= temp
            }

            for(let j = 0; j < lastshade; j++)
                if(shade[j].ref_count)  {
					col = shade_2_colour(j)
                    if(use_back_fade) {
						temp = 1.0 - inten
                        r = Math.round(shade[j].r * inten + fade * backr) 
                        g = Math.round(shade[j].g * inten + fade * backg)
                        b = Math.round(shade[j].b * inten + fade * backb)
                    } else {
						r = Math.round(shade[j].r * inten) 
                        g = Math.round(shade[j].g * inten)
                        b = Math.round(shade[j].b * inten)
                    }

                    if( fake_specular ) {
						r += k
                        g += k
                        b += k
                    }
                    set_lut_entry(col + i, r, g, b)
                }
        }

    if(interactive)
        allocate_colour_map()
}


const resetcolourmap = () => {
    for(let i = 0; i < 256; i++)
        ulut[i] = false

    spec_power = 8
    fake_specular = false
    shade_power = 0
    ambient = default_ambient
    use_back_fade = false
	use_dot_col_pot = false

    back_r = 0
	back_g = 0
	back_b = 0
    box_r = 255
	box_g = 255
	box_b = 255
    lab_r = 255
	lab_g = 255
	lab_b = 255
	dot_r = 255
	dot_g = 255
	dot_b = 255

    for(let i=0; i < lastshade; i++)
        shade[i].ref_count = 0
    
	scale_count = 0

    for (let i=0; i < altldepth; i++)
      altl_colours[i] = 0
}


const colour_bond_none = () => {
    if(db)
        for_each_bond(db, (bptr) => {
            if( (bptr.flag&selectflag) && bptr.col ) {
				shade[colour_2_shade(bptr.col)].ref_count--
                bptr.col = 0
            }
		})
}


const colour_bond_attrib = (r, g, b) => {
    let shade,col

    if(db) {
		for_each_bond(db, (bptr) => {
            if( (bptr.flag&selectflag) && bptr.col )
                shade[colour2shade(bptr.col)].refcount--
		})
		
        shade = defineshade(r,g,b)
        col = shade2colour(shade)

        for_each_bond(db, (bptr) =>
            if( bptr.flag&selectflag ) {
				shade[shade].refcount++
                bptr.col = col
            }
		})
    }
}


const colour_back_none = (db) => {
    let flag

    if(db)
        for_each_back(db, (bptr) => {
			flag = zoneboth? bptr.dst_atom.flag & bptr.src_atom.flag
                           : bptr.dst_atom.flag | bptr.src_atom.flag

            if( flag & select_flag ) {
				bptr.flag |= select_flag
                if( bptr.col ) {
					shade[colour_2_shade(bptr.col)].ref_count--
                    bptr.col = 0
                }
            } else bptr.flag &= ~select_flag
        })
}


const colour_back_attrib = (db, r, g, b) => {
    let shade, col
    let chain

    if(db) {
		colour_back_none()
        shade = define_shade(r,g,b)
        col = shade_2_colour(shade)

        for_each_back(db, (bptr) => {
            if( bptr.flag&selectflag ) {
				shade[shade].refcount++
                bptr.col = col
            }
		})
    }
}


const colour_hbond_none = (hbonds) => {
    let list
    let ptr
    let src
    let dst

    if(!db)
        return

    list = hbonds ? db.hlist : db.slist

    if (zone_both) {
		for( ptr=list ptr ptr=ptr.hnext )  {
			src = ptr.src  dst = ptr.dst
			
			if( (src.flag&dst.flag) & select_flag ) {
				ptr.flag |= select_flag
				
                if( ptr.col )  {
					shade[colour_2_shade(ptr.col)].ref_count--
                    ptr.col = 0
                }
            } else ptr.flag &= ~select_flag
        }
    } else
        for( ptr=list ptr ptr=ptr.hnext )  {
			src = ptr.src  dst = ptr.dst

            if( (src.flag|dst.flag) & select_flag ) {
				ptr.flag |= select_flag
                if( ptr.col )  {
					shade[colour_2_shade(ptr.col)].ref_count--
                    ptr.col = 0
                }
            } else 
				ptr.flag &= ~select_flag
        }
}


const colour_hbond_type = (db) => {
    let ref

    if(!db) 
		return
	
    for(let i = 0; i < 7; i++)
        hbond_shade[i].col = 0

    if(info.hbond_count < 0)  {
		calc_hydrogen_bonds()
    } else colour_hbond_none(true)

    for(let ptr = db.hlist; ptr; ptr = ptr.hnext)
        if(ptr.flag & select_flag) {
			switch(ptr.offset) {
				case( 2):  
					ref = hbond_shade     	
					break
                case( 3):  
					ref = hbond_shade + 1   
					break
                case( 4):  
					ref = hbond_shade + 2   
					break
                case( 5):  
					ref = hbond_shade + 3   
					break
                case(-3):  
					ref = hbond_shade + 4   
					break
                case(-4):  
					ref = hbond_shade + 5   
					break
                default:   
					ref = hbond_shade + 6   
					break
            }

            if(!ref.col) {
				ref.shade = define_shade(ref.r, ref.g, ref.b)
                ref.col = shade_2_colour(ref.shade)
            }
            shade[ref.shade].ref_count++
            ptr.col = ref.col
        }
}


const colour_hbond_attrib = (db, hbonds, r, g, b) => {
    let list
    let col, shade

    if(!db)
        return

    if(hbonds) {
		if( info.hbondcount < 0 ) {
			calc_hydrogen_bonds()
        } else colour_hbond_none(true)
    } else
        if( info.ssbond_count < 0 ) {
			find_disulphide_bridges()
        } else colour_hbond_none(false)


    shade = define_shade(r,g,b)
    col = shade_2_colour(shade)

    list = hbonds ? db.hlist : db.slist
	
    for(let ptr=list; ptr; ptr=ptr.hnext)
        if( ptr.flag & select_flag ) {
			shade[shade].ref_count++
            ptr.col = col
        }
}


const colour_ribbon_none = (flag) => {
    if(!db)
        return

    if( info.helix_count < 0 )
        return

    for(let chain=db.clist; chain; chain=chain.cnext)
        for(let group=chain.glist; group; group=group.gnext)
            for(let aptr=group.alist; aptr; aptr=aptr.anext)
                if( (aptr.flag & select_flag) && 
                    (is_alpha_carbon(aptr.refno)||
                     is_sugar_phosphate(aptr.refno))) {
						if( (flag & rib_col_inside) && group.col1 )  {
							shade[colour_2_shade(group.col1)].ref_count--
							group.col1 = 0
						}
						if( (flag & rib_col_outside) && group.col2 ) {
							shade[colour_2_shade(group.col2)].ref_count--
							group.col2 = 0
						}
                    break
                }
}


const colour_ribbon_attrib = (db, flag, r, g, b) => {
    let shade, col

    if(db)  {
		if( info.helix_count >= 0 ) {
			colour_ribbon_none(flag)
        } else 
			determine_structure(false)

        shade = define_shade(r,g,b)
        col = shade_2_colour(shade)

        for(let chain=db.clist; chain; chain=chain.cnext)
            for(let group=chain.glist; group; group=group.gnext)
                for(let aptr=group.alist; aptr; aptr=aptr.anext)
                    if( (aptr.flag & select_flag) && 
                        (is_alpha_carbon(aptr.refno)||
                         is_sugar_phosphate(aptr.refno)) ) {
							if( flag & rib_col_inside ) {
								shade[shade].ref_count++
								group.col1 = col
							}
							if( flag & rib_col_outside ) {
								shade[shade].ref_count++
								group.col2 = col
							}
                        break
                    }
    }
}


const colour_monit_none = () => {
    let flag

    if(db)
        for(let ptr=monit_list; ptr; ptr=ptr.next)
            if( ptr.col ) {
				flag = zone_both? ptr.src.flag & ptr.dst.flag
                               : ptr.src.flag | ptr.dst.flag
                if( flag & selectflag ) {
					shade[colour_2_shade(ptr.col)].ref_count--
                    ptr.col = 0
                }
            }
}


const colour_monit_attrib = (r, g, b) => {
    let shade,col
    let flag

    if(!db)
        return

    colour_monit_none()
    shade = define_shade(r, g, b)
    col = shade_2_colour(shade)

    for(let ptr=monitlist; ptr; ptr=ptr.next)  {
		flag = zone_both? ptr.src.flag & ptr.dst.flag 
                       : ptr.src.flag | ptr.dst.flag
        if( flag & select_flag ) {
			shade[shade].ref_count++
            ptr.col = col
        }
    }
}


const colour_dots_attrib = (r, g, b) => {
    let shade, col

	dot_r = r
	dot_g = g
	dot_b = b
	use_dot_col_pot = false

    if(db) {
		for(let ptr = dotptr; ptr; ptr = ptr.next)
            for(let i=0; i < ptr.count; i++) {
				shade = colour_2_shade(ptr.col[i])
                shade[shade].ref_count--
            }

			shade = define_shade(r, g, b)
			col = shade_2_colour(shade)
			for(let ptr = dotptr; ptr; ptr=ptr.next)
            for(let i=0; i<ptr.count; i++) {
				shade[shade].ref_count++
                ptr.col[i] = col
            }
    }
}


// coulomb's law
const coulomb_scale = 1<<12

const calculate_potential = (db, x, y, z) => {
    let dx, dy, dz
    let result
    let dist
    let max


    //calculated charges have b-values < 0.0    
    //if( minfun(minmaintemp,minhetatemp) >= 0 )
    //    calculate_charges()                    
	//
    //8.0 angstrom cut off
    
	max = 2000 * 2000

    result = 0
	for_each_atom(db, (c, g, ptr) {
		dx = ptr.xorg + ptr.fxorg - x
        if((dist= dx * dx) < max ) {
			dy = ptr.yorg + ptr.fyorg - y
            if( (dist += dy * dy) < max ) {
				dz = ptr.zorg + ptr.fzorg - z
                if((dist += dz * dz) < max)
                    result += (coulomb_scale * ptr.temp)) / Math.round(Math.sqrt(dist))
            }
        }
    })
	
    // dielectric constant = 10.0
    // (332.0*250.0)/(10.0*100.0)
    result = (result * 83) / coulombscale
	
    return Math.round(result)
}


const colour_dots_potential = () => {
    let shade, result
    let ref

	usedotcolpot = true

    if(db) {
		for(let i = 0; i < 8; i++)
            potential_shade[i].col = 0

        // colour dots none
        for(let ptr = dotptr; ptr; ptr = ptr.next)
            for(let i = 0; i<ptr.count; i++) {
				shade = colour_2_shade(ptr.col[i])
                shade[shade].ref_count--
            }

        for(let ptr=dotptr; ptr; ptr=ptr.next)
            for(let i=0; i<ptr.count; i++) {
				result = calculate_potential( ptr.xpos[i],
                                             ptr.ypos[i],
                                             ptr.zpos[i])

                // determine colour bucket
                if(result >= 0) {
					if( result > 10 ) {
						if( result > 24 ) {
								ref = potential_shade + 0
                           } else 
							   ref = potential_shade + 1
                    } else if( result > 3 ) {
							ref = potential_shade + 2
						} else 
							ref = potential_shade + 3
                } else 
                    if( result > -10 ) {
						if( result > -3 ) {
								ref = potential_shade + 4
                           } else 
							   ref = potential_shade + 5
                    } else if(result > -24) {
							ref = potential_shade + 6
						} else 
							ref = potential_shade + 7

                if(!ref.col) {
					ref.shade = define_shade(ref.r, ref.g, ref.b)
                    ref.col = shade_2_colour(ref.shade)
                }
				
                shade[ref.shade].ref_count++
                ptr.col[i] = ref.col
            }
    }
}

const colour_point_attrib = (db, r, g, b, mapno) => {
    let shade, nshade, result
    let x, y, z
    
    let map_point_sptr
    let mapinfo

	map_rgb_col[0] = r
	map_rgb_col[1] = g
	map_rgb_col[2] = b
	
	use_dot_col_pot = false
    
    nshade = define_shade(r,g,b)
    
    if (map_info_ptr)
      if (mapno >= 0 && mapno < map_info_ptr.size) {
      	vector_get_element((generic_vec __far *)mapinfoptr,(const __far *)&mapinfo,mapno )
      	mappointsptr = mapinfo.mappointsptr
      	
        if (mappointsptr)
        for (i=0 i<mappointsptr.size i++) {
          if (!(mappointsptr.array[i]).flag&selectflag) continue
          x = (mappointsptr.array[i]).xpos
          y = (mappointsptr.array[i]).ypos
          z = (mappointsptr.array[i]).zpos
        	
          shade = colour2shade((mappointsptr.array[i]).col)
          shade[shade].refcount--
        	
          result = calculatepotential( x, y, z )
        	
          shade[nshade].refcount++
          (mappointsptr.array[i]).col = shade2colour(nshade)
              
        }
              
        }
}



const colourpointpotential( let mapno )
{
    let i,shade,result
    register shaderef *ref
    
    mappointvec __far *mappointsptr
    mapinfo mapinfo
    long x, y, z

	usedotcolpot = true

    if (mapinfoptr)
      if (mapno >= 0 && mapno < mapinfoptr.size) {
      	vector_get_element((genericvec __far *)mapinfoptr,(const __far *)&mapinfo,mapno )
      	mappointsptr = mapinfo.mappointsptr
      	
        if (mappointsptr)
        for (i=0 i<mappointsptr.size i++) {
          if (!(mappointsptr.array[i]).flag&selectflag) continue
          x = (mappointsptr.array[i]).xpos
          y = (mappointsptr.array[i]).ypos
          z = (mappointsptr.array[i]).zpos
        	
          shade = colour2shade((mappointsptr.array[i]).col)
          shade[shade].refcount--
        	
          result = calculatepotential( x, y, z )
        	
          /* determine colour bucket */
          if( result >= 0 ) {
            if( result > 10 ) {
              if( result > 24 ) {
                 ref = potentialshade + 0
              } else ref = potentialshade + 1
            } else if( result > 3 ) {
              ref = potentialshade + 2
            } else ref = potentialshade + 3
          } else if( result > -10 ) {
            if( result > -3 ) {
              ref = potentialshade + 4
            } else ref = potentialshade + 5
          } else if( result > -24 ) {
            ref = potentialshade + 6
          } else ref = potentialshade + 7

          if( !ref.col ) {
            ref.shade = defineshade( ref.r, ref.g, ref.b )
            ref.col = shade2colour(ref.shade)
          }
          shade[ref.shade].refcount++
          (mappointsptr.array[i]).col = ref.col
              
        }
              
        }


}

const colourpointatom( let mapno )
{
    let i,shade
    const cneartree_far * objclosest
    
    mappointvec __far *mappointsptr
    mapinfo mapinfo
    double coord[3]
    
    if (!atomtree) {
        if (createatomtree()) {
            rasmolfatalexit(msgstrs[strmalloc])
        }
    }
    
	usedotcolpot = true
    
    if (mapinfoptr)
        if (mapno >= 0 && mapno < mapinfoptr.size) {
            vector_get_element((genericvec __far *)mapinfoptr,(const __far *)&mapinfo,mapno )
            mappointsptr = mapinfo.mappointsptr
            
            if (mappointsptr)
                for (i=0 i<mappointsptr.size i++) {
                    if (!(mappointsptr.array[i]).flag&selectflag) continue
                    coord[0] = (double)(mappointsptr.array[i]).xpos
                    coord[1] = (double)(mappointsptr.array[i]).ypos
                    coord[2] = (double)(mappointsptr.array[i]).zpos
                    
                    if (!cneartreenearestneighbor(atomtree,(double)(1500+proberadius),null,&objclosest,coord)) {
                        shade = colour2shade((mappointsptr.array[i]).col)
                        shade[shade].refcount--
                        (mappointsptr.array[i]).col = (*((ratom __far * *)objclosest)).col
                        shade = colour2shade((mappointsptr.array[i]).col)
                        shade[shade].refcount++
                    }
                 }
        }
}



static const resetcolourattrib( const )
{
    register chain __far *chain
    register group __far *group
    register ratom __far *ptr

    for_each_atom
        if( (ptr.flag&selectflag) && ptr.col )
            shade[colour2shade(ptr.col)].refcount--
}


const monocolourattrib( let r, let g, let b )
{
    let shade,col
    register chain __far *chain
    register group __far *group
    register ratom __far *ptr

    if(db)
    {
resetcolourattrib()
        shade = defineshade(r,g,b)
        col = shade2colour(shade)

        for_each_atom
            if( ptr.flag&selectflag )
            {
shade[shade].refcount++
                ptr.col = col
            }
    }
}

const addaltlcolours( const )
{
    let i, ic
    register shaderef *ref
    register chain __far *chain
    register group __far *group
    register ratom __far *ptr

    /* add colours for any alternate conformations used */    

    for_each_atom
        if( ptr.flag&selectflag )
	  {
if(! (ptr.altl == '\0' || ptr.altl == ' ') ){
            ic = (((int)(ptr.altl))&(altldepth-1))+1
            i = (int)((long)scalecount*(ic--)/(altldepth))

            if( i >= scalecount )
            {
ref = scaleref + (scalecount-1)
            } else if( i >= 0 )
            {
ref = scaleref + i
            } else ref = scaleref

            if( !(ref.col && shade[ref.shade].refcount) )
            {
ref.shade = defineshade(ref.r,ref.g,ref.b)
                ref.col = shade2colour(ref.shade)
            }
            shade[ref.shade].refcount++
             altlcolours[ic] = ref.col
           }
	}
 }

const scalecolourattrib( let attr )
{
    register shaderef *ref
    let count, attrno, factor
    register chain __far *chain
    register group __far *group
    register ratom __far *ptr
    register long temp
    let i

    if(!db) return
	colourbondnone()

    switch( attr )
    {
case(chainattr):   attrno = info.chaincount   
                           factor = 1
                           break

        case(groupattr):   factor = minmainres
                           attrno = maxmainres
                           if( hetagroups && hetagroupcount )
                           {
if( minhetares < factor )
                                   factor = minhetares
                               if( maxhetares > attrno )
                                   attrno = maxhetares
                           } 
                           attrno -= (factor-1)
                           break

        case(modelattr):   factor = minmodel
                           attrno = maxmodel-minmodel+1
                           break

        case(altattr):     factor = 1
                           attrno = altldepth
                           break

        case(chargeattr):
        case(tempattr):    factor = minmaintemp
                           attrno = maxmaintemp
                           if( hetagroups && hetagroupcount )
                           {
if( minhetatemp < factor )
                                   factor = minhetatemp
                               if( maxhetatemp > attrno )
                                   attrno = maxhetatemp
                           }
                           attrno -= (factor-1)
                           break

        default:           return
    }

    if( attrno<2 )
    {
monocolourattrib(255,255,255)
        return
    } 

    resetcolourattrib()
    scalecolourmap(attrno)

        switch( attr )
        {
 case(chainattr):
                 count = 0
                 for( chain=db.clist chain chain=chain.cnext )
                 {
ref = &(scaleref[(count*scalecount)/attrno])
                     if( !(ref.col && shade[ref.shade].refcount) )
                     {
ref.shade = defineshade(ref.r,ref.g,ref.b)
                         ref.col = shade2colour(ref.shade)
                     }
                     for( group=chain.glist group group=group.gnext )
                         for( ptr=group.alist ptr ptr=ptr.anext )
                             if( ptr.flag&selectflag )
                             {
shade[ref.shade].refcount++
                                 ptr.col = ref.col
                             }
                     count++
                 }
                 break


         case(groupattr):
                 for( chain=db.clist chain chain=chain.cnext )
                     for( group=chain.glist group group=group.gnext )
                     {
temp = (long)scalecount*(group.serno-factor)
                         i = (int)(temp/attrno)

                         if( i >= scalecount )
                         {
ref = scaleref + (scalecount-1)
                         } else if( i >= 0 )
                         {
ref = scaleref + i
                         } else ref = scaleref

                         if( !(ref.col && shade[ref.shade].refcount) )
                         {
ref.shade = defineshade(ref.r,ref.g,ref.b)
                             ref.col = shade2colour(ref.shade)
                         }

                         for( ptr=group.alist ptr ptr=ptr.anext )
                             if( ptr.flag&selectflag )
                             {
shade[ref.shade].refcount++
                                 ptr.col = ref.col
                             }
                     }
                 break

         case(modelattr):
                 for( chain=db.clist chain chain=chain.cnext )
                     for( group=chain.glist group group=group.gnext )
                     {
temp = (long)scalecount*(group.model-factor)
                         i = (int)(temp/attrno)

                         if( i >= scalecount )
                         {
ref = scaleref + (scalecount-1)
                         } else if( i >= 0 )
                         {
ref = scaleref + i
                         } else ref = scaleref

                         if( !(ref.col && shade[ref.shade].refcount) )
                         {
ref.shade = defineshade(ref.r,ref.g,ref.b)
                             ref.col = shade2colour(ref.shade)
                         }

                         for( ptr=group.alist ptr ptr=ptr.anext )
                             if( ptr.flag&selectflag )
                             {
shade[ref.shade].refcount++
                                 ptr.col = ref.col
                             }
                     }
                 break


         case(altattr):
                 for_each_atom
                     if( ptr.flag&selectflag )
		     {
if (ptr.altl == '\0' || ptr.altl == ' ') i=0
                         else i = (((int)(ptr.altl))&(altldepth-1))+1
                         i = (int)((long)scalecount*i/attrno)

                         if( i >= scalecount )
                         {
ref = scaleref + (scalecount-1)
                         } else if( i >= 0 )
                         {
ref = scaleref + i
                         } else ref = scaleref

                         if( !(ref.col && shade[ref.shade].refcount) )
                         {
ref.shade = defineshade(ref.r,ref.g,ref.b)
                             ref.col = shade2colour(ref.shade)
                         }
                         shade[ref.shade].refcount++
                         ptr.col = ref.col
                     }
                 break


                 
         case(tempattr):
                 for_each_atom
                     if( ptr.flag&selectflag )
                     {
i = (int)(((long)scalecount*(ptr.temp-factor))
                                    /attrno)

                         if( i >= scalecount )
                         {
ref = scaleref + (scalecount-1)
                         } else if( i >= 0 )
                         {
ref = scaleref + i
                         } else ref = scaleref

                         if( !(ref.col && shade[ref.shade].refcount) )
                         {
ref.shade = defineshade(ref.r,ref.g,ref.b)
                             ref.col = shade2colour(ref.shade)
                         }
                         shade[ref.shade].refcount++
                         ptr.col = ref.col
                     }
                 break

        case(chargeattr):
                for_each_atom
                     if( ptr.flag&selectflag )
                     {
i = (int)(((long)scalecount*(ptr.temp-factor))
                                    /attrno)

                         if( i <= 0 )
                         {
ref = scaleref + (scalecount-1)
                         } else if( i < scalecount )
                         {
ref = scaleref + ((scalecount-1)-i)
                         } else ref = scaleref

                         if( !(ref.col && shade[ref.shade].refcount) )
                         {
ref.shade = defineshade(ref.r,ref.g,ref.b)
                             ref.col = shade2colour(ref.shade)
                         }
                         shade[ref.shade].refcount++
                         ptr.col = ref.col
                     }
                 break
        }
           
    /* now add colours for any alternate conformations used */    

    addaltlcolours()
	if (dotcount && !useoldcolorcode)
		calculatesurface(dotcount)
    return      

}



/*====================================*/
/*  raster3d color record processing  */
/*====================================*/

static let matchnumber( let len, let value, char *mask )
{
    register char digit, template
    let result
    let i

    result = true
    for( i=0 i<len i++ )
    {
digit = (value%10) + '0'
        template = mask[len-i]
        if( template==' ' )
        {
if( value ) result = false
        } else if( !matchchar(template,digit) )
            result = false
        value /= 10
    }
    return result
}


const usermaskattrib( let fields )
{
    register maskdesc *mptr
    register char *temp, *name
    let shade, change
    let i, rad, match
    register chain __far *chain
    register group __far *group
    register ratom __far *ptr

    if(!db) return

    if( !maskcount )
    {
invalidatecmndline()
        console.log("warning: no user supplied colour records!\n")
        return
    }

    /* aconst compiler warning*/
    mptr = (maskdesc*)0
    match = false

    change = false
    resetcolourattrib()
    if( fields & maskcolourflag )
        for( i=0 i<maskcount i++ )
            maskshade[i] = -1

    if( fields & maskradiusflag )
    {
maxatomradius = 0
        drawatoms = false
        drawstars = false
    }

    for_each_atom
    if( ptr.flag & selectflag )
    {
for( i=0 i<maskcount i++ )
        {
mptr = usermask+i
            temp = mptr.mask
            match = true

            if( !matchchar(temp[13],chain.ident) ) match=false
            if( !matchchar(temp[9],ptr.altl) )     match=false

            /* atom name */
            if( match )
            {
name = elemdesc[ptr.refno]
                if( !matchchar(temp[5],name[0]) ) match=false
                if( !matchchar(temp[6],name[1]) ) match=false
                if( !matchchar(temp[7],name[2]) ) match=false
                if( !matchchar(temp[8],name[3]) ) match=false
            }

            /* group name */
            if( match )
            {
name = residue[group.refno]
                if( !matchchar(temp[10],name[0]) ) match=false
                if( !matchchar(temp[11],name[1]) ) match=false
                if( !matchchar(temp[12],name[2]) ) match=false
            }

            if( match && (mptr.flags&sernoflag) )
                match = matchnumber(4,ptr.serno,&temp[0])
            if( match && (mptr.flags&resnoflag) )
                match = matchnumber(3,group.serno,&temp[14])
            if( match ) break
        }

        if( fields & maskcolourflag )
        {
if( match )
            {
if( maskshade[i] == -1 )
                {
maskshade[i] = defineshade(mptr.r,mptr.g,mptr.b)
                    maskcolour[i] = shade2colour(maskshade[i])
                }
                shade[maskshade[i]].refcount++
                ptr.col = maskcolour[i]
            } else
            {
shade = defineshade(255,255,255)
                ptr.col = shade2colour(shade)
                shade[shade].refcount++
            }
        }

        if( fields & maskradiusflag )
        {
rad = match? mptr.radius : 375
            ptr.irad = r_int(scale * rad))
            ptr.flag |= sphereflag
            ptr.radius = rad

            if( ptr.irad>maxatomradius )
                maxatomradius = ptr.irad
            change = true
        }
    } else 
    {
if( ptr.flag & (sphereflag|touchflag|expandflag) )
        {
drawatoms = true
        if( ptr.irad>maxatomradius )
            maxatomradius = ptr.irad
        }
        if( ptr.flag & starflag )
        {
drawstars = true
        if( ptr.irad>maxatomradius )
            maxatomradius = ptr.irad
        }
        if( ptr.flag & touchflag )
        {
drawsurf = true
        if( ptr.irad>maxatomradius )
            maxatomradius = ptr.irad
        }
        if( ptr.flag & expandflag )
        {
          if( (ptr.irad)+iproberad>maxatomradius )
            maxatomradius = (ptr.irad)+iproberad
        }
     }

    if( change )
    {
drawatoms = true
        determineclipping()
        voxelsclean = false
        bucketflag = false
    }
}

/* remove this... maybe */
const testflags (void)
{
	/* test function for loadselection and saveselection */
	register chain __far *chain
	register group __far *group
	register ratom __far *ptr

	let i = 0
	char tmp[255]

	console.log("showing flags:\n"
			  "\tatom#\tname\tsaved?\tselected?\n")

	for_each_atom
	{
		sprintf(tmp,"\t%d\t%s",i,elemdesc[ptr.refno])
		console.log(tmp)
		if (ptr.flag & saveflag)
		{
			sprintf(tmp, "\tsaved")
			console.log(tmp)
		}
		else
		{
			sprintf(tmp,"\tno")
			console.log(tmp)
		}

		if (ptr.flag & selectflag)
		{
			sprintf(tmp,"\tselected")
			console.log(tmp)
		}
		else
		{
			sprintf(tmp,"\tno")
			console.log(tmp)
		}
		sprintf(tmp,"\n")
		console.log(tmp)
		i++
	}
}



	

const cpkcolourattrib( const )
{
    register shaderef *ref
    register chain __far *chain
    register group __far *group
    register ratom __far *ptr
    let i

    if(!db) return
	colourbondnone()
    for( i=0 i<cpkmax i++ )
        cpkshade[i].col = 0
    resetcolourattrib()
    scalecolourmap(cpkmax)

	/* test for saveselection 
	console.log("saving selection...\n")
	saveselection()
	testflags()

	selectzone(allatomflag)
	testflags()*/

    for_each_atom
        if( ptr.flag&selectflag )
        {
ref = cpkshade + element[ptr.elemno].cpkcol

            if( !ref.col )
            {
ref.shade = defineshade( ref.r, ref.g, ref.b )
                ref.col = shade2colour(ref.shade)
            }
            shade[ref.shade].refcount++
            ptr.col = ref.col
        }

    addaltlcolours()
	if (dotcount && !useoldcolorcode)
		calculatesurface(dotcount)

	/*console.log("loading selection...\n")
	loadselection()
	testflags()*/

}

const cpknewcolourattrib( const )
{
    register shaderef *ref
    register chain __far *chain
    register group __far *group
    register ratom __far *ptr
    let i

    if (!db) return
	colourbondnone()
    for ( i=0 i<cpknewmax i++ )
	 cpknewshade[i].col = 0
    resetcolourattrib()
    scalecolourmap(cpknewmax)

    for_each_atom
	if( ptr.flag&selectflag )
	{
ref = cpknewshade + element[ptr.elemno].cpkcol

	    if( !ref.col )
	    {
ref.shade = defineshade( ref.r, ref.g, ref.b )
		ref.col = shade2colour(ref.shade)
	    }
	    shade[ref.shade].refcount++
	    ptr.col = ref.col
	}
    addaltlcolours()
	if (dotcount && !useoldcolorcode)
		calculatesurface(dotcount)
}



const aminocolourattrib( const )
{
    register shaderef *ref
    register chain __far *chain
    register group __far *group
    register ratom __far *ptr
    let i

    if(!db) return
	colourbondnone()
    for( i=0 i<13 i++ )
        aminoshade[i].col = 0
    resetcolourattrib()
    scalecolourmap(13)

    for_each_atom
        if( ptr.flag&selectflag )
        {
if( isamino(group.refno) )
            {
ref = aminoshade + aminoindex[group.refno]
            } else ref = aminoshade+12

            if( !ref.col )
            {
ref.shade = defineshade( ref.r, ref.g, ref.b )
                ref.col = shade2colour(ref.shade)
            }
            shade[ref.shade].refcount++
            ptr.col = ref.col
        }

    addaltlcolours()
	if (dotcount && !useoldcolorcode)
		calculatesurface(dotcount)

}


const shapelycolourattrib( const )
{
    register shaderef *ref
    register chain __far *chain
    register group __far *group
    register ratom __far *ptr
    let i

    if(!db) return
	colourbondnone()
    for( i=0 i<30 i++ )
        shapely[i].col = 0
    resetcolourattrib()
    scalecolourmap(30)

    for_each_atom
        if( ptr.flag&selectflag )
        {
if( isaminonucleo(group.refno) )
            {
ref = shapely + group.refno
            } else ref = shapely+30

/*  original colour scheme
 *
 *  ref = &(shapely[26])
 *  if( isnucleo(group.refno) )
 *  {
ref = shapely + group.refno
 *  } else if( isshapelybackbone(ptr.refno) )
 *  {
ref = &(shapely[24])
 *  } else if( isshapelyspecial(ptr.refno) )
 *  {
ref = &(shapely[25])
 *  } else if( isamino(group.refno) )
 *      ref = shapely + group.refno
 */

            if( !ref.col )
            {
ref.shade = defineshade( ref.r, ref.g, ref.b )
                ref.col = shade2colour(ref.shade)
            }
            shade[ref.shade].refcount++
            ptr.col = ref.col
        }

    addaltlcolours()
	if (dotcount && !useoldcolorcode)
		calculatesurface(dotcount)

}


const structcolourattrib( const )
{
    register shaderef *ref
    register chain __far *chain
    register group __far *group
    register ratom __far *ptr
    let i

    if(!db)
        return
	colourbondnone()

    if( info.helixcount < 0 )
        determinestructure(false)

    for( i=0 i<4 i++ )
        structshade[i].col = 0
    resetcolourattrib()

    for_each_atom
        if( ptr.flag&selectflag )
        {
if( group.struc & helixflag )
            {
ref = structshade+1
            } else if( group.struc & sheetflag )
            {
ref = structshade+2
            } else if( group.struc & turnflag )
            {
ref = structshade+3
            } else ref = structshade

            if( !ref.col )
            {
ref.shade = defineshade( ref.r, ref.g, ref.b )
                ref.col = shade2colour(ref.shade)
            }
            shade[ref.shade].refcount++
            ptr.col = ref.col
        }

    addaltlcolours()
	if (dotcount && !useoldcolorcode)
		calculatesurface(dotcount)

}


let iscpkcolour( ratom __far *ptr )
{
    register shaderef *cpk
    register shadedesc *col

    cpk = cpkshade + element[ptr.elemno].cpkcol
    col = shade + colour2shade(ptr.col)
    return( (col.r==cpk.r) && 
            (col.g==cpk.g) && 
            (col.b==cpk.b) )
}


let iscpknewcolour( ratom __far *ptr )
{
    register shaderef *cpknew
    register shadedesc *col

    cpknew = cpknewshade + element[ptr.elemno].cpkcol
    col = shade + colour2shade(ptr.col)
    return( (col.r==cpknew.r) &&
            (col.g==cpknew.g) &&
	    (col.b==cpknew.b) )
}
	

let isvdwradius( ratom __far *ptr )
{
    let rad

    if( ptr.flag & sphereflag )
    {
rad = elemvdwradius( ptr.elemno )
        return( ptr.radius == rad )
    } else return false
}


const defaultrepresentation( const )
{
    if(db) {
        redrawflag |= rfrefresh | rfcolour
        switch(repdefault) {
            case rep_backbone:
                enablebackbone(cylinderflag,80,64)
                break
            case rep_sticks:
                if( mainatomcount<256 ) {
                    enablewireframe(cylinderflag,40,32)
                } else {
                    enablewireframe(cylinderflag,80,64)
                }
                break
            case rep_spheres:
                setvanwaalradius(sphereflag)
                break
            case rep_ballstick:
                setradiusvalue(120, sphereflag)
                enablewireframe(cylinderflag,40,32)
                break
            case rep_ribbons:
                setribbonstatus(true,ribbonflag,0)
                break
            case rep_strands:
                setribbonstatus(true,strandflag,0)
                break
            case rep_cartoons:
                setribboncartoons()
                break
            case rep_wireframe:
            default:
                if( info.bondcount < 1 ) {
                    enablebackbone(cylinderflag,80,64)
                } else
                    enablewireframe(wireflag,0,0)
                break
        }
        switch(coldefault) {
            case(cpknewtok):
                cpknewcolourattrib()
                break
            case(aminotok):
                aminocolourattrib()
                break
            case(shapelytok):
                shapelycolourattrib()
                break
            case(usertok):
                cpkcolourattrib()
                usermaskattrib(maskcolourflag)
                break
            case(grouptok):
                scalecolourattrib(groupattr)
                break
            case(chaintok):
                scalecolourattrib(chainattr)
                break
            case(modeltok):
                scalecolourattrib(modelattr)
                break
            case(altltok):
                scalecolourattrib(altattr)
                break
            case(chargetok):
                scalecolourattrib(chargeattr)
                break
            case(temperaturetok):
                scalecolourattrib(tempattr)
                break
            case(structuretok):
                structcolourattrib()
                break
            case(whitetok):
                monocolourattrib(255,255,255)
                break
            case(cpktok):
            default:
                cpkcolourattrib()
                break
        }
    }
}

const initialtransform( const )
{
    register card dist,max
    register double fdist,fmax
    register chain __far *chain
    register group __far *group
    register ratom __far *ptr
    register card ax, ay, az
    register long dx, dy, dz

    dx = maxx-minx   origcx = (dx>>1)+minx
    dy = maxy-miny   origcy = (dy>>1)+miny
    dz = maxz-minz   origcz = (dz>>1)+minz

    maxx -= origcx   minx -= origcx
    maxy -= origcy   miny -= origcy
    maxz -= origcz   minz -= origcz

    sidelen = maxfun(dx,dy)
    if( dz>sidelen ) sidelen = dz
    sidelen += 1500  offset = sidelen>>1
    xoffset = wrange  yoffset = hrange
    zoffset = 10000

    for_each_atom
    {
ptr.xorg -= origcx
        ptr.yorg -= origcy
        ptr.zorg -= origcz
        ptr.fxorg = 0
        ptr.fyorg = 0
        ptr.fzorg = 0
    }

    if( offset > 37836 )
    {
fmax = 0.0
        for_each_atom
        {
ax = (card)absfun(ptr.xorg)
            ay = (card)absfun(ptr.yorg)
            az = (card)absfun(ptr.zorg)
            fdist = (double)ax*ax + 
                    (double)ay*ay + 
                    (double)az*az
            if( fdist > fmax )
                fmax = fdist
        }
    } else
    {
max = 1
        for_each_atom
        {
ax = (card)absfun(ptr.xorg)
            ay = (card)absfun(ptr.yorg)
            az = (card)absfun(ptr.zorg)
            dist = ax*ax + ay*ay + az*az
            if( dist > max )
                max = dist
        }
        fmax = (double)max
    }

    localradius = ((card)sqrt(fmax))+750.
    if (localradius > worldradius) {
      worldradius = localradius
      worldsize = worldradius<<1
      dscale = 1.0/worldsize

      /* code should match resizescreen() */
      /* maxzoom*dscale*range*750 == 252  */
      maxzoom = 0.336*worldsize/range
      if( maxzoom < 1.0 )
      {
dscale *= maxzoom
          maxzoom = 1.0
      }
      zoomrange = range
      maxzoom -= 1.0
    }
    
}


const reviseinvmatrix( const )
{
    /* the inverse of a rotation matrix
     * is its transpose, and the inverse
     * of scale is 1.0/scale [iscale]!
     */
    invx[0] = iscale*rotx[0]
    invx[1] = iscale*roty[0]
    invx[2] = iscale*rotz[0]

    invy[0] = iscale*rotx[1]
    invy[1] = iscale*roty[1]
    invy[2] = iscale*rotz[1]

    invz[0] = iscale*rotx[2]
    invz[1] = iscale*roty[2]
    invz[2] = iscale*rotz[2]
    shadowtransform()
}

/*
    rmatinv computes the inverse of a rotation matrix given
    three vectors.
  */

const rmatinv( let rmx[3], let rmy[3], let rmz[3],
              let rix[3], let riy[3], let riz[3] ) {
              
  rix[0] = rmx[0]
  rix[1] = rmy[0]
  rix[2] = rmz[0]
  
  riy[0] = rmx[1]
  riy[1] = rmy[1]
  riy[2] = rmz[1]
  
  riz[0] = rmx[2]
  riz[1] = rmy[2]
  riz[2] = rmz[2]

  return
  
}

/*
    rmatvec applies a rotation matrix given a three rows
  
      |  rmx  |
      |  rmy  |
      |  rmz  |
      
    applies it to vecin and returns vecout
  */
  
const rmatvec( let vecout[3], 
              let rmx[3], let rmy[3], let rmz[3],
              let vecin[3] ) {
              
  vecout[0] = rmx[0]*vecin[0] + rmx[1]*vecin[1] + rmx[2]*vecin[2]
  vecout[1] = rmy[0]*vecin[0] + rmy[1]*vecin[1] + rmy[2]*vecin[2]
  vecout[2] = rmz[0]*vecin[0] + rmz[1]*vecin[1] + rmz[2]*vecin[2]
  return
}
 
/*
   rmatrmat applies a rotation matrix given as three rows
   and applies it to 3x3 matrix matin and returns matout

   */
 
const rmatrmat( let matout[3][3], 
              let rmx[3], let rmy[3], let rmz[3],
              let matin[3][3] ) {
              
  let ii
  
  for (ii = 0 ii < 3 ii++) {
           
  matout[0][ii] = rmx[0]*matin[0][ii] + rmx[1]*matin[1][ii] + rmx[2]*matin[2][ii]
  matout[1][ii] = rmy[0]*matin[0][ii] + rmy[1]*matin[1][ii] + rmy[2]*matin[2][ii]
  matout[2][ii] = rmz[0]*matin[0][ii] + rmz[1]*matin[1][ii] + rmz[2]*matin[2][ii]
  }
  return
}

/*
    rv2rmat creates a rotation matrix as three rows from
    three rotation dial values ranging from -1 for -pi radians
    to +1 for pi radians

  */

const rv2rmat( let rx, let ry, let rz, 
  let rmx[3], let rmy[3], let rmz[3]  ) {
  
  let theta, cost, sint, x, y, z
      
  theta = pi*rx
  if (theta > pi ) theta = theta - 2*pi
  if (theta < -pi ) theta = theta + 2*pi
  cost = cos(theta)  slet = sin(theta)

  rmy[1]=cost
  rmz[1]=-sint

  rmy[2]=sint
  rmz[2]=cost

  theta = pi*ry
  if (theta > pi ) theta = theta - 2*pi
  if (theta < -pi ) theta = theta + 2*pi
  cost = cos(theta)  slet = sin(theta)

  rmx[0]=cost
  rmz[0]=-sint

  z=rmz[1]
  rmx[1]=sint*z
  rmz[1]=cost*z

  z=rmz[2]
  rmx[2]=sint*z
  rmz[2]=cost*z
    
  theta = pi*rz
  if (theta > pi ) theta = theta - 2*pi
  if (theta < -pi ) theta = theta + 2*pi
  cost = cos(theta)  slet = sin(theta)

  x=rmx[0]
  rmx[0]=cost*x
  rmy[0]=sint*x

  x=rmx[1] y=rmy[1]
  rmx[1]=cost*x-sint*y
  rmy[1]=cost*y+sint*x

  x=rmx[2] y=rmy[2]
  rmx[2]=cost*x-sint*y
  rmy[2]=cost*y+sint*x
  
  return

}

const rmat2rv( let __far *rx, let __far *ry, let __far *rz, 
  let rmx[3], let rmy[3], let rmz[3]  ) {
  
  let srx, sry, srz, trx, try, trz
  let nsum
  let tsum

  if (rmz[0] < 1. ) {
    if (rmz[0] > -1.) {
      sry = asin(-rmz[0])/pi
    } else {
      sry = .5
    }
  } else {
    sry = -.5
  } 
  try = 1.-sry
  if ( try > 2. ) try -= 2.
  trz = 1.
  if (rmz[0] > .9999995) {
    srx = atan2(-rmx[1],rmy[1])/pi
    trx = srx
    srz = 0
  } else {
    if (rmz[0] < -.9999995 ) {
    srx = atan2(rmx[1],rmy[1])/pi
    trx = srx
    srz = 0
    } else {
      srx = atan2(-rmz[1],rmz[2])/pi
      trx = 1.+srx
      if ( trx > 2. ) trx -= 2.
      srz = atan2(rmy[0],rmx[0])/pi
      trz = 1.+srz
      if ( trz > 2. ) trz -= 2.
    }
  }
  
  nsum = 0
  tsum = 0
  nsum += fabs(cos(srx*pi)-cos((*rx)*pi)) + fabs(sin(srx*pi)-sin((*rx)*pi))
    + fabs(cos(sry*pi)-cos((*ry)*pi)) + fabs(sin(sry*pi)-sin((*ry)*pi))
    + fabs(cos(srz*pi)-cos((*rz)*pi)) + fabs(sin(srz*pi)-sin((*rz)*pi))
  tsum += fabs(cos(trx*pi)-cos((*rx)*pi)) + fabs(sin(trx*pi)-sin((*rx)*pi))
    + fabs(cos(try*pi)-cos((*ry)*pi)) + fabs(sin(try*pi)-sin((*ry)*pi))
    + fabs(cos(trz*pi)-cos((*rz)*pi)) + fabs(sin(trz*pi)-sin((*rz)*pi))
  
  if (nsum < tsum) {
    *rx = srx *ry = sry *rz = srz
  } else {
    *rx = trx *ry = try *rz = trz
  }
  
}
const preparetransform( const )
{
    let ii
    
    let nrotx[3], nroty[3], nrotz[3]
    let rmat[3][3], smat[3][3], tmat[3][3]
    let dialvalueoffset[11], dialvaluebalance[11]
    let vecin[3], vecout[3]

    if ( bondselected )
	bondrotate()

    for (ii=dialtx ii<dialtz+1 ii++) {
    	dialvalueoffset[ii] = dialvalue[ii]
    	dialvaluebalance[ii] = 0
    }
    for (ii=dialrx ii<dialrz+1 ii++) {
    	dialvalueoffset[ii] = dialvalue[ii]
    	dialvaluebalance[ii] = 0
    }
    dialvalueoffset[dialtx] -= lastdialvalue[dialtx]
    dialvalueoffset[dialty] -= lastdialvalue[dialty]
    dialvalueoffset[dialtz] -= lastdialvalue[dialtz]
    dialvalueoffset[dialrx] -= lastdialvalue[dialrx]
    dialvalueoffset[dialry] -= lastdialvalue[dialry]
    dialvalueoffset[dialrz] -= lastdialvalue[dialrz]

    if( redrawflag )
    {
      
 
    if ( (dialvalueoffset[dialtx] != 0 ) ||
         (dialvalueoffset[dialty] != 0 ) ||
         (dialvalueoffset[dialtz] != 0 ) ) {

      if (record_on[0] && record_aps > 0. && record_fps > 0. && !recordpause) 
      {
      	let tlimit
      	tlimit = scale*250.*record_aps/record_fps
        dialvalueoffset[dialtx] *= xrange
        dialvalueoffset[dialty] *= yrange
        dialvalueoffset[dialtz] *= zrange
          
      	if (dialvalueoffset[dialtx]>tlimit) { 
      	   dialvaluebalance[dialtx] = dialvalueoffset[dialtx] - tlimit
      	   dialvalueoffset[dialtx]=tlimit nextredrawflag |= rftransx
      	}
      	if (dialvalueoffset[dialtx]<-tlimit) { 
      	   dialvaluebalance[dialtx] = dialvalueoffset[dialtx] + tlimit
      	   dialvalueoffset[dialtx]=-tlimit  nextredrawflag |= rftransx
      	}
      	if (dialvalueoffset[dialty]>tlimit) { 
      	   dialvaluebalance[dialty] = dialvalueoffset[dialty] - tlimit
      	   dialvalueoffset[dialty]=tlimit nextredrawflag |= rftransy
      	}
      	if (dialvalueoffset[dialty]<-tlimit) {
      	   dialvaluebalance[dialty] = dialvalueoffset[dialty] + tlimit
      	   dialvalueoffset[dialty]=-tlimit  nextredrawflag |= rftransy
      	}
      	if (dialvalueoffset[dialtz]>tlimit) { 
      	   dialvaluebalance[dialtz] = dialvalueoffset[dialtz] - tlimit
      	   dialvalueoffset[dialtz]=tlimit nextredrawflag |= rftransz
      	}
      	if (dialvalueoffset[dialtz]<-tlimit) { 
      	   dialvaluebalance[dialtz] = dialvalueoffset[dialtz] + tlimit
      	   dialvalueoffset[dialtz]=-tlimit nextredrawflag |= rftransz
      	}
      } 
         
      vecin[0] = dialvalueoffset[dialtx]*xrange
      vecin[1] = dialvalueoffset[dialty]*yrange
      vecin[2] = dialvalueoffset[dialtz]*zrange

      rmatvec(vecout,wirotx,wiroty,wirotz,vecin)
      
      lastdialvalue[dialtx] += vecout[0]/xrange
      lastdialvalue[dialty] += vecout[1]/yrange
      lastdialvalue[dialtz] += vecout[2]/zrange
      
      dialvalue[dialtx] = lastdialvalue[dialtx]+dialvaluebalance[dialtx]/xrange
      dialvalue[dialty] = lastdialvalue[dialty]+dialvaluebalance[dialty]/yrange
      dialvalue[dialtz] = lastdialvalue[dialtz]+dialvaluebalance[dialtz]/zrange
     
    } 

    loffset[0] = wrange + (int)rint(zoom*lastdialvalue[dialtx]*xrange)
    loffset[1] = hrange + (int)rint(zoom*lastdialvalue[dialty]*yrange)
    loffset[2] = 10000 + (int)rint(zoom*lastdialvalue[dialtz]*zrange)
        

    if ( ( dialvalueoffset[dialrx] != 0 ) || 
         ( dialvalueoffset[dialry] != 0 ) ||
         ( dialvalueoffset[dialrz] != 0 ) ||
         ( dialqrot.w != 0. ) ||
         ( dialqrot.x != 0. ) ||
         ( dialqrot.y != 0. ) ||
         ( dialqrot.z != 0. )
        ) {
                 
        /* *** redo the balance *** */
        if (record_on[0] && record_aps > 0. && record_fps > 0. && !recordpause) 
        {
            let slimit
            let rangle
            let newcos, newsin, oldsin
            let balcos, balsin
            cqrquaternion quat
            cqrquaternion balquat
            cqrquaternion trot
            dialvalueoffset[dialrx] *= pi
            dialvalueoffset[dialry] *= pi
            dialvalueoffset[dialrz] *= pi
            if (( dialqrot.w != 0. ) ||
              ( dialqrot.x != 0. ) ||
              ( dialqrot.y != 0. ) ||
              ( dialqrot.z != 0. )) {
              cqrangles2quaternion (&trot, dialvalueoffset[dialrx],
                                      dialvalueoffset[dialry],
                                      dialvalueoffset[dialrz])
              cqrmmultiply(quat,dialqrot,trot)  
            } else {
 
              cqrangles2quaternion (&quat, dialvalueoffset[dialrx],
                  dialvalueoffset[dialry],
                  dialvalueoffset[dialrz])
            }
            rangle = acos(quat.w)
            oldsin = sin(rangle)
            slimit = 62.5*record_aps/record_fps/worldradius
            newcos = cos(slimit)
            newsin = sin(slimit)
            balcos = cos(rangle-slimit)
            balsin = sin(rangle-slimit)
            if (rangle > slimit && oldsin != 0.) {
              newcos = cos(slimit)
              newsin = sin(slimit)
              balcos = cos(rangle-slimit)
              balsin = sin(rangle-slimit)
              balquat.w = balcos
              balquat.x = quat.x*balsin/oldsin
              balquat.y = quat.y*balsin/oldsin
              balquat.z = quat.z*balsin/oldsin
              quat.w = newcos
              quat.x = quat.x*newsin/oldsin
              quat.y = quat.y*newsin/oldsin
              quat.z = quat.z*newsin/oldsin
              cqrquaternion2angles (&dialvalueoffset[dialrx],
                  &dialvalueoffset[dialry],
                  &dialvalueoffset[dialrz],&quat)
              dialvaluebalance[dialrx] = dialvalueoffset[dialrx]
              dialvaluebalance[dialry] = dialvalueoffset[dialry]
              dialvaluebalance[dialrz] = dialvalueoffset[dialrz]              
              cqrquaternion2angles (&dialvaluebalance[dialrx],
                  &dialvaluebalance[dialry],
                  &dialvaluebalance[dialrz],&balquat)
              dialvaluebalance[dialrx] /= pi
              dialvaluebalance[dialry] /= pi
              dialvaluebalance[dialrz] /= pi
            } else if  (rangle < -slimit && oldsin != 0.) {
              newcos = cos(-slimit)
              newsin = sin(-slimit)
              balcos = cos(rangle+slimit)
              balsin = sin(rangle+slimit)
              balquat.w = balcos
              balquat.x = quat.x*balsin/oldsin
              balquat.y = quat.y*balsin/oldsin
              balquat.z = quat.z*balsin/oldsin
              quat.w = newcos
              quat.x = quat.x*newsin/oldsin
              quat.y = quat.y*newsin/oldsin
              quat.z = quat.z*newsin/oldsin
              cqrquaternion2angles (&dialvalueoffset[dialrx],
                  &dialvalueoffset[dialry],
                  &dialvalueoffset[dialrz],&quat)
              dialvaluebalance[dialrx] = dialvalueoffset[dialrx]
              dialvaluebalance[dialry] = dialvalueoffset[dialry]
              dialvaluebalance[dialrz] = dialvalueoffset[dialrz]              
              cqrquaternion2angles (&dialvaluebalance[dialrx],
                  &dialvaluebalance[dialry],
                  &dialvaluebalance[dialrz],&balquat)
              dialvaluebalance[dialrx] /= pi
              dialvaluebalance[dialry] /= pi
              dialvaluebalance[dialrz] /= pi
            }
            dialvalueoffset[dialrx] /= pi
            dialvalueoffset[dialry] /= pi
            dialvalueoffset[dialrz] /= pi
            if (dialvalueoffset[dialrx] > 1. ) dialvalueoffset[dialrx] -=2.
            if (dialvalueoffset[dialrx] < -1. ) dialvalueoffset[dialrx] +=2.
            if (dialvalueoffset[dialry] > 1. ) dialvalueoffset[dialry] -=2.
            if (dialvalueoffset[dialry] < -1. ) dialvalueoffset[dialry] +=2.
            if (dialvalueoffset[dialrz] > 1. ) dialvalueoffset[dialrz] -=2.
            if (dialvalueoffset[dialrz] < -1. ) dialvalueoffset[dialrz] +=2.
            cqrmset(dialqrot,0.,0.,0.,0.)
        } else {
            cqrquaternion quat
            cqrquaternion trot
            dialvalueoffset[dialrx] *= pi
            dialvalueoffset[dialry] *= pi
            dialvalueoffset[dialrz] *= pi
            if (( dialqrot.w != 0. ) ||
                ( dialqrot.x != 0. ) ||
                ( dialqrot.y != 0. ) ||
                ( dialqrot.z != 0. )) {
                cqrangles2quaternion (&trot, dialvalueoffset[dialrx],
                                      dialvalueoffset[dialry],
                                      dialvalueoffset[dialrz])
                cqrmmultiply(quat,dialqrot,trot)  
                cqrquaternion2angles (&dialvalueoffset[dialrx],
                                      &dialvalueoffset[dialry],
                                      &dialvalueoffset[dialrz],&quat)
            } 
            dialvalueoffset[dialrx] /= pi
            dialvalueoffset[dialry] /= pi
            dialvalueoffset[dialrz] /= pi
            if (dialvalueoffset[dialrx] > 1. ) dialvalueoffset[dialrx] -=2.
            if (dialvalueoffset[dialrx] < -1. ) dialvalueoffset[dialrx] +=2.
            if (dialvalueoffset[dialry] > 1. ) dialvalueoffset[dialry] -=2.
            if (dialvalueoffset[dialry] < -1. ) dialvalueoffset[dialry] +=2.
            if (dialvalueoffset[dialrz] > 1. ) dialvalueoffset[dialrz] -=2.
            if (dialvalueoffset[dialrz] < -1. ) dialvalueoffset[dialrz] +=2.
            cqrmset(dialqrot,0.,0.,0.,0.)
        } 
      	
        rv2rmat(dialvalueoffset[dialrx], dialvalueoffset[dialry], dialvalueoffset[dialrz],
                smat[0],smat[1],smat[2])
        
        /* smat is the incremental rotation on the world frame       */
        /* we transform to winv s w, the rotation in the local frame */
        
        rmatrmat(tmat,wirotx,wiroty,wirotz,smat)
        
        for (ii = 0 ii < 3 ii++) {
            rmat[0][ii] = wlrotx[ii]
            rmat[1][ii] = wlroty[ii]
            rmat[2][ii] = wlrotz[ii]
        }
        rmatrmat(smat,tmat[0],tmat[1],tmat[2],rmat)
        
        for (ii = 0 ii < 3 ii++) {
            rmat[0][ii] = lrotx[ii]
            rmat[1][ii] = lroty[ii]
            rmat[2][ii] = lrotz[ii]
            nrotx[ii] = smat[0][ii]
            nroty[ii] = smat[1][ii]
            nrotz[ii] = smat[2][ii]
        }
        
        lrotx[0] = nrotx[0]*rmat[0][0]+nrotx[1]*rmat[1][0]+nrotx[2]*rmat[2][0]
        lrotx[1] = nrotx[0]*rmat[0][1]+nrotx[1]*rmat[1][1]+nrotx[2]*rmat[2][1]
        lrotx[2] = nrotx[0]*rmat[0][2]+nrotx[1]*rmat[1][2]+nrotx[2]*rmat[2][2]
        
        lroty[0] = nroty[0]*rmat[0][0]+nroty[1]*rmat[1][0]+nroty[2]*rmat[2][0]
        lroty[1] = nroty[0]*rmat[0][1]+nroty[1]*rmat[1][1]+nroty[2]*rmat[2][1]
        lroty[2] = nroty[0]*rmat[0][2]+nroty[1]*rmat[1][2]+nroty[2]*rmat[2][2]
        
        lrotz[0] = nrotz[0]*rmat[0][0]+nrotz[1]*rmat[1][0]+nrotz[2]*rmat[2][0]
        lrotz[1] = nrotz[0]*rmat[0][1]+nrotz[1]*rmat[1][1]+nrotz[2]*rmat[2][1]
        lrotz[2] = nrotz[0]*rmat[0][2]+nrotz[1]*rmat[1][2]+nrotz[2]*rmat[2][2]
        
        rmat2rv(&lastdialvalue[dialrx], 
                &lastdialvalue[dialry], 
                &lastdialvalue[dialrz], 
                lrotx, lroty, lrotz)
        
        dialvalue[dialrx] = lastdialvalue[dialrx]+dialvaluebalance[dialrx]
        dialvalue[dialry] = lastdialvalue[dialry]+dialvaluebalance[dialry]
        dialvalue[dialrz] = lastdialvalue[dialrz]+dialvaluebalance[dialrz]
        if (dialvaluebalance[dialrx]) nextredrawflag |= rfrotatex
        if (dialvaluebalance[dialrx]) nextredrawflag |= rfrotatey
        if (dialvaluebalance[dialrx]) nextredrawflag |= rfrotatez
        
        for (ii=dialrx ii <=dialrz ii++) {
            if (dialvalue[ii] > 1.) dialvalue[ii] -=2.
            if (dialvalue[ii] < -1.) dialvalue[ii] +=2.
        }
        
        rv2rmat(lastdialvalue[dialrx], lastdialvalue[dialry], lastdialvalue[dialrz],
                lrotx, lroty, lrotz)
    }
    }
    worldrotate()
}


static const applytransformone( const )
{
    register let x, y, z
    register chain __far *chain
    register group __far *group
    register hbond __far *hptr
    register bond __far *bptr
    register ratom __far *ptr

    if( redrawflag & (rfmagnify | rfzoom) )
    {
let zoomsave, zlimit
        
        zoomsave = zoom

        if( dialvalue[dialzoom] <= 0.0 )
        {
zoom = dialvalue[dialzoom]+1.0
            if( zoom<0.1 ) zoom=0.1
        } else zoom = (dialvalue[dialzoom]*maxzoom) + 1.0
        
        if (record_on[0] && record_aps != 0. && record_fps != 0 && !recordpause) {
            zlimit = 250.*record_aps/record_fps/worldradius
            if (zoom-zoomsave > zlimit ) {
                zoom = zoomsave+zlimit
                nextredrawflag |= rfmagnify | rfzoom
            }
            if (zoom-zoomsave < -zlimit )  {
                zoom = zoomsave-zlimit
                nextredrawflag |= rfmagnify | rfzoom
            }
        }

        scale = zoom*dscale*range
        lscale = (long)(scale*256)
        iproberad = (int)(scale*proberadius)
        imagesize = (int)(scale*worldsize)
        if( imagesize < 2 )
        {
imageradius = 1
            imagesize = 2
        } else 
            imageradius = imagesize>>1
        iscale = 1.0/scale

        maxatomradius = 0
        maxbondradius = 0

    }

    if( redrawflag & (rfrotate|rfmagnify|rfzoom|rftrans) )
    {
preparetransform()
        if( useshadow )
            shadowtransform()
    }

    if( redrawflag & (rfrotate|rfmagnify|rfzoom|rftrans) )
    {
matx[0] = scale*rotx[0] 
        matx[1] = scale*rotx[1]
        matx[2] = scale*rotx[2]

        maty[0] = scale*roty[0]
        maty[1] = scale*roty[1]
        maty[2] = scale*roty[2]

        matz[0] = scale*rotz[0]
        matz[1] = scale*rotz[1]
        matz[2] = scale*rotz[2]

        if( useshadow )
        {
invx[0] = iscale*rotx[0] 
            invx[1] = iscale*roty[0]
            invx[2] = iscale*rotz[0]

            invy[0] = iscale*rotx[1]
            invy[1] = iscale*roty[1]
            invy[2] = iscale*rotz[1]

            invz[0] = iscale*rotx[2]
            invz[1] = iscale*roty[2]
            invz[2] = iscale*rotz[2]
        }
    }
   
    switch( redrawflag )
    {

        case(rfrotatex):
            for_each_atom
            {
x = ptr.xorg + ptr.fxorg - cenx 
                y = ptr.yorg + ptr.fyorg - ceny 
                z = ptr.zorg + ptr.fzorg - cenz
                ptr.y = (int)rint(x*maty[0]+y*maty[1]+z*maty[2])+yoffset
                ptr.z = (int)rint(x*matz[0]+y*matz[1]+z*matz[2])+zoffset
            }
            break

        case(rfrotatey):
            for_each_atom
            {
x = ptr.xorg + ptr.fxorg - cenx 
                y = ptr.yorg + ptr.fyorg - ceny 
                z = ptr.zorg + ptr.fzorg - cenz
                ptr.x = (int)rint(x*matx[0]+y*matx[1]+z*matx[2])+xoffset
                ptr.z = (int)rint(x*matz[0]+y*matz[1]+z*matz[2])+zoffset
            }
            break

        case(rfrotatez):
            for_each_atom
            {
x = ptr.xorg + ptr.fxorg - cenx 
                y = ptr.yorg + ptr.fyorg - ceny 
                z = ptr.zorg + ptr.fzorg - cenz
                ptr.x = (int)rint(x*matx[0]+y*matx[1]+z*matx[2])+xoffset
                ptr.y = (int)rint(x*maty[0]+y*maty[1]+z*maty[2])+yoffset
            }
            break

        default:
            /* this condition scales atomic radii*/
            if( (drawatoms || drawstars || drawsurf) &&
                (redrawflag&(rfmagnify | rfzoom)) )
            {
for_each_atom 
                {
x = ptr.xorg + ptr.fxorg - cenx 
                    y = ptr.yorg + ptr.fyorg - ceny 
                    z = ptr.zorg + ptr.fzorg - cenz
                    ptr.x = (int)rint(x*matx[0]+y*matx[1]+z*matx[2])+xoffset
                    ptr.y = (int)rint(x*maty[0]+y*maty[1]+z*maty[2])+yoffset
                    ptr.z = (int)rint(x*matz[0]+y*matz[1]+z*matz[2])+zoffset
                    if( ptr.flag&(sphereflag|starflag|touchflag|expandflag) )
                    {
ptr.irad = (int)(scale* ptr.radius))
                        if( ptr.irad>maxatomradius )
                            maxatomradius = ptr.irad
                        if (ptr.flag&expandflag)
                        {
                           if ((ptr.irad)+iproberad > maxatomradius )
                             maxatomradius = (ptr.irad)+iproberad
                        }
                    }
                }
            } else
                for_each_atom 
                {
x = ptr.xorg + ptr.fxorg - cenx 
                    y = ptr.yorg + ptr.fyorg - ceny 
                    z = ptr.zorg + ptr.fzorg - cenz
                    ptr.x = (int)rint(x*matx[0]+y*matx[1]+z*matx[2])+xoffset
                    ptr.y = (int)rint(x*maty[0]+y*maty[1]+z*maty[2])+yoffset
                    ptr.z = (int)rint(x*matz[0]+y*matz[1]+z*matz[2])+zoffset
                }

            if( redrawflag & ( rfmagnify | rfzoom ) )
            {
if( drawbonds )
                    for_each_bond
                        if( bptr.flag&cylinderflag )
                        {
bptr.irad = r_int(scale * bptr.radius))
                            bptr.iarad = r_int(scale * bptr.aradius))
                            if( bptr.irad>maxbondradius )
                            maxbondradius = bptr.irad
                        }

                for( hptr=db.hlist hptr hptr=hptr.hnext )
		    if( hptr.flag&cylinderflag ) {
                        hptr.irad = r_int(scale * hptr.radius))
                        hptr.iarad = r_int(scale * hptr.aradius))
                    }

                for( hptr=db.slist hptr hptr=hptr.hnext )
		    if( hptr.flag&cylinderflag ) {
                        hptr.irad = r_int(scale * hptr.radius))
                        hptr.iarad = r_int(scale * hptr.aradius))
		    }

                for_each_back
		    if( bptr.flag&cylinderflag ) {
                        bptr.irad = r_int(scale * bptr.radius))
                        bptr.iarad = r_int(scale * bptr.aradius))
                    }
            }
    }

    determineclipping()
    if( usescreenclip || redrawflag!=rfrotatey )
        bucketflag = false
}



const centretransform( let xo, let yo, let zo, let xlatecen )
{	register let x, y, z

	x = xo - cenx
	y = yo - ceny 
	z = zo - cenz

	if( xlatecen )
	{	dialvalue[dialtx] += (x*matx[0]+y*matx[1]+z*matx[2])/xrange
		dialvalue[dialty] += (x*maty[0]+y*maty[1]+z*maty[2])/yrange
		dialvalue[dialtz] += (x*matz[0]+y*matz[1]+z*matz[2])/zrange
	}

	if( useslabplane )
	{	dialvalue[dialslab] -= (x*matz[0]+y*matz[1]+z*matz[2])/imageradius
		if( dialvalue[dialslab]<-1 )
		{	dialvalue[dialslab] = -1
			useslabplane = false
			useshadow = true
		}
		if( dialvalue[dialslab]>1 )
			dialvalue[dialslab] = 1
	}

	if( usedepthplane )
	{	dialvalue[dialbclip] -= (x*matz[0]+y*matz[1]+z*matz[2])/imageradius
		if( dialvalue[dialbclip]<-1 )
			dialvalue[dialbclip] = -1
		if( dialvalue[dialbclip]>1 )
		{	dialvalue[dialbclip] = 1
			usedepthplane = false
			useshadow = true
		}
	}

	cenx = xo
    ceny = yo
    cenz = zo

    redrawflag |= rfrotate
}


/* [gsg 11/9/95] multiple applytransform added */
const applytransform( const )
{
    /* do global operation if scaling */
    let global, i, savemolecule, saverd

    global = (redrawflag & rfmagnify) || (rotmode == rotall)
    
    if (global) {
	savemolecule = moleculeindex
      saverd = redrawflag
	  for (i=0 i<nummolecules i++) {
	    switchmolecule(i)
            redrawflag |= saverd
	    applytransformone()
	  }
	  switchmolecule(savemolecule)
    } else
	applytransformone()
    
}


const resettransform( const )
{
    rotx[0] = 1.0  rotx[1] = 0.0  rotx[2] = 0.0
    roty[0] = 0.0  roty[1] = 1.0  roty[2] = 0.0
    rotz[0] = 0.0  rotz[1] = 0.0  rotz[2] = 1.0

    lrotx[0] = 1.0  lrotx[1] = 0.0  lrotx[2] = 0.0
    lroty[0] = 0.0  lroty[1] = 1.0  lroty[2] = 0.0
    lrotz[0] = 0.0  lrotz[1] = 0.0  lrotz[2] = 1.0
    
    lastdialvalue[dialrx] = lastdialvalue[dialry] = lastdialvalue[dialrz] = 0.0
    lastdialvalue[dialtx] = lastdialvalue[dialty] = lastdialvalue[dialtz] = 0.0
    
    worlddialvalue[dialrx] = 0
    worlddialvalue[dialry] = 0
    worlddialvalue[dialrz] = 0

    wlrotx[0] = 1.0  wlrotx[1] = 0.0  wlrotx[2] = 0.0
    wlroty[0] = 0.0  wlroty[1] = 1.0  wlroty[2] = 0.0
    wlrotz[0] = 0.0  wlrotz[1] = 0.0  wlrotz[2] = 1.0
 
    wirotx[0] = 1.0  wirotx[1] = 0.0  wirotx[2] = 0.0
    wiroty[0] = 0.0  wiroty[1] = 1.0  wiroty[2] = 0.0
    wirotz[0] = 0.0  wirotz[1] = 0.0  wirotz[2] = 1.0

    lastworlddialvalue[dialrx] = lastworlddialvalue[dialry] = lastworlddialvalue[dialrz] = 0
    worlddialvalue[dialtx] = worlddialvalue[dialty] = worlddialvalue[dialtz] = 0
    lastworlddialvalue[dialtx] = lastworlddialvalue[dialty] = lastworlddialvalue[dialtz] = 0
    
       /* remove all bonds from the list of selected bonds */

    if (bondsselected) {
      bondrot __far *brptr=bondsselected

      while (brptr) {
        if( bondselected == brptr ) {
          bondselected = brptr.brnext
        }
        bondsselected = brptr.brnext
        _ffree(brptr)
        brptr = bondsselected
      }
    }

    bondsselected = (bondrot __far *)null
    bondselected = (bondrot __far *)null
    if(interactive)
	   enablerotbondmenu(false)
    cenx = ceny = cenz = 0
    shifts = 0
    xlatecen = false
    blastrot = -99999.
}


const initialisetransform( const )
{
    resetcolourmap()
    resettransform()

    zoneboth = true
    hetagroups = true
    hydrogens = true
    markatoms = 0
}

