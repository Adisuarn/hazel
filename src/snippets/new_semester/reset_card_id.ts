// Should exclude committees
import { DMapUtil, FirestoreCollection, Mutators, UserDataCollectionType } from '@lib'
import type { Debugger } from '@lib'

export const ResetCardID = async (debug: Debugger) => {
  const stdCol = new FirestoreCollection<UserDataCollectionType>('data').setDefaultMutator(
    Mutators.SpecificKeyFieldKVMutator((doc) => doc.id)
  )
  const stdData = await stdCol.fetch()

  if (!stdData) {
    debug.err('No data found')
    return
  }

  stdData.map((k, v) => {
    if (v.get('level') === "9" || v.get('number') === "53" || v.get('title') === "ครู") return
    v.update("cardID", "")
  })

  const stdChangeList = DMapUtil.buildChanges(stdData, 'clear-cardID')
  //stdCol.pushChanges(stdChangeList, false)

}
