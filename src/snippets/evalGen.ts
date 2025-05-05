import type { Debugger, EvaluateCollectionType, UserDataCollectionType } from '@lib'
import { ClubRecord, DMap, FirestoreCollection, IDUtil } from '@lib'
import * as XLSX from 'xlsx'

import { Workbook } from '../lib/builtin/data/Workbook'
import { Worksheet } from '../lib/builtin/data/Worksheet'

export const EvalExcelGenSnippet = async (debug: Debugger) => {
  const evalColl = new FirestoreCollection<EvaluateCollectionType>('evaluate')
  const stdColl = new FirestoreCollection<UserDataCollectionType>('data')

  const evalData = await evalColl.readFromCache(true)
  if (!evalData) return

  const stdData = await stdColl.readFromCache(true)
  if (!stdData) return

  const evalRecords = new ClubRecord(evalData.getRecord())

  const getStdInfo = (studentId: string) => { 
    const student = stdData.findValues((std) => {
      return std.get('student_id') === studentId
    })
    const _student = student[0]
    if (!_student) return undefined
    return _student
  }

  let allStudentRecords: any[] = []

  evalRecords.map((clubId, v) => {
    const clubStudents = new DMap(v.data())
      .filter((k, v) => v.action === 'failed')
      .map((k) => {
        return {
          'ชมรม': IDUtil.translateToClubName(clubId),
          'รหัสชมรม': clubId,
          'รหัสนักเรียน': k,
          'ชั้น': getStdInfo(k)?.get('level'),
          'ห้อง': getStdInfo(k)?.get('room'),
          'ชื่อจริง': getStdInfo(k)?.get('firstname'),
          'นามสกุล': getStdInfo(k)?.get('lastname'),
          'เลขที่': getStdInfo(k)?.get('number'),
        }
      })

    clubStudents.forEach(student => {
      allStudentRecords.push(student)
    })
  })

  const worksheet = XLSX.utils.json_to_sheet(allStudentRecords)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'All Clubs')

  const wscols = [
    { wch: 30 },  // ชมรม
    { wch: 15 },  // รหัสชมรม
    { wch: 15 },  // รหัสนักเรียน
    { wch: 8 },   // ชั้น
    { wch: 8 },   // ห้อง
    { wch: 20 },  // ชื่อจริง
    { wch: 20 },  // นามสกุล
    { wch: 8 }    // เลขที่
  ];
  worksheet['!cols'] = wscols;

  XLSX.writeFile(workbook, 'รายชื่อคนไม่ผ่านชมรม.xlsx')
}
