// Compiled using ts2gas 1.6.2 (TypeScript 3.5.2)
var exports = exports || {};
var module = module || { exports: exports };
//import gas = GoogleAppsScript;
//import{ MeetingInfo, Utils } from '../utils';
//import { MainSpreadsheet } from './MainSpreadsheet';
//import { CandidateSheet } from './CandidateSheet';
//import { MeetingNotes } from '../documents/documents';
var properties = PropertiesService.getScriptProperties();
var MeetingsSheet = /** @class */ (function () {
    function MeetingsSheet() {
    }
    Object.defineProperty(MeetingsSheet, "sheet", {
        get: function () {
            return MainSpreadsheet.getSheet('Meetings Historical Data');
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds information about a new meeting to the meetingssheet
     * @param snapshot snapshot from candidates sheet
     * @param date date of meeting
     * @param urlNotes url to notes
     */
    MeetingsSheet.addMeeting = function (snapshot, date, urlNotes) {
        var inputRow = this.sheet.getLastRow() + 1;
        this.sheet.getRange(inputRow, 4, 1, snapshot[0].length).setValues(snapshot);
        this.sheet.getRange(inputRow, 2).setValue(date).setNumberFormat("d/m/yyyy");
        this.sheet.getRange(inputRow, 3).setValue(urlNotes);
    };
    /**
     * @param codeName
     * @returns list of all meetings of given candidate
     */
    MeetingsSheet.getCandidateMeetings = function (codeName) {
        var meetingRange = this.sheet.getRange(this.START_ROW, this.START_COLUMN, this.sheet.getLastRow(), this.LAST_COLUMN_MEETING_INFO);
        var meetingInfo = meetingRange.getValues();
        var meetings = [];
        for (var y = 0; y < meetingInfo.length; y++) {
            if (String(meetingInfo[y][2]) == codeName) {
                Logger.log("codeName er korrekt!" + meetingInfo[y]);
                meetings.push(meetingInfo[y]);
                Logger.log("MeetingRow added: " + meetingInfo[y]);
            }
        }
        return meetings;
    };
    /**
     *
     * @param codeName
     * @returns previous and upcoming meeting for given candidate stored in the interface MeetingInfo from ./../utils.ts
     */
    MeetingsSheet.getMeetingInfo = function (codeName) {
        var earliestDate = new Date("1970/01/01");
        var previousMeeting = earliestDate;
        var latestDate = new Date("2050/01/01");
        var upcomingMeeting = latestDate;
        var todaysDate = new Date();
        var previousMeetingNotes;
        var upcomingMeetingNotes;
        var meetings = this.getCandidateMeetings(codeName);
        var meetingInfo;
        for (var y = 0; y < meetings.length; y++) {
            var meetingDate = meetings[y][0];
            Logger.log("meetingDate: " + meetingDate);
            Logger.log("Notes: " + meetings[y][1]);
            // Check if a meeting is today, but is already finished, assumes a meeting is finished if notes has actionables.
            // If todays meeting does not has actionables it is an umpcoming meeting.
            var actionables = void 0;
            if (Utils.isDocument(String(meetings[y][1]))) {
                actionables = new MeetingNotes(DocumentApp.openById(Utils.getIdFromUrl(String(meetings[y][1])))).getActionables();
            }
            else {
                actionables = undefined;
            }
            if (meetingDate.toDateString() === todaysDate.toDateString() && actionables != undefined && actionables.length > 0) {
                previousMeeting = meetingDate;
                previousMeetingNotes = String(meetings[y][1]);
            }
            else if ((meetingDate >= todaysDate && meetingDate < upcomingMeeting) || meetingDate.toDateString() === todaysDate.toDateString()) {
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
        Logger.log("Previous: " + meetingInfo.previousMeetingDate + "notes: " + meetingInfo.previousMeetingNotes);
        Logger.log("Upcoming: " + meetingInfo.upcomingMeetingDate + "notes: " + meetingInfo.upcomingMeetingNotes);
        return meetingInfo;
    };
    MeetingsSheet.START_ROW = 4;
    MeetingsSheet.START_COLUMN = 2;
    MeetingsSheet.LAST_COLUMN_MEETING_INFO = 19;
    return MeetingsSheet;
}());
exports.MeetingsSheet = MeetingsSheet;
