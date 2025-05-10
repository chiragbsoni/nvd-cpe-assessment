// 📁 App.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Pagination, Tooltip, Popover, Button, Select, MenuItem } from '@mui/material';

const App = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(15);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({
        cpe_title: '',
        cpe_22_uri: '',
        cpe_23_uri: '',
        deprecation_date: ''
    });
    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverLinks, setPopoverLinks] = useState([]);

    const fetchData = async () => {
        let url = `http://127.0.0.1:5000/api/cpes?page=${page}&limit=${limit}`;
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key]) params.append(key, filters[key]);
        });

        if (params.toString()) {
            url = `http://127.0.0.1:5000/api/cpes/search?${params.toString()}`;
        }

        const res = await axios.get(url);
        if (res.data.data) {
            setData(res.data.data);
            setTotal(res.data.total || res.data.data.length);
        } else {
            setData([]);
            setTotal(0);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, limit]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = () => {
        setPage(1);
        fetchData();
    };

    const handlePopoverOpen = (event, links) => {
        setAnchorEl(event.currentTarget);
        setPopoverLinks(links);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    return (
        <Paper sx={{ padding: 2 }}>
            <h1>CPE Data Viewer</h1>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <TextField label="Title" name="cpe_title" value={filters.cpe_title} onChange={handleFilterChange} />
                <TextField label="CPE 22 URI" name="cpe_22_uri" value={filters.cpe_22_uri} onChange={handleFilterChange} />
                <TextField label="CPE 23 URI" name="cpe_23_uri" value={filters.cpe_23_uri} onChange={handleFilterChange} />
                <TextField label="Deprecation Date (MM-DD-YYYY)" name="deprecation_date" value={filters.deprecation_date} onChange={handleFilterChange} />
                <Button variant="contained" onClick={handleSearch}>Search</Button>
            </div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>URL 22</TableCell>
                            <TableCell>URL 23</TableCell>
                            <TableCell>Deprecated Date 22</TableCell>
                            <TableCell>Deprecated Date 23</TableCell>
                            <TableCell>References</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.length > 0 ? data.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>
                                    <Tooltip title={row.cpe_title}>
                                        <span>{row.cpe_title.length > 30 ? `${row.cpe_title.slice(0, 30)}...` : row.cpe_title}</span>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>{row.cpe_22_uri}</TableCell>
                                <TableCell>{row.cpe_23_uri}</TableCell>
                                <TableCell>{row.cpe_22_deprecation_date ? new Date(row.cpe_22_deprecation_date).toLocaleDateString() : 'N/A'}</TableCell>
                                <TableCell>{row.cpe_23_deprecation_date ? new Date(row.cpe_23_deprecation_date).toLocaleDateString() : 'N/A'}</TableCell>
                                <TableCell>
                                    {row.reference_links.slice(0, 2).map((link, index) => (
                                        <div key={index}>
                                            <a href={link} target="_blank" rel="noopener noreferrer">
                                                {link.length > 30 ? `${link.slice(0, 30)}...` : link}
                                            </a>
                                        </div>
                                    ))}
                                    {row.reference_links.length > 2 && (
                                        <Button size="small" onClick={(e) => handlePopoverOpen(e, row.reference_links)}>+{row.reference_links.length - 2} more</Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">No Data Found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <Pagination count={Math.ceil(total / limit)} page={page} onChange={(e, value) => setPage(value)} />
                <Select value={limit} onChange={(e) => setLimit(e.target.value)}>
                    {[15, 20, 30, 50].map(size => (
                        <MenuItem key={size} value={size}>{size} / page</MenuItem>
                    ))}
                </Select>
            </div>

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <div style={{ padding: '1rem' }}>
                    {popoverLinks.map((link, index) => (
                        <div key={index}>
                            <a href={link} target="_blank" rel="noopener noreferrer">
                                {link.length > 50 ? `${link.slice(0, 50)}...` : link}
                            </a>
                        </div>
                    ))}
                </div>
            </Popover>
        </Paper>
    );
};

export default App;
