import React from "react";
import { AppState } from "./store";
import { SystemState } from "./store/system/types";
import { logoutUser, resetAxiosInterceptors } from "./store/system/actions";
import { AlertState } from "./store/alert/types";
import { connect } from "react-redux";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { RepnotesAlert } from "./components/common/RepnotesAlerts";
import RepnotesDrawer from "./components/common/RepnotesDrawer";
import Login from "./components/login";
import ForgotPassword from "./components/login/ForgotPassword";
import ForgotPasswordConfirmation from "./components/login/ForgotPasswordConfirmation";
import Logout from "./components/common/Logout";
import "./App.css";
// import RepnotesDashboard from "./components/dashboard/RepnotesDashboard";
import RepnotesUser from "./components/userManagement/user/RepnotesUser";
import RepnotesUserForm from "./components/userManagement/user/RepnotesUserForm";
import company from "./components/listManagement/company";
import CompanyForm from "./components/listManagement/company/CompanyForm";
import RepnotesCategory from "./components/listManagement/category/RepnotesCategory";
import RepnotesCategoryForm from "./components/listManagement/category/RepnotesCategoryForm";
import RepnotesTurnover from "./components/listManagement/turnover/RepnotesTurnover";
import RepnotesTurnoverForm from "./components/listManagement/turnover/RepnotesTurnoverForm";
import ProductFamily from "./components/listManagement/productFamily";
import RepnotesProductFamilyForm from "./components/listManagement/productFamily/RepnotesProductFamilyForm";
import RepnotesIndustry from "./components/listManagement/industry";
import RepnotesIndustryForm from "./components/listManagement/industry/RepnotesIndustryForm";
import RepnotesMake from "./components/listManagement/make/RepnotesMake";
import RepnotesMakeForm from "./components/listManagement/make/RepnotesMakeForm";
import RepnotesRoles from "./components/userManagement/roles";
import RepnotesRolesForm from "./components/userManagement/roles/RepnotesRolesForm";
import RepnotesGovernmentPrivate from "./components/listManagement/governmentPrivate/RepnotesGovernmentPrivate";
import RepnotesGovernmentPrivateForm from "./components/listManagement/governmentPrivate/RepnotesGovernmentPrivateForm";
import RepnotesTier from "./components/listManagement/tier/RepnotesTier";
import RepnotesTierForm from "./components/listManagement/tier/RepnotesTierForm";
import RepnotesBrochure from "./components/productManagement/brochure";
import RepnotesBrochureForm from "./components/productManagement/brochure/RepnotesBrochureForm";
import RepnotesInternationalLocal from "./components/listManagement/internationalLocal/RepnotesInternationalLocal";
import RepnotesInternationalLocalForm from "./components/listManagement/internationalLocal/RepnotesInternationalLocal.Form";
import RepnotesCustomerType from "./components/listManagement/customerType/RepnotesCustomerType";
import RepnotesCustomerTypeForm from "./components/listManagement/customerType/RepnotesCustomerTypeForm";
import RepnotesCustomer from "./components/customerManagement/customer/RepnotesCustomer";
// import RepnotesCustomerForm from "./components/customerManagement/customer/RepnotesCustomerForm";
import RepnotesCompetitionInfo from "./components/reports/voiceOfCustomer/competitionInfo/RepnotesCompetitionInfo";
import RepnotesLocation from "./components/customerManagement/location/RepnotesLocation";
import RepnotesLocationForm from "./components/customerManagement/location/RepnotesLocationForm";
import RepnotesProduct from "./components/productManagement/product";
// import RepnotesProductForm from "./components/productManagement/product/RepnotesProductForm";
import RepnotesTypeOfEntries from "./components/reports/voiceOfCustomer/typeOfEntries/RepnotesTypeOfEntries";
import RepnotesMargin from "./components/reports/marginReport/RepnotesMargin";
import RepnotesSalesOpportunities from "./components/reports/salesOpportunities/RepnotesSalesOpportunities";
import RepnotesCustomerExperience from "./components/reports/voiceOfCustomer/customerExperience/RepnotesCustomerExperience";
import RepnotesMarket from "./components/reports/marketShare/RepnotesMarket";
import RepnotesUnmetNeeds from "./components/reports/voiceOfCustomer/unmetNeeds/RepnotesUnmetNeeds";
import RepnotesGeneralComments from "./components/reports/voiceOfCustomer/generalComments/RepnotesGeneralComments";
import RepnotesPromotion from "./components/productManagement/promotion";
import RepnotesPromotionForm from "./components/productManagement/promotion/RepnotesPromotionForm";
import RepnotesProductQuality from "./components/reports/voiceOfCustomer/productQuality/RepnotesProductQuality";
import ProductPerformance from "./components/reports/voiceOfCustomer/productPerformance/ProductPerformance";
import ActualToTarget from "./components/reports/actualToTarget/ActualToTarget";
import QuotesByStatus from "./components/reports/quotesByStatus/QuotesByStatus";
import UpcomingCalls from "./components/reports/customerTouchpoint/upcomingCalls/UpcomingCalls";
import VisitsCompleted from "./components/reports/customerTouchpoint/visitsCompleted/VisitsCompleted";
import Profile from "./components/profile/Profile";
import FieldsManagement from "./components/fieldsManagement/FieldsManagement";
import AuthenticatedRoute from "./modules/AuthenticatedRoute";

import Box from "@material-ui/core/Box";
import RepnotesProductFormNew from "./components/productManagement/product/RepnotesProductFormNew";
import RepnotesCustomerFormNew from "./components/customerManagement/customer/RepnotesCustomerFormNew";
import RepnotesDashboardNew from "./components/dashboard/RepnotesDashboardNew";
import RepnotesBranch from "./components/listManagement/branch/RepnotesBranch";
import RepnotesBranchForm from "./components/listManagement/branch/RepnotesBranchForm";

interface AppProps {
  resetAxiosInterceptors: typeof resetAxiosInterceptors;
  logoutUser: typeof logoutUser;
  system: SystemState;
  alert: AlertState;
}

class App extends React.Component<AppProps> {
  componentDidMount = () => {
    if (!this.props.system.session.isLoggedIn) {
      this.props.logoutUser(this.props.system.session);
      return;
    }
  };

  render() {
    const { alertOpen, alertType, alertMessage } = this.props.alert;
    const { isLoggedIn } = this.props.system.session;
    const redirectPage = this.props.system.redirectPage;
    return (
      <Box id='App' className='App'>
        <RepnotesAlert label={alertMessage} open={alertOpen} severity={alertType} />
        <Router>
          {redirectPage && redirectPage.shallRedirect && redirectPage && (
            <Redirect to={redirectPage.redirectTo} />
          )}
          {isLoggedIn && <RepnotesDrawer />}
          <Switch>
            <Route exact path='/login' component={Login} />
            <Route exact path='/'>
              <Redirect to='/login' />
            </Route>
            <Route exact path='/forgot-password' component={ForgotPassword} />
            <Route exact path='/forgot-password-success' component={ForgotPasswordConfirmation} />
            <Route exact path='/logout' component={Logout} />
            <AuthenticatedRoute
              exact
              path='/dashboard'
              // component={RepnotesDashboard}
              component={RepnotesDashboardNew}
            />
            <AuthenticatedRoute exact path='/roles-and-permission' component={RepnotesRoles} />
            <AuthenticatedRoute
              exact
              path='/roles-and-permission/:id'
              component={RepnotesRolesForm}
            />
            <AuthenticatedRoute exact path='/user' component={RepnotesUser} />
            <AuthenticatedRoute exact path='/user/:userId' component={RepnotesUserForm} />
            <AuthenticatedRoute exact path='/customer' component={RepnotesCustomer} />
            <AuthenticatedRoute
              exact
              path='/customer/:id'
              // component={RepnotesCustomerForm}
              component={RepnotesCustomerFormNew}
            />
            <AuthenticatedRoute exact path='/location' component={RepnotesLocation} />
            <AuthenticatedRoute exact path='/location/:id' component={RepnotesLocationForm} />
            <AuthenticatedRoute exact path='/product' component={RepnotesProduct} />
            <AuthenticatedRoute
              exact
              path='/product/:id'
              // component={RepnotesProductForm}
              component={RepnotesProductFormNew}
            />
            <AuthenticatedRoute exact path='/brochure' component={RepnotesBrochure} />
            <AuthenticatedRoute exact path='/brochure/:id' component={RepnotesBrochureForm} />
            <AuthenticatedRoute exact path='/promotion' component={RepnotesPromotion} />
            <AuthenticatedRoute exact path='/promotion/:id' component={RepnotesPromotionForm} />
            <AuthenticatedRoute
              exact
              path='/sales-opportunities'
              component={RepnotesSalesOpportunities}
            />
            <AuthenticatedRoute exact path='/margin-report' component={RepnotesMargin} />
            <AuthenticatedRoute exact path='/actual-to-target' component={ActualToTarget} />
            <AuthenticatedRoute exact path='/quotations' component={QuotesByStatus} />
            <AuthenticatedRoute exact path='/productperformance' component={ProductPerformance} />
            <AuthenticatedRoute exact path='/upcoming-visits' component={UpcomingCalls} />
            <AuthenticatedRoute
              exact
              path='/visits-completed-percentage'
              component={VisitsCompleted}
            />
            <AuthenticatedRoute exact path='/type-of-entries' component={RepnotesTypeOfEntries} />
            <AuthenticatedRoute
              exact
              path='/competition-info'
              component={RepnotesCompetitionInfo}
            />
            <AuthenticatedRoute
              exact
              path='/customer-experience'
              component={RepnotesCustomerExperience}
            />
            <AuthenticatedRoute exact path='/unmet-needs' component={RepnotesUnmetNeeds} />
            <AuthenticatedRoute
              exact
              path='/general-comments'
              component={RepnotesGeneralComments}
            />
            <AuthenticatedRoute exact path='/product-quality' component={RepnotesProductQuality} />
            <AuthenticatedRoute exact path='/company' component={company} />
            <AuthenticatedRoute exact path='/company/:id' component={CompanyForm} />
            <AuthenticatedRoute exact path='/category' component={RepnotesCategory} />
            <AuthenticatedRoute exact path='/category/:id' component={RepnotesCategoryForm} />
            <AuthenticatedRoute exact path='/customer-type' component={RepnotesCustomerType} />
            <AuthenticatedRoute
              exact
              path='/customer-type/:id'
              component={RepnotesCustomerTypeForm}
            />
            <AuthenticatedRoute exact path='/industry' component={RepnotesIndustry} />
            <AuthenticatedRoute exact path='/industry/:id' component={RepnotesIndustryForm} />
            <AuthenticatedRoute exact path='/product-family' component={ProductFamily} />
            <AuthenticatedRoute
              exact
              path='/product-family/:id'
              component={RepnotesProductFamilyForm}
            />
            <AuthenticatedRoute exact path='/make' component={RepnotesMake} />
            <AuthenticatedRoute exact path='/make/:id' component={RepnotesMakeForm} />
            <AuthenticatedRoute exact path='/turnover' component={RepnotesTurnover} />
            <AuthenticatedRoute exact path='/turnover/:id' component={RepnotesTurnoverForm} />
            <AuthenticatedRoute exact path='/tier' component={RepnotesTier} />
            <AuthenticatedRoute exact path='/tier/:id' component={RepnotesTierForm} />
            <AuthenticatedRoute
              exact
              path='/international-local'
              component={RepnotesInternationalLocal}
            />
            <AuthenticatedRoute
              exact
              path='/international-local/:id'
              component={RepnotesInternationalLocalForm}
            />
            <AuthenticatedRoute
              exact
              path='/government-private'
              component={RepnotesGovernmentPrivate}
            />
            <AuthenticatedRoute
              exact
              path='/government-private/:id'
              component={RepnotesGovernmentPrivateForm}
            />
            <AuthenticatedRoute exact path='/branch' component={RepnotesBranch} />
            <AuthenticatedRoute exact path='/branch/:id' component={RepnotesBranchForm} />
            <AuthenticatedRoute exact path='/market-share' component={RepnotesMarket} />
            <AuthenticatedRoute exact path='/profile' component={Profile} />
            <AuthenticatedRoute exact path='/fields-management' component={FieldsManagement} />
          </Switch>
        </Router>
      </Box>
    );
  }
}

export const mapStateToProps = (state: AppState) => ({
  system: state.system,
  alert: state.alert,
});

export default connect(mapStateToProps, { logoutUser, resetAxiosInterceptors })(App);
