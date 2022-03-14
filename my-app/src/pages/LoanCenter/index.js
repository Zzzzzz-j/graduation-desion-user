import React, { useState } from "react";
import { Form, Input, Button, Select, DatePicker } from 'antd';
import './index.scss';

const { Option } = Select;

export default function LoanCenter() {
    const [form] = Form.useForm();
    const [componentSize, setComponentSize] = useState('default');

    React.useEffect(() => {

    }, [])

    const onFinish = (values) => {
        console.log(values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onReset = () => {
        form.resetFields();
    };

    return (
        <div className="loan-center">
            <h1 style={{ fontSize: '28px', fontWeight: '500', textAlign: 'start' }}>
                贷款中心
            </h1>
            <div className="center-main">
                <div className="main-text">
                    在贷款申请之前请先填写并提交您的个人信息，如果您已经提交过个人信息，
                    请确保您所提交的个人信息真实且完善，一旦发现您所提交的个人信息中有虚假或缺漏，
                    则将不会同意您的贷款申请。
                </div>
                <div className="main-button">
                    <button className="button">填写个人信息</button>
                </div>
            </div>
            <div className="center-form">
                <div className="form-text">
                    <p className="text">
                        如果您想申请贷款，请填写右侧的信息并提交。
                    </p>
                    <p className="text">
                        贷款金额: 您想要贷款的金额总数。
                    </p>
                    <p className="text">
                        贷款时间: 根据您自身的条件，选择一个合适的还款时长。(eg: 选择1年则表示您需要在一年内还清贷款)
                    </p>
                    <p className="text">
                        贷款开始日期: 贷款的生效日期。
                    </p>
                </div>
                <div className="form">
                    <Form
                        name="basic"
                        form={form}
                        initialValues={{
                            remember: true,
                            size: componentSize,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            name="money"
                            label="贷款金额"
                            style={{ textAlign: 'start' }}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input className="input" placeholder='请输入贷款金额' />
                        </Form.Item>
                        <Form.Item
                            name="time"
                            label="贷款时间"
                            style={{ textAlign: 'start' }}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select
                                className="select"
                                placeholder="请选择贷款时间"
                                allowClear
                            >
                                <Option value="male">一个月</Option>
                                <Option value="female">六个月</Option>
                                <Option value="other">一年</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="loanDate"
                            label="贷款开始日期"
                            style={{textAlign: 'start'}}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <DatePicker placeholder="选择日期" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                提交
                            </Button>
                            <Button htmlType="button" onClick={onReset}>
                                重置
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    )
}
