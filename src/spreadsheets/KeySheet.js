// Compiled using ts2gas 1.6.2 (TypeScript 3.5.2)
var exports = exports || {};
var module = module || { exports: exports };
//import{ Utils, ElementPositionSheet } from '../utils';
//import ss = GoogleAppsScript.Spreadsheet;
//import gas = GoogleAppsScript;
//import { MainSpreadsheet } from './MainSpreadsheet'
var properties = PropertiesService.getScriptProperties();
var KeySheet = /** @class */ (function () {
    function KeySheet() {
    }
    /**
     * @param codeName
     * @returns email of given candidate
     */
    KeySheet.getEmail = function (codeName) {
        var email = undefined;
        var allDataKey = this.sheet.getDataRange().getValues();
        for (var i = 0; i < allDataKey.length; i++) {
            if (String(allDataKey[i][this.CODENAMES.column - 1]) == codeName) {
                email = allDataKey[i][this.EMAIL.column - 1];
                Logger.log("Found codeName" + codeName + "in keySheet." + "email: " + email);
            }
            else {
                Logger.log(codeName + "not found in key sheet");
            }
        }
        return String(email);
    };
    /**
     * @returns {string[][]} all codeNames wich are not hyperlinks, this should be all the new candidates wich havn't been added to the system yet.
     */
    KeySheet.getNewCandidates = function () {
        var codeNamesRange = this.sheet.getRange(this.CODENAMES.row, this.CODENAMES.column, this.sheet.getLastRow());
        var lastRow = codeNamesRange.getHeight();
        var updatedCandidates = [];
        var codeNames = [];
        for (var row = 1; row <= lastRow; row++) {
            // Cell coordinates are relative to range
            var cell = codeNamesRange.getCell(row, 1);
            if (!cell.isBlank() && !Utils.isHyperlink(cell)) {
                var codeName = cell.getValue();
                if (Utils.isString(codeName)) {
                    Logger.log('Found code name: %s', codeName);
                    codeNames.push(String(codeName));
                }
                else {
                    Logger.log('Cell which is neither blank nor hyperlink found, but value: %s is not string', codeName);
                    //TODO Throw error
                }
            }
        }
        return codeNames;
    };
    /**
     * Adds hyperlinks to all codeNames wich have been added as candidates to the system
     * @param updatedCandidates
     */
    KeySheet.setHyperlinks = function (updatedCandidates) {
        var codeNamesRange = this.sheet.getRange(this.CODENAMES.row, this.CODENAMES.column, this.sheet.getLastRow());
        var lastRow = codeNamesRange.getHeight();
        var cell;
        var codeName;
        var url;
        for (var i = 0; i < lastRow; i++) {
            Logger.log("Last row: " + lastRow + "i: " + i);
            cell = codeNamesRange.getCell(i + 1, 1);
            codeName = cell.getValue();
            Logger.log("Codename keysheet: " + codeName);
            if (!cell.isBlank() && !Utils.isHyperlink(cell) && (updatedCandidates.indexOf(codeName) > -1)) {
                url = MainSpreadsheet.getCandidateSheet(codeName).getUrl();
                cell.setValue("=HYPERLINK(\"" + url + "\", \"" + codeName + "\")");
            }
        }
    };
    KeySheet.sheet = SpreadsheetApp.openById(properties.getProperty('KEY_SHEET_ID')).getSheetByName('Key');
    KeySheet.CODENAMES = { row: 3, column: 2, a1Notation: 'B11' };
    KeySheet.EMAIL = { row: 2, column: 11, a1Notation: 'B11' };
    return KeySheet;
}());
exports.KeySheet = KeySheet;
