import React from 'react';
import { RepnotesTabPanel } from './RepnotesProductFeatureTabContent';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import map from 'lodash/map'
import without from 'lodash/without'
import { OptionalMachineFeature, StandardMachineFeature } from '../../../store/productManagement/product/types';

interface RepnotesProductFeatureTabsInterface {
    standardMachineFeature: Array<StandardMachineFeature>;
    optionalMachineFeature: Array<OptionalMachineFeature>;
    onClickDelete: (id: string, type: string)  => void;
    onClickEdit: (id: string, type: string)  => void;
    disabled?: boolean;
}

export const RepnotesProductFeatureTabs = (props: RepnotesProductFeatureTabsInterface ) => {
    const [value, setValue] = React.useState(0);
    const handleChange = ( newValue: number) => {
        setValue(newValue);
    }

    return(
        <Grid item xs={12}>
            <Tabs value={value} indicatorColor="primary"  onChange={(event, value) => { handleChange(value) }}  aria-label="repnotes customer tabs">
                <Tab label="Standard Machine Feature" style={{color:'#50AF44', minWidth:80, fontWeight: 600}} />
                <Tab label="Optional Machine Feature" style={{color:'#299DD7', minWidth:80, fontWeight: 600}} />
            </Tabs>
            <RepnotesTabPanel 
                onClickEdit={props.onClickEdit}
                onClickDelete={props.onClickDelete}
                value={value}
                disabled={props.disabled}
                index={0}
                type="standard"
                data={map(props.standardMachineFeature, (data: any) => ({
                    ...data,
                    name: data.name,
                    subFeature: data.subFeature ? 
                    <Box>
                        <ul>
                            {data.subFeature.map((i: any) => (
                                <li key={i}>{i}</li>
                            ))}
                        </ul>
                    </Box>
                    : ''
                }))}
            />
            <RepnotesTabPanel 
                onClickEdit={props.onClickEdit}
                onClickDelete={props.onClickDelete}
                value={value}
                disabled={props.disabled}
                index={1}
                type="optional"
                data={without(map(props.optionalMachineFeature, (data: any) => ({
                    ...data,
                    subFeature: data.subFeature ? 
                    <Box>
                        <ul>
                            {data.subFeature.map((i: any) => (
                                <li key={i}>{i.name}</li>
                            ))}
                        </ul>
                    </Box>
                    : ''
                })), undefined)}
            />
        </Grid>
    )
}