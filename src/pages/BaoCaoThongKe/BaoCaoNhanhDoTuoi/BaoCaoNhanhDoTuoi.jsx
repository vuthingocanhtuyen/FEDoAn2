import { Button, Form, Space, Select } from 'antd'
import React from 'react'

import TableComponent from '../../../components/TableComponent/TableComponent'
import InputComponent from '../../../components/InputComponent/InputComponent'
import { Table } from 'antd';

import { getBase64, renderOptions } from '../../../utils'
import { useEffect } from 'react'
import * as message from '../../../components/Message/Message'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import { useMutationHooks } from '../../../hooks/useMutationHook'
import * as DonViService from '../../../services/DonViService'
import { useIsFetching, useQuery, useQueryClient } from '@tanstack/react-query'
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'

const BaoCaoNhanhDoTuoi = ({handleTreeNodeClick,treeNodeClickedId }) => {
    const [currentUserDonVi, setCurrentUserDonVi] = useState(null);
    const [data, setData] = useState([]);
    const [showTotal, setShowTotal] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [doTuoiData, setHocViData] = useState([]);
    const user = useSelector((state) => state?.user)
    const searchInput = useRef(null);
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
    useEffect(() => {
      fetchDonViData(); // Gọi hàm fetchDonViData khi treeNodeClickedId thay đổi
    }, [treeNodeClickedId]);
    useEffect(() => {
    fetchDoTuoiData(); // Gọi hàm fetchDonViData khi treeNodeClickedId thay đổi
}, [currentUserDonVi]);
    const fetchDonViData = async () => {
      
      if (!treeNodeClickedId) {
          return []; // Trả về một mảng trống nếu treeNodeClickedId không có giá trị
        }
      try {
        
        
        const donviCode = await DonViService.getDonVifromObjectId(treeNodeClickedId);
        setCurrentUserDonVi(donviCode);
        console.log(donviCode);
      } catch (error) {
        console.error(error);
        return [];
      }
    };
    const fetchDoTuoiData = async () => {
        if (!currentUserDonVi) {
            return []; // Trả về một mảng trống nếu treeNodeClickedId không có giá trị
          }
        try {
          console.log("fetchDoTuoiData"+currentUserDonVi);
          setIsLoading(true);
          const doTuoiData = await DonViService.getDoTuoifromcode(currentUserDonVi);
          setIsLoading(false);
          console.log(doTuoiData);
          const processedData = doTuoiData.data.map((item, index) => ({
            key: index,
            TenDonVi: item.donViCon.name,
            dotuoi2029: item.quanHamCounts.dotuoi2029,
            dotuoi3039: item.quanHamCounts.dotuoi3039,
            dotuoi4044: item.quanHamCounts.dotuoi4044,
            dotuoi4549: item.quanHamCounts.dotuoi4549,
            dotuoi5054: item.quanHamCounts.dotuoi5054,
            dotuoi5560: item.quanHamCounts.dotuoi5560,
            dotuoi60: item.quanHamCounts.dotuoi60,
          }));
    
          setData(processedData);
          
        } catch (error) {
          console.error(error);
          return [];
        }
      };
      useEffect(() => {
        if (data.length > 0 && !showTotal) {
            let sumDotuoi2029 = data.reduce((acc, item) => acc + item.dotuoi2029, 0);
            let sumDotuoi3039 = data.reduce((acc, item) => acc + item.dotuoi3039, 0);
            let sumDotuoi4044 = data.reduce((acc, item) => acc + item.dotuoi4044, 0);
            let sumDotuoi4549 = data.reduce((acc, item) => acc + item.dotuoi4549, 0);
            let sumDotuoi5054 = data.reduce((acc, item) => acc + item.dotuoi5054, 0);
            let sumDotuoi5560 = data.reduce((acc, item) => acc + item.dotuoi5560, 0);
            let sumDotuoi60 = data.reduce((acc, item) => acc + item.dotuoi60, 0);
    
            const totalRow = {
                key: 'total',
                TenDonVi: 'Tổng',
                dotuoi2029: sumDotuoi2029,
                dotuoi3039: sumDotuoi3039,
                dotuoi4044: sumDotuoi4044,
                dotuoi4549: sumDotuoi4549,
                dotuoi5054: sumDotuoi5054,
                dotuoi5560: sumDotuoi5560,
                dotuoi60: sumDotuoi60,
            };
    
            setData([...data, totalRow]);
            setShowTotal(true);
        }
    }, [data, showTotal]);
    
    const columns = [
        {
            title: 'Tên Đơn Vị',
            dataIndex: 'TenDonVi',
            key: 'TenDonVi',
            ...getColumnSearchProps('TenDonVi')
        },
        {
            title: 'Độ tuổi dưới 29',
            dataIndex: 'dotuoi2029',
            key: 'dotuoi2029',
        },
        {
            title: 'Độ tuổi 30-39',
            dataIndex: 'dotuoi3039',
            key: 'dotuoi3039',
        },
        {
            title: 'Độ tuổi 40-44',
            dataIndex: 'dotuoi4044',
            key: 'dotuoi4044',
        },
        {
            title: 'Độ tuổi 45-49',
            dataIndex: 'dotuoi4549',
            key: 'dotuoi4549',
        },
        {
            title: 'Độ tuổi 50-54',
            dataIndex: 'dotuoi5054',
            key: 'dotuoi5054',
        },
        {
            title: 'Độ tuổi 55-60',
            dataIndex: 'dotuoi5560',
            key: 'dotuoi5560',
        },
        {
            title: 'Độ tuổi trên 60',
            dataIndex: 'dotuoi60',
            key: 'dotuoi60',
        },
    ];
    
      return (
        <div>
            <TableComponent data={data} columns={columns} />
        </div>
    );
    };
    
    export default BaoCaoNhanhDoTuoi;