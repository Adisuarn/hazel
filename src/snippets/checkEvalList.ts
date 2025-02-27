import type { Debugger, EvaluateCollectionType } from '@lib'
import { ClubRecord, DMap, FirestoreCollection, IDUtil,  } from '@lib'

import * as xlsx from 'xlsx'

interface Data {
  id: string
  name: string
}

async function fetchClubData(): Promise<Data[]> {
  const evalCol = new FirestoreCollection<EvaluateCollectionType>('evaluate')
  const evalData = await evalCol.readFromCache(true)

  if (!evalData) {
    return []
  }

  const evalRecords = new ClubRecord(evalData.getRecord())
  
  return evalRecords.map((clubId) => ({
    id: clubId,
    name: IDUtil.translateToClubName(clubId),
  }))
}

export const CheckEvalSnippet = async (debug: Debugger) => {
  const evalColl = new FirestoreCollection<EvaluateCollectionType>('evaluate')
  const evalData = await evalColl.fetchNoRef()
  if (!evalData) return

  const clubData = await fetchClubData()
  const evalRecords = new ClubRecord(evalData.getRecord())

  const headers = ['ชมรม', 'ประเมินผล']
  const rows = clubData.map(club => [
    IDUtil.translateToClubName(club.id),
    evalRecords.hasKey(club.id) ? '✅' : '❌'
  ])

  const workbook = xlsx.utils.book_new()
  const worksheet = xlsx.utils.aoa_to_sheet([headers, ...rows])

  worksheet['!cols'] = [
    { wch: 65 },
    { wch: 15 }
  ]

  xlsx.utils.book_append_sheet(workbook, worksheet, 'Club Evaluation Status')

  const filename = `ประเมินผลชมรม_${new Date().toISOString().split('T')[0]}.xlsx`
  xlsx.writeFile(workbook, filename)

  debug.info(`Excel file created: ${filename}`)
}
