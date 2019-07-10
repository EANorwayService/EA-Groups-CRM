// Compiled using ts2gas 1.6.2 (TypeScript 3.5.2)
var exports = exports || {};
var module = module || { exports: exports };
//import { MainSpreadsheet } from './MainSpreadsheet';
//import ss = GoogleAppsScript.Spreadsheet;
//import gas = GoogleAppsScript;
//import { ElementPositionSheet } from '../utils';
var properties = PropertiesService.getScriptProperties();
var DashboardSheet = /** @class */ (function () {
    function DashboardSheet() {
    }
    Object.defineProperty(DashboardSheet, "sheet", {
        get: function () {
            return MainSpreadsheet.getSheet('Dashboard');
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Takes a snapshot of all values in dashboard
     * @returns a 2d list to make it easy to use googles method Range.setValues()
     */
    DashboardSheet.getSnapshot = function () {
        Logger.log("Kall i dahsboard:" + MainSpreadsheet);
        var snapshot = [[]];
        var counter = 0;
        var allData = this.sheet.getDataRange().getValues();
        snapshot[0][counter++] = allData[this.MEETINGS_TOTAL.row - 1][this.MEETINGS_TOTAL.column - 1];
        snapshot[0][counter++] = allData[this.MEETINGS_LAST_YEAR.row - 1][this.MEETINGS_LAST_YEAR.column - 1];
        snapshot[0][counter++] = allData[this.MEETINGS_LAST_THIRTY.row - 1][this.MEETINGS_LAST_THIRTY.column - 1];
        snapshot[0][counter++] = allData[this.MEETINGS_DAYS_SINCE_PREVIOUS.row - 1][this.MEETINGS_DAYS_SINCE_PREVIOUS.column - 1];
        snapshot[0][counter++] = allData[this.MEETINGS_AVARAGE_DAYS_SINCE_PREVIOUS.row - 1][this.MEETINGS_AVARAGE_DAYS_SINCE_PREVIOUS.column - 1];
        snapshot[0][counter++] = allData[this.MALI_THREE_FACTOR_AVARAGE.row - 1][this.MALI_THREE_FACTOR_AVARAGE.column - 1];
        snapshot[0][counter++] = allData[this.MALI_NUMBER_OF_GREEN.row - 1][this.MALI_NUMBER_OF_GREEN.column - 1];
        snapshot[0][counter++] = allData[this.MALI_NUMBER_OF_YELLOW.row - 1][this.MALI_NUMBER_OF_YELLOW.column - 1];
        snapshot[0][counter++] = allData[this.MALI_NUMBER_OF_RED.row - 1][this.MALI_NUMBER_OF_RED.column - 1];
        snapshot[0][counter++] = allData[this.MALI_AVARAGE.row - 1][this.MALI_AVARAGE.column - 1];
        snapshot[0][counter++] = allData[this.CANDIDATES_TOTAL.row - 1][this.CANDIDATES_TOTAL.column - 1];
        snapshot[0][counter++] = allData[this.CANDIDATES_ACTIVE.row - 1][this.CANDIDATES_ACTIVE.column - 1];
        snapshot[0][counter++] = allData[this.STORY_CASE_STUDY_USED.row - 1][this.STORY_CASE_STUDY_USED.column - 1];
        snapshot[0][counter++] = allData[this.STORY_SUCCES_USED.row - 1][this.STORY_SUCCES_USED.column - 1];
        snapshot[0][counter++] = allData[this.STORY_CASE_STUDY_POTENTIAL.row - 1][this.STORY_CASE_STUDY_POTENTIAL.column - 1];
        snapshot[0][counter++] = allData[this.STORY_CASE_STUDY_POTENTIAL.row - 1][this.STORY_SUCCES_POTENTIAL.column - 1];
        return snapshot;
    };
    DashboardSheet.MEETINGS_TOTAL = { row: 4, column: 3, a1Notation: 'C4' };
    DashboardSheet.MEETINGS_LAST_YEAR = { row: 5, column: 3, a1Notation: 'C5' };
    DashboardSheet.MEETINGS_THIS_YEAR = { row: 6, column: 3, a1Notation: 'C6' };
    DashboardSheet.MEETINGS_LAST_THIRTY = { row: 7, column: 3, a1Notation: 'C7' };
    DashboardSheet.MEETINGS_DAYS_SINCE_PREVIOUS = { row: 8, column: 3, a1Notation: 'C8' };
    DashboardSheet.MEETINGS_AVARAGE_DAYS_SINCE_PREVIOUS = { row: 9, column: 3, a1Notation: 'C9' };
    DashboardSheet.MALI_THREE_FACTOR_AVARAGE = { row: 4, column: 6, a1Notation: 'F4' };
    DashboardSheet.MALI_NUMBER_OF_GREEN = { row: 5, column: 6, a1Notation: 'F5' };
    DashboardSheet.MALI_NUMBER_OF_YELLOW = { row: 6, column: 6, a1Notation: 'F6' };
    DashboardSheet.MALI_NUMBER_OF_RED = { row: 7, column: 6, a1Notation: 'F7' };
    DashboardSheet.MALI_AVARAGE = { row: 8, column: 6, a1Notation: 'F8' };
    DashboardSheet.CANDIDATES_TOTAL = { row: 11, column: 6, a1Notation: 'F11' };
    DashboardSheet.CANDIDATES_ACTIVE = { row: 12, column: 6, a1Notation: 'F12' };
    DashboardSheet.STORY_CASE_STUDY_USED = { row: 15, column: 6, a1Notation: 'F15' };
    DashboardSheet.STORY_SUCCES_USED = { row: 16, column: 6, a1Notation: 'F16' };
    DashboardSheet.STORY_CASE_STUDY_POTENTIAL = { row: 17, column: 6, a1Notation: 'F17' };
    DashboardSheet.STORY_SUCCES_POTENTIAL = { row: 18, column: 6, a1Notation: 'F18' };
    return DashboardSheet;
}());
exports.DashboardSheet = DashboardSheet;
