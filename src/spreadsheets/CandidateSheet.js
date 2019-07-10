// Compiled using ts2gas 1.6.2 (TypeScript 3.5.2)
var exports = exports || {};
var module = module || { exports: exports };
//import{\n    Utils,\n    MeetingInfo,\n    ElementPositionSheet\n} from '../utils';
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
        this.CASE_STUDY = { row: 7, column: 2, a1Notation: 'C7' };
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
        this.START_EVALUATION_ANSWERS = { row: 42, column: 2, a1Notation: 'B43' };
        this.START_ONBOARDING_ANSWERS = { row: 51, column: 2, a1Notation: 'B55' };
        this.sheet = sheet;
    }
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
        Logger.log("Copy template, add sheet");
        var sheet = this.templateSheet.copyTo(this.parentSheet).setName(codeName);
        Logger.log("Create new CandidateSheetObject");
        var newSheet = new CandidateSheet(sheet);
        // Set code name
        Logger.log("Set codename");
        newSheet.sheet.getRange(1, 2).setValue(codeName);
        // Link to candidate folder
        Logger.log("Link to candidate folder");
        newSheet.sheet.getRange(2, 5).setValue("=HYPERLINK(\"" + CandidateFolder.getCandidateFolder(codeName).getUrl() + "\", \"Candidate folder\")");
        return newSheet;
    };
    /**
     * Adds previous and upcoming meeting to candidate sheet, and actionables from last meeting.
     * Also adds actionables from previous meeting to upcoming meeting if there is a meeting on that day.
     * @param meetingInfo interface containing info about meetings from meetings sheet
     */
    CandidateSheet.prototype.addMeetingInfo = function (meetingInfo) {
        Logger.log("Add meeting info");
        var previousMeetingNotesRange = this.sheet.getRange(this.PREVIOUS_MEETING_NOTES.a1Notation);
        var previousMeetingDateRange = this.sheet.getRange(this.PREVIOUS_MEETING_DATE.a1Notation);
        var upcomingMeetingNotesRange = this.sheet.getRange(this.UPCOMING_MEETING_NOTES.a1Notation);
        var upcomingMeetingDateRange = this.sheet.getRange(this.UPCOMING_MEETING_DATE.a1Notation);
        var earliestDate = new Date("1970/01/01");
        var latestDate = new Date("2050/01/01");
        var todaysDate = new Date();
        var actionables;
        if (meetingInfo.previousMeetingDate == undefined || meetingInfo.previousMeetingDate.toDateString() == earliestDate.toDateString()) {
            Logger.log("No previous meeting");
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
        Logger.log("Upcoming meeting HERE: " + meetingInfo.upcomingMeetingDate);
        Logger.log("Previous meeting HERE: " + meetingInfo.previousMeetingDate);
        Logger.log("Upcoming to string HERE: " + meetingInfo.upcomingMeetingDate.toDateString() + " Latest: " + latestDate.toDateString());
        if (meetingInfo.upcomingMeetingDate == undefined || meetingInfo.upcomingMeetingDate.toDateString() == latestDate.toDateString()) {
            Logger.log("No next meeting");
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
        Logger.log("prevNotes: " + meetingInfo.previousMeetingNotes);
        Logger.log("upcomingNotes: " + meetingInfo.upcomingMeetingNotes);
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        Logger.log("Today: " + todaysDate + "Yesterday: " + yesterday);
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
     * @param actionables
     */
    CandidateSheet.prototype.fillActionables = function (actionables) {
        if (actionables == undefined || actionables.length <= 0) {
            actionables = [['No actionables found, see notes from previous meeting']];
        }
        var lengthActionablesRange = this.END_ACTIONABLES.row - this.START_ACTIONABLES.row + 1;
        if (actionables.length > lengthActionablesRange) {
            actionables[lengthActionablesRange - 1][0] = 'More actionables found, see notes from previous meeting';
            actionables.length = lengthActionablesRange;
            Logger.log("Length actionables: " + actionables.length + " Length range: " + lengthActionablesRange);
        }
        var actionablesRange = this.sheet.getRange(this.START_ACTIONABLES.row, this.START_ACTIONABLES.column, actionables.length);
        actionablesRange.setValues(actionables);
    };
    /**
     * EA Norway has a form they use for evaluation after each meeting. This form is linked to a sheet in the Key spreadsheet.
     * Fills answers from form sheet to candidate sheet.
     */
    CandidateSheet.prototype.fillEvaluationAnswers = function (formAnswers) {
        if (formAnswers == undefined || formAnswers.length == 0) {
            return;
        }
        var length = formAnswers.length;
        var rowsNeeded;
        var questionsRange = this.sheet.getRange(this.START_EVALUATION_ANSWERS.row, this.START_EVALUATION_ANSWERS.column, length, 2);
        rowsNeeded = Utils.checkSpaceColor(questionsRange);
        Logger.log("Rows needed: " + rowsNeeded);
        if (rowsNeeded > 0) {
            this.sheet.insertRows(this.START_EVALUATION_ANSWERS.row, rowsNeeded);
            //TODO bruke offset her isteden
        }
        questionsRange.setValues(formAnswers);
    };
    /**
     * EA Norway has a form they use for each candidate before the first meeting with that candidate to get som basic information. This form is linked to a sheet in the Key spreadsheet.
     * Fills answers from form sheet to candidate sheet.
     * @param formAnswers answers from form sheet in the keys spreadsheet
     */
    CandidateSheet.prototype.fillOnboardingAnswers = function (formAnswers) {
        if (formAnswers == undefined || formAnswers.length == 0) {
            return;
        }
        var length = formAnswers.length;
        var rowsNeeded;
        var questionsRange = this.sheet.getRange(this.START_ONBOARDING_ANSWERS.row, this.START_ONBOARDING_ANSWERS.column, length, 2);
        rowsNeeded = Utils.checkSpaceColor(questionsRange);
        Logger.log("Rows needed: " + rowsNeeded);
        if (rowsNeeded > 0) {
            this.sheet.insertRows(this.START_ONBOARDING_ANSWERS.row, rowsNeeded);
            //TODO bruke offset her isteden
        }
        questionsRange.setValues(formAnswers);
    };
    /**
     * @returns the id of a candidate sheet, more on sheet ID: https://developers.google.com/sheets/api/guides/concepts
     */
    CandidateSheet.prototype.getId = function () {
        Logger.log(this.sheet.getSheetId());
        return this.sheet.getSheetId();
    };
    /**
     * @returns all information in a candidate sheet, this the the information that is copied to Metrics Historical Data
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
     * @returns a list with all formulas for the metrics sheet, so the metricssheet is linked to all candidate sheets
     */
    CandidateSheet.prototype.getFormulasMetrics = function () {
        var metrics = [[]];
        var counter = 0;
        var codeName = this.codeName;
        var id = this.getId();
        metrics[0][counter] = "=HYPERLINK(\"#gid=" + id + "\", \"" + codeName + "\")";
        counter++;
        metrics[0][counter] = "=HYPERLINK(\"" + CandidateFolder.getCandidateFolder(codeName).getUrl() + "\", \"Candidate folder\")";
        counter++;
        metrics[0][counter] = "='" + codeName + "'!" + this.ACTIVE_INACTIVE.a1Notation;
        counter++;
        metrics[0][counter] = "='" + codeName + "'!" + this.CANDIDATE_LEVEL.a1Notation;
        counter++;
        metrics[0][counter] = "='" + codeName + "'!" + this.CASE_STUDY.a1Notation;
        counter++;
        // MEETINGS
        //rowMetric[0][4].setNumberFormat("d/m/yyyy");
        //rowMetrichistorical[0][4].setNumberFormat("d/m/yyyy");
        metrics[0][counter] = "='" + codeName + "'!" + this.PREVIOUS_MEETING_DATE.a1Notation;
        counter++;
        //rowMetric[0][5].setNumberFormat("d/m/yyyy");
        //rowMetrichistorical[0][5].setNumberFormat("d/m/yyyy");
        metrics[0][counter] = "='" + codeName + "'!" + this.UPCOMING_MEETING_DATE.a1Notation;
        counter++;
        metrics[0][counter] = "='" + codeName + "'!" + this.NUMBER_COMPLETED_MEETINGS.a1Notation;
        counter++;
        metrics[0][counter] = "='" + codeName + "'!" + this.DAYS_SINCE_PREVIOUS_MEETING.a1Notation;
        counter++;
        // MALI MODEL
        metrics[0][counter] = "='" + codeName + "'!" + this.CLOSENESS.a1Notation;
        counter++;
        metrics[0][counter] = "='" + codeName + "'!" + this.RESOURCES.a1Notation;
        counter++;
        metrics[0][counter] = "='" + codeName + "'!" + this.DEDICATION.a1Notation;
        counter++;
        metrics[0][counter] = "='" + codeName + "'!" + this.REALISATION.a1Notation;
        counter++;
        metrics[0][counter] = "='" + codeName + "'!" + this.RESULT.a1Notation;
        counter++;
        metrics[0][counter] = "='" + codeName + "'!" + this.STAGNATION_STATUS.a1Notation;
        counter++;
        metrics[0][counter] = "='" + codeName + "'!" + this.LAST_UPDATED_MALI.a1Notation;
        counter++;
        return metrics;
    };
    /**
     * @returns the url of a candidate sheet
     */
    CandidateSheet.prototype.getUrl = function () {
        return MainSpreadsheet.getUrl() + "#gid=" + this.getId();
    };
    CandidateSheet.parentSheet = SpreadsheetApp.openById(properties.getProperty('CRM_MAIN_SHEET_ID'));
    CandidateSheet.templateSheet = SpreadsheetApp.openById(properties.getProperty('CANDIDATE_SHEET_TEMPLATE_ID')).getSheets()[0];
    return CandidateSheet;
}());
exports.CandidateSheet = CandidateSheet;
