import { Button, Form, Select, Space } from 'antd'
import { Checkbox } from 'antd';
import { Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import React, { useRef } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import TableComponent from '../../components/TableComponent/TableComponent'
import { useState } from 'react'
import InputComponent from '../../components/InputComponent/InputComponent'
import { getBase64, renderOptions } from '../../utils'
import * as PriorityService from '../../services/PriorityService'
import * as AdminGroupPriorityService from '../../services/AdminGroupPriorirtyService'
import * as PriorityByUserService from '../../services/PriorityByUserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import { useEffect } from 'react'
import * as message from '../../components/Message/Message'
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from '../../components/DrawerComponent/DrawerComponent'
import { useSelector } from 'react-redux'
import ModalComponent from '../../components/ModalComponent/ModalComponent'
const ChucNangNhom = ({selectedRowId,handleselectedrow}) => {
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const user = useSelector((state) => state?.user)
    const searchInput = useRef(null);
    const inittial = () => ({
        code: '',
        description: '',
        showauth: '',
        name: '',
        lock: '',
        whois: '',
        groupcode: '',
        syscomponentcode: '',
        unitcode: '',
        addn: true,
        edit: true,
        dele: true,
    })
    const inittial2 = () => ({
        objectcode: '',
        thetype: '',
        prioritycode: '',
        forman: '',
        func: '',
        inherit: '',
        thecode: '',
        lock: '',
        whois: '',
        thecode: '',
        extensioncode: '',
        tablename: '',
        syscomponentcode: '',
        unitcode: '',
        addn: true,
        edit: true,
        dele: true,
    })
    
    const [statePriority, setStatePriority] = useState(inittial())
    const [statePriorityDetails, setStatePrioritiDetails] = useState(inittial())
    const [stateAdminGroupPriority, setStateAdminGroupPriority] = useState(inittial2())
    const [form] = Form.useForm();

    // const mutation = useMutationHooks(
    //     (data) => {
    //         const { code,
    //             description,
    //             showauth,
    //             name,
    //             lock,
    //             whois,
    //             groupcode,
    //             syscomponentcode,
    //             unitcode,
    //             addn,
    //             edit,
    //             dele, } = data
    //         const res = PriorityService.createPriority({
    //             code,
    //             description,
    //             showauth,
    //             name,
    //             lock,
    //             whois,
    //             groupcode,
    //             syscomponentcode,
    //             unitcode,
    //             addn,
    //             edit,
    //             dele,
    //         })
    //         console.log(res);
    //         return res;
    //     }
    // )
    const mutation2 = useMutationHooks(
        (data) => {
            const { objectcode,
                thetype,
                prioritycode,
                forman,
                func,
                inherit,
                thecode,
                syscomponentcode,
                unitcode,
                addn,
                edit,
                dele, } = data
            const res = AdminGroupPriorityService.createAdminGroupPriority({
                objectcode,
                thetype,
                prioritycode,
                forman,
                func,
                inherit,
                thecode,
                syscomponentcode,
                unitcode,
                addn,
                edit,
                dele, 
            })
            return res
        }
    )
    const mutationUpdate = useMutationHooks(
        (data) => {
            const { id,
                token,
                ...rests } = data
            const res = PriorityService.updatePriority(
                id,
                token,
                { ...rests })
            return res
        },
    )

    const mutationDeleted = useMutationHooks(
        (data) => {
            const { objectcode,
                prioritycode,
                token,
            } = data
            const res = AdminGroupPriorityService.deleteAdminGroupPriorityById(
                objectcode,
                prioritycode,
                token,)
            return res
        },
    )

    const mutationDeletedMany = useMutationHooks(
        (data) => {
            const { token, ...ids
            } = data
            const res = PriorityService.deleteManyPriority(
                ids,
                token)
            return res
        },
    )

    const getAllPrioritys = async () => {
        const res = await PriorityByUserService.getPriorityByAdminGroup(selectedRowId)
        return res
    }

    const fetchGetDetailsPriority = async (rowSelected) => {
        const res = await PriorityService.getDetailsPriority(rowSelected)
        if (res?.data) {
            setStatePrioritiDetails({
                code: res?.data?.code,
                description: res?.data?.description,
                showauth: res?.data?.showauth,
                name: res?.data?.name,
                lock: res?.data?.lock,
                whois: res?.data?.whois,
                groupcode: res?.data?.groupcode,
                syscomponentcode: res?.data?.syscomponentcode,
                unitcode: res?.data?.unitcode,
                addn: res?.data?.addn,
                edit: res?.data?.edit,
                dele: res?.data?.dele
            })
        }
        setIsLoadingUpdate(false)
    }

    useEffect(() => {
        if (!isModalOpen) {
            form.setFieldsValue(statePriorityDetails)
        } else {
            form.setFieldsValue(inittial())
        }
    }, [form, statePriorityDetails, isModalOpen])

    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            setIsLoadingUpdate(true)
            fetchGetDetailsPriority(rowSelected)
        }
    }, [rowSelected, isOpenDrawer])

    const handleDetailsPriority = () => {
        setIsOpenDrawer(true)
    }

    const handleDelteManyPrioritys = (ids) => {
        mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
            onSettled: () => {
                queryPriority.refetch()
            }
        })
    }


    const { data, isLoading, isSuccess, isError } = mutation2
    const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDelected, isError: isErrorDeleted } = mutationDeleted
    const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDelectedMany, isError: isErrorDeletedMany } = mutationDeletedMany
    const fetchAllPriority = async () => {
        const res = await await PriorityService.getAllType()
        return res
      }
    const fetchAllPriority2 = async () => {
        const res = await PriorityService.getAllPriority()
        return res
      }

    const queryPriority = useQuery(
        ['prioritys', selectedRowId], // Thay đổi queryKey để phản ánh selectedRowId
        getAllPrioritys,
        {
            enabled: !!selectedRowId, // Kích hoạt truy vấn khi selectedRowId không null
        }
    );
    // const typePriority = useQuery({ queryKey: ['type-priority'], queryFn: fetchAllTypePriority })
    const allPriority = useQuery({ queryKey: ['all-donvi'], queryFn: fetchAllPriority })
    const allPriority2 = useQuery({ queryKey: ['all-donvi2'], queryFn: fetchAllPriority2 })
    const { isLoading: isLoadingPrioritys, data: prioritys } = queryPriority
    const renderAction = () => {
        return (
            <div>
                <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
                <EditOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailsPriority} />
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
            title: 'code',
            dataIndex: 'code',
            sorter: (a, b) => a.code.length - b.code.length,
            ...getColumnSearchProps('code')
        },
        {
            title: 'description',
            dataIndex: 'description',
            sorter: (a, b) => a.description.length - b.description.length,
            ...getColumnSearchProps('description')
        },
        {
            title: 'addn',
            dataIndex: 'addn',
            render: (text, record) => <Checkbox disabled checked={record.addn} />,
            ...getColumnSearchProps('addn')
        },
        {
            title: 'edit',
            dataIndex: 'edit',
            render: (text, record) => <Checkbox disabled checked={record.edit} />,
            ...getColumnSearchProps('edit')
        },
        {
            title: 'dele',
            dataIndex: 'dele',
            render: (text, record) => <Checkbox disabled checked={record.dele} />,
            ...getColumnSearchProps('dele')
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction
        },
    ];
    const dataTable = prioritys?.data?.length && prioritys?.data?.map((priority) => {
       
        return { ...priority, key: priority._id }
    })

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
        setStatePrioritiDetails({
            code: '',
            description: '',
            showauth: '',
            name: '',
            lock: '',
            whois: '',
            groupcode: '',
            syscomponentcode: '',
            unitcode: '',
            addn: true,
            edit: true,
            dele: true,
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


    const handleDeletePriority = () => {
        console.log(rowSelected);
        mutationDeleted.mutate({ objectcode: selectedRowId, prioritycode: rowSelected, token: user?.access_token }, {
            onSettled: () => {
                queryPriority.refetch()
            }
        })
    }

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateAdminGroupPriority({
            objectcode: '',
            thetype: '',
            prioritycode: '',
            forman: '',
            func: '',
            inherit: '',
            thecode: '',
            lock: '',
            whois: '',
            thecode: '',
            extensioncode: '',
            tablename: '',
            syscomponentcode: '',
            unitcode: '',
            addn: true,
            edit: true,
            dele: true,
        })
        form.resetFields()
    };

    const onFinish = () => {
        const params = {
            objectcode: selectedRowId,
            thetype: stateAdminGroupPriority.thetype,
            prioritycode: stateAdminGroupPriority.prioritycode,
            forman: stateAdminGroupPriority.forman,
            func: stateAdminGroupPriority.func,
            inherit: stateAdminGroupPriority.inherit,
            lock: stateAdminGroupPriority.lock,
            whois: stateAdminGroupPriority.whois,
            thecode: stateAdminGroupPriority.thecode,
            addn: stateAdminGroupPriority.addn,
            edit: stateAdminGroupPriority.edit,
            dele: stateAdminGroupPriority.dele,
        }
        mutation2.mutate(params, {
            onSettled: () => {
                queryPriority.refetch()
            }
        })
    }

    
    const handleOnchange2 = (name, checked) => {
        setStateAdminGroupPriority({
            ...stateAdminGroupPriority,
            [name]: checked,
        });
        console.log(stateAdminGroupPriority);
    }
    
    const handleOnchangeDetails = (e) => {
        setStatePrioritiDetails({
            ...statePriorityDetails,
            [e.target.name]: e.target.value
        })
    }



    const onUpdatePriority = () => {
        mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...statePriorityDetails }, {
            onSettled: () => {
                queryPriority.refetch()
            }
        })
    }

    
    const handleChangeSelect4 = (value) => {
        
        try{
        const selectedPriority = allPriority2?.data?.data.find(Priority => Priority.code === value);
          setStateAdminGroupPriority({
            ...stateAdminGroupPriority,
            prioritycode: selectedPriority._id
          })
        console.log(stateAdminGroupPriority);
        }
        catch{}
      }

    return (
        
        <div>
            <WrapperHeader>Quản lý nhóm người dùng</WrapperHeader>
            <div style={{ marginTop: '10px' }}>
                <Button onClick={() => setIsModalOpen(true)}>Thêm tham số</Button>
            </div>
            <div style={{ marginTop: '20px' }}>
                 <TableComponent handleDelteMany={handleDelteManyPrioritys} columns={columns} isLoading={isLoadingPrioritys} data={dataTable} onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {
                            setRowSelected(record._id);
                            // console.log(rowSelected);
                          }
                          
                        
                    };
                }} />
            </div>
            <ModalComponent forceRender title="Thêm thông tin nhóm quản trị" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <Loading isLoading={isLoading}>

                    <Form
                        name="basic"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        onFinish={onFinish}
                        autoComplete="on"
                        form={form}
                    >
                        {/* <Form.Item
                            label="Mã"
                            name="code"
                            rules={[{ required: true, message: 'Please input your code!' }]}
                        >
                            <InputComponent value={statePriority['code']} onChange={handleOnchange} name="code" />
                        </Form.Item> */}
                        {/* <Form.Item
                            label="Tên"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <InputComponent value={statePriority['name']} onChange={handleOnchange} name="name" />
                        </Form.Item> */}
                        <Form.Item
                        label="Nhóm"
                        name="DonVi"
                        rules={[{ required: true, message: 'Please input your DonVi!' }]}
                        >
                        <Select
                        name="Priority"
                        // defaultValue="lucy"
                        // style={{ width: 120 }}
                        // value={stateQuanNhan.DonVi}
                        onChange={handleChangeSelect4}
                        options={renderOptions(allPriority?.data?.data)}
                        />
                        </Form.Item> 
                        <Form.Item label="Actions">
                        <Row gutter={16}>
                            <Col span={8}>
                            <Form.Item name="addn" valuePropName="checked" noStyle>
                                <Checkbox onChange={(e) => handleOnchange2('addn', e.target.checked)}>Addn</Checkbox>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                         <Form.Item name="edit" valuePropName="checked" noStyle>
                        <Checkbox onChange={(e) => handleOnchange2('edit', e.target.checked)}>Edit</Checkbox>
                        </Form.Item>
                        </Col>
                        <Col span={8}>
                        <Form.Item name="dele" valuePropName="checked" noStyle>
                            <Checkbox onChange={(e) => handleOnchange2('dele', e.target.checked)}>Dele</Checkbox>
                        </Form.Item>
                        </Col>
                         </Row>
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
                        onFinish={onUpdatePriority}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <InputComponent value={statePriorityDetails['name']} onChange={handleOnchangeDetails} name="name" />
                        </Form.Item>
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <InputComponent value={statePriorityDetails['name']} onChange={handleOnchangeDetails} name="name" />
                        </Form.Item>
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <InputComponent value={statePriorityDetails['name']} onChange={handleOnchangeDetails} name="name" />
                        </Form.Item>
                        
                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Apply
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </DrawerComponent>
            <ModalComponent title="Xóa nhóm quyền" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeletePriority}>
                <Loading isLoading={isLoadingDeleted}>
                    <div>Bạn có chắc xóa quyền này không?</div>
                </Loading>
            </ModalComponent>
        </div>
       
    )
}

export default ChucNangNhom