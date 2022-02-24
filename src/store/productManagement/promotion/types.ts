import { AnyAction } from 'redux'

export interface FormatData {
    [property : string] : string | number | Array<Media> | boolean | Array<string>;
}

export interface Media {
    name: string;
    path: string;
    size: string | number;
    type: string;
    file?: File;
}

export interface PromotionDetails extends FormatData {
    companyId: string;
    name: string;
    description: string;
    mechanics: string;
    price: string | number;
    startDate: string;
    endDate: string;
    product: string | Array<string>;
    image: Array<Media>;
    video: Array<Media>;
    isActive: boolean;
}

export interface PromotionState {
    promotionList: Array<PromotionDetails>;
    promotion?: PromotionDetails;
    loading: boolean;
    validation: boolean;
    selectedCompanyId: string;
}

export interface PromotionInput {
    [name: string]: string | number | Array<Media> | boolean | Array<string> | FormatData;
}

export interface SetPromotionSelectedCompanyFilter {
    selectedCompanyId: string;
}

export interface PromotionValidation {
    validation: boolean;
}

export const SET_PROMOTION_STATE = 'set_promotion_state'

export interface SetPromotionStateInput {
    type: typeof SET_PROMOTION_STATE
    payload: PromotionState
}

export type PromotionAction =  SetPromotionStateInput | AnyAction