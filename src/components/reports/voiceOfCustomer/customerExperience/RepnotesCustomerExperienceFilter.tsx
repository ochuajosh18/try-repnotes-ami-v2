import React from 'react';
import { IndustryDetails } from '../../../../store/listManagement/industry/types';
import { CustomerTypeDetails } from '../../../../store/listManagement/customerType/types';
import { CustomerDetails } from '../../../../store/customerManagement/customer/types';
import { RepnotesInput } from '../../../common/RepnotesInput';
import { withStyles } from '@material-ui/styles';
import Popover from '@material-ui/core/Popover';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';

// utils
import map from 'lodash/map';
import MomentUtils from '@date-io/moment';
import moment from 'moment';

// icon
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import TuneIcon from '@material-ui/icons/Tune';
import { CustomerExperienceContainer } from './fragments/CustomerExperienceComponents';

const FilterPopover = withStyles(
    () => ({
        root: {
            marginTop: '44px',
            padding: '10px',
            '& .MuiPaper-root' : {
                padding: '10px',
            }
        }
    }) 
)(Popover)


interface RepnotesProfilePopoverProps {
    industryList: Array<IndustryDetails>;
    customerTypeList: Array<CustomerTypeDetails>;
    customerList: Array<CustomerDetails>;
    customerExperienceFilter: (field: string, value: string) => void;
    customerTypeId: string;
    industryId: string;
    customerId: string;
    rating: number;
    yearDate: string;
}

export const RepnotesCustomerExperienceFilter = (props: RepnotesProfilePopoverProps) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const open = Boolean(anchorEl);
    const id = open ? "account-popover" : undefined;

    return (
        <Box>
            <Box border={1} borderRadius={5} borderColor={"#d2d6de"} style= {{ display: 'flex', backgroundColor:'#49BCF8', justifyContent: 'space-between', cursor: 'pointer', padding:"5px 10px"}}  onClick={ handleClick } aria-describedby={id}>
                <TuneIcon style={{color:'#fff'}}></TuneIcon>
                <Typography variant="body1" style= {{ fontWeight: 550, color:'#fff', fontSize: '13px', paddingTop: '2%' }}>
                      Filter
                </Typography>
                {(open)? 
                        <KeyboardArrowUpIcon style= {{color: '#fff'}} /> 
                    : 
                        <KeyboardArrowDownIcon style= {{color: '#fff'}}/> 
                }
            </Box>

            <FilterPopover  
                    id= {id}
                    open= {open}
                    onClose= {() => setAnchorEl(null)}
                    anchorEl= {anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                
                <Box style={{width: '300px', height: 'auto', display: 'block', textAlign: "center", }}>
                  
                    <Grid container style={{padding:'20px 5px'}} spacing={2} >
                        <Grid container >
                            <Grid item xs={1} />
                            <Grid item xs={10} style={{padding:"0 5px"}}>
                                <RepnotesInput
                                    id="repnotes-industry"
                                    type="searchabledropdown"
                                    label="Industry"
                                    labelPosition="top"
                                    value={props.industryId}
                                    autocompleteOptions={map(props.industryList, (f) => ({ label: f.name, value: f.id }))}
                                    onAutocompleteChange={(e, o) => {
                                        props.customerExperienceFilter('industryId', o ? o.value : '');
                                    }}
                                    disableAutocompletePopover={true}
                                />
                                <RepnotesInput
                                    id="repnotes-customer-type"
                                    type="searchabledropdown"
                                    label="Customer Type"
                                    labelPosition="top"
                                    value={props.customerTypeId}
                                    autocompleteOptions={map(props.customerTypeList, (f) => ({ label: f.name, value: f.id }))}
                                    onAutocompleteChange={(e, o) => {
                                        props.customerExperienceFilter('customerTypeId', o ? o.value : '');
                                    }}
                                    disableAutocompletePopover={true}
                                />
                                <RepnotesInput
                                    id="repnotes-customer"
                                    type="searchabledropdown"
                                    label="Customer"
                                    labelPosition="top"
                                    value={props.customerId}
                                    autocompleteOptions={map(props.customerList, (f) => ({ label: f.name, value: f.id }))}
                                    onAutocompleteChange={(e, o) => {
                                        props.customerExperienceFilter('customerId', o ? o.value : '');
                                    }}
                                    disableAutocompletePopover={true}
                                />
                                <RepnotesInput
                                    id="repnotes-rating-selection"
                                    type="select"
                                    label="Rating"
                                    labelPosition="top"
                                    firstSelectOption="all"
                                    value={props.rating}
                                    options={map([1,2,3,4,5], (n) => ({
                                        id: n,
                                        name: n
                                    }))}
                                    onSelectChange={(e: React.ChangeEvent<{ name?: string; value: unknown}>) => {
                                        props.customerExperienceFilter('rating', e.target.value as string)
                                    }}
                                />
                                <CustomerExperienceContainer>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Typography 
                                                style={{
                                                    fontSize: 12, 
                                                    fontWeight: 700, 
                                                    textAlign: 'left', 
                                                    color: '#272B75',
                                                    marginBottom: 8
                                                }}
                                            >
                                                Year
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}></Grid>
                                        <Grid container spacing={2}>
                                            <Grid className="picker-container" item xs={12}>
                                                <MuiPickersUtilsProvider utils={MomentUtils}>
                                                    <DatePicker
                                                        disableToolbar
                                                        views={['year']}
                                                        variant="inline"
                                                        value={props.yearDate ? moment(props.yearDate, 'YYYY-MM-DD') : new Date()}
                                                        onChange={(d) => props.customerExperienceFilter('yearDate', moment(d).format('YYYY-MM-DD'))}
                                                        format="YYYY"
                                                        autoOk
                                                    />
                                                </MuiPickersUtilsProvider>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </CustomerExperienceContainer>
                            </Grid>
                            <Grid item xs={1} />
                        </Grid>
                    </Grid>
                </Box>
            </FilterPopover>
        </Box>
    )
}