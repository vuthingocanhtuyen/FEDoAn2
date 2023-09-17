import { Button, Space } from 'antd'
import {  SearchOutlined } from '@ant-design/icons'
import React, { useRef } from 'react'
import { WrapperHeader } from './style'
import 'antd/dist/antd.css';
import TableComponent from '../../components/TableComponent/TableComponent'
import { useState } from 'react'
import InputComponent from '../../components/InputComponent/InputComponent'
import * as QuanNhanService from '../../services/QuanNhanService'
import * as PriorityByUserService from '../../services/PriorityByUserService'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
const DieuChuyenCanBo = () => {
  const [currentUserDonVi, setCurrentUserDonVi] = useState(null);
  const user = useSelector((state) => state?.user)
  const navigate = useNavigate()
  const searchInput = useRef(null);
  useEffect(() => {
    const fetchGetChucVuDonVi = async () => {

      try {
        // Gọi API để lấy thông tin đơn vị hiện tại của người dùng
        const response = await PriorityByUserService.getChucVuDonViFromUser(user.QuanNhanId, user.access_token);
        console.log(response.data);

        if (response.data && response.data.length > 0) {
          const firstData = response.data[0];
          console.log(response.data[0]);
          const donViValue = firstData.DonVi[0];
          setCurrentUserDonVi(donViValue);
         
        }

      } catch (error) {
        console.error('Error fetching ChucVuDonVi:', error);
      }
    };

    fetchGetChucVuDonVi();
  }, [user.QuanNhanId, user.access_token]);
  const getQuanNhanFromDonVi = async () => {
    const res = await QuanNhanService.getQuanNhanFromDonVi(currentUserDonVi)
    return res
  }
  const handleDetailsHoSoCanBo = (ids) => {
    navigate(`/dieuchuyencanbo/${ids}`)
  }
 
 


  const queryQuanNhan = useQuery({ queryKey: ['quannhans'], queryFn: getQuanNhanFromDonVi })
  const { isLoading: isLoadingQuanNhans, data: quannhans } = queryQuanNhan



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
      title: 'Mã quân nhân',
      dataIndex: 'QuanNhanId',
      sorter: (a, b) => a.QuanNhanId.length - b.QuanNhanId.length,
      ...getColumnSearchProps('QuanNhanId')
    },
    {
      title: 'Họ và tên',
      dataIndex: 'HoTen',
      sorter: (a, b) => a.HoTen.length - b.HoTen.length,
      ...getColumnSearchProps('HoTen')
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'NgaySinh',
      sorter: (a, b) => a.NgaySinh.length - b.NgaySinh.length,
      ...getColumnSearchProps('NgaySinh')
    },
    {
      title: 'Giới tính',
      dataIndex: 'GioiTinh',
      sorter: (a, b) => a.GioiTinh.length - b.GioiTinh.length,
      ...getColumnSearchProps('GioiTinh')
    },
    {
      title: 'Quê quán',
      dataIndex: 'QueQuan',
      sorter: (a, b) => a.QueQuan.length - b.QueQuan.length,
      ...getColumnSearchProps('QueQuan')
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'DiaChi',
      sorter: (a, b) => a.DiaChi.length - b.DiaChi.length,
      ...getColumnSearchProps('DiaChi')
    },
    {
      title: 'Đơn vị',
      dataIndex: 'DonVi',
      sorter: (a, b) => a.DonVi.length - b.DonVi.length,
      ...getColumnSearchProps('DonVi')
    },
    {
      title: 'Chức vụ',
      dataIndex: 'HoatDong',
      sorter: (a, b) => a.HoatDong.length - b.HoatDong.length,
      ...getColumnSearchProps('HoatDong')
    },


  ];
  const dataTable = quannhans?.data?.length && quannhans?.data?.map((quannhan) => {
    return { ...quannhan, key: quannhan._id }
  })











  



  useEffect(() => {
    if (currentUserDonVi) {
      queryQuanNhan.refetch();
    }
  }, [currentUserDonVi, queryQuanNhan]);
 
 
 
  







  return (
    <div>
      <WrapperHeader>Quản lý quân nhân</WrapperHeader>
     
      <div style={{ marginTop: '20px' }}>
        <TableComponent  columns={columns} isLoading={isLoadingQuanNhans} data={dataTable} onRow={(record, rowIndex) => {
          return {

            onClick: event => { 
              handleDetailsHoSoCanBo(record._id);
            },

          };
        }} />
      </div>
      
    </div>
  )
}

export default DieuChuyenCanBo
