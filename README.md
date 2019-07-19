# Table of content
1. [About the CRM system](#aboutCRM)
1. [Set up the CRM system](#setupCRM)
1. [Use the CRM system](#useCRM)
1. [Troubleshoot](#troubleshoot)
1. [FAQ](#FAQ)
1. [Extra](#extra)


# About the CRM system <a name="aboutCRM"></a>

This is a CRM system in Google App Script developed by Effective Altruism Norway.
The goal of this CRM system is to streamline 1-1 meetings. Key features of the system:

1. Uses spreadsheets and documents in Google Suite.
1. Makes it easy to plan 1:1 meetings for career guiding etc.
1. Makes it easy to adjust to your own needs.
1. Let's you see how well you're succeeding at your metrics.

### Versions
There are currently two versions of this code. One in Google App Script and one in TypeScript. This folder contains the code in App Script which makes it easy to copy/paste code directly into Google App Script. See [Setup of CRM](#setupCRM) for tutorial. 

Here is a [link](https://github.com/EANorgeService/CRMsetup) for the code in TypeScript, use this for local development and use [clasp](https://github.com/google/clasp/) to upload code to Google App Script. 


### Folder structure

![Structure of folders](images/folderStructure.png) <br/>
The CRM system consists of two spreadsheets, a folder with templates and a folder for each candidate. <br/>

![Structure of candidate folder](images/folderStructureCandidates.png)
Inside the folder "CRM Candidate Folders" there is one folder for each candidate. In this example the candidates have code names. <br/> 

### Candidate folder

![Candidate folder](images/folderStructureCandidateFolder.png) <br/> 
The candidate folders have a folder with all meetings. There is a link to the candiate folder in the Metrics sheet and in the candidate sheets. 

### Meetings folder
![Folder with meeting notes for each candidate](images/meetingsFolder.png) <br/> 
Notes for all meetings are saved in the meetings folder for each candidate. These notes are created automatically when a new meeting is planned.

### Meeting notes
![Notes for a planned meeting](images/newMeetingDoc.png)
This is an example of how meeting notes can look. If you want to change template for meeting notes you can do it after the system has been set up, see insturctions in the [faq](#faq). 

### Key spreadsheet
This is one of two spreadsheets in the CRM system. This spreadsheet contains sensitive information of candidates and should be stored in a safe place where only people who need access have access to it. 
It consists of the Key sheet, but other sheets with sensistive information like sheets linked to forms could also be stored here.
EA Norway has two additional sheets here, "Onboarding Form" and "Evaluation Form". 

#### Key sheet
![The Key sheet](images/sheetKey.png)
This sheet makes it possible to give candidates code names and not add their actual names to the system. However, if you don’t want to use code names, you can use their actual names in the code name column. 
#### Evaluation Form 
This sheet is specific for EA Norway and contains the answers from the meeting evaluation form. <br/>
This sheet will not be added automatically to the system. There is a feature for adding information from this sheet to the candidate sheet, see [Extra](#extra) on how to add this feature.

#### Onboarding Form 
This sheet is specific for EA Norway and contains the answers from an onboarding form. <br/>
This sheet will not be added automatically to the system. There is a feature for adding information from this sheet to the candidate sheet, see [Extra](#extra) on how to add this feature.


### CRM Main spreadsheet
The _CRM Main spreadsheet gives you an overview of results from your 1:1 meetings.
With some basic understanding of spreadsheets you can add your own measurements of success.

#### Dashboard
![Dashboard sheet](images/sheetDashboard.png)
This sheet contains aggregated data for all active candidates. All information is updated automatically when it is changed in the candidate sheets. 

#### Metrics
![Metrics sheet](images/sheetMetrics.png)
This sheet contains information on all members, and can return data on only active candidates or all candidates. By using filters it is possible to only view data from active candidates. All information is added automatically when a candidate is added.

#### Planner
![Planner sheet](images/sheetPlanner.png)
This sheet shows previous meeting and next planned meeting of each candidate, this information can also be found in the candidate sheets.

#### Candidate sheets
![Example of candidate sheet](images/sheetCandidates.png)
Each candidate has their own candidate sheet, a new sheet is created every time a candidate is added. This is an example for a candidate sheet for a candidate with a code name. These sheets are automatically created when a candidate is added. 

#### Dashboard Historical Data (hidden in spreadsheet)
![Dashboard Historical Data](images/sheetDashboardHistoricalData.png)
This sheet stores historical data from the Dashboard sheet, by adding a snapshot of all information from the Dashboard sheet once a week.

#### Meetings Historical Data (hidden in spreadsheet)
![Meetings sheet](images/sheetMeetingsHist.png)
This sheet saves information from all planned meetings, updates automatically when a meeting is added. 

#### Metrics Historical Data (hidden in spreadsheet)
![Metrics Historical Date](images/sheetMetricsHistoricalData.png)
This sheet saves historical information on all candidates. By automatically adding a snapshot of all information from each candidate sheet once a week.


# Set up the CRM system <a name="setupCRM"></a>

### Needed to set up CRM system
1. Access to CRMsetup [folder](https://github.com/EANorgeService/CRMsetup) in GitHub.
1. Access to CRMtemplates [folder](https://drive.google.com/drive/folders/1fcHDHTCHAwwFkLSWX1SwQ-gZExy5NBI5?usp=sharing) in Google Drive.
1. Access to the Google Drive Folder where you want your CRM system.
1. Access to a list of all your members, or another list including the people you want as candidates in you system. You can later choose who you want to include from the given list. From now on this list will be called the member list.

### Alternative 1: Local development
If you don't want to change the code, or your not used to the terminal skip to the next section.
Do this if you want to change the code or you know the basics of using a terminal, else the easiest way is to copy/paste.
To download the code for GitHub use [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
Use [clasp](https://github.com/google/clasp/) to uploade code to Google App Script. Clasp also makes it possible to write code in typescript. You have to enable API [here](https://script.google.com/home/usersettings) before you can use clasp.

### Alternative 2: Copy/paste code to Google App Script
If you haven't used a terminal before the easiest way to transfer the code to Google App Script is to copy/paste the code from GitHub to Google App Script.

#### Create a new project on script.google.com
Log in with the correct account to google and go to Google App Script: script.google.com.
Make a new project by clicking "New Script", and give the new project a descriptive name for instance CRMsystem (name of file should not have spaces).

![How to make a new project](images/newProject.png)

Open the project and make one additional script inside the project, you should now have two scripts. Gives these the names bundle and CRMsetup. They will automatically get the ending ".gs".

![How to make a new script](images/newScript.png)

Make two additional HTML files and give these files the same names datePickerNewMeeting and datePickerOldMeeting. They will automatically get the ending.html. 

![How to make a new HTML file](images/newHTMLFile.png)

You should now have two scripts(.gs) and two html files(.html):

![Pasted code in Google Apps Script](images/readyScript.png)

Delete all default code from both script and both html files.

![Delete text from scripts](images/deleteTextScript.png)

![Delete text from scripts](images/deleteText.png)

#### Copy code from GitHub
Open these files on [GitHub](https://github.com/EANorgeService/CRMsetup): bundle.js, CRMsetup.js, datePickerNewMeeting.html and datePickerOldMeeting.html, copy all code from them and paste code to the two different scripts and two different html files you just made in Google App Script.

![Files to copy from GitHub](images/filesGitHub.png)

#### Paste all code to the Google App Script edito
Be sure to paste code from GitHub in to two different scripts and two different html files, check that you got all code.

Save both scripts and both html files.

### Setup
After copying and pasting all code from GitHub to Google App Script the CRM-system can be set up in a destination folder on your google drive.

### Step 1: Enable Advanced Drive Service
Open the project you just made on [script.google.com] click **Resources > Advanced Google Services** scroll down to **Drive** and enable it. <br/>
![Advanced Google Services](images/advancedService.png)

### Step 2: Add ID for file with list of members to CRMsetup.gs
Find or make a google spreadsheet with a list of your community members. You can later choose from this list who you want to add as candidates to the system. Be careful to not include the last part of this URL. <br />
[This is an example](https://docs.google.com/spreadsheets/d/1PEZhv7JwFeFfu8oeloPuxFmHMNCop2YdguYI1G0g4io/edit?usp=sharing) of such a list, if your only trying the system you can use this list as you member list. See this example for how your memberlist should be strucutred. The script assumes that you memeber list starts in cell A1. See more information on the key sheet here: [About CRM](#aboutCRM). 

The script will copy all information in the memberlist and add it to the key sheet. 
Find the ID of the list, do not include the backslashes. 

![How to find ID for member list](images/memberlistId.png)

Go to the script called CRMsetup, and add the ID to **MEMBERLIST_ID**, add the ID between quotationmarks.

![Where to add ID for list of members](images/addMemberListId.png)

Remember to save the script and not delete the quotationmarks.

### Step 3: Add ID for destination folder to CRMsetup.gs
The CRM system should be set up in a secure location and has to be in a Google Drive folder you have access to. Decide where you want the CRM-system to be set up, and find the ID of that Google Drive folder. Copy this ID, do not include the backslashes.

![How to find ID for folder](images/teamDriveId.png)

Go to the script called setUpCRM.gs, and add the ID to **DRIVE_FOLDER_ID**, add the ID between quotationmarks, do not delete the quotationmarks.

![Where to add folder ID](images/addFolderId.png)

Remember to save the script and do not delete the quotationmarks.

### Step 4: Try to run setupCRM() function
Be sure all scripts are saved.
When you've added ID for destination folder and for list of members make sure you are in the setUpCRM.gs file and click **Run > Run function > setUpCRM**
NB: you need to review [authorization](https://developers.google.com/apps-script/guides/services/advanced), see picture below.
If you can not find the function setupCRM() you might be in the wrong file.
The CRM system is not a published app nor is it verified by google, therefore google needs permission to run the app. More information [here](https://developers.google.com/apps-script/guides/services/advanced).

![Run setUpCRM function](images/setUpFunction.png)

This might pop up:

![Authorization](images/authorizationRequired.png)

Click review permission and allow.

![Allow authorization](images/authorizationAllow.png)

Now google will tell you that the CRM system is not an app verified by them

![App is not verified by google](images/errorNotVerified.png)

Click **Advanced > Go to CRM(unsafe)**

### Step 5: Run setUpCRM() function again
After reviewing permission and allowing the CRM system access and approving that you know and trust the app/developer you need to run the setUpCRM function again.

Make sure you are in the setUpCRM.gs file and click **Run > Run function > setUpCRM**.
If you can not find the function **setupCRM()** you might be in the wrong file.

![Run setUpCRM function](images/setUpFunction.png)

If there are multiple crm-versions in the destination folder now be sure to keep the newest one and remove all other version, the code will not work on these. 

### step 6: Move Key Spreadsheet to a secure location
If your system uses code names and you don't want everyone to have access to candidates real name you can move the key spreadsheet to a more secure location. Only people with access to this sheet can run the function "add candidates". Everyone who has access to the actual code can also access data from the Key spreadsheet. 

# Use the CRM system <a name="useCRM"></a>

### Add candidates
Open your destination folder, the folder with the CRM system, and go to the Key spreadsheet. It is possible to set up the system with code names of candidates, instead of their real names. A good tool for finding code names is www.codenamegenerator.com. If you do not wish to use code names, you can use the candidates' real names in the code name-column of the Key sheet.
After you have added code names click **CRM > Update candidates**. Only members/candidates with code names will be added to the system. Script assumes values in column B(from cell B3) are code names. If you wish to set up the system with candidates real names add their real names to column B. 

![Example of codenames](images/keySheet.png)

In this example Pernille and Kari would not be added as candidates since they don't have a code name(no value in column B).
After you have added code names click **CRM > Add candidates**. Only members/candidates with code names will be added to the system.

![Update candidates](images/addCandidates.png)

When candidates are added they get their own folder in the folder "CRM Candidate Folders". They also get their own sheet in the _CRM Main spreadsheet, and their information is linked in the Metrics sheet. The names of the candidate folders and candidate sheets can only be changed if the code name is changed everywhere(inlcuding the Metrics Historical Data sheet and the Meetings Historical Data sheet).

### Add metrics for candidates 
These are the metrics EA Norway use and they are added to each candidate sheet. See the [guide for the code](https://github.com/EANorwayService/CRM_setup_advanced#aboutCode) if you want to change the metrics. 
![Metrics candidate sheet](images/metricsCandidate.png)
Metrics with white background should be changed in the candidate sheets. Metrics with grey background are added automatically. 

### Plan meetings and create meeting notes
Go to the candidate sheet of the candidate you want to plan a meeting with. 

![Plan new meeting](images/addMeeting.png)

If you already have existing meeting notes choose "Add old meeting". Add the date and url to your existing meeting notes.  
If you choose "plan new meeting", meeting notes are created automatically from the meeting notes template and added to the candidate folder. 
To replace the meeting notes template see instructions in the [faq](#faq). Information about meeting will be added to the hidden sheet "Meetings Historical Data".
### Add actionables to meeting notes
If your meeting notes have a table, the code will assume that the last table in notes is actionables. This is how it looks in exisitng template: <br/>
![Actionables in meeting notes](images/actionablesMeetingNotes.png) <br/>
Actionables from previous meeting will be added to the candidate sheet and to the notes of the upcoming meeting (added on the day of the upcoming meeting). 

### Set candidates as active/inactive
To set a candidate as inactive change the variable in the candidate sheet.  
![Varibale active inactive in the candidate sheet](images/statusActiveInactive.png) <br/>
Change status of candidate <br/>
![Choose active or inactive](images/activeInactive.png) <br/>
When system is updated, the sheet of the candidate will be hidden. When a candidate is inactive their information will not be counted in Dashboard, only their meetings are still counted. 
To set a candidate back to active unhide the sheet and set the candidate back to active. If you only unhide the sheet the sheet will be hidden again when system updates. 

### Update system
To update everything in the system(this is unfortunately not done automatically). Update everything check for new inactive candidates, fills the next five meetings in dashboard, fills previous meeting and upcoming meeting in candidates sheet and check for new candiates to add. 
Update everything is run automatically once a day. <br/>
![Update everything in system](images/updateEverything.png)

# Troubleshoot <a name="troubleshoot"></a>

### No items with the given ID could be found

![Error if IDs are wrong](images/errorNoIds.png)

This error means that one of the id's are wrong. It is probably the ID for the destination folder that is missing.

### Invalid argument: parent
![Error if the folder is not a folder](images/errorNotFolder.png)

This means that an ID for a folder is the ID for something else than a folder. Check again that the ID for the destination folder is correct.

### Access denied DriveApp
![Error if access is missing](images/errorWrongMemberlist.png)

This means that you don't have access to, or that the ID to a file is wrong. Check again that the Id for the member list is correct and that you have access to all template files.

### We're sorry a server error occurred
![Error if a file ID is missing](images/errorNoMemberlist.png)

This probably means that an ID for a file is missing, check again that you added the ID for the member list.

### It is not the member list ID and not the destination folder ID!
1. Double check that you use the correct google account when *editing* the scripts, it says what account you use in the top right corner.
1. The code was not copied correctly from GitHub.
1. There is a mistake in the template folder :( Contact EA Norway
1. There is a mistake in the code :( Contact EA Norway

# FAQ <a name="FAQ"></a>

### What do I need to know to use alternative 1 of set up?
Alternative 1 is not difficult, but it takes longer if you have never used a terminal before and probably requieres some googleing. 
If you are going to use this system, alternative 1 is recomended, it makes it easier to make your own changes later. 
Here is a [guide](https://github.com/EANorwayService/CRM_setup_advanced) for alternative 1.

### How to change meeting notes template
If you replace the whole file you also need to update the file id in the code, if you only replace the content of the existing file you do not have to change anything in the code.
The meeting notes template can be changed by going to your CRM folder and click <br/>
**CRM Templates > CRM Template Meeting Notes**. <br/>

### Can I change the names of spreadsheets or sheets?
The names of the spreadsheets *can be changed*. Unfortunately the names of the sheets within the spreadsheets *can not be changed* without also changing them in the code. Also, the folders with the code names of each candidate *can not be changed*.

### Can I remove, add or change something in sheets?
The code does not know what your sheets look like if you do changes. If you change something in a sheet you need to change this in the code if it is a part that is affected by the code. Here is a guide on how to do it: https://github.com/EANorwayService/CRM_setup_advanced#aboutCode.  

### Can I change the names of the folders? 
You can change the names of all folders except the candidate folders, they need to have the same names as the candidates. The folders with the meeting notes inside the candidate folders need to have the original name, if no folder with the name "Meeting Notes" is found in candidate folder a new folder with the name "Meeting Notes" is created.

### Can I change the name of a candidate?
You need to change the name in: 
1. Metrics
1. Metrics Historical Data
1. Meetings Hisorical Data
1. the name of the candidate sheet
1. the name of the candidate folder
You do not have to change anything in the code.

### How can I delete a candidate?  
You need to delete the candidate from: 
1. Metrics (delete 1 row)
1. Metrics Historical Data (delete all row with the candidate, if you want to delete all data)
1. Meetings Hisorical Data (delete all meetings if you want to delete all data)
1. the candidate sheet
1. the candidate folder
You do not have to change anything in the code.
After doing this you should run the function copySystem(). This function will make a function of all spreadsheets and add the new sheets to the code. 
This way the candidate is also deleted from the spreadsheets' version history. 

### How can I change how often the system is updated autmatically? 
Open the code and click *Edit > Current project's triggers*
Find the trigger for updateEverything() and you can now edit how often this is triggered.

### How can I change how often dashboard and candidates are snapshoted for the historical sheets? 
Open the code and click *Edit > Current project's triggers*
Find the trigger for weeklySnapshot() and you can now edit how often this is triggered.

### What is case study/success story?
The CRM system allows you to mark candidates as potential case studies or success stories. Case studies and success stories are often used as metrics to measure the results of one-to-one conversations.

### What is the mali-model? 
A model used by EA Norway to map how well they know the candidate compared to their score on CEAs 3-factor model of resources, dedication and realisation. It is based on the assumption that the closer you are to a candidate, the easier it is to increase their resources, dedication and realisation. Send an email to post@effektivaltruisme.no for more information.

### Who should I contact if I have issues? 
post@effektivaltruisme.no



# Extra <a name="extra"></a>

### Add a form to the CRM system
EA Norway has one form candidates fill out before the first conversation and one form each candidate fills out after each conversation.
The CRM-system already has functions specific for these forms and the functions can be fitted to other forms. 

#### Add Onboarding Form 
1. Search for handleFillOnboardingForm(); and find the one with two slashes in front.<br />
    Before:<br />
    ![Before pictur of code handleFillOnBoardingForm()](images/addOnboardingBefore.png)<br />
    After backslashes have been removed:<br />
    ![After pictur of code handleFillOnBoardingForm()](images/addOnboardingAfter.png)<br />
1. Change name of sheet<br />
    ![Name of sheet](images/nameOfOnboardingSheet.png)

#### Add Evaluation Form 
1. Search for handleFillOnboardingForm(); and find the one with two slashes in front.<br />
    Before:<br />
    ![Before pictur of code handleFillOnBoardingForm()](images/addEvaluationBefore.png)<br />
    After backslashes have been removed:<br />
    ![After pictur of code handleFillOnBoardingForm()](images/addEvaluationAfter.png)<br />
1. Change name of sheet<br />
    ![Name of sheet](images/nameOfEvaluationSheet.png)

