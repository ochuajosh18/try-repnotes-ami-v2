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

// icon
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import TuneIcon from '@material-ui/icons/Tune';

// utils
import map from 'lodash/map';

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
    generalCommentsFilter: (field: string, value: string) => void;
    customerTypeId: string;
    customerId: string;
    industryId: string;
}

export const RepnotesGeneralCommentsFilter = (props: RepnotesProfilePopoverProps) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (e: any) => {
        setAnchorEl(e.currentTarget);
    };

    const open = Boolean(anchorEl);
    const id = open ? "account-popover" : undefined;

    return (
        <Box>
            <Box border={1} borderRadius={5} borderColor={"#d2d6de"} style={{ display: 'flex', backgroundColor:'#49BCF8', justifyContent: 'space-between', cursor: 'pointer', padding:"5px 10px"}}  onClick={ handleClick } aria-describedby={id}>
                <TuneIcon style={{ color:'#fff' }}></TuneIcon>
                <Typography variant="body1" style={{ fontWeight: 550, color:'#fff', fontSize: '13px', paddingTop: '2%' }}>
                      Filter
                </Typography>
                {(open)? 
                        <KeyboardArrowUpIcon style={{ color: '#fff' }} /> 
                    : 
                        <KeyboardArrowDownIcon style={{ color: '#fff' }}/> 
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
                  
                    <Grid container style={{ padding:'20px 5px' }} spacing={2} >
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
                                        props.generalCommentsFilter('industryId', o ? o.value : '');
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
                                        props.generalCommentsFilter('customerTypeId', o ? o.value : '');
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
                                        props.generalCommentsFilter('customerId', o ? o.value : '');
                                    }}
                                    disableAutocompletePopover={true}
                                />
                            </Grid>
                            <Grid item xs={1} />
                        </Grid>
                    </Grid>
                </Box>
            </FilterPopover>
        </Box>
    )
}