import React, { ReactNode } from "react";
import { connect } from "react-redux";

// state
import { setActiveSystem, toggleDrawer, setInterceptor } from "../../store/system/actions";
import { SystemState, UserDetails } from "../../store/system/types";
import { AppState } from "../../store";
import { RepnotesProfilePopover } from "./RepnotesHeaderComponent";

// components
import withStyles from "@material-ui/styles/withStyles";
import makeStyles from "@material-ui/styles/makeStyles";
import { Link } from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import Box from "@material-ui/core/Box";

// icon
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import SubdirectoryArrowRightIcon from "@material-ui/icons/SubdirectoryArrowRight";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import BarChartIcon from "@material-ui/icons/BarChart";
import ListIcon from "@material-ui/icons/List";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SettingsIcon from "@material-ui/icons/Settings";

// assets import
import RepnotesLogo from "../../assets/images/repnotes-logo.png";
import RepnotesAltLogo from "../../assets/images/repnotes-logo-crop.png";

import axios from "axios";

const DRAWER_WIDTH = 240;
const COLLAPSED_DRAWER_WIDTH = 55;
const useStyles = makeStyles({
  drawer: {
    width: DRAWER_WIDTH,
    flexShrink: 0,
    whiteSpace: "nowrap",
    "& .MuiDrawer-paper": {
      width: DRAWER_WIDTH,
      backgroundColor: "#121336",
      color: "#FFF",
    },
    "@media (max-width: 768px)": {
      display: "none",
    },
  },
  mobileDrawer: {
    flexShrink: 0,
    whiteSpace: "nowrap",
    "& .MuiDrawer-paper": {
      width: DRAWER_WIDTH,
      backgroundColor: "#121336",
      color: "#FFF",
    },
    "@media (min-width: 768px)": {
      display: "none",
    },
  },
  collapsedDrawer: {
    width: COLLAPSED_DRAWER_WIDTH,
    flexShrink: 0,
    whiteSpace: "nowrap",
    "& .MuiDrawer-paper": {
      width: COLLAPSED_DRAWER_WIDTH,
      backgroundColor: "#121336",
      color: "#FFF",
    },
  },
  header: {
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    height: 60,
    backgroundColor: "#fff",
    zIndex: 1210,
    "@media (max-width: 768px)": {
      width: "100%",
    },
  },
  collapsedHeader: {
    width: `calc(100% - 55px)`,
    height: 60,
    zIndex: 1210,
    backgroundColor: "#fff",
    "@media (max-width: 768px)": {
      width: "100%",
    },
  },
});

const StyledDrawer = ({
  collapsed,
  children,
  onClose,
}: {
  collapsed: boolean;
  children: ReactNode;
  onClose: () => void;
}) => {
  const classes = useStyles();
  return (
    <>
      <Drawer open={collapsed} onClose={onClose} className={classes.mobileDrawer}>
        <Box style={{ height: 60, display: "flex", backgroundColor: "#fff" }}>
          <img
            src={RepnotesLogo}
            alt='RepNotes'
            style={{
              marginLeft: "auto",
              width: "180px",
              marginRight: "auto",
              display: "block",
            }}
          />
        </Box>
        {children}
      </Drawer>
      <Drawer
        open
        variant='persistent'
        className={collapsed ? classes.collapsedDrawer : classes.drawer}
      >
        <Box style={{ height: 60, display: "flex", backgroundColor: "#fff" }}>
          {collapsed ? (
            <img src={RepnotesAltLogo} alt='Alt' style={{ width: "55px" }} />
          ) : (
            <img
              src={RepnotesLogo}
              alt='RepNotes'
              style={{
                marginLeft: "auto",
                width: "180px",
                marginRight: "auto",
                display: "block",
              }}
            />
          )}
        </Box>
        {children}
      </Drawer>
    </>
  );
};

const StyledHeader = ({
  drawerCollapse,
  userDetails,
  onClick,
}: {
  drawerCollapse: boolean;
  userDetails: UserDetails;
  onClick: () => void;
}) => {
  const classes = useStyles();
  return (
    <AppBar elevation={1} className={drawerCollapse ? classes.collapsedHeader : classes.header}>
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <IconButton style={{ padding: 0 }} onClick={onClick}>
          <MenuIcon style={{ color: "#49BCF8" }} />
        </IconButton>
        <RepnotesProfilePopover
          email={userDetails.email}
          name={`${userDetails.firstName} ${userDetails.lastName}`}
          memberDate={userDetails.dateCreated}
        />
      </Toolbar>
    </AppBar>
  );
};

const StyledListItem = withStyles(() => ({
  root: {
    color: "#fff",
    "& .MuiListItemIcon-root": {
      color: "#fff",
      minWidth: 40,
    },
    "& .MuiTypography-root": {
      fontSize: ".8rem",
      paddingLeft: "20",
      lineHeight: ".5",
    },
    "&.long-text .MuiListItemText-primary": {
      whiteSpace: "pre-wrap",
      lineHeight: "1.25",
    },
  },
}))(ListItem);

interface RepnotesDrawerProps {
  setActiveSystem: typeof setActiveSystem;
  setInterceptor: typeof setInterceptor;
  toggleDrawer: typeof toggleDrawer;
  system: SystemState;
}

class RepnotesDrawer extends React.Component<RepnotesDrawerProps> {
  componentDidMount = () => {
    // @ts-ignore
    const { handlers } = axios.interceptors.request;
    if (handlers.length === 0) {
      this.props.setInterceptor();
    }
  };

  _onClickButtonDrawer = (routeTo: string, sub: string, secondSub: string) => {
    const collapsed = this.props.system.drawerCollapse;
    if (this.props.system.drawerTab.activeTab === routeTo && !sub && !secondSub) {
      // collapse back
      this.props.setActiveSystem("", "", "");
    } else this.props.setActiveSystem(routeTo, sub, secondSub);

    const withNextTier = ["voiceofcustomer", "customer-touchpoint"].includes(sub);
    if ((collapsed && routeTo && sub && !withNextTier) || (withNextTier && secondSub)) {
      // uncollapse and show drawer
      this.props.toggleDrawer(false);
    }
  };

  _onClickButtonCollapse = (value: boolean) => {
    this.props.toggleDrawer(value);
    this.props.setActiveSystem("", "", "");
  };

  render() {
    const { secondSubActive, subActive, activeTab } = this.props.system.drawerTab;
    const { drawerCollapse } = this.props.system;
    const { userDetails, modules } = this.props.system.session;
    return (
      <Box style={{ display: "flex" }}>
        <StyledHeader
          drawerCollapse={drawerCollapse}
          userDetails={userDetails}
          onClick={() => this._onClickButtonCollapse(!drawerCollapse)}
        />
        {/* <HeaderBar elevation={1} style={{ width : (drawerCollapse) ?  `calc(100% - ${55}px )` :  `calc(100% - ${DRAWER_WIDTH}px )`}}>
                    <Toolbar style = {{ display : 'flex', justifyContent: 'space-between' }}>
                        <IconButton style= {{padding: 0}} onClick={this._onClickButtonCollapse.bind(this, (!drawerCollapse) ? true : false)} >
                            <MenuIcon style= {{color:'#49BCF8'}} />
                        </IconButton>
                        <RepnotesProfilePopover email={userDetails.email} name={`${userDetails.firstName} ${userDetails.lastName}`} memberDate={userDetails.dateCreated} />
                    </Toolbar>
                </HeaderBar> */}

        <StyledDrawer collapsed={drawerCollapse} onClose={() => this._onClickButtonCollapse(false)}>
          <List>
            <Link id='dashboard' to='/dashboard' style={{ textDecoration: "none" }}>
              <StyledListItem
                id='dashboard'
                button
                onClick={this._onClickButtonDrawer.bind(this, "dashboard", "", "")}
              >
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary='Dashboard' />
              </StyledListItem>
            </Link>
            {(modules.rolesAndPermission.view || modules.user.view) && (
              <StyledListItem
                id='user-management'
                button
                onClick={this._onClickButtonDrawer.bind(this, "user-management", "", "")}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary='User Management' />
                {activeTab === "user-management" ? <ExpandLess /> : <ExpandMore />}
              </StyledListItem>
            )}
            <Collapse in={activeTab === "user-management"}>
              {modules.rolesAndPermission.view && (
                <Link
                  id='roles-and-permission'
                  to='/roles-and-permission'
                  style={{ textDecoration: "none" }}
                  onClick={this._onClickButtonDrawer.bind(
                    this,
                    "user-management",
                    "roles-and-permission",
                    ""
                  )}
                >
                  <StyledListItem button>
                    <ListItemIcon />
                    <ListItemText
                      primary='Roles and Permission'
                      style={{
                        color: subActive === "roles-and-permission" ? "#49BCF8" : "#fff",
                      }}
                    />
                  </StyledListItem>
                </Link>
              )}
              {modules.user.view && (
                <Link
                  id='user'
                  to='/user'
                  style={{ textDecoration: "none" }}
                  onClick={this._onClickButtonDrawer.bind(this, "user-management", "user", "")}
                >
                  <StyledListItem button>
                    <ListItemIcon />
                    <ListItemText
                      primary='User'
                      style={{
                        color: subActive === "user" ? "#49BCF8" : "#fff",
                      }}
                    />
                  </StyledListItem>
                </Link>
              )}
            </Collapse>
            {(modules.customer.view || modules.location.view) && (
              <StyledListItem
                id='customer-management'
                button
                onClick={this._onClickButtonDrawer.bind(this, "customer-management", "", "")}
              >
                <ListItemIcon>
                  <SupervisorAccountIcon />
                </ListItemIcon>
                <ListItemText primary='Customer Management' />
                {activeTab === "customer-management" ? <ExpandLess /> : <ExpandMore />}
              </StyledListItem>
            )}
            <Collapse in={activeTab === "customer-management"}>
              {modules.customer.view && (
                <Link
                  id='customer'
                  to='/customer'
                  style={{ textDecoration: "none" }}
                  onClick={this._onClickButtonDrawer.bind(
                    this,
                    "customer-management",
                    "customer",
                    ""
                  )}
                >
                  <StyledListItem button>
                    <ListItemIcon />
                    <ListItemText
                      primary='Customer'
                      style={{
                        color: subActive === "customer" ? "#49BCF8" : "#fff",
                      }}
                    />
                  </StyledListItem>
                </Link>
              )}
              {modules.location.view && (
                <Link
                  id='location'
                  to='/location'
                  style={{ textDecoration: "none" }}
                  onClick={this._onClickButtonDrawer.bind(
                    this,
                    "customer-management",
                    "location",
                    ""
                  )}
                >
                  <StyledListItem button>
                    <ListItemIcon />
                    <ListItemText
                      primary='Location'
                      style={{
                        color: subActive === "location" ? "#49BCF8" : "#fff",
                      }}
                    />
                  </StyledListItem>
                </Link>
              )}
            </Collapse>
            {(modules.brochure.view || modules.product.view || modules.promotion.view) && (
              <StyledListItem
                id='product-management'
                button
                onClick={this._onClickButtonDrawer.bind(this, "product-management", "", "")}
              >
                <ListItemIcon>
                  <LocalShippingIcon />
                </ListItemIcon>
                <ListItemText primary='Product Management' />
                {activeTab === "product-management" ? <ExpandLess /> : <ExpandMore />}
              </StyledListItem>
            )}
            <Collapse in={activeTab === "product-management"}>
              {modules.product.view && (
                <Link
                  id='product'
                  to='/product'
                  style={{ textDecoration: "none" }}
                  onClick={this._onClickButtonDrawer.bind(
                    this,
                    "product-management",
                    "product",
                    ""
                  )}
                >
                  <StyledListItem button>
                    <ListItemIcon />
                    <ListItemText
                      primary='Product'
                      style={{
                        color: subActive === "product" ? "#49BCF8" : "#fff",
                      }}
                    />
                  </StyledListItem>
                </Link>
              )}
              {modules.brochure.view && (
                <Link
                  id='brochure'
                  to='/brochure'
                  style={{ textDecoration: "none" }}
                  onClick={this._onClickButtonDrawer.bind(
                    this,
                    "product-management",
                    "brochure",
                    ""
                  )}
                >
                  <StyledListItem button>
                    <ListItemIcon />
                    <ListItemText
                      primary='Brochure'
                      style={{
                        color: subActive === "brochure" ? "#49BCF8" : "#fff",
                      }}
                    />
                  </StyledListItem>
                </Link>
              )}
              {modules.promotion.view && (
                <Link
                  id='promotion'
                  to='/promotion'
                  style={{ textDecoration: "none" }}
                  onClick={this._onClickButtonDrawer.bind(
                    this,
                    "product-management",
                    "promotion",
                    ""
                  )}
                >
                  <StyledListItem button>
                    <ListItemIcon />
                    <ListItemText
                      primary='Promotion'
                      style={{
                        color: subActive === "promotion" ? "#49BCF8" : "#fff",
                      }}
                    />
                  </StyledListItem>
                </Link>
              )}
            </Collapse>
            {(modules.salesOpportunities.view ||
              modules.marginReport.view ||
              modules.marketShare.view ||
              modules.actualVsTarget.view ||
              modules.quotesByStatus.view ||
              modules.voiceOfCustomer.view ||
              modules.customerTouchpoint.view) && (
              <StyledListItem
                id='report'
                button
                onClick={this._onClickButtonDrawer.bind(this, "report", "", "")}
              >
                <ListItemIcon>
                  <BarChartIcon />
                </ListItemIcon>
                <ListItemText primary='Reports' />
                {activeTab === "report" ? <ExpandLess /> : <ExpandMore />}
              </StyledListItem>
            )}
            <Collapse in={activeTab === "report"}>
              {modules.salesOpportunities.view && (
                <Link
                  id='sales-opportunities'
                  to='/sales-opportunities'
                  style={{ textDecoration: "none" }}
                  onClick={this._onClickButtonDrawer.bind(
                    this,
                    "report",
                    "sales-opportunities",
                    ""
                  )}
                >
                  <StyledListItem button>
                    <ListItemIcon />
                    <ListItemText
                      primary='Sales Opportunities'
                      style={{
                        color: subActive === "sales-opportunities" ? "#49BCF8" : "#fff",
                      }}
                    />
                  </StyledListItem>
                </Link>
              )}
              {modules.quotesByStatus.view && (
                <Link
                  id='quotations'
                  to='/quotations'
                  style={{ textDecoration: "none" }}
                  onClick={this._onClickButtonDrawer.bind(this, "report", "quotations", "")}
                >
                  <StyledListItem button>
                    <ListItemIcon />
                    <ListItemText
                      primary='Quotations'
                      style={{
                        color: subActive === "quotations" ? "#49BCF8" : "#fff",
                      }}
                    />
                  </StyledListItem>
                </Link>
              )}
              {modules.marginReport.view && (
                <Link
                  id='margin-report'
                  to='/margin-report'
                  style={{ textDecoration: "none" }}
                  onClick={this._onClickButtonDrawer.bind(this, "report", "margin-report", "")}
                >
                  <StyledListItem button>
                    <ListItemIcon />
                    <ListItemText
                      primary='Margin Report'
                      style={{
                        color: subActive === "margin-report" ? "#49BCF8" : "#fff",
                      }}
                    />
                  </StyledListItem>
                </Link>
              )}
              {modules.marketShare.view && (
                <Link
                  id='market-share'
                  to='/market-share'
                  style={{ textDecoration: "none" }}
                  onClick={this._onClickButtonDrawer.bind(this, "report", "market-share", "")}
                >
                  <StyledListItem button>
                    <ListItemIcon />
                    <ListItemText
                      primary='Market Share'
                      style={{
                        color: subActive === "market-share" ? "#49BCF8" : "#fff",
                      }}
                    />
                  </StyledListItem>
                </Link>
              )}
              {modules.actualVsTarget.view && (
                <Link
                  id='actual-to-target'
                  to='/actual-to-target'
                  style={{ textDecoration: "none" }}
                  onClick={this._onClickButtonDrawer.bind(this, "report", "actual-to-target", "")}
                >
                  <StyledListItem button>
                    <ListItemIcon />
                    <ListItemText
                      primary='Actual vs Target Report'
                      style={{
                        color: subActive === "actual-to-target" ? "#49BCF8" : "#fff",
                      }}
                    />
                  </StyledListItem>
                </Link>
              )}
              {modules.voiceOfCustomer.view && (
                <Box>
                  <StyledListItem
                    id='voiceofcustomer'
                    button
                    onClick={this._onClickButtonDrawer.bind(this, "report", "voiceofcustomer", "")}
                  >
                    <ListItemIcon />
                    <ListItemText primary='Voice of Customer' />
                    {subActive === "voiceofcustomer" ? <ExpandLess /> : <ExpandMore />}
                  </StyledListItem>
                  <Collapse in={subActive === "voiceofcustomer"}>
                    <Link
                      id='type-of-entries'
                      to='/type-of-entries'
                      style={{ textDecoration: "none" }}
                      onClick={this._onClickButtonDrawer.bind(
                        this,
                        "report",
                        "voiceofcustomer",
                        "type-of-entries"
                      )}
                    >
                      <StyledListItem button>
                        <ListItemIcon />
                        <SubdirectoryArrowRightIcon
                          fontSize='small'
                          style={{
                            color: secondSubActive === "type-of-entries" ? "#49BCF8" : "#fff",
                          }}
                        />
                        <ListItemText
                          primary='Types of Entries'
                          style={{
                            color: secondSubActive === "type-of-entries" ? "#49BCF8" : "#fff",
                          }}
                        />
                      </StyledListItem>
                    </Link>
                    <Link
                      id='customer-experience'
                      to='/customer-experience'
                      style={{ textDecoration: "none" }}
                      onClick={this._onClickButtonDrawer.bind(
                        this,
                        "report",
                        "voiceofcustomer",
                        "customer-experience"
                      )}
                    >
                      <StyledListItem button>
                        <ListItemIcon />
                        <SubdirectoryArrowRightIcon
                          fontSize='small'
                          style={{
                            color: secondSubActive === "customer-experience" ? "#49BCF8" : "#fff",
                          }}
                        />
                        <ListItemText
                          primary='Customer Experience'
                          style={{
                            color: secondSubActive === "customer-experience" ? "#49BCF8" : "#fff",
                          }}
                        />
                      </StyledListItem>
                    </Link>
                    <Link
                      id='productPerformance'
                      to='/productperformance'
                      style={{ textDecoration: "none" }}
                      onClick={this._onClickButtonDrawer.bind(
                        this,
                        "report",
                        "voiceofcustomer",
                        "productperformance"
                      )}
                    >
                      <StyledListItem button>
                        <ListItemIcon />
                        <SubdirectoryArrowRightIcon
                          fontSize='small'
                          style={{
                            color: secondSubActive === "productperformance" ? "#49BCF8" : "#fff",
                          }}
                        />
                        <ListItemText
                          primary='Product Performance'
                          style={{
                            color: secondSubActive === "productperformance" ? "#49BCF8" : "#fff",
                          }}
                        />
                      </StyledListItem>
                    </Link>
                    <Link
                      id='product-quality'
                      to='/product-quality'
                      style={{ textDecoration: "none" }}
                      onClick={this._onClickButtonDrawer.bind(
                        this,
                        "report",
                        "voiceofcustomer",
                        "product-quality"
                      )}
                    >
                      <StyledListItem button>
                        <ListItemIcon />
                        <SubdirectoryArrowRightIcon
                          fontSize='small'
                          style={{
                            color: secondSubActive === "product-quality" ? "#49BCF8" : "#fff",
                          }}
                        />
                        <ListItemText
                          primary='Product Quality'
                          style={{
                            color: secondSubActive === "product-quality" ? "#49BCF8" : "#fff",
                          }}
                        />
                      </StyledListItem>
                    </Link>
                    <Link
                      id='competition-info'
                      to='/competition-info'
                      style={{ textDecoration: "none" }}
                      onClick={this._onClickButtonDrawer.bind(
                        this,
                        "report",
                        "voiceofcustomer",
                        "competition-info"
                      )}
                    >
                      <StyledListItem button>
                        <ListItemIcon />
                        <SubdirectoryArrowRightIcon
                          fontSize='small'
                          style={{
                            color: secondSubActive === "competition-info" ? "#49BCF8" : "#fff",
                          }}
                        />
                        <ListItemText
                          primary='Competition Info'
                          style={{
                            color: secondSubActive === "competition-info" ? "#49BCF8" : "#fff",
                          }}
                        />
                      </StyledListItem>
                    </Link>
                    <Link
                      id='unmet-needs'
                      to='/unmet-needs'
                      style={{ textDecoration: "none" }}
                      onClick={this._onClickButtonDrawer.bind(
                        this,
                        "report",
                        "voiceofcustomer",
                        "unmet-needs"
                      )}
                    >
                      <StyledListItem button>
                        <ListItemIcon />
                        <SubdirectoryArrowRightIcon
                          fontSize='small'
                          style={{
                            color: secondSubActive === "unmet-needs" ? "#49BCF8" : "#fff",
                          }}
                        />
                        <ListItemText
                          primary='Unmet Needs'
                          style={{
                            color: secondSubActive === "unmet-needs" ? "#49BCF8" : "#fff",
                          }}
                        />
                      </StyledListItem>
                    </Link>
                    <Link
                      id='general-comments'
                      to='/general-comments'
                      style={{ textDecoration: "none" }}
                      onClick={this._onClickButtonDrawer.bind(
                        this,
                        "report",
                        "voiceofcustomer",
                        "general-comments"
                      )}
                    >
                      <StyledListItem button>
                        <ListItemIcon />
                        <SubdirectoryArrowRightIcon
                          fontSize='small'
                          style={{
                            color: secondSubActive === "general-comments" ? "#49BCF8" : "#fff",
                          }}
                        />
                        <ListItemText
                          primary='General Comments'
                          style={{
                            color: secondSubActive === "general-comments" ? "#49BCF8" : "#fff",
                          }}
                        />
                      </StyledListItem>
                    </Link>
                  </Collapse>
                </Box>
              )}
              {modules.customerTouchpoint.view && (
                <Box>
                  <StyledListItem
                    id='customer-touchpoint'
                    button
                    onClick={this._onClickButtonDrawer.bind(
                      this,
                      "report",
                      "customer-touchpoint",
                      ""
                    )}
                  >
                    <ListItemIcon />
                    <ListItemText primary='Customer Touchpoint' />
                    {subActive === "customer-touchpoint" ? <ExpandLess /> : <ExpandMore />}
                  </StyledListItem>
                  <Collapse in={subActive === "customer-touchpoint"}>
                    <Link
                      id='upcoming-visits'
                      to='/upcoming-visits'
                      style={{ textDecoration: "none" }}
                      onClick={this._onClickButtonDrawer.bind(
                        this,
                        "report",
                        "customer-touchpoint",
                        "upcoming-visits"
                      )}
                    >
                      <StyledListItem button className='long-text'>
                        <ListItemIcon />
                        <SubdirectoryArrowRightIcon
                          fontSize='small'
                          style={{
                            color: secondSubActive === "upcoming-visits" ? "#49BCF8" : "#fff",
                          }}
                        />
                        <ListItemText
                          primary='Upcoming Calls/Visit'
                          style={{
                            color: secondSubActive === "upcoming-visits" ? "#49BCF8" : "#fff",
                          }}
                        />
                      </StyledListItem>
                    </Link>
                    <Link
                      id='visits-completed-percentage'
                      to='/visits-completed-percentage'
                      style={{ textDecoration: "none" }}
                      className='long-text'
                      onClick={this._onClickButtonDrawer.bind(
                        this,
                        "report",
                        "customer-touchpoint",
                        "visits-completed-percentage"
                      )}
                    >
                      <StyledListItem button className='long-text'>
                        <ListItemIcon />
                        <SubdirectoryArrowRightIcon
                          fontSize='small'
                          style={{
                            color:
                              secondSubActive === "visits-completed-percentage"
                                ? "#49BCF8"
                                : "#fff",
                          }}
                        />
                        <ListItemText
                          primary='Percentage of Completed Calls/Visits'
                          style={{
                            color:
                              secondSubActive === "visits-completed-percentage"
                                ? "#49BCF8"
                                : "#fff",
                          }}
                        />
                      </StyledListItem>
                    </Link>
                  </Collapse>
                </Box>
              )}
            </Collapse>
            {modules.listManagement.view && (
              <Box>
                <StyledListItem
                  id='list-management'
                  button
                  onClick={this._onClickButtonDrawer.bind(this, "list-management", "", "")}
                >
                  <ListItemIcon>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText primary='List Management' />
                  {activeTab === "list-management" ? <ExpandLess /> : <ExpandMore />}
                </StyledListItem>
                <Collapse in={activeTab === "list-management"}>
                  <Link
                    id='company'
                    to='/company'
                    style={{ textDecoration: "none" }}
                    onClick={this._onClickButtonDrawer.bind(this, "list-management", "company", "")}
                  >
                    <StyledListItem button>
                      <ListItemIcon />
                      <ListItemText
                        primary='Company'
                        style={{
                          color: subActive === "company" ? "#49BCF8" : "#fff",
                        }}
                      />
                    </StyledListItem>
                  </Link>

                  <Link
                    id='customer-type'
                    to='/customer-type'
                    style={{ textDecoration: "none" }}
                    onClick={this._onClickButtonDrawer.bind(
                      this,
                      "list-management",
                      "customer-type",
                      ""
                    )}
                  >
                    <StyledListItem button>
                      <ListItemIcon />
                      <ListItemText
                        primary='Customer Type'
                        style={{
                          color: subActive === "customer-type" ? "#49BCF8" : "#fff",
                        }}
                      />
                    </StyledListItem>
                  </Link>

                  <Link
                    id='category'
                    to='/category'
                    style={{ textDecoration: "none" }}
                    onClick={this._onClickButtonDrawer.bind(
                      this,
                      "list-management",
                      "category",
                      ""
                    )}
                  >
                    <StyledListItem button>
                      <ListItemIcon />
                      <ListItemText
                        primary='Category'
                        style={{
                          color: subActive === "category" ? "#49BCF8" : "#fff",
                        }}
                      />
                    </StyledListItem>
                  </Link>

                  <Link
                    id='industry'
                    to='/industry'
                    style={{ textDecoration: "none" }}
                    onClick={this._onClickButtonDrawer.bind(
                      this,
                      "list-management",
                      "industry",
                      ""
                    )}
                  >
                    <StyledListItem button>
                      <ListItemIcon />
                      <ListItemText
                        primary='Industry'
                        style={{
                          color: subActive === "industry" ? "#49BCF8" : "#fff",
                        }}
                      />
                    </StyledListItem>
                  </Link>

                  <Link
                    id='product-family'
                    to='/product-family'
                    style={{ textDecoration: "none" }}
                    onClick={this._onClickButtonDrawer.bind(
                      this,
                      "list-management",
                      "product-family",
                      ""
                    )}
                  >
                    <StyledListItem button>
                      <ListItemIcon />
                      <ListItemText
                        primary='Product Family'
                        style={{
                          color: subActive === "product-family" ? "#49BCF8" : "#fff",
                        }}
                      />
                    </StyledListItem>
                  </Link>

                  <Link
                    id='make'
                    to='/make'
                    style={{ textDecoration: "none" }}
                    onClick={this._onClickButtonDrawer.bind(this, "list-management", "make", "")}
                  >
                    <StyledListItem button>
                      <ListItemIcon />
                      <ListItemText
                        primary='Make'
                        style={{
                          color: subActive === "make" ? "#49BCF8" : "#fff",
                        }}
                      />
                    </StyledListItem>
                  </Link>

                  <Link
                    id='turnover'
                    to='/turnover'
                    style={{ textDecoration: "none" }}
                    onClick={this._onClickButtonDrawer.bind(
                      this,
                      "list-management",
                      "turnover",
                      ""
                    )}
                  >
                    <StyledListItem button>
                      <ListItemIcon />
                      <ListItemText
                        primary='Turnover'
                        style={{
                          color: subActive === "turnover" ? "#49BCF8" : "#fff",
                        }}
                      />
                    </StyledListItem>
                  </Link>

                  <Link
                    id='tier'
                    to='/tier'
                    style={{ textDecoration: "none" }}
                    onClick={this._onClickButtonDrawer.bind(this, "list-management", "tier", "")}
                  >
                    <StyledListItem button>
                      <ListItemIcon />
                      <ListItemText
                        primary='Tier'
                        style={{
                          color: subActive === "tier" ? "#49BCF8" : "#fff",
                        }}
                      />
                    </StyledListItem>
                  </Link>

                  <Link
                    id='international-local'
                    to='/international-local'
                    style={{ textDecoration: "none" }}
                    onClick={this._onClickButtonDrawer.bind(
                      this,
                      "list-management",
                      "international-local",
                      ""
                    )}
                  >
                    <StyledListItem button>
                      <ListItemIcon />
                      <ListItemText
                        primary='International/Local'
                        style={{
                          color: subActive === "international-local" ? "#49BCF8" : "#fff",
                        }}
                      />
                    </StyledListItem>
                  </Link>

                  <Link
                    id='government-private'
                    to='/government-private'
                    style={{ textDecoration: "none" }}
                    onClick={this._onClickButtonDrawer.bind(
                      this,
                      "list-management",
                      "government-private",
                      ""
                    )}
                  >
                    <StyledListItem button>
                      <ListItemIcon />
                      <ListItemText
                        primary='Government/Private'
                        style={{
                          color: subActive === "government-private" ? "#49BCF8" : "#fff",
                        }}
                      />
                    </StyledListItem>
                  </Link>
                  <Link
                    id='branch'
                    to='/branch'
                    style={{ textDecoration: "none" }}
                    onClick={this._onClickButtonDrawer.bind(this, "list-management", "branch", "")}
                  >
                    <StyledListItem button>
                      <ListItemIcon />
                      <ListItemText
                        primary='Branch'
                        style={{
                          color: subActive === "branch" ? "#49BCF8" : "#fff",
                        }}
                      />
                    </StyledListItem>
                  </Link>
                </Collapse>
              </Box>
            )}
            {modules.fields && modules.fields.view && (
              <Link
                id='fields-management'
                to='/fields-management'
                style={{ textDecoration: "none" }}
              >
                <StyledListItem
                  id='fields-management'
                  button
                  onClick={this._onClickButtonDrawer.bind(this, "fields-management", "", "")}
                >
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary='Fields Management' />
                </StyledListItem>
              </Link>
            )}
          </List>
        </StyledDrawer>
      </Box>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  system: state.system,
});

export default connect(mapStateToProps, {
  setActiveSystem,
  toggleDrawer,
  setInterceptor,
})(RepnotesDrawer);
