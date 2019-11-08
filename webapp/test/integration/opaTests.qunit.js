/* global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function() {
	"use strict";

	sap.ui.require([
		"copypastetable/sample_ui_table/test/integration/AllJourneys"
	], function() {
		QUnit.start();
	});
});