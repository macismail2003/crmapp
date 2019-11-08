sap.ui.define([], function () {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		numberUnit : function (sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},
		
		statusText : function(oValue){
			if(oValue === "Success"){
				return "sap-icon://message-success";
			} else if (oValue === "Warning"){
				return "sap-icon://alert";
			} else if (oValue === "Error"){
				return "sap-icon://error";
			}
			else if (oValue === "Delete"){
				return	"sap-icon://delete";
			}
			else {
				return	"";
			}
		},
		
		statusColor : function(oColor){
			if(oColor === "Success"){
				return "Positive";
			} else if (oColor === "Warning"){
				return "sap-icon://alert";
			} else if(oColor === "Error"){
				return	"Negative";
			} else {
				return	"Neutral";
			}
			
		}

	};

});