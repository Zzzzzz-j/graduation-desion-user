import React, { useState } from "react";
import { Table, Button, message, Modal } from 'antd';
import { useSelector } from 'react-redux';
import { getLoanApplyList, getUserInfo, postCancelApply } from '../../api';
import moment from 'moment';
import './index.scss';

export default function MyLoan() {
    const [pageSize, setPageSize] = useState(10);
    const [pageNum, setPageNum] = useState(1);
    const [total, setTotal] = useState(0);
    const [tableData, setTableData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [record, setRecord] = useState({});
    const userInfo = useSelector(state => state.user_info);

    React.useEffect(async() => {
        await getUserInfo().then(res => {
            getLoanApplyListInfo(pageNum,pageSize,res.user_id);
        })
    }, [])
    const paginationProps = {
        pageSize: pageSize,
        current: pageNum,
        total: total,
        position: ['bottomCenter'],
        onChange: (current) => changePage(current),
    };

    const columns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => `${(pageNum - 1) * 10 + (index + 1)}`,
        },
        {
            title: '贷款金额',
            dataIndex: 'money',
            key: 'money',
        },
        {
            title: '申请时间',
            dataIndex: 'apply_time',
            key: 'apply_time',
        },
        {
            title: '贷款开始时间',
            dataIndex: 'start_time',
            key: 'start_time',
        },
        {
            title: '贷款结束时间',
            dataIndex: 'end_time',
            key: 'end_time',
        },
        {
            title: '贷款时间',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: '利率(月)',
            dataIndex: 'rate',
            key: 'rate',
            render: (text) => (`${text}%`)
        },
        {
            title: '状态',
            dataIndex: 'approve',
            key: 'approve',
            render: (text) => (text == 0 ? '未审批' : (text == 1 ? '审批通过' : '审批不通过'))
        },
        {
            title: '审批操作',
            key: 'action',
            render: (text, record) => (
                <div> 
                    {
                        record.approve == 0 ? <Button onClick={() => showModal(record)} type="link">取消申请</Button> : <Button type="link" disabled>取消申请</Button>
                    }
                </div>
            ),
        },
    ];

    async function getLoanApplyListInfo(num, size, id) {
        const res = await getLoanApplyList({ pageNum: num, pageSize: size, id: id });
        console.log(res);
        if (res.status === 200) {
            const data = formattingData(res.data);
            setTableData(data);
            setTotal(res.total);
        }
    }

    async function cancelApply(id) {
        const res = await postCancelApply({ id: id });
        if (res.status === 200) {
            message.success(res.message);
        }
    }

    function formattingData(data) {
        const arr = data.map(item => {
            item.apply_time = transformTimestamp(item.apply_time);
            item.start_time = moment(Number(item.start_time)).format('YYYY年MM月DD日');
            item.end_time = moment(Number(item.end_time)).format('YYYY年MM月DD日');
            return item
        })
        return arr;
    }

    function transformTimestamp(timestamp) {
        let a = new Date(timestamp).getTime();
        const date = new Date(a);
        const Y = date.getFullYear() + '-';
        const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '  ';
        const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
        // const s = date.getSeconds(); // 秒
        const dateString = Y + M + D + h + m;
        // console.log('dateString', dateString); // > dateString 2021-07-06 14:23
        return dateString;
    }

    function changePage(value) {
        setPageNum(value);
        getLoanApplyListInfo(value,pageSize,userInfo.user_id);
    }

    const showModal = (record) => {
        setIsModalVisible(true);
        setRecord(record);
    };

    const handleOk = async () => {
        await cancelApply(record.apply_id);
        await getLoanApplyListInfo(pageNum, pageSize, userInfo.user_id);
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div className="my-loan">
            <div className="my-loan-body">
                <h1 style={{ fontSize: '28px', fontWeight: '500', textAlign: 'start' }}>
                    我的贷款
                </h1>
                <Table columns={columns} dataSource={tableData} pagination={paginationProps} rowKey={(record) => record.user_id} />
            </div>
            <Modal
                title="取消申请"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="确认"
                cancelText="取消"
            >
                <p>
                    是否取消该贷款申请？
                </p>
            </Modal>
        </div>
    )
}
