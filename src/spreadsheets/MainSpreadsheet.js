// Compiled using ts2gas 1.6.2 (TypeScript 3.5.2)
var exports = exports || {};
var module = module || { exports: exports };
//import ss = GoogleAppsScript.Spreadsheet;
//import gas = GoogleAppsScript;
//import { CandidateSheet } from './CandidateSheet';
var properties = PropertiesService.getScriptProperties();
var MainSpreadsheet = /** @class */ (function () {
    function MainSpreadsheet() {
    }
    /**
     *
     * @param sheet Delets given sheet
     */
    MainSpreadsheet.deleteSheet = function (sheet) {
        this.spreadsheet.deleteSheet(sheet);
    };
    /**
     * @param codeName
     * @returns CandidateSheet instead of gas.Spreadsheet.Sheet because it is only to be used with methods found in CandidateSheet
     */
    MainSpreadsheet.getCandidateSheet = function (codeName) {
        var sheet;
        if ((sheet = MainSpreadsheet.spreadsheet.getSheetByName(codeName)) == null) {
            return null;
        }
        return new CandidateSheet(sheet);
    };
    /**
     *
     * @param name
     * @returns null if no sheet is found
     */
    MainSpreadsheet.getSheet = function (name) {
        return MainSpreadsheet.spreadsheet.getSheetByName(name);
    };
    /**
     * @returns url of main Spreadsheet
     */
    MainSpreadsheet.getUrl = function () {
        return this.spreadsheet.getUrl();
    };
    MainSpreadsheet.spreadsheet = SpreadsheetApp.openById(properties.getProperty('CRM_MAIN_SHEET_ID'));
    MainSpreadsheet.allSheets = MainSpreadsheet.spreadsheet.getSheets();
    return MainSpreadsheet;
}());
exports.MainSpreadsheet = MainSpreadsheet;
