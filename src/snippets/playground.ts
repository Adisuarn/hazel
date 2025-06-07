import { FirestoreCollection, IDUtil, ExcelDataSource, ReferableMapEntity, DMapUtil } from '@lib'
import type { ClubDataCollection, Debugger, UserCredCollectionType, UserDataCollectionType, UserRefCollection } from '@lib'
import path from 'path'

export const PlayGroundSnippet = async (debug: Debugger) => {
  const refColl = new FirestoreCollection<UserRefCollection>('ref')

  const [
    refData,
  ] = await Promise.all([
    refColl.fetch(),
  ])

  const data = (await new ExcelDataSource(path.join(__dirname, 'newM4ID.xlsx')).resolve()).getSheet(0)?.getRecords()

  const stdID = data?.map((item) => {
    return item["14"]! as string
  })

  stdID?.map((id) => {
    const student = refData.filter((k, v) => k.length > 5).findValues((v) => v.get('student_id') === id)[0]

    if (!student) {
      debug.err(`Student with ID ${id} not found in the reference data.`)
      return
    }

    const original = student?.getOriginal()

    student?.delete()

    refData.insert(new ReferableMapEntity(original, original?.student_id).setMetadata({
      reason: 'Change from hashed to student ID'
    }))
  })

  const changes = DMapUtil.setFileName('update-ref-m4').buildChanges(refData)
  // refColl.pushChanges(changes, false)
}
