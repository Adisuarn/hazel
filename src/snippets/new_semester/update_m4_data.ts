// You may update stdID here if you're using Identity Card

import { DMapUtil, ExcelDataSource, FirestoreCollection } from '@lib'
import type { Debugger, UserDataCollectionType, UserCredCollectionType } from '@lib'
import path from 'path'
import crypto from 'crypto'

export const updateM4Data = async (debug: Debugger) => {
  const stdColl = new FirestoreCollection<UserDataCollectionType>('data')
  const userColl = new FirestoreCollection<UserCredCollectionType>('users')

  const stdData = await stdColl.fetch()
  const userData = await userColl.fetch()

  //@ts-ignore
  const m4Student = stdData.filter((k, v) => v.get('identification') === true)
  const m4DataExcel = (await new ExcelDataSource(path.join(__dirname, '../m4_ruj.xlsx')).resolve()).getSheet(0)?.getRecords()
  
  const m4IDExcel = (await new ExcelDataSource(path.join(__dirname, '../newM4ID.xlsx')).resolve()).getSheet(0)?.getRecords()


  if (!m4DataExcel || !m4IDExcel) {
    debug.err('M4 Data Excel not found')
    return
  }

  const m4Data: {
    student_id: string
    room: string
    number: string
  }[] = m4DataExcel.map((item) => {
    return {
      student_id: item["2"]!,
      room: item["5"]!,
      number: item["6"]!,
    }
  })

  const m4IDData: {
    hashed_id: string
    student_id: string
  }[] = m4IDExcel.map((item) => {
    if (!item["12"] || !item["14"]) return
    return {
      hashed_id: crypto.createHash("sha256").update(item["12"]!).digest("base64"),
      student_id: String(item["14"]!),
    }
  }).filter((item): item is { hashed_id: string; student_id: string } => item !== undefined)


  m4IDData.map((item) => {
    const user = userData.findValues((v) => v.get('stdID') === item.hashed_id)[0]
    if (!user) {
      debug.err(`User with ID ${item.hashed_id} not found`)
      return
    }
    user?.update('stdID', item.student_id)
  })

  m4Data.map((item) => {
    const std = m4Student.findValues((v) => v.get('student_id') === item.student_id)[0]

    if(!std) {
      debug.err(`Student with ID ${item.student_id} not found`)
      return
    }

    std.update('room', item.room)
    std.update('number', item.number)

  })

  const stdChange = DMapUtil.setFileName('m4-room-number').buildChanges(stdData)
  const userChange = DMapUtil.setFileName('m4-student-id').buildChanges(userData)

  // stdColl.pushChanges(stdChange, false)
  // userColl.pushChanges(userChange, false)

}
