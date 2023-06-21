import './CustomerDetail.scss'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import UpdateModal from './updateModal/UpdateModal';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CustomerDetail (){
    const [update, setUpdate] = useState(false) 
    const navigate= useNavigate()

    const toggleUpdate =()=>{
        setUpdate(!update)
    }

    const handleCreateFeedback =()=>{
        navigate('/feedbacks/new')
    }


    return(
        <div className='customerpage'>
            <div className='header'>
                <span className='return'>
                    <ChevronLeftIcon className='icon'/>
                    Quay lại trang danh sách
                </span>
                <div className='btn'>
                    <button className='createfeeback' onClick={handleCreateFeedback}>Tạo phản hồi</button>
                    <button className='updatebtn'>Cập nhật liên hệ</button>
                </div>
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
                        <p>:</p>
                        <p>:</p>
                    </div>
                    <div className='rightname'>
                        <p>Lần liên hệ cuối</p>
                        <p>Email</p>
                    </div>
                    <div className='rightcontent'>
                        <p>:</p>
                        <p>:</p>
                    </div>
                </div>
                <div className='bottom'>
                    <div className='left'>
                        <p>Địa chỉ</p>
                    </div>
                    <div className='right'>
                        <p>:</p>
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
                        <p>:</p>
                        <p>:</p>
                    </div>
                    <div className='rightname'>
                        <p>Tổng chi tiêu</p>
                    </div>
                    <div className='rightcontent'>
                        <p>:</p>
                    </div>
                </div>
            </div>
            {update &&<UpdateModal clickMethod={toggleUpdate}/>}
        </div>
    )
}

export default CustomerDetail