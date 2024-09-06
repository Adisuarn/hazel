import { Runtime } from '@lib'
import { ClubsListsSnippet } from 'snippets/clubsLists'
import { ReportPDFSnippet } from 'snippets/reportPDF'
import { ReportExcelSnippet } from 'snippets/reportExcel'
import { StudentInfoSnippet } from 'snippets/studentInfo'
import { ReportLogsSnippet } from 'snippets/reportLogs'
import { ClearPanelSnippet } from 'snippets/clear'
import { CheckAuditionSnippet } from 'snippets/checkAudition'
import { TeacherListsSnippet } from 'snippets/teacherList'
import { TempBruhSnippets } from 'snippets/temp'
import { checkStdInClubSeperatelySnippet } from 'snippets/checkStdInClubSeperately'
import { getStdInAllClubsSnippet } from 'snippets/getStdInAllClubs'

enum RunOption {
    DEV = 'DEV',
    PROD = 'PROD',
}

enum SnippetMode {
    REPORTEXCEL = 1,
    STUDENTINFO = 2,
    CLUBSLISTS = 3,
    REPORTPDF = 4,
    REPORTLOGS = 5,
    CLEARPANEL = 6,
    AUDITION = 7,
    TEACHER_LIST = 8,
    TEMP = 9,
    CHECK_STD_IN_CLUB_SEPERATELY = 10,
    GET_STD_IN_ALL_CLUBS = 11,
}

class Hazel {
    constructor() {
        this.startTerminal()
    }
    startTerminal() {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        })
        readline.question(`Enter the runtime: `, (runtimetype: RunOption) => {
            if (runtimetype !== RunOption.DEV && runtimetype !== RunOption.PROD) {
                console.error('Invalid runtime')
                readline.close()
                return
            }
            readline.question(`Enter the mode: `, (modetype: any) => {
                modetype = parseInt(modetype)
                if (!Object.values(SnippetMode).includes(modetype)) {
                    console.error('Invalid mode')
                    readline.close()
                    return
                }
                const runtime: Runtime = new Runtime(runtimetype)
                switch (modetype) {
                    case SnippetMode.REPORTEXCEL:
                        runtime.runSnippet(ReportExcelSnippet)
                        break
                    case SnippetMode.STUDENTINFO:
                        runtime.runSnippet(StudentInfoSnippet)
                        break
                    case SnippetMode.CLUBSLISTS:
                        runtime.runSnippet(ClubsListsSnippet)
                        break
                    case SnippetMode.REPORTPDF:
                        runtime.runSnippet(ReportPDFSnippet)
                        break
                    case SnippetMode.REPORTLOGS:
                        runtime.runSnippet(ReportLogsSnippet)
                        break
                    case SnippetMode.CLEARPANEL:
                        runtime.runSnippet(ClearPanelSnippet)
                        break
                    case SnippetMode.AUDITION:
                        runtime.runSnippet(CheckAuditionSnippet)
                        break
                    case SnippetMode.TEACHER_LIST:
                        runtime.runSnippet(TeacherListsSnippet)
                        break
                    case SnippetMode.TEMP:
                        runtime.runSnippet(TempBruhSnippets)
                        break
                    case SnippetMode.CHECK_STD_IN_CLUB_SEPERATELY: // Need to Fix : Filter teacher out
                        runtime.runSnippet(checkStdInClubSeperatelySnippet)
                        break
                    case SnippetMode.GET_STD_IN_ALL_CLUBS:
                        runtime.runSnippet(getStdInAllClubsSnippet)
                        break
                    default:
                        console.log('Invalid mode')
                        break
                }
                readline.close()
            })
        })
        readline.on('close', () => {
            console.log('Closed')
        })
    }
}

new Hazel()
