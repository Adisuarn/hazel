import { Runtime, Debugger } from '@lib'
import { DevSnippetMode } from 'lib/builtin/types/DevSnippet'
import { ReportPDFSnippet } from 'snippets/reportPDF'
import { ReportExcelSnippet } from 'snippets/reportExcel'
import { StudentInfoSnippet } from 'snippets/studentInfo'
import { ReportLogsSnippet } from 'snippets/reportLogs'
import { PlayGroundSnippet } from 'snippets/playground'
import { resetNewSemesterClub } from 'snippets/new_semester/reset_new_semester_club'
import { EvalExcelGenSnippet } from 'snippets/evalGen'
import { updateNewClubDisplay } from 'snippets/new_semester/update_new_club_display'
import { ResetAuditionField } from 'snippets/new_semester/reset_audition_field'
import { UpdateNewM4 } from 'snippets/new_semester/update_new_m4'
import { ClearEvaluate } from 'snippets/new_semester/clear_evaluate'
import { ResetCardID } from 'snippets/new_semester/reset_card_id'
import { RemoveM6 } from 'snippets/new_semester/remove_m6'
import { TempSnippet } from 'snippets/temp'
import { ReservedSnippet } from 'snippets/new_semester/reserved'
import { RandomClub } from 'snippets/new_semester/random_club'
import { updateOldStd } from 'snippets/new_semester/update_old_std'
import { updateM4Data } from 'snippets/new_semester/update_m4_data'
import { studentList } from 'snippets/new_semester/student_list'
import { advancedDataMappingSnippet } from 'examples/advancedDataMapping'
import { basicExampleSnippet } from 'examples/basics'
import { basicExcel } from 'examples/basicExcel'
import { docGenSnippet } from 'examples/docGen'
import { mutatorExampleSnippet } from 'examples/mutator'
import { pushDataSnippet } from 'examples/pushData'
import { header, colorize, Colors, prompt, warning, success, info, error as errorColor } from 'lib/util/cli-colors'

enum ProdSnippetMode {
    REPORTEXCEL = 1,
    STUDENTINFO = 2,
    REPORTPDF = 3,
    REPORTLOGS = 4,
    GEN_EVAL_EXCEL = 5,
    REMOVE_M6 = 6,
    RESET_CARD_ID = 7,
    RESET_AUDITION_FIELD = 8,
    RESET_NEW_SEMESTER_CLUB = 9,
    CLEAR_EVALUATE = 10,
    UPDATE_CLUB_DISPLAY = 11,
    UPDATE_NEW_M4 = 12,
    RESERVED = 13,
    UPDATE_M4_DATA = 14,
    UPDATE_OLD_STD = 15,
    RANDOM_CLUB = 16,
    STUDENTLIST = 17,
    PLAYGROUND = 18,
    TEMP = 19,
}

type RuntimeType = 'DEV' | 'PROD' | 'Q' | 'QUIT' | 'H' | 'HELP';

interface SnippetFunction {
    (debug: Debugger): void | Promise<void>;
}

interface SnippetMap {
    [key: number]: SnippetFunction;
}

class Hazel {

    private prodSnippetMap: SnippetMap = {
        [ProdSnippetMode.REPORTEXCEL]: ReportExcelSnippet,
        [ProdSnippetMode.STUDENTINFO]: StudentInfoSnippet,
        [ProdSnippetMode.REPORTPDF]: ReportPDFSnippet,
        [ProdSnippetMode.REPORTLOGS]: ReportLogsSnippet,
        [ProdSnippetMode.GEN_EVAL_EXCEL]: EvalExcelGenSnippet,
        [ProdSnippetMode.REMOVE_M6]: RemoveM6,
        [ProdSnippetMode.RESET_CARD_ID]: ResetCardID,
        [ProdSnippetMode.RESET_AUDITION_FIELD]: ResetAuditionField,
        [ProdSnippetMode.RESET_NEW_SEMESTER_CLUB]: resetNewSemesterClub,
        [ProdSnippetMode.CLEAR_EVALUATE]: ClearEvaluate,
        [ProdSnippetMode.UPDATE_CLUB_DISPLAY]: updateNewClubDisplay,
        [ProdSnippetMode.UPDATE_NEW_M4]: UpdateNewM4,
        [ProdSnippetMode.RESERVED]: ReservedSnippet,
        [ProdSnippetMode.UPDATE_M4_DATA]: updateM4Data,
        [ProdSnippetMode.UPDATE_OLD_STD]: updateOldStd,
        [ProdSnippetMode.RANDOM_CLUB]: RandomClub,
        [ProdSnippetMode.STUDENTLIST]: studentList,
        [ProdSnippetMode.PLAYGROUND]: PlayGroundSnippet,
        [ProdSnippetMode.TEMP]: TempSnippet,
    };

    private devSnippetMap: SnippetMap = {
        [DevSnippetMode.pushData]: pushDataSnippet,
    };

    constructor() {
        this.startTerminal();
    }

    private displayHeader(text: string): void {
        const separator = '='.repeat(text.length + 4);
        const { header, info } = require('./lib/util/cli-colors');
        console.log(`\n${info(separator)}`);
        console.log(`${header(`| ${text} |`)}`);
        console.log(`${info(separator)}\n`);
    }

    private displayAvailableModes(snippetMode: any): void {
        Object.entries(snippetMode)
            .filter(([key]) => isNaN(Number(key)))
            .sort((a, b) => Number(a[1]) - Number(b[1]))
            .forEach(([key, value]: [string, any]) => {
                console.log(`  ${colorize(String(value).padStart(2), Colors.FgGreen)} - ${info(key)}`);
            });
        console.log('');
    }

    async startTerminal(): Promise<void> {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const question = (query: string): Promise<string> => {
            return new Promise((resolve) => {
                readline.question(query, resolve);
            });
        };

        try {
            this.displayHeader('Hazel Runtime CLI');

            const runtimeType = (await question(prompt('Choose runtime (DEV/PROD), HELP or Q to quit: '))).trim().toUpperCase() as RuntimeType | 'HELP';

            if (runtimeType === 'HELP' || runtimeType === 'H') {
                this.displayHelp();
                readline.close()
                return this.startTerminal();
            }

            if (runtimeType === 'Q' || runtimeType === 'QUIT') {
                console.log(warning('\nExiting Hazel Runtime CLI...'));
                return;
            }

            if (runtimeType !== 'DEV' && runtimeType !== 'PROD') {
                throw new Error('Invalid runtime type. Please choose either DEV or PROD.');
            }

            const snippetMode = runtimeType === 'DEV' ? DevSnippetMode : ProdSnippetMode;
            const snippetMap = runtimeType === 'DEV' ? this.devSnippetMap : this.prodSnippetMap;

            this.displayHeader(`Available ${runtimeType} Modes`);
            this.displayAvailableModes(snippetMode);

            const modeInput = await question(prompt(`Enter the mode number (or Q to quit): `));

            if (modeInput.trim().toUpperCase() === 'Q') {
                console.log(warning('\nExiting Hazel Runtime CLI...'));
                return;
            }

            const modeType = parseInt(modeInput, 10);

            if (isNaN(modeType) || !Object.values(snippetMode).includes(modeType)) {
                throw new Error(`Invalid mode number for ${runtimeType} runtime.`);
            }

            const modeName = Object.entries(snippetMode)
                .find(([_, value]) => value === modeType)?.[0] || `Mode ${modeType}`;

            console.log(`\n${info(`Starting ${runtimeType} runtime with mode: ${modeName}`)}\n`);
            const runtime = new Runtime(runtimeType);
            const snippet = snippetMap[modeType];

            if (snippet) {
                try {
                    runtime.runSnippet(snippet);
                    console.log(`\n${success('Snippet execution completed successfully.')}`);
                } catch (execError) {
                    throw new Error(`Failed to execute snippet: ${(execError as Error).message}`);
                }
            } else {
                throw new Error(`No snippet found for the selected mode: ${modeType}`);
            }
        } catch (err) {
            const error = err as Error;
            console.error(`\n${errorColor('Error:')} ${error.message || 'An unknown error occurred'}`);
        } finally {
            readline.close();
        }

        readline.on('close', () => {
            this.onClose();
        });
    }

    private displayHelp(): void {
        this.displayHeader('Hazel CLI Help');

        console.log(colorize('Commands:', Colors.Bright));
        console.log(`  ${colorize('DEV', Colors.FgGreen)}   - Run development snippets`);
        console.log(`  ${colorize('PROD', Colors.FgGreen)}  - Run production snippets`);
        console.log(`  ${colorize('Q', Colors.FgGreen)}     - Quit the application\n`);

        console.log(colorize('Navigation:', Colors.Bright));
        console.log(`  ${info('Enter the corresponding number to run a snippet')}`);
        console.log(`  ${info('Type Q at any prompt to quit')}\n`);

        console.log(colorize('Examples:', Colors.Bright));
        console.log(`  ${success('DEV + 1')} - Run the first development snippet`);
        console.log(`  ${success('PROD + 5')} - Run the fifth production snippet\n`);
    }

    onClose(): void {
        console.log(`\n${info('Ending Hazel Runtime CLI...')}`);
    }

    private async promptYesNo(question: string, defaultYes = true): Promise<boolean> {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const suffix = defaultYes ? '[Y/n]' : '[y/N]';

        return new Promise((resolve) => {
            readline.question(`${prompt(`${question} ${suffix}: `)}`, (answer: string) => {
                readline.close();
                const normalizedAnswer = answer.trim().toLowerCase();

                if (normalizedAnswer === '') {
                    return resolve(defaultYes);
                }

                return resolve(normalizedAnswer === 'y' || normalizedAnswer === 'yes');
            });
        });
    }
}

new Hazel();

process.on('SIGINT', () => {
    console.log('\nProcess terminated by user.');
    process.exit(0);
});
