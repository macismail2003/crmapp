/* global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function() {
	"use strict";

	sap.ui.require([
		"com/seaco/zcrmapps/zcrmapps/test/integration/AllJourneys"
	], function() {
		QUnit.start();
	});
});