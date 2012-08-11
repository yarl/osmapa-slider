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

// OSRM selector
// [create special selector elements]


OSRM.GUI.extend( {

// initialize selector with all options and our look&feel
selectorInit: function(id, options, selected, onchange_fct) {
	// create dropdown menu
	var select = document.getElementById(id);
	select.className += " styled-select-helper base-font";
	select.onchange = function() { OSRM.GUI.selectorOnChange(this); onchange_fct(this.value); };	
		
	// fill dropdown menu
	for(var i=0, size=options.length; i<size; i++) {
		var option=document.createElement("option");
		option.innerHTML = options[i].display;
		option.value = options[i].value;
		select.appendChild(option);
	}
	select.value = options[selected].value;
	
	// create visible dropdown menu
	var textnode = document.createTextNode( options[selected].display );
	var myspan = document.createElement("span");
	myspan.className = "styled-select base-font";
	myspan.id = "styled-select-" + select.id;
	myspan.appendChild(textnode);
	select.parentNode.insertBefore(myspan, select);
	myspan.style.width = (select.offsetWidth-2)+"px";
	myspan.style.height = (select.offsetHeight)+"px";	// clientHeight gives the height of the opened dropbox!
},

// required behaviour of selector on change to switch shown name
selectorOnChange: function(select) {
	var option = select.getElementsByTagName("option");	
	for(var i = 0; i < option.length; i++)
	if(option[i].selected == true) {
		document.getElementById("styled-select-" + select.id).childNodes[0].nodeValue = option[i].childNodes[0].nodeValue;
		break;
	}
},

// change selector value
selectorChange: function(select, value) {
	select.value = value;
	OSRM.GUI.selectorOnChange(select);
}

});