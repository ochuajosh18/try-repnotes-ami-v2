import { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import { ForgotPasswordInput } from '../../store/forgot-password/types';
// import { AlertState } from '../../store/alert/types';
import { 
    resendEmailForgotPassword, 
    startTimer 
} from '../../store/forgot-password/actions';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { 
    RepnotesCountdownButton, 
    RepnotesPrimaryButton 
} from '../common/RepnotesButton';
// import { RepnotesAlert } from '../common/RepnotesAlerts';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CheckCircle from '../../assets/images/CheckCircle.svg';
import loginBackground from '../../assets/images/Image1.jpg';

interface ForgotPasswordProps {
    startTimer: typeof startTimer;
    resendEmailForgotPassword: typeof resendEmailForgotPassword;
    forgotPassword: ForgotPasswordInput;
    // alert: AlertState;
}

class ForgotPasswordConfirmation extends Component<ForgotPasswordProps> {

    componentDidMount() {
        this.props.startTimer()
    }

    _onForgotPasswordClick = () => {
        this.props.resendEmailForgotPassword(this.props.forgotPassword)
    }

    render() {
        const { timer, startTimer } = this.props.forgotPassword
        return(
            <div
            style={{
                backgroundImage: `url(${loginBackground})`,
                backgroundPosition: 'center top',
                height: '100vh',
                width: '100%',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                display: 'flex'
            }}
            >
                {(this.props.forgotPassword.email === '') && <Redirect to="/forgot-password"/>}
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
                            <img 
                            src={CheckCircle} 
                            alt="success"
                            style={{
                                width: 80, 
                                padding: 0, 
                                marginBottom: 30, 
                                alignSelf: 'center'
                            }}
                            />
                            <label 
                            style={{
                                marginBottom: 20,
                                fontSize: 11, 
                                fontWeight: 400, 
                                textAlign: 'center', 
                                color: '#272B75'
                            }}
                            >
                            Your temporary password is sent to your email.
                            </label>
                            <label 
                            style={{
                                marginBottom: 20,
                                fontSize: 11, 
                                fontWeight: 400, 
                                textAlign: 'center', 
                                color: '#272B75',
                                fontStyle: 'italic'
                            }}
                            >
                            (Please click the resend button below if you did not receive any email regarding your temporary password.)
                            </label>
                            <div
                            style={{
                                flexDirection: 'row'
                            }}
                            >
                            <RepnotesCountdownButton 
                                label="Resend"
                                interval={parseInt(`${timer}`)}
                                startTimer={startTimer ? true : false}
                                onClick={this._onForgotPasswordClick.bind(this)}
                            /> 
                            <Link to="/login" style={{ textTransform: 'none', textDecoration: 'none' }}>
                                <RepnotesPrimaryButton >
                                    Done
                                </RepnotesPrimaryButton>
                            </Link>
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
    // alert: state.alert
});

export default connect(mapStateToProps, {
    resendEmailForgotPassword,
    startTimer
})(ForgotPasswordConfirmation);