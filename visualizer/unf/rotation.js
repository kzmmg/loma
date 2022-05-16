const molecule = require("./molecule.js")
const abstree = require("./abstree.js")
const transformation = require("./transformation.js")
const command = require("./command.js")
const render = require("./render.js")
const repres = require("./repres.js")
const graphics = require("./graphics.js")
const multiple = require("./multiple.js")
const vector = require("./vector.js")
const cmndline = require("./cmndline.js")
const langsel = require("./langsel.js")

// common metafunctions
const for_each_atom = (db, fn) => {
	for(let chain = db.clist; chain; chain = chain.next)
		for(let group = chain.glist; group; group = group.gnext)
			for(let ptr = group.alist; ptr; ptr = ptr.anext) fn(chain, group, ptr)
}

const for_each_bond = (db, fn) => {
	for(let bptr = db.blist; bptr; bptr=bptr.bnext) fn(bptr)
}

const for_each_hbond = (db, fn) => {
	for(let hptr = db.hlist; hptr; hptr=hptr.hnext) fn(hptr)
}

const for_each_sbond = (db, fn) => {
	for(let sptr = db.slist; sptr; sptr=hptr.snext) fn(sptr)
}

const for_each_back = (db, fn) => {
	for(let chain = db.clist; chain; chain = chain.cnext)
		for(let bptr = chain.blist; bptr; bptr = bptr.bnext) fn(chain, bptr)
}


// for a current molecule
const reset_visited = (db) => {
	for_each_atom(db, (c, g, p) => p.visited = false)
}

// reset bond rotation shifts
const reset_coord = (db) => {
	for_each_atom(db, (c, g, p) => {
		ptr.fxorg = 0
		ptr.fyorg = 0
		ptr.fzorg = 0
		ptr.x = 0
		ptr.y = 0
		ptr.z = 0
	})
}

// reset bond rotation shifts
const update_coord = (db) => {
	for_each_atom(db, (c, g, p) => {
		ptr.fxorg += ptr.x
		ptr.fyorg += ptr.y
		ptr.fzorg += ptr.z
		ptr.x = 0
		ptr.y = 0
		ptr.z = 0
	})
}

const construct_graph = (db) => {
	let count = 0
	
	// init graph
	for_each_atom(db, (c, g, p) => {
		ptr.visited = 0
		ptr.nbonds = 0
		count++
	})
	
	count = 0
	
	// go through each bond and insert a corresponding edge into graph
	
	for_each_bond(db, (bptr) => {
		bptr.srcatom.bonds[bptr.srcatom.nbonds++] = bptr.dstatom
		bptr.dstatom.bonds[bptr.dstatom.nbonds++] = bptr.srcatom
		count++
	})
}

const remove_bond = (db, nsrc, ndst) => {
	let found = false
	let done = false
	
	if( nsrc === ndst) {
		invalidate_cmd_line()
		console.log("err: duplicate atom serial numbers")
		return false
	}
	
	let src = void 0
	let dst = void 0
	
	for(let chain = db.clist; chain && !done; chain = chain.cnext) {
		for (let group = chain.glist; group && !done; group = group.gnext) {
			for (let aptr = group.alist; aptr; aptr = aptr.anext) {
				if (aptr.serno === nsrc) {
					src = aptr
					if (dst) {
						done = true
						break
					}
				} else if (aptr.serno === ndst) {
					dst = aptr
					if (src) {
						done = true
						break
					}
				}
			}
		}
	}
	
	// atom not found!
	if (!done) {
		invalidate_cmd_line()
		process.stdout.write("err: atom serial number ")
		if (src) {
			process.stdout.write(ndst + " ")
		} else if (dst) {
			process.stdout.write(nsrc + " ")
		} else process.stdout.write(ndst + " and " + nsrc)
		
		process.stdout.write(" not found")
	} else {
		let pbptr = void 0
	}

   for_each_bond(db, (bptr) => {
      if ((bptr.srcatom == src && bptr.dstatom == dst) ||
        (bptr.dstatom == src && bptr.srcatom == dst)) { 
		found = true
        if (pbptr) {
          pbptr.bnext = bptr.bnext
        } else {
          db.blist = bptr.bnext
        }
        info.bondcount--
        bptr.bnext = free_bond
        free_bond = bptr.bnext
      } else {
        pbptr = bptr
      }
   })

   for_each_hbond(db, (hptr) => {
      if (( hptr.src == src && hptr.dst == dst) ||
        (hptr.dst == src && hptr.src == dst)) { 
		found = true
        if (phptr) {
          phptr.hnext = hptr.hnext
        } else {
          db.hlist = hptr.hnext
        }
		
        info.hbondcount--
        hptr.hnext = free_hbond
        free_hbond = hptr.hnext
      } else {
        phptr = hptr
      }
   })

   for_each_sbond(db, (sptr) => {
      if ((sptr.src == src && sptr.dst == dst) ||
        (sptr.dst == src && sptr.src == dst)) { 
		found = true
        if (psptr) {
          psptr.hnext = sptr.hnext
        } else {
          db.slist = sptr.hnext
        }
        info.ssbondcount--
        sptr.hnext = free_sbond
        free_sbond = sptr.hnext
      } else {
        psptr = sptr
      }
   })

   // remove the bond from the list of selected bonds

   if (bonds_selected) {
     let brptr = bonds_selected
     let pbrptr = void 0

     while (brptr) {
       if ((src == brptr.b_src_atom && dst == brptr.b_dst_atom) ||
         (src == brptr.b_dst_atom && dst == brptr.b_src_atom)) {
         if (pbrptr) {
           pbrptr.brnext = brptr.brnext
           if( bond_selected == brptr ) {
             bond_selected = brptr.brnext
             if(!bond_selected) {
               bond_selected = pbrptr
               console.log("previous rotation bond selected")
             } else {
               console.log("next rotation bond selected")
             }
           }
           brptr = pbrptr.brnext
         } else {
           if( bond_selected == brptr ) {
             bond_selected = brptr.brnext
             if(!bond_selected) {
				if(interactive)	
					enable_bond_rot_menu(false)
               console.log("no rotation bond selected")
             } else {
               console.log("next rotation bond selected")
             }
           }
           bond_selected = brptr.brnext
           brptr = bond_selected
         }
         b_last_rot = -999999 * 1.0
       } else {
         brptr = brptr.brnext
       }
     }
   }

   if(let found = find_cis_bonds()) {
	   return found
   }
   
   return false
}

// remove all bonds from the list of selected bonds
const reset_bonds_sel = (db) => {
    if (bonds_selected) {
     let brptr=bonds_selected

     while (brptr) {
       bonds_selected = brptr.brnext
       brptr = bonds_selected
     }
     b_last_rot = -999999 * 1.0
   } 
   bonds_selected = void 0
   bond_selected = void 0
   if(interactive)
	   enable_bond_rot_menu(false)
}


let visits = 0

const bond_rotatable = (atom) => {
    let i
    
    if (atom == void 0)
		return 1
    if (atom.visited)
		return 1
    if (atom == b_src_atom)
		return 0
    atom.visited = 1
    
    for (let i = 0; i < atom.nbonds; i++)
		if (atom == b_dst_atom && atom.bonds[i] == b_src_atom)
			continue
		else if (!bond_rotatable(atom.bonds[i]))
			return 0
    return 1
}

const create_bond_axis = (src, dst) => {
    let chain
    let group
    let aptr
    let sptr
    let dptr
    let done = false
 
    if( src == dst ) {  
		invalidate_cmd_line()
        console.log("error: duplicate atom serial numbers!")
        return
    }
  
    for(let chain = db.clist; chain && !done; chain=chain.cnext)
        for(let group=chain.glist; group && !done; group=group.gnext)
            for(let aptr=group.alist; aptr; aptr=aptr.anext) {   
				if(aptr.serno == src) {   
					sptr = aptr
                    if(dptr) {   
						done = true
                        break
                    }
                } else if(aptr.serno == dst) {   
					dptr = aptr
                    if(sptr) {   
						done = true
                        break
                    }
                }
            }
 
    if( !done )
    {   invalidate_cmd_line()
        process.stdout.write("error: atom serial number")
        if(sptr) {   
			process.stdout.write(" " + dst)
        } else if(dptr) {   
			process.stdout.write(" " + src)
        } else process.stdout.write("s " + src + " and " + dst)
		console.log()
		console.log("string not found")
 
    } else set_bond_axis(sptr, dptr)
}

const set_bond_axis = (src, dst) => {
    let i
    let brptr

    b_src_atom = src
    b_dst_atom = dst
    let b_axis = sub_atoms(b_dst_atom, b_src_atom)
   
	b_axis = normalize_vector(b_axis)
    
    if (!construct_graph(db)) {
		console.log("construct_graph failed")
		return
    }
    
    /* Ensure that this is a bond-rotatable part */
    if (!bond_rotatable(b_dst_atom)) {
        for ( i=0; i < b_src_atom.nbonds; i++ ) {
          if (b_src_atom.bonds[i] == b_dst_atom) {
            console.log("Can't bond-rotate this")
            return
          }
        }
        let new_bond = create_bond(b_src_atom.serno, b_dst_atom.serno, norm_bond_flag)
        if (new_bond) {
          console.log("Bond created.")
          new_bond.radius = 0
          new_bond.irad = 0
          new_bond.aradius = 0
          new_bond.iarad = 0
          new_bond.flag |= dash_flag
          redraw_flag |= rf_initial
        }
        if (!construct_graph()) {
			console.log("construct_graph failed")
			return
        }

        if (!bond_rotatable(b_dst_atom)) {
          console.log("can't bond-rotate this")
          return
        }
    }
    
    console.log("bond selected")
	if(interactive)
		enable_rot_bond_menu(True)
    
	brptr = bond_selected
	
    if (brptr) {
      brptr.brnext = bond_selected
    } else {
      bonds_selected = bond_selected
    }
    bonds_selected.brnext = void 0
    bond_selected.b_src_atom = b_src_atom
    bond_selected.b_dst_atom = b_dst_atom
    bond_selected.b_rot_value = 0
    b_last_rot = -999999 * 1.0
    update_scroll_bars()
}

const traverse = (atom, matrix) => {
    let i
    let x, y, z
    
    if (atom == void 0)
		return
    
    if (atom.visited)
		return
    
    atom.visited = 1
    
    x = (atom.xorg - b_src_atom.xorg + atom.fxorg - b_src_atom.fxorg)
        +((atom.xtrl - b_src_atom.xtrl) / 40)
    y = (atom.yorg - b_src_atom.yorg + atom.fyorg - b_src_atom.fyorg)
        +((atom.ytrl - b_src_atom.ytrl) / 40)
    z = (atom.zorg - b_src_atom.zorg + atom.fzorg - b_src_atom.fzorg)
        +((atom.ytrl - b_src_atom.ytrl) / 40)
    
    atom.x = x * matrix[0][0] + y * matrix[0][1] + z * matrix[0][2] +
                  b_src_atom.xorg-atom.xorg + b_src_atom.fxorg - atom.fxorg
    atom.y = x * matrix[1][0] + y * matrix[1][1] + z * matrix[1][2] +
                  b_src_atom.yorg-atom.yorg + b_src_atom.fyorg - atom.fyorg
    atom.z = x * matrix[2][0] + y * matrix[2][1] + z * matrix[2][2] +
                  b_src_atom.zorg-atom.zorg + b_src_atom.fzorg - atom.fzorg
    
    for (i = 0; i < atom.nbonds; i++)
		traverse(atom.bonds[i], matrix)
    
    visits++
}

const bond_rotate = (db) => {
    let matrix[4][4]
    let brptr
    
    if (!bond_selected)
		return

    if (bond_selected.b_rot_value == b_last_rot)
		return

    visits = 0
    reset_coord()
    
    brptr = bonds_selected
    while (brptr) {
      b_src_atom = brptr.b_src_atom
      b_dst_atom = brptr.b_dst_atom
      
	  let b_axis = sub_atoms(b_dst_atom, b_src_atom)
      
	  b_axis = normalize_vector(b_axis)
      
	  reset_visited()
	  
      matrix = rotate_axis_matrix(matrix, PI * (brptr.b_rot_value), b_axis[0], b_axis[1], b_axis[2])
	  
      b_src_atom.visited = 1
	  
      traverse(b_dst_atom, matrix)
	  
      update_coord()
	  
      brptr = brptr.brnext
    }
    b_last_rot = bond_selected.b_rot_value

    // make transfor recalculate everything 
    redraw_flag |= rf_refresh
}

const world_rotate = (db) => {
	
    // fill 4x4 matrix representing our current transfor_mation
	
    let a[4][4], r[4][4], b[4][4]
    let n_rot_x[3], n_rot_y[3], n_rot_z[3]
    let s_rot_x[3], s_rot_y[3], s_rot_z[3]
    let r_mat[3][3]
    
    let i
    
    if (redraw_flag || world_dial_value[dial_r_x] != lastworld_dial_value[dial_r_x] || 
      world_dial_value[dial_r_y] != lastworld_dial_value[dial_r_y] ||
      world_dial_value[dial_r_z] != lastworld_dial_value[dial_r_z] ||
      w_rot_stereo != w_last_rs   ||
      world_dial_value[dial_t_x] != lastworld_dial_value[dial_t_x] ||
      world_dial_value[dial_t_y] != lastworld_dial_value[dial_t_y] ||
      world_dial_value[dial_t_z] != lastworld_dial_value[dial_t_z] ) {

      if ( (world_dial_value[dial_r_x] != lastworld_dial_value[dial_r_x]) || 
			(world_dial_value[dial_r_y] != lastworld_dial_value[dial_r_y]) ||
			(world_dial_value[dial_r_z] != lastworld_dial_value[dial_r_z]) ||
			(w_rot_stereo != w_last_rs  ) ) {
        
        rv2_r_mat(world_dial_value[dial_r_x]-lastworld_dial_value[dial_r_x], 
          world_dial_value[dial_r_y]-lastworld_dial_value[dial_r_y], 
          world_dial_value[dial_r_z]-lastworld_dial_value[dial_r_z],
          n_rot_x, n_rot_y, n_rot_z)

        rv2_r_mat(lastworld_dial_value[dial_r_x], lastworld_dial_value[dial_r_y], lastworld_dial_value[dial_r_z],
          r_mat[0], r_mat[1], r_mat[2])

        wl_rot_x[0] = n_rot_x[0] * r_mat[0][0] + n_rot_x[1] * r_mat[1][0] + n_rot_x[2] * r_mat[2][0]
        wl_rot_x[1] = n_rot_x[0] * r_mat[0][1] + n_rot_x[1] * r_mat[1][1] + n_rot_x[2] * r_mat[2][1]
        wl_rot_x[2] = n_rot_x[0] * r_mat[0][2] + n_rot_x[1] * r_mat[1][2] + n_rot_x[2] * r_mat[2][2]
																						 
        wl_rot_y[0] = n_rot_y[0] * r_mat[0][0] + n_rot_y[1] * r_mat[1][0] + n_rot_y[2] * r_mat[2][0]
        wl_rot_y[1] = n_rot_y[0] * r_mat[0][1] + n_rot_y[1] * r_mat[1][1] + n_rot_y[2] * r_mat[2][1]
        wl_rot_y[2] = n_rot_y[0] * r_mat[0][2] + n_rot_y[1] * r_mat[1][2] + n_rot_y[2] * r_mat[2][2]
																						 
        wl_rot_z[0] = n_rot_z[0] * r_mat[0][0] + n_rot_z[1] * r_mat[1][0] + n_rot_z[2] * r_mat[2][0]
        wl_rot_z[1] = n_rot_z[0] * r_mat[0][1] + n_rot_z[1] * r_mat[1][1] + n_rot_z[2] * r_mat[2][1]
        wl_rot_z[2] = n_rot_z[0] * r_mat[0][2] + n_rot_z[1] * r_mat[1][2] + n_rot_z[2] * r_mat[2][2]
      
        r_mat2_rv(world_dial_value[dial_r_x],  world_dial_value[dial_r_y], world_dial_value[dial_r_z], 
          wl_rot_x, wl_rot_y, wl_rot_z)

        if (w_rot_stereo != 0) {
          rv2r_mat(0, w_rot_stereo, 0, s_rot_x, s_rot_y, s_rot_z)       	
          n_rot_x[0] = s_rot_x[0] * wl_rot_x[0] + s_rot_x[1] * wl_rot_y[0] + s_rot_x[2] * wl_rot_z[0]
          n_rot_x[1] = s_rot_x[0] * wl_rot_x[1] + s_rot_x[1] * wl_rot_y[1] + s_rot_x[2] * wl_rot_z[1]
          n_rot_x[2] = s_rot_x[0] * wl_rot_x[2] + s_rot_x[1] * wl_rot_y[2] + s_rot_x[2] * wl_rot_z[2]
																						  
          n_rot_y[0] = s_rot_y[0] * wl_rot_x[0] + s_rot_y[1] * wl_rot_y[0] + s_rot_y[2] * wl_rot_z[0]
          n_rot_y[1] = s_rot_y[0] * wl_rot_x[1] + s_rot_y[1] * wl_rot_y[1] + s_rot_y[2] * wl_rot_z[1]
          n_rot_y[2] = s_rot_y[0] * wl_rot_x[2] + s_rot_y[1] * wl_rot_y[2] + s_rot_y[2] * wl_rot_z[2]
																						  
          n_rot_z[0] = s_rot_z[0] * wl_rot_x[0] + s_rot_z[1] * wl_rot_y[0] + s_rot_z[2] * wl_rot_z[0]
          n_rot_z[1] = s_rot_z[0] * wl_rot_x[1] + s_rot_z[1] * wl_rot_y[1] + s_rot_z[2] * wl_rot_z[1]
          n_rot_z[2] = s_rot_z[0] * wl_rot_x[2] + s_rot_z[1] * wl_rot_y[2] + s_rot_z[2] * wl_rot_z[2]
          
          for (let i = 0; i < 3; i++) {
            wl_rot_x[i] = n_rot_x[i]
            wl_rot_y[i] = n_rot_y[i]
            wl_rot_z[i] = n_rot_z[i]          	
          }
        }

          
        r_mat_inv( wl_rot_x, wl_rot_y, wl_rot_z, wi_rot_x, wi_rot_y, wi_rot_z)

        lastworld_dial_value[dial_r_x] = world_dial_value[dial_r_x]
        lastworld_dial_value[dial_r_y] = world_dial_value[dial_r_y]
        lastworld_dial_value[dial_r_z] = world_dial_value[dial_r_z]
 
      }
    
    let a = m_id()
    for (i = 0; i < 3; i++) {
	  a[0][i] = scale*l_rot_x[i]
	  a[1][i] = scale*l_rot_y[i]
	  a[2][i] = scale*l_rot_z[i]
      a[i][3] = l_offset[i]
    }
    a[0][3] -= w_range
    a[1][3] -= h_range
    a[2][3] -= 10000
        
    // fill matrix representing the rotation we wish to do */
    let r = m_id()
    for (i = 0; i < 3; i++) {
      r[0][i]=wl_rot_x[i]
      r[1][i]=wl_rot_y[i]
      r[2][i]=wl_rot_z[i]      
    }

    let b = mmult(r, a)
    
    // get the new values for rot_x,y,z and x,y,z_offset
    for (i = 0; i<3; i++) {
	  rot_x[i] = b[0][i] / scale
	  rot_y[i] = b[1][i] / scale
	  rot_z[i] = b[2][i] / scale
    }
    x_offset = b[0][3] + w_range + world_dial_value[dial_t_x] * zoom * x_range
    y_offset = b[1][3] + h_range + world_dial_value[dial_t_y] * zoom * y_range
    z_offset = b[2][3] + 10000 +   world_dial_value[dial_t_z] * zoom * z_range
    
    
    if (use_stereo) {
      x_offset -= x_range / 4
    }
    
    
    lastworld_dial_value[dial_r_x] = world_dial_value[dial_r_x]
    lastworld_dial_value[dial_r_y] = world_dial_value[dial_r_y]
    lastworld_dial_value[dial_r_z] = world_dial_value[dial_r_z]
    lastworld_dial_value[dial_t_x] = world_dial_value[dial_t_x]
    lastworld_dial_value[dial_t_y] = world_dial_value[dial_t_y]
    lastworld_dial_value[dial_t_z] = world_dial_value[dial_t_z]
    w_last_rs = w_rot_stereo
    
    // Make transfor recalculate everything
    redraw_flag |= (rf_refresh|rf_rotate|rf_trans)
	  }
}

const initialize_wb_rotate = (db) => {
    bonds_selected = bond_selected = void 0
    world_dial_value[dial_r_x] = 0
    world_dial_value[dial_r_y] = 0
    world_dial_value[dial_r_z] = 0
    lastworld_dial_value[dial_r_x] = 0
	lastworld_dial_value[dial_r_y] = 0
	lastworld_dial_value[dial_r_z] = 0
    world_dial_value[dial_t_x] = 0
	world_dial_value[dial_t_y] = 0
	world_dial_value[dial_t_z] = 0
    lastworld_dial_value[dial_t_x] = 0
	lastworld_dial_value[dial_t_y] = 0
	lastworld_dial_value[dial_t_z] = 0
}

module_exports = {
	initialize_wb_rotate: initialize_wb_rotate, 
	world_rotate: world_rotate,
	bond_rotate: bond_rotate,
	traverse: traverse,
	set_bond_axis: set_bond_axis,
	create_bond_axis: create_bond_axis,
	bond_rotatable: bond_rotatable,
	reset_bonds_sel: reset_bonds_sel,
	remove_bond: remove_bond,
	reset_coord: reset_coord,
	update_coord: update_coord,
	reset_visited: reset_visited,
	construct_graph: construct_graph
}

