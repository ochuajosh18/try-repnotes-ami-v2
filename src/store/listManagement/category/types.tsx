import { AnyAction } from 'redux'

export interface FormatData {
    [name: string]: string | number | boolean
}

export interface CategoryDetails extends FormatData{
    companyId: string;
    name: string;
    isActive: boolean;
    id: string;
}

export interface CategoryState {
    categoryList: Array<CategoryDetails>;
    category?: CategoryDetails;
    loading: boolean;
    validation: boolean;
    selectedCompanyId: string;
}

export interface CategoryInput {
    [name: string]: string | number | boolean | FormatData
}

export interface CategoryValidation {
    validation: boolean
}

export interface SetSelectedCompanyFilter {
    selectedCompanyId: string
}

export const SET_CATEGORY_STATE = 'set_category_state'

export interface SetCategoryAction {
    type: typeof SET_CATEGORY_STATE
    payload: CategoryState
}

export type CategoryAction = SetCategoryAction | AnyAction