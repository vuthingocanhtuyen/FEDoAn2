import React from 'react';
import { Tabs } from 'antd';
import 'antd/dist/antd.min.css';
import { useParams } from 'react-router-dom'
import QuanLyChucVuQN from './QuanLyChucVuQN';

const { TabPane } = Tabs;

function QuanLyChucVuId() {
    const { id } = useParams()

    return (
        <>

            <Tabs defaultActiveKey="1">
                <TabPane tab="Quản lý chức vụ" key="1">

                    <QuanLyChucVuQN idQuanNhan={id} />

                </TabPane>

            </Tabs>
        </>
    );
}

export default QuanLyChucVuId;
