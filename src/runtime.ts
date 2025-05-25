import { Runtime } from '@lib'
import { ReportPDFSnippet } from 'snippets/reportPDF'
import { ReportExcelSnippet } from 'snippets/reportExcel'
import { StudentInfoSnippet } from 'snippets/studentInfo'
import { ReportLogsSnippet } from 'snippets/reportLogs'
import { PlayGroundSnippet } from 'snippets/playground'
import { resetNewSemesterClub } from 'snippets/new_semester/reset_new_semester_club'
import { getCommittees } from 'snippets/get_committees'
import { EvalExcelGenSnippet } from 'snippets/evalGen'
import { updateNewClubDisplay } from 'snippets/new_semester/update_new_club_display'
import { ResetAuditionField } from 'snippets/new_semester/reset_audition_field'
import { UpdateNewM4 } from 'snippets/new_semester/update_new_m4'
import { ClearEvaluate } from 'snippets/new_semester/clear_evaluate'
import { ResetCardID } from 'snippets/new_semester/reset_card_id'
import { RemoveM6 } from 'snippets/new_semester/remove_m6'
import { TempSnippet } from 'snippets/temp'

enum SnippetMode {
    REPORTEXCEL = 1,
    STUDENTINFO = 2,
    REPORTPDF = 3,
    REPORTLOGS = 4,
    GEN_EVAL_EXCEL = 5,
    GET_COMMITTEES = 6,
    RESET_CARD_ID = 7,
    RESET_AUDITION_FIELD = 8,
    RESET_NEW_SEMESTER_CLUB = 9,
    CLEAR_EVALUATE = 10,
    UPDATE_CLUB_DISPLAY = 11,
    REMOVE_M6 = 12,
    UPDATE_NEW_M4 = 13,
    PLAYGROUND = 14,
    TEMP = 15
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
                case SnippetMode.GEN_EVAL_EXCEL:
                    runtime.runSnippet(EvalExcelGenSnippet)
                    break
                case SnippetMode.PLAYGROUND:
                    runtime.runSnippet(PlayGroundSnippet)
                    break
                case SnippetMode.RESET_NEW_SEMESTER_CLUB:
                    runtime.runSnippet(resetNewSemesterClub)
                    break
                case SnippetMode.GET_COMMITTEES:
                    runtime.runSnippet(getCommittees)
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
                case SnippetMode.RESET_CARD_ID:
                    runtime.runSnippet(ResetCardID)
                    break
                case SnippetMode.REMOVE_M6:
                    runtime.runSnippet(RemoveM6)
                    break
                case SnippetMode.TEMP:
                    runtime.runSnippet(TempSnippet)
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
