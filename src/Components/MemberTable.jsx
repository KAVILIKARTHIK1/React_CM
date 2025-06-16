import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Paper, TablePagination, TableSortLabel
} from '@mui/material';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function MemberTable({ members }) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('bimemberid');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const navigate = useNavigate();

  const handleEdit = (member) => {
    navigate(`/memberquality?Id=${member.bimemberid}`);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
  };

  const getComparator = React.useCallback((order, orderBy) =>
  order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
, []);


  const visibleRows = React.useMemo(
  () =>
    [...members]
      .sort(getComparator(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
  [order, orderBy, page, rowsPerPage, members, getComparator]
);


  return (
    <Paper sx={{ border: '1px solid #ccc', borderRadius: '8px' }}>
      <TableContainer sx={{ maxHeight: 600, overflow: 'auto' }}>
        <Table stickyHeader sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  textAlign: 'left',
                  color: 'white',
                  backgroundColor: '#231e49',
                  position: 'sticky',
                  top: 0,
                  left: 0,
                  zIndex: 2,
                }}
              >
                Action
              </TableCell>
              {members[0] &&
                Object.keys(members[0]).map((key) => (
                  <TableCell
                    key={key}
                    sx={{
                      textAlign: 'left',
                      color: 'white',
                      backgroundColor: '#231e49',
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === key}
                      direction={orderBy === key ? order : 'asc'}
                      onClick={(e) => handleRequestSort(e, key)}
                      sx={{
                        '&.Mui-active': {
                          color: 'white',
                          '& .MuiSvgIcon-root': {
                            color: 'white',
                          },
                        },
                      }}
                    >
                      {key}
                    </TableSortLabel>
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((member, idx) => (
              <TableRow key={idx}>
                <TableCell sx={{ position: 'sticky', left: 0, backgroundColor: '#fff', zIndex: 1 }}>
                  <Button onClick={() => handleEdit(member)} sx={{ padding: '0px' }}>
                    <EditSquareIcon />
                  </Button>
                </TableCell>
                {Object.keys(member).map((key) => (
                  <TableCell key={key}>
                    {key === 'bimemberid' ? (
                          <Link to={`/memberquality?Id=${member.bimemberid}`} style={{ textDecoration: 'none', color: '#3f51b5' }}>
                            {member[key]}
                          </Link>
                        ) : (
                          member[key]
                        )}
                    </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={members.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />
    </Paper>
  );
}
