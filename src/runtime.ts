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
import { checkCommittees } from 'snippets/check_committees'
import { checkMemberPercentage } from 'snippets/member_percentage'
import { EvalExcelGenSnippet } from 'snippets/evalGen'
import { updateNewClubDisplay } from 'snippets/new_semester/update_new_club_display'
import { ResetAuditionField } from 'snippets/new_semester/reset_audition_field'
import { UpdateNewM4 } from 'snippets/new_semester/update_new_m4'
import { ClearEvaluate } from 'snippets/new_semester/clear_evaluate'

enum SnippetMode {
    REPORTEXCEL = 1,
    STUDENTINFO = 2,
    REPORTPDF = 3,
    REPORTLOGS = 4,
    AUDITION = 5,
    TEACHER_LIST = 6,
    CHECK_EVAL_FAIL = 7,
    GEN_EVAL_EXCEL = 8,
    RESET_NEW_SEMESTER_CLUB = 9,
    CHECK_COMMITTEES = 10,
    CHECK_MEMBER_PERCENTAGE = 11,
    UPDATE_CLUB_DISPLAY = 12,
    UPDATE_NEW_M4 = 13,
    RESET_AUDITION_FIELD = 14,
    CLEAR_EVALUATE = 15,
    PLAYGROUND = 16,
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
                case SnippetMode.UPDATE_NEW_M4:
                    runtime.runSnippet(UpdateNewM4)
                    break
                case SnippetMode.RESET_AUDITION_FIELD:
                    runtime.runSnippet(ResetAuditionField)
                    break
                case SnippetMode.CLEAR_EVALUATE:
                    runtime.runSnippet(ClearEvaluate)
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
