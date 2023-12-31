import { Button, Form, Space, Select } from 'antd'
import React from 'react'
import { WrapperHeader, WrapperUploadFile } from '../style'
import TableComponent from '../../../../components/TableComponent/TableComponent'

import InputComponent from '../../../../components/InputComponent/InputComponent'
import DrawerComponent from '../../../../components/DrawerComponent/DrawerComponent'
import Loading from '../../../../components/LoadingComponent/Loading'
import ModalComponent from '../../../../components/ModalComponent/ModalComponent'
import ModalComponentLeve2 from '../../../../components/ModalComponent/ModalComponentLeve2'
import { getBase64, renderOptions } from '../../../../utils'
import { useEffect } from 'react'
import * as message from '../../../../components/Message/Message'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import { useMutationHooks } from '../../../../hooks/useMutationHook'
import * as ProductService from '../../../../services/ProductService'
import { useIsFetching, useQuery, useQueryClient } from '@tanstack/react-query'
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import LikeButtonComponent from '../../../../components/LikeButtonComponent/LikeButtonComponent'

const GiaiThuongNCKH = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isModalOpenChild, setIsModalOpenChild] = useState(false);

    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const user = useSelector((state) => state?.user)
    const searchInput = useRef(null);
    const inittial = () => ({
        HTHD: '',
        HocVien: '',
        Lop: '',
        DeTai: '',
        DateBD: '',
        Quy: '',
        Nam: '',
        SoCBHD: '',
        DinhMuc: '',
        SoGioChuan: '',
    })
    const [stateProduct, setStateProduct] = useState(inittial())
    const [stateProductDetails, setStateProductDetails] = useState(inittial())


    const job = () => ({
        GiaoVien: '',
        HinhThuc: '',
        SoTiet: '',
        SoGio: '',
        GhiChu: '',
    })

    const [form] = Form.useForm();

    const mutation = useMutationHooks(
        (data) => {
            const { HTHD,
                HocVien,
                Lop,
                DeTai,
                DateBD,
                Quy,
                Nam, SoCBHD, DinhMuc, SoGioChuan } = data
            const res = ProductService.createProduct({
                HTHD,
                HocVien,
                Lop,
                DeTai,
                DateBD,
                Quy,
                Nam, SoCBHD, DinhMuc, SoGioChuan
            })
            return res
        }
    )
    const mutationUpdate = useMutationHooks(
        (data) => {
            const { id,
                token,
                ...rests } = data
            const res = ProductService.updateProduct(
                id,
                token,
                { ...rests })
            return res
        },
    )

    const mutationDeleted = useMutationHooks(
        (data) => {
            const { id,
                token,
            } = data
            const res = ProductService.deleteProduct(
                id,
                token)
            return res
        },
    )

    const mutationDeletedMany = useMutationHooks(
        (data) => {
            const { token, ...ids
            } = data
            const res = ProductService.deleteManyProduct(
                ids,
                token)
            return res
        },
    )

    const getAllProducts = async () => {
        const res = await ProductService.getAllProduct()
        return res
    }

    const fetchGetDetailsProduct = async (rowSelected) => {
        const res = await ProductService.getDetailsProduct(rowSelected)
        if (res?.data) {
            setStateProductDetails({
                HTHD: res?.data?.HTHD,
                HocVien: res?.data?.HocVien,
                Lop: res?.data?.Lop,
                DeTai: res?.data?.DeTai,
                DateBD: res?.data?.DateBD,
                Quy: res?.data?.Quy,
                Nam: res?.data?.Name,
                SoCBHD: res?.data?.SoCBHD,
                DinhMuc: res?.data?.DinhMuc,
                SoGioChuan: res?.data?.SoGioChuan

            })
        }
        setIsLoadingUpdate(false)
    }

    useEffect(() => {
        if (!isModalOpen) {
            form.setFieldsValue(stateProductDetails)
        } else {
            form.setFieldsValue(inittial())
        }
    }, [form, stateProductDetails, isModalOpen])

    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            setIsLoadingUpdate(true)
            fetchGetDetailsProduct(rowSelected)
        }
    }, [rowSelected, isOpenDrawer])

    const handleDetailsProduct = () => {
        setIsOpenDrawer(true)
    }

    const handleDelteManyProducts = (ids) => {
        mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        return res
    }

    const { data, isLoading, isSuccess, isError } = mutation
    const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDelected, isError: isErrorDeleted } = mutationDeleted
    const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDelectedMany, isError: isErrorDeletedMany } = mutationDeletedMany


    const queryProduct = useQuery({ queryKey: ['products'], queryFn: getAllProducts })
    const typeProduct = useQuery({ queryKey: ['type-product'], queryFn: fetchAllTypeProduct })
    const { isLoading: isLoadingProducts, data: products } = queryProduct
    const renderAction = () => {
        return (
            <div>
                <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
                <EditOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailsProduct} />
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
        // render: (text) =>
        //   searchedColumn === dataIndex ? (
        //     // <Highlighter
        //     //   highlightStyle={{
        //     //     backgroundColor: '#ffc069',
        //     //     padding: 0,
        //     //   }}
        //     //   searchWords={[searchText]}
        //     //   autoEscape
        //     //   textToHighlight={text ? text.toString() : ''}
        //     // />
        //   ) : (
        //     text
        //   ),
    });


    const columns = [
        {
            title: 'TT',
            dataIndex: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name')
        },
        {
            title: 'Nội dung giải thưởng',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
            filters: [
                {
                    text: '>= 50',
                    value: '>=',
                },
                {
                    text: '<= 50',
                    value: '<=',
                }
            ],
            onFilter: (value, record) => {
                if (value === '>=') {
                    return record.price >= 50
                }
                return record.price <= 50
            },
        },
        {
            title: 'Tác giả',
            dataIndex: 'rating',
            sorter: (a, b) => a.rating - b.rating,
            filters: [
                {
                    text: '>= 3',
                    value: '>=',
                },
                {
                    text: '<= 3',
                    value: '<=',
                }
            ],
            onFilter: (value, record) => {
                if (value === '>=') {
                    return Number(record.rating) >= 3
                }
                return Number(record.rating) <= 3
            },
        },

        {
            title: 'Loại',
            dataIndex: 'type',
        },
        {
            title: 'Vai trò',
            dataIndex: 'type',
        },
        {
            title: 'Số tác giả',
            dataIndex: 'type',
        },
        {
            title: 'Tải',
            dataIndex: 'type',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'type',
        },

        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction
        },
    ];


    const columns2 = [
        {
            title: 'TT',
            dataIndex: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name')
        },

        {
            title: 'Giáo viên',
            dataIndex: 'type',
        },
        {
            title: 'Đơn vị',
            dataIndex: 'type',
        },
        {
            title: 'Điểm ',
            dataIndex: 'type',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction
        },

    ];
    const columnsCV = [
        {
            title: 'TT',
            dataIndex: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name')
        },

        {
            title: 'Mã',
            dataIndex: 'type',
        },
        {
            title: 'Tên',
            dataIndex: 'type',
        },
        {
            title: 'Ghi chú',
            dataIndex: 'type',
        },

    ];

    const dataTable = products?.data?.length && products?.data?.map((product) => {
        return { ...product, key: product._id }
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
        setStateProductDetails({
            name: '',
            price: '',
            description: '',
            rating: '',
            image: '',
            type: '',
            countInStock: ''
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


    const handleDeleteProduct = () => {
        mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateProduct({
            name: '',
            price: '',
            description: '',
            rating: '',
            image: '',
            type: '',
            countInStock: '',
            discount: '',
        })
        form.resetFields()
    };

    const handleCancelCV = () => {
        setIsModalOpenChild(false);
        setStateProduct({
            name: '',
            price: '',
            description: '',
            rating: '',
            image: '',
            type: '',
            countInStock: '',
            discount: '',
        })
        form.resetFields()
    };
    const onFinish = () => {
        const params = {
            name: stateProduct.name,
            price: stateProduct.price,
            description: stateProduct.description,
            rating: stateProduct.rating,
            image: stateProduct.image,
            type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type,
            countInStock: stateProduct.countInStock,
            discount: stateProduct.discount
        }
        mutation.mutate(params, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const handleOnchange = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name]: e.target.value
        })
    }

    const handleOnchangeDetails = (e) => {
        setStateProductDetails({
            ...stateProductDetails,
            [e.target.name]: e.target.value
        })
    }

    const handleOnchangeAvatar = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProduct({
            ...stateProduct,
            image: file.preview
        })
    }

    const handleOnchangeAvatarDetails = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProductDetails({
            ...stateProductDetails,
            image: file.preview
        })
    }
    const onUpdateProduct = () => {
        mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateProductDetails }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const handleChangeSelect = (value) => {
        setStateProduct({
            ...stateProduct,
            type: value
        })
    }

    return (
        <div>

            <div style={{ marginTop: '10px' }}>
                <Button onClick={() => setIsModalOpen(true)}>Thêm</Button>
            </div>

            <div style={{ marginTop: '20px' }}>
                <TableComponent handleDelteMany={handleDelteManyProducts} columns={columns} isLoading={isLoadingProducts} data={dataTable} onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {
                            setRowSelected(record._id)
                        }
                    };
                }} />
            </div>
            {/* Thêm tham số */}
            <ModalComponent forceRender title="Thêm giải thưởng khoa học công nghệ " open={isModalOpen} onCancel={handleCancel} footer={null} width="80%">
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
                            label="Loại giải thưởng"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <InputComponent value={stateProduct['name']} onChange={handleOnchange} name="name" />
                        </Form.Item>

                        <Form.Item
                            label="Tên"
                            name="type"
                            rules={[{ required: true, message: 'Please input your type!' }]}
                        >
                            <Select
                                name="type"
                                // defaultValue="lucy"
                                // style={{ width: 120 }}
                                value={stateProduct.type}
                                onChange={handleChangeSelect}
                                options={renderOptions(typeProduct?.data?.data)}
                            />
                        </Form.Item>
                        {stateProduct.type === 'add_type' && (
                            <Form.Item
                                label='New type'
                                name="newType"
                                rules={[{ required: true, message: 'Please input your type!' }]}
                            >
                                <InputComponent value={stateProduct.newType} onChange={handleOnchange} name="newType" />
                            </Form.Item>
                        )}
                        <Form.Item
                            label="Tên công trình"
                            name="countInStock"
                            rules={[{ required: true, message: 'Please input your count inStock!' }]}
                        >
                            <InputComponent value={stateProduct.countInStock} onChange={handleOnchange} name="countInStock" />
                        </Form.Item>
                        <Form.Item
                            label="Ngày giải thưởng"
                            name="price"
                            rules={[{ required: true, message: 'Please input your count price!' }]}
                        >
                            <InputComponent value={stateProduct.price} onChange={handleOnchange} name="price" />
                        </Form.Item>
                        <Form.Item
                            label="Số tác giả"
                            name="description"
                            rules={[{ required: true, message: 'Please input your count description!' }]}
                        >
                            <InputComponent value={stateProduct.description} onChange={handleOnchange} name="description" />
                        </Form.Item>
                        <Form.Item
                            label="Các tác giả"
                            name="rating"
                            rules={[{ required: true, message: 'Please input your count rating!' }]}
                        >
                            <InputComponent value={stateProduct.rating} onChange={handleOnchange} name="rating" />
                        </Form.Item>
                        <Form.Item
                            label="Quý"
                            name="discount"
                            rules={[{ required: true, message: 'Please input your discount of product!' }]}
                        >
                            <InputComponent value={stateProduct.discount} onChange={handleOnchange} name="discount" />
                        </Form.Item>
                        <Form.Item
                            label="Năm"
                            name="discount"
                            rules={[{ required: true, message: 'Please input your discount of product!' }]}
                        >
                            <InputComponent value={stateProduct.discount} onChange={handleOnchange} name="discount" />
                        </Form.Item>


                        <Form.Item

                            name="image"
                            rules={[{ required: true, message: 'Please input your count image!' }]}
                        >
                            <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                                <Button >File chứng minh</Button>
                                {stateProduct?.image && (
                                    <img src={stateProduct?.image} style={{
                                        height: '60px',
                                        width: '60px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        marginLeft: '10px'
                                    }} alt="avatar" />
                                )}
                            </WrapperUploadFile>
                        </Form.Item>

                        {/* Ô hiện thứ 2 */}
                        <div style={{ marginTop: '20px' }}>
                            <div style={{ float: 'right' }}>
                                <Button style={{ background: '#00BB00' }} onClick={() => setIsModalOpenChild(true)}>Thêm công việc</Button>
                            </div>
                            <br />

                            <TableComponent handleDelteMany={handleDelteManyProducts} columns={columns2} isLoading={isLoadingProducts} data={dataTable} onRow={(record, rowIndex) => {
                                return {
                                    onClick: event => {
                                        setRowSelected(record._id)
                                    }
                                };
                            }} />
                            <ModalComponentLeve2 forceRender title="Cập nhật hình thức công việc" open={isModalOpenChild} onCancel={handleCancelCV} footer={null} width="70%">
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
                                            label="Tên giáo viên"
                                            name="name"
                                            rules={[{ required: true, message: 'Please input your name!' }]}
                                        >
                                            <InputComponent value={stateProduct['name']} onChange={handleOnchange} name="name" />
                                        </Form.Item>
                                        <Form.Item
                                            label="Vai trò"
                                            name="name"
                                            rules={[{ required: true, message: 'Please input your name!' }]}
                                        >
                                            <InputComponent value={stateProduct['name']} onChange={handleOnchange} name="name" />
                                        </Form.Item>

                                        <Form.Item
                                            label="Số giờ"
                                            name="name"
                                            rules={[{ required: true, message: 'Please input your name!' }]}
                                        >
                                            <InputComponent value={stateProduct['name']} onChange={handleOnchange} name="name" />
                                        </Form.Item>




                                        <div style={{ marginTop: '20px' }}>

                                            <br />

                                            <TableComponent handleDelteMany={handleDelteManyProducts} columns={columnsCV} isLoading={isLoadingProducts} data={dataTable} onRow={(record, rowIndex) => {
                                                return {
                                                    onClick: event => {
                                                        setRowSelected(record._id)
                                                    }
                                                };
                                            }} />
                                        </div>

                                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                                            <Button type="primary" htmlType="submit">
                                                Xong
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Loading>
                            </ModalComponentLeve2>

                        </div>

                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Thêm
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </ModalComponent>























            <DrawerComponent title='Chi tiết tải giảng dạy' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="90%">
                <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>

                    <Form
                        name="basic"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 22 }}
                        onFinish={onUpdateProduct}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                            label="Mã lớp"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <InputComponent value={stateProduct['name']} onChange={handleOnchange} name="name" />
                        </Form.Item>

                        <Form.Item
                            label="Mã MH"
                            name="type"
                            rules={[{ required: true, message: 'Please input your type!' }]}
                        >
                            <Select
                                name="type"
                                // defaultValue="lucy"
                                // style={{ width: 120 }}
                                value={stateProduct.type}
                                onChange={handleChangeSelect}
                                options={renderOptions(typeProduct?.data?.data)}
                            />
                        </Form.Item>
                        {stateProduct.type === 'add_type' && (
                            <Form.Item
                                label='New type'
                                name="newType"
                                rules={[{ required: true, message: 'Please input your type!' }]}
                            >
                                <InputComponent value={stateProduct.newType} onChange={handleOnchange} name="newType" />
                            </Form.Item>
                        )}
                        <Form.Item
                            label="Tên MH"
                            name="countInStock"
                            rules={[{ required: true, message: 'Please input your count inStock!' }]}
                        >
                            <InputComponent value={stateProduct.countInStock} onChange={handleOnchange} name="countInStock" />
                        </Form.Item>
                        <Form.Item
                            label="Số TC"
                            name="price"
                            rules={[{ required: true, message: 'Please input your count price!' }]}
                        >
                            <InputComponent value={stateProduct.price} onChange={handleOnchange} name="price" />
                        </Form.Item>
                        <Form.Item
                            label="Sĩ số"
                            name="description"
                            rules={[{ required: true, message: 'Please input your count description!' }]}
                        >
                            <InputComponent value={stateProduct.description} onChange={handleOnchange} name="description" />
                        </Form.Item>
                        <Form.Item
                            label="HTĐT"
                            name="rating"
                            rules={[{ required: true, message: 'Please input your count rating!' }]}
                        >
                            <InputComponent value={stateProduct.rating} onChange={handleOnchange} name="rating" />
                        </Form.Item>
                        <Form.Item
                            label="Loại hình ĐT"
                            name="discount"
                            rules={[{ required: true, message: 'Please input your discount of product!' }]}
                        >
                            <InputComponent value={stateProduct.discount} onChange={handleOnchange} name="discount" />
                        </Form.Item>
                        <Form.Item
                            label="Kết thúc"
                            name="discount"
                            rules={[{ required: true, message: 'Please input your discount of product!' }]}
                        >
                            <InputComponent value={stateProduct.discount} onChange={handleOnchange} name="discount" />
                        </Form.Item>
                        <Form.Item
                            label="Quý/Năm"
                            name="discount"
                            rules={[{ required: true, message: 'Please input your discount of product!' }]}
                        >
                            <InputComponent value={stateProduct.discount} onChange={handleOnchange} name="discount" />
                        </Form.Item>
                        <Form.Item
                            label="Học kỳ"
                            name="discount"
                            rules={[{ required: true, message: 'Please input your discount of product!' }]}
                        >
                            <InputComponent value={stateProduct.discount} onChange={handleOnchange} name="discount" />
                        </Form.Item>
                        <Form.Item
                            label="Hình thức thi"
                            name="discount"
                            rules={[{ required: true, message: 'Please input your discount of product!' }]}
                        >
                            <InputComponent value={stateProduct.discount} onChange={handleOnchange} name="discount" />
                        </Form.Item>
                        <Form.Item
                            label="Số tiết"
                            name="discount"
                            rules={[{ required: true, message: 'Please input your discount of product!' }]}
                        >
                            <InputComponent value={stateProduct.discount} onChange={handleOnchange} name="discount" />
                        </Form.Item>
                        <Form.Item
                            label="Ghi chú"
                            name="discount"
                            rules={[{ required: true, message: 'Please input your discount of product!' }]}
                        >
                            <InputComponent value={stateProduct.discount} onChange={handleOnchange} name="discount" />
                        </Form.Item>
                        <Form.Item

                            name="image"
                            rules={[{ required: true, message: 'Please input your count image!' }]}
                        >
                            <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                                <Button >File chứng minh</Button>
                                {stateProduct?.image && (
                                    <img src={stateProduct?.image} style={{
                                        height: '60px',
                                        width: '60px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        marginLeft: '10px'
                                    }} alt="avatar" />
                                )}
                            </WrapperUploadFile>
                        </Form.Item>
                        {/* Ô hiện thứ 2 */}
                        <div style={{ marginTop: '20px' }}>

                            <br />
                            <div >
                                <h3>Các hình thức công việc</h3>
                            </div>
                            <TableComponent handleDelteMany={handleDelteManyProducts} columns={columns2} isLoading={isLoadingProducts} data={dataTable} onRow={(record, rowIndex) => {
                                return {
                                    onClick: event => {
                                        setRowSelected(record._id)
                                    }
                                };
                            }} />
                            <ModalComponentLeve2 forceRender title="Cập nhật hình thức công việc" open={isModalOpenChild} onCancel={handleCancelCV} footer={null} width="70%">
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
                                            label="Tên giáo viên"
                                            name="name"
                                            rules={[{ required: true, message: 'Please input your name!' }]}
                                        >
                                            <InputComponent value={stateProduct['name']} onChange={handleOnchange} name="name" />
                                        </Form.Item>

                                        <Form.Item
                                            label="Hình thức"
                                            name="type"
                                            rules={[{ required: true, message: 'Please input your type!' }]}
                                        >
                                            <Select
                                                name="type"
                                                // defaultValue="lucy"
                                                // style={{ width: 120 }}
                                                value={stateProduct.type}
                                                onChange={handleChangeSelect}
                                                options={renderOptions(typeProduct?.data?.data)}
                                            />
                                        </Form.Item>
                                        {stateProduct.type === 'add_type' && (
                                            <Form.Item
                                                label='New type'
                                                name="newType"
                                                rules={[{ required: true, message: 'Please input your type!' }]}
                                            >
                                                <InputComponent value={stateProduct.newType} onChange={handleOnchange} name="newType" />
                                            </Form.Item>
                                        )}
                                        <Form.Item
                                            label="Số tiết"
                                            name="countInStock"
                                            rules={[{ required: true, message: 'Please input your count inStock!' }]}
                                        >
                                            <InputComponent value={stateProduct.countInStock} onChange={handleOnchange} name="countInStock" />
                                        </Form.Item>
                                        <Form.Item
                                            label="Số giờ"
                                            name="price"
                                            rules={[{ required: true, message: 'Please input your count price!' }]}
                                        >
                                            <InputComponent value={stateProduct.price} onChange={handleOnchange} name="price" />
                                        </Form.Item>

                                        <Form.Item
                                            label="Ghi chú"
                                            name="discount"
                                            rules={[{ required: true, message: 'Please input your discount of product!' }]}
                                        >
                                            <InputComponent value={stateProduct.discount} onChange={handleOnchange} name="discount" />
                                        </Form.Item>


                                        <div style={{ marginTop: '20px' }}>

                                            <br />

                                            <TableComponent handleDelteMany={handleDelteManyProducts} columns={columnsCV} isLoading={isLoadingProducts} data={dataTable} onRow={(record, rowIndex) => {
                                                return {
                                                    onClick: event => {
                                                        setRowSelected(record._id)
                                                    }
                                                };
                                            }} />
                                        </div>

                                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                                            <Button type="primary" htmlType="submit">
                                                Xong
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Loading>
                            </ModalComponentLeve2>
                            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                                <Button type="primary" htmlType="submit">
                                    Cập nhật
                                </Button>
                            </Form.Item>
                        </div>
                    </Form>
                </Loading>
            </DrawerComponent>




            <ModalComponent title="Xóa tải giảng dạy" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct}>
                <Loading isLoading={isLoadingDeleted}>
                    <div>Bạn có chắc xóa tải giảng dạy này không?</div>
                </Loading>
            </ModalComponent>
        </div>
    )
}

export default GiaiThuongNCKH