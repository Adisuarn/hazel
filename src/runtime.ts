import { Runtime } from '@lib'
import { ReportPDFSnippet } from 'snippets/reportPDF'
import { ReportExcelSnippet } from 'snippets/reportExcel'
import { StudentInfoSnippet } from 'snippets/studentInfo'
import { ReportLogsSnippet } from 'snippets/reportLogs'
import { CheckAuditionSnippet } from 'snippets/checkAudition'
import { TeacherListsSnippet } from 'snippets/teacherList'
import { CheckEvalFailSnippet } from 'snippets/checkEvalFail'
import { PlayGroundSnippet } from 'snippets/playground'
import { resetNewSemesterClub } from 'snippets/new_semester/reset_new_semester_club'
import { checkCommittees } from 'snippets/new_semester/check_committees'
import { checkMemberPercentage } from 'snippets/new_semester/member_percentage'
import { EvalExcelGenSnippet } from 'snippets/evalGen'
import { updateNewClubDisplay } from 'snippets/new_semester/update_new_club_display'
import { generateCardCommittee } from 'snippets/new_semester/generate_card_committee'

enum SnippetMode {
    REPORTEXCEL = 1,
    STUDENTINFO = 2,
    REPORTPDF = 3,
    REPORTLOGS = 4,
    CLEARPANEL = 5,
    AUDITION = 6,
    TEACHER_LIST = 7,
    CHECK_EVAL_FAIL = 8,
    GEN_EVAL_EXCEL = 9,
    RESET_NEW_SEMESTER_CLUB = 10,
    CHECK_COMMITTEES = 11,
    CHECK_MEMBER_PERCENTAGE = 12,
    PLAYGROUND = 13,
    UPDATE_CLUB_DISPLAY = 14,
    GENERATE_CARD_COMMITTEE = 15,
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
                case SnippetMode.REPORTPDF:
                    runtime.runSnippet(ReportPDFSnippet)
                    break
                case SnippetMode.REPORTLOGS:
                    runtime.runSnippet(ReportLogsSnippet)
                    break
                case SnippetMode.AUDITION:
                    runtime.runSnippet(CheckAuditionSnippet)
                    break
                case SnippetMode.TEACHER_LIST:
                    runtime.runSnippet(TeacherListsSnippet)
                    break
                case SnippetMode.CHECK_EVAL_FAIL:
                    runtime.runSnippet(CheckEvalFailSnippet)
                    break
                case SnippetMode.GEN_EVAL_EXCEL:
                    runtime.runSnippet(EvalExcelGenSnippet)
                    break
                case SnippetMode.PLAYGROUND:
                    runtime.runSnippet(PlayGroundSnippet)
                    break
                case SnippetMode.RESET_NEW_SEMESTER_CLUB:
                    runtime.runSnippet(resetNewSemesterClub)
                    break
                case SnippetMode.CHECK_COMMITTEES:
                    runtime.runSnippet(checkCommittees)
                    break
                case SnippetMode.CHECK_MEMBER_PERCENTAGE:
                    runtime.runSnippet(checkMemberPercentage)
                    break
                case SnippetMode.UPDATE_CLUB_DISPLAY:
                    runtime.runSnippet(updateNewClubDisplay)
                    break
                case SnippetMode.GENERATE_CARD_COMMITTEE:
                    runtime.runSnippet(generateCardCommittee)
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
