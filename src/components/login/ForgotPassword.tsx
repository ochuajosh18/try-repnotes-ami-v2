import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import { AlertState } from '../../store/alert/types';
import { ForgotPasswordInput } from '../../store/forgot-password/types';
import { 
    forgotPasswordInput, 
    sendEmailForgotPassword 
} from '../../store/forgot-password/actions';
import { Redirect } from 'react-router';
import { RepnotesInput } from '../common/RepnotesInput';
// import { RepnotesAlert } from '../common/RepnotesAlerts';
import { 
    RepnotesPrimaryButton, 
    RepnotesBackButton 
} from '../common/RepnotesButton';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import loginBackground from '../../assets/images/Image1.jpg';

interface ForgotPasswordProps {
    forgotPasswordInput: typeof forgotPasswordInput;
    sendEmailForgotPassword: typeof sendEmailForgotPassword;
    forgotPassword: ForgotPasswordInput;
    alert: AlertState;
}

class ForgotPassword extends Component<ForgotPasswordProps> {

    _onForgotPasswordClick = () => {
        this.props.sendEmailForgotPassword(this.props.forgotPassword)
    }

    _emailInput = (field: string, value: string) => {
        this.props.forgotPasswordInput({ [field]: value });
    }

    render() {
        const loading = this.props.forgotPassword.loading;
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
                {(this.props.alert.alertType === 'success') && <Redirect to="/forgot-password-success"/>}
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
                        paddingTop: 25,
                        paddingLeft: 25, 
                        paddingRight: 25, 
                        paddingBottom: 25, 
                        borderRadius: 10,
                        width: 350
                    }}
                    >   
                        <form
                        style={{
                            display: 'flex', 
                            flexDirection: 'column', 
                        }}
                        >
                            <label 
                            style={{
                                marginBottom: 15,
                                fontSize: 17, 
                                fontWeight: 700, 
                                textAlign: 'left', 
                                color: '#272B75',
                            }}
                            >
                            Forgot Password?
                            </label>
                            <label 
                            style={{
                                marginBottom: 10,
                                fontSize: 11, 
                                fontWeight: 400, 
                                textAlign: 'center', 
                                color: '#272B75'
                            }}
                            >
                            Type your email below to receive your temporary password.
                            </label>
                            <RepnotesInput
                            id="email"
                            type="email"
                            placeholder="Email"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                this._emailInput('email', e.target.value)
                            }}
                            />
                            <label 
                            style={{
                                marginTop: 10,
                                marginBottom: 15,
                                fontSize: 11, 
                                fontWeight: 400, 
                                textAlign: 'center', 
                                color: '#272B75'
                            }}
                            >
                            Please check your email if you have received a mail regarding in changing your password and follow the instructions thoroughly.
                            </label>
                            <div
                            style={{
                                flexDirection: 'row'
                            }}
                            >
                            <RepnotesBackButton label="Cancel"></RepnotesBackButton>
                            <RepnotesPrimaryButton
                                onClick={this._onForgotPasswordClick.bind(this)}
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
                                'Send'
                            }
                            </RepnotesPrimaryButton>
                            </div>
                        </form>
                    </Paper>
                </Grid>
            </div>
        )
    }
    
}

const mapStateToProps = (state: AppState) => ({
    forgotPassword: state.forgotPassword,
    alert: state.alert
});

export default connect(mapStateToProps, {
    sendEmailForgotPassword,
    forgotPasswordInput
})(ForgotPassword);