// Compiled using ts2gas 1.6.2 (TypeScript 3.5.2)
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
//import { MeetingInfo, Utils } from './utils';
//import { DashboardSheet } from './spreadsheets/DashboardSheet';
//import { DashboardHistoricalSheet } from './spreadsheets/DashboardHistoricalSheet';
//import gas = GoogleAppsScript;
//import { EvaluationFormSheet } from './spreadsheets/EvaluationFormSheet';
//import { OnboardingFormSheet } from './spreadsheets/OnboardingFormSheet';
/**
 * Function checks if any candidates have been set to active/inactive since last time this function ran.
 * Prints a message to user about update
 * Compares the list of active candidates in metrics historical to the list of active candidates in metrics.
 * Inactive candidates are not shown in metrics, and information about candidates set from inactive to active is added too metrics.
 */
function handleActiveInactive(showUi) {
    if (showUi === void 0) { showUi = true; }
    var ui = SpreadsheetApp.getUi();
    try {
        var newActiveCandidates = [];
        var allActiveCandidates = MetricsHistoricalSheet.getActiveCandidates();
        var currentActiveCandidates = MetricsSheet.getCandidates();
        Logger.log("All: " + allActiveCandidates + "Length: " + allActiveCandidates.length);
        for (var i = 0; i < allActiveCandidates.length; i++) {
            if (!Utils.valueInValues(String(allActiveCandidates[i]), currentActiveCandidates.getValues())) {
                var candidateInfo = MainSpreadsheet.getCandidateSheet(allActiveCandidates[i]).getFormulasMetrics();
                MetricsSheet.addCandidateInfo(candidateInfo);
                newActiveCandidates.push(allActiveCandidates[i]);
            }
        }
        var newInactiveCandidates = MetricsSheet.removeInactiveCandidates();
        Logger.log("New active: " + newActiveCandidates + " New inactive: " + newInactiveCandidates);
        var messageNewActive = void 0;
        var messageNewInactive = void 0;
        if (newActiveCandidates.length === 0) {
            messageNewActive = "No new candidates were set as active.\n";
        }
        else if (newActiveCandidates.length === 1) {
            messageNewActive = "Candidate with code name " + newActiveCandidates.join(', ') + " was set as active.\n";
        }
        else {
            messageNewActive = "Candidates with code names " + newActiveCandidates.join(', ') + " were set as active.\n";
        }
        if (newInactiveCandidates.length === 0) {
            messageNewInactive = 'No new candidates were set as inactive.\n';
        }
        else if (newInactiveCandidates.length === 1) {
            messageNewInactive = "Candidate with code name " + newInactiveCandidates.join(', ') + " was set as inactive.\n";
        }
        else {
            messageNewInactive = "Candidates with code names " + newInactiveCandidates.join(', ') + " were set as inactive.\n";
        }
        if (showUi) {
            ui.alert(messageNewActive + ' ' + messageNewInactive);
        }
        else {
            Logger.log(messageNewActive + ' ' + messageNewInactive);
        }
    }
    catch (e) {
        var message = e.message + "\n\nHere is more information if you think something is wrong with code: " + e.stack;
        if (showUi) {
            ui.alert(message);
        }
        else {
            Logger.log(message);
        }
    }
}
/**
 * Adds new candidates from key sheet
 * Creates new candidate sheet, new candidate folder and adds candiate to metrics.
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
            messageNewCandidates = "Candidate with code name " + newCandidates.join(', ') + " was updated.\n";
        }
        else {
            messageNewCandidates = "Candidates with code names " + newCandidates.join(', ') + " were updated.\n";
        }
        if (showUi) {
            ui.alert(messageNewCandidates);
        }
        else {
            Logger.log(messageNewCandidates);
        }
    }
    catch (e) {
        //TODO: Send mail with errors to service email. Must be easy to change service mail.
        ui.alert(e.message + "\n\nHere is more information if you think something is wrong with code: " + e.stack);
    }
    finally {
        var copyFailure = void 0;
        if ((copyFailure = MainSpreadsheet.getSheet("Copy of Candidate sheet template")) != null) {
            MainSpreadsheet.deleteSheet(copyFailure);
        }
    }
}
/**
 * EA Norway has a form they use for evaluation after each meeting. This form is linked to a sheet in the Key spreadsheet.
 * This function gets the answers for each candidate and fills the answers into the candidate sheet
 */
function handleFillEvaluationAnswers() {
    try {
        var allActiveCandidates = MetricsHistoricalSheet.getActiveCandidates();
        for (var i = 0; i < allActiveCandidates.length; i++) {
            var answers = EvaluationFormSheet.getAnswers(allActiveCandidates[i]);
            MainSpreadsheet.getCandidateSheet(allActiveCandidates[i]).fillEvaluationAnswers(answers);
        }
    }
    catch (e) {
        Logger.log(e.message + "\n\nHere is more information if you think something is wrong with code: " + e.stack);
    }
}
/**
 * EA Norway has a form they use for each candidate before the first meeting with that candidate to get som basic information. This form is linked to a sheet in the Key spreadsheet.
 * This function gets the answers for each candidate and fills the answers into the candidate sheet
 */
function handleFillOnboardingForm() {
    try {
        var allActiveCandidates = MetricsHistoricalSheet.getActiveCandidates();
        Logger.log("All active candidate: " + allActiveCandidates + " length: " + allActiveCandidates.length);
        for (var i = 0; i < allActiveCandidates.length; i++) {
            var answers = OnboardingFormSheet.getAnswers(allActiveCandidates[i]);
            MainSpreadsheet.getCandidateSheet(allActiveCandidates[i]).fillOnboardingAnswers(answers);
        }
    }
    catch (e) {
        Logger.log(e.message + "\n\nHere is more information if you think something is wrong with code: " + e.stack);
    }
}
/**
 * When a new or old meeting as added through the crm-menu.
 * @param dateIn Date of meeting
 * @param urlNotes Notes if meeting already has meeting notes, null if no notes exist
 * If meeting doesn't already have existing meeting note new notes are created.
 */
function handleMeeting(dateIn, urlNotes) {
    var ui;
    try {
        ui = SpreadsheetApp.getUi();
        Logger.log("DateIn: " + dateIn + " Type: " + typeof (dateIn));
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
            Logger.log("New meeting notes are beeing made");
            urlNotes = MeetingNotes.newMeetingNotes(codeName, date, meetingsFolder).getUrl();
        }
        MeetingsSheet.addMeeting(snapshotMetrics, date, urlNotes);
        // Update previous and upcoming meeting in candidateSheet from meetingsSheet
        meetingInfo = MeetingsSheet.getMeetingInfo(codeName);
        candidateSheet.addMeetingInfo(meetingInfo);
        Logger.log("New meeting for " + codeName + " Date in and date: " + dateIn + " " + date.toISOString());
        SpreadsheetApp.getUi().alert('New meeting created for ' + codeName + ' ' + dateIn);
    }
    catch (e) {
        ui.alert(e.message + "\n\nHere is more information if you think something is wrong with code: " + e.stack);
    }
}
/**
 * Takes a snapshot of the Dashboard and adds it to Dashboard Historical Data
 */
function snapshotDashboard() {
    var snapshot = DashboardSheet.getSnapshot();
    DashboardHistoricalSheet.addSnapshot(snapshot);
}
/**
 * This function is run every night to make sure system is updated
 * Adds new candidates, checks for new active or inactive candidates,
 * updates meeting notes of all candidate sheets and takes snapshot of all candidate sheets and of the dashboard
 */
function updateEverything() {
    var candidates;
    var candidateSheet;
    var meetingInfo;
    var snapshot;
    try {
        handleAddCandidates(false);
        handleActiveInactive(false);
        // Extra: Remove backslashes if you want this function
        //handleFillEvaluationAnswers();
        snapshotDashboard();
        var allActiveCandidates = MetricsHistoricalSheet.getActiveCandidates();
        Logger.log("ALl active: " + allActiveCandidates);
        for (var i = 0; i < allActiveCandidates.length; i++) {
            meetingInfo = MeetingsSheet.getMeetingInfo(allActiveCandidates[i]);
            candidateSheet = MainSpreadsheet.getCandidateSheet(allActiveCandidates[i]);
            candidateSheet.addMeetingInfo(meetingInfo);
        }
    }
    catch (e) {
        Logger.log(e.message + "\n\nHere is more information if you think something is wrong with code: " + e.stack);
    }
}
