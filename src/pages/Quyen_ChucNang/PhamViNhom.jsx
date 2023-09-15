import { Button, Form, Select, Space } from 'antd'
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import React, { useRef } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style' 
import TableComponent from '../../components/TableComponent/TableComponent'
import { useState } from 'react'
import InputComponent from '../../components/InputComponent/InputComponent'
import { getBase64, renderOptions } from '../../utils'

import * as AdminGroupService from '../../services/AdminGroupService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import { useEffect } from 'react'
import * as message from '../../components/Message/Message'
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from '../../components/DrawerComponent/DrawerComponent'
import { useSelector } from 'react-redux'
import ModalComponent from '../../components/ModalComponent/ModalComponent'
import ButttonInputSearch from '../../components/ButtonInputSearch/ButttonInputSearch'
const PhamViNhom = ({selectedRowId,handleselectedrow}) => {
    console.log(selectedRowId)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const user = useSelector((state) => state?.user)
    const searchInput = useRef(null);
    const inittial = () => ({
        code: '',
        codeview: '',
        name: '',
        note: '',
        edituser: '',
        edittime: '',
        lock: '',
        lockdate: '',
        whois: '',
        unitcode: '',
        departmentlist: '',
        leveltitlelist: '',
        allunit: '',
        admin: '',
        staff: '',
    })
    
    
    const [stateAdminGroup, setStateAdminGroup] = useState(inittial())
    const [stateAdminGroupDetails, setStateAdminGroupDetails] = useState(inittial())

    const [form] = Form.useForm();

    const mutation = useMutationHooks(
        (data) => {
            const { code, codeview, name,  note,  edituser,edittime, lock, lockdate,  whois, unitcode, departmentlist, leveltitlelist, allunit, admin, staff } = data
            const res = AdminGroupService.createAdminGroup({
                code, codeview, name,  note,  edituser,edittime, lock, lockdate,  whois, unitcode, departmentlist, leveltitlelist, allunit, admin, staff
            })
            return res
        }
    )
    const mutationUpdate = useMutationHooks(
        (data) => {
            const { id,
                token,
                ...rests } = data
            const res = AdminGroupService.updateAdminGroup(
                id,
                token,
                { ...rests })
            return res
        },
    )

    const mutationDeleted = useMutationHooks(
        (data) => {
            const { id,
                index,
                token,
            } = data
            const res = AdminGroupService.delete2ListsAdminGroup(
                id,
                index,
                token)
            return res
        },
    )
    const handleDelete2Lists= (index) => {
        mutationDeleted.mutate({ id: rowSelected,index: index, token: user?.access_token }, {
            onSettled: () => {
                queryAdminGroup.refetch()
            }
        })
    }

    const mutationDeletedMany = useMutationHooks(
        (data) => {
            const { token, ...ids
            } = data
            const res = AdminGroupService.deleteManyAdminGroup(
                ids,
                token)
            return res
        },
    )

    const getAllAdminGroups = async () => {
        const res = await AdminGroupService.getDetailsAdminGroup(selectedRowId)
        return res
    }

    const fetchGetDetailsAdminGroup = async (rowSelected) => {
        const res = await AdminGroupService.getDetailsAdminGroup(rowSelected)
        if (res?.data) {
            setStateAdminGroupDetails({
                code: res?.data?.code,
            codeview: res?.data?.codeview,
            name: res?.data?.name,
            note: res?.data?.note,
            edituser: res?.data?.edituser,
            edittime: res?.data?.edittime,
            lock: res?.data?.lock,
            lockdate: res?.data?.lockdate,
            whois: res?.data?.whois,
            unitcode: res?.data?.unitcode,
            departmentlist: res?.data?.departmentlist,
            leveltitlelist: res?.data?.leveltitlelist,
            allunit: res?.data?.allunit,
            admin: res?.data?.admin,
            staff: res?.data?.staff,
            })
        }
        setIsLoadingUpdate(false)
    }

    useEffect(() => {
        if (!isModalOpen) {
            form.setFieldsValue(stateAdminGroupDetails)
        } else {
            form.setFieldsValue(inittial())
        }
    }, [form, stateAdminGroupDetails, isModalOpen])

    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            setIsLoadingUpdate(true)
            fetchGetDetailsAdminGroup(rowSelected)
        }
    }, [rowSelected, isOpenDrawer])

    const handleDetailsAdminGroup = () => {
        setIsOpenDrawer(true)
    }

    const handleDelteManyAdminGroups = (ids) => {
        mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
            onSettled: () => {
                queryAdminGroup.refetch()
            }
        })
    }


    const { data, isLoading, isSuccess, isError } = mutation
    const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDelected, isError: isErrorDeleted } = mutationDeleted
    const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDelectedMany, isError: isErrorDeletedMany } = mutationDeletedMany

    const queryAdminGroup = useQuery(
        ['admingroups', selectedRowId], // Thay đổi queryKey để phản ánh selectedRowId
        getAllAdminGroups,
        {
            enabled: !!selectedRowId, // Kích hoạt truy vấn khi selectedRowId không null
        }
    );
    // const queryAdminGroup = useQuery({ queryKey: ['admingroups'], queryFn: getAllAdminGroups })
    // const typeAdminGroup = useQuery({ queryKey: ['type-admingroup'], queryFn: fetchAllTypeAdminGroup })
    const { isLoading: isLoadingAdminGroups, data: admingroups } = queryAdminGroup
    const renderAction = () => {
        return (
            <div>
                <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
                <EditOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailsAdminGroup} />
            </div>
        )
    }


    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        // setSearchText(selectedKeys[0]);
        // setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        // setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <InputComponent
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    });

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
              Xóa
            </button>
          ),
        },
      ];
//       const dataTable = admingroups && admingroups.data
//   ? [{
//       ...admingroups.data,
//       combinedInfo: admingroups.data.leveltitlelist.map((item, index) =>
//         `${item} - ${admingroups.data.departmentlist[index]}`
//       ).join(' | '), 
//     }]
//   : [];
const dataTable = admingroups && admingroups.data
  ? admingroups.data.leveltitlelist.map((item, index) => ({
      ...admingroups.data, // Copy all properties from admingroups.data
      combinedInfo: `${item} - ${admingroups.data.departmentlist[index]}`,
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
    console.log("hello");
    console.log(index);
}
    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            message.success()
            handleCancel()
        } else if (isError) {
            message.error()
        }
    }, [isSuccess])

    useEffect(() => {
        if (isSuccessDelectedMany && dataDeletedMany?.status === 'OK') {
            message.success()
        } else if (isErrorDeletedMany) {
            message.error()
        }
    }, [isSuccessDelectedMany])

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
        setStateAdminGroupDetails({
            code: '',
            codeview: '',
            name: '',
            note: '',
            edituser: '',
            edittime: '',
            lock: '',
            lockdate: '',
            whois: '',
            unitcode: '',
            departmentlist: '',
            leveltitlelist: '',
            allunit: '',
            admin: '',
            staff: '',
        })
        form.resetFields()
    };

    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === 'OK') {
            message.success()
            handleCloseDrawer()
        } else if (isErrorUpdated) {
            message.error()
        }
    }, [isSuccessUpdated])

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }


    const handleDeleteAdminGroup = () => {
        mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
            onSettled: () => {
                queryAdminGroup.refetch()
            }
        })
    }

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateAdminGroup({
            code: '',
        codeview: '',
        name: '',
        note: '',
        edituser: '',
        edittime: '',
        lock: '',
        lockdate: '',
        whois: '',
        unitcode: '',
        departmentlist: '',
        leveltitlelist: '',
        allunit: '',
        admin: '',
        staff: '',
        })
        form.resetFields()
    };

    // const onFinish = () => {
    //     console.log("hello");
    //     const params = {
    //         code: stateAdminGroup.code,
    //     codeview: stateAdminGroup.codeview,
    //     name: stateAdminGroup.name,
    //     note: stateAdminGroup.note,
    //     edituser: stateAdminGroup.edituser,
    //     edittime: stateAdminGroup.edittime,
    //     lock: stateAdminGroup.lock,
    //     lockdate: stateAdminGroup.lockdate,
    //     whois: stateAdminGroup.whois,
    //     unitcode: stateAdminGroup.unitcode,
    //     departmentlist: stateAdminGroup.departmentlist,
    //     leveltitlelist: stateAdminGroup.leveltitlelist,
    //     allunit: stateAdminGroup.allunit,
    //     admin: stateAdminGroup.admin,
    //     staff: stateAdminGroup.staff,
    //     }
    //     mutation.mutate(params, {
    //         onSettled: () => {
    //             queryAdminGroup.refetch()
    //         }
    //     })
    // }
    const onFinish = async () => { // Add 'async' keyword here
        const data = {
            departmentlist: stateAdminGroup['departmentlist'],
            leveltitlelist: stateAdminGroup['leveltitlelist'],
          };
        
        try {
            const result = await AdminGroupService.updateAdminGroupLists(selectedRowId, data, user?.access_token);
            console.log(result);
            if (result.status === 'OK') {
                message.success(result.message);
                handleCancel();
                queryAdminGroup.refetch();
            } else {
                message.error(result.message);
            }
        } catch (error) {
            console.error(error);
            message.error('An error occurred');
        }
    };
    
    const handleOnchange = (e) => {
        setStateAdminGroup({
            ...stateAdminGroup,
            [e.target.name]: e.target.value
        })
    }

    const handleOnchangeDetails = (e) => {
        setStateAdminGroupDetails({
            ...stateAdminGroupDetails,
            [e.target.name]: e.target.value
        })
    }



    const onUpdateAdminGroup = () => {
        mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateAdminGroupDetails }, {
            onSettled: () => {
                queryAdminGroup.refetch()
            }
        })
    }

    const handleChangeSelect = (value) => {
        setStateAdminGroup({
            ...stateAdminGroup,
            type: value
        })
    }

    return (
        
        <div>
            <WrapperHeader>Quản lý nhóm người dùng</WrapperHeader>
            <div style={{ marginTop: '10px' }}>
                <Button onClick={() => setIsModalOpen(true)}>Thêm tham số</Button>
            </div>
            <div style={{ marginTop: '20px' }}>
                 <TableComponent handleDelteMany={handleDelteManyAdminGroups} columns={columns} isLoading={isLoadingAdminGroups} data={dataTable} onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {
                            setRowSelected(record._id);
                            
                            
                          }
                        
                    };
                }} />
            </div>
            <ModalComponent forceRender title="Thêm thông tin phạm vi nhóm" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <Loading isLoading={isLoading}>

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
                            name="departmentlist"
                            rules={[{ required: true, message: 'Please input your department!' }]}
                        >
                            <InputComponent value={stateAdminGroup['departmentlist']} onChange={handleOnchange} name="departmentlist" />
                        </Form.Item>
                        <Form.Item
                            label="Chức vụ"
                            name="leveltitlelist"
                            // rules={[{ required: true, message: 'Please input your leveltitle!' }]}
                        >
                            <InputComponent value={stateAdminGroup['leveltitlelist']} onChange={handleOnchange} name="leveltitlelist" />
                        </Form.Item>
                        
                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </ModalComponent>


            <DrawerComponent title='Danh sách nhóm' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="90%">
                <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>

                    <Form
                        name="basic"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 22 }}
                        onFinish={onUpdateAdminGroup}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <InputComponent value={stateAdminGroupDetails['name']} onChange={handleOnchangeDetails} name="name" />
                        </Form.Item>
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <InputComponent value={stateAdminGroupDetails['name']} onChange={handleOnchangeDetails} name="name" />
                        </Form.Item>
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <InputComponent value={stateAdminGroupDetails['name']} onChange={handleOnchangeDetails} name="name" />
                        </Form.Item>
                        
                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Apply
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </DrawerComponent>
            <ModalComponent title="Xóa nhóm quyền" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteAdminGroup}>
                <Loading isLoading={isLoadingDeleted}>
                    <div>Bạn có chắc xóa quyền này không?</div>
                </Loading>
            </ModalComponent>
        </div>
       
    )
}
export default PhamViNhom