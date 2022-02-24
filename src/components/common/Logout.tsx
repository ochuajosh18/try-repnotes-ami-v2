import { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { AppState } from '../../store';
import { SystemState } from '../../store/system/types';
import { LoginState } from '../../store/login/types';
import { logoutUser } from '../../store/system/actions';



interface LogoutProps {
    logoutUser: typeof logoutUser;
    system: SystemState;
    login: LoginState;
}

class Logout extends Component<LogoutProps> {
    componentDidMount(){
        this.props.logoutUser(this.props.system.session, this.props.login)
    }

    render = () => {
        return (
            <div>
                <Redirect to="/login" />
            </div>
        )
    }
}

export const mapStateToProps = (state: AppState) => ({
    system: state.system,
    login: state.login
})

export default connect(mapStateToProps, {
    logoutUser
})(Logout);
