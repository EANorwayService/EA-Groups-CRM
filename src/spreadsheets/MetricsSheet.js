// Compiled using ts2gas 1.6.2 (TypeScript 3.5.2)
var exports = exports || {};
var module = module || { exports: exports };
//import { MainSpreadsheet } from './MainSpreadsheet';
//import ss = GoogleAppsScript.Spreadsheet;
//import gas = GoogleAppsScript;
//import { ElementPositionSheet } from '../utils';
var properties = PropertiesService.getScriptProperties();
var MetricsSheet = /** @class */ (function () {
    function MetricsSheet() {
    }
    Object.defineProperty(MetricsSheet, "sheet", {
        get: function () {
            return MainSpreadsheet.getSheet('Metrics');
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds snapshot from candiate sheet to metrics sheet
     * @param candidateInfo
     */
    MetricsSheet.addCandidateInfo = function (candidateInfo) {
        var inputRow = this.sheet.getLastRow() + 1;
        var range = this.sheet.getRange(inputRow, this.COLUMN_START, 1, candidateInfo[0].length);
        range.setValues(candidateInfo);
    };
    /**
     * Not all candidates are in metrics!
     * Use metricsHistorical.getAllCandidates() if you want all candidates or metricsHistorical.getActiveCandidates() if you want all active candidates
     * @returns candidates from metrics sheet
     */
    MetricsSheet.getCandidates = function () {
        return this.sheet.getRange(this.START_CODENAMES.row, this.START_CODENAMES.column, this.sheet.getLastRow());
    };
    /**
     *
     * @param codeName gets snapshot of information from candidate, used when meeting is added
     */
    MetricsSheet.getCandidateSnapshot = function (codeName) {
        Logger.log(codeName);
        var lastRow = this.sheet.getLastRow();
        var lastColumn = this.sheet.getLastColumn();
        var range = this.sheet.getRange(this.START_CODENAMES.row, this.START_CODENAMES.column, lastRow, lastColumn);
        var values = range.getValues();
        var formulas = range.getFormulas();
        var codeNameHyperlink;
        var snapshot;
        for (var i = 0; i < values.length; i++) {
            Logger.log(values[i][0]);
            Logger.log(values[i][0]);
            if (values[i][0] == codeName) {
                values[i][0] = new String(formulas[i][0]);
                return [values[i]];
            }
        }
    };
    /**
     * Removes all inactive candidates, metrics should only contain active candidates, inactive candidates are stored in Metrics Historical Data sheet
     * @returns string with all new inactive candidates
     */
    MetricsSheet.removeInactiveCandidates = function () {
        var newInactiveCandidates = [];
        var data = this.sheet.getDataRange().getValues();
        var deletedRows = 0;
        Logger.log("Metrics remove inactive data:" + data + " length: " + data.length);
        if (!(String(data[this.ACTIVE_INACTIVE.row - 1][this.ACTIVE_INACTIVE.column - 1]) == "Active" || String(data[this.ACTIVE_INACTIVE.row - 1][this.ACTIVE_INACTIVE.column - 1]) == "Inactive")) {
            throw new Error("First cell is neither active nor inactive, is Active/Incative still in column " + this.ACTIVE_INACTIVE.column + " in Metrics checkForInactiveCandidates ");
        }
        for (var i = 0; i < data.length; i++) {
            Logger.log("Active/inactive" + data[i][this.ACTIVE_INACTIVE.column - 1]);
            Logger.log("Candidate" + data[i][this.START_CODENAMES.column - 1]);
            if (String(data[i][this.ACTIVE_INACTIVE.column - 1]) == 'Inactive') {
                newInactiveCandidates.push(data[i][this.START_CODENAMES.column - 1]);
                this.sheet.deleteRow(i + 1 - deletedRows);
                deletedRows++;
            }
        }
        return newInactiveCandidates;
    };
    MetricsSheet.START = 1;
    MetricsSheet.COLUMN_START = 2;
    MetricsSheet.START_CODENAMES = { row: 4, column: 2, a1Notation: 'B4' };
    MetricsSheet.ACTIVE_INACTIVE = { row: 4, column: 4, a1Notation: 'D4' };
    return MetricsSheet;
}());
exports.MetricsSheet = MetricsSheet;
