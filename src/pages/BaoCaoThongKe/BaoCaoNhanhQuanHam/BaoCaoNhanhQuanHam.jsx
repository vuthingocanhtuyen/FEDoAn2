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

const ThongKeQuanHam = ({handleTreeNodeClick,treeNodeClickedId }) => {
    const [currentUserDonVi, setCurrentUserDonVi] = useState(null);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [quanHamData, setHocViData] = useState([]);
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
    fetchQuanHamData(); // Gọi hàm fetchDonViData khi treeNodeClickedId thay đổi
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
    const fetchQuanHamData = async () => {
        if (!currentUserDonVi) {
            return []; // Trả về một mảng trống nếu treeNodeClickedId không có giá trị
          }
        try {
          console.log("fetchQuanHamData"+currentUserDonVi);
          setIsLoading(true);
          const quanHamData = await DonViService.getQuanHamfromcode(currentUserDonVi);
          setIsLoading(false);
          console.log(quanHamData);
          const processedData = quanHamData.data.map((item, index) => ({
            key: index,
            TenDonVi: item.donViCon.name,
            ThieuUy: item.quanHamCounts[0].SoLuong,
            TrungUy: item.quanHamCounts[1].SoLuong,
            ThuongUy: item.quanHamCounts[2].SoLuong,
            DaiUy: item.quanHamCounts[3].SoLuong,
            ThieuTa: item.quanHamCounts[4].SoLuong,
            TrungTa: item.quanHamCounts[5].SoLuong,
            ThuongTa: item.quanHamCounts[6].SoLuong,
            DaiTa: item.quanHamCounts[7].SoLuong,
            ThieuTuong: item.quanHamCounts[8].SoLuong,
            TrungTuong: item.quanHamCounts[9].SoLuong,
            ThuongTuong: item.quanHamCounts[10].SoLuong,
            DaiTuong: item.quanHamCounts[11].SoLuong,
          }));
    
          setData(processedData);
          
        } catch (error) {
          console.error(error);
          return [];
        }
      };
      const [showTotal, setShowTotal] = useState(false);

    useEffect(() => {
    if (data.length > 0 && !showTotal) {
        let sumThieuUy = data.reduce((acc, item) => acc + item.ThieuUy, 0);
        let sumTrungUy = data.reduce((acc, item) => acc + item.TrungUy, 0);
        let sumThuongUy = data.reduce((acc, item) => acc + item.ThuongUy, 0);
        let sumDaiUy = data.reduce((acc, item) => acc + item.DaiUy, 0);
        let sumThieuTa = data.reduce((acc, item) => acc + item.ThieuTa, 0);
        let sumTrungTa = data.reduce((acc, item) => acc + item.TrungTa, 0);
        let sumThuongTa = data.reduce((acc, item) => acc + item.ThuongTa, 0);
        let sumDaiTa = data.reduce((acc, item) => acc + item.DaiTa, 0);
        let sumThieuTuong = data.reduce((acc, item) => acc + item.ThieuTuong, 0);
        let sumTrungTuong = data.reduce((acc, item) => acc + item.TrungTuong, 0);
        let sumThuongTuong = data.reduce((acc, item) => acc + item.ThuongTuong, 0);
        let sumDaiTuong = data.reduce((acc, item) => acc + item.DaiTuong, 0);

        const totalRow = {
            key: 'total',
            TenDonVi: 'Tổng',
            ThieuUy: sumThieuUy,
            TrungUy: sumTrungUy,
            ThuongUy: sumThuongUy,
            DaiUy: sumDaiUy,
            ThieuTa: sumThieuTa,
            TrungTa: sumTrungTa,
            ThuongTa: sumThuongTa,
            DaiTa: sumDaiTa,
            ThieuTuong: sumThieuTuong,
            TrungTuong: sumTrungTuong,
            ThuongTuong: sumThuongTuong,
            DaiTuong: sumDaiTuong,
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
          title: 'Thiếu úy',
          dataIndex: 'ThieuUy',
          key: 'ThieuUy',
        },
        {
          title: 'Trung úy',
          dataIndex: 'TrungUy',
          key: 'TrungUy',
        },
        {
          title: 'Thượng úy',
          dataIndex: 'ThuongUy',
          key: 'ThuongUy',
        },
        {
          title: 'Đại úy',
          dataIndex: 'DaiUy',
          key: 'DaiUy',
        },
        {
          title: 'Thiếu tá',
          dataIndex: 'ThieuTa',
          key: 'ThieuTa',
        },
        {
          title: 'Trung tá',
          dataIndex: 'TrungTa',
          key: 'TrungTa',
        },
        {
          title: 'Thượng tá',
          dataIndex: 'ThuongTa',
          key: 'ThuongTa',
        },
        {
          title: 'Đại tá',
          dataIndex: 'DaiTa',
          key: 'DaiTa',
        },
        {
          title: 'Thiếu tướng',
          dataIndex: 'ThieuTuong',
          key: 'ThieuTuong',
        },
        {
          title: 'Trung tướng',
          dataIndex: 'TrungTuong',
          key: 'TrungTuong',
        },
        {
          title: 'Thượng tướng',
          dataIndex: 'ThuongTuong',
          key: 'ThuongTuong',
        },
        {
          title: 'Đại tướng',
          dataIndex: 'DaiTuong',
          key: 'DaiTuong',
        },
      ];
      return (
        <div>
            <TableComponent data={data} columns={columns} />
        </div>
    );
    };
    
    export default ThongKeQuanHam;