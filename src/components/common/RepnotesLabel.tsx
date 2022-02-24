import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

interface RepnotesLabelProps {
    id: string;
    label: string;
    labelPosition?: 'top' | 'left' | 'right' | 'bottom'
    value?: string | number | boolean;
}

export const RepnotesLabel = (props: RepnotesLabelProps) => {

    const { value, label, labelPosition,  } = props;

    return (
        <Box>
            <Grid container>
                {labelPosition === 'top' && 
                    <Grid item xs={12} style={{ textAlign: 'left' }}>
                        <Typography 
                            style={{
                                fontSize: 12, 
                                fontWeight: 700, 
                                textAlign: 'left', 
                                color: '#272B75'
                            }}
                        >
                            {label}
                        </Typography>
                    </Grid>
                }
                {labelPosition === 'left' && 
                    <Grid item xs={4} style={{ textAlign: 'right', paddingRight: '15px', paddingTop: '3px' }}>
                        <Typography 
                            style={{
                                padding: '3px 0',
                                fontSize: 12, 
                                fontWeight: 700,
                                color: '#272B75'
                            }}
                        >
                            {label}
                        </Typography>
                    </Grid>
                }
                <Grid item xs={(labelPosition === 'left' || labelPosition === 'right') ? 8 : 12}>
                        <Typography 
                            style={{
                                marginTop: '5px',
                                fontSize: 12, 
                                fontWeight: 650,
                                color: '#000'
                            }}
                        >
                            {value}
                        </Typography>
                </Grid>
            </Grid>
        </Box>
    )
}