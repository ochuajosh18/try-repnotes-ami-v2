import {
    SET_PROFILE_STATE,
    ProfileState,
    ProfileAction
} from './types';

const INITIAL_STATE: ProfileState = {
    profileTab: 'Profile',
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    settingsLoading: false
}

const profileReducers = (state = INITIAL_STATE, action: ProfileAction): ProfileState => {
    switch (action.type) {
        case SET_PROFILE_STATE:
            return { ...state, ...action.payload };
        default:
            return state;
    }
}

export default profileReducers;