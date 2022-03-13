import React, { useState } from "react";
import { Layout, Menu, Dropdown, Modal, Button, Form, Input, message } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getUserInfo, changePassword } from '../../api';
import { USERINFO } from '../../redux/action-types';
import { DownOutlined } from '@ant-design/icons';
import bank from '../../public/bank.jpg';
import security from '../../public/security.png';
import icon1 from '../../public/icon1.png';
import icon2 from '../../public/icon2.png';
import icon3 from '../../public/icon3.png';
import './index.scss';

const { Header, Content, Footer } = Layout;

export default function AccountManage(props) {
    const [visible, setVisible] = useState(false);
    const [state, setState] = useState('/LoanApproval/0');

    const dispatch = useDispatch();
    const userInfo = useSelector(state => state.user_info);
    const [form] = Form.useForm();

    const history = useNavigate();
    const location = useLocation();
    const menu = (
        <Menu>
            <Menu.Item key="0">
                <div onClick={logOut}>退出登录</div>
            </Menu.Item>
            <Menu.Item key="1">
                <div onClick={showModal}>修改密码</div>
            </Menu.Item>
        </Menu>
    );

    React.useEffect(() => {
        getUserInfo().then(res => {
            dispatch({ type: USERINFO, data: res });
        })
    }, [])

    function logOut() {
        console.log('logout');
        sessionStorage.removeItem('token');
        history('/login');
    }

    function showModal() {
        form.resetFields();
        setVisible(true);
    };

    function handleCancel() {
        setVisible(false);
    };

    const onFinish = (values) => {
        console.log('Success:', values);
        const { newPassword } = values;
        changePassword({ password: newPassword, id: userInfo.user_id }).then(res => {
            console.log(res);
            if (res.status === 200) {
                message.success('修改成功!');
                userInfo.password = newPassword;
                dispatch({ type: USERINFO, data: userInfo });
            } else {
                message.error(res.message);
            }
        })
        setVisible(false);
        form.resetFields();
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const menuChange = (key) => {
        switch (key) {
            case '/HomePage':
                setState('/HomePage')
                history('/HomePage')
                break;
            case '/LoanCenter':
                setState('/LoanCenter')
                history('/LoanCenter')
                break;
            case '/MyLoan':
                setState('/MyLoan')
                history('/MyLoan')
                break;
        }
    }

    function securityFooter(img, title, text) {
        return (
            <div className="security-main">
                <div className="security-img">
                    <img style={{ width: '50px', height: '50px' }} src={img} alt="" />
                </div>
                <div className="security-body">
                    <p className="title">{title}</p>
                    <p className="text">{text}</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <Layout className="layout-contaniner">
                <Header className="header" style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                    <div className="logo" >
                        <img style={{ width: '140px', height: '60px' }} src={bank} alt="" />
                        <img style={{ width: '40px', height: '40px', marginLeft: '15px' }} src={security} alt="" />
                    </div>
                    <div className="layout-user">
                        <Dropdown overlay={menu} trigger={['click']}>
                            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                {userInfo.username} <DownOutlined />
                            </a>
                        </Dropdown>
                    </div>
                    <Menu className="menu" theme="light" mode="horizontal" defaultSelectedKeys={[location.pathname]}>
                        <Menu.Item className="menu-item" key="/HomePage" onClick={() => { menuChange('/HomePage') }}>首页</Menu.Item>
                        <Menu.Item className="menu-item" key="/LoanCenter" onClick={() => { menuChange('/LoanCenter') }}>贷款中心</Menu.Item>
                        <Menu.Item className="menu-item" key="/MyLoan" onClick={() => { menuChange('/MyLoan') }}>我的贷款</Menu.Item>
                    </Menu>
                </Header>
                <Content
                    className="site-layout"
                    style={{
                        marginTop: '60px',
                        minHeight: 280,
                        background: '#f0f2f5'
                    }}
                >
                    <div className="site-layout-background">
                        <Outlet />
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    <div className="footer-security">
                        <div className="security-main">
                            <div className="security-img">
                                <img style={{ width: '50px', height: '50px' }} src={icon1} alt="" />
                            </div>
                            <div className="security-body">
                                <p className="title">协助维权</p>
                                <p className="text">蒙受经济损失，可申请百度协助</p>
                            </div>
                        </div>
                        {
                            securityFooter(icon3,'虚假赔偿','遇到品牌或资质冒用，可申请百度保障')
                        }
                        {
                            securityFooter(icon2,'欺诈赔偿','遇到欺诈，经核查属实，可申请保障退还费用')
                        }
                    </div>
                    <p>
                        地址：哈尔滨市香坊区铁东街道长江路600号东北农业大学
                    </p>
                    <p>
                        Copyright © 【风险提示：贷款有风险选择需谨慎！】哈尔滨东农小额贷款有限公司
                    </p>
                </Footer>
            </Layout>
            <Modal
                title="修改密码"
                visible={visible}
                onCancel={() => setVisible(false)}
                footer={null}
            >
                <Form
                    name="basic"
                    form={form}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 16 }}
                >
                    <Form.Item
                        label="旧密码"
                        name="password"
                        rules={[
                            {
                                required: true,
                                min: 6,
                                max: 16,
                                message: '请输入6-16位的密码!',
                            },
                            {
                                pattern: /^[^\s]*$/,
                                message: '密码不允许出现空格!'
                            },
                            () => ({
                                validator(_, value) {
                                    if (!value || userInfo.password === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('您输入的旧密码不正确!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="请输入旧密码" />
                    </Form.Item>
                    <Form.Item
                        label="新密码"
                        name="newPassword"
                        rules={[
                            {
                                required: true,
                                min: 6,
                                max: 16,
                                message: '请输入6-16位的密码!',
                            },
                            {
                                pattern: /^[^\s]*$/,
                                message: '密码不允许出现空格!'
                            }
                        ]}
                    >
                        <Input.Password placeholder="请输入新密码" />
                    </Form.Item>
                    <Form.Item
                        label="确认新密码"
                        name="confirmNewPassword"
                        dependencies={['newPassword']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                min: 6,
                                max: 16,
                                message: '请输入6-16位的密码!',
                            },
                            {
                                pattern: /^[^\s]*$/,
                                message: '密码不允许出现空格!'
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('您输入的两个密码不匹配!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="请再次输入新密码" />
                    </Form.Item>
                    <Form.Item>
                        <div className="changepwd-footer">
                            <Button type="primary" style={{ marginRight: '45px' }} size='large' className='btn' htmlType="submit">
                                确认
                            </Button>
                            <Button type="primary" size='large' className='btn' onClick={handleCancel}>
                                取消
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}
