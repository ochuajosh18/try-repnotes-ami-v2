import { AnyAction } from 'redux'

export interface FormatData {
    [property : string] : string | number | boolean | Media | Array<string> | Array<Media>;
}

export interface Media{
    name: string;
    path: string;
    size: string | number;
    type: string;
    file?: File;
}

export interface BrochureDetails extends FormatData{
    companyId: string;
    title: string;
    productFamilyId: string;
    product: string | Array<string>;
    isActive: boolean;
    media: Media;
}

export interface BrochureState {
    brochureList: Array<BrochureDetails>;
    brochure?: BrochureDetails;
    loading: boolean;
    validation: boolean;
    selectedCompanyId: string;
}

export interface BrochureInput {
    [name: string]: string | number | boolean | Media | Array<string> | FormatData;
}

export interface SetBrochureSelectedCompanyFilter {
    selectedCompanyId: string;
}

export interface BrochureValidation {
    validation: boolean;
}

export const SET_BROCHURE_STATE = 'set_brochure_state'

export interface SetBrochureStateInput {
    type: typeof SET_BROCHURE_STATE
    payload: BrochureState
}

export type BrochureAction =  SetBrochureStateInput | AnyAction