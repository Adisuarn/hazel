import { FirestoreCollection, ExcelDataSource, DMapUtil } from "@lib";
import type { Debugger, UserDataCollectionType } from "@lib";
import path from "path";

export const updateOldStd = async (debug: Debugger) => {
  const stdColl = new FirestoreCollection<UserDataCollectionType>('data');
  const stdData = await stdColl.fetch();
  
  const m5Excel = (await new ExcelDataSource(path.join(__dirname, '../m5_ruj.xlsx')).resolve()).getSheet(0)?.getRecords();
  const m6Excel = (await new ExcelDataSource(path.join(__dirname, '../m6_ruj.xlsx')).resolve()).getSheet(0)?.getRecords();

  let old_studentData: {
    student_id: string;
    room: string;
    number: string;
    level: string;
  }[] = [];

  m5Excel?.forEach((item) => {
    old_studentData.push({
      student_id: item["1"]!,
      room: item["4"]!,
      number: item["5"]!,
      level: "5"
    });
  })

  m6Excel?.forEach((item) => {
    old_studentData.push({
      student_id: item["1"]!,
      room: item["4"]!,
      number: item["5"]!,
      level: "6"
    });
  });

  old_studentData.map((item) => {
    const std = stdData.findValues((v) => v.get('student_id') === item.student_id)[0];

    if (!std) {
      debug.err(`Student with ID ${item.student_id} not found`);
      return;
    }

    std.update('room', item.room);
    std.update('number', item.number);
    std.update('level', item.level);
  })

  const changes = DMapUtil.setFileName('old-student-update').buildChanges(stdData);

  stdColl.pushChanges(changes, false)
  
}
