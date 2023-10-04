import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label } from 'recharts';
import * as ThongKeHocViService from '../../../services/ThongKeHocViService';
import * as DonViService from '../../../services/DonViService';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DemoChartComponent = ({ handleTreeNodeClick, treeNodeClickedId }) => {
    const [currentUserDonVi, setCurrentUserDonVi] = useState(null);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

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
            const response = await ThongKeHocViService.getThongKeHocViByDonViId(currentUserDonVi);
            setIsLoading(false);
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
try{
    return (
        <BarChart
          width={1200}
          height={400}
          data={data}
          margin={{ top: 20, right: 30, left: 30, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="10 10" />
          <XAxis dataKey="Nam" interval={0} height={60}>
            <Label value="Năm" offset={0} position="insideBottom" />
          </XAxis>
          <YAxis width={10}>
            <Label value="Số Lượng" angle={-90} position="insideLeft" />
          </YAxis>
          <Tooltip />
          <Legend />
          <Bar dataKey="TienSyKhoaHoc" fill="#8884d8" name="Tiến sỹ Khoa học" />
          <Bar dataKey="TienSy" fill="#82ca9d" name="Tiến sỹ" />
          <Bar dataKey="ThacSy" fill="#ffc658" name="Thạc sỹ" />
          <Bar dataKey="KySu" fill="#ff7f00" name="Kỹ sư" />
          <Bar dataKey="CuNhan" fill="#ff00ff" name="Cử nhân" />
          <Bar dataKey="Khac" fill="#00ffff" name="Khác" />
          <Label value="Biểu Đồ Số Lượng Học Vị" offset={0} position="insideTop" />
        </BarChart>
      );
      
      
      
        }
        catch{}
};

export default DemoChartComponent;
