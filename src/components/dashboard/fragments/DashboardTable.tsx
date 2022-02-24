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

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 500,
    },
});

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    let tempB, tempA;
    if(typeof b[orderBy] === "boolean") {
        tempB = Number(b[orderBy]).toString()
        tempA = Number(a[orderBy]).toString()
    }else{
        tempB = b[orderBy] ? ((b[orderBy] as unknown) as string).toLowerCase() : ''
        tempA = a[orderBy] ? ((a[orderBy] as unknown) as string).toLowerCase() : ''
    }

    if ( tempB < tempA ) {
        return -1;
    }
    if ( tempB > tempA ) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc' | undefined;

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
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

export const DashboardTable = (props: RepnotesTableInterface) => {
    const { 
        data, columns
    } = props;
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [order, setOrder] = React.useState<'asc' | 'desc' | undefined>('desc');
    const [orderBy, setOrderBy] = React.useState('period');

    let tableData = data;
    console.log(data)

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const handleSortRequest = (cellId : string) =>{
        const isAsc = orderBy === cellId && order === "asc"
        setOrder(isAsc?'desc':'asc')
        setOrderBy(cellId)
    }

    return(
        <Box style={{ width: '100%' }}>
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
                                        style={{ ...column.headerStyle, color: '#fff', fontWeight: 400, padding:'10px 16px', cursor: 'pointer', width: 'auto', fontSize: '12px'}}
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
                            {stableSort(tableData, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                return (
                                    <TableRow hover key={uniqueId("id")}>
                                        {columns.map((column) => {
                                            const value = row[column.field];
                                            return (
                                            <TableCell key={column.field} component="th" scope="row" style={{ ...column.cellStyle, padding:'4px 16px', height: 35,  fontSize: '12px' }} >
                                                {value}
                                            </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                            {tableData.length === 0 && 
                                <TableRow key="empty-row" style={{ height: 40  }}>
                                    <TableCell key="cempty-row" component="td" scope="row" style={{textAlign:"center",  fontSize: '12px'}} colSpan={columns.length} >
                                        No available data
                                    </TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 50]}
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