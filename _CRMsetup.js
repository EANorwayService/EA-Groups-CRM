// Compiled using ts2gas 3.4.4 (TypeScript 3.5.3)
var exports = exports || {};
var module = module || { exports: exports };
//import {  Utils} from './utils';
//import ss = GoogleAppsScript.Spreadsheet;
//import gas = GoogleAppsScript;
var properties = PropertiesService.getScriptProperties();
/**
* PUT IN VARIABLES HERE:
*/
/*
/ Add ID for list of members, between quotationmarks Example for testing: 1PEZhv7JwFeFfu8oeloPuxFmHMNCop2YdguYI1G0g4io:
*/
var MEMBERLIST_ID = '';
/*
* Change name of new folder if you want, dont remove the quotationmarks:
*/
var NEW_FOLDER_NAME = 'CRM-system';
/*
* Add ID of parent-folder, between quotationmarks:
*/
var DRIVE_FOLDER_ID = '';
/**
* DON'T CHANGE THINGS BELOW:
*/
var TEMPLATE_CRM_MAIN_SHEET_ID = '1jHcLRe_u5qacJKom-Py4o6qsOHTMuXcYjMTujQu_eFk';
var TEMPLATE_KEY_SHEET_ID = '1sGVYo8MRPjJQQFl5Yngj8KPC_7XJOTemWGhFTEb3pMU';
var TEMPLATE_CANDIDATE_SHEET_ID = '1b4WRnU2IZBxK9s-8qqnfo7fJ8QyfFejTEDMN6COVyk0';
var TEMPLATE_MEETING_NOTES_ID = '1CRMbetDzu3xpe6vnUUEDENb0foI_yH5crP_lnycOOpQ';
/**
* Starts the setup of the CRM system
*/
function SetUpCRMSystem() {
    copyTemplates();
    createOnOpenTriggers();
    createUpdateTriggers();
    /**
    * Copies all templates to new folder for new verion of the CRM system
    *
    */
    function copyTemplates() {
        var parentFolder = DriveApp.getFolderById(DRIVE_FOLDER_ID).createFolder(NEW_FOLDER_NAME);
        var crmMain = DriveApp.getFileById(TEMPLATE_CRM_MAIN_SHEET_ID).makeCopy("_CRM Main", parentFolder);
        var key = DriveApp.getFileById(TEMPLATE_KEY_SHEET_ID).makeCopy("CRM Key", parentFolder);
        var memberSheet = SpreadsheetApp.openById(MEMBERLIST_ID);
        var candidateFolders = parentFolder.createFolder("CRM Candidate Folders");
        var templateFolder = parentFolder.createFolder("CRM Templates");
        var candidateSheetTemplate = DriveApp.getFileById(TEMPLATE_CANDIDATE_SHEET_ID).makeCopy("CRM Template Candidate Sheet", templateFolder);
        var meetingNotesTemplate = DriveApp.getFileById(TEMPLATE_MEETING_NOTES_ID).makeCopy("CRM Template Meeting Notes", templateFolder);
        // Set properties
        properties.setProperty('CRM_MAIN_SHEET_ID', crmMain.getId());
        properties.setProperty('KEY_SHEET_ID', key.getId());
        properties.setProperty('CANDIDATES_FOLDER_ID', candidateFolders.getId());
        properties.setProperty('CANDIDATE_SHEET_TEMPLATE_ID', candidateSheetTemplate.getId());
        properties.setProperty('MEETING_NOTES_TEMPLATE_ID', meetingNotesTemplate.getId());
        console.log("Properties are now:" + properties.getProperties());
        // Add information from memberlist to key
        // HMemberinfo has to be 2d array to use gas.Spreadsheet.Range.setValues().
        var keySheet = SpreadsheetApp.open(key).getSheetByName('key');
        var memberInfo = memberSheet.getDataRange().getValues();
        keySheet.getRange(2, 3, memberInfo.length, memberInfo[0].length).setValues(memberInfo);
    }
}
/**
* Creates onOpen-triggers for spreadsheets in order to add the CRM-menu
*/
function createOnOpenTriggers() {
    try {
        ScriptApp.newTrigger('createCRMMenu')
            .forSpreadsheet(properties.getProperty('CRM_MAIN_SHEET_ID'))
            .onOpen()
            .create();
        ScriptApp.newTrigger('createKeyMenu')
            .forSpreadsheet(properties.getProperty('KEY_SHEET_ID'))
            .onOpen()
            .create();
    }
    catch (e) {
        console.error(e.message + e.stack);
    }
}
exports.createOnOpenTriggers = createOnOpenTriggers;
/*
* Creates trigger wich takes a snapshot of the dashboard once a day
*/
function createUpdateTriggers() {
    ScriptApp.newTrigger('updateEverything')
        .timeBased()
        .everyDays(1)
        .atHour(5)
        .create();
    ScriptApp.newTrigger('weeklySnapshot')
        .timeBased()
        .onWeekDay(ScriptApp.WeekDay.MONDAY)
        .atHour(0)
        .create();
}
exports.createUpdateTriggers = createUpdateTriggers;
