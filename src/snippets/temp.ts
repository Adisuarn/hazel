import { ClubDataCollection, DMap, DMapUtil, ExcelDataSource, FirestoreCollection, IUserData, Mutators, ReferableMapEntity, UserCredCollectionType, UserDataCollectionType, UserRef, UserRefCollection, Workbook, Worksheet, type Debugger } from "@lib";

export const TempSnippet = async (debug: Debugger) => {
  const stdCol = new FirestoreCollection<UserDataCollectionType>('data')
  const stdData = await stdCol.readFromCache()

  const clubCol = new FirestoreCollection<ClubDataCollection>('clubs')
  const clubData = await clubCol.readFromCache()

  if (!stdData || !clubData) {
    debug.err("Failed to fetch data from Firestore collections.");
    return;
  }
  //@ts-ignore
  const filteredClub = clubData.filter((k, v) => v.get('report') !== true)

  // const filteredData = stdData.filter((k, v) => v.get('room') !== "111" && v.get('room') !== "888" && v.get('room') !== "999" && v.get('title') !== "ครู" && v.get('club') !== "")

  const filteredData = stdData.filter((k, v) => v.get('room') !== "111" && v.get('room') !== "888" && v.get('room') !== "999" && v.get('title') !== "ครู" && v.get('club') === "ก30909-1")
  const club = (filteredClub.map((k, v) => {
    if (k === "ก30909-1") return v
    return null
  })).filter((v) => v !== null && v !== undefined)[0]

  let new_count = 0;
  let old_count = 0;

  let m4 = 0;
  let m5 = 0;
  let m6 = 0;

  filteredData.iterateSync((k, v) => {

    if (club?.get('committees')?.includes(v.get('student_id'))) return

    if (v.get('level') === "4") m4 += 1
    if (v.get('level') === "5") m5 += 1
    if (v.get('level') === "6") m6 += 1

    if (v.get('old_club') !== v.get('club') && !club?.get('committees')?.includes(v.get('student_id'))) {
      new_count += 1
      
      return
    }
    if (v.get('old_club') !== v.get('club') && club?.get('committees')?.includes(v.get('student_id'))) {
      return
    }

    if (v.get('club') === v.get('old_club') && !club?.get('committees')?.includes(v.get('student_id'))) {
      const audition = v.get('audition');
      if (audition && Object.keys(audition).find((a) => a === v.get('club'))) {
        new_count += 1
        return
      }
      
      old_count += 1
      return
    }

    if (v.get('club') === v.get('old_club') && club?.get('committees')?.includes(v.get('student_id'))) {
      return
    }
  })

  console.log('new_count', new_count);
  console.log('old_count', old_count);

  console.log('m4', m4);
  console.log('m5', m5);
  console.log('m6', m6);

  const log = filteredData.map((k, v) => {
    return {
      student_id: v.get('student_id'),
      old_club: v.get('old_club'),
      club: v.get('club'),
      level: v.get('level'),
    }
  }).filter((v) => v !== null && v !== undefined)

  debug.table(log)

  // const groupedData = filteredData.groupBy((v) => v.get('club'))

  // const logArray: any[] = []

  // groupedData.iterateSync((clubId, stdEntity) => {
  //   let old_count = 0;
  //   let new_count = 0;

  //   let m4 = 0;
  //   let m5 = 0;
  //   let m6 = 0;

  //   const club = (filteredClub.map((k, v) => {
  //     if (k === clubId) return v
  //     return null
  //   })).filter((v) => v !== null && v !== undefined)[0]

  //   new DMap(stdEntity).iterateSync((k, v) => {

  //     if (v.get('level') === "4") m4 += 1
  //     if (v.get('level') === "5") m5 += 1
  //     if (v.get('level') === "6") m6 += 1

  //     if (v.get('old_club') !== v.get('club') && !club?.get('committees')?.includes(v.get('student_id'))) {
  //       new_count += 1
  //       return
  //     }
  //     if (v.get('old_club') !== v.get('club') && club?.get('committees')?.includes(v.get('student_id'))) {
  //       return
  //     }

  //     if (v.get('club') === v.get('old_club') && !club?.get('committees')?.includes(v.get('student_id'))) {
  //       const audition = v.get('audition');
  //       if (audition && Object.keys(audition).find((a) => a === v.get('club'))) {
  //         new_count += 1
  //         return
  //       }
  //       old_count += 1
  //       return
  //     } 

  //     if (v.get('club') === v.get('old_club') && club?.get('committees')?.includes(v.get('student_id'))) {
  //       return
  //     }
  //   })

  //   if(club?.get('old_count') !== old_count) {
  //     club?.update("old_count", old_count)
  //   }

  //   if(club?.get('new_count') !== new_count) {
  //     club?.update("new_count", new_count)
  //   }

  //   logArray.push({
  //     clubId,
  //     new_count,
  //     old_count,
  //     m4,
  //     m5,
  //     m6,
  //   })
  // })

  // const changeList = DMapUtil.buildChanges(clubData)

  // clubCol.pushChanges(changeList, false)

  // debug.table(logArray);
}
