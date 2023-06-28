import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import InputAdornment from '@mui/material/InputAdornment';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Card from '@mui/material/Card';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

import { apiBaseUrl } from '../../constant/constant';
import { getCookie } from '../../utils/api';
import OrdersBodyDetail from '../../components/OrdersBodyDetail/OrdersBodyDetail';

const OrderDetails = () => {
    const navigate = useNavigate();
    const { code } = useParams();
    const [orderLines, setOrderLines] = React.useState([]);
    const [order, setOrder] = React.useState({});
    React.useEffect(() => {
        axios
            .get(`${apiBaseUrl}/sales/order_line?code=${code}`, {
                headers: {
                    // token: Cookies.get('token'),
                    Authorization: getCookie('Authorization'),
                },
            })
            .then((res) => {
                setOrderLines(res.data);
            });
        axios
            .get(`${apiBaseUrl}/sales/order/details?code=${code}`, {
                headers: {
                    // token: Cookies.get('token'),
                    Authorization: getCookie('Authorization'),
                },
            })
            .then((res) => res.data)
            // .then(res => res[0])
            .then((res) => {
                setOrder(res);
            });
    }, []);
    return (
        <Box>
            <Box
                sx={{
                    width: 'calc(82vw - 44px)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderRadius: '10px',
                }}
            >
                <Grid container spacing={3} display="flex" alignItems="center">
                    <Grid>
                        <h2>{code}</h2>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ width: 'calc(82vw - 44px)', backgroundColor: 'white', borderRadius: '10px' }}>
                <Box p="12px" borderBottom="1px solid">
                    <h3>Thông tin đơn hàng</h3>
                </Box>
                <Box>
                    <Stack p="12px" pb="50px" direction="row" spacing={60}>
                        <Stack spacing={2}>
                            <p>Khách hàng : {order.customerName}</p>
                            <p>Nhân viên phụ trách : {order.staffName}</p>
                        </Stack>
                        <Stack spacing={20}>
                            <p>Ngày tạo :{order.orderDate}</p>
                        </Stack>
                    </Stack>
                </Box>
            </Box>
            <Box mt={4}>
                <OrdersBodyDetail rows={orderLines} />
            </Box>
        </Box>
    );
};
export default OrderDetails;
