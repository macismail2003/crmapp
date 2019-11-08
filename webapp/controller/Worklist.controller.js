sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Element",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/m/MessageBox",
	"sap/ui/export/Spreadsheet",
	"sap/m/MessageToast",
	"sap/m/PDFViewer",
	"sap/ui/model/Sorter"
], function (BaseController, JSONModel, formatter, Filter, FilterOperator,Element, Export, ExportTypeCSV, MessageBox, Spreadsheet, MessageToast,
PDFViewer, Sorter) {
	"use strict";

	return BaseController.extend("copypastetable.sample_ui_table.controller.Worklist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit : function () {
			var oDate = new Date();
			var oMonth = oDate.getMonth();
			var oYear = oDate.getFullYear();
			var oDate = oDate.getDate();
			this.getView().byId("idEndDate").setMaxDate(new Date(oYear, oMonth + 3, oDate));
			this.getView().byId("idStartDate").setMinDate(new Date(oYear, oMonth, 1));
			this.getView().byId("idStartDate").setDateValue(new Date(oYear, oMonth, 1));
			this.getView().byId("idEndDate").setMinDate(new Date());
			this.getView().byId("idEndDate").setDateValue(new Date(oYear, oMonth + 1, 0));
			// this.getView().byId("idEndDate").setMaxDate(new Date());
			this.getOwnerComponent().getModel().setDeferredGroups(["ReadReturnAuthorization"]);
			var oModel = new JSONModel({});
			this.setModel(oModel, "data");
				var model = new sap.ui.model.json.JSONModel({
				items: [{
					Status: "",
					City: "",
					Flag: true
				}, {
					Status: "",
					City: "",
					Flag: true
				}, {
					Status: "",
					City: "",
					Flag: true
				}, {
					Status: "",
					City: "",
					Flag: true
				}, {
					Status: "",
					City: "",
					Flag: true
				}]

			});
			this.getView().setModel(model);
			var oViewModel = new JSONModel({});
			this.getView().setModel(oViewModel, "oSerialModel");

			this.getOwnerComponent().getModel().read("/SerialNos", {
				success: function (oData) {
					this.getView().getModel("oSerialModel").setProperty("/Serial", oData.results);
				}.bind(this)
			});

			this.getOwnerComponent().getModel().read("/CitySet", {
				success: function (oData) {
					this.getView().getModel("oSerialModel").setProperty("/City", oData.results);
				}.bind(this)
			});
		},
		
		onValueHelpSerialNoRequested: function (oEvent) {
			var oTableObject = oEvent.getSource().getBindingContext().getObject();
			var sPath = oEvent.getSource().getBindingContext().sPath.split("/")[2];
			// var a = oEvent.getSource().getId();
			// var sIndex = a[a.length - 1];
			this.iSerialIndex = parseInt(sPath);
			if (!this._oSerialSearchDialog) {
				this._oSerialSearchDialog = sap.ui.xmlfragment("idSerialSearchDialog",
					"copypastetable.sample_ui_table.view.fragments.SerialSearchDialog", this);
				this.getView().addDependent(this._oSerialSearchDialog);
			}
			this._oSerialSearchDialog.open();
		},
		
		onValueHelpCityRequested: function (oEvent) {
			var oTableObject = oEvent.getSource().getBindingContext().getObject();
			var sPath = oEvent.getSource().getBindingContext().sPath.split("/")[2];
			// var a = oEvent.getSource().getId();
			// var sIndex = a[a.length - 1];
			this.iCityIndex = parseInt(sPath);
			if (!this._oCitySearchDialog) {
				this._oCitySearchDialog = sap.ui.xmlfragment("idCitySearchDialog",
					"copypastetable.sample_ui_table.view.fragments.CitySearchDialog", this);
				this.getView().addDependent(this._oCitySearchDialog);
			}
			this._oCitySearchDialog.open();
		},
		
		onPressDialogCancel: function (oEvent) {
			oEvent.getSource().getParent().getParent().getParent().close();
		},
		
		onPressConfirmSelectSerial: function (oEvent) {
			var oTable = sap.ui.core.Fragment.byId("idSerialSearchDialog", "idSerialTable");
			var iSelectedIndex = oTable.getSelectedIndex();
			if (iSelectedIndex !== -1) {
				var oSelectedContext = oTable.getContextByIndex(iSelectedIndex);
				var oSelectedContext = oTable.getContextByIndex(iSelectedIndex);
				var aSerial = this.getView().getModel("oSerialModel").getProperty("/Serial");
				var aFilterItem = aSerial.filter(function (oFilterItem) {
					return oFilterItem.SerialNo === oSelectedContext.getProperty("SerialNo");
				});
				var a = this.getView().getModel().getProperty("/items");
				a[this.iSerialIndex].SerialNo = aFilterItem[0].SerialNo;
				this.getView().getModel().refresh();
				// this.getView().getModel().setProperty("/items", aFilterItem);

			}
			oEvent.getSource().getParent().getParent().getParent().close();
		},
		
		onPressConfirmSelectCity: function (oEvent) {
			var oTable = sap.ui.core.Fragment.byId("idCitySearchDialog", "idCityTable");
			var iSelectedIndex = oTable.getSelectedIndex();
			if (iSelectedIndex !== -1) {
				var oSelectedContext = oTable.getContextByIndex(iSelectedIndex);
				var oSelectedContext = oTable.getContextByIndex(iSelectedIndex);
				var aCity = this.getView().getModel("oSerialModel").getProperty("/City");
				var aFilterItem = aCity.filter(function (oFilterItem) {
					return oFilterItem.City === oSelectedContext.getProperty("City");
				});
				var a = this.getView().getModel().getProperty("/items");
				a[this.iCityIndex].City = aFilterItem[0].City;
				this.getView().getModel().refresh();

			}
			oEvent.getSource().getParent().getParent().getParent().close();
		},
		
		onCreateItems: function (oEvent) {
			var oTable = this.getView().byId("idTable").getModel().getData("items").items;
			var oLength = oTable.length;
			for (var i = 0; i < 5; i++) {
				var a = {
					Status: "",
					City: "",
					Flag: true
				};
				this.getView().byId("idTable").getModel().getData("items").items[oLength] = a;
				oLength++;
			}
			this.getView().byId("idTable").getModel().refresh();

		},
		
		handleMessagePopoverPress: function (oEvent) {
			if (!this.oErrorPopover) {
				this.oErrorPopover = sap.ui.xmlfragment("copypastetable.sample_ui_table.view.fragments.MessagePopover", this);
			}
			this.getView().addDependent(this.oErrorPopover);
			if (!this.oErrorPopover.isOpen()) {
				this.oErrorPopover.openBy(oEvent.getSource());
			} else {
				this.oErrorPopover.close();
			}
		},

		_showMessageCount: function () {
			var oData, oViewModel = this.getModel("data"),
				i;
			if (!this._aMessages) {
				this._aMessages = [];

			}
			oData = this.getMessageModel().getData();
			for (i = 0; i < oData.length; i++) {
				this._aMessages.push(oData[i]);
			}
			this.getView().getModel("message").setProperty("/", this._aMessages);
			oViewModel.setProperty("/Errors/NoOfErrors", oData.length);
			if (oData.length > 0) {
				oViewModel.setProperty("/Errors/visible", true);
			} else {
				oViewModel.setProperty("/Errors/visible", false);
			}
		},
		
		activeTitle: function (oEvent) {
			var that = this;
			var oItem = oEvent.getParameter("item"),
				oPage = that.oView.byId("page"),
				oMessage = oItem.getBindingContext("message").getObject();
			var sSerialNo = oItem.getBindingContext("message").getObject().description.split(" ")[2];
			var aTable = this.getView().getModel().getData("/items").items;
			for (var i = 0; i < aTable.length; i++) {
				if (aTable[i].SerialNo === sSerialNo) {
					var iIndex = i;
				}
			}
			for (var i = 0; i < aTable.length; i++) {
				if (i === iIndex) {
					// aTable[iIndex].Colour = "true";
					this.getView().byId("idTable").getRows()[iIndex].addStyleClass("bgcolor");

				} else {
					this.getView().byId("idTable").getRows()[i].removeStyleClass("bgcolor");

				}
			}
			
			// for (var i = 0; i < aTable.length; i++) {
			// 	if (i === iIndex) {
			// 		aTable[iIndex].Colour = "true";

			// 	} else {
			// 		aTable[i].Colour = "false";

			// 	}
			// }
			
			
			
			this.getView().getModel().setProperty("/items", aTable);
			this.oErrorPopover.close();
		},
		
		onCheck: function () {
			var iNumber = 0,
				a;
			var b = this.getView().byId("idTable").getModel().getData("items").items;
			for (var z = 0; z < b.length; z++) {
				if (b[z].City != "") {
					b[z].SerialNo = b[z].SerialNo.trim();
					b[z].City = b[z].City.trim();
					this.getView().byId("idTable").getRows()[z].removeStyleClass("bgcolor");
				} else {
					iNumber++;
				}
			}
			var i, bFlag;
			this.getOwnerComponent().getModel().read("/ReturnAuthorizationSet", {
				success: function (oData) {
					var a = oData.results;
					for (var i = 0; i < b.length; i++) {
						for (var j = 0; j < a.length; j++) {
							if (b[i].City === "") {
								break;
							} else if (a[j].SerialNo === b[i].SerialNo && a[j].City === b[i].City) {
								b[i].Status = "Success";
								bFlag = true;
								break;

							} else {
								b[i].Status = "Error";
								bFlag = false;
							}
							// }
						}
					}
					// var c = b;
					if (!bFlag) {
						this.initializeMessageManager(this.getView().getModel());
						var oMessageManager = this.getMessageManager();
						oMessageManager.removeAllMessages();
						var oTable = this.getView().byId("idTable").getModel().getData("items").items;
						for (i = 0; i < oTable.length; i++) {
							if (oTable[i] != undefined) {
								if (oTable[i].Status === "Error") {
									var sErrorText = "Error for" + " " + oTable[i].SerialNo;
									var a = this.getView().getModel();
									this.addMessages(oTable[i].Status, sErrorText, sErrorText, a);
								}
							}

						}
						this._showMessageCount();
						// this.getMessageManager.registerObject(this.getView().byId("idPanel"), true);
						this.getView().setModel(this.getMessageModel(), "message");
						this.getView().getModel().refresh();
					} else {
						var oTable = this.getView().byId("idTable").getModel().getData("items").items;
						for (i = 0; i < oTable.length; i++) {
							if (oTable[i].City != "") {
								var sSerialNo = oTable[i].SerialNo;
								var sCity = oTable[i].City;
								var sOdataKey = this.getOwnerComponent().getModel().createKey("ReturnAuthorizationSet", {
									SerialNo: sSerialNo,
									City: sCity
								});

								var sPath = "/" + sOdataKey;
								this.getOwnerComponent().getModel().read(sPath, {
									groupId: "ReadReturnAuthorization"
								});
							}
						}
						this.getOwnerComponent().getModel().submitChanges({
							groupId: "ReadReturnAuthorization",
							success: function (oData) {
								var i;
								var a = [];
								for (i = 0; i < oData.__batchResponses.length; i++) {
									if (oData.__batchResponses[i] != undefined) {
										a[i] = oData.__batchResponses[i].data;
									}
								}
								var oTableLength = a.length;
								for (var k = 0; k < iNumber; k++) {
									var y = {
										Status: "",
										City: "",
										Flag: true
									};
									a[oTableLength] = y;
									oTableLength++;
								}
								this.getView().getModel().setProperty("/items", a);
								this.initializeMessageManager(this.getView().getModel());
								var oMessageManager = this.getMessageManager();
								// i;
								oMessageManager.removeAllMessages();
								var oTable = this.getView().byId("idTable").getModel().getData("items").items;
							}.bind(this),
							error: function (oError) {}
						});
					}
					this.getView().getModel().setProperty("/items", b);
				}.bind(this)
			});
		},
		
		onSave: function () {
			var oTable = this.getView().byId("idTable").getModel().getData("items").items;
			var i;
			for (i = 0; i < oTable.length; i++) {
				if (oTable[i] != undefined) {
					oTable[i].Flag = false;
				}
			}
			this.getView().getModel().refresh();
		},

		onEditItem: function (oEvent) {
			
			var oTableObject = oEvent.getSource().getBindingContext().getObject();
			var sPath = oEvent.getSource().getBindingContext().sPath.split("/")[2];
			// var a = oEvent.getSource().getId();
			// var sIndex = a[a.length - 1];
			this.iTableIndex = parseInt(sPath);
			var b = this.getView().getModel().getProperty("/items");
			b[this.iTableIndex].Flag = true;
			this.getView().getModel().refresh();
		},

		onDeleteItem: function (oEvent) {
			var oTableObject = oEvent.getSource().getBindingContext().getObject();
			var sPath = oEvent.getSource().getBindingContext().sPath.split("/")[2];
			// var a = oEvent.getSource().getId();
			// var sIndex = a[a.length - 1];
			var iTableIndex = parseInt(sPath);
			var b = this.getView().getModel().getProperty("/items");
			b[iTableIndex].Status = "Delete";
			// for (var i = 0; i < b.length; i++) {
			// 	if (b[i] === b[iTableIndex]) {
			// 		// b.splice(i, 1);
			// 		b[i].Status = "Delete";
			// 	}
			// }
			this.getView().getModel().refresh();
		},
		
		onExport: function () {
			var aCols, aProducts, oSettings, oSheet;

			aCols = this.createColumnConfig();
			aProducts = this.getView().getModel().getProperty('/items');

			oSettings = {
				workbook: {
					columns: aCols
				},
				dataSource: aProducts
			};

			oSheet = new Spreadsheet(oSettings);
			oSheet.build()
				.then(function () {
					MessageToast.show('Spreadsheet export has finished');
				})
				.finally(function () {
					oSheet.destroy();
				});
		},

		createColumnConfig: function () {
			return [{
				label: 'Serial No',
				property: 'SerialNo',
				type: 'string',
				scale: 0
			}, {
				label: 'City',
				property: 'City',
				width: '25'
			}, {
				label: 'Depot',
				property: 'Depot',
				width: '25'
			}, {
				label: 'Type',
				property: 'Type',
				width: '18'
			}, {
				label: 'Lease',
				property: 'Lease',
				type: 'string'
			}, {
				label: 'Comments',
				property: 'Comments',
				type: 'string'
			}];
		},

		onPressNotification: function () {
			var tabledata = this.getView().getModel().getData("/items");
			this.JSONToPDFConvertor(tabledata);
			// this._pdfViewer = new PDFViewer();
			// this.getView().addDependent(this._pdfViewer);
			// var oSample1Model = new JSONModel({
			// 	Source: this.getView().getModel().getProperty('/items') + "/sample1.pdf",
			// 	Preview: this.getView().getModel().getProperty('/items') + "/sample1.jpg"
			// });
			// this._pdfViewer.setTitle("abc");
			// 		this._pdfViewer.open();
		},

		JSONToPDFConvertor: function (JSONData) {
			var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
			var columns = new Array;
			for (var index in arrData.items[0]) {
				//Now convert each value to string and comma-seprated
				if (index === "Status" || index === "Flag" || index === "Colour" || index === "__metadata") {
					continue;
				} else {
					columns.push(index);
				}
			}
			var rows = new Array;
			// console.log(arrData);
			for (var i = 0; i < arrData.items.length; i++) {
				rows[i] = new Array;

				for (var j = 0; j < arrData.items.length;) {

					for (var index in arrData.items[0]) {
						if (arrData.items[i] === undefined) {
							j++;
							break;
						} else if (index === "Status" || index === "Flag" || index === "Colour" || index === "_metadata") {
							continue;
						} else {

							rows[i][j] = arrData.items[i][index];
							j++;
						}
					}
				}
			}
			if (columns.length < 4) {
				var doc = new jsPDF('p', 'pt');
			} else {
				var doc = new jsPDF('l', 'pt');
			}
			doc.autoTable(columns, rows);

			doc.save('table.pdf');
		},
		
		onSort: function(oEvent){
			debugger;
			var aList = [];
          var oTable = this.getView().byId("idTable");
          var oItems = oTable.getBinding("rows");
          //var oTable = this.getView().getModel();
          //var oItems = oTable.getProperty("/items");
          var oBindingPath = oEvent.getParameter("column").getProperty("sortProperty");
          for (var i = 0; i < oItems.oList.length; i++) {

				if (oItems.oList[i].City !== "") {
					aList.push(oItems.oList[i]);
				}
			}
			oItems.oList = aList;
          //var oSorter = new Sorter(oBindingPath);
          //oItems.sort(oSorter);
          var aSorters = [];
          aSorters.push(new sap.ui.model.Sorter(oBindingPath));
          oItems.sort(aSorters);
          this.getView().getModel().setProperty("/items", oItems.oList);
          //this._oResponsivePopover.close();
		}

	});
});