import { ClubDataCollection, DMap, DMapUtil, ExcelDataSource, FirestoreCollection, IUserData, Mutators, ReferableMapEntity, UserCredCollectionType, UserDataCollectionType, UserRef, UserRefCollection, Workbook, Worksheet, type Debugger } from "@lib";
import path from "path";

export const TempSnippet = async (debug: Debugger) => {
  const stdColl = new FirestoreCollection<UserDataCollectionType>('data')
  const clubColl = new FirestoreCollection<ClubDataCollection>('clubs')

  const [
    stdData,
  ] = await Promise.all([
    stdColl.fetch(),
  ])

  // const stdID = [
  //   "64596", "64599", "64647", "64752", "64767", "64980", "65476", "65756",
  //   "65981", "66015", "66104", "66358", "66509", "66567", "66601", "66679",
  //   "66872", "66879", "66917", "64651", "65410", "65485", "64619", "65217",
  //   "65304", "65026", "64766", "65487", "64352", "65281", "64918", "65058",
  //   "65177", "65291", "65083", "64681", "65665", "64721", "65155", "64843",
  //   "64885", "64025", "65520", "64873", "65123", "64288", "64861", "65047",
  //   "65597", "64601", "64811", "62897", "64872", "65672", "64309", "65046", 
  //   "65361", "64079", "62994", "65438"
  // ]

  //@ts-ignore
  const identification = stdData.filter((k, v) => v.get('identification') === true)

}
