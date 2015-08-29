var base_url = "http://127.0.0.1:8000/opinion/";


$(document).ready(function() {
	$('#save_roll').click(save_roll_number);
	$('#submit_opinion').click(submit_opinion);
	init_values();
	// load_graph();
	get_slided_values([1,-2,3]);
});
function init_values(){
	roll_number = getCookie("roll_number");
	if (roll_number != ""){
		$('#roll_number').val(roll_number);
		load_graph(roll_number);
	}
}
function load_graph(roll_number){
	post_object = new Object();
	post_object.student_id = roll_number;
	make_ajax_request(post_object,"get_neighbors_with_influece_values",draw_neighbor_graph);
	return;
}
function save_roll_number(){
	var roll_number = $('#roll_number').val();
	if (roll_number == ""){
		alert("Enter valid roll number !");
		return;
	}
	document.cookie="roll_number=" + roll_number ;
	var x = document.cookie;
	// alert(x);
	load_graph(roll_number);
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}


function dummy_success(result){
	alert('result = ' + result);
}

function make_ajax_request(object_to_pass,url_func,success_function){
	var submit_url = base_url + url_func;
	// alert("JSON DATA = " + jsonDataStr + " " + submit_url);
	$.ajax({
		type : "POST",
		url : submit_url,
		data :object_to_pass,
		success : function(result){
			success_function(result);
		},
		error : function() {
			alert("Unable to submit opinion");
		}
	});
}


function submit_opinion(){
	var text = $('#opinion_text').val();
	var value = $('#example').val();
	var student_id = getCookie("roll_number");
	if (student_id == ""){
		alert("Roll Number not entered cant submit data !");
		return;
	}
	
	var opinion = new Object();
	opinion.text = text;
	opinion.value = value;
	opinion.student_id = student_id;

	make_ajax_request(opinion,"add_opinion",dummy_success);
}

function get_latest_opinions(){

}

function get_slided_values(influence_values){
	var min = Math.min.apply(null, influence_values);
	if (min >= 0){
		return influence_values;
	}
	increment = (-1.0) * (min * 110.0 )/ 100.0 + 10.0
	slided_values = new Array(influence_values.length)
	for (i in influence_values){
		slided_values[i] = influence_values[i] + increment;
	}
	// alert(slided_values);
	return slided_values;
}
function get_key_value_list(dict){
	var key_list = new Array();
	var value_list = new Array();
	for (var key in dict) {
		  if (dict.hasOwnProperty(key)) {
	    	key_list.push(key);
	    	value_list.push(dict[key]);
	  	}
	}
	return [key_list,value_list];
}

function get_chart_html(label_list,value_list,plot_value_list){
	html_text = "<ul class=\"chart\"><li class=\"title\" title=\"Student Graphs\"></li>"
	for (i in label_list){
		line = "<li class=\"current\" title=\""+ label_list[i] +"\"><span class=\"bar\" data-number=\""+ plot_value_list[i] + "\"></span><span class=\"number\">" + value_list[i] + "</span></li>";
		html_text += line;
	}
	html_text += "</ul>"
	return html_text;
}
function draw_neighbor_graph(result){
	// alert("result == " + result);
	neighbot_list_text = JSON.parse(result);
	neighbor_list = neighbot_list_text.neighbor_list;
	neighbor_list = JSON.parse(neighbor_list)
	key_value_list = get_key_value_list(neighbor_list)
	key_list = key_value_list[0];
	value_list = key_value_list[1];
	positive_value_list = get_slided_values(value_list);
	// alert("keys = " + key_list + " : values = " + value_list + " positive = " + positive_value_list);
	chart_html = get_chart_html(key_list,value_list,positive_value_list);
	$("#neighbor_graph").html(chart_html);
	$("body").append('<script type="text/javascript" src="' + "build/js/jquery.horizBarChart.min.js" + '"></script>')
	$('.chart').horizBarChart({
		  selector: '.bar',
		  speed: 3000
		});
	// $.getScript("../build/js/jquery.horizBarChart.min.js", function(){

	//    // alert("Script loaded but not necessarily executed.");

	// });

	// alert(chart_html);
	return;
}