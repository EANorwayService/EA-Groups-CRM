// Compiled using ts2gas 1.6.2 (TypeScript 3.5.2)
var exports = exports || {};
var module = module || { exports: exports };
/**
 * This function only copies the CRM main Sheet and the keys sheet, the rest of the content in the main folder needs to by moved manualy.
 * If CRM main Spreadhseet and Key Spreadsheet are copied manually properites for the script needs to also be changed manually.
 */
//import ss = GoogleAppsScript.Spreadsheet;
//import gas = GoogleAppsScript;
var properties = PropertiesService.getScriptProperties();
/**
* PUT IN VARIABLES HERE:
*/
/*
* Change name of new folder if you want, dont remove the quotationmarks:
*/
var NEW_FOLDER_NAME = 'CRM-system';
/*
* Add ID of parent-folder, between quotationmarks:
*/
var NEW_DRIVE_FOLDER_ID = '';
/*
/ Add ID of old CRM Main sheet:
*/
var OLD_CRM_MAIN_SPREADSHEET_ID = '';
/*
/ Add ID for old Key Sheet
*/
var OLD_KEY_SPREADHSEET_ID = '';
/**
* DON'T CHANGE THINGS BELOW:
*/
/**
* Starts the setup of the CRM system
*/
function startCopySystem() {
    //TODO try/catch
    copySystem();
    createOnOpenTriggers();
    createDailyUpdateTrigger();
    /**
    * Copies all spreadsheets and changes properties of spreadsheets in the code
    */
    function copySystem() {
        var parentFolder = DriveApp.getFolderById(NEW_DRIVE_FOLDER_ID);
        var crmMain = DriveApp.getFileById(OLD_CRM_MAIN_SPREADSHEET_ID).makeCopy("_CRM Main Copy", parentFolder);
        var key = DriveApp.getFileById(OLD_KEY_SPREADHSEET_ID).makeCopy("CRM Key Copy", parentFolder);
        // Set properties
        properties.setProperty('CRM_MAIN_SHEET_ID', crmMain.getId());
        properties.setProperty('KEY_SHEET_ID', key.getId());
        Logger.log(properties.getProperties());
    }
    /**
     * Creates onOpen-triggers for new spreadsheets in order to add the CRM-menu
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
    * Creates trigger wich update system once a day
    */
    function createDailyUpdateTrigger() {
        ScriptApp.newTrigger('updateEverything')
            .timeBased()
            .everyDays(1)
            .atHour(0)
            .create();
    }
}
