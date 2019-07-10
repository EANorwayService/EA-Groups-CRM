// Compiled using ts2gas 1.6.2 (TypeScript 3.5.2)
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
    /**
     * Method for creating new folder for a candidate
     * @param codeName
     * @returns candidate folder
     */
    CandidateFolder.newCandidateFolder = function (codeName) {
        new CandidateFolder(CandidateFolder.AllCandidatesFolder.createFolder(codeName));
    };
    // This should not be here, but in a "all-candidate-folders"-folder
    CandidateFolder.getCandidateFolder = function (codeName) {
        var folderIter = CandidateFolder.AllCandidatesFolder.getFoldersByName(codeName);
        Logger.log("Candidate fodler: " + folderIter);
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
            Logger.log("There are multiple folders with candidate name: " + codeName + "Using first folder.");
        }
        else if (folderCounter === 0) {
            Logger.log("No candidate folder with codename: " + codeName);
            //TODO throw error
            return null;
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
    CandidateFolder.AllCandidatesFolder = DriveApp.getFolderById(properties.getProperty('CANDIDATES_FOLDER_ID'));
    return CandidateFolder;
}());
exports.CandidateFolder = CandidateFolder;
