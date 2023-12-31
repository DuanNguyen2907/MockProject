import './CustomerDetail.scss'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import UpdateModal from './updateModal/UpdateModal';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import APIapp from '../../components/APIapp/APIapp';

function CustomerDetail (){
    const [update, setUpdate] = useState(false) 
    const [customer, setCustomer] = useState({})
    const [lastOrder, setLastOrder]=useState("")
    const [totalPaid, setTotalPaid]=useState(0)
    const [totalOrder, setTotalOrder] = useState(0)
    const navigate= useNavigate()
    const param= useParams()

    const toggleUpdate =()=>{
        setUpdate(!update)
    }

    const handleCreateFeedback =()=>{
        navigate(`/care/feedbacks/new?code=${param.id}`)
    }
    const handleReturn=() =>{
        navigate('/care/customers')
    }

    useEffect(()=>{
        const fetchData =async ()=>{
            const res= await APIapp.get(`/admin/care/customers/${param.id}`)
            const res1= await APIapp.get(`/admin/care/customers/${param.id}/last_order`)
            const res2= await APIapp.get(`/admin/care/customers/${param.id}/total_order`)
            console.log(res2)
            setCustomer(res.data)
            setLastOrder(res1.data)
            setTotalOrder(res2.data[1])
            if(res2.data[0]===null){
                setTotalPaid(0)
            }
            else{
                setTotalPaid(res2.data[0])
            }
        }
        fetchData()
    },[])

    const handleUpdateLastContact= async()=>{
        const confirmed = window.confirm("Bạn có chắc chắn muốn cập nhật lại ngày liên hệ gần nhất ?")
        if(confirmed){
            const res = await APIapp.post(`/admin/care/customers/${param.id}/lastcontact`)
            console.log(res)
            window.alert("Cập nhật thành công!")
            window.location.reload()
        }
    }

    const lastContact= new Date(customer.lastContact)
    const lastOrderFix=new Date(lastOrder)

    return(
        <div className='customerpage'>
            <div className='header'>
                <span className='return' onClick={handleReturn}>
                    <ChevronLeftIcon className='icon'/>
                    Quay lại trang danh sách
                </span>
                <div className='btn'>
                    <button className='createfeeback' onClick={handleCreateFeedback}>Tạo phản hồi</button>
                </div>
            </div>
            <div className='customerName'>
                <h1>{customer.name}</h1>
            </div>
            <div className='baseinfor'>
                <div className='title'>
                    <span>Thông tin cá nhân</span>
                    <a onClick={toggleUpdate}>Cập nhật</a>
                </div>
                <div className='infor'>
                    <div className='leftname'>
                        <p>Mã khách hàng</p>
                        <p>Số điện thoại</p>
                    </div>
                    <div className='leftcontent'>
                        <p>: {customer.code}</p>
                        <p>: {customer.phone}</p>
                    </div>
                    <div className='rightname'>
                        <p>Lần liên hệ cuối</p>
                        <p>Email</p>
                    </div>
                    <div className='rightcontent'>
                        <p className='lastcontact'>: {(customer.lastContact!==null)?lastContact.getDate()+"/"+(lastContact.getMonth()+1)+"/"+lastContact.getFullYear():"Chưa liên hệ"}<button className='updatebtn' onClick={handleUpdateLastContact}>Cập nhật liên hệ</button></p>
                        <p>: {customer.email}</p>
                    </div>
                </div>
            </div>
            <div className='buyinginfor'>
                <div className='title'>
                    <span>Thông tin mua hàng</span>
                </div>
                <div className='infor'>
                    <div className='leftname'>
                        <p>Tổng SL đơn hàng</p>
                        <p>Lần cuối mua hàng</p>
                    </div>
                    <div className='leftcontent'>
                        <p>: {totalOrder}</p>
                        <p>: {lastOrderFix.getDate()}/{lastOrderFix.getMonth()+1}/{lastOrderFix.getFullYear()}</p>
                    </div>
                    <div className='rightname'>
                        <p>Tổng chi tiêu</p>
                    </div>
                    <div className='rightcontent'>
                        <p>: {totalPaid.toLocaleString()}</p>
                    </div>
                </div>
            </div>
            {update &&<UpdateModal clickMethod={toggleUpdate} data={customer}/>}
        </div>
    )
}

export default CustomerDetail
