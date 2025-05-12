import { FirestoreCollection, Mutators, UserDataCollectionType } from '@lib'
import type { Debugger, ClubDataCollection } from '@lib'
import { CardCollection } from 'lib/builtin/types/Card'

export const generateCardCommittee = async (debug: Debugger) => {
  const stdCol = new FirestoreCollection<UserDataCollectionType>('data').setDefaultMutator(
    Mutators.SpecificKeyFieldKVMutator((doc) => doc.get('student_id'))
  )

  const clubCol = new FirestoreCollection<ClubDataCollection>('clubs').setDefaultMutator(
    Mutators.SpecificKeyFieldKVMutator((doc) => doc.id)
  )

  const cardCol = new FirestoreCollection<CardCollection>('cards').setDefaultMutator(
    Mutators.SpecificKeyFieldKVMutator((doc) => doc.id)
  )

  const stdData = await stdCol.fetch()
  const cardData = await cardCol.fetch()
  const clubData = await clubCol.fetch()

  if (!stdData || !clubData || !cardData) {
    debug.err('No data found')
    return
  }

  

}
