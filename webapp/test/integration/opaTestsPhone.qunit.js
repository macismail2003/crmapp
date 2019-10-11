/* global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function() {
	"use strict";

	sap.ui.require([
		"com/seaco/zcrmapps/zcrmapps/test/integration/PhoneJourneys"
	], function() {
		QUnit.start();
	});
});