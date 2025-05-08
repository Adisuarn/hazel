import { ClubDisplayCollection, ClubRecord, DMapUtil, FirestoreCollection, IDUtil, Mutators, UserDataCollectionType } from '@lib'
import type { Debugger, ClubDataCollection } from '@lib'

export const updateNewClubDisplay = async (debug: Debugger) => {

  const clubCol = new FirestoreCollection<ClubDataCollection>('clubs').setDefaultMutator(
    Mutators.SpecificKeyFieldKVMutator((doc) => doc.id)
  )

  const clubDisplayCol = new FirestoreCollection<ClubDisplayCollection>('clubDisplay').setDefaultMutator(
    Mutators.SpecificKeyFieldKVMutator((doc) => doc.id)
  )

  const clubData = await clubCol.fetch()
  const clubDisplayData = await clubDisplayCol.fetch()

  if (!clubData) {
    debug.err('No club data found')
    return
  }

  const acceptedClubId = clubData.map((k, v) => {
    if (v.get("status") !== "accepted") return
    return k
  })

  if (!acceptedClubId) {
    debug.err('No accepted club data found')
    return
  }

  

}
