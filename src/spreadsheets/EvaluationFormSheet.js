// Compiled using ts2gas 1.6.2 (TypeScript 3.5.2)
var exports = exports || {};
var module = module || { exports: exports };
//import { ElementPositionSheet } from "../utils";
//import { KeySheet } from "./KeySheet";
//import gas = GoogleAppsScript;
/**
 * This sheet is stored in the key sheet because onboarding sheet is stored there
 * EA Norway has a form they use for evaluation after each meeting. This form is linked to a sheet in the Key spreadsheet.
 */
var properties = PropertiesService.getScriptProperties();
var EvaluationFormSheet = /** @class */ (function () {
    function EvaluationFormSheet() {
    }
    /**
     * Gets all answers answers and questions from the form for given candidate(not for all candidates)
     * @param codeName
     */
    EvaluationFormSheet.getAnswers = function (codeName) {
        if (this.sheet == null) {
            throw new Error("Can't find sheet with name " + this.nameOfSheet + "\nPlease change the name of the correct sheet, or change the name of the sheet in the code\nIf you do not have an onboarding form sheet remove the function call.");
        }
        var formAnswers = [];
        var allDataForm = this.sheet.getDataRange().getValues();
        Logger.log("Denne printer");
        Logger.log("Length allDataForm: " + allDataForm.length);
        for (var i = 0; i < allDataForm.length; i++) {
            if (String(allDataForm[i][this.CODENAMES.column - 1]).localeCompare(codeName) > 0) {
                Logger.log("Length allDataForm[i]: " + allDataForm.length);
                for (var y = 0; y < allDataForm[i].length; y++) {
                    formAnswers[y] = [[allDataForm[0][y + 2]], [allDataForm[i][y + 2]]];
                }
            }
        }
        if (formAnswers == undefined || formAnswers.length == 0) {
            Logger.log("Can't find matching code name for user in answers from form\nCode name: " + codeName);
            return null;
        }
        Logger.log("Answers: " + formAnswers);
        return formAnswers;
    };
    EvaluationFormSheet.nameOfSheet = 'Evaluation Form';
    EvaluationFormSheet.sheet = SpreadsheetApp.openById(properties.getProperty('KEY_SHEET_ID')).getSheetByName(EvaluationFormSheet.nameOfSheet);
    EvaluationFormSheet.START = { row: 1, column: 1, a1Notation: 'A1' };
    EvaluationFormSheet.CODENAMES = { row: 2, column: 2, a1Notation: 'B2' };
    return EvaluationFormSheet;
}());
exports.EvaluationFormSheet = EvaluationFormSheet;
