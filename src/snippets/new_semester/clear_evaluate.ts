import type { Debugger, EvaluateCollectionType } from "@lib";
import { DMapUtil, FirestoreCollection, Mutators } from "@lib";

export const ClearEvaluate = async (debug: Debugger) => {
  const evalCol = new FirestoreCollection<EvaluateCollectionType>('evaluate').setDefaultMutator(
    Mutators.SpecificKeyFieldKVMutator((doc) => doc.id)
  )

  const evalData = await evalCol.readFromCache(true)

  if(!evalData) {
    debug.err("Failed to read evaluate data from cache")
    return
  }

  evalData.iterateSync((k, v) => v.delete())

  const changes = DMapUtil.setFileName('clear-evaluate').buildChanges(evalData)
  //evalCol.pushChanges(changes, false)  

}
