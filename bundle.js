// Compiled using ts2gas 3.4.4 (TypeScript 3.5.3)
var exports = exports || {};
var module = module || { exports: exports };
//import { MeetingNotes } from './documents/documents';
//import { MainSpreadsheet } from './spreadsheets/MainSpreadsheet'
//import { CandidateSheet } from './spreadsheets/CandidateSheet'
//import { KeySheet } from './spreadsheets/KeySheet'
//import { MeetingsSheet } from './spreadsheets/MeetingsSheet'
//import { MetricsHistoricalSheet } from './spreadsheets/MetricsHistoricalSheet'
//import { MetricsSheet } from './spreadsheets/MetricsSheet';
//import { CandidateFolder } from './folders/folders'
//import { MeetingInfo, Utils, FormAnswers } from './utils';
//import { DashboardSheet } from './spreadsheets/DashboardSheet';
//import { DashboardHistoricalSheet } from './spreadsheets/DashboardHistoricalSheet';
//import gas = GoogleAppsScript;
//import { EvaluationFormSheet } from './spreadsheets/EvaluationFormSheet';
//import { OnboardingFormSheet } from './spreadsheets/OnboardingFormSheet';
/**
 * Adds new candidates from key sheet
 * Creates new candidate sheet, new candidate folder and adds candiate to metrics.
 * Snapshot has to be 2d array to use gas.Spreadsheet.Range.setValues().
 */
function handleAddCandidates(showUi) {
    if (showUi === void 0) { showUi = true; }
    var ui = SpreadsheetApp.getUi();
    var newCandidates = KeySheet.getNewCandidates();
    var newCandidateSheet;
    var snapshotMetrics;
    var snapshotMetricsHistorical;
    var messageNewCandidates;
    try {
        for (var i = 0; i < newCandidates.length; i++) {
            // Add new candidate folder
            CandidateFolder.newCandidateFolder(newCandidates[i]);
            // Add new candidate sheet
            newCandidateSheet = CandidateSheet.newCandidate(newCandidates[i]);
            // Get formulas from candidate sheet
            snapshotMetrics = newCandidateSheet.getFormulasMetrics();
            // Add formulas to metrics sheet
            MetricsSheet.addCandidateInfo(snapshotMetrics);
            // Get snapshot of candidate sheet
            snapshotMetricsHistorical = newCandidateSheet.getSnapshot();
            // Add snapshot everything to metrics historical sheet
            MetricsHistoricalSheet.addCandidateInfo(snapshotMetricsHistorical);
        }
        if (newCandidates.length > 0) {
            KeySheet.setHyperlinks(newCandidates);
        }
        // Extra: Remove backslashes from function call if you want this function. Copies answers from a sheet linked to a form to the candidate sheet.
        // handleFillOnboardingForm();
        if (newCandidates.length === 0) {
            messageNewCandidates = 'No new candidates were added. Be sure to add code names. Only people with code names will be added as candidates\n';
        }
        else if (newCandidates.length === 1) {
            messageNewCandidates = "Candidate with code name " + newCandidates.join(', ') + " was added.\n";
        }
        else {
            messageNewCandidates = "Candidates with code names " + newCandidates.join(', ') + " were added.\n";
        }
        if (showUi) {
            SpreadsheetApp.getActiveSpreadsheet().toast(messageNewCandidates, 'Status', -1);
        }
        else {
            console.log(messageNewCandidates);
        }
    }
    catch (e) {
        ui.alert(e.message + "\n\nHere is more information if you think something is wrong with code: " + e.stack);
        console.log(e.message + "\n\nHere is more information if you think something is wrong with code: " + e.stack);
    }
    finally {
        var copyFailure = void 0;
        if ((copyFailure = MainSpreadsheet.getSheet("Copy of Candidate sheet template")) != null) {
            MainSpreadsheet.deleteSheet(copyFailure);
        }
    }
}
function handleInactiveCandidates() {
    try {
        var candidateSheet = void 0;
        var inactivecandidates = MetricsSheet.getInactiveCandidates();
        for (var i = 0; i < inactivecandidates.length; i++) {
            candidateSheet = MainSpreadsheet.getCandidateSheet(inactivecandidates[i]);
            if (!candidateSheet.isSheetHidden()) {
                candidateSheet.hideSheet();
            }
        }
    }
    catch (e) {
        console.log(e.message + "\n\nHere is more information if you think something is wrong with code: " + e.stack);
    }
}
/**
 * EA Norway has a form they use for evaluation after each meeting. This form is linked to a sheet in the Key spreadsheet.
 * This function gets the answers for each candidate and fills the answers into the candidate sheet
 */
function handleFillEvaluationAnswers() {
    try {
        var allActiveCandidates = MetricsSheet.getActiveCandidates();
        for (var i = 0; i < allActiveCandidates.length; i++) {
            var answers = EvaluationFormSheet.getAnswers(allActiveCandidates[i]);
            MainSpreadsheet.getCandidateSheet(allActiveCandidates[i]).fillEvaluationAnswers(answers);
        }
    }
    catch (e) {
        console.error(e.message + "\n\nHere is more information if you think something is wrong with code: " + e.stack);
    }
}
/**
 * Fills 5 next meetings to dashboard. To change number of meetings change NEXT_MEETING_END in DashboardSheet class(DashboardSheet.ts),
 * change layout in dashboard sheet and change variable numberOfMeetings in this method
 * nextMeetings has to be 2d array to use gas.Spreadsheet.Range.setValues().
 */
function handleFillNextMeetings() {
    try {
        var numberOfMeeetings = 5;
        var nextMeetings = MeetingsSheet.getNextMeetings(numberOfMeeetings);
        DashboardSheet.fillNextMeetings(nextMeetings);
    }
    catch (e) {
        console.error(e.message + "\n\nHere is more information if you think something is wrong with code: " + e.stack);
    }
}
/**
 * EA Norway has a form they use for each candidate before the first meeting with that candidate to get som basic information. This form is linked to a sheet in the Key spreadsheet.
 * This function gets the answers for each candidate and fills the answers into the candidate sheet
 */
function handleFillOnboardingForm() {
    try {
        var allActiveCandidates = MetricsSheet.getActiveCandidates();
        for (var i = 0; i < allActiveCandidates.length; i++) {
            var answers = OnboardingFormSheet.getAnswers(allActiveCandidates[i]);
            MainSpreadsheet.getCandidateSheet(allActiveCandidates[i]).fillOnboardingAnswers(answers);
        }
    }
    catch (e) {
        console.log(e.message + "\n\nHere is more information if you think something is wrong with code: " + e.stack);
    }
}
/**
 * When a new or old meeting as added through the crm-menu.
 * @param dateIn Date of meeting
 * @param urlNotes Notes if meeting already has meeting notes, null if no notes exist
 * If meeting doesn't already have existing meeting note new notes are created.
 * snapshotMetrics has to be 2d array to use gas.Spreadsheet.Range.setValues().
 */
function handleMeeting(dateIn, urlNotes) {
    var ui;
    try {
        ui = SpreadsheetApp.getUi();
        var codeNameSheet = SpreadsheetApp.getActiveSheet();
        var codeName = codeNameSheet.getName();
        var date = new Date(dateIn);
        SpreadsheetApp.getActiveSpreadsheet().toast('Creating new meeting', 'Status', null);
        // Add snapshot to meetings and create new meeting notes
        var candidateFolder = CandidateFolder.getCandidateFolder(codeName);
        var snapshotMetrics = MetricsSheet.getCandidateSnapshot(codeName);
        var meetingsFolder = candidateFolder.getMeetingFolder();
        var candidateSheet = MainSpreadsheet.getCandidateSheet(codeName);
        var meetingInfo = void 0;
        if (snapshotMetrics == undefined) {
            throw new Error("Candidate with code name " + codeName + " not found in Metrics.");
        }
        // Create new meeting notes
        if (urlNotes == null) {
            console.log("New meeting notes are beeing made");
            urlNotes = MeetingNotes.newMeetingNotes(codeName, date, meetingsFolder).getUrl();
        }
        MeetingsSheet.addMeeting(snapshotMetrics, date, urlNotes);
        // Update previous and upcoming meeting in candidateSheet from meetingsSheet
        meetingInfo = MeetingsSheet.getMeetingInfo(codeName);
        candidateSheet.addMeetingInfo(meetingInfo);
        console.log("New meeting for " + codeName + " Date in and date: " + dateIn + " " + date.toISOString());
        SpreadsheetApp.getActiveSpreadsheet().toast('New meeting created for ' + codeName + ' ' + dateIn, 'Status', -1);
    }
    catch (e) {
        ui.alert(e.message + "\n\nHere is more information if you think something is wrong with code: " + e.stack);
        console.log(e.message + "\n\nHere is more information if you think something is wrong with code: " + e.stack);
    }
}
/**
 * Takes a snapshot of the Dashboard and adds it to Dashboard Historical Data sheet.
 * Array snapshot has to be 2d array to use gas.Spreadsheet.Range.setValues().
 */
function snapshotDashboard() {
    var snapshot = DashboardSheet.getSnapshot();
    DashboardHistoricalSheet.addSnapshot(snapshot);
}
/**
 * Takes a snapshot of each candidate and adds it to Metrics Historical Data sheet.
 * Array snapshot has to be 2d array to use gas.Spreadsheet.Range.setValues().
 */
function snapshotCandidates() {
    var allActiveCandidates = MetricsSheet.getActiveCandidates();
    var snapshot;
    var candidateSheet;
    for (var i = 0; i < allActiveCandidates.length; i++) {
        candidateSheet = MainSpreadsheet.getCandidateSheet(allActiveCandidates[i]);
        snapshot = candidateSheet.getSnapshot();
        MetricsHistoricalSheet.addCandidateInfo(snapshot);
    }
}
/**
 * This function is run every night to make sure system is updated
 * Adds new candidates, checks for new active or inactive candidates,
 * updates meeting notes of all candidate sheets and takes snapshot of all candidate sheets and of the dashboard
 */
function updateEverything() {
    var candidateSheet;
    var meetingInfo;
    var allActiveCandidates;
    try {
        console.log("Start updateEverything()");
        handleFillNextMeetings();
        handleInactiveCandidates();
        handleAddCandidates(false);
        // Extra: Remove backslashes if you want this function
        //handleFillEvaluationAnswers();
        allActiveCandidates = MetricsSheet.getActiveCandidates();
        for (var i = 0; i < allActiveCandidates.length; i++) {
            meetingInfo = MeetingsSheet.getMeetingInfo(allActiveCandidates[i]);
            candidateSheet = MainSpreadsheet.getCandidateSheet(allActiveCandidates[i]);
            candidateSheet.addMeetingInfo(meetingInfo);
        }
    }
    catch (e) {
        console.log(e.message + "\n\nHere is more information if you think something is wrong with code: " + e.stack);
    }
}
function weeklySnapshot() {
    try {
        snapshotDashboard();
        snapshotCandidates();
    }
    catch (e) {
        console.log(e.message + "\n\nHere is more information if you think something is wrong with code: " + e.stack);
    }
}

// Compiled using ts2gas 3.4.4 (TypeScript 3.5.3)
var exports = exports || {};
var module = module || { exports: exports };
//import ss = GoogleAppsScript.Spreadsheet;
//import gas = GoogleAppsScript;
//import { MainSpreadsheet } from "./spreadsheets/MainSpreadsheet";
//import { KeySheet } from "./spreadsheets/KeySheet";
//import { MetricsSheet } from "./spreadsheets/MetricsSheet";
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
        .addItem('Update everything', 'updateEverything'))
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
    var existingCandidates = MetricsSheet.getActiveCandidates();
    if (existingCandidates.indexOf(codeName) < 0) {
        var response = ui.alert('Can not plan a new meeting from this sheet', 'Please go to the candidate sheet of the candidate you wish to plan a new meeting for and make sure the candidate is not inactive.', ui.ButtonSet.OK);
        if (response) {
            return;
        }
    }
    var html = HtmlService.createHtmlOutputFromFile('datePickerNewMeeting')
        .setWidth(200)
        .setHeight(150);
    SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
        .showModalDialog(html, 'Plan a new meeting and create meeting notes');
}
function showOldMeetingDialog() {
    var CANDIDATESHEETSSTART = 6;
    var ui = SpreadsheetApp.getUi();
    var codeName = SpreadsheetApp.getActiveSheet().getName();
    var existingCandidates = MetricsSheet.getActiveCandidates();
    if (existingCandidates.indexOf(codeName) < 0) {
        var response = ui.alert('Can not plan a new meeting from this sheet', 'Please go to the candidate sheet of the candidate you wish to plan a new meeting for and make sure the candidate is not inactive.', ui.ButtonSet.OK);
        if (response) {
            return;
        }
    }
    var html = HtmlService.createHtmlOutputFromFile('datePickerOldMeeting')
        .setWidth(200)
        .setHeight(200);
    SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
        .showModalDialog(html, 'Add meeting with existing meeting notes');
}
// Utils
var Utils = /** @class */ (function () {
    function Utils() {
    }
    // Utils 
    /**
  * Checks if there is space in sheet based in background color.
  * If background is not white then a row needs to be added.
  * If no space adds rows
  * @param {gas.Spreadsheet.Range} range to check for color
  * @return {number} number of rows needed to make space
  */
    Utils.checkSpaceColor = function (range, color) {
        var rowsNeeded = 0;
        var colors = range.getBackgrounds();
        for (var i = 0; i < colors.length; i++) {
            if (colors[i][0] != color) {
                rowsNeeded = range.getHeight() - i;
                return rowsNeeded;
            }
        }
        return rowsNeeded;
    };
    /**
     * Function for sorting 2d array after first column
     * @param value
     * @param values
     */
    Utils.compareDates = function (a, b) {
        var date1 = new Date(String(a[0]));
        var date2 = new Date(String(b[0]));
        if (date1 === date2) {
            return 0;
        }
        else if (date1 < date2) {
            return -1;
        }
        else if (date1 > date2) {
            return 1;
        }
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
        return id.join("");
    };
    Utils.isDocument = function (url) {
        if (this.getIdFromUrl(url) != null && (url.indexOf('document') >= 0 || url.indexOf('docs') >= 0)) {
            return true;
        }
        return false;
    };
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
        if (this.isString(value) && (value.indexOf('HYPERLINK') >= 0)) {
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
   * values from a range are 2d arrays, this function checks if item appears in 2d array
   * @param {object} value to look for in values
   * @param {objct[][]} values to look for value in. Used on 2d array returned from gas.Spreadhsheet.Range.getValues().
   * @return {boolean} if(value is in vlaues)
   */
    Utils.valueInValues = function (value, values) {
        for (var i = 0; i < values.length; i++) {
            for (var y = 0; y < values[i].length; y++) {
                if (values[i][y] == value) {
                    return true;
                }
            }
        }
        return false;
    };
    return Utils;
}());
exports.Utils = Utils;

// Compiled using ts2gas 3.4.4 (TypeScript 3.5.3)
var exports = exports || {};
var module = module || { exports: exports };
/**
 * This function only copies the CRM main Sheet and the keys sheet, the rest of the content in the main folder needs to by moved manualy.
 * If CRM main Spreadhseet and Key Spreadsheet are copied manually properites for the script needs to also be changed manually.
 */
//import ss = GoogleAppsScript.Spreadsheet;
//import gas = GoogleAppsScript;
//import { createOnOpenTriggers, createUpdateTriggers } from "../_CRMsetup";
var properties = PropertiesService.getScriptProperties();
/**
* PUT IN VARIABLES HERE:
*/
/*
* Add ID of parent-folder, between quotationmarks:
*/
var COPY_DRIVE_FOLDER_ID = '';
/*
/ Add ID of old CRM Main sheet:
*/
var COPY_OLD_CRM_MAIN_SPREADSHEET_ID = '';
/*
/ Add ID for old Key Sheet
*/
var COPY_OLD_KEY_SPREADHSEET_ID = '';
/**
* DON'T CHANGE THINGS BELOW:
*/
/**
* Starts the copy of the CRM system
*/
function startCopySystem() {
    copySystem();
    createOnOpenTriggers();
    createUpdateTriggers();
    /**
    * Copies all spreadsheets and changes properties of spreadsheets in the code
    */
    function copySystem() {
        console.log("Copying CRM system");
        var parentFolder = DriveApp.getFolderById(COPY_DRIVE_FOLDER_ID);
        var crmMain = DriveApp.getFileById(COPY_OLD_CRM_MAIN_SPREADSHEET_ID).makeCopy("_CRM Main Copy", parentFolder);
        var key = DriveApp.getFileById(COPY_OLD_KEY_SPREADHSEET_ID).makeCopy("CRM Key Copy", parentFolder);
        // Set properties
        properties.setProperty('CRM_MAIN_SHEET_ID', crmMain.getId());
        properties.setProperty('KEY_SHEET_ID', key.getId());
        console.log("New properties are now: " + properties.getProperties());
    }
}

// Compiled using ts2gas 3.4.4 (TypeScript 3.5.3)
var exports = exports || {};
var module = module || { exports: exports };
//import ss = GoogleAppsScript.Spreadsheet;
//import gas = GoogleAppsScript;
var properties = PropertiesService.getScriptProperties();
/**
 * Notes for meetings
 * All meetingnotes are made from the template from the templates-folder in the system.
 */
var MeetingNotes = /** @class */ (function () {
    function MeetingNotes(doc) {
        this.doc = doc;
    }
    Object.defineProperty(MeetingNotes, "notesTemplate", {
        get: function () {
            return DriveApp.getFileById(properties.getProperty('MEETING_NOTES_TEMPLATE_ID'));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Method for making a new document for meeting notes, created from template
     * @param codeName Name of candidate
     * @param date Date of meeting
     * @param meetingsFolder Folder for where to put notes
     * @returns ned oinstance of class meeting notes
     *
     */
    MeetingNotes.newMeetingNotes = function (codeName, date, meetingsFolder) {
        var dd = date.getDate();
        var mm = date.getMonth() + 1;
        var yyyy = date.getFullYear();
        var newNotesFile = MeetingNotes.notesTemplate.makeCopy(dd + "/" + mm + "/" + yyyy + (" \u2013 Meeting notes \u2013 " + codeName), meetingsFolder);
        var newNotes = new MeetingNotes(DocumentApp.openById(newNotesFile.getId()));
        var header = newNotes.getHeader();
        var body = newNotes.getBody();
        header.replaceText('{date}', date.toDateString());
        header.replaceText('{code name}', codeName);
        body.replaceText('{Date and meeting ID}', date.toDateString() + ' Meeting ID');
        newNotes.codeName = codeName;
        newNotes.parentFolder = meetingsFolder;
        return newNotes;
    };
    /**
     * Method for filling in actionables from previous meeting
     * @param actionables list of actionables 2d list to use googles function Range.setValues()
     * @param previousNotes Url to previous notes, links to previous meeting in upcoming meeting notes
     * actionables has to be 2d array to use gas.Spreadsheet.Range.setValues().
     */
    MeetingNotes.prototype.fillActionables = function (actionables, previousNotes) {
        if (actionables == undefined || actionables.length <= 0) {
            actionables = [['No actionables found, see notes from previous meeting: ' + previousNotes]];
        }
        actionables.push(['Notes from previous meeting: ' + previousNotes]);
        this.getBody().replaceText('{placeholder for actionables}', '\n' + actionables.join('\n'));
    };
    /**
     * Method for getting actionables from previous meeting
     * @returns actionables as a 2d string list: string[row][column];
     * Has to be 2d array to use gas.Spreadsheet.Range.setValues().
     */
    MeetingNotes.prototype.getActionables = function () {
        var STARTACTIONABLES = 1;
        var body = this.doc.getBody();
        var actionables = [];
        var actionables2d = [];
        // Assumes this is the last table in the document
        var tables = body.getTables();
        var table = tables[tables.length - 1];
        if (table === undefined) {
            console.log('No table of actionables found in document:' + this.doc.getUrl());
            //Throw error
            return;
        }
        for (var i = STARTACTIONABLES; i < table.getNumRows(); i++) {
            var text = table.getRow(i).getText();
            if (text != undefined && text != '' && text != ' ' && text != '   ' && text != '\n\n' && text != 'Action') {
                text = text.split('\n').join(", ");
                actionables.push(text);
            }
        }
        //Making it easier to fill actionables into range
        for (var i = 0; i < actionables.length; i++) {
            actionables2d[i] = [actionables[i]];
        }
        return actionables2d;
    };
    /**
    * @returns body of meeting document
    */
    MeetingNotes.prototype.getBody = function () {
        return this.doc.getBody();
    };
    /**
     * @returns header of meeting document
     */
    MeetingNotes.prototype.getHeader = function () {
        return this.doc.getHeader();
    };
    /**
     * @returns url of meeting document
     */
    MeetingNotes.prototype.getUrl = function () {
        return this.doc.getUrl();
    };
    return MeetingNotes;
}());
exports.MeetingNotes = MeetingNotes;

// Compiled using ts2gas 3.4.4 (TypeScript 3.5.3)
var exports = exports || {};
var module = module || { exports: exports };
//import ss = GoogleAppsScript.Spreadsheet;
//import gas = GoogleAppsScript;
var properties = PropertiesService.getScriptProperties();
/**
 * Each candidate has a folder and this is the class for that folder, the candidate folder contains all files related to candidate
 */
var CandidateFolder = /** @class */ (function () {
    function CandidateFolder(folder) {
        this.folder = folder;
    }
    Object.defineProperty(CandidateFolder, "allCandidatesFolder", {
        get: function () {
            return DriveApp.getFolderById(properties.getProperty('CANDIDATES_FOLDER_ID'));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Method for creating new folder for a candidate
     * @param codeName
     * @returns candidate folder
     */
    CandidateFolder.newCandidateFolder = function (codeName) {
        new CandidateFolder(CandidateFolder.allCandidatesFolder.createFolder(codeName));
    };
    // This should not be here, but in a "all-candidate-folders"-folder
    CandidateFolder.getCandidateFolder = function (codeName) {
        var folderIter = CandidateFolder.allCandidatesFolder.getFoldersByName(codeName);
        var returnFolder;
        var folderCounter = 0;
        if (folderIter.hasNext()) {
            returnFolder = new CandidateFolder(folderIter.next());
            folderCounter++;
        }
        while (folderIter.hasNext()) {
            folderCounter++;
            folderIter.next();
        }
        if (folderCounter > 1) {
            console.log("There are multiple folders with candidate name: " + codeName + "Using first folder.");
        }
        else if (folderCounter === 0) {
            console.error("No candidate folder with codename: " + codeName);
            throw new Error("No candidate folder with codename: " + codeName);
        }
        return returnFolder;
    };
    /**
     * All candidate folders have a meeting folder, if code can find one with the exact name a new meetingsfolder is created
     */
    CandidateFolder.prototype.getMeetingFolder = function () {
        var iter = this.folder.getFoldersByName('Meeting Notes');
        var meetingsFolder;
        if (iter.hasNext()) {
            return iter.next();
        }
        else {
            return this.folder.createFolder('Meeting Notes');
        }
    };
    /**
     * Returns url of candidate folder
     */
    CandidateFolder.prototype.getUrl = function () {
        return this.folder.getUrl();
    };
    return CandidateFolder;
}());
exports.CandidateFolder = CandidateFolder;

// Compiled using ts2gas 3.4.4 (TypeScript 3.5.3)
var exports = exports || {};
var module = module || { exports: exports };
//import{\n    Utils,\n    MeetingInfo,\n    ElementPositionSheet,\n    FormAnswers\n} from '../utils';
//import ss = GoogleAppsScript.Spreadsheet;
//import gas = GoogleAppsScript;
//import { MeetingNotes } from '../documents/documents';
//import { CandidateFolder } from '../folders/folders';
//import { MainSpreadsheet } from './MainSpreadsheet';
var properties = PropertiesService.getScriptProperties();
var CandidateSheet = /** @class */ (function () {
    function CandidateSheet(sheet) {
        this.STARTROW = 5;
        this.STARTCOLUMN = 2;
        this.ACTIVE_INACTIVE = { row: 5, column: 3, a1Notation: 'C5' };
        this.CANDIDATE_LEVEL = { row: 6, column: 3, a1Notation: 'C6' };
        this.CASE_STUDY = { row: 7, column: 3, a1Notation: 'C7' };
        this.PREVIOUS_MEETING_DATE = { row: 5, column: 5, a1Notation: 'F5' };
        this.UPCOMING_MEETING_DATE = { row: 6, column: 5, a1Notation: 'F6' };
        this.PREVIOUS_MEETING_NOTES = { row: 5, column: 6, a1Notation: 'E5' };
        this.UPCOMING_MEETING_NOTES = { row: 6, column: 6, a1Notation: 'E6' };
        this.NUMBER_COMPLETED_MEETINGS = { row: 7, column: 6, a1Notation: 'F7' };
        this.DAYS_SINCE_PREVIOUS_MEETING = { row: 8, column: 6, a1Notation: 'F8' };
        this.CLOSENESS = { row: 11, column: 6, a1Notation: 'F11' };
        this.RESOURCES = { row: 12, column: 6, a1Notation: 'F12' };
        this.DEDICATION = { row: 13, column: 6, a1Notation: 'F13' };
        this.REALISATION = { row: 14, column: 6, a1Notation: 'F14' };
        this.RESULT = { row: 15, column: 6, a1Notation: 'F15' };
        this.STAGNATION_STATUS = { row: 16, column: 6, a1Notation: 'F16' };
        this.LAST_UPDATED_MALI = { row: 17, column: 6, a1Notation: 'F17' };
        this.START_ACTIONABLES = { row: 31, column: 2, a1Notation: 'B20' };
        this.END_ACTIONABLES = { row: 39, column: 2, a1Notation: '' };
        this.START_EVALUATION_QUESTIONS = { row: 42, column: 2, a1Notation: 'B43' };
        this.START_EVALUATION_ANSWERS = { row: 42, column: 5, a1Notation: 'E43' };
        this.BACKGROUND_COLOR_EVALUATION = '#f3f3f3';
        this.START_ONBOARDING_QUESTIONS = { row: 51, column: 2, a1Notation: 'B55' };
        this.START_ONBOARDING_ANSWERS = { row: 51, column: 5, a1Notation: 'E55' };
        this.BACKGROUND_COLOR_ONBOARDING = '#f3f3f3';
        this.sheet = sheet;
    }
    Object.defineProperty(CandidateSheet, "templateSheet", {
        get: function () {
            return SpreadsheetApp.openById(properties.getProperty('CANDIDATE_SHEET_TEMPLATE_ID')).getSheets()[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CandidateSheet, "parentSheet", {
        get: function () {
            return SpreadsheetApp.openById(properties.getProperty('CRM_MAIN_SHEET_ID'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CandidateSheet.prototype, "codeName", {
        get: function () {
            return this.sheet.getName();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Function for creating a new candidate: makes new candidate sheet in the main spreadhseet, new candidate folder and add candidate to metrics sheet
     * @param codeName
     */
    CandidateSheet.newCandidate = function (codeName) {
        var sheet = this.templateSheet.copyTo(this.parentSheet).setName(codeName);
        var newSheet = new CandidateSheet(sheet);
        // Set code name
        newSheet.sheet.getRange(1, 2).setValue(codeName);
        // Link to candidate folder
        newSheet.sheet.getRange(2, 5).setValue("=HYPERLINK(\"" + CandidateFolder.getCandidateFolder(codeName).getUrl() + "\", \"Candidate folder\")");
        return newSheet;
    };
    /**
     * Adds previous and upcoming meeting to candidate sheet, and actionables from last meeting.
     * Also adds actionables from previous meeting to upcoming meeting if there is a meeting on that day.
     * @param meetingInfo interface containing info about meetings from meetings sheet
     * Actionables has to be 2d array to use gas.Spreadsheet.Range.setValues().
     */
    CandidateSheet.prototype.addMeetingInfo = function (meetingInfo) {
        var previousMeetingNotesRange = this.sheet.getRange(this.PREVIOUS_MEETING_NOTES.a1Notation);
        var previousMeetingDateRange = this.sheet.getRange(this.PREVIOUS_MEETING_DATE.a1Notation);
        var upcomingMeetingNotesRange = this.sheet.getRange(this.UPCOMING_MEETING_NOTES.a1Notation);
        var upcomingMeetingDateRange = this.sheet.getRange(this.UPCOMING_MEETING_DATE.a1Notation);
        var earliestDate = new Date("1970/01/01");
        var latestDate = new Date("2050/01/01");
        var todaysDate = new Date();
        var actionables;
        if (meetingInfo.previousMeetingDate == undefined || meetingInfo.previousMeetingDate.toDateString() == earliestDate.toDateString()) {
            previousMeetingNotesRange.setValue("Notes previous meeting");
            previousMeetingDateRange.setValue("No previous meetings");
        }
        else if (meetingInfo.previousMeetingNotes == undefined) {
            throw new Error("Something is wrong with previous notes: " + meetingInfo.previousMeetingNotes);
        }
        else {
            previousMeetingNotesRange.setFormula("=HYPERLINK(\"" + meetingInfo.previousMeetingNotes + "\", \"Notes previous meeting\")");
            previousMeetingDateRange.setNumberFormat("d/m/yyyy").setValue(meetingInfo.previousMeetingDate);
            if (Utils.getIdFromUrl(meetingInfo.previousMeetingNotes) != null && (meetingInfo.previousMeetingNotes.indexOf('document') >= 0 || meetingInfo.previousMeetingNotes.indexOf('docs') >= 0)) {
                actionables = new MeetingNotes(DocumentApp.openById(Utils.getIdFromUrl(meetingInfo.previousMeetingNotes))).getActionables();
            }
            else {
                actionables = undefined;
            }
            this.clearActionables();
            this.fillActionables(actionables);
        }
        if (meetingInfo.upcomingMeetingDate == undefined || meetingInfo.upcomingMeetingDate.toDateString() == latestDate.toDateString()) {
            upcomingMeetingNotesRange.setValue("Notes next meeting");
            upcomingMeetingDateRange.setValue("No planned meetings");
        }
        else if (meetingInfo.upcomingMeetingNotes == undefined) {
            throw new Error("Something is wrong with upcoming notes: " + meetingInfo.upcomingMeetingNotes);
        }
        else {
            upcomingMeetingNotesRange.setFormula("=HYPERLINK(\"" + meetingInfo.upcomingMeetingNotes + "\", \"Notes next meeting\")");
            upcomingMeetingDateRange.setNumberFormat("d/m/yyyy").setValue(meetingInfo.upcomingMeetingDate);
        }
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (meetingInfo.upcomingMeetingDate.toDateString() === todaysDate.toDateString() && meetingInfo.previousMeetingNotes != undefined) {
            var upcomingNotes = new MeetingNotes(DocumentApp.openById(Utils.getIdFromUrl(meetingInfo.upcomingMeetingNotes)));
            if (Utils.getIdFromUrl(meetingInfo.previousMeetingNotes) != null && (meetingInfo.previousMeetingNotes.indexOf('document') >= 0 || meetingInfo.previousMeetingNotes.indexOf('docs') >= 0)) {
                actionables = new MeetingNotes(DocumentApp.openById(Utils.getIdFromUrl(meetingInfo.previousMeetingNotes))).getActionables();
            }
            else {
                actionables = undefined;
            }
            upcomingNotes.fillActionables(actionables, meetingInfo.previousMeetingNotes);
        }
    };
    /**
     * removes content from cells in actionables area in candidate sheet
     */
    CandidateSheet.prototype.clearActionables = function () {
        var lengthActionablesRange = this.END_ACTIONABLES.row - this.START_ACTIONABLES.row + 1;
        var range = this.sheet.getRange(this.START_ACTIONABLES.row, this.START_ACTIONABLES.column, lengthActionablesRange);
        range.clearContent();
    };
    /**
     * Adds actionables to candidate sheet
     * @param actionables Has to be 2d array to use gas.Spreadsheet.Range.setValues().
     */
    CandidateSheet.prototype.fillActionables = function (actionables) {
        if (actionables == undefined || actionables.length <= 0) {
            actionables = [['No actionables found, see notes from previous meeting']];
        }
        var lengthActionablesRange = this.END_ACTIONABLES.row - this.START_ACTIONABLES.row + 1;
        if (actionables.length > lengthActionablesRange) {
            actionables[lengthActionablesRange - 1][0] = 'More actionables found, see notes from previous meeting';
            actionables.length = lengthActionablesRange;
        }
        var actionablesRange = this.sheet.getRange(this.START_ACTIONABLES.row, this.START_ACTIONABLES.column, actionables.length);
        actionablesRange.setValues(actionables);
    };
    /**
     * EA Norway has a form they use for evaluation after each meeting. This form is linked to a sheet in the Key spreadsheet.
     * Fills answers from form sheet to candidate sheet.
     */
    CandidateSheet.prototype.fillEvaluationAnswers = function (formAnswers) {
        if (formAnswers == null) {
            return;
        }
        var length = formAnswers.answers.length;
        var rowsNeeded;
        var questionsRange = this.sheet.getRange(this.START_EVALUATION_QUESTIONS.row, this.START_EVALUATION_QUESTIONS.column, length);
        var answersRange = this.sheet.getRange(this.START_EVALUATION_ANSWERS.row, this.START_EVALUATION_ANSWERS.column, length);
        rowsNeeded = Utils.checkSpaceColor(answersRange, this.BACKGROUND_COLOR_EVALUATION);
        if (rowsNeeded > 0) {
            console.log("Added %d new rows", rowsNeeded);
            this.sheet.insertRows(this.START_EVALUATION_ANSWERS.row, rowsNeeded);
            //TODO use offset here instead
        }
        questionsRange.setValues(formAnswers.questions);
        answersRange.setValues(formAnswers.answers);
    };
    /**
     * EA Norway has a form they use for each candidate before the first meeting with that candidate to get som basic information. This form is linked to a sheet in the Key spreadsheet.
     * Fills answers from form sheet to candidate sheet.
     * @param formAnswers answers from form sheet in the keys spreadsheet
     */
    CandidateSheet.prototype.fillOnboardingAnswers = function (formAnswers) {
        if (formAnswers == null) {
            return;
        }
        var lengthAnswers = formAnswers.answers.length;
        var rowsNeeded;
        var questionsRange = this.sheet.getRange(this.START_ONBOARDING_QUESTIONS.row, this.START_ONBOARDING_QUESTIONS.column, lengthAnswers);
        var answersRange = this.sheet.getRange(this.START_ONBOARDING_ANSWERS.row, this.START_ONBOARDING_ANSWERS.column, lengthAnswers);
        questionsRange.clearContent();
        answersRange.clearContent();
        rowsNeeded = Utils.checkSpaceColor(answersRange, this.BACKGROUND_COLOR_ONBOARDING);
        if (rowsNeeded > 0) {
            console.log("Added %d new rows", rowsNeeded);
            this.sheet.insertRows(this.START_ONBOARDING_ANSWERS.row, rowsNeeded);
            //TODO use offset here instead
        }
        questionsRange.setValues(formAnswers.questions);
        answersRange.setValues(formAnswers.answers);
    };
    /**
     * @returns the id of a candidate sheet, more on sheet ID: https://developers.google.com/sheets/api/guides/concepts
     */
    CandidateSheet.prototype.getId = function () {
        return this.sheet.getSheetId();
    };
    /**
     * @returns all information in a candidate sheet, this the the information that is copied to Metrics Historical Data.
     * Has to be 2d array to use gas.Spreadsheet.Range.setValues() later.
     */
    CandidateSheet.prototype.getSnapshot = function () {
        var everything = [[]];
        var counter = 0;
        var codeName = this.codeName;
        var id = this.getId();
        var allData = this.sheet.getDataRange().getValues();
        everything[0][counter++] = "=HYPERLINK(\"#gid=" + id + "\", \"" + codeName + "\")";
        everything[0][counter++] = "=HYPERLINK(\"" + CandidateFolder.getCandidateFolder(this.codeName).getUrl() + "\", \"Candidate folder\")";
        everything[0][counter++] = "='" + codeName + "'!" + this.ACTIVE_INACTIVE.a1Notation;
        everything[0][counter++] = String(allData[this.CANDIDATE_LEVEL.row - 1][this.CANDIDATE_LEVEL.column - 1]);
        everything[0][counter++] = String(allData[this.CASE_STUDY.row - 1][this.CASE_STUDY.column - 1]);
        // MEETINGS
        //rowMetric[0][4].setNumberFormat("d/m/yyyy");
        //rowMetrichistorical[0][4].setNumberFormat("d/m/yyyy");
        everything[0][counter++] = String(allData[this.PREVIOUS_MEETING_DATE.row - 1][this.PREVIOUS_MEETING_DATE.column - 1]);
        everything[0][counter++] = String(allData[this.PREVIOUS_MEETING_NOTES.row - 1][this.PREVIOUS_MEETING_NOTES.column - 1]);
        //rowMetric[0][5].setNumberFormat("d/m/yyyy");
        //rowMetrichistorical[0][5].setNumberFormat("d/m/yyyy");
        everything[0][counter++] = String(allData[this.UPCOMING_MEETING_DATE.row - 1][this.UPCOMING_MEETING_DATE.column - 1]);
        everything[0][counter++] = String(allData[this.UPCOMING_MEETING_NOTES.row - 1][this.UPCOMING_MEETING_NOTES.column - 1]);
        everything[0][counter++] = String(allData[this.NUMBER_COMPLETED_MEETINGS.row - 1][this.NUMBER_COMPLETED_MEETINGS.column - 1]);
        everything[0][counter++] = String(allData[this.DAYS_SINCE_PREVIOUS_MEETING.row - 1][this.DAYS_SINCE_PREVIOUS_MEETING.column - 1]);
        // MALI MODEL
        everything[0][counter++] = String(allData[this.CLOSENESS.row - 1][this.CLOSENESS.column - 1]);
        everything[0][counter++] = String(allData[this.RESOURCES.row - 1][this.RESOURCES.column - 1]);
        everything[0][counter++] = String(allData[this.DEDICATION.row - 1][this.DEDICATION.column - 1]);
        everything[0][counter++] = String(allData[this.REALISATION.row - 1][this.REALISATION.column - 1]);
        everything[0][counter++] = String(allData[this.RESULT.row - 1][this.RESULT.column - 1]);
        everything[0][counter++] = String(allData[this.STAGNATION_STATUS.row - 1][this.STAGNATION_STATUS.column - 1]);
        everything[0][counter++] = String(allData[this.LAST_UPDATED_MALI.row - 1][this.LAST_UPDATED_MALI.column - 1]);
        return everything;
    };
    /**
     * @returns a list with all formulas for the metrics sheet, so the metricssheet is linked to all candidate sheets.
     * Has to be 2d array to use gas.Spreadsheet.Range.setValues().
     */
    CandidateSheet.prototype.getFormulasMetrics = function () {
        var metrics = [[]];
        var counter = 0;
        var codeName = this.codeName;
        var id = this.getId();
        metrics[0][counter++] = "=HYPERLINK(\"#gid=" + id + "\", \"" + codeName + "\")";
        metrics[0][counter++] = "=HYPERLINK(\"" + CandidateFolder.getCandidateFolder(codeName).getUrl() + "\", \"Candidate folder\")";
        metrics[0][counter++] = "='" + codeName + "'!" + this.ACTIVE_INACTIVE.a1Notation;
        metrics[0][counter++] = "='" + codeName + "'!" + this.CANDIDATE_LEVEL.a1Notation;
        metrics[0][counter++] = "='" + codeName + "'!" + this.CASE_STUDY.a1Notation;
        // MEETINGS
        //rowMetric[0][4].setNumberFormat("d/m/yyyy");
        //rowMetrichistorical[0][4].setNumberFormat("d/m/yyyy");
        metrics[0][counter++] = "='" + codeName + "'!" + this.PREVIOUS_MEETING_DATE.a1Notation;
        //rowMetric[0][5].setNumberFormat("d/m/yyyy");
        //rowMetrichistorical[0][5].setNumberFormat("d/m/yyyy");
        metrics[0][counter++] = "='" + codeName + "'!" + this.UPCOMING_MEETING_DATE.a1Notation;
        metrics[0][counter++] = "='" + codeName + "'!" + this.NUMBER_COMPLETED_MEETINGS.a1Notation;
        metrics[0][counter++] = "='" + codeName + "'!" + this.DAYS_SINCE_PREVIOUS_MEETING.a1Notation;
        // MALI MODEL
        metrics[0][counter++] = "='" + codeName + "'!" + this.CLOSENESS.a1Notation;
        metrics[0][counter++] = "='" + codeName + "'!" + this.RESOURCES.a1Notation;
        metrics[0][counter++] = "='" + codeName + "'!" + this.DEDICATION.a1Notation;
        metrics[0][counter++] = "='" + codeName + "'!" + this.REALISATION.a1Notation;
        metrics[0][counter++] = "='" + codeName + "'!" + this.RESULT.a1Notation;
        metrics[0][counter++] = "='" + codeName + "'!" + this.STAGNATION_STATUS.a1Notation;
        metrics[0][counter++] = "='" + codeName + "'!" + this.LAST_UPDATED_MALI.a1Notation;
        return metrics;
    };
    /**
     * @returns the url of a candidate sheet
     */
    CandidateSheet.prototype.getUrl = function () {
        return MainSpreadsheet.getUrl() + "#gid=" + this.getId();
    };
    CandidateSheet.prototype.hideSheet = function () {
        this.sheet.hideSheet();
        return this.sheet;
    };
    CandidateSheet.prototype.isSheetHidden = function () {
        return this.sheet.isSheetHidden();
    };
    return CandidateSheet;
}());
exports.CandidateSheet = CandidateSheet;

// Compiled using ts2gas 3.4.4 (TypeScript 3.5.3)
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
     * Snapshot has to be 2d array to use gas.Spreadsheet.Range.setValues().
     */
    DashboardHistoricalSheet.addSnapshot = function (snapshot) {
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

// Compiled using ts2gas 3.4.4 (TypeScript 3.5.3)
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
    DashboardSheet.fillNextMeetings = function (nextMeetings) {
        var nextMeetingsRangeLength = this.NEXT_MEETINGS_END.row - this.NEXT_MEETINGS_START.row + 1;
        if (nextMeetings.length > nextMeetingsRangeLength) {
            return;
        }
        var range = this.sheet.getRange(this.NEXT_MEETINGS_START.row, this.NEXT_MEETINGS_START.column, nextMeetings.length, 2);
        range.setValues(nextMeetings);
    };
    /**
     * Takes a snapshot of all values in dashboard
     * @returns a 2d list to make it easy to use googles method Range.setValues()
     */
    DashboardSheet.getSnapshot = function () {
        var snapshot = [[]];
        var counter = 0;
        var allData = this.sheet.getDataRange().getValues();
        snapshot[0][counter++] = allData[this.MEETINGS_TOTAL.row - 1][this.MEETINGS_TOTAL.column - 1];
        snapshot[0][counter++] = allData[this.MEETINGS_LAST_YEAR.row - 1][this.MEETINGS_LAST_YEAR.column - 1];
        snapshot[0][counter++] = allData[this.MEETINGS_THIS_YEAR.row - 1][this.MEETINGS_THIS_YEAR.column - 1];
        snapshot[0][counter++] = allData[this.MEETINGS_LAST_THIRTY.row - 1][this.MEETINGS_LAST_THIRTY.column - 1];
        snapshot[0][counter++] = allData[this.MEETINGS_DAYS_SINCE_PREVIOUS.row - 1][this.MEETINGS_DAYS_SINCE_PREVIOUS.column - 1];
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
    DashboardSheet.NEXT_MEETINGS_START = { row: 12, column: 2, a1Notation: 'B12' };
    DashboardSheet.NEXT_MEETINGS_END = { row: 16, column: 2, a1Notation: 'B16' };
    return DashboardSheet;
}());
exports.DashboardSheet = DashboardSheet;

// Compiled using ts2gas 3.4.4 (TypeScript 3.5.3)
var exports = exports || {};
var module = module || { exports: exports };
//import { ElementPositionSheet, FormAnswers } from "../utils";
//import gas = GoogleAppsScript;
/**
 * This sheet is stored in the key sheet because onboarding sheet is stored there
 * EA Norway has a form they use for evaluation after each meeting. This form is linked to a sheet in the Key spreadsheet.
 */
var properties = PropertiesService.getScriptProperties();
var EvaluationFormSheet = /** @class */ (function () {
    function EvaluationFormSheet() {
    }
    Object.defineProperty(EvaluationFormSheet, "sheet", {
        get: function () {
            return SpreadsheetApp.openById(properties.getProperty('KEY_SHEET_ID')).getSheetByName(EvaluationFormSheet.nameOfSheet);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets all answers answers and questions from the form for given candidate(not for all candidates)
     * @param codeName
     */
    EvaluationFormSheet.getAnswers = function (codeName) {
        if (this.sheet == null) {
            throw new Error("Can't find sheet in Key Spreadsheet with name " +
                this.nameOfSheet +
                ". Please change the name of the correct sheet, or change the name of the sheet in the code. If you do not have an evaluation form sheet remove the function call.");
        }
        var foundCodeName = false;
        var formAnswers = { answers: [], questions: [] };
        var allDataForm = this.sheet.getDataRange().getValues();
        for (var i = 0; i < allDataForm.length; i++) {
            if (String(allDataForm[i][this.CODENAMES.column - 1]).localeCompare(codeName) === 0) {
                foundCodeName = true;
                for (var y = 0; y < allDataForm[i].length; y++) {
                    formAnswers.answers.push([allDataForm[0][y + 2]]);
                    formAnswers.questions.push([allDataForm[i][y + 2]]);
                }
            }
        }
        if (!foundCodeName) {
            console.log("Could not find code name %s in evaluationsform", codeName);
            return null;
        }
        return formAnswers;
    };
    EvaluationFormSheet.nameOfSheet = 'Evaluation Form';
    EvaluationFormSheet.START = { row: 1, column: 1, a1Notation: 'A1' };
    EvaluationFormSheet.CODENAMES = { row: 2, column: 2, a1Notation: 'B2' };
    return EvaluationFormSheet;
}());
exports.EvaluationFormSheet = EvaluationFormSheet;

// Compiled using ts2gas 3.4.4 (TypeScript 3.5.3)
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
    Object.defineProperty(KeySheet, "sheet", {
        get: function () {
            return SpreadsheetApp.openById(properties.getProperty('KEY_SHEET_ID')).getSheetByName('Key');
        },
        enumerable: true,
        configurable: true
    });
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
            }
        }
        return String(email);
    };
    /**
     * @returns {string[]} all codeNames wich are not hyperlinks, this should be all the new candidates wich havn't been added to the system yet.
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
                    console.log('Found code name: %s', codeName);
                    codeNames.push(String(codeName));
                }
                else {
                    console.log('Cell which is neither blank nor hyperlink found, but value: %s is not string', codeName);
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
            cell = codeNamesRange.getCell(i + 1, 1);
            codeName = cell.getValue();
            if (!cell.isBlank() && !Utils.isHyperlink(cell) && (updatedCandidates.indexOf(codeName) > -1)) {
                url = MainSpreadsheet.getCandidateSheet(codeName).getUrl();
                cell.setValue("=HYPERLINK(\"" + url + "\", \"" + codeName + "\")");
            }
        }
    };
    KeySheet.CODENAMES = { row: 3, column: 2, a1Notation: 'B11' };
    KeySheet.EMAIL = { row: 2, column: 11, a1Notation: 'B11' };
    return KeySheet;
}());
exports.KeySheet = KeySheet;

// Compiled using ts2gas 3.4.4 (TypeScript 3.5.3)
var exports = exports || {};
var module = module || { exports: exports };
//import ss = GoogleAppsScript.Spreadsheet;
//import gas = GoogleAppsScript;
//import { CandidateSheet } from './CandidateSheet';
var properties = PropertiesService.getScriptProperties();
var MainSpreadsheet = /** @class */ (function () {
    function MainSpreadsheet() {
    }
    Object.defineProperty(MainSpreadsheet, "allSheets", {
        get: function () {
            return this.spreadsheet.getSheets();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MainSpreadsheet, "spreadsheet", {
        get: function () {
            return SpreadsheetApp.openById(properties.getProperty('CRM_MAIN_SHEET_ID'));
        },
        enumerable: true,
        configurable: true
    });
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
    return MainSpreadsheet;
}());
exports.MainSpreadsheet = MainSpreadsheet;

// Compiled using ts2gas 3.4.4 (TypeScript 3.5.3)
var exports = exports || {};
var module = module || { exports: exports };
//import gas = GoogleAppsScript;
//import { MeetingInfo, Utils, ElementPositionSheet } from "../utils";
//import { MainSpreadsheet } from "./MainSpreadsheet";
//import { CandidateSheet } from "./CandidateSheet";
//import { MeetingNotes } from "../documents/documents";
var properties = PropertiesService.getScriptProperties();
var MeetingsSheet = /** @class */ (function () {
    function MeetingsSheet() {
    }
    Object.defineProperty(MeetingsSheet, "sheet", {
        get: function () {
            return MainSpreadsheet.getSheet("Meetings Historical Data");
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds information about a new meeting to the meetingssheet
     * @param snapshot snapshot from candidates sheet
     * @param date date of meeting
     * @param urlNotes url to notes
     * Array snapshot has to be 2d array to use gas.Spreadsheet.Range.setValues().
     */
    MeetingsSheet.addMeeting = function (snapshot, date, urlNotes) {
        var inputRow = this.sheet.getLastRow() + 1;
        this.sheet.getRange(inputRow, 4, 1, snapshot[0].length).setValues(snapshot);
        this.sheet
            .getRange(inputRow, 2)
            .setValue(date)
            .setNumberFormat("d/m/yyyy");
        this.sheet
            .getRange(inputRow, 3)
            .setValue(urlNotes);
    };
    /**
     * @param codeName
     * @returns list of all meetings of given candidate
     * Array meetings has to be 2d array to use gas.Spreadsheet.Range.setValues().
     */
    MeetingsSheet.getCandidateMeetings = function (codeName) {
        var meetingRange = this.sheet.getRange(this.START_ROW, this.START_COLUMN, this.sheet.getLastRow(), this.LAST_COLUMN_MEETING_INFO);
        var meetingInfo = meetingRange.getValues();
        var meetings = [];
        for (var y = 0; y < meetingInfo.length; y++) {
            if (String(meetingInfo[y][2]) == codeName) {
                meetings.push(meetingInfo[y]);
                console.log("MeetingRow added: " + meetingInfo[y]);
            }
        }
        return meetings;
    };
    /**
     *
     * @param codeName
     * @returns previous and upcoming meeting for given candidate stored in the interface MeetingInfo from ./../utils.ts
     * Array meetings has to be 2d array to use gas.Spreadsheet.Range.setValues().
     */
    MeetingsSheet.getMeetingInfo = function (codeName) {
        var earliestDate = new Date("1970/01/01");
        var previousMeeting = earliestDate;
        var latestDate = new Date("2050/01/01");
        var upcomingMeeting = latestDate;
        var todaysDate = new Date();
        console.log("Todays date: " + todaysDate);
        var previousMeetingNotes;
        var upcomingMeetingNotes;
        var meetings = this.getCandidateMeetings(codeName);
        var meetingInfo;
        for (var y = 0; y < meetings.length; y++) {
            var meetingDate = meetings[y][0];
            // Check if a meeting is today, but is already finished, assumes a meeting is finished if notes has actionables.
            // If todays meeting does not has actionables it is an umpcoming meeting.
            var actionables = void 0;
            if (Utils.isDocument(String(meetings[y][1]))) {
                actionables = new MeetingNotes(DocumentApp.openById(Utils.getIdFromUrl(String(meetings[y][1])))).getActionables();
            }
            else {
                actionables = undefined;
            }
            if (meetingDate.toDateString() === todaysDate.toDateString() &&
                actionables != undefined &&
                actionables.length > 0) {
                previousMeeting = meetingDate;
                previousMeetingNotes = String(meetings[y][1]);
            }
            else if ((meetingDate >= todaysDate && meetingDate < upcomingMeeting) ||
                meetingDate.toDateString() === todaysDate.toDateString()) {
                upcomingMeeting = meetingDate;
                upcomingMeetingNotes = String(meetings[y][1]);
            }
            else if (meetingDate < todaysDate && meetingDate > previousMeeting) {
                previousMeeting = meetingDate;
                previousMeetingNotes = String(meetings[y][1]);
            }
        }
        //Checking if meeting today has actionables, if yes, it will be set as previous meeting.
        meetingInfo = {
            upcomingMeetingDate: upcomingMeeting,
            upcomingMeetingNotes: upcomingMeetingNotes,
            previousMeetingDate: previousMeeting,
            previousMeetingNotes: previousMeetingNotes
        };
        console.log("Previous: " +
            meetingInfo.previousMeetingDate +
            "notes: " +
            meetingInfo.previousMeetingNotes);
        console.log("Upcoming: " +
            meetingInfo.upcomingMeetingDate +
            "notes: " +
            meetingInfo.upcomingMeetingNotes);
        return meetingInfo;
    };
    /**
     * @param numberOfmeetings Number of meetings/rows to return
     * @returns meetingsReturn: 2d list of next meetings and code name of candidates: [[next meeting, codeName][next next meeting, codeName]]
     * Use gas.Spreadsheet.Range.setValues() to fill values in a sheet.
     */
    MeetingsSheet.getNextMeetings = function (numberOfmeetings) {
        var meetingsReturn = [];
        var meetings = this.sheet.getDataRange().getValues();
        for (var i = this.START_ROW; i < meetings.length; i++) {
            var date = new Date(String(meetings[i][this.MEETING_DATE_START.column - 1]));
            var todaysdate = new Date();
            var codeName = meetings[i][this.CODENAME_START.column - 1];
            if (date > todaysdate ||
                date.toDateString() == todaysdate.toDateString()) {
                meetingsReturn.push([date, codeName]);
            }
        }
        meetingsReturn.sort(Utils.compareDates);
        if (meetingsReturn.length > numberOfmeetings) {
            meetingsReturn.length = numberOfmeetings;
        }
        return meetingsReturn;
    };
    MeetingsSheet.START_ROW = 4;
    MeetingsSheet.START_COLUMN = 2;
    MeetingsSheet.LAST_COLUMN_MEETING_INFO = 19;
    MeetingsSheet.MEETING_DATE_START = {
        row: 4,
        column: 2,
        a1Notation: "B4"
    };
    MeetingsSheet.CODENAME_START = {
        row: 4,
        column: 4,
        a1Notation: "D4"
    };
    return MeetingsSheet;
}());
exports.MeetingsSheet = MeetingsSheet;

// Compiled using ts2gas 3.4.4 (TypeScript 3.5.3)
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
     * Has to be 2d array to use gas.Spreadsheet.Range.setValues().
     */
    MetricsHistoricalSheet.addCandidateInfo = function (candidateInfo) {
        var inputRow = this.sheet.getLastRow() + 1;
        this.sheet.getRange(inputRow, this.COLUMN_START).setValue(new Date());
        var range = this.sheet.getRange(inputRow, this.COLUMN_START + 1, 1, candidateInfo[0].length);
        range.setValues(candidateInfo);
    };
    MetricsHistoricalSheet.ROW_START = 4;
    MetricsHistoricalSheet.COLUMN_START = 2;
    MetricsHistoricalSheet.START_CODENAMES = { row: 4, column: 2, a1Notation: 'B4' };
    MetricsHistoricalSheet.START_ACTIVE_INACTIVE = { row: 4, column: 4, a1Notation: 'D4' };
    return MetricsHistoricalSheet;
}());
exports.MetricsHistoricalSheet = MetricsHistoricalSheet;

// Compiled using ts2gas 3.4.4 (TypeScript 3.5.3)
var exports = exports || {};
var module = module || { exports: exports };
//import { MainSpreadsheet } from './MainSpreadsheet';
//import ss = GoogleAppsScript.Spreadsheet;
//import gas = GoogleAppsScript;
//import { Utils, ElementPositionSheet } from '../utils';
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
     * @param candidateInfo has to be 2d array to use gas.Spreadsheet.Range.setValues().
     */
    MetricsSheet.addCandidateInfo = function (candidateInfo) {
        var inputRow = this.sheet.getLastRow() + 1;
        var range = this.sheet.getRange(inputRow, this.COLUMN_START, 1, candidateInfo[0].length);
        range.setValues(candidateInfo);
    };
    /**
     *
     * @param codeName gets snapshot of information from candidate, used when meeting is added
     * @returns snapshot of all info of given candidate, has to be 2d array to use gas.Spreadsheet.Range.setValues() later.
     */
    MetricsSheet.getCandidateSnapshot = function (codeName) {
        var lastRow = this.sheet.getLastRow();
        var lastColumn = this.sheet.getLastColumn();
        var range = this.sheet.getRange(this.START_CODENAMES.row, this.START_CODENAMES.column, lastRow, lastColumn);
        var values = range.getValues();
        var formulas = range.getFormulas();
        for (var i = 0; i < values.length; i++) {
            if (values[i][0] == codeName) {
                values[i][0] = new String(formulas[i][0]);
                return [values[i]];
            }
        }
    };
    /**
     * @returns all candidates(both active and inactive)
     */
    MetricsSheet.getAllCandidates = function () {
        var codeNamesRange = this.sheet.getRange(this.START_CODENAMES.row, this.START_CODENAMES.column, this.sheet.getLastRow());
        var lastRow = codeNamesRange.getHeight();
        var codeNames = [];
        for (var row = 1; row <= lastRow; row++) {
            // Cell coordinates are relative to range
            var cell = codeNamesRange.getCell(row, 1);
            if (!cell.isBlank() && Utils.isHyperlink(cell)) {
                var codeName = cell.getValue();
                if (Utils.isString(codeName)) {
                    codeNames.push(String(codeName));
                }
                else {
                    console.log('Cell which is neither blank nor hyperlink found, but value: %s is not string', codeName);
                }
            }
        }
        return codeNames;
    };
    /**
     * @returns only active candidates, not inactive candidates
     */
    MetricsSheet.getActiveCandidates = function () {
        var dataRange = this.sheet.getDataRange();
        var lastRow = this.sheet.getLastRow();
        var codeNames = [];
        for (var row = 1; row <= lastRow; row++) {
            // Cell coordinates are relative to range
            var codeNameCell = dataRange.getCell(row, this.START_CODENAMES.column);
            var activeInactice = String(dataRange.getCell(row, this.ACTIVE_INACTIVE.column).getValue());
            if (!codeNameCell.isBlank() && Utils.isHyperlink(codeNameCell) && activeInactice == 'Active') {
                var codeName = codeNameCell.getValue();
                if (Utils.isString(codeName)) {
                    codeNames.push(String(codeName));
                }
                else {
                    console.log('Cell which is neither blank nor hyperlink found, but value: %s is not string', codeName);
                }
            }
        }
        return codeNames;
    };
    MetricsSheet.getInactiveCandidates = function () {
        var dataRange = this.sheet.getDataRange();
        var lastRow = this.sheet.getLastRow();
        var codeNames = [];
        for (var row = 1; row <= lastRow; row++) {
            // Cell coordinates are relative to range
            var codeNameCell = dataRange.getCell(row, this.START_CODENAMES.column);
            var activeInactice = String(dataRange.getCell(row, this.ACTIVE_INACTIVE.column).getValue());
            if (!codeNameCell.isBlank() && Utils.isHyperlink(codeNameCell) && activeInactice == 'Inactive') {
                var codeName = codeNameCell.getValue();
                if (Utils.isString(codeName)) {
                    codeNames.push(String(codeName));
                }
                else {
                    console.log('Cell which is neither blank nor hyperlink found, but value: %s is not string', codeName);
                }
            }
        }
        return codeNames;
    };
    MetricsSheet.START = 1;
    MetricsSheet.COLUMN_START = 2;
    MetricsSheet.START_CODENAMES = { row: 4, column: 2, a1Notation: 'B4' };
    MetricsSheet.ACTIVE_INACTIVE = { row: 4, column: 4, a1Notation: 'D4' };
    return MetricsSheet;
}());
exports.MetricsSheet = MetricsSheet;

// Compiled using ts2gas 3.4.4 (TypeScript 3.5.3)
var exports = exports || {};
var module = module || { exports: exports };
/**
 * This sheet is stored in the key sheet because it contains sensetive information
 * EA Norway has a form they use for each candidate before the first meeting with that candidate to get som basic information. This form is linked to a sheet in the Key spreadsheet.
 */
//import { ElementPositionSheet, FormAnswers } from "../utils";
//import { KeySheet } from "./KeySheet";
//import gas = GoogleAppsScript;
var properties = PropertiesService.getScriptProperties();
var OnboardingFormSheet = /** @class */ (function () {
    function OnboardingFormSheet() {
    }
    Object.defineProperty(OnboardingFormSheet, "sheet", {
        get: function () {
            return SpreadsheetApp.openById(properties.getProperty("KEY_SHEET_ID")).getSheetByName(OnboardingFormSheet.nameOfSheet);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets all answers answers and questions from the form for given candidate(not for all candidates)
     * @param codeName
     */
    OnboardingFormSheet.getAnswers = function (codeName) {
        if (this.sheet == null) {
            throw new Error("Can't find sheet in Key spreadsheet with name " +
                this.nameOfSheet +
                "\nPlease change the name of the correct sheet, or change the name of the sheet in the code\nIf you do not have an onboarding form sheet remove the function call.");
        }
        var foundEmail = false;
        var allDataForm = this.sheet.getDataRange().getValues();
        var email = KeySheet.getEmail(codeName);
        var formAnswers = { answers: [], questions: [] };
        console.log("length: " + allDataForm.length + " " + allDataForm);
        if (email == undefined) {
            console.log("Can't find email for candidate in keys sheet\nCode name: " + codeName);
            return;
        }
        for (var i = 0; i < allDataForm.length; i++) {
            if (String(allDataForm[i][2]).localeCompare(email) === 0) {
                foundEmail = true;
                for (var y = 0; y < allDataForm[i].length; y++) {
                    formAnswers.answers.push([allDataForm[0][y + 3]]);
                    formAnswers.questions.push([allDataForm[i][y + 3]]);
                }
            }
        }
        if (!foundEmail) {
            console.log("Can't find matching email for user in answers from onboarding form\nCode name: " +
                codeName);
            return null;
        }
        return formAnswers;
    };
    OnboardingFormSheet.nameOfSheet = "Onboarding Form";
    OnboardingFormSheet.START = { row: 1, column: 1, a1Notation: "A1" };
    OnboardingFormSheet.CODENAMES = {
        row: 2,
        column: 2,
        a1Notation: "B2"
    };
    OnboardingFormSheet.EMAIL = {
        row: 2,
        column: 11,
        a1Notation: "B11"
    };
    return OnboardingFormSheet;
}());
exports.OnboardingFormSheet = OnboardingFormSheet;
