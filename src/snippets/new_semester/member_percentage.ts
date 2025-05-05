import { FirestoreCollection, Mutators, IDUtil  } from '@lib'
import Excel from 'exceljs'
import path from 'path'
import type { ClubData, Debugger } from '@lib'


const writeToExcel = async (data: any[]) => {
  const workbook = new Excel.Workbook()
  const worksheet = workbook.addWorksheet('Club Data')
  worksheet.columns = [
    { header: 'รหัสชมรม', key: 'clubID', width: 15 },
    { header: 'ชมรม', key: 'clubName', width: 30 },
    { header: 'New Member Percentage', key: 'newMemberPercentage', width: 10 },
  ]
  data.forEach((item) => {
    worksheet.addRow(item)
  })
  const filePath = path.join(__dirname, 'new_member_percentage.xlsx')
  console.log('Writing to file:', filePath)
  await workbook.xlsx.writeFile(filePath)
}

export const checkMemberPercentage = async (debug: Debugger) => {
  const clubCol = new FirestoreCollection('clubs').setDefaultMutator(
    Mutators.SpecificKeyFieldKVMutator((doc) => doc.id)
  )
  
  const clubData = await clubCol.readFromCache(true)

  if (!clubData) {
    debug.err('No data found in cache')
    return
  }

  const data = clubData.map((k, v) => {
    const clubId = k
    const clubData = v.data() as ClubData

    const newMemberPercentage = (clubData.new_count / clubData.new_count_limit) * 10
    return {
      clubID: clubId,
      clubName: IDUtil.translateToClubName(clubId),
      newMemberPercentage: newMemberPercentage.toFixed(2) + '%',
    }
  })

  await writeToExcel(data)
  debug.info('Data written to Excel file successfully')
}
