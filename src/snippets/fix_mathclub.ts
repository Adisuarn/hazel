import { FirestoreCollection, IDUtil } from '@lib'
import type { ClubDataCollection, Debugger, UserDataCollectionType } from '@lib'

export const FixMathClub = async (debug: Debugger) => {
  const clubColl = new FirestoreCollection<ClubDataCollection>('clubs')
  const stdColl = new FirestoreCollection<UserDataCollectionType>('data')

  const [
    clubData,
    stdData
  ] = await Promise.all([
    clubColl.fetch(),
    stdColl.fetch()
  ])

  
}
