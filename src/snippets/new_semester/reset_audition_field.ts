import type { Debugger } from "@lib";
import { DMapUtil, FirestoreCollection, Mutators } from "@lib";

export const ResetAuditionField = async (debug: Debugger) => {
  const stdCol = new FirestoreCollection("data").setDefaultMutator(
    Mutators.SpecificKeyFieldKVMutator((doc) => doc.get('student_id'))
  )

  const stdData = await stdCol.fetch()

  if (!stdData) {
    debug.err('No data found')
    return
  }

  stdData.map((k, v) => {
    v.update('audition', {})
    const position = v.get("position")
    if (position && Object.keys(position).length > 0) v.update('position', {})

    const section = v.get("section")
    if (section && Object.keys(section).length > 0) v.update('section', {})
  })

  const removeAuditionChangeList = DMapUtil.buildChanges(stdData, 'remove-audition')
  //stdCol.pushChanges(removeAuditionChangeList, false)
}
