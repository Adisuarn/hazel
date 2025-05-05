// there is an empty document in the collection. My error is that old_club is undefined please recheck this
// this doc id seem like to have an problem c9SdViZIqZEsxqmn7vgs

import { FirestoreCollection, Mutators, DMapUtil, IDUtil  } from '@lib'
import type { ClubData, Debugger } from '@lib'

export const resetNewSemesterClub = async (debug: Debugger) => {
  const clubCol = new FirestoreCollection('clubs').setDefaultMutator(
    Mutators.SpecificKeyFieldKVMutator((doc) => doc.id)
  )

  const userCol = new FirestoreCollection('data').setDefaultMutator(
    Mutators.SpecificKeyFieldKVMutator((doc) => doc.get('student_id'))
  )

  const clubData = await clubCol.fetch()
  const userData = await userCol.fetch()

  if (!clubData || !userData) {
    debug.err('No data found in cache')
    return
  }

  clubData.map((k, v) => {

    const clubId = k
    const clubData = v.data() as ClubData
    const committees = clubData.committees as string[] | undefined

    // Update report to true if club is not in system clubs (removed club)
    if (!IDUtil.systemClubs.hasKey(clubId)) {
      v.set({
        ...clubData,
        report: true
      })
      return
    }

    const new_count_limit = clubData.count_limit - clubData.old_count_limit - (clubData.committees?.length || 0)

    //Reset club members
    v.update('old_count', 0)
    v.update('new_count', 0)
    v.update('new_count_limit', new_count_limit)

    // Assign committee to club
    if (committees) {
      committees.map((committeeId) => {
        const student = userData.findValues((v) => v.get('student_id') === committeeId)[0]
        if (!student) {
          debug.err(`Student ${committeeId} not found in user data for club ${clubId}`)
          return
        }
        const presentClub = student.get('club')
        
        //Make present club to old club
        student.update('old_club', presentClub)

        //Assign committee'club to new club
        student.update('club',  clubId)
      })
    }
  })

  // Reset student present club
  userData.map((k, v) => {
    const studentId = k
    const studentData = v

    // Ignore if student is in committee / teacher 
    const isCommittee = clubData.findValues((v) => v.get('committees')?.includes(studentId))[0] ? true : false
    if (isCommittee 
      || studentData.get("level") === "9" 
      || studentData.get("room") === "111"
      || studentData.get("number") === "53"
      || studentData.get("title") === "ครู"
    ) return
    
    const std_present_club = studentData.get('club')

    //Move present club to old club
    studentData.update('old_club', std_present_club)
    
    // Remove present club
    studentData.update('club', "")

  })

  const clubChangeList = DMapUtil.buildChanges(clubData, 'club')
  const userChangeList = DMapUtil.buildChanges(userData, 'user')
  // Push changes to Firestore

  new FirestoreCollection('clubs').pushChanges(clubChangeList)
  new FirestoreCollection('data').pushChanges(userChangeList)
}
