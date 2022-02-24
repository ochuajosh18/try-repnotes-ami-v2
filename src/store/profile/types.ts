/**
 * Types for Porifle
 */
export type DynamicProfileType = string | number | boolean | undefined;
export interface DynamicProfileInputInterface<T> {
    [key: string]: T;
}
export interface ProfileStateInput extends DynamicProfileInputInterface<DynamicProfileType> {}

export interface ProfileState {
    profileTab: 'Profile' | 'Settings';
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    settingsLoading: boolean;
}

export const SET_PROFILE_STATE = 'set_profile_state';

export interface SetProfileStateAction {
    type: typeof SET_PROFILE_STATE;
    payload: ProfileStateInput;
}

export type ProfileAction = SetProfileStateAction;