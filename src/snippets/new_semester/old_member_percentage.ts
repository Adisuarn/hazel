import { FirestoreCollection, Mutators, IDUtil  } from '@lib'
import Excel from 'exceljs'
import path from 'path'
import type { ClubData, ClubDataCollection, Debugger } from '@lib'

export const oldMemberPercentage = async (debug: Debugger) => {
  
  const clubCol = new FirestoreCollection<ClubDataCollection>('clubs').setDefaultMutator(
    Mutators.SpecificKeyFieldKVMutator((doc) => doc.id)
  )

  const clubData = await clubCol.fetch()

  if (!clubData) {
    debug.err('No club data found')
    return
  }

  const workbook = new Excel.Workbook()
  const worksheet = workbook.addWorksheet('Old Member Percentage')

  worksheet.columns = [
    { header: 'รหัสชมรม', key: 'clubID', width: 15 },
    { header: 'ชมรม', key: 'clubName', width: 30 },
    { header: 'สมาชิกเก่า', key: 'oldMember', width: 20 },
    { header: 'สมาชิกเก่าที่ยืนยันสิทธิ์ได้', key: 'oldMemberLimit', width: 20 },
    { header: 'เปอร์เซ็นต์', key: 'percentage', width: 20 },
  ]

  clubData.map((k, v) => {
    const clubID = k
    const oldMember = v.get('old_count') || 0
    const oldMemberLimit = v.get('old_count_limit')
    const percentage = oldMemberLimit ? ((oldMember / oldMemberLimit) * 100).toFixed(2) : 0

    worksheet.addRow({
      clubID,
      clubName: IDUtil.translateToClubName(clubID),
      oldMember,
      oldMemberLimit,
      percentage: `${percentage}%`,
    })
  })

  const filePath = path.join(__dirname, 'old_member_percentage.xlsx')
  await workbook.xlsx.writeFile(filePath)
}
