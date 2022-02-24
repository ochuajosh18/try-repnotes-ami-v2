import {
  SET_SESSION,
  DISPLAY_ACTIVE,
  TOGGLE_DRAWER_COLLAPSE,
  SystemAction,
  SystemState,
  SET_REDIRECT,
  SET_INTERCEPTOR,
  EJECT_INTERCEPTOR,
  SET_SYSTEM_STATE,
} from "./types";

const INITIAL_STATE: SystemState = {
  interceptors: null,
  session: {
    token: "",
    refreshToken: "",
    userDetails: {
      email: "",
      firstName: "",
      middleName: "",
      lastName: "",
      dateCreated: "",
      companyId: "",
      id: "",
    },
    modules: {
      brochure: {
        add: true,
        delete: true,
        edit: true,
        view: true,
      },
      customer: {
        add: true,
        delete: true,
        edit: true,
        view: true,
      },
      product: {
        add: true,
        delete: true,
        edit: true,
        view: true,
      },
      listManagement: {
        add: true,
        delete: true,
        edit: true,
        view: true,
      },
      location: {
        add: true,
        delete: true,
        edit: true,
        view: true,
      },
      salesOpportunities: {
        add: true,
        delete: true,
        edit: true,
        view: true,
      },
      marginReport: {
        add: true,
        delete: true,
        edit: true,
        view: true,
      },
      marketShare: {
        add: true,
        delete: true,
        edit: true,
        view: true,
      },
      actualVsTarget: {
        add: true,
        delete: true,
        edit: true,
        view: true,
      },
      quotesByStatus: {
        add: true,
        delete: true,
        edit: true,
        view: true,
      },
      voiceOfCustomer: {
        add: true,
        delete: true,
        edit: true,
        view: true,
      },
      customerTouchpoint: {
        add: true,
        delete: true,
        edit: true,
        view: true,
      },
      promotion: {
        add: true,
        delete: true,
        edit: true,
        view: true,
      },
      rolesAndPermission: {
        add: true,
        delete: true,
        edit: true,
        view: true,
      },
      user: {
        add: true,
        delete: true,
        edit: true,
        view: true,
      },
      fields: {
        add: true,
        delete: true,
        edit: true,
        view: true,
      },
    },
    isLoggedIn: false,
  },
  drawerTab: {
    activeTab: "",
    subActive: "",
    secondSubActive: "",
  },
  drawerCollapse: false,
  redirectPage: {
    shallRedirect: false,
    redirectTo: "",
  },
  rememberUser: false,
};

const systemReducers = (
  state = INITIAL_STATE,
  action: SystemAction
): SystemState => {
  switch (action.type) {
    case SET_SYSTEM_STATE:
      return { ...state, ...action.payload };
    case SET_REDIRECT:
      return { ...state, redirectPage: action.payload };
    case SET_SESSION:
      return { ...state, session: action.payload };
    case DISPLAY_ACTIVE:
      return { ...state, drawerTab: action.payload };
    case TOGGLE_DRAWER_COLLAPSE:
      return { ...state, drawerCollapse: action.payload };
    case SET_INTERCEPTOR:
      return { ...state, interceptors: action.payload };
    case EJECT_INTERCEPTOR:
      return { ...state, interceptors: null };
    case "reset_state":
      return { ...INITIAL_STATE, rememberUser: state.rememberUser };
    default:
      return state;
  }
};

export default systemReducers;
