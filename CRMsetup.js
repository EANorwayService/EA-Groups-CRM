// Compiled using ts2gas 1.6.2 (TypeScript 3.5.2)
var exports = exports || {};
var module = module || { exports: exports };
//import {  Utils} from '../utils';
//import ss = GoogleAppsScript.Spreadsheet;
//import gas = GoogleAppsScript;
var properties = PropertiesService.getScriptProperties();
/**
* PUT IN VARIABLES HERE:
*/
/*
/ Add ID for list of members, between quotationmarks Example for testing: 1PEZhv7JwFeFfu8oeloPuxFmHMNCop2YdguYI1G0g4io:
*/
var MEMBERLIST_ID = '1PEZhv7JwFeFfu8oeloPuxFmHMNCop2YdguYI1G0g4io';
/*
* Change name of new folder if you want, dont remove the quotationmarks:
*/
var NEW_FOLDER_NAME = 'CRM-system 12.07';
/*
* Add ID of parent-folder, between quotationmarks:
*/
var DRIVE_FOLDER_ID = '1RGS0JBGgrdnAb6EDvLQoMoP0EgKrADBw';
/**
* DON'T CHANGE THINGS BELOW:
*/
var TEMPLATE_CRM_MAIN_SHEET_ID = '1dkX1rUVAH9smI4sx-r6JbO5yd8hLVSnnPjU0UiF1QzI';
var TEMPLATE_KEY_SHEET_ID = '1llWA-T9lEfhWqSKTlUjgzxpsvlCI8NJez2HtICDb8P8';
var TEMPLATE_CANDIDATE_SHEET_ID = '1Fzyjb04PIoH_Tks-G6NeueFrmfzkwAZcELKm3HW8_zg';
var TEMPLATE_MEETING_NOTES_ID = '118UGZIYdiEc4keRPc_kXc6K7sFFGgXfZ0jr_3I4zVfk';
/**
* Starts the setup of the CRM system
*/
function SetUpCRMSystem() {
    //TODO try/catch
    try {
        copyTemplates();
        createOnOpenTriggers();
        createDailyDashboardTrigger();
    }
    catch (e) {
        Logger.log(e.message + "\n\nHere is more information if you think something is wrong with code: " + e.stack);
    }
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
        Logger.log(properties.getProperties());
        // Add information from memberlist to key
        // TODO: How many rows and columns must be added to document?
        var keySheet = SpreadsheetApp.open(key).getSheetByName('key');
        var memberInfo = memberSheet.getDataRange().getValues();
        keySheet.getRange(2, 3, memberInfo.length, memberInfo[0].length).setValues(memberInfo);
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
            //TODO: Send mail with errors to service email. Must be easy to change service mail.
            Logger.log(e.message + e.stack);
        }
    }
    /*
    * Creates trigger wich takes a snapshot of the dashboard once a day
    */
    function createDailyDashboardTrigger() {
        ScriptApp.newTrigger('updateEverything')
            .timeBased()
            .everyDays(1)
            .atHour(0)
            .create();
    }
}
