import { FirestoreCollection, UserDataCollectionType } from '@lib'
import type { Debugger } from '@lib'

export const PlayGroundSnippet = async (debug: Debugger) => {
    const stdColl = new FirestoreCollection<UserDataCollectionType>('data')
      
    const stdData = await stdColl.fetch()
    if (!stdData) return

    let count = 0
    stdData.map((k, v) => {
      if (v.get("level") == "4" && v.get("student_id").length == 13) {
        console.log(v.get("student_id"))
        count += 1
      }
    })

    console.log(count)
}
