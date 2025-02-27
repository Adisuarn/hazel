import { Runtime } from '@lib'
import { ClubsListsSnippet } from 'snippets/clubsLists'
import { ReportPDFSnippet } from 'snippets/reportPDF'
import { ReportExcelSnippet } from 'snippets/reportExcel'
import { StudentInfoSnippet } from 'snippets/studentInfo'
import { ReportLogsSnippet } from 'snippets/reportLogs'
import { ClearPanelSnippet } from 'snippets/clear'
import { CheckAuditionSnippet } from 'snippets/checkAudition'
import { TeacherListsSnippet } from 'snippets/teacherList'
import { CheckEvalSnippet } from 'snippets/checkEvalList'
import { CheckEvalFailSnippet } from 'snippets/checkEvalFail'
import { CheckEvalFailNbreakSnippet } from 'snippets/checkEvalResignNbreak'

enum SnippetMode {
    REPORTEXCEL = 1,
    STUDENTINFO = 2,
    CLUBSLISTS = 3,
    REPORTPDF = 4,
    REPORTLOGS = 5,
    CLEARPANEL = 6,
    AUDITION = 7,
    TEACHER_LIST = 8,
    CHECK_EVAL = 9,
    CHECK_EVAL_FAIL = 10,
    CHECK_EVAL_FAIL_NBREAK = 11
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

        console.log('\nAvailable modes:')
        Object.entries(SnippetMode)
            .filter(([key]) => isNaN(Number(key)))
            .forEach(([key, value]) => {
                console.log(`${value}: ${key}`)
            })
        console.log('')

        readline.question(`Enter the mode: `, (modetype: any) => {
            modetype = parseInt(modetype)
            if (!Object.values(SnippetMode).includes(modetype)) {
                console.error('Invalid mode')
                readline.close()
                return
            }
            const runtime: Runtime = new Runtime("PROD")
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
                case SnippetMode.CHECK_EVAL:
                    runtime.runSnippet(CheckEvalSnippet)
                    break
                case SnippetMode.CHECK_EVAL_FAIL:
                    runtime.runSnippet(CheckEvalFailSnippet)
                    break
                case SnippetMode.CHECK_EVAL_FAIL_NBREAK:
                    runtime.runSnippet(CheckEvalFailNbreakSnippet)
                    break
                default:
                    console.log('Invalid mode')
                    break
            }
            readline.close()
        })
        readline.on('close', () => {
            console.log('Closed')
        })
    }
}

new Hazel()
