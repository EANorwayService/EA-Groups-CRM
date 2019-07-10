// Compiled using ts2gas 1.6.2 (TypeScript 3.5.2)
var exports = exports || {};
var module = module || { exports: exports };
//import ss = GoogleAppsScript.Spreadsheet;
//import gas = GoogleAppsScript;
//import { MainSpreadsheet } from "./spreadsheets/MainSpreadsheet";
//import { KeySheet } from "./spreadsheets/KeySheet";
//import { MetricsHistoricalSheet } from "./spreadsheets/MetricsHistoricalSheet";
var properties = PropertiesService.getScriptProperties();
var CANDIDATE_BOOK_ID = properties.getProperty('CANDIDATE_BOOK_ID');
var CRM_MAIN_SHEET_ID = properties.getProperty('CRM_MAIN_SHEET_ID');
var KEY_SHEET_ID = properties.getProperty('KEY_SHEET_ID');
var CANDIDATES_FOLDER_ID = properties.getProperty('CANDIDATES_FOLDER_ID');
var CANDIDATE_SHEET_TEMPLATE_ID = properties.getProperty('CANDIDATE_SHEET_TEMPLATE_ID');
var MEETING_NOTES_TEMPLATE_ID = properties.getProperty('MEETING_NOTES_TEMPLATE_ID');
// Menu
/**
 * Creates top-bar menu items for CRM related functionality on the main and key spreadsheets.
 */
function createCRMMenu() {
    var ui = SpreadsheetApp.getUi();
    ui
        .createMenu('CRM')
        .addSubMenu(ui.createMenu('New meeting')
        .addItem('Plan new meeting', 'showNewMeetingDialog')
        .addItem('Add old meeting', 'showOldMeetingDialog'))
        .addSubMenu(ui.createMenu('Update')
        .addItem('Add candidates', 'handleAddCandidates')
        .addItem('Update Everything', 'updateEverything'))
        .addToUi();
}
function createKeyMenu() {
    SpreadsheetApp.getUi()
        .createMenu('CRM')
        .addItem('Add candidates', 'handleAddCandidates')
        .addToUi();
}
// Shows dialog box for creating new meeting.
function showNewMeetingDialog() {
    var CANDIDATESHEETSSTART = 6;
    var ui = SpreadsheetApp.getUi();
    var codeName = SpreadsheetApp.getActiveSheet().getName();
    // TODO change how check is done: "Can I create meeting fromt his sheet"
    var existingCandidates = MetricsHistoricalSheet.getActiveCandidates();
    if (existingCandidates.indexOf(codeName) < 0) {
        var response = ui.alert('Can not plan a new meeting from this sheet', 'Please go to the candidate sheet of the candidate you wish to plan a new meeting for and make sure the candidate is not inactive.', ui.ButtonSet.OK);
        // TODO: Is this ok error handeling?
        if (response) {
            return;
        }
    }
    var html = HtmlService.createHtmlOutputFromFile('html/datePickerNewMeeting')
        .setWidth(200)
        .setHeight(150);
    SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
        .showModalDialog(html, 'Plan a new meeting and create meeting notes');
    Logger.log("Content: " + html.getContent());
}
function showOldMeetingDialog() {
    var CANDIDATESHEETSSTART = 6;
    var ui = SpreadsheetApp.getUi();
    var codeName = SpreadsheetApp.getActiveSheet().getName();
    var existingCandidates = MetricsHistoricalSheet.getActiveCandidates();
    if (existingCandidates.indexOf(codeName) < 0) {
        var response = ui.alert('Can not plan a new meeting from this sheet', 'Please go to the candidate sheet of the candidate you wish to plan a new meeting for and make sure the candidate is not inactive.', ui.ButtonSet.OK);
        // TODO: Is this ok error handeling?
        if (response) {
            return;
        }
    }
    var html = HtmlService.createHtmlOutputFromFile('html/datePickerOldMeeting')
        .setWidth(200)
        .setHeight(200);
    SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
        .showModalDialog(html, 'Add meeting with existing meeting notes');
    Logger.log("Content: " + html.getContent());
}
// Utils
var Utils = /** @class */ (function () {
    function Utils() {
    }
    // Utils 
    /**
     * Checks whether a cell (1x1-Range) contains a Sheets-hyperlink (=HYPERLINK(...)).
     *
     * @param {GoogleAppsScript.Spreadsheet.Range} cell Range containing a single cell
     * @returns {boolean} True if the supplied cell contains a hyperlink, and false otherwise.
     */
    Utils.isHyperlink = function (cell) {
        // Check that a single cell is supplied
        if (cell.getHeight() != 1 || cell.getWidth() != 1) {
            throw new TypeError('isHyperlink passed multiple cell range');
        }
        var value = cell.getFormula();
        Logger.log("Hyperlink value: " + value);
        if (this.isString(value) && (value.indexOf('HYPERLINK') >= 0)) {
            Logger.log('isHyperlink returned TRUE for: %s', value);
            return true;
        }
        Logger.log('isHyperlink returned FALSE for: %s', value);
        return false;
    };
    Utils.isDocument = function (url) {
        if (this.getIdFromUrl(url) != null && (url.indexOf('document') >= 0 || url.indexOf('docs') >= 0)) {
            return true;
        }
        return false;
    };
    /**
    * Type guard for strings.
    * See https://www.typescriptlang.org/docs/handbook/advanced-types.html for docs.
    *
    * @param {any} value Value to be ensured is a string
    * @returns {boolean} True if passed value is a string, and false otherwise
    */
    Utils.isString = function (value) {
        return typeof value === 'string';
    };
    /**
    * Checks if there is space in sheet based in background color.
    * If background is not white then a row needs to be added.
    * If no space adds rows
    * @param {gas.Spreadsheet.Range} range to check for color
    * @return {number} number of rows needed to make space
    */
    Utils.checkSpaceColor = function (range) {
        var rowsNeeded = 0;
        var colors = range.getBackgrounds();
        for (var i = 0; i < colors.length; i++) {
            Logger.log('Color: ' + colors[i][0]);
            if (colors[i][0] != '#ffffff') {
                Logger.log(range.getHeight() + " " + i);
                rowsNeeded = range.getHeight() - i;
                Logger.log("Rows needed: " + rowsNeeded);
                return rowsNeeded;
            }
        }
        Logger.log("Rows needed: " + rowsNeeded);
        return rowsNeeded;
    };
    /**
    * values from a range are 2d arrays, this function checks if item appears in 2d array
    * @param {object} value to look for in values
    * @param {objct[][]} values to look for value in
    * @return {boolean} if(value is in vlaues)
    */
    Utils.valueInValues = function (value, values) {
        Logger.log("Value: " + value + " values: " + values);
        for (var i = 0; i < values.length; i++) {
            for (var y = 0; y < values[i].length; y++) {
                if (values[i][y] == value) {
                    return true;
                }
            }
        }
        return false;
    };
    /**
     * Function wich returns id for a google drive file from url
     *
     * @param {string} url to return id from
     * @return {string[]} returns id
     */
    Utils.getIdFromUrl = function (url) {
        var id = url.match(/[-\w]{25,}$/);
        if (id == null) {
            return null;
        }
        Logger.log('url: ' + url + 'id' + id);
        return id.join("");
    };
    return Utils;
}());
exports.Utils = Utils;
