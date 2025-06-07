import { DMapUtil, FirestoreCollection, ReferableMapEntity } from '@lib'
import type { Debugger, UserRef, UserRefCollection } from '@lib'
import path from 'path'
import ExcelJS from 'exceljs'

export const UpdateNewM4 = async (debug: Debugger) => {
  const refCol = new FirestoreCollection<UserRefCollection>("ref")
  const refData = await refCol.fetch()

  if (!refData) {
    debug.err('No data found')
    return
  }

  const filePath = path.join(__dirname, '../m4_new.xlsx')

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.worksheets[0];

  if (!worksheet) {
    debug.err('No worksheet found')
    return
  }

  const students: UserRef[] = [];

  worksheet?.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber > 1) {
      const student = {
        break: false,
        student_id: row.getCell('P').value?.toString() || '',
        firstname: row.getCell('E').value?.toString() || '',
        lastname: row.getCell('G').value?.toString() || '',
        title: row.getCell('D').value?.toString() || '',
        number: '',
        room: '',
        level: "4"
      };
      students.push(student);
    }
  })

  students.map((student) => {
    refData.insert(new ReferableMapEntity(student))
  })

  const newM4 = DMapUtil.setFileName('new-m4').buildChanges(refData)
  //refCol.pushChanges(newM4, false)
}
