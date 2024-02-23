import { Runtime } from '@lib'
import { ClubsListsSnippet } from 'snippets/clubsLists'
import { ReportPDFSnippet } from 'snippets/reportPDF'
import { ReportExcelSnippet } from 'snippets/reportExcel'
import { StudentInfoSnippet } from 'snippets/studentinfo'
import { ReportLogsSnippet } from 'snippets/reportLogs' 

enum RunTime {
  DEV = "DEV",
  PROD = "PROD"
}

enum SnippetMode {
  REPORTEXCEL = 1,
  STUDENTINFO = 2,
  CLUBSLISTS = 3,
  REPORTPDF = 4,
  REPORTLOGS = 5
}

const mode: SnippetMode = SnippetMode.STUDENTINFO;
const runtime: Runtime = new Runtime(RunTime.PROD);

switch (mode) {
  case SnippetMode.REPORTEXCEL as number:
    runtime.runSnippet(ReportExcelSnippet);
    break;
  case SnippetMode.STUDENTINFO as number:
    runtime.runSnippet(StudentInfoSnippet);
    break;
  case SnippetMode.CLUBSLISTS as number:
    runtime.runSnippet(ClubsListsSnippet);
    break;
  case SnippetMode.REPORTPDF as number:
    runtime.runSnippet(ReportPDFSnippet);
    break;
  case SnippetMode.REPORTLOGS as number:
    runtime.runSnippet(ReportLogsSnippet);
    break;
  default:
    console.log('Invalid mode');
    break;
}
