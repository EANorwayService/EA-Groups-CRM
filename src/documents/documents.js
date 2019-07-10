// Compiled using ts2gas 1.6.2 (TypeScript 3.5.2)
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
    ;
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
            Logger.log('No table of actionables found in document: %s.', this.doc.getName());
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
    MeetingNotes.notesTemplate = DriveApp.getFileById(properties.getProperty('MEETING_NOTES_TEMPLATE_ID'));
    return MeetingNotes;
}());
exports.MeetingNotes = MeetingNotes;
