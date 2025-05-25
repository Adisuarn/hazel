import { FirestoreCollection, IDUtil } from '@lib'
import type { ClubDataCollection, Debugger, UserDataCollectionType } from '@lib'

export const PlayGroundSnippet = async (debug: Debugger) => {
  const stdColl = new FirestoreCollection<UserDataCollectionType>('data')
  const clubColl = new FirestoreCollection<ClubDataCollection>('clubs')

  const [clubData, stdData] = await Promise.all([
    clubColl.fetch(),
    stdColl.fetch()
  ])

  //@ts-ignore
  const auClub = clubData.findValues((v) => v.get('audition') === true && v.get('report') !== true)
  let clubs: string[] = []

  auClub.map((club) => {
    stdData.findValues((v) => {
      const auditions = v.get('audition')
      if (!auditions) return false
      Object.keys(auditions).forEach((key) => {
        if (auditions[club.document!] === "waiting") {
          
          if(!clubs.includes(club.document!)) clubs.push(club.document!)
          return true
        }
        return false
      })
      return false
    })
  })
  debug.table(clubs.map((club) => {
    return {
      clubName: IDUtil.translateToClubName(club),
      clubId: club,
    }
  }))
}
