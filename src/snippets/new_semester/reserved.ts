import { DMapUtil, FirestoreCollection } from '@lib'
import type { ClubDataCollection, Debugger, UserDataCollectionType } from '@lib'

export const ReservedSnippet = async (debug: Debugger) => {
  const stdColl = new FirestoreCollection<UserDataCollectionType>('data')
  const clubColl = new FirestoreCollection<ClubDataCollection>('clubs')

  const [clubData, stdData] = await Promise.all([
    clubColl.fetch(),
    stdColl.fetch()
  ])

  if (!clubData || !stdData) return

  function getStdType(clubID: string, type: "waiting" | "rejected" | "confirmed" | "passed" | "reserved" | "failed") {
    const data = stdData.map((k, v) => {
      const auditions = v.get('audition')
      if (!auditions) return
      if (auditions[clubID] === type) {
        return v
      }
      return
    }).filter((v) => v !== undefined && v !== null)
    return data
  }

  clubData.map((clubId, v) => {
    // Skip this since it was manually updated
    if (clubId === "ก30903-1") return
    // @ts-ignore
    if (v.get('audition') && v.get('report') !== true && v.get("new_count") < v.get("new_count_limit")) {

      // Rejecting wating students 
      const waitingStd = getStdType(clubId, "waiting")
      waitingStd.map((v) => {
        v?.update('audition', {
          ...v?.get('audition'),
          [clubId]: 'rejected'
        })
      })

      // Rejecting passed students but not confirmed or rejected
      const passedStd = getStdType(clubId, "passed")
      passedStd.map((v) => {
        v?.update('audition', {
          ...v?.get('audition'),
          [clubId]: 'rejected'
        })
      })

      let remain = v.get("new_count_limit") - v.get("new_count")

      // If there is remaining slots
      if (remain > 0) {
        const stdReserved = getStdType(clubId, "reserved")

        const sortedReserved = stdReserved.sort((a, b) => {
          const posA = a?.get('position')?.[clubId] ?? Infinity
          const posB = b?.get('position')?.[clubId] ?? Infinity
          return posA - posB
        })

        if (stdReserved.length <= remain) {
          sortedReserved.map((v, i) => {
            v?.update('audition', {
              ...v?.get('audition'),
              [clubId]: 'passed'
            })
          })
          return
        } else if (sortedReserved.length > remain) {
          sortedReserved.slice(0, remain).map((v, i) => {
            v?.update('audition', {
              ...v?.get('audition'),
              [clubId]: 'passed'
            })
          })
        }

        // If reserved students are less than remaining slots then update the call count
        if (stdReserved.length < remain) {
          remain = stdReserved.length
        }

        v.update('call_count', 0)
      }
    }
  })

  const clubChangeLists = DMapUtil.setFileName('reserved-club-2').buildChanges(clubData)
  const stdChangeLists = DMapUtil.setFileName('reserved-student-2').buildChanges(stdData)

  // stdColl.pushChanges(stdChangeLists, false)
  // clubColl.pushChanges(clubChangeLists, false)

}
