// Compiled using ts2gas 1.6.2 (TypeScript 3.5.2)
var exports = exports || {};
var module = module || { exports: exports };
/**
 * This sheet is stored in the key sheet because it contains sensetive information
 * EA Norway has a form they use for each candidate before the first meeting with that candidate to get som basic information. This form is linked to a sheet in the Key spreadsheet.
 */
//import { ElementPositionSheet } from "../utils";
//import { KeySheet } from "./KeySheet";
//import gas = GoogleAppsScript;
var properties = PropertiesService.getScriptProperties();
var OnboardingFormSheet = /** @class */ (function () {
    function OnboardingFormSheet() {
    }
    /**
     * Gets all answers answers and questions from the form for given candidate(not for all candidates)
     * @param codeName
     */
    OnboardingFormSheet.getAnswers = function (codeName) {
        if (this.sheet == null) {
            Logger.log("error");
            throw new Error("Can't find sheet with name " + this.nameOfSheet + "\nPlease change the name of the correct sheet, or change the name of the sheet in the code\nIf you do not have an onboarding form sheet remove the function call.");
        }
        var formAnswers = [];
        var allDataForm = this.sheet.getDataRange().getValues();
        var email = KeySheet.getEmail(codeName);
        Logger.log("Email: " + email + "type: " + typeof (email));
        if (email == undefined) {
            Logger.log("Can't find email for candidate in keys sheet\nCode name: " + codeName);
        }
        for (var i = 0; i < allDataForm.length; i++) {
            Logger.log("[i][2]: " + allDataForm[i][2]);
            if (String(allDataForm[i][2]).localeCompare(codeName) > 0) {
                for (var y = 0; y < allDataForm[i].length; y++) {
                    formAnswers[y] = [[allDataForm[0][y + 3]], [allDataForm[i][y + 3]]];
                }
            }
        }
        if (formAnswers == undefined || formAnswers.length == 0) {
            Logger.log("Can't find matching mail for user in answers from form\nCode name: " + codeName);
            return;
        }
        return formAnswers;
    };
    OnboardingFormSheet.nameOfSheet = 'Onboarding Form';
    OnboardingFormSheet.sheet = SpreadsheetApp.openById(properties.getProperty('KEY_SHEET_ID')).getSheetByName(OnboardingFormSheet.nameOfSheet);
    OnboardingFormSheet.START = { row: 1, column: 1, a1Notation: 'A1' };
    OnboardingFormSheet.CODENAMES = { row: 2, column: 2, a1Notation: 'B2' };
    OnboardingFormSheet.EMAIL = { row: 2, column: 11, a1Notation: 'B11' };
    return OnboardingFormSheet;
}());
exports.OnboardingFormSheet = OnboardingFormSheet;
