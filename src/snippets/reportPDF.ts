import type { Debugger, EvaluateCollectionType, UserDataCollectionType } from '@lib'
import {
	ClubRecord,
	DMap,
	DocumentTemplate,
	EvaluationDocument,
	FirestoreCollection,
	Mutators,
	IDUtil,
} from '@lib'

export const ReportPDFSnippet = async (debug: Debugger) => {
	const eCollection = new FirestoreCollection<EvaluateCollectionType>('evaluate')
	const eData = await eCollection.readFromCacheNoRef(true)
	if (!eData) return

	const uData = await new FirestoreCollection<UserDataCollectionType>('data')
		.setDefaultMutator(Mutators.SpecificKeyFieldKVMutator((doc) => doc.get('student_id')))
		.readFromCache(true)
	if (!uData) return

	const eMap = new ClubRecord(eData.getRecord()).transformToMainClubs()
	const template = new DocumentTemplate('assets/eTemplate.html')
	let fileCounts = 0

	await eMap.iterate(async (key, value) => {
		debug.info(`working on ${IDUtil.applyOverriddenLayer(key)}`)

		const clubEMap = new DMap(value)

		const grouped = clubEMap.groupBy((v) => v.action)

		const doc = new EvaluationDocument(
			key,
			{
				semester: '2',
				year: '2567',
			},
			{
				all: clubEMap,
				...grouped.getRecord(),
			},
			uData
		)
		await doc.generate(template, key)
		fileCounts++
	})

	debug.info(`Total Files: ${fileCounts}`)
}
