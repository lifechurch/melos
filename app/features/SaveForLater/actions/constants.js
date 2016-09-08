const constants = {
	planInfoRequest: 'READING_PLANS_PLAN_INFO_REQUEST',
	planInfoSuccess: 'READING_PLANS_PLAN_INFO_SUCCESS',
	planInfoFailure: 'READING_PLANS_PLAN_INFO_FAILURE',
	planSaveforlaterRequest: 'READING_PLANS_SAVEFORLATER_REQUEST',
	planSaveforlaterSuccess: 'READING_PLANS_SAVEFORLATER_SUCCESS',
	planSaveforlaterFailure: 'READING_PLANS_SAVEFORLATER_FAILURE',
	planRemoveSaveRequest: 'READING_PLANS_REMOVE_SAVE_REQUEST',
	planRemoveSaveSuccess: 'READING_PLANS_REMOVE_SAVE_SUCCESS',
	planRemoveSaveFailure: 'READING_PLANS_REMOVE_SAVE_FAILURE',
	configurationRequest: 'READING_PLANS_CONFIGURATION_REQUEST',
	configurationSuccess: 'READING_PLANS_CONFIGURATION_SUCCESS',
	configurationFailure: 'READING_PLANS_CONFIGURATION_FAILURE'
}

export default function (key) {
	if (typeof key === 'string' && constants.hasOwnProperty(key)) {
		return constants[key];
	} else {
		throw new Error('Invalid Plan Discovery Action: ' + key)
	}
}
