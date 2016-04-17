'use strict';

var qh = {
	landpage:{
		section:{
			navbar: "#qhHeader",
			drawer: "#qhDrawer",
			content: "#qhContent"
		},
		tab1SearchCard:{
			handle: "#qhTab1Card",
			field: "#qhTab1Search"
		},
		tab2SearchCard:{
			handle: "#qhTab2Card",
			field: "#qhTab2Search"
		}
	},
	pullUserDataCardTab1:{
		handle: "#qhTab1getUserDetails",
		field:{
			textBox: "#qhTab1SearchUserText",
			searchButton: "qhTab1SearchUserButton",
			closeButton: "#qhTab1Close"
		}
	}	
};

var dialog = document.querySelector("#qhTab1getUserDetails");

function init(){
	if (! dialog.showModal) {
            dialogPolyfill.registerDialog(dialog);
        }
}
$(qh.landpage.tab1SearchCard.field).on('click', function(){
	dialog.showModal();
	
	$(qh.pullUserDataCardTab1.field.closeButton).on('click', function(){
		dialog.close();
	});
});

$(document).ready(init);
