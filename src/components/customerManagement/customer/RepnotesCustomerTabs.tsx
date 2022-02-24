import React from 'react';
import { RepnotesTabPanel } from './RepnotesCustomerTabContent';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import map from 'lodash/map'
import without from 'lodash/without'
import { Permissions } from '../../../store/system/types';

interface RepnotesCustomerTablesInterface {
    companyFilter:(value: string ) => void;
    companyValidation: () => void;
    data: Array<{ [property: string]: string | number }>;
    onDialogOpen: (id: string | number, name: string | number, type: string ) => void;
    permission?: Permissions;
}

export const RepnotesCustomerTables = (props: RepnotesCustomerTablesInterface ) => {
    const [value, setValue] = React.useState(0);
    const tableData = props.data;
    const handleChange = ( newValue: number) => {
        setValue(newValue);
    }

    return(
        <Grid item xs={12}>
            <Tabs value={value} indicatorColor="primary"  onChange={(event, value) => { handleChange(value) }}  aria-label="repnotes customer tabs">
                <Tab label="Active" style={{color:'green', minWidth:80, fontWeight: 600}} />
                <Tab label="Inactive" style={{color:'red', minWidth:80, fontWeight: 600}} />
                <Tab label="Pending" style={{color:'orange', minWidth:80, fontWeight: 600}} />
            </Tabs>
            <RepnotesTabPanel 
                onDialogOpen={props.onDialogOpen}
                value={value} 
                index={0} 
                data={without(map(tableData, (data: any) => {
                    if (data.isActive && data.status === 'Approved') return data;
                }), undefined)}
                permission={props.permission}
            />
            <RepnotesTabPanel 
                onDialogOpen={props.onDialogOpen}
                value={value} 
                index={1} 
                data={without(map(tableData, (data: any) => {
                    if (!data.isActive && data.status === 'Approved') return data;
                }), undefined)}
                permission={props.permission}
            />
            <RepnotesTabPanel 
                onDialogOpen={props.onDialogOpen}
                value={value} 
                index={2}
                type="view"
                data={without(map(tableData, (data: any) => {
                    if (data.status === 'Pending') return data;
                }), undefined)}
                permission={props.permission}
            />
        </Grid>
    )
}






