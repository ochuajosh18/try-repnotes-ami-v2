import { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import { DynamicProfileType, ProfileState } from '../../store/profile/types';
import { setProfileState, onChangePassword } from '../../store/profile/actions';
import { LoginState } from '../../store/login/types';
import { SystemState } from '../../store/system/types';
import { openAlert } from '../../store/alert/actions';
// import { AlertState } from '../../store/alert/types';
import {
    ProfileContainer,
    ProfileTabs,
    ProfileTab
} from './fragments/ProfileComponents';
import ProfileInputs from './fragments/ProfileInputs';
import ProfileSettings from './fragments/ProfileSettings';

import { RepnotesContentHeader } from '../common/RepnotesContentHeader';
// import { RepnotesAlert } from '../common/RepnotesAlerts';

// utils
import { stringValidator } from '../../util/utils';

interface ProfileProps {
    openAlert: typeof openAlert;
    onChangePassword: typeof onChangePassword;
    setProfileState: typeof setProfileState;
    profile: ProfileState;
    login: LoginState;
    system: SystemState;
    // alert: AlertState;
}

class Profile extends Component<ProfileProps> {
    
    componentDidMount = () => {
        this.props.setProfileState({
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        });
    }

    _onProfileInput = (field: string, value: DynamicProfileType) => {
        this.props.setProfileState({ [field]: value });
    }

    _onPasswordSave = () => {
        const { oldPassword, newPassword, confirmNewPassword } = this.props.profile;
        const { firstName, lastName } = this.props.system.session.userDetails;
        const validatedNewPassword = stringValidator(newPassword, true);
        if (!oldPassword) this.props.openAlert('Missing old password', 'warning');
        else if (!newPassword) this.props.openAlert('Missing new password', 'warning');
        else if (!confirmNewPassword) this.props.openAlert('Missing confirm password', 'warning');
        else if (validatedNewPassword.indexOf(stringValidator(firstName, true)) > -1 || validatedNewPassword.indexOf(stringValidator(lastName, true)) > -1) this.props.openAlert('New password cannot contain first or last name', 'warning');
        else if (newPassword.length < 8 || newPassword.length > 36) this.props.openAlert('New password must be 8 - 36 characters in length', 'warning');
        else if (!/(?=.*[A-Z])/.test(newPassword)) this.props.openAlert('New password must contain an uppercase letter', 'warning');
        else if (!/(?=.*\d)/.test(newPassword)) this.props.openAlert('New password must contain a number', 'warning');
        else if (newPassword !== confirmNewPassword) this.props.openAlert('New password and confirm new password are not the same', 'warning');
        else this.props.onChangePassword();
    }

    ProfileTabs = ({ value }: {value: string}) => (
        <ProfileTabs value={value} TabIndicatorProps={{ style: { height: 3, backgroundColor: '#121336' }}}>
            <ProfileTab label="Profile" value="Profile" onClick={() => this.props.setProfileState({ profileTab: 'Profile' })} />
            <ProfileTab label="Settings" value="Settings"  onClick={() => this.props.setProfileState({ profileTab: 'Settings' })} />
        </ProfileTabs>
    )

    render = () => {
        const { profileTab, oldPassword, newPassword, confirmNewPassword, settingsLoading } = this.props.profile;
        const { session } = this.props.system;
        const { firstName, lastName, email, role, dateCreated } = session.userDetails;
        return (
            <ProfileContainer>
                {/* <RepnotesAlert 
                    label={this.props.alert.alertMessage}
                    open={this.props.alert.alertOpen}
                    severity={this.props.alert.alertType}
                /> */}
                <RepnotesContentHeader moduleName="Profile" />
                <ProfileTabs value={profileTab} TabIndicatorProps={{ style: { height: 3, backgroundColor: '#121336' }}}>
                    <ProfileTab label="Profile" value="Profile" onClick={() => this.props.setProfileState({ profileTab: 'Profile' })} />
                    <ProfileTab label="Settings" value="Settings"  onClick={() => this.props.setProfileState({ profileTab: 'Settings' })} />
                </ProfileTabs>
                {profileTab === 'Profile' &&
                    <ProfileInputs
                        firstName={firstName}
                        lastName={lastName}
                        email={email}
                        role={role as string}
                        memberSince={dateCreated}
                    />
                }
                {profileTab === 'Settings' &&
                    <ProfileSettings
                        oldPassword={oldPassword}
                        newPassword={newPassword}
                        confirmNewPassword={confirmNewPassword}
                        loading={settingsLoading}
                        onProfileInput={this._onProfileInput}
                        onPasswordSave={this._onPasswordSave}
                    />
                }
            </ProfileContainer>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    profile: state.profile,
    login: state.login,
    system: state.system,
    // alert: state.alert
});

const mapDispatchToProps = { setProfileState, openAlert, onChangePassword };

export default connect(mapStateToProps, mapDispatchToProps)(Profile)