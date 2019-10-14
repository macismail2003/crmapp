sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function (BaseController, JSONModel, MessageToast) {
	"use strict";

	return BaseController.extend("com.seaco.zcrmapps.zcrmapps.controller.App", {

		onInit : function () {
			// this.getModel("appView").setProperty("/layout", "OneColumn");
			// debugger;
			var oViewModel = new JSONModel({
				Items : []
				
			});
			this.getView().setModel(oViewModel, "dealItemModel");
			this.IID = 0;
		},
		
		onCreateItems: function(oEvent){
				var oEventListData;
				if (!this._oItemDialog) {
				this._oItemDialog = sap.ui.xmlfragment(this.getView().getId(), "com.seaco.zcrmapps.zcrmapps.view.fragments.AddItems", this);
				this.getView().addDependent(this._oItemDialog);
				this._oItemDialog.setModel(new JSONModel({}), "ItemList");
			}
				this._oItemDialog.open();
			
		},
		
		onPressCancel: function(oEvent){
			oEvent.getSource().getParent().close();
		},
		
		onPressOKAddItem: function(){
			var oItemListData,
				sHierarchyName,
				oConstraint,
				sPath;
				oItemListData = this._oItemDialog.getModel("ItemList").getData();
				this.IID++;
				oConstraint = {
					ID: this.PID,
					Quantity: oItemListData.Quantity,
					PerDiem: oItemListData.PerDiem,
					DailyPop: oItemListData.DailyPop,
					NoOfDays: oItemListData.NoOfDays,
					Unit: oItemListData.Unit,
					EndDate: oItemListData.EndDate

				};
				var oItemColleion = this.getModel("dealItemModel").getData().Items;
					oItemColleion.push(oConstraint);

					this.byId("itemTable").getModel("dealItemModel").refresh();
					this._oItemDialog.close();
					MessageToast.show("Item Added Successfully");
		}

	});
});