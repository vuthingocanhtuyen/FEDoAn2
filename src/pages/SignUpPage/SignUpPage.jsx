import React from 'react'
import { Select } from 'antd'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import InputForm from '../../components/InputForm/InputForm'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import imageLogo from '../../assets/images/logo-login.png'
import { Image } from 'antd'
import { useState } from 'react'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import * as AdminGroupService from '../../services/AdminGroupService'
import * as PriorityByUserService from '../../services/PriorityByUserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { useEffect } from 'react'

const SignUpPage = () => {
  const navigate = useNavigate()
  const { Option } = Select;
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [QuanNhanId, setQuanNhanId] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [userId, setUserId] = useState('');
  const [isAdmin, setIsAdmin] = useState('user');
  const [uniqueData, setUniqueData] = useState([]);
  const handleOnchangeEmail = (value) => {
    setEmail(value)
  }

  const mutation = useMutationHooks(async data => {
    try {
        const res = await UserService.signupUser(data);
        console.log(res);
        setUserId(res.data._id);
    } catch (error) {
        console.error(error);
    }
  });

  useEffect(() => {
    uniqueData.forEach(async (item) => {
        const params = {
            objectcode: userId,
            admingroupcode: item,
        };

        try {
            await mutation2.mutate(params);
            message.success('Thành công');
            handleNavigateSignIn();
        } catch (error) {
            console.error(error);
            message.error('Error during mutation');
        }
    });
}, [uniqueData]);

  const mutation2 = useMutationHooks(
    (data) => {
        const { objectcode,
                admingroupcode,
              } = data
        const res = AdminGroupService.createStaffAdminGroup({
          objectcode,
          admingroupcode,
        });
        
        return res
    }
)
  const { data, isLoading, isSuccess, isError } = mutation

  useEffect(() => {
    if (isSuccess) {
      handleOnchangeAccount();
      // message.success()
      // handleNavigateSignIn()
    } else if (isError) {
      message.error()
    }
  }, [isSuccess, isError])

  const handleOnchangePassword = (value) => {
    setPassword(value)
  }
  const handleOnchangeAccount = async () => {
    try {
        const res = await PriorityByUserService.getAdminGroupIdFromUser(QuanNhanId);
        if (res.status === 'OK' && res.data) {
            const newData  = Array.from(new Set(res.data));
            setUniqueData(newData);
            return uniqueData;
        } else {
            return [];
        }
    } catch (error) {
        console.error(error);
        return [];
    }
};

  const onFinish = () => {
    
  }

  const handleOnchangeConfirmPassword = (value) => {
    setConfirmPassword(value)
  }
  const handleOnchangeQuanNhanId = (value) => {
    setQuanNhanId(value)
  }
  const handleOnchangeName = (value) => {
    setName(value)
  }
  const handleOnchangePhone = (value) => {
    setPhone(value)
  }
  const handleOnchangeAdmin = (value) => {
    setIsAdmin(value);
  }
  
  const handleNavigateSignIn = () => {
    navigate('/system/admin')
  }
 //nam o sau
 // tu quan nhan id thi co duoc chuc vu getchucvufromquannhanid
 // get admingroup id code from chucvu
  const handleSignUp = () => {
    mutation.mutate({ email, QuanNhanId,name,phone, password, confirmPassword,isAdmin })
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.53)', height: '100vh' }}>
      <div style={{ width: '800px', height: '500px', borderRadius: '6px', background: '#fff', display: 'flex' }}>
        <WrapperContainerLeft>
          <h1>Hệ thống Quản lý nhân sự BQP</h1>
          <p>Tạo mới tài khoản người sử dụng</p>
          <Select
          value={isAdmin} // isAdmin là một chuỗi, không phải một đối tượng event
           onChange={handleOnchangeAdmin} // Đã sửa lại hàm xử lý sự kiện
            >
          <Select.Option value="user">Người dùng</Select.Option>
          <Select.Option value="admin">Cán bộ quản lý</Select.Option>
          <Select.Option value="staff">Nhân viên</Select.Option>
          <Select.Option value="supervisor">Giám sát viên</Select.Option>
          </Select>

          <InputForm style={{ marginBottom: '10px' }} placeholder="email@gmail.com" value={email} onChange={handleOnchangeEmail} />
          <InputForm style={{ marginBottom: '10px' }} placeholder="Nhập mã Quân nhân" value={QuanNhanId} onChange={handleOnchangeQuanNhanId} />
          <InputForm style={{ marginBottom: '10px' }} placeholder="Nhập họ tên" value={name} onChange={handleOnchangeName} />
          

          <InputForm style={{ marginBottom: '10px' }} placeholder="Nhập số điện thoại" value={phone} onChange={handleOnchangePhone} />

          <div style={{ position: 'relative' }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{
                zIndex: 10,
                position: 'absolute',
                top: '4px',
                right: '8px'
              }}
            >{
                isShowPassword ? (
                  <EyeFilled />
                ) : (
                  <EyeInvisibleFilled />
                )
              }
            </span>
            <InputForm placeholder="Nhập mật khẩu" style={{ marginBottom: '10px' }} type={isShowPassword ? "text" : "password"}
              value={password} onChange={handleOnchangePassword} />
          </div>
          <div style={{ position: 'relative' }}>
            <span
              onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
              style={{
                zIndex: 10,
                position: 'absolute',
                top: '4px',
                right: '8px'
              }}
            >{
                isShowConfirmPassword ? (
                  <EyeFilled />
                ) : (
                  <EyeInvisibleFilled />
                )
              }
            </span>
            <InputForm placeholder="Nhập lại mật khẩu" type={isShowConfirmPassword ? "text" : "password"}
              value={confirmPassword} onChange={handleOnchangeConfirmPassword}
            />
          </div>
          {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
          <Loading isLoading={isLoading}>
            <ButtonComponent
              disabled={!email.length || !password.length || !confirmPassword.length || !QuanNhanId.length}
              onClick={handleSignUp}
              size={40}
              styleButton={{
                background: 'rgb(255, 57, 69)',
                height: '48px',
                width: '100%',
                border: 'none',
                borderRadius: '4px',
                margin: '26px 0 10px'
              }}
              textbutton={'Thêm'}
              styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
            ></ButtonComponent>
          </Loading>
          
        </WrapperContainerLeft>
        
      </div>
    </div >
  )
}

export default SignUpPage