import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import uniqueId from 'lodash/uniqueId';

const redCellStyle = { backgroundColor: '#c00200' };

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 500,
    },
});

interface Column {
    title: string;
    field: string;
    cellStyle?: any; 
    headerStyle?: any;
}
 
interface RepnotesTableInterface {
    columns: Array<Column>;
    data: Array<{ [property: string]: string | number }>;
    gapData: Array<number>;
    disabled?: boolean;
}

export const ActualToTargetTable = (props: RepnotesTableInterface) => {
    const { 
        data, columns, gapData
    } = props;
    const classes = useStyles();

    let tableData = data;

    return(
        <Box>
            <Paper className={classes.root}>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table" >
                        <TableHead>
                            <TableRow >      
                                {columns.map((column) => (
                                    <TableCell
                                        component="th" 
                                        scope="row" 
                                        key={column.field}
                                        align={column.cellStyle.textAlign}
                                        style={{ ...column.headerStyle, color: '#fff', fontWeight: 600, padding:'10px 16px', cursor: 'pointer', width: 'auto'}}
                                        >
                                            {column.title}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData.map((row) => {
                                return (
                                    <TableRow hover key={uniqueId("id")}>
                                        {columns.map((column) => {
                                            const value = row[column.field];
                                            return (
                                            <TableCell key={column.field} component="th" scope="row" style={{ ...column.cellStyle, padding:'4px 16px', height: 35 }} >
                                                {value}
                                            </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                            {tableData.length === 0 && 
                                <TableRow key="empty-row" style={{ height: 40  }}>
                                    <TableCell key="cempty-row" component="td" scope="row" style={{textAlign:"center"}} colSpan={columns.length} >
                                        No available data
                                    </TableCell>
                                </TableRow>
                            }
                            <TableRow key="gap-row" style={{ height: 40  }}>
                                {columns.map((column, index) => {
                                    if(index < 12) return <TableCell key="cgap-row" component="td" scope="row" style={{textAlign:"center"}} colSpan={1} align='right'></TableCell>
                                    else return null
                                })}
                                <TableCell key="cgap-row" component="td" scope="row" style={{textAlign:"center"}} colSpan={1} align='right'>
                                    GAP
                                </TableCell>
                                {gapData && gapData.map((column) => {
                                    return <TableCell key={uniqueId("id")} component="td" scope="row" style={{ ...redCellStyle, textAlign:"center"}} colSpan={1} align='right'>{column}</TableCell>
                                })}
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    )
}