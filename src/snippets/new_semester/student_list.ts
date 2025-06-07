import { FirestoreCollection, IDUtil, Workbook, Worksheet, DMap } from '@lib'
import type { Debugger, UserDataCollectionType } from '@lib'

export const studentList = async (debug: Debugger) => {
  const stdColl = new FirestoreCollection<UserDataCollectionType>('data')
  const stdData = await stdColl.fetch()

  const data = stdData.filter((k, v) => 
    v.get('room') !== "111" &&
    v.get('room') !== "999" &&
    v.get('number') !== "53" &&
    v.get('level') !== "9" &&
    v.get('title') !== "ครู"
  )

  const roomGrouped = data.groupBy((v) => v.get('room'))

  const book = new DMap(roomGrouped.getRecord()).map((k, v) => {
    const room = k
    const entity = new DMap(v)
    return new Worksheet(entity.map((k, v) => ({
      'ชมรม': IDUtil.translateToClubName(v.get('club')),
      'ชื่อ': v.get('firstname'),
      'นามสกุล': v.get('lastname'),
      'ห้อง': room,
      'ระดับ': v.get('level'),
    }))).setName(room)
  })

  const workbook = new Workbook(book)

  workbook.save('student_list.xlsx')

}
