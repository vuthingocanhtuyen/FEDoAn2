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
          return [];
        }
        try {
          setIsLoading(true);
          const response = await DonViService.getHocVifromcode(currentUserDonVi);
          setIsLoading(false);
          setData(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      
  

    
   
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
          {data[0]?.hocViCounts.map((item, index) => (
            <Bar
              key={index}
              dataKey={`hocViCounts[${index}].SoLuong`}
              fill={COLORS[index % COLORS.length]}
              barSize={20}
              name={item.TenHocVi}
            />
          ))}
          <Label value="Biểu Đồ Số Lượng Học Vị" offset={0} position="insideTop" />
        </BarChart>
      );
      
  };
  
  export default DemoChartComponent;