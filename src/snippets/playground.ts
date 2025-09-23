import { FirestoreCollection, ReferableMapEntity, DMapUtil, DMap, Workbook, Worksheet, IDUtil, Mutators, EvaluateCollectionType, ClubRecord } from '@lib'
import type { ClubDataCollection, Debugger, UserCredCollectionType, UserDataCollectionType, UserRefCollection } from '@lib'

export const PlayGroundSnippet = async (debug: Debugger) => {
	const evalCol = new FirestoreCollection<EvaluateCollectionType>('evaluate')
	const clubCol = new FirestoreCollection<ClubDataCollection>('clubs')
	const evalData = await evalCol.readFromCacheNoRef(true)
	const clubData = await clubCol.readFromCache(true)
  
	if (!evalData || !clubData) {
		debug.err('No eval or club data found')
		return
	}
  
	//@ts-ignore
	const filteredClub = clubData.filter((k, v) => v.get('report') !== true)
	let clubID: string[] = []
  
	clubID.push(...filteredClub.map((id) => id))
  
	const notEvaluted: {
		'รหัสชมรม': string,
		'ชื่อชมรม': string,
	}[] = []
  
	const evaluted: string[] = evalData.map((k, v) => k)
	
	clubID.forEach((id) => {
		if(!evaluted.includes(id)) {
			notEvaluted.push({
				'รหัสชมรม': id,
				'ชื่อชมรม': IDUtil.translateToClubName(id)
			})
		}
		return;
	})
	
	debug.table(notEvaluted)
	const ws = new Worksheet(notEvaluted).setName('Not Evaluated Clubs')
	const wb = new Workbook([ws])
	await wb.save('not_evaluated_clubs.xlsx')
}
