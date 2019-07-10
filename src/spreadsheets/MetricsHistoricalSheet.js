// Compiled using ts2gas 1.6.2 (TypeScript 3.5.2)
var exports = exports || {};
var module = module || { exports: exports };
//import ss = GoogleAppsScript.Spreadsheet;
//import gas = GoogleAppsScript;
//import { MainSpreadsheet } from './MainSpreadsheet';
//import { Utils, ElementPositionSheet } from '../utils';
var properties = PropertiesService.getScriptProperties();
var MetricsHistoricalSheet = /** @class */ (function () {
    function MetricsHistoricalSheet() {
    }
    Object.defineProperty(MetricsHistoricalSheet, "sheet", {
        get: function () {
            return MainSpreadsheet.getSheet('Metrics Historical Data');
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds snapshot from candidate sheet to metrics historical
     * @param candidateInfo
     */
    MetricsHistoricalSheet.addCandidateInfo = function (candidateInfo) {
        var inputRow = this.sheet.getLastRow() + 1;
        var range = this.sheet.getRange(inputRow, this.COLUMN_START, 1, candidateInfo[0].length);
        range.setValues(candidateInfo);
    };
    /**
     * @returns all candidates(both active and inactive)
     */
    MetricsHistoricalSheet.getAllCandidates = function () {
        var codeNamesRange = this.sheet.getRange(this.ROW_START, this.START_CODENAMES.column, this.sheet.getLastRow());
        var lastRow = codeNamesRange.getHeight();
        var codeNames = [];
        for (var row = 1; row <= lastRow; row++) {
            // Cell coordinates are relative to range
            var cell = codeNamesRange.getCell(row, 1);
            if (!cell.isBlank() && Utils.isHyperlink(cell)) {
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
     * @returns only active candidates, not inactive candidates
     */
    MetricsHistoricalSheet.getActiveCandidates = function () {
        var dataRange = this.sheet.getDataRange();
        var lastRow = dataRange.getHeight();
        var codeNames = [];
        for (var row = 1; row <= lastRow; row++) {
            // Cell coordinates are relative to range
            var codeNameCell = dataRange.getCell(row, this.START_CODENAMES.column);
            var activeInactice = String(dataRange.getCell(row, this.START_ACTIVE_INACTIVE.column).getValue());
            Logger.log("Active inactive metricshist: " + activeInactice);
            if (!codeNameCell.isBlank() && Utils.isHyperlink(codeNameCell) && activeInactice == 'Active') {
                var codeName = codeNameCell.getValue();
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
    MetricsHistoricalSheet.ROW_START = 4;
    MetricsHistoricalSheet.COLUMN_START = 2;
    MetricsHistoricalSheet.START_CODENAMES = { row: 4, column: 2, a1Notation: 'B4' };
    MetricsHistoricalSheet.START_ACTIVE_INACTIVE = { row: 4, column: 4, a1Notation: 'D4' };
    return MetricsHistoricalSheet;
}());
exports.MetricsHistoricalSheet = MetricsHistoricalSheet;
