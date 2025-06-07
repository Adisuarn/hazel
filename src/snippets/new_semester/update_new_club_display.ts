import { ClubDisplayCollection, DMapUtil, FirestoreCollection, IDUtil, Mutators, UserDataCollectionType } from '@lib'
import type { Debugger, ClubDataCollection, ClubDisplay } from '@lib'

export const updateNewClubDisplay = async (debug: Debugger) => {

  const clubCol = new FirestoreCollection<ClubDataCollection>('clubs').setDefaultMutator(
    Mutators.SpecificKeyFieldKVMutator((doc) => doc.id)
  )

  const clubDisplayCol = new FirestoreCollection<ClubDisplayCollection>('clubDisplay').setDefaultMutator(
    Mutators.SpecificKeyFieldKVMutator((doc) => doc.id)
  )

  const clubDisplayPendingCol = new FirestoreCollection<ClubDisplayCollection>('clubDisplayPending').setDefaultMutator(
    Mutators.SpecificKeyFieldKVMutator((doc) => doc.id)
  )

  const clubData = await clubCol.fetch()
  const clubDisplayData = await clubDisplayCol.fetch()
  const clubDisplayPendingData = await clubDisplayPendingCol.fetch()

  if (!clubData) {
    debug.err('No club data found')
    return
  }

  // Filter only accepted clubs
  const acceptedClubId = [...new Set(clubData.map((k, v) => {
    if (v.get("status") !== "accepted") return 
    // @ts-ignore
    if (v.get("report") === true) return undefined
    if (k.includes("_")) return k.split("_")[0]
    return k
  }).filter((k) => k !== undefined))]

  if (!acceptedClubId) {
    debug.err('No accepted club data found')
    return
  }


  acceptedClubId.map((clubId) => {
    if(!clubId) return
    // Get Pending Club Display
    const clubDisplayPending = clubDisplayPendingData.map((k, v) => {
      if (k !== clubId) return
      return v.data()
    }).filter((data) => data !== undefined)[0] as ClubDisplay

    if (!clubDisplayPending) {
      debug.err(`No pending club display found for clubId: ${clubId}`)
      return
    }

    // Get Club Data
    const currentClubDisplay = clubDisplayData.map((k, v) => {
      if (k !== clubId) return
      return v
    }).filter((data) => data !== undefined)[0]

    if (!currentClubDisplay) {
      debug.err(`No current club display found for clubId: ${clubId}`)
      return
    }

    // Update Club Display
    currentClubDisplay.set(clubDisplayPending)

    // Update club display status to empty
    clubData.map((k, v) => {
      if (k.includes(clubId) && k.includes("_")) {
        v.update("status", "")
        return
      }
      if (k !== clubId) return
      v.update("status", "")
    })

  })

  const clubDisplayChangeList = DMapUtil.setFileName('clubDisplay').buildChanges(clubDisplayData)
  const clubChangeList = DMapUtil.setFileName('clubs').buildChanges(clubData)

  // clubDisplayCol.pushChanges(clubDisplayChangeList, false)
  // clubCol.pushChanges(clubChangeList, false)

}
