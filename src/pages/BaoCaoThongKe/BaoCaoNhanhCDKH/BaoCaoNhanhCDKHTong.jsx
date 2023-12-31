import { Button, Form, Space } from 'antd'
import React from 'react'
import InputComponent from '../../../components/InputComponent/InputComponent'
import { convertPrice } from '../../../utils'
import * as OrderService from '../../../services/OrderService'
import { useQuery } from '@tanstack/react-query'
import { SearchOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import ComboBoxComponent from '../../../components/ComboBoxComponent/ComboBoxComponent'
import { orderContant } from '../../../contant'
import { useState } from 'react'
import FreeDonVi from '../../QuanLyDonVi/DanhMucDonVi/FreeDonVi'
import BaoCaoNhanhCDKH from './BaoCaoNhanhCDKH'

import { WrapperContentProfileFree } from '../style'
import ChartCDKH from './ChartCDKH'
import YearChartCDKH from './YearChartCDKH'





const BaoCaoNhanhCDKHTong = () => {
    const user = useSelector((state) => state?.user)


    const getAllOrder = async () => {
        const res = await OrderService.getAllOrder(user?.access_token)
        return res
    }


    const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrder })
    const { isLoading: isLoadingOrders, data: orders } = queryOrder

    


    const dataTable = orders?.data?.length && orders?.data?.map((order) => {
        console.log('usewr', order)
        return { ...order, key: order._id, userName: order?.shippingAddress?.fullName, phone: order?.shippingAddress?.phone, address: order?.shippingAddress?.address, paymentMethod: orderContant.payment[order?.paymentMethod], isPaid: order?.isPaid ? 'TRUE' : 'FALSE', isDelivered: order?.isDelivered ? 'TRUE' : 'FALSE', totalPrice: convertPrice(order?.totalPrice) }
    })
    const [treeNodeClickedId, setTreeNodeClickedId] = useState(null);
    const handleTreeNodeClick = (item) => {
        setTreeNodeClickedId(item); // Cập nhật ID node từ FreeDonVi
    }
    return (
        <div style={{ display: 'flex', justifyContent: 'left' }}>
            <div>
            <div style={{ flex: 1, maxWidth: '200px', background: '#fff', padding: '5px' }}>
                <WrapperContentProfileFree>
                    <FreeDonVi handleTreeNodeClick={handleTreeNodeClick} treeNodeClickedId={treeNodeClickedId}/>
                </WrapperContentProfileFree>
            </div>
                <div style={{ flex: 2, maxWidth: '1800px', background: 'back', padding: '5px', textAlign: 'left' }}>
                    <h2>Học vị</h2>
                    <BaoCaoNhanhCDKH handleTreeNodeClick={handleTreeNodeClick} treeNodeClickedId={treeNodeClickedId}/>
            </div>
            <div style={{ flex: 1, maxWidth: '1200px', background: '#fff', padding: '5px' }}>
            <ChartCDKH handleTreeNodeClick={handleTreeNodeClick} treeNodeClickedId={treeNodeClickedId}/>
        </div>
        <div style={{ flex: 1, maxWidth: '1200px', background: '#fff', padding: '5px' }}>
            <YearChartCDKH handleTreeNodeClick={handleTreeNodeClick} treeNodeClickedId={treeNodeClickedId}/>
        </div>
            
        </div>
        
    </div>
        
    )
}

export default BaoCaoNhanhCDKHTong