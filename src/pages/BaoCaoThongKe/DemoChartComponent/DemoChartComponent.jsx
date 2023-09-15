import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label } from 'recharts';
import * as DonViService from '../../../services/DonViService'
import { useEffect } from 'react'
import { useState } from 'react'
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const DemoChartComponent = ({ handleTreeNodeClick,treeNodeClickedId  }) => {
    const [currentUserDonVi, setCurrentUserDonVi] = useState(null);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        fetchDonViData();
    }, [treeNodeClickedId]);
    useEffect(() => {
      fetchData(); 
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
    const fetchData = async () => {
        if (!currentUserDonVi) {
            return []; // Trả về một mảng trống nếu treeNodeClickedId không có giá trị
          }
        try {
        setIsLoading(true);
          const response = await DonViService.getSoLuongfromcode(currentUserDonVi);
          setIsLoading(false);
          console.log(response.data);
          setData(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
    //   fetchData();
    //   console.log(currentUserDonVi);

    
   
    return (
      <BarChart
        width={1200}
        height={400}
        data={data}
        margin={{ top: 20, right: 30, left: 30, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="10 10" />
        <XAxis dataKey="donViCon.name" interval={0} height={60}>
          <Label value="Đơn Vị" offset={0} position="insideBottom" />
        </XAxis>
        <YAxis width={10}>
          <Label value="Value" angle={-90} position="insideLeft" />
        </YAxis>
        <Tooltip />
        <Legend />
        <Bar dataKey="soLuongCounts.soLuongQuanNhan" fill={COLORS[0]} barSize={20} name="Quân nhân" />
        <Bar dataKey="soLuongCounts.bienche" fill={COLORS[1]} barSize={20} name="Biên chế" />
        <Label value="Biểu Đồ Số Lượng Cán Bộ" offset={0} position="insideTop" />
      </BarChart>
    );
  };
  
  export default DemoChartComponent;