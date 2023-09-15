import { Button, Form, Space, Select } from 'antd'
import React from 'react'

import TableComponent from '../../components/TableComponent/TableComponent'
import InputComponent from '../../components/InputComponent/InputComponent'
import { Table } from 'antd';

import { getBase64, renderOptions } from '../../utils'
import { useEffect } from 'react'
import * as message from '../../components/Message/Message'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as DonViService from '../../services/DonViService'
import { useIsFetching, useQuery, useQueryClient } from '@tanstack/react-query'
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'

const ThongKeHocVi = ({handleTreeNodeClick,treeNodeClickedId }) => {
    const [currentUserDonVi, setCurrentUserDonVi] = useState(null);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [hocViData, setHocViData] = useState([]);
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
      fetchSoLuongData(); // Gọi hàm fetchDonViData khi treeNodeClickedId thay đổi
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
    const fetchSoLuongData = async () => {
      if (!currentUserDonVi) {
        return []; 
      }
    
      try {
        setIsLoading(true);
        const soLuongData = await DonViService.getSoLuongfromcode(currentUserDonVi);
        setIsLoading(false);
    
        const processedData = soLuongData.data.map((item, index) => ({
          key: index,
          TenDonVi: item.donViCon.name,
          SoLuongQuanNhan: item.soLuongCounts.soLuongQuanNhan,
          BienChe: item.soLuongCounts.bienche,
        }));
    
        setData(processedData);
      } catch (error) {
        console.error(error);
        return [];
      }
    };
    
    const columns = [
      {
        title: 'Tên Đơn Vị',
        dataIndex: 'TenDonVi',
        key: 'TenDonVi',
        ...getColumnSearchProps('TenDonVi')
      },
      {
        title: 'Số lượng Quân Nhân',
        dataIndex: 'SoLuongQuanNhan',
        key: 'SoLuongQuanNhan',
      },
      {
        title: 'Biên Chế',
        dataIndex: 'BienChe',
        key: 'BienChe',
      },
    ];
    
      return (
        <div>
            <TableComponent data={data} columns={columns} />
        </div>
    );
    };
    
    export default ThongKeHocVi;