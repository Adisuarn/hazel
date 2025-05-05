import { ClubRecord, FirestoreCollection, IDUtil } from '@lib'
import type { Debugger, ClubDataCollection } from '@lib'
import { DMap } from '@lib'
import Excel from 'exceljs'
import path from 'path'

interface ClubData {
  clubID: string
  clubName: string
  committees: number | undefined
  old_members: number
  new_members: number
  audition: string
}

async function fetchClubData() {
  const clubCol = new FirestoreCollection<ClubDataCollection>('clubs')
  const clubData = await clubCol.readFromCache(true)

  if (!clubData) {
    return []
  }

  const clubMap = clubData.map((k, v) => {
    const clubID = k
    const data = v.data()
    if (!IDUtil.systemClubs.hasKey(clubID)) return null
    return {
      clubID,
      clubName: IDUtil.translateToClubName(clubID),
      committees: data.committees?.length,
      old_members: data.old_count_limit,
      new_members: data.count_limit - data.old_count_limit - (data.committees?.length || 0),
      audition: data.audition ? 'มี' : 'ไม่มี',
    }
  })

  const filteredData = clubMap.filter((item) => item !== null) as ClubData[]

  return filteredData
}

async function writeToExcel(data: ClubData[]) {
  const workbook = new Excel.Workbook()
  const worksheet = workbook.addWorksheet('ชมรม')

  worksheet.columns = [
    { header: 'รหัสชมรม', key: 'clubID', width: 15 },
    { header: 'ชมรม', key: 'clubName', width: 30 },
    { header: 'กรรมการ', key: 'committees', width: 20 },
    { header: 'สมาชิกเก่า', key: 'old_members', width: 20 },
    { header: 'สมาชิกใหม่', key: 'new_members', width: 20 },
    { header: 'ประเภทชมรม', key: 'audition', width: 20 },
  ]

  data.forEach((item) => {
    worksheet.addRow(item)
  })

  const filePath = path.join(__dirname, 'clubs.xlsx')
  console.log('Writing to file:', filePath)
  await workbook.xlsx.writeFile(filePath)
}

export const PlayGroundSnippet = async () => {
  const data = await fetchClubData()
  await writeToExcel(data)
}
