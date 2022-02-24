import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
    RouteComponentProps, 
    match
} from 'react-router';
import { AppState } from '../../../store';
import { SystemState } from '../../../store/system/types';
import { RolesState } from '../../../store/userManagement/roles/types';
import { 
    UserState, 
    User 
} from '../../../store/userManagement/user/types';
import { 
    loadUserDetails, 
    updateUserDetails, 
    saveUser, 
    setUserState, 
    setUserValidationState 
} from '../../../store/userManagement/user/actions';
import { getRolesList } from '../../../store/userManagement/roles/actions';
import { 
    clearDialog, 
    setDialogOpen 
} from '../../../store/dialog/actions';
import { setRedirect } from '../../../store/system/actions';
// import { AlertState } from '../../../store/alert/types';
import { DialogState } from '../../../store/dialog/types';

import { RepnotesContentHeader } from '../../common/RepnotesContentHeader';
import { RepnotesInput } from '../../common/RepnotesInput';
import { 
    RepnotesDefaultButton, 
    RepnotesPrimaryButton
} from '../../common/RepnotesButton';
import { RepnotesDialog } from '../../common/RepnotesAlerts';
// material
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
// utils
import map from 'lodash/map';
import forEach from 'lodash/forEach';

interface RepnotesUserFormProps {
    saveUser: typeof saveUser ;
    setUserState: typeof setUserState;
    updateUserDetails: typeof updateUserDetails;
    setUserValidationState: typeof setUserValidationState;
    loadUserDetails: typeof loadUserDetails;
    getRolesList: typeof getRolesList;
    setRedirect: typeof setRedirect;
    setDialogOpen: typeof setDialogOpen;
    clearDialog: typeof clearDialog;
    system: SystemState;
    rolesState: RolesState;
    userState: UserState;
    // alert: AlertState;
    dialog: DialogState;
}

const EMPTY_USER = {
    companyId: '',
    isActive: true,
    firstName:  '',
    lastName:  '',
    middleName:  '',
    email:  '',
    contactNo:  '',
    roleId: ''
};

const STATUS_ARRAY = [
    { id: 'true', name: 'Active'},
    { id: 'false', name: 'Inactive'}
];

interface MatchParams {
    params:{ userId: string}
} 

interface RouteParams extends RouteComponentProps {
    match: match & MatchParams
}

class RepnotesUserForm extends Component<RepnotesUserFormProps & RouteParams> {
    componentDidMount(){
        if(this.props.match.params.userId === 'new'){ this.props.setUserState({user: {...EMPTY_USER, companyId: this.props.userState.selectedCompanyId}}) }
        else{ this.props.loadUserDetails(this.props.match.params.userId, this.props.system.session.token) }
        this._loadQuery()
    }

    _loadQuery = () =>{
        this.props.getRolesList(this.props.system, this.props.userState.selectedCompanyId);
    }

    _onOpenDialog = () => {
        this.props.setDialogOpen({dialogOpen: true, dialogLabel: this.props.userState.user ? this.props.userState.user.firstName : '', dialogType: 'save', docId: '' })
    }

    _onCloseDialog = () => {
        this.props.clearDialog();
        this._onSaveUser();
    }

    _onSaveUser = () => {
        if(this.props.match.params.userId === 'new'){ this.props.saveUser(this.props.userState.user as User, this.props.system, this.props.userState.selectedCompanyId) }
        else{ this.props.updateUserDetails(this.props.userState.user as User, this.props.system.session.token) }
    }

    _onClickSave = () => {
        const { user } = this.props.userState 
        if(user){
            let required = ['firstName', 'lastName', 'roleId', 'contactNo', 'email']
            let internal = 0
            forEach(required, (item) => {
                if(user[item] === '') this.props.setUserValidationState({validation: true});
                if(user[item] !== '')  internal++;
            })
            if(required.length === internal) this._onOpenDialog();
        }
    }

    _userInput = (field: string, value: string | boolean) => {
        const { user } = this.props.userState
        const newUser = { ...user, [field]: value };
        this.props.setUserState({user: newUser});
    }

    render() {
        const { modules } = this.props.system.session;
        const { user, validation, loading } = this.props.userState;
        const { rolesList } = this.props.rolesState;

        return(
            <Box className="repnotes-content">
                {/* <RepnotesAlert 
                    label={this.props.alert.alertMessage}
                    open={this.props.alert.alertOpen}
                    severity={this.props.alert.alertType}
                /> */}
                <RepnotesDialog 
                    label={this.props.dialog.dialogLabel}
                    open={this.props.dialog.dialogOpen}
                    severity={this.props.dialog.dialogType}
                    onClick={this._onCloseDialog.bind(this)}
                    onClear={this.props.clearDialog}
                />
                <Grid container>
                    <Grid item xs={12} style= {{ textAlign: 'left', paddingTop: '10px 0px' }}>
                        <RepnotesContentHeader moduleName="User Management" subModule="User" />
                    </Grid>
                </Grid>
                <Grid container justify="flex-end" style={{ padding: '10px 0', position: 'relative', right: -3 }}>
                    <RepnotesDefaultButton onClick={() => this.props.setRedirect({ shallRedirect: true, redirectTo: '/user' })} >
                        Cancel
                    </RepnotesDefaultButton>
                    {
                        (modules.user.edit || this.props.match.params.userId === 'new' ) &&
                        <>
                            {loading ?
                                <RepnotesPrimaryButton>
                                    <CircularProgress 
                                        style={{ 
                                            display: 'flex',
                                            width: 20,
                                            height: 20,
                                            color: '#fff',
                                            padding: 3
                                        }}
                                    />
                                </RepnotesPrimaryButton>
                                :
                                <RepnotesPrimaryButton className="no-margin-right" onClick={this._onClickSave.bind(this)}>
                                    Save
                                </RepnotesPrimaryButton>
                            }
                        </>
                    }
                </Grid>
                <Grid className="repnotes-form" container spacing={1} >
                    { 
                        user && 
                        <Grid container >
                            <Grid item xs={1}></Grid>
                            <Grid item xs={7}>
                                <RepnotesInput
                                    id="First Name"
                                    type="text"
                                    placeholder="First Name"
                                    label="First Name"
                                    labelPosition="left"
                                    disabled={(!modules.user.edit && this.props.match.params.userId !== 'new' ) ? true : false}
                                    error={ !validation ? false : ( validation && user.firstName === '' ? true : false) }
                                    value={user.firstName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        this._userInput('firstName', e.target.value)

                                    }}
                                />
                                <RepnotesInput
                                    id="Last Name"
                                    type="text"
                                    placeholder="Last Name"
                                    label="Last Name"
                                    labelPosition="left"
                                    disabled={(!modules.user.edit && this.props.match.params.userId !== 'new' ) ? true : false}
                                    error= { !validation ? false : ( validation && user.lastName === '' ? true : false) }
                                    value={user.lastName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        this._userInput('lastName', e.target.value)
                                    }}
                                />
                                <RepnotesInput
                                    id="Middle Name"
                                    type="text"
                                    placeholder="Middle Name"
                                    label="Middle Name"
                                    labelPosition="left"
                                    value={user.middleName}
                                    disabled={(!modules.user.edit && this.props.match.params.userId !== 'new' ) ? true : false}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        this._userInput('middleName', e.target.value)
                                    }}
                                />
                                <RepnotesInput
                                    id="Email"
                                    type="email"
                                    placeholder="Email"
                                    label="Email"
                                    labelPosition="left"
                                    disabled={(!modules.user.edit && this.props.match.params.userId !== 'new' ) ? true : false}
                                    error= { !validation ? false : ( validation && user.email === '' ? true : false) }
                                    value={user.email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        this._userInput('email', e.target.value)
                                    }}
                                />
                                <RepnotesInput
                                    id="Contact No"
                                    type="text"
                                    placeholder="Contact No"
                                    label="Contact No."
                                    labelPosition="left"
                                    disabled={(!modules.user.edit && this.props.match.params.userId !== 'new' ) ? true : false}
                                    error= { !validation ? false : ( validation && user.contactNo === '' ? true : false) }
                                    value={user.contactNo}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        this._userInput('contactNo', e.target.value)
                                    }}
                                />
                                <RepnotesInput
                                    id="repnotes-company-status"
                                    type="select"
                                    label="Status"
                                    labelPosition="left"
                                    value={user.isActive}
                                    disabled={(!modules.user.edit && this.props.match.params.userId !== 'new' ) ? true : false}
                                    options={STATUS_ARRAY}
                                    onSelectChange={(e: React.ChangeEvent<{ name?: string; value: string | any}>) => {
                                        this._userInput('isActive',  (e.target.value === 'true') ? true : false  )
                                    }}
                                />
                                <RepnotesInput
                                    id="Role"
                                    type="select"
                                    placeholder="Role"
                                    label="Role"
                                    labelPosition="left"
                                    value={user.roleId}
                                    disabled={(!modules.user.edit && this.props.match.params.userId !== 'new' ) ? true : false}
                                    options={map(rolesList, (data) => ({
                                        id: data.id,
                                        name: data.name
                                    }))}
                                    onSelectChange={(e:React.ChangeEvent<{ name?: string; value: string | any}>) => {
                                        this._userInput('roleId', e.target.value)
                                    }}
                                />
                            </Grid> 
                            <Grid item xs={4}></Grid>
                        </Grid>
                    }   
                </Grid>
            </Box>
        )
    }
}

export const mapStateToProps = (state: AppState) => ({
    system: state.system,
    // alert: state.alert,
    userState: state.userState,
    rolesState: state.rolesState,
    dialog: state.dialog
}) 

export default connect(mapStateToProps, {
    setUserState,
    loadUserDetails,
    updateUserDetails,
    setUserValidationState,
    saveUser,
    getRolesList,
    setRedirect,
    setDialogOpen,
    clearDialog
})(RepnotesUserForm);