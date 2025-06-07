import { ClubDataCollection, DMap, DMapUtil, ExcelDataSource, FirestoreCollection, IUserData, Mutators, ReferableMapEntity, UserCredCollectionType, UserDataCollectionType, UserRef, UserRefCollection, Workbook, Worksheet, type Debugger } from "@lib";
import path from "path";

export const TempSnippet = async (debug: Debugger) => {
  const stdColl = new FirestoreCollection<UserDataCollectionType>('data')
  const clubColl = new FirestoreCollection<ClubDataCollection>('clubs')

  const [
    stdData,
    clubData
  ] = await Promise.all([
    stdColl.fetch(),
    clubColl.fetch()
  ])

  const stdID = [
    "64596", "64599", "64647", "64752", "64767", "64980", "65476", "65756",
    "65981", "66015", "66104", "66358", "66509", "66567", "66601", "66679",
    "66872", "66879", "66917", "64651", "65410", "65485", "64619", "65217",
    "65304", "65026", "64766", "65487", "64352", "65281", "64918", "65058",
    "65177", "65291", "65083", "64681", "65665", "64721", "65155", "64843",
    "64885", "64025", "65520", "64873", "65123", "64288", "64861", "65047",
    "65597", "64601", "64811", "62897", "64872", "65672", "64309", "65046", 
    "65361", "64079", "62994", "65438"
  ]

  let data: Record<string, ReferableMapEntity<IUserData>>[] = []

  let scienceClub = 0;
  let thaiClub = 0;
  let earthClub = 0;

  stdID.forEach((id) => {
    const std = stdData.findValues((v) => v.get('student_id') === id)[0]
    if (!std) {
      debug.err(`Student with ID ${id} not found`)
      return
    }
    data.push({
      [id]: std
    })

    std.setMetadata({
      studentID: id,
    })

    std.delete()
  })

  const mappedData = new DMap(data).groupBy((v) => v.get('club'))

  mappedData.iterateSync((k, v) => {
    if (k === "ก30902") scienceClub = v.length;
    if (k === "ก30904") thaiClub = v.length;
    if (k === "ก30951") earthClub = v.length;
  })

  clubData.iterateSync((k, v) => {
    if (k === "ก30902") v.update('new_count', v.get('new_count') - scienceClub) && v.setMetadata({
      reason: 'Remove resign students from club',
    });
    if (k === "ก30904") v.update('new_count', v.get('new_count') - thaiClub) && v.setMetadata({
      reason: 'Remove resign students from club' 
    });
    if (k === "ก30951") v.update('new_count', v.get('new_count') - earthClub) && v.setMetadata({
      reason: 'Remove resign students from club'
    });
  })

  const stdChange = DMapUtil.setFileName('remove-resign').buildChanges(stdData)
  const clubChange = DMapUtil.setFileName('remove-resign-club').buildChanges(clubData)

  // stdColl.pushChanges(stdChange, false)
  // clubColl.pushChanges(clubChange, false)
}
