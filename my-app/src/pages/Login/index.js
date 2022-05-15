import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { testApi, registerAccount, login, getUserInfo } from '../../api/index';
import { Form, Input, Button, message } from 'antd';
import jwt_decode from "jwt-decode";
import './index.scss';

export default function Login() {
    const container = useRef();

    const history = useNavigate();

    React.useEffect(() => {
        
    }, [])

    const onRegisterFinish = (values) => {
        console.log('Success:', values);
        const { username, password, phone } = values;
        registerAccount({ username: username, phone: phone, password: password }).then(res => {
            console.log(res);
            if (res.status === 200) {
                message.success('注册成功!');
                container.current.classList.remove("right-panel-active")
            } else {
                message.error(res.message);
            }
        })
    };

    const onRegisterFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onLoginFinish = (values) => {
        console.log('Success:', values);
        const { password, phone } = values;
        login({ phone: phone, password: password }).then(res => {
            console.log(res);
            if (res.status === 200) {
                sessionStorage.setItem('token', res.token);

                // 解析token
                const decode = jwt_decode(res.token);

                history('/HomePage');
            } else {
                message.error(res.message);
            }
        })
    };

    const onLoginFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className='login'>
            <div ref={container} className='container'>
                <div className='register-form sign-up-container'>
                    <h1 className='register-form-title'>注册账号</h1>
                    <Form
                        name="basic"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onRegisterFinish}
                        onFinishFailed={onRegisterFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入您的名称!',
                                },
                            ]}
                        >
                            <Input className='input' placeholder='请输入名称' maxLength={20} />
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    pattern: /^1[3456789]\d{9}$/,
                                    message: '请检查手机号是否正确!',
                                },
                            ]}
                        >
                            <Input className='input' placeholder='请输入手机号' maxLength={11} />
                        </Form.Item>
                        <Form.Item
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
                                }
                            ]}
                        >
                            <Input.Password className='input' placeholder='请输入密码' maxLength={16} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" size='large' className='btn' htmlType="submit">
                                注册
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className='login-form sign-in-container'>
                    <h1 className='login-form-title'>登录</h1>
                    <Form
                        name="basic"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onLoginFinish}
                        onFinishFailed={onLoginFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    pattern: /^1[3456789]\d{9}$/,
                                    message: '请检查手机号是否正确!',
                                },
                            ]}
                        >
                            <Input className='input' placeholder='请输入手机号' maxLength={11} />
                        </Form.Item>
                        <Form.Item
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
                                    message: '密码不允许使用空格!'
                                }
                            ]}
                        >
                            <Input.Password className='input' placeholder='请输入密码' maxLength={16} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" size='large' className='btn' htmlType="submit">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>SIGN IN</h1>
                            <p>点击下方按钮进行登录</p>
                            <button className="ghost" onClick={() => { container.current.classList.remove("right-panel-active") }}>Sign In</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>SIGN UP</h1>
                            <p>点击下方按钮进行注册账号</p>
                            <button className="ghost" onClick={() => { container.current.classList.add("right-panel-active") }}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
