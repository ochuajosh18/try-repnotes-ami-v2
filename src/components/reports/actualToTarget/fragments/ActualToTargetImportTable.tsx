import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import uniqueId from 'lodash/uniqueId';
import lOrderBy from 'lodash/orderBy'
import moment from 'moment';

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 500,
    },
});

// type Order = 'asc' | 'desc' | undefined;
const VALID_DATE_FORMATS = ['YYYY-MM-DD', 'MMMM D, YYYY', 'LL'];
const orderComparator = <T extends {}>(item: T, orderBy: keyof T) => {
    const stringVal = item[orderBy] ? ((item[orderBy] as unknown) as string).toString() : '';
    for (const f of VALID_DATE_FORMATS) { // date
        if (moment(item[orderBy], f, true).isValid()) return moment(item[orderBy]);
    }
    if (stringVal && ((((item[orderBy] as unknown) as string).toString().indexOf('$') > -1 ) || isFinite(parseFloat(stringVal)))) { // currency
        return parseFloat(stringVal.replace('$', '').replace(',', '').replace(/ +/, ''));
    }
    return stringVal.toLowerCase();
}


interface Column {
    title: string;
    field: string;
    cellStyle?: any; 
    headerStyle?: any;
}
 
interface RepnotesTableInterface {
    columns: Array<Column>;
    data: Array<{ [property: string]: string | number }>;
    disabled?: boolean;
}

export const ActualToTargetTable = (props: RepnotesTableInterface) => {
    const { 
        data, columns
    } = props;
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(20);
    const [order, setOrder] = React.useState<'asc' | 'desc' | undefined>('desc');
    const [orderBy, setOrderBy] = React.useState('area');

    let tableData = data;

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const handleSortRequest = (cellId : string) =>{
        const newOrder: typeof order = cellId === orderBy ? order ? (order === 'asc' ? 'desc' : undefined) : 'asc' : 'asc';
        setOrder(newOrder)
        setOrderBy(newOrder ? cellId : 'dateUpdated');
    }

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
                                            <TableSortLabel
                                                style = {{ color: '#fff' }}
                                                active={orderBy === column.field}
                                                direction = {orderBy === column.field ? order : 'asc'}
                                                onClick={ () => { handleSortRequest(column.field) } }
                                            >
                                            {column.title}
                                            </TableSortLabel>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {lOrderBy(tableData, (a) => orderComparator(a, orderBy), order) 
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
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
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 20, 30, 40, 50]}
                    component="div"
                    count={tableData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    )
}