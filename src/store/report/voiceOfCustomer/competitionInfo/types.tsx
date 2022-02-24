import { AnyAction } from 'redux'

export type DynamicCompetitionInformationType = string | number | boolean | undefined;
export interface DynamicCompetitionInformationInterface<T> {
    [key: string]: T;
}

export interface CompetitionDetails{
    commercialTerms: number;
    pricing: number;
    activities: number;
}

export interface CompetitionState {
    competitionInfo: CompetitionDetails;
    loading: boolean;
    salesPersonDocId: string;
    province: string;
    industryId: string;
    customerTypeId: string;
    customerId: string;
    selectedCompanyId: string;
    report: Array<DynamicCompetitionInformationInterface<DynamicCompetitionInformationType>>;
    activeTab: string;
}

export const SET_COMPETITION_STATE = 'set_competition_state'

export interface SetCompetitionAction {
    type: typeof SET_COMPETITION_STATE
    payload: CompetitionState
}

export type CompetitionAction = SetCompetitionAction | AnyAction