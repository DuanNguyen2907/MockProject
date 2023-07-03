import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import './Sales.scss';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import OrderBody from '../../components/OrderBody/OrderBody';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { getCookie } from '../../utils/api';
import { NumericFormat } from 'react-number-format';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import axios from 'axios';
import {
    ResultCustomerSearch,
    RetailCustomers,
    ResultProductSearch,
    Customer,
} from '../../components/ResultSearch/ResultSearch';
import AddCustomer from '../../components/AddCustomer/AddCustomer';
import { apiBaseUrl } from '../../constant/constant';

const orders1 = [
    {
        order: 1,
        products: [],
        customer: null,
    },
];

// const user = JSON.parse(localStorage.getItem('sapo'));

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function SalesInShop() {
    const [value, setValue] = React.useState(0);
    const [addCustomer, setAddCustomer] = React.useState(false);
    // const [chooseInventory, setChooseInventory] = React.useState(false);
    const [search, setSearch] = React.useState('');
    const [searchProduct, setSearchProduct] = React.useState('');
    const [customers, setCustomers] = React.useState([]);
    const [products, setProducts] = React.useState([]);
    const [inventory, setInventory] = React.useState([]);
    const [inventoryData, setInventoryData] = React.useState('chi nhánh 1');
    const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const [openSnackBarWarning, setOpenSnackBarWarning] = React.useState(false);
    const [SnackbarMessage, setSnackbarMessage] = React.useState('');
    const [orders, setOrders] = React.useState(orders1);
    const [money, setMoney] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [warning, setWarning] = React.useState('');
    const [deleteId, setDeleteId] = React.useState();
    const [userInfo, setUserInfo] = React.useState();

    function TransitionDown(props) {
        return <Slide {...props} direction="down" />;
    }

    const handleClickSnackBar = () => {
        setOpenSnackBar(true);
    };

    const handleClickSnackBarWarning = () => {
        setOpenSnackBarWarning(true);
    };

    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackBar(false);
    };
    const handleCloseSnackBarWarning = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackBarWarning(false);
    };

    useEffect(() => {
        if (search !== '') {
            axios
                .get(`${apiBaseUrl}/care/customers?phone=` + search, {
                    headers: {
                        // token: Cookies.get('token'),
                        Authorization: getCookie('Authorization'),
                    },
                })
                .then((Response) => {
                    setCustomers(Response.data.content);
                });
        } else {
            setCustomers([]);
        }
    }, [search]);

    useEffect(() => {
        axios
            .get(`${apiBaseUrl}/inventory/inventories`, {
                headers: {
                    // token: Cookies.get('token'),
                    Authorization: getCookie('Authorization'),
                },
            })
            .then((Response) => {
                setInventory(Response.data);
            })
            .catch((err) => {
                setSnackbarMessage(err.message);
                handleClickSnackBarWarning();
            });
    }, []);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('sapo'));
        axios.get(`${apiBaseUrl}/auth/user/info?id=${user?.userId}`).then((response) => {
            setUserInfo(response.data);
        });
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setMoney(orders[newValue]?.products.reduce((total, current) => (total += current.quantity * current.price), 0));
    };

    const createOrder = () => {
        let total = orders[value].products.reduce((total, current) => (total += current.quantity * current.price), 0);
        let totalQuantity = orders[value].products.reduce(
            (totalQuantity, current) => (totalQuantity += current.quantity),
            0,
        );
        let orderLines = orders[value].products;
        if (orders[value].customer == null) {
            setSnackbarMessage('Xin hãy thêm khách hàng!');
            handleClickSnackBarWarning();
        } else {
            axios
                .post(
                    `${apiBaseUrl}/sales/orders`,
                    {
                        orderLines: orderLines,
                        orderTable: {
                            customerCode: orders[value].customer.code,
                            staffCode: userInfo.code,
                            quantity: totalQuantity,
                            status: 'success',
                            total: total,
                        },
                    },
                    {
                        headers: {
                            // token: Cookies.get('token'),
                            Authorization: getCookie('Authorization'),
                        },
                    },
                )
                .then(() => {
                    handleDeleteOrderAfterCreate(value);
                });
        }
    };

    const handleAddCustomer = (event) => {
        setAddCustomer(true);
    };

    const handleCloseAddCustomer = (event) => {
        setAddCustomer(false);
    };
    // handle ChooseInventory

    const handleChangeInventoryData = (event) => {
        setInventoryData(event.target.value);
    };

    const handleDelete = (productId) => {
        setOrders((currentState) => {
            const newState = [...currentState];
            const updatedOrderItems = newState[value].products.filter((item) => item.attributeID !== productId);
            newState[value].products = updatedOrderItems;
            setMoney(
                newState[value]?.products.reduce((total, current) => (total += current.quantity * current.price), 0),
            );
            return newState;
        });
    };
    const handleDeleteCustomer = () => {
        setOrders((currentState) => {
            const newState = [...currentState];
            newState[value].customer = null;
            return newState;
        });
    };

    const handleUp = (productId) => {
        setOrders((currentState) => {
            const newState = JSON.parse(JSON.stringify(currentState));
            const updatedOrderItems = newState[value];

            const updatedProducts = updatedOrderItems.products.map((product) => {
                if (product.attributeID === productId) {
                    if (product.quantity + 1 > product.inventory_quantity) {
                        setSnackbarMessage(
                            'Xin lỗi ! kho chỉ còn lại ' + product.inventory_quantity + ' ' + product.name,
                        );
                        handleClickSnackBarWarning();
                        return product;
                    } else {
                        return { ...product, quantity: product.quantity + 1 };
                    }
                }
                return product;
            });

            updatedOrderItems.products = updatedProducts;

            setMoney(updatedProducts?.reduce((total, current) => (total += current.quantity * current.price), 0));
            return newState;
        });
    };

    const handleDown = (productId) => {
        setOrders((currentState) => {
            const newState = JSON.parse(JSON.stringify(currentState));
            const updatedOrderItems = newState[value];

            const updatedProducts = updatedOrderItems.products.map((product) => {
                if (product.attributeID === productId) {
                    if (product.quantity - 1 <= 0) {
                        return null; // Trả về null để đánh dấu sản phẩm cần bị xóa
                    } else {
                        return { ...product, quantity: product.quantity - 1 };
                    }
                }
                return product;
            });

            // Loại bỏ sản phẩm có giá trị là null
            updatedOrderItems.products = updatedProducts.filter((product) => product !== null);

            setMoney(
                updatedProducts?.reduce(
                    (total, current) => (total += (current?.quantity || 0) * (current?.price || 0)),
                    0,
                ),
            );
            return newState;
        });
    };

    const handleChangeQuantity = (productId, quantity) => {
        setOrders((currentState) => {
            const newState = JSON.parse(JSON.stringify(currentState));
            const updatedOrderItems = newState[value];

            const updatedProducts = updatedOrderItems.products.map((product) => {
                if (product.attributeID === productId) {
                    if (quantity > product.inventory_quantity) {
                        setSnackbarMessage(
                            'Xin lỗi ! kho chỉ còn lại ' + product.inventory_quantity + ' ' + product.name,
                        );
                        handleClickSnackBarWarning();
                        return { ...product, quantity: product.inventory_quantity };
                    } else if (quantity <= 0) {
                        return null;
                    } else {
                        return { ...product, quantity: quantity };
                    }
                }
                return product;
            });

            // Loại bỏ sản phẩm có giá trị là null
            updatedOrderItems.products = updatedProducts.filter((product) => product !== null);

            setMoney(
                updatedProducts?.reduce(
                    (total, current) => (total += (current?.quantity || 0) * (current?.price || 0)),
                    0,
                ),
            );
            return newState;
        });
    };

    const handleDeleteOrder = (orderID) => {
        setDeleteId(orderID);
        setMessage('Bạn có chắc chắn muốn xóa đơn hàng này?');
        setWarning('Sau khi xóa sẽ không thể hoàn tác được');
        setOpen(true);
    };
    const handleDeleteOrderAfterCreate = (orderID) => {
        setDeleteId(orderID);
        setMessage('Bạn có chắc chắn muốn tạo đơn hàng này?');
        setWarning('Sau khi tạo sẽ không thể hoàn tác được');
        setOpen(true);
    };

    const handleConfirmDelete = () => {
        const updatedOrderItems = orders.filter((item, index) => index !== deleteId);
        let updatedOrders = [];

        if (updatedOrderItems.length === 0) {
            const newOrder = {
                order: 1,
                products: [],
                customer: null,
            };
            updatedOrders = [newOrder];
            setValue(1);
        } else {
            updatedOrders = [...updatedOrderItems];
        }

        setOrders(updatedOrders);
        setMoney(0);

        setValue((prevValue) => {
            if (deleteId <= prevValue) {
                prevValue > 0
                    ? setMoney(
                          updatedOrders[prevValue - 1]?.products.reduce(
                              (total, current) => (total += current.quantity * current.price),
                              0,
                          ),
                      )
                    : setMoney(
                          updatedOrders[prevValue]?.products.reduce(
                              (total, current) => (total += current.quantity * current.price),
                              0,
                          ),
                      );
                const nextTabValue = prevValue > 0 ? prevValue - 1 : prevValue;

                return nextTabValue;
            }
            return prevValue;
        });

        // if (deleteId <= value) {
        //     setValue((prevValue) => prevValue - 1);
        // }

        setOpen(false);
        if (message === 'Bạn có chắc chắn muốn tạo đơn hàng này?') {
            setSnackbarMessage('Tạo đơn hàng thành công!');
            handleClickSnackBar();
        } else if (message === 'Bạn có chắc chắn muốn xóa đơn hàng này?') {
            setSnackbarMessage('Xóa đơn hàng thành công!');
            handleClickSnackBar();
        }
    };

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <div className="body1" sx={{ height: '100vh' }}>
            {addCustomer && (
                <div className="All">
                    <AddCustomer handleCloseAddCustomer={handleCloseAddCustomer} />
                </div>
            )}
            {/* dialog */}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{message}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">{warning}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={handleConfirmDelete} autoFocus>
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>
            <Box sx={{ width: '100%', height: '97.5vh' }}>
                <Grid container>
                    <Grid xs={12}>
                        <div className="logo">
                            <div className="image">
                                <Link to="/dashboard">
                                    <img
                                        src="https://th.bing.com/th/id/OIP.SN5g8vx2XD2rKNq1QrcEhQHaCu?pid=ImgDet&rs=1"
                                        alt=""
                                    />
                                </Link>
                            </div>
                        </div>
                        <div className="Nav">
                            <div className="addProduct">
                                <TextField
                                    label="Thêm sản phẩm"
                                    id="outlined-start-adornment"
                                    value={searchProduct}
                                    onChange={(event) => {
                                        setSearchProduct(event.target.value);
                                    }}
                                    onMouseEnter={useEffect(() => {
                                        if (searchProduct !== '') {
                                            axios
                                                .get(
                                                    `${apiBaseUrl}/sales/products?code=` +
                                                        searchProduct +
                                                        `&inventory=` +
                                                        inventoryData,
                                                    {
                                                        headers: {
                                                            // token: Cookies.get('token'),
                                                            Authorization: getCookie('Authorization'),
                                                        },
                                                    },
                                                )
                                                .then((Response) => {
                                                    setProducts(Response.data);
                                                });
                                        } else {
                                            setProducts([]);
                                        }
                                    }, [searchProduct, inventoryData])}
                                    sx={{ m: 1, width: '60ch' }}
                                    InputProps={{
                                        style: { color: 'white' },
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ color: 'white' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <div className="result_search">
                                    <Card sx={{ minWidth: '60ch', height: 'auto' }}>
                                        {products.map((product) => {
                                            return (
                                                <ResultProductSearch
                                                    sx={{ width: '98%', margin: '10px 0' }}
                                                    key={product.id}
                                                    product={product}
                                                    onClick={() => {
                                                        if (product.quantity === 0) {
                                                            setSnackbarMessage('SP đã hết hàng');
                                                            handleClickSnackBarWarning();
                                                        } else {
                                                            const product1 = {
                                                                productCode: product.code,
                                                                name: product.name,
                                                                inventory_quantity: product.quantity,
                                                                quantity: 1,
                                                                img: product.image,
                                                                price: product.price,
                                                                attributeID: product.id,
                                                                size: product.size,
                                                                color: product.color,
                                                            };
                                                            var duplicate = false;

                                                            for (var i = 0; i < orders[value].products.length; i++) {
                                                                if (
                                                                    orders[value].products[i].attributeID === product.id
                                                                ) {
                                                                    orders[value].products[i].quantity += 1;
                                                                    duplicate = true;
                                                                }
                                                            }

                                                            if (duplicate === false) {
                                                                orders[value].products.push(product1);
                                                            }
                                                            setMoney(
                                                                orders[value]?.products.reduce(
                                                                    (total, current) =>
                                                                        (total += current.quantity * current.price),
                                                                    0,
                                                                ),
                                                            );
                                                        }
                                                        setSearchProduct('');
                                                    }}
                                                />
                                            );
                                        })}
                                    </Card>
                                </div>
                                <div className="orders">
                                    <Box
                                        sx={{ borderBottom: 1, borderColor: 'divider', maxWidth: { xs: 320, sm: 480 } }}
                                    >
                                        <Tabs
                                            value={value}
                                            onChange={handleChange}
                                            aria-label="basic tabs example"
                                            variant="scrollable"
                                            scrollButtons="auto"
                                            textColor="white"
                                            indicatorColor="red"
                                            sx={{ height: '100%' }}
                                        >
                                            {orders ? (
                                                orders.map((order, index) => {
                                                    let labell = 'Đơn ' + (index + 1);
                                                    return (
                                                        <Tab
                                                            label={
                                                                <div>
                                                                    {labell}
                                                                    <IconButton
                                                                        aria-label="close"
                                                                        size="small"
                                                                        onClick={() => {
                                                                            handleDeleteOrder(index);
                                                                        }}
                                                                        sx={{
                                                                            marginLeft: '4px',
                                                                            opacity: 0,
                                                                            color: 'white',
                                                                            height: '100%',
                                                                            transition:
                                                                                'visibility 0s linear 0.2s, opacity 0.2s linear',
                                                                            '&:hover': {
                                                                                visibility: 'visible',
                                                                                opacity: 1,
                                                                                color: 'white',
                                                                                transition: 'opacity 0.2s linear',
                                                                            },
                                                                        }}
                                                                    >
                                                                        <DeleteIcon
                                                                            fontSize="small"
                                                                            sx={{ height: '100%' }}
                                                                        />
                                                                    </IconButton>
                                                                </div>
                                                            }
                                                            {...a11yProps(index)}
                                                            className="tabs"
                                                            // icon={

                                                            // }
                                                            iconPosition="end"
                                                        ></Tab>
                                                    );
                                                })
                                            ) : (
                                                <></>
                                            )}
                                        </Tabs>
                                    </Box>
                                    <div
                                        className="addOrder"
                                        onClick={(event) => {
                                            if (orders.length < 10) {
                                                let newOrder = {
                                                    order: orders.length + 1,
                                                    products: [],
                                                    customer: null,
                                                };
                                                setOrders([...orders, newOrder]);
                                            }
                                        }}
                                    >
                                        <AddIcon fontSize="large" />
                                    </div>
                                </div>
                            </div>
                            <div className="user">
                                <div>
                                    <LocationOnIcon />
                                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                        <Select
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            value={inventoryData}
                                            onChange={handleChangeInventoryData}
                                            label="Chi nhánh"
                                            sx={{
                                                color: 'white', // Màu chữ
                                                '&:before': {
                                                    borderColor: 'white', // Màu đường viền trước khi chọn
                                                },
                                                '&:after': {
                                                    borderColor: 'white', // Màu đường viền sau khi chọn
                                                },
                                                '& .MuiSvgIcon-root': {
                                                    color: 'white', // Màu biểu tượng mũi tên
                                                },
                                                '& .MuiListItem-root': {
                                                    color: 'black', // Màu chữ trong lựa chọn
                                                    backgroundColor: 'white', // Màu nền lựa chọn
                                                },
                                            }}
                                        >
                                            {inventory ? (
                                                inventory.map((item, index) => {
                                                    return (
                                                        <MenuItem color="white" key={index} value={item.name}>
                                                            {item.name}
                                                        </MenuItem>
                                                    );
                                                })
                                            ) : (
                                                <></>
                                            )}
                                        </Select>
                                    </FormControl>
                                </div>
                                <div
                                    sx={{
                                        '&hover': {
                                            cursor: 'pointer',
                                        },
                                    }}
                                >
                                    <AccountCircleIcon />
                                    <span className="name">{userInfo?.name}</span>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid
                        xs={8}
                        sx={{
                            backgroundColor: 'white',
                            height: '85.5vh',
                            border: '5px solid #F3F3F3',
                            borderTop: 'none',
                            borderLeft: 'none',
                            borderBottom: 'none',
                            paddingRight: '5px',
                        }}
                    >
                        {orders ? (
                            orders.map((order, index) => {
                                return (
                                    <OrderBody
                                        rows={order.products}
                                        value={value}
                                        index={index}
                                        onDeleteProduct={handleDelete}
                                        onDown={handleDown}
                                        onUp={handleUp}
                                        onChangeQuantity={handleChangeQuantity}
                                    />
                                );
                            })
                        ) : (
                            <></>
                        )}
                    </Grid>
                    <Grid xs={4} sx={{ backgroundColor: 'white', height: '85.5vh', paddingLeft: '3px' }}>
                        {orders[value]?.customer === null ? (
                            <div className="addCustomer">
                                <TextField
                                    label="Thêm khách hàng"
                                    id="outlined-start-adornment"
                                    sx={{ m: 1, width: '53ch' }}
                                    value={search}
                                    onChange={(event) => {
                                        setSearch(event.target.value);
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <AddIcon onClick={handleAddCustomer} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <div className="result_search">
                                    <Card sx={{ minWidth: 275 }}>
                                        {customers.map((customer) => {
                                            return (
                                                <ResultCustomerSearch
                                                    customer={customer}
                                                    onClick={() => {
                                                        orders[value].customer = customer;
                                                        console.log(orders[value]);
                                                        setSearch('');
                                                    }}
                                                />
                                            );
                                        })}
                                        {search !== '' ? <RetailCustomers /> : <></>}
                                    </Card>
                                </div>
                            </div>
                        ) : (
                            <Customer customer={orders[value]?.customer} handleDeleteCustomer={handleDeleteCustomer} />
                        )}
                        <div className="order_info">
                            <p className="order_info_line">
                                <span>Số lượng sản phẩm:</span>
                                {parseInt(
                                    orders[value]?.products.reduce((total, current) => (total += current.quantity), 0),
                                )}
                            </p>
                            <p className="order_info_line">
                                <span>Thành tiền:</span>
                                {orders[value]?.products
                                    .reduce((total, current) => (total += current.quantity * current.price), 0)
                                    .toLocaleString('en-US')}
                            </p>
                            <p className="order_info_line">
                                <span>VAT(0%):</span>0
                            </p>
                            <p className="order_info_line">
                                <span>Số tiền khách phải trả:</span>
                                {orders[value]?.products
                                    .reduce((total, current) => (total += current.quantity * current.price), 0)
                                    .toLocaleString('en-US')}
                            </p>
                            <p className="order_info_line">
                                <span>Số tiền khách đưa:</span>
                                <NumericFormat
                                    thousandSeparator={true}
                                    prefix={''}
                                    customInput={TextField}
                                    type="text"
                                    // Các thuộc tính khác của TextField
                                    defaultValue={orders[value]?.products.reduce(
                                        (total, current) => (total += current.quantity * current.price),
                                        0,
                                    )}
                                    inputProps={{
                                        style: {
                                            textAlign: 'right', // Căn phải
                                        },
                                    }}
                                    value={money}
                                    sx={{ width: '20%', marginLeft: 'auto' }}
                                    size="small"
                                    variant="standard"
                                    onChange={(e) => {
                                        setMoney(parseFloat(e.target.value.replace(/,/g, '')));
                                    }}
                                />
                            </p>
                            <p className="order_info_line">
                                <span>Số tiền phải trả:</span>
                                {(
                                    money -
                                    orders[value]?.products.reduce(
                                        (total, current) => (total += current.quantity * current.price),
                                        0,
                                    )
                                ).toLocaleString('en-US')}
                            </p>
                        </div>
                        <Button variant="contained" onClick={createOrder}>
                            Thanh toán
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <div>
                {/* <Button onClick={handleClickSnackBar}>Open simple snackbar</Button> */}
                <Snackbar
                    open={openSnackBar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackBar}
                    TransitionComponent={TransitionDown}
                    // message="Tạo sản phẩm thành công"
                    // action={action}
                >
                    <Alert sx={{ padding: '8px' }} severity="success" color="info">
                        {SnackbarMessage}
                    </Alert>
                </Snackbar>
            </div>
            <div>
                {/* <Button onClick={handleClickSnackBar}>Open simple snackbar</Button> */}
                <Snackbar
                    open={openSnackBarWarning}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackBarWarning}
                    TransitionComponent={TransitionDown}
                    // message="Tạo sản phẩm thành công"
                    // action={action}
                >
                    <Alert sx={{ padding: '8px' }} severity="error">
                        {SnackbarMessage}
                    </Alert>
                </Snackbar>
            </div>
        </div>
    );
}

export default SalesInShop;
