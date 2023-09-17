import React from 'react';
import { Tabs } from 'antd';
import 'antd/dist/antd.min.css';
import LyLich from '../QuanLyDonVi/ChiTietQuanNhan/LyLich';

import { useNavigate, useParams } from 'react-router-dom'

const { TabPane } = Tabs;

function DieuChuyenCanBoId() {
    const { id } = useParams()

    return (
        <>

            <Tabs defaultActiveKey="1">
            <TabPane tab="Lý lịch" key="1">

            <LyLich idQuanNhan={id} />

            </TabPane>

            </Tabs>
        </>
    );
}

export default DieuChuyenCanBoId;
