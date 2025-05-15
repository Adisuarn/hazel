import { FirestoreCollection, Mutators, IDUtil  } from '@lib'
import Excel from 'exceljs'
import path from 'path'
import type { ClubData, Debugger } from '@lib'

async function writeToExcel(data: any[], maxCommittees: number) {
  const workbook = new Excel.Workbook()
  const worksheet = workbook.addWorksheet('ชมรม')

  const columns = [
    { header: 'รหัสชมรม', key: 'clubID', width: 15 },
    { header: 'ชมรม', key: 'clubName', width: 30 },
  ]

  for (let i = 1; i <= maxCommittees; i++) {
    columns.push({ header: `กรรมการ ${i}`, key: `committee${i}`, width: 10 })
  }

  worksheet.columns = columns

  data.forEach((item) => {
    const row: any = {
      clubID: item.clubID,
      clubName: item.clubName,
    }
    for (let i = 0; i < maxCommittees; i++) {
      row[`committee${i + 1}`] = item.committees?.[i] || ''
    }
    worksheet.addRow(row)
  })

  const filePath = path.join(__dirname, 'committees.xlsx')
  console.log('Writing to file:', filePath)
  await workbook.xlsx.writeFile(filePath)
}

export const checkCommittees = async (debug: Debugger) => {
  const clubCol = new FirestoreCollection('clubs').setDefaultMutator(
    Mutators.SpecificKeyFieldKVMutator((doc) => doc.id)
  )

  const clubData = await clubCol.readFromCache(true)

  if (!clubData) {
    debug.err('No data found in cache')
    return
  }

  const data = clubData?.map((k, v) => {
    const clubId = k
    const clubData = v.data() as ClubData
    if (!IDUtil.systemClubs.hasKey(clubId)) return null
    const committees = clubData.committees as string[] | undefined
    return {
      clubID: clubId,
      clubName: IDUtil.translateToClubName(clubId),
      committees
    }
  })

  const filteredData = data.filter((item) => item !== null)

  const maxCommittees = Math.max(
    ...filteredData.map((item) => item?.committees?.length || 0)
  )

  await writeToExcel(filteredData, maxCommittees)
}
