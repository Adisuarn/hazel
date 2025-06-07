import { DMapUtil, FirestoreCollection, Mutators, UserDataCollectionType } from '@lib'
import type { Debugger } from '@lib'
import ExcelJS from 'exceljs'
import path from 'path'

export const RemoveM6 = async (debug: Debugger) => {
  const stdCol = new FirestoreCollection<UserDataCollectionType>('data').setDefaultMutator(
    Mutators.SpecificKeyFieldKVMutator((doc) => doc.id)
  )

  const stdData = await stdCol.fetch()

  const m6_db = stdData.findValues((v) => v.get('level') === '6')

  let m6_excel: string[] = []
  const filePath = path.join(__dirname, '../m6_new.xlsx')

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.worksheets[0];

  worksheet?.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber > 1) {
      m6_excel.push(row.getCell('B').value?.toString() || '');
    }
  })

  if (!worksheet) {
    debug.err('No worksheet found')
    return
  }

  m6_db.map((v) => {
    if(m6_excel.find((stdId) => stdId === v.get('student_id'))) return
    v.delete()
  })

  const M6ChangeList = DMapUtil.setFileName('m6-clear').buildChanges(stdData)
  //stdCol.pushChanges(M6ChangeList, false)

}
