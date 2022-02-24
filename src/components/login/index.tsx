import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import { LoginState } from '../../store/login/types';
import { SystemState } from '../../store/system/types';
import { AlertState } from '../../store/alert/types';
import { 
    loginInput, 
    authenticateUser 
} from '../../store/login/actions';
import { Redirect } from 'react-router-dom';
import { 
    RepnotesInput, 
    RepnotesCheckbox 
} from '../common/RepnotesInput';
import { RepnotesPrimaryButton } from '../common/RepnotesButton';
import { RememberMeFormControlLabel } from './fragments/LoginComponents';
// import { RepnotesAlert } from '../common/RepnotesAlerts';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import FormGroup from '@material-ui/core/FormGroup';
import CircularProgress from '@material-ui/core/CircularProgress';
import logo from '../../assets/images/repnotes-logo.png';
import loginBackground from '../../assets/images/Image1.jpg';

interface LoginProps {
    loginInput: typeof loginInput;
    authenticateUser: typeof authenticateUser;
    login: LoginState;
    system: SystemState;
    alert: AlertState
}

class Login extends Component<LoginProps> {

    componentDidMount = () => {
        console.log(this.props.system.rememberUser)
        if (!this.props.system.rememberUser) this.props.loginInput({ username: '' });
        this.props.loginInput({ password: '' });
    }

    _onLoginClick = () => {
        this.props.authenticateUser(this.props.login)
    }

    _loginInput = (field: string, value: string | boolean) => {
        this.props.loginInput({ [field]: value });
    }

    _onLoginKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') this._onLoginClick();
    }

    render() {
        const { loading, username, password , rememberMe } = this.props.login;
        const isLoggedIn = this.props.system.session && this.props.system.session.isLoggedIn;
        return(
            <div 
                style={{
                    backgroundImage: `url(${loginBackground})`,
                    backgroundPosition: 'center top',
                    height: "100vh",
                    width: '100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    display: 'flex'
                }}
            >
                {isLoggedIn && <Redirect to="/dashboard" />}
                {/* <RepnotesAlert 
                    label={this.props.alert.alertMessage}
                    open={this.props.alert.alertOpen}
                    severity={this.props.alert.alertType}
                /> */}
                <Grid 
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                >
                    <Paper 
                        style={{
                            paddingTop: 75,
                            paddingLeft: 75, 
                            paddingRight: 75, 
                            paddingBottom: 25, 
                            borderRadius: 10
                        }}
                    >
                        <img 
                        src={logo} 
                        alt="repnotes"
                        style={{
                            width: 350, 
                            padding: 0, 
                            marginBottom: 60, 
                            alignSelf: 'center'
                        }}
                        />
                        <form
                        style={{
                            display: 'flex', 
                            flexDirection: 'column', 
                        }}
                        >
                            <RepnotesInput
                                id="username"
                                type="text"
                                placeholder="Username"
                                label="Username"
                                labelPosition="top"
                                value={username}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    this._loginInput('username', e.target.value)
                                }}
                                onKeyPress={this._onLoginKeyPress}
                            />
                            <RepnotesInput
                                id="password"
                                type="password"
                                placeholder="Password"
                                label="Password"
                                labelPosition="top"
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    this._loginInput('password', e.target.value)
                                }}
                                onKeyPress={this._onLoginKeyPress}
                            />
                            <FormGroup 
                                row 
                                style={{ marginBottom: 70, paddingLeft: 10, boxSizing: 'border-box' }}
                            >
                                <RememberMeFormControlLabel
                                    control={
                                        <RepnotesCheckbox
                                            name="rememberMe"
                                            checked={rememberMe ? true : false}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                this._loginInput('rememberMe', e.target.checked)
                                            }}
                                        />
                                    }
                                    
                                    label="Remember Me"
                                />
                                <Link 
                                    href="/forgot-password" 
                                    style={{
                                        color: '#49BCF8', 
                                        fontWeight: 700, 
                                        paddingTop: 11
                                    }}
                                >
                                    Forgot Password?
                                </Link>
                            </FormGroup>
                            <RepnotesPrimaryButton 
                            style={{marginBottom: 35}}
                            onClick={this._onLoginClick.bind(this)} 
                            >
                            {(loading) ? 
                                <CircularProgress 
                                style={{ 
                                    display: 'flex',
                                    width: 20,
                                    height: 20,
                                    color: '#fff',
                                    padding: 3
                                }}
                                />
                                : 
                                'Login'
                            }
                            </RepnotesPrimaryButton>
                            <label 
                            style={{
                                fontSize: 10, 
                                color: '#272B75'
                            }}
                            >
                            Repnotes © 2021
                            </label>
                        </form> 
                    </Paper>
                </Grid>
            </div>
        )
    }
    
}

const mapStateToProps = (state: AppState) => ({
    login: state.login,
    system: state.system,
    // alert: state.alert
});

export default connect(mapStateToProps, {
    loginInput,
    authenticateUser,
})(Login);