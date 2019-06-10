
var data = {"map":[],
	    "universe_default":[],
	    "rules_PRACTICE":{"product":[], "business":[], "value":[]},
	    "rules_ROYALTY":{"product":[], "business":[], "value":[]},
	    "COMBO_LIMIT":2,
	    "patents":[]}


function add_category(nm){

    data.map.push({"category_name":nm, "substitutes":[]})
    
}

function focus_patent(p){

    $('#claim_box').html('')
    $('#claim_box').html(p.claims)

}

//UNIVERSE FUNCTIONS
function  u_create_default(){
    
    var recurs = function(curr_ans, lvl){

	if(lvl == 0){
	    var ans = []
	    for(var i = 0; i < data.map[0].substitutes.length; i++)
		ans.push([data.map[0].substitutes[i]])
	    return recurs(ans, 1)
	    
	}
	
	var ans = [];
	for(var i = 0; i < curr_ans.length; i++){
	    for(var j = 0; j < data.map[lvl].substitutes.length; j++)
	    {
		ans.push(curr_ans[i].concat(data.map[lvl].substitutes[j]))
	    }
	}

	if(lvl == data.map.length - 1)
	    return ans;
	else
	    return recurs(ans, lvl + 1)
	
    }


    


    var tmp = recurs([], 0)
    var ans = []
    for(var i = 0; i < tmp.length; i++){
	var ele = {"val":0, "instance":tmp[i]}
	ans.push(ele)
    }

    var cats = data.map.slice(0)
    
    var univ = {"categories": cats, "instances": ans}
    //   for(var i = 0; i < data.rules_universal.length; i++){
    //	univ = data.rules_universal.func(univ)
    //  }
    
    data.universe_default = univ  
}

function select_view_pract(b){
    
    $("#bsel_pract").removeClass("button_sel");
    $("#bsel_royalty").removeClass("button_sel");
    $("#rules_box").html('');

    if(b){
	$('#rules_select').val('PRACTICE');
	$('#view_royalty').hide()
	$('#view_practice').show()
	$("#universe_stats_PRACTICE").show()
	$("#universe_stats_ROYALTY").hide()
	$("#bsel_pract").addClass("button_sel");	
    }else{
	$('#rules_select').val('ROYALTY');
	$('#rules_select>option:eq(1)').attr('selected', true);
	$("#bsel_royalty").addClass("button_sel");	
	$('#view_royalty').show()
	$('#view_practice').hide()
	$("#universe_stats_PRACTICE").hide()
	$("#universe_stats_ROYALTY").show()

    }

    //show rules
    var arr = ["product", "business", "value"];
    var rules = data["rules_ROYALTY"];
    if(b)
	rules = data["rules_PRACTICE"];

    var tab = $('<table id="rules_tab" style="font-size:9px; width:100%"></table>')
    $("#rules_box").append(tab);
    
    var tr = $('<tr></tr>')
    var td = $('<th style="width:20px"></th>')
    var inp = $('<input type="checkbox"></input>');
    inp.prop("checked", true)
    inp.click(function(){

	
	if($(this).prop('checked')){

	    $('#rules_tab tr input').each(function(i, v) {
		$(v).prop("checked", true)
		$(v).trigger("change");
	    });

	    
	}else{

	    $('#rules_tab tr input').each(function(i, v) {
		$(v).prop("checked", false)
		$(v).trigger("change");
	    });

	    
	}

    })
    td.append(inp)
    tr.append(td)
    var txt = "All Practice Rules"
    if(!b)
	txt = "All Royalty Rules"
    td = $('<th style="text-decoration:underline">'+txt+'</th>')
    tr.append(td)
    tab.append(tr)

    for(var i = 0 ; i< arr.length; i++){
	for(var j=0; j < rules[arr[i]].length; j++){
	    var r = rules[arr[i]][j];
	    
	    tr = $('<tr></tr>')
	    td = $('<td style="width:20px"></td>')
	    inp = $('<input type="checkbox"></input>');
	    inp.change(function(the_r){return function(){

		the_r.is_applied = ($(this).prop('checked'))
		
	    }}(r))
	    if(r.is_applied)
		inp.prop("checked", true)
	    td.append(inp)
	    tr.append(td)
	    td = $('<td style="text-align:center; text-decoration:underline;cursor:pointer">'+r.rule_name+'</td>')
	    td.click(function(the_r){return function(){
		$('#rules_view').html('')
		$('#rules_view').html(the_r.toString())
		
	    }}(r))
	    tr.append(td)
	    tab.append(tr)
	    
	}
	
	
    }
    
}


function refresh_SM(){

    data.patents.forEach(function(item, index){
	var targ = null;
	if(item.owner == "red")
	    targ = $("#red_pat_list")
	else
	    targ = $("#blue_pat_list")

	var d = $('<div style="cursor:pointer">'+item.num+'</div>')
	d.on("click", function (ti){ return function(){
	    focus_patent(ti)
	}}(item))
	targ.append(d)

    })

    
    //GENERATE MAP
    $("#product_map").html('') 
    
    for(var i = 0; i < data.map.length; i++){
	
	var d = $('<div style="display:flex;flex-direction:row; margin-bottom:5px"></div>')
	var s = $('<span style="background-color:#ddd; box-sizing:border-box; border:1px solid black;flex:0 0 50px; padding:2px; text-align:center; position:relative"><div style="  position: absolute;  top: 50%; text-align:center; width:100%;  transform: translateY(-50%);">'+data.map[i].category_name+':</div></span>')
	d.append(s)

	for(var j = 0; j < data.map[i].substitutes.length; j++){

	    var ss = $('<span style="background-color:#fff; box-sizing:border-box; border:1px solid black;flex:0 0 50px; padding:2px; border-radius:5px; margin-left:5px; text-align:center"><div style="text-decoration:underline">'+ data.map[i].substitutes[j].sub_name +'</div></span>')
	    var pats = $('<div></div>')
	    ss.append(pats)	    
	    d.append(ss)
	    $("#product_map").append(d)
	    

	    for(var k = 0; k < data.patents.length; k++){
		
		if(data.patents[k].subs_complete.includes(data.map[i].substitutes[j].sub_name) || data.patents[k].subs_partial.includes(data.map[i].substitutes[j].sub_name)){
		    
	    	    var color = data.patents[k].owner
	    	    var partial = ""
		    var txt = data.patents[k].num
	            if(data.patents[k].subs_complete.includes(data.map[i].substitutes[j].sub_name))
	    		partial = " complete";
		    else{
			txt = txt + "["+(data.patents[k].subs_partial.indexOf(data.map[i].substitutes[j].sub_name) + 1)+"/"+(data.patents[k].subs_partial.length)+"]"
		    }
		    pats.append($('<div class="'+color+'_pat'+partial+'"> '+txt+' </div>'))
	    	}
	    }
	}
	
    }


    
    

}

//following rule application, PRACTIVE OR ROYALTY
function refresh_instances(type){
    
    var choose2 = function (n, k){
	var ans = []
	var curr = []
	for(var i = 0; i < k + 2; i++)
	    curr[i] = i;

	curr[k] = n;
	curr[k+1] = 0;
	
	var j = 1
	do{
	    var d = curr.slice(0, k);
	    for(var q = 0; q < d.length; q++)
		d[q] = d[q]+1;
	    ans.push(d)
	    j = 1
	    while(curr[j-1] + 1 == curr[j]){
		curr[j-1] = j - 1;
		j = j + 1;
		
	    }
	    curr[j-1]++
	    
	}while(j <= k)


	return ans;

    }
    

    //INSTANCES DISPLAY
    var tab = $('<table style="font-size:10px; border:1px solid black"></table>')
    var row = $('<tr style="background-color:#ddd;"></tr>')
    
    var td = $('<th>#</th>')
    row.append(td)

    var td = $('<th>Instance Value</th>')
    row.append(td)
    
    for(var i = 0; i < data.map.length; i++){
	td = $('<th>'+data.map[i].category_name+'</th>')
	row.append(td)
    }
    tab.append(row)
    

    var def_universe = data["universe_default"].instances.slice()

    //apply product rules to instances
    //apply business rules to instances
    //apply value rules to instances
    
    var the_rules = data["rules_"+type];
    var rules_arr = ['product', 'business', 'value']


    for(var i = 0; i < rules_arr.length; i++){
	for(var j = 0; j < the_rules[rules_arr[i]].length; j++){
	    var r = the_rules[rules_arr[i]][j];
	    if(r.is_applied){
		r(def_universe, [])
	    }
	    
	}
    }

    
    //sort
    var ans = def_universe;
    for(var i = 1; i< ans.length; i++){
	if(ans[i].val > ans[i-1].val){
	    
	    var b = ans[i];
	    ans[i] = ans[i - 1];
	    ans[i - 1] = b;
	    if(i != 1)
		i -= 2
	}
    }


    
    for(var j = 0; j < def_universe.length; j++){
	var ele = def_universe[j]
	row = $('<tr style=""></tr>')
	


	var td = $('<td style="text-align:center">'+ele.val+'</td>')
	row.append(td)

	for(var i = 0; i < ele.instance.length; i++){
	    var td = $('<td>'+ele.instance[i].sub_name+'</td>')
	    row.append(td)
	}

	row.prepend($('<td>'+(j+1)+'</td>'))

	tab.append(row)
    }

    
    $('#universes_'+type).html('')
    $('#universes_'+type).append(tab)

    

    //COMBINATIONS DISPLAY
    var combos = [];
    var p = [];

    for(var i = 1; i <= data.COMBO_LIMIT; i++)
	p = p.concat(choose2(def_universe.length, i));
    

    
    for(var i = 0; i < p.length; i++){

	var insts = [];

	for(var j = 0; j < p[i].length; j++){
	    insts.push(Object.assign({}, def_universe[p[i][j]-1]))
	}

	combos.push({val:0, combo:p[i], combo_instances:insts})
    }


    //apply product rules to combos
    //apply business rules to combos
    //apply value rules to combos


    var the_rules = data["rules_"+type];
    var rules_arr = ['product', 'business', 'value']


    for(var i = 0; i < rules_arr.length; i++){
	for(var j = 0; j < the_rules[rules_arr[i]].length; j++){
	    var r = the_rules[rules_arr[i]][j];
	    if(r.is_applied){
		r([], combos)
	    }
	    
	}
    }
    
    //sort
    
    var ans = combos;
    
    //sort
    for(var i = 1; i< ans.length; i++){
	if(ans[i].val > ans[i-1].val){
	    
	    var b = ans[i];
	    ans[i] = ans[i - 1];
	    ans[i - 1] = b;
	    if(i != 1)
		i -= 2
	}
    }



    //  combos = ans;


    
    var tab = $('<table style="font-size:10px; border:1px solid black"></table>')
    var row = $('<tr style="background-color:#ddd;"></tr>')
    
    var td = $('<th>#</th>')
    row.append(td)

    var td = $('<th>Combined Value</th>')
    row.append(td)

    var td = $('<th>Combinations</th>')
    row.append(td)

    tab.append(row)

    
    for(var i = 0; i < combos.length; i++){

	row = $('<tr style=""></tr>')
	
	var td = $('<td style="text-align:center">'+combos[i].val+'</td>')
	row.append(td)

	var td = $('<td  style="text-align:center">'+JSON.stringify(combos[i].combo)+'</td>')
	row.append(td)


	row.prepend($('<td>'+(i+1)+'</td>'))

	tab.append(row)
    }


    //OVERALL STATS
    $('#combos_holder_'+type).html('')
    $('#combos_holder_'+type).append(tab)



    
    //&DeltaV<sub>A->B</sub>: " + 1
    $("#universe_stats_"+type).html('')
    var d = ('<span style="flex: 1; text-align:center; ">Instances: '+ def_universe.length +'</span>')
    $("#universe_stats_"+type).append(d)
    d = ('<span style="flex: 1; text-align:center; ">Instance V<sub>B</sub>: ' + 1 +'</span>')
    $("#universe_stats_"+type).append(d)
    d = ('<span style="flex: 1; text-align:center; ">Combinations: '+ combos.length +'</span>')
    $("#universe_stats_"+type).append(d)

    d = ('<span style="flex: 1; text-align:center; ">Combo V<sub>B</sub>: ' + 1 +'</span>')
    $("#universe_stats_"+type).append(d)
    
}




function add_rule(type1, type2, name, rule_func){
    
    rule_func.is_applied = true;
    rule_func.rule_name = name;
    data[type1][type2].push(rule_func)


}

function add_sub(cat, sub){

    for(var i = 0; i < data.map.length; i++){
	if(data.map[i].category_name == cat){
	    data.map[i].substitutes.push(sub)
	    return;
	}
    }
    alert("Add sub missing category")
    
}


function create_sub(name, val){
    
    return {"sub_name":name, "local_value": val}
}


function add_patent(name, num, claims, owner, subs_complete, subs_partial){

    var a = {"name":name, "num":num, "claims":claims, "owner":owner, "subs_partial":subs_partial, "subs_complete":subs_complete}
    data.patents.push(a);
    
}

window.onload = function () {

    $('#rules_select').change(function(){

        select_view_pract($('#rules_select').val() == 'PRACTICE')
	
    });

    //create product_map
    add_category("Animal")
    add_category("Axle")
    add_category("Wheel")
    add_category("Blinders")
    add_category("Carriage")

    add_sub("Animal", create_sub("Horse", 1))
    add_sub("Animal", create_sub("Horse_Speed", 1))
    add_sub("Animal", create_sub("Ox", 1))
    
    add_sub("Axle", create_sub("Steel_Axle", 1))
    add_sub("Axle", create_sub("Iron_Axle", 1))

    add_sub("Wheel", create_sub("Rubber_Wheel", 1))
    add_sub("Wheel", create_sub("Wooden_Wheel", 1))
    add_sub("Wheel", create_sub("Titanium_Wheel", 1))


    add_sub("Blinders", create_sub("Leather", 1))
    add_sub("Blinders", create_sub("None", 1))


    add_sub("Carriage", create_sub("Mahogany", 1))
    add_sub("Carriage", create_sub("Oak", 1))
    

    //add patents
    //function add_patent(name, num, claims, owner, subs_complete, subs_partial){
    add_patent("Systems and Methods for Horse", "12345678", "Claim 1 <br> Claim 2 <br>", "red", ["Horse"], [])

    add_patent("Iron Axle Thing", "7777777", "Claim 1 <br> Claim 2 <br> claim 3", "blue", [], ["Iron_Axle", "Titanium_Wheel"])


    //rules workspace

    var rule_remove_item = function(txt){ return function(u_inst,u_combo){
	
	for(var i = 0; i < u_inst.length; i++){
	    for(var j = 0; j < u_inst[i].instance.length; j++){
		var item = u_inst[i].instance[j];
		if(item.sub_name == txt){
		    u_inst.splice(i, 1);
		    i--;
		    break;
		}
	    }
	}
    }
					}
    


    var rule_must_have_sub = function(txt){
	return function(u_inst,u_combo)
	{
	    for(var i = 0; i < u_inst.length; i++){
		var has_item = false;
		for(var j = 0; j < u_inst[i].instance.length; j++){
		    var item = u_inst[i].instance[j];
		    if(item.sub_name.includes(txt)){
			has_item = true;
			break;
		    }
		}
		if(!has_item){
		    u_inst.splice(i, 1);
		    i--;
		}
	    }
	}
    }


    

    var rule_must_have_patent_owner = function(color){
	return function(u_inst,u_combo)
	{

	    for(var k = 0; k < data.patents.length; k++){
		if(data.patents[k].owner != color)
		    continue
      		for(var i = 0; i < u_inst.length; i++){
		    var has_patent = false;
		    for(var j = 0; j < u_inst[i].instance.length; j++){
			var item = u_inst[i].instance[j];
			if(data.patents[k].subs_complete.includes(item.sub_name) || data.patents[k].subs_partial.includes(item.sub_name)){
			    has_patent = true;
			    break;
			}
		    }
		    if(has_patent)
			break;
		}
		if(!has_patent){		
		    u_inst.splice(i, 1);
		    i--;

		}

	    }
	}
    }
    


    var rule_only_instances_w_patents = function(u_inst, u_combo){
	
      	for(var i = 0; i < u_inst.length; i++){
	    var has_patent = false;
	    for(var j = 0; j < u_inst[i].instance.length; j++){
		var item = u_inst[i].instance[j];
		for(var k = 0; k < data.patents.length; k++){
		    if(data.patents[k].subs_complete.includes(item.sub_name) || data.patents[k].subs_partial.includes(item.sub_name)){
			has_patent = true;
			break;
		    }
		}
		if(has_patent)
		    break;
	    }
	    if(!has_patent){		
		u_inst.splice(i, 1);
		i--;
	    }
	}
    }


    var rule_augment_local_value_with_patent = function(pat, func){
	return function(u_inst, u_combo){

	    var the_pat = null;
	    for(var k = 0; k < data.patents.length; k++){
		if(data.patents[k].num == pat)
		    the_pat = data.patents[k];
	    }
	    if(the_pat == null)
		return;
	    
	    
      	    for(var i = 0; i < u_inst.length; i++){
		var has_patent = false;
		for(var j = 0; j < u_inst[i].instance.length; j++){
		    var item = u_inst[i].instance[j];


		    if(the_pat.subs_complete.includes(item.sub_name) || the_pat.subs_partial.includes(item.sub_name)){
		    	
			item.local_value = func(item.local_value);
			console.log('augmented' +  item.local_value)
			has_patent = true;
			break;
		    }
		    
		    if(has_patent){
			break;
		    }
		}

		if(has_patent){
		    var sum = 0;
		    for(var j = 0; j <  u_inst[i].instance.length; j++)
			sum +=  u_inst[i].instance[j].local_value
		    console.log("sum:" + sum)
		    sum /= u_inst[i].instance.length;
		    u_inst[i].val = sum;
		}
		
	    }
	    
	}
    }
    

    var rule_only_instances_w_patent_changes = function(u_inst, u_combo){
	
      	for(var i = 0; i < u_inst.length; i++){
	    var has_patent = false;
	    for(var j = 0; j < u_inst[i].instance.length; j++){
		var item = u_inst[i].instance[j];
		for(var k = 0; k < data.patents.length; k++){
		    if(data.patents[k].subs_complete.includes(item.sub_name) || data.patents[k].subs_partial.includes(item.sub_name)){
			has_patent = true;
			break;
		    }
		}
		if(has_patent)
		    break;
	    }
	    if(!has_patent){		
		u_inst.splice(i, 1);
		i--;
	    }
	}
    }




    //if(inst.instance)

    

    //PRACTICE RULES
    // add_rule("rules_PRACTICE", "product", "Remove Horses", rule_remove_item("Horse"))
    add_rule("rules_PRACTICE", "product", "Remove Horse_Speed", rule_remove_item("Horse_Speed"))
    add_rule("rules_PRACTICE", "product", "Augment 12345678",  rule_augment_local_value_with_patent("12345678", function(lv){return lv * 1.2}))


    add_rule("rules_PRACTICE", "product", "Require Red Owner",  rule_must_have_patent_owner("red"))

    
    add_rule("rules_PRACTICE", "business", "B func", function(u_inst,u_combo){
	//if(inst.instance)
    })
    add_rule("rules_PRACTICE", "value", "Value func", function(u_inst,u_combo){
	//if(inst.instance)


	for(var i = 0; i < u_inst.length; i++){
	    var sum = 0;
	    for(var j = 0; j < u_inst[i].instance.length; j++)
		sum += u_inst[i].instance[j].local_value;

	    sum /= u_inst[i].instance.length;
	    u_inst[i].val = sum;
	}

	
	for(var i = 0; i < u_combo.length; i++){
	    var sum = 0;
	    for(var j = 0; j < u_combo[i].combo_instances.length; j++)
		sum += u_combo[i].combo_instances[j].val;

	    sum /= u_combo[i].combo_instances.length;
	    u_combo[i].val = sum;

	}

	
    })

    //ROYALTY RULES


    add_rule("rules_ROYALTY", "product", "Must have patents", rule_only_instances_w_patents)

    //add_rule("rules_PRACTICE", "product", "Reequire Red Owner",  rule_must_have_patent_owner("red"))
    //add_rule("rules_PRACTICE", "product", "Require Blue Owner",  rule_must_have_patent_owner("blue"))
    
    add_rule("rules_ROYALTY", "product", "Only Leather", rule_must_have_sub("Leather"))
    add_rule("rules_ROYALTY", "product", "P func", function(u_inst,u_combo){
	//if(inst.instance)
    })
    add_rule("rules_ROYALTY", "business", "B func", function(u_inst,u_combo){
	//if(inst.instance)
    })
    add_rule("rules_ROYALTY", "value", "Value func", function(u_inst,u_combo){
	//if(inst.instance)
    })
    
    
    /*
      
    //add rules
    */  
    //add_rule("universal_P", "Default - Require Patent", 0, function(univ){console.log('cat')})
    //  add_rule("universal_P", "Default - Require Patent", 0, function(univ){console.log('cat')})
    
    /*
      add_rule("rules_struct_V_B", "Remove Mahogany", function(univ){
      //	univ.categories.forEach(function(e, i){
      //	    if(category_name === "Mohogany")
      //		univ.categories.splice(i, 1)
      //	})

      univ.instances.forEach(function(inst, i){
      //	  console.log("IN RULES" + JSON.stringify(inst))
      for(var j = 0; j < inst.instance.length; j++){
      if(inst.instance[j].sub_name === "Mahogany"){
      univ.instances.splice(i, 1)
      break;
      }
      }
      })		      	
      })
      

      //add_valuation rules
      var simple_add = function(univ){

      univ.total_value = 100
      }
      add_rule("rule_valuation_V_A", simple_add)
      add_rule("rule_valuation_V_B", simple_add)
      add_rule("rule_valuation_LV_A", simple_add)
      add_rule("rule_valuation_LV_B", simple_add)
      //create_universes
      
      u_create_default()
      var arr = ["V_B", "V_AB", "LV_B", "LV_AB", "V_A", "V_BA", "LV_A", "LV_BA"]
      arr.forEach(function(e){u_create(e)})
      

      init_buttons()
      

      //visualize
      universes_select_view(0)
      refresh()
      //perform calc
      refresh_universes()

      

      

    */

    
    //Create Default Universe
    u_create_default()
    
    refresh_SM() //sub map
    refresh_instances("PRACTICE") //universes
    refresh_instances("ROYALTY") //universes
    select_view_pract(1)



    
    
}
