import './Login.scss'
import SapoLogo from './Sapo-logo.svg'
import React from "react";

function Login() {
    return ( 
        <div className='loginform'>
            <img src={SapoLogo} alt="" />
            <p>Đăng nhập vào cửa hàng của bạn</p>
            <input type="text" placeholder='Tài khoản'/>
            <input type="text" placeholder='Mật khẩu'/>
            <a href="/#">Quên mật khẩu?</a>
            <button>Đăng nhập</button>
        </div>

     );
}

export default Login;