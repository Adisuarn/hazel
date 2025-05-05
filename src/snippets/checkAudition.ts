import { ClubRecord, FirestoreCollection, IDUtil } from '@lib'
import type { Debugger, ClubDataCollection } from '@lib'
import Excel from 'exceljs'
import path from 'path'

interface Data {
	id: string
	name: string
}

async function fetchClubData(): Promise<Data[]> {
	const evalCol = new FirestoreCollection<ClubDataCollection>('clubs')
	const evalData = await evalCol.readFromCache(true)

	if (!evalData) {
		return []
	}

	const evalRecords = new ClubRecord(evalData.getRecord())

	return evalRecords.map((clubId, v) => ({
		id: IDUtil.applyOverriddenLayer(clubId),
    name: v.get('title'),
		audition: v.get('audition'),
		place: v.get('place'),
		committee: v.get('committees')?.toString(),
		teacher_count: v.get('teacher_count'),
		count_limit: v.get('count_limit'),
		old_count: v.get('old_count'),
		old_count_limit: v.get('old_count_limit'),
		new_count: v.get('new_count'),
		new_count_limit: v.get('new_count_limit')
	}))
}

async function generateExcelFile(data: Data[]): Promise<void> {
	const workbook = new Excel.Workbook()
	const worksheet = workbook.addWorksheet('รายชื่อชมรม')

	worksheet.columns = [
		{ key: 'id', header: 'รหัสชมรม' },
        { key: 'name', header: 'ชื่อชมรม' },
		{ key: 'audition', header: 'audition' },
		{ key: 'place', header: 'place' },
		{ key: 'committee', header: 'commitee' },
		{ key: 'teacher_count', header: 'teacher_count' },
		{ key: 'count_limit', header: 'count_limit' },
		{ key: 'old_count', header: 'old_count'},
		{ key: 'old_count_limit', header: 'old_count_limit' },
		{ key: 'new_count', header: 'new_count' },
		{ key: 'new_count_limit', header: 'new_count_limit'}
	]

	data.forEach((item) => {
		worksheet.addRow(item)
	})

	const exportPath = path.resolve(__dirname, 'clublists.xlsx')
	await workbook.xlsx.writeFile(exportPath)
}

export const CheckAuditionSnippet = async (debug: Debugger) => {
	try {
		const clubData = await fetchClubData()

		if (clubData.length === 0) {
			console.log('No club data found.')
			return
		}

		await generateExcelFile(clubData)
		console.log('Excel file generated successfully.')
	} catch (error) {
		console.error('An error occurred:', error)
	}
}
