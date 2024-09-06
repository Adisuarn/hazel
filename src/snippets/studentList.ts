import { ClubRecord, FirestoreCollection, IDUtil, Mutators, DMap } from '@lib'
import type {
	Debugger,
	UserDataCollectionType,
	EvaluateCollectionType,
	IUserData,
	ReferableMapEntity,
	EvaluateType,
} from '@lib'

interface StudentInfo {
	cardID: string | undefined
	studentID: string | undefined
	title: string | undefined
	firstname: string | undefined
	lastname: string | undefined
	room: string | undefined
	level: string | undefined
	number: string | undefined
	club: string | undefined
	clubname: string | undefined
	old_club: string | undefined
	old_clubname: string | undefined
	evaluation_result: string | undefined
}

async function fetchDataFromFirestore() {
    const students = new FirestoreCollection<UserDataCollectionType>('data')
    const studentsData = await students.readFromCache(true)
    return studentsData
}

export default async function getStudentsInfo(studentData : DMap<string, ReferableMapEntity<IUserData>> | null) {
    studentData = await fetchDataFromFirestore()
    if (studentData === null) return "No data found"
    for(let i in studentData) {
		const student = studentData.get(i)
        console.log(student.get('student_id'))
    }
}


