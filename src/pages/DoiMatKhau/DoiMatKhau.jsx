import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import InputForm from '../../components/InputForm/InputForm'
import { WrapperContentProfile, WrapperHeader, WrapperInput, WrapperLabel } from './style'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/slides/userSlide'
import { getBase64 } from '../../utils'

const DoiMatKhau = () => {
    const user = useSelector((state) => state.user)
    console.log("Usêr:", user)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [oldPassword, setoldPassword] = useState('')
    const [newPassword, setnewPassword] = useState('')
    const [confirmPassword, setconfirmPassword] = useState('')
    const mutation = useMutationHooks(
        (data) => {
            const { id, access_token, ...rests } = data
            UserService.updatePassword(id, rests, access_token)
        }
    )

    const dispatch = useDispatch()
    const { data, isLoading, isSuccess, isError } = mutation

    useEffect(() => {
        setEmail(user?.email)
        setName(user?.name)
        setPhone(user?.phone)
        setAddress(user?.address)
        
    }, [user])

    useEffect(() => {
        if (isSuccess) {
            // message.success()
            handleGetDetailsUser(user?.id, user?.access_token)
        } else if (isError) {
            // message.error()
        }
    }, [isSuccess, isError])

    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUser(id, token)
        dispatch(updateUser({ ...res?.data, access_token: token }))
    }

    const handleOnchangeEmail = (value) => {
        setEmail(value)
    }
    const handleOnchangeName = (value) => {
        setName(value)
    }
    const handleOnchangeoldPassword = (value) => {
        setoldPassword(value)
    }
    const handleOnchangenewPassword= (value) => {
        setnewPassword(value)
    }
    const handleOnchangeconfirmPassword= (value) => {
        setconfirmPassword(value)
    }
    
   

    const handleUpdate = () => {
        mutation.mutate({ id: user?.id, oldPassword,newPassword,confirmPassword, access_token: user?.access_token });
    }
    return (
        <div style={{ width: '1270px', margin: '0 auto', height: '500px' }}>
            <br />
            <WrapperHeader style={{ marginLeft: '385px'}}>Đổi mật khẩu</WrapperHeader>
    
            <Loading isLoading={isLoading}>
            <WrapperContentProfile style={{  width: '500px',display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <WrapperInput>
                        <WrapperLabel htmlFor="name">Name</WrapperLabel>
                        <InputForm style={{ width: '300px' }} id="name" value={name} onChange={handleOnchangeName} />
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor="email">Email</WrapperLabel>
                        <InputForm style={{ width: '300px' }} id="email" value={email} onChange={handleOnchangeEmail} />
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor="oldPassword">Mật khẩu cũ</WrapperLabel>
                        <InputForm style={{ width: '300px' }} id="oldPassword" type="password" value={oldPassword} onChange={handleOnchangeoldPassword} />
                    </WrapperInput>

                    <WrapperInput>
                        <WrapperLabel htmlFor="newPassword">Mật khẩu mới</WrapperLabel>
                        <InputForm style={{ width: '300px' }} id="newPassword" type="password" value={newPassword} onChange={handleOnchangenewPassword} />
                    </WrapperInput>

                    <WrapperInput>
                        <WrapperLabel htmlFor="confirmPassword">Nhập lại mật khẩu mới</WrapperLabel>
                        <InputForm style={{ width: '300px' }} id="confirmPassword" type="password" value={confirmPassword} onChange={handleOnchangeconfirmPassword} />
                      
                    </WrapperInput>
                    <ButtonComponent
                            onClick={handleUpdate}
                            size={40}
                            styleButton={{
                                height: '30px',
                                width: 'fit-content',
                                borderRadius: '4px',
                                padding: '2px 6px 6px',
                                marginLeft: '50px', 
                            }}
                            textbutton={'Cập nhật'}
                            styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                </WrapperContentProfile>
            </Loading>
        </div>
    )
}

export default DoiMatKhau