import { Mutators, FirestoreCollection, DMap, IDUtil } from "@lib";
import type { Debugger, UserDataCollectionType, IUserData, ReferableMapEntity } from '@lib';
import Excel from 'exceljs';
import path from 'path';

interface studentOfClub {
    studentID: string | undefined;
    title: string | undefined;
    firstname: string | undefined;
    lastname: string | undefined;
    level: string | undefined;
    room: string | undefined;
    number: string | undefined;
    club: string | undefined;
}

const clubsID = [
    "ก30901",
    "ก30901-1",
    "ก30901-2",
    "ก30901-3",
    "ก30901-4",
    "ก30901-5",
    "ก30901-6",
    "ก30901-7",
    "ก30901-8",
    "ก30902",
    "ก30902-1",
    "ก30903-1",
    "ก30903-2",
    "ก30903-3_1",
    "ก30903-3_2",
    "ก30903-4",
    "ก30903-5",
    "ก30904",
    "ก30905-1",
    "ก30905-2_1",
    "ก30905-2_2",
    "ก30905-2_6",
    "ก30905-2_7",
    "ก30905-2_9",
    "ก30905-3",
    "ก30905-4",
    "ก30905-8",
    "ก30905-9",
    "ก30905-10",
    "ก30905-11",
    "ก30905-13",
    "ก30905-14",
    "ก30905-15",
    "ก30905-16",
    "ก30905-17",
    "ก30905-18",
    "ก30905-19",
    "ก30909",
    "ก30909-1",
    "ก30909-2",
    "ก30910",
    "ก30911",
    "ก30912",
    "ก30913",
    "ก30914",
    "ก30915_1",
    "ก30915_2",
    "ก30915_4",
    "ก30916",
    "ก30918",
    "ก30920-1",
    "ก30920-2",
    "ก30920-3",
    "ก30920-4",
    "ก30920-5",
    "ก30920-7",
    "ก30920-8",
    "ก30920-9",
    "ก30921_1",
    "ก30921_2",
    "ก30922",
    "ก30923",
    "ก30924",
    "ก30925",
    "ก30927",
    "ก30928",
    "ก30929",
    "ก30929-1",
    "ก30932",
    "ก30934",
    "ก30937",
    "ก30941_1",
    "ก30941_2",
    "ก30941_3",
    "ก30941_4",
    "ก30942_1",
    "ก30942_2",
    "ก30942_3",
    "ก30942_4",
    "ก30943",
    "ก30945",
    "ก30946-1",
    "ก30946_1",
    "ก30946_2",
    "ก30946_3",
    "ก30946_4",
    "ก30947",
    "ก30947-1",
    "ก30950",
    "ก30951",
    "ก30952-2",
    "ก30952-3",
    "ก30952-4",
    "ก30952-5",
    "ก30952-6",
    "ก30952-7",
    "ก30953",
    "ก30953-1",
    "ก30957"
]

async function fetchData(): Promise<DMap<string, ReferableMapEntity<IUserData>>[]> {
    const users = new FirestoreCollection<UserDataCollectionType>('data').setDefaultMutator(
        Mutators.SpecificKeyFieldKVMutator((doc) => doc.get('student_id'))
    );
    const userData = await users.readFromCache(true);

    if (!userData) {
        return [];
    }
    return [userData]; // Wrap the userData object in an array
}

function getStudentInClub(userData: DMap<string, ReferableMapEntity<IUserData>>, clubID: string | undefined): studentOfClub[] {
    const students = userData.findValues((userDataItem: any) => `${userDataItem.get('club')}` === clubID);
    return students.map((v: any) => {
        return {
            studentID: v.get('student_id').toString(),
            title: v.get('title').toString(),
            firstname: v.get('firstname').toString(),
            lastname: v.get('lastname').toString(),
            level: v.get('level').toString(),
            room: v.get('room').toString(),
            number: v.get('number').toString(),
            club: v.get('club').toString(),
            clubname: IDUtil.translateToClubName(v.get('club').toString())
        };
    });
}

async function generateExcelFile(data: { [key: string]: studentOfClub[] }): Promise<void> {
    const workbook = new Excel.Workbook();

    for (const clubID in data) {
        const worksheet = workbook.addWorksheet(clubID);
        worksheet.columns = [
            { key: 'studentID', header: 'รหัสนักเรียน' },
            { key: 'title', header: 'คำนำหน้า' },
            { key: 'firstname', header: 'ชื่อ' },
            { key: 'lastname', header: 'นามสกุล' },
            { key: 'level', header: 'ชั้น' },
            { key: 'room', header: 'ห้อง' },
            { key: 'number', header: 'เลขที่' },
            { key: 'club', header: 'รหัสชมรม' },
            { key: 'clubname', header: 'ชื่อชมรม' },
        ];

        const students = data[clubID] ?? []; // Provide a default empty array if data[clubID] is undefined

        students.forEach((item) => {
        if(item.level === "9") return;
        worksheet.addRow(item);
    });
}

    const exportPath = path.resolve('resource/collection/studentOfClub/', `all_clubs.xlsx`);
    await workbook.xlsx.writeFile(exportPath);
}

const getStdInAllClubsSnippet = async (debug: Debugger) => {
    try {
        const [userData]: DMap<string, ReferableMapEntity<IUserData>>[] = await fetchData();

        if (!userData) {
            console.log('No student data found.');
            return;
        } else {
            const clubData: { [key: string]: studentOfClub[] } = {};

            for (let i = 0; i < clubsID.length; i++) {
                let clubID = clubsID[i];
                if (clubID !== undefined) {
                    clubData[clubID] = getStudentInClub(userData, clubID);
                }
            }

            await generateExcelFile(clubData);
            console.log('สร้างใบรายชื่อชมรมเรียบร้อย');
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
};

export { getStdInAllClubsSnippet };
