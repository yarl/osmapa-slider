/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// OSRM routing alternatives
// [everything about handling alternatives]


OSRM.RoutingAlternatives = {
		
// data of gui buttons for alternativess
_buttons: [ 
	{id:"gui-a", label:"Najszybsza"},
	{id:"gui-b", label:"Alternatywna"}
],

// initialize required values
init: function() {
	OSRM.G.active_alternative = 0;
	OSRM.G.alternative_count = 0;
},

// restructure response data  
prepare: function(response) {
	// move best route to alternative array
	var the_response = OSRM.G.response;
	the_response.alternative_geometries.unshift( response.route_geometry );
	the_response.alternative_instructions.unshift( response.route_instructions );
	the_response.alternative_summaries.unshift( response.route_summary );
	
	// update basic information
	OSRM.G.alternative_count = response.alternative_geometries.length;
	if( OSRM.G.active_alternative >= OSRM.G.alternative_count )	// reset if the selected alternative cannot be found 
		OSRM.G.active_alternative = 0;
	
	// switch data
	the_response.route_geometry = the_response.alternative_geometries[OSRM.G.active_alternative];
	the_response.route_instructions = the_response.alternative_instructions[OSRM.G.active_alternative];
	the_response.route_summary = the_response.alternative_summaries[OSRM.G.active_alternative];	
},

// switch active alternative and redraw buttons accordingly
setActive: function(button_id) {
	// switch active alternative
	OSRM.G.active_alternative = button_id;
	
	// redraw clickable buttons
	var buttons = OSRM.RoutingAlternatives._buttons;
	for(var i=0, size=OSRM.G.alternative_count; i<size; i++) {
		document.getElementById( buttons[i].id ).className = (button_id == i) ? "route-selector selected" : "route-selector";
	}
	// do nothing for non-clickable buttons
},

//draw GUI and register click events
show: function() {
	var buttons = OSRM.RoutingAlternatives._buttons;
	var data = "";
	// draw clickable buttons
	for(var i=0, size=OSRM.G.alternative_count; i<size; i++) {
		var distance = OSRM.Utils.toHumanDistance(OSRM.G.response.alternative_summaries[i].total_distance);
		var time = OSRM.Utils.toHumanTime(OSRM.G.response.alternative_summaries[i].total_time);
		var tooltip = OSRM.loc("DISTANCE")+": "+distance+" "+OSRM.loc("DURATION")+": "+time;
		var buttonClass = (i == OSRM.G.active_alternative) ? "route-selector selected" : "route-selector";
		data = '<a class="'+buttonClass+'" id="'+buttons[i].id+'" title="'+tooltip+'">'+buttons[i].label+'</a> ' + data;
	}
	// draw non-clickable buttons
	for(var i=OSRM.G.alternative_count, size=buttons.length; i<size; ++i) {
		data = '<a class="route-selector inactive" id="'+buttons[i].id+'">'+buttons[i].label+'</a> ' + data;
	}
	// add buttons to DOM
	document.getElementById('information-box-header').innerHTML = data + document.getElementById('information-box-header').innerHTML;
	
	// add events
	for(var i=0, size=OSRM.G.alternative_count; i<size; i++) {
		document.getElementById(buttons[i].id).onclick = function (button_id) { return function() {OSRM.RoutingAlternatives._click(button_id); }; }(i) ;
		document.getElementById(buttons[i].id).onmouseover = function (button_id) { return function() {OSRM.RoutingAlternatives._mouseover(button_id); }; } (i);
		document.getElementById(buttons[i].id).onmouseout = function (button_id) { return function() {OSRM.RoutingAlternatives._mouseout(button_id); }; } (i);
	}
},

// mouse events on buttons
_click: function(button_id) {
	if( OSRM.G.active_alternative == button_id )
		return;
	OSRM.RoutingAlternatives.setActive(button_id);
	OSRM.G.route.hideAlternativeRoute();
	
	// switch data
	var the_response = OSRM.G.response;
	the_response.route_geometry = the_response.alternative_geometries[button_id];
	the_response.route_instructions = the_response.alternative_instructions[button_id];
	the_response.route_summary = the_response.alternative_summaries[button_id];
	
	// redraw route & data
	OSRM.RoutingGeometry.show(the_response);
	OSRM.RoutingNoNames.show(the_response);
	OSRM.RoutingDescription.show(the_response);
},
_mouseover: function(button_id) {
	if( OSRM.G.active_alternative == button_id )
		return;

	var geometry = OSRM.RoutingGeometry._decode( OSRM.G.response.alternative_geometries[button_id], 5);
	OSRM.G.route.showAlternativeRoute(geometry);
},
_mouseout: function(button_id) {
	if( OSRM.G.active_alternative == button_id )
		return;
	
	OSRM.G.route.hideAlternativeRoute();		
}

};