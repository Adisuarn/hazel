import type { Debugger, UserCredCollectionType, ClubDataCollection, UserDataCollectionType, ReferableMapEntity, IUserData } from "@lib";
import { DMapUtil, FirestoreCollection, IDUtil, Workbook, Worksheet } from "@lib";

export const RandomClub = async (debug: Debugger) => {

  const clubColl = new FirestoreCollection<ClubDataCollection>('clubs');
  const dataColl = new FirestoreCollection<UserDataCollectionType>('data');

  const [
    clubData,
    stdData,
  ] = await Promise.all([
    clubColl.fetch(),
    dataColl.fetch(),
  ]);

  let m4: ReferableMapEntity<IUserData>[] = []
  let m5: ReferableMapEntity<IUserData>[] = []
  let m6: ReferableMapEntity<IUserData>[] = []

  // ก30902 -> วิทย์, ก30951 -> โลกศาสตร์, ก30904 -> ไทย
  stdData.filter((k, v) => v.get('room') !== "9" && v.get('title') !== "ครู" && v.get('club') === "").map((k, v) => {
    //@ts-ignore
    if (!v.get('room') && v.get('identification') && v.get('level') === "4") m4.push(v)
    // @ts-ignore
    if (v.get('room') && v.get('number') && v.get('level') === "4" && !v.get('identification')) m5.push(v)
    if (v.get('room') && v.get('number') && v.get('level') === "5") m6.push(v)
  })

  const updatedDataM4: {
    student_id: string,
    firstname: string,
    lastname: string,
    random_club: string,
    clubName: string,
    level: string,
  }[] = []

  const updatedDataM5: {
    student_id: string,
    firstname: string,
    lastname: string,
    random_club: string,
    clubName: string,
    level: string,
  }[] = []

  const updatedDataM6: {
    student_id: string,
    firstname: string,
    lastname: string,
    random_club: string,
    clubName: string,
    level: string,
  }[] = []

  m4.map((v, idx) => {
    if(idx <= 11) {
      const new_old_club = v.get('club')
      v.update('old_club', new_old_club)
      v.update('club', 'ก30904')
      updatedDataM4.push({
        student_id: v.get('student_id'),
        firstname: v.get('firstname'),
        lastname: v.get('lastname'),
        random_club: 'ก30904',
        clubName: IDUtil.translateToClubName('ก30904'),
        level: v.get('level').toString(),
      })
    } else if (idx > 11 && idx <= 14) {
      const new_old_club = v.get('club')
      v.update('old_club', new_old_club)
      v.update('club', 'ก30951')
      updatedDataM4.push({
        student_id: v.get('student_id'),
        firstname: v.get('firstname'),
        lastname: v.get('lastname'),
        random_club: 'ก30951',
        clubName: IDUtil.translateToClubName('ก30951'),
        level: '4',
      })
    } else if (idx > 14 && idx <= 34) {
      const new_old_club = v.get('club')
      v.update('old_club', new_old_club)
      v.update('club', 'ก30902')
      updatedDataM4.push({
        student_id: v.get('student_id'),
        firstname: v.get('firstname'),
        lastname: v.get('lastname'),
        random_club: 'ก30902',
        clubName: IDUtil.translateToClubName('ก30902'),
        level: '4',
      })
    }
  })

  m5.map((v, idx) => {
    if(idx <= 35) {
      const new_old_club = v.get('club')
      v.update('old_club', new_old_club)
      v.update('club', 'ก30904')
      updatedDataM5.push({
        student_id: v.get('student_id'),
        firstname: v.get('firstname'),
        lastname: v.get('lastname'),
        random_club: 'ก30904',
        clubName: IDUtil.translateToClubName('ก30904'),
        level: '5',
      })
    } else if (idx > 35 && idx <= 43) {
      const new_old_club = v.get('club')
      v.update('old_club', new_old_club)
      v.update('club', 'ก30951')
      updatedDataM5.push({
        student_id: v.get('student_id'),
        firstname: v.get('firstname'),
        lastname: v.get('lastname'),
        random_club: 'ก30951',
        clubName: IDUtil.translateToClubName('ก30951'),
        level: '5',
      })
    } else if (idx > 43 && idx <= 99) {
      const new_old_club = v.get('club')
      v.update('old_club', new_old_club)
      v.update('club', 'ก30902')
      updatedDataM5.push({
        student_id: v.get('student_id'),
        firstname: v.get('firstname'),
        lastname: v.get('lastname'),
        random_club: 'ก30902',
        clubName: IDUtil.translateToClubName('ก30902'),
        level: '5',
      })
    }
  })

  m6.map((v, idx) => {
    if(idx <= 39) {
      const new_old_club = v.get('club')
      v.update('old_club', new_old_club)
      v.update('club', 'ก30904')
      updatedDataM6.push({
        student_id: v.get('student_id'),
        firstname: v.get('firstname'),
        lastname: v.get('lastname'),
        random_club: 'ก30904',
        clubName: IDUtil.translateToClubName('ก30904'),
        level: '6',
      })
    } else if (idx > 39 && idx <= 48) {
      const new_old_club = v.get('club')
      v.update('old_club', new_old_club)
      v.update('club', 'ก30951')
      updatedDataM6.push({
        student_id: v.get('student_id'),
        firstname: v.get('firstname'),
        lastname: v.get('lastname'),
        random_club: 'ก30951',
        clubName: IDUtil.translateToClubName('ก30951'),
        level: '6',
      })
    } else if (idx > 48 && idx <= 118) {
      const new_old_club = v.get('club')
      v.update('old_club', new_old_club)
      v.update('club', 'ก30902')
      updatedDataM6.push({
        student_id: v.get('student_id'),
        firstname: v.get('firstname'),
        lastname: v.get('lastname'),
        random_club: 'ก30902',
        clubName: IDUtil.translateToClubName('ก30902'),
        level: '6',
      })
    }
  })

  const M4Sheet = new Worksheet(updatedDataM4).setName('ม.4');
  const M5Sheet = new Worksheet(updatedDataM5).setName('ม.5');
  const M6Sheet = new Worksheet(updatedDataM6).setName('ม.6');
  const wb = new Workbook([M4Sheet, M5Sheet, M6Sheet]);
  wb.save('random_club_data.xlsx');

  const thai = clubData.findValues(v => v.document === "ก30904")[0]
  const thai_new_count = thai?.get('new_count') || 0
  thai?.update('new_count', thai_new_count + 88)

  const science = clubData.findValues(v => v.document === "ก30902")[0]
  const science_new_count = science?.get('new_count') || 0
  science?.update('new_count', science_new_count + 146)

  const earth = clubData.findValues(v => v.document === "ก30951")[0]
  const earth_new_count = earth?.get('new_count') || 0
  earth?.update('new_count', earth_new_count + 20)

  const stdChangeLists = DMapUtil.setFileName('random-students').buildChanges(stdData)
  const clubChangeLists = DMapUtil.setFileName('random-students-club').buildChanges(clubData);

  dataColl.pushChanges(stdChangeLists, false)
  clubColl.pushChanges(clubChangeLists, false);

}
