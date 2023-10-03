
import React, { useEffect, useState, useRef } from 'react';
import { Form, Table, Button, Space } from 'antd';
import { useSelector } from 'react-redux';
import * as message from '../../../components/Message/Message'
import { getBase64 } from '../../../utils'
import Loading from '../../../components/LoadingComponent/Loading'
import InputComponent from '../../../components/InputComponent/InputComponent'
import { useMutationHooks } from '../../../hooks/useMutationHook'
import * as QuaTrinhDieuChuyenService from '../../../services/QuaTrinhDieuChuyenService';
import * as QuanNhanService from '../../../services/QuanNhanService';
import { WrapperHeader } from '../style'
import { useQuery } from '@tanstack/react-query'
import { DeleteOutlined, EditOutlined, SearchOutlined, CheckOutlined, WarningOutlined } from '@ant-design/icons'

import ModalComponent from '../../../components/ModalComponent/ModalComponent'
import DrawerComponent from '../../../components/DrawerComponent/DrawerComponent'
import TableComponent from '../../../components/TableComponent/TableComponent';
import moment from 'moment';
const QuanLyChucVuQN = ({idQuanNhan }) =>  {
    console.log(idQuanNhan)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const user = useSelector((state) => state?.user)
    const searchInput = useRef(null);
    const inittial = () => ({
        QuanNhanId: '',
        HoTen: '',
        NgaySinh: '',
        GioiTinh: '',
        QueQuan: '',
        DiaChi: '',
        SoDienThoai: '',
        Email: '',
        HoatDong: '',
        QuanHam: '',
        DonVi: '',
        LoaiQN: ''
      })
    
    
      const [stateQuanNhan, setStateQuanNhan] = useState(inittial())
      const [stateQuanNhanDetails, setStateQuanNhanDetails] = useState(inittial())

    const [form] = Form.useForm();


    const mutationDeleted = useMutationHooks(
        (data) => {
            const { id,
                index,
                token,
            } = data
            const res = QuanNhanService.delete2ListsQuanNhan(
                id,
                index,
                token)
            return res
        },
    )
    const handleDelete2Lists= (index) => {
        mutationDeleted.mutate({ id: rowSelected,index: index, token: user?.access_token }, {
            onSettled: () => {
                queryQuanNhan.refetch()
            }
        })
    }

   

    const getAllQuanNhans = async () => {
        const res = await QuanNhanService.getDetailsQuanNhan(idQuanNhan)
        return res
    }

    const fetchGetDetailsQuanNhan = async (rowSelected) => {
        const res = await QuanNhanService.getDetailsQuanNhan(rowSelected)
        if (res?.data) {
            setStateQuanNhanDetails({
                QuanNhanId: res?.data?.QuanNhanId,
                HoTen: res?.data?.HoTen,
                NgaySinh: res?.data?.NgaySinh,
                GioiTinh: res?.data?.GioiTinh,
                QueQuan: res?.data?.QueQuan,
                DiaChi: res?.data?.DiaChi,
                SoDienThoai: res?.data?.SoDienThoai,
                Email: res?.data?.Email,
                HoatDong: res?.data?.HoatDong,
                QuanHam: res?.data?.QuanHam,
                DonVi: res?.data?.DonVi,
                LoaiQN: res?.data?.LoaiQN
            })
        }
        setIsLoadingUpdate(false)
    }

    useEffect(() => {
        if (!isModalOpen) {
            form.setFieldsValue(stateQuanNhanDetails)
        } else {
            form.setFieldsValue(inittial())
        }
    }, [form, stateQuanNhanDetails, isModalOpen])

    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            setIsLoadingUpdate(true)
            fetchGetDetailsQuanNhan(rowSelected)
        }
    }, [rowSelected, isOpenDrawer])

    const handleDetailsQuanNhan = () => {
        setIsOpenDrawer(true)
    }

    const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDelected, isError: isErrorDeleted } = mutationDeleted
    const queryQuanNhan = useQuery(
        ['quannhans', idQuanNhan], // Thay đổi queryKey để phản ánh idQuanNhan
        getAllQuanNhans,
        {
            enabled: !!idQuanNhan, // Kích hoạt truy vấn khi idQuanNhan không null
        }
    );
    const { isLoading: isLoadingQuanNhans, data: quannhans } = queryQuanNhan
    const renderAction = () => {
        return (
            <div>
                <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
                <EditOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailsQuanNhan} />
            </div>
        )
    }

    const columns = [
        {
          title: 'Chức vụ và Đơn vị',
          dataIndex: 'combinedInfo',
        },
        {
          title: 'Action',
          dataIndex: 'action',
          render: (text, record) => (
            <button onClick={() => handleOnchange2(record.index)}>
              Kết thúc
            </button>
          ),
        },
      ];
const dataTable = quannhans && quannhans.data
  ? quannhans.data.HoatDong.map((item, index) => ({
      ...quannhans.data, // Copy all properties from quannhans.data
      combinedInfo: `${item} - ${quannhans.data.DonVi[index]}`,
      action: (
        <Button onClick={() => handleOnchange2(index)}>
          Edit
        </Button>
      ),
      index: index
    }))
  : [];

  const handleOnchange2 = (index) => {
    handleDelete2Lists(index);
}
    

   

    useEffect(() => {
        if (isSuccessDelected && dataDeleted?.status === 'OK') {
            message.success()
            handleCancelDelete()
        } else if (isErrorDeleted) {
            message.error()
        }
    }, [isSuccessDelected])

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateQuanNhanDetails({
            QuanNhanId: '',
      HoTen: '',
      NgaySinh: '',
      GioiTinh: '',
      QueQuan: '',
      DiaChi: '',
      SoDienThoai: '',
      Email: '',
      HoatDong: '',
      QuanHam: '',
      DonVi: '',
      LoaiQN: ''
        })
        form.resetFields()
    };

   

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }


   

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateQuanNhan({
            QuanNhanId: '',
      HoTen: '',
      NgaySinh: '',
      GioiTinh: '',
      QueQuan: '',
      DiaChi: '',
      SoDienThoai: '',
      Email: '',
      HoatDong: '',
      QuanHam: '',
      DonVi: '',
      LoaiQN: ''
        })
        form.resetFields()
    };

    const onFinish = async () => { // Add 'async' keyword here
        const data = {
            departmentlist: stateQuanNhan['DonVi'],
            leveltitlelist: stateQuanNhan['HoatDong'],
          };
        
        try {
            const result = await QuanNhanService.updateQuanNhanLists(idQuanNhan, data, user?.access_token);
            console.log(result);
            if (result.status === 'OK') {
                message.success(result.message);
                handleCancel();
                queryQuanNhan.refetch();
            } else {
                message.error(result.message);
            }
        } catch (error) {
            console.error(error);
            message.error('An error occurred');
        }
    };
    
    const handleOnchange = (e) => {
        setStateQuanNhan({
            ...stateQuanNhan,
            [e.target.name]: e.target.value
        })
    }

    const handleOnchangeDetails = (e) => {
        setStateQuanNhanDetails({
            ...stateQuanNhanDetails,
            [e.target.name]: e.target.value
        })
    }


    const handleChangeSelect = (value) => {
        setStateQuanNhan({
            ...stateQuanNhan,
            type: value
        })
    }

    return (
        
        <div>
            <WrapperHeader>Quản lý chức vụ cán bộ</WrapperHeader>
            <div style={{ marginTop: '10px' }}>
                <Button onClick={() => setIsModalOpen(true)}>Thêm chức vụ</Button>
            </div>
            <div style={{ marginTop: '20px' }}>
                 <TableComponent columns={columns} isLoading={isLoadingQuanNhans} data={dataTable} onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {
                            setRowSelected(record._id);
                          }
                        
                    };
                }} />
            </div>
            <ModalComponent forceRender title="Thêm thông tin phạm vi nhóm" open={isModalOpen} onCancel={handleCancel} footer={null}>
                

                    <Form
                        name="basic"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        onFinish={onFinish}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                            label="Đơn vị"
                            name="DonVi"
                            rules={[{ required: true, message: 'Please input your department!' }]}
                        >
                            <InputComponent value={stateQuanNhan['DonVi']} onChange={handleOnchange} name="DonVi" />
                        </Form.Item>
                        <Form.Item
                            label="Chức vụ"
                            name="HoatDong"
                            // rules={[{ required: true, message: 'Please input your leveltitle!' }]}
                        >
                            <InputComponent value={stateQuanNhan['HoatDong']} onChange={handleOnchange} name="HoatDong" />
                        </Form.Item>
                        
                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
              
            </ModalComponent>


            <DrawerComponent title='Danh sách nhóm' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="90%">
                <Loading isLoading={isLoadingUpdate}>

                    <Form
                        name="basic"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 22 }}
                        
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <InputComponent value={stateQuanNhanDetails['name']} onChange={handleOnchangeDetails} name="name" />
                        </Form.Item>
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <InputComponent value={stateQuanNhanDetails['name']} onChange={handleOnchangeDetails} name="name" />
                        </Form.Item>
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <InputComponent value={stateQuanNhanDetails['name']} onChange={handleOnchangeDetails} name="name" />
                        </Form.Item>
                        
                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Apply
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </DrawerComponent>
            <ModalComponent title="Xóa nhóm quyền" open={isModalOpenDelete} onCancel={handleCancelDelete}>
                <Loading isLoading={isLoadingDeleted}>
                    <div>Bạn có chắc xóa quyền này không?</div>
                </Loading>
            </ModalComponent>
        </div>
       
    )
}

export default QuanLyChucVuQN;
