import { Route, Redirect, RouteProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { AppState } from '../store'
import { SystemState } from '../store/system/types';

interface AuthenticatedRouteProps extends RouteProps {
    system: SystemState;
}

const AuthenticatedRoute = ({ system, ...props }: AuthenticatedRouteProps) => {
    return system.session.isLoggedIn ? <Route {...props} /> : <Redirect to="/login" />;
};
function mapStateToProps(state: AppState) {
    return {
        system: state.system
    };
}
export default connect(mapStateToProps)(AuthenticatedRoute);