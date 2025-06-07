import { ReferableMapEntity, SimulatedCollection, SimulatedDataPresets, DMapUtil } from "@lib";
import type { Debugger, IUserData } from "@lib";

export const pushDataSnippet = async (debug: Debugger) => {
  /*
  This example demonstrates how to update and push data to collection.
   */

  // Initialize user data collection.
  const stdColl = new SimulatedCollection('data', SimulatedDataPresets.RandomStudents());

  // Fetch data from collection without cache.
  const stdData = await stdColl.fetch()

  // Iterate through each user data entity in the collection.
  stdData.iterateSync((k, v) => {
    // Update the 'firstname' field to 'John' for the user with 'number' field equal to "1".
    if (v.get('number') === "1") {
      debug.info(`Updating student ${v.get('student_id')} firstname to John`);
      v.update('firstname', 'John')
    }
  })

  // This is an example of how to insert a new student entity.
  const new_student = new ReferableMapEntity<IUserData>({
    student_id: '99999',
    firstname: 'เรียนเด่น',
    lastname: 'เล่นดี',
    number: '2',
    title: 'นาย',
    level: '4',
    room: '999',
    club: 'ก40000'
  }, '99999')

  // Set metadata for the new student entity.
  new_student.setMetadata({
    reason: 'New student added',
  })

  stdData.insert(new_student)

  // This is an example of how to delete a student entity.
  const student = stdData.findValues((v) => v.get('student_id') === '99999')[0]
  if (student) {
    student.delete()
  }
  
  // Create changeList for reviewing and pushing changes.
  const changes = DMapUtil.setFileName('update_student').buildChanges(stdData)

  // Push changes to the collection.
  stdColl.pushChanges(changes, false)
}
