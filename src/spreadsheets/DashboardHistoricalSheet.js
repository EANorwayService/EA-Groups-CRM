// Compiled using ts2gas 1.6.2 (TypeScript 3.5.2)
var exports = exports || {};
var module = module || { exports: exports };
//import { MainSpreadsheet } from './MainSpreadsheet';
//import ss = GoogleAppsScript.Spreadsheet;
//import gas = GoogleAppsScript;
var properties = PropertiesService.getScriptProperties();
var DashboardHistoricalSheet = /** @class */ (function () {
    function DashboardHistoricalSheet() {
    }
    Object.defineProperty(DashboardHistoricalSheet, "sheet", {
        get: function () {
            return MainSpreadsheet.getSheet('Dashboard Historical Data');
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Add snapshot from dahsboard to metrics historical data
     * @param snapshot a list of all values in the dashboard
     */
    DashboardHistoricalSheet.addSnapshot = function (snapshot) {
        Logger.log("Adding snapshot to Dashboard Historical Data Sheet");
        var inputRow = this.sheet.getLastRow() + 1;
        this.sheet.getRange(inputRow, this.START).setValue(new Date());
        var range = this.sheet.getRange(inputRow, this.START + 1, 1, snapshot[0].length);
        range.setValues(snapshot);
    };
    ;
    DashboardHistoricalSheet.START = 2;
    return DashboardHistoricalSheet;
}());
exports.DashboardHistoricalSheet = DashboardHistoricalSheet;
