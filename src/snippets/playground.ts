import { FirestoreCollection, Mutators, UserDataCollectionType } from '@lib'
import type { Debugger, ClubDataCollection } from '@lib'

export const PlayGroundSnippet = async (debug: Debugger) => {

  const stdCol = new FirestoreCollection<UserDataCollectionType>('data').setDefaultMutator(
    Mutators.SpecificKeyFieldKVMutator((doc) => doc.get('student_id'))
  )
  const stdData = await stdCol.fetch()

  if (!stdData) {
    debug.err('No data found')
    return
  }

}
