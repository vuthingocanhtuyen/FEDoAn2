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
          const response = await DonViService.getDoTuoifromcode(currentUserDonVi);
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
            {data && data[0]?.quanHamCounts && Object.keys(data[0].quanHamCounts).map((dotuoi, index) => (
               dotuoi !== "_id" && (
                <Bar
                    key={index}
                    dataKey={`quanHamCounts.${dotuoi}`}
                    fill={COLORS[index % COLORS.length]}
                    barSize={20}
                    name={dotuoi === 'dotuoi60' ? 'Độ tuổi >60' : dotuoi === 'dotuoi2029' ? 'Độ tuổi <29' : `Độ tuổi ${dotuoi.replace('dotuoi', '').replace(/(\d{2})(\d{2})/, '$1-$2')}`}/>
            )
            ))}
            <Label value="Biểu Đồ Số Lượng Độ Tuổi" offset={0} position="insideTop" />
        </BarChart>
    );
};
  
  export default DemoChartComponent;