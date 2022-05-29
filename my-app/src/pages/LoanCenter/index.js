import React, { useState } from "react";
import { Form, Input, Button, Select, DatePicker, message, Modal } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { USERINFO } from '../../redux/action-types';
import moment from 'moment';
import { postLoanApply, postUserInfo, getUserDetails, getUserInfo } from '../../api';
import './index.scss';

const { Option } = Select;

export default function LoanCenter() {
    const [form] = Form.useForm();
    const [infoForm] = Form.useForm();
    const [componentSize, setComponentSize] = useState('default');
    const [currency, setCurrency] = useState('months');
    const [rate, setRate] = useState(0);
    const [inputValue, setInputValue] = useState(null);
    const [visible, setVisible] = useState(false);
    const [idCardFront, setIdCardFront] = useState('');
    const [idCardReverse, setIdCardReverse] = useState('');
    const [frontUrl, setFrontUrl] = useState('');
    const [reverseUrl, setReverseUrl] = useState('');
    const [frontPath, setFrontPath] = useState('');
    const [reversePath, setReversePath] = useState('');
    const [fState, setFState] = useState(0); // 判断编辑个人信息时身份证照片是否被编辑
    const [rState, setRState] = useState(0);
    const userInfo = useSelector(state => state.user_info);
    const dispatch = useDispatch();

    React.useEffect(() => {

    }, [])

    const onFinish = (values) => {
        if (userInfo.info_status == 0) {
            message.warn('您还未填写个人信息，请先填写个人信息！');
            return;
        }
        const { money, time, loanDate } = values;
        const date = loanDate.format('YYYY-MM-DD HH:mm:ss');
        const startTime = moment(date).unix() * 1000;
        const endTime = moment(startTime).add(time, currency).unix() * 1000;
        console.log(endTime, 'end');
        postLoanApply({
            id: userInfo.user_id,
            name: userInfo.username,
            money: money,
            startTime: startTime,
            endTime: endTime,
            time: `${time}${currency === 'months' ? '月' : '年'}`,
            rate: rate
        }).then(res => {
            if (res.status === 200) {
                message.success(res.message);
                form.resetFields();
            } else {
                message.error(res.message);
            }
        })
        console.log(values);
        console.log(date);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    async function showModal() {
        infoForm.resetFields();
        setIdCardFront('');
        setIdCardReverse('');
        setFrontUrl('');
        setReverseUrl('');
        if (userInfo.info_status == 1) {
            await getUserDetails({ id: userInfo.user_id }).then(res => {
                if (res.status === 200) {
                    infoForm.setFieldsValue(res.data);
                    setFrontUrl(res.data.id_card_front);
                    setReverseUrl(res.data.id_card_reverse);
                    setFrontPath(res.data.id_card_front);
                    setReversePath(res.data.id_card_reverse);
                }
            })
        }
        setVisible(true);
    };

    const onInfoFinish = async (values) => {
        console.log('Success:', values);
        console.log(idCardFront, 'idCardFront');
        const formData = new FormData();
        const { name, age, gender, phone, id_number, bank_card, address } = values;
        formData.append('id', userInfo.user_id);
        formData.append('name', name);
        formData.append('age', age);
        formData.append('gender', gender);
        formData.append('phone', phone);
        formData.append('id_number', id_number);
        formData.append('bank_card', bank_card);
        formData.append('address', address);
        if (userInfo.info_status == 1) {
            formData.append('frontPath', frontPath);
            formData.append('reversePath', reversePath);
            formData.append('status', 1);
            if (fState === 1) {
                formData.append('file', idCardFront);
                formData.append('fStatus', 1);
            } else {
                formData.append('fStatus', 0);
            }
            if (rState === 1) {
                formData.append('file', idCardReverse);
                formData.append('rStatus', 1);
            } else {
                formData.append('rStatus', 0);
            }
        } else {
            formData.append('file', idCardFront);
            formData.append('file', idCardReverse);
        }
        await postUserInfo(formData).then(res => {
            if (res.status === 200) {
                message.success(res.message);
            } else {
                message.error(res.message);
            }
        })
        await getUserInfo().then(res => {
            dispatch({ type: USERINFO, data: res });
        })
        setFState(0);
        setRState(0);
        setVisible(false);
    };

    const onInfoFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    function handleCancel() {
        setVisible(false);
    };

    const onReset = () => {
        form.resetFields();
    };

    const onCurrencyChange = (newCurrency) => {
        console.log('newCurrency', newCurrency);
        setCurrency(newCurrency);
        if (newCurrency === 'months') {
            if (!inputValue) return;
            const num = Math.floor(Number(inputValue) / 12);
            if (num < 1) {
                setRate(1.5);
            }
            if (1 <= num < 3) {
                setRate(2);
            }
            if (num >= 3) {
                setRate(2.5);
            }
        } else {
            if (!inputValue) return;
            if (inputValue < 1) {
                setRate(1.5);
            }
            if (1 <= inputValue < 3) {
                setRate(2);
            }
            if (inputValue >= 3) {
                setRate(2.5);
            }
        }
    };

    const onTimeChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        if (value == 0) {
            setRate(0);
            return;
        }
        if (currency === 'months') {
            const num = Math.floor(Number(value) / 12);
            console.log(num);
            if (num < 1) {
                setRate(1.5);
            }
            if (1 <= num < 3) {
                setRate(2);
            }
            if (num >= 3) {
                setRate(2.5);
            }
        } else {
            if (value < 1) {
                setRate(1.5);
            }
            if (1 <= value < 3) {
                setRate(2);
            }
            if (value >= 3) {
                setRate(2.5);
            }
        }
    };

    function handleImageChangeFront(e) {
        e.preventDefault();

        if (userInfo.info_status === 1) {
            setFState(1);
        }

        const reader = new FileReader();
        const file = e.target.files[0];
        setIdCardFront(file);
        console.log(file, 'file');

        reader.onloadend = () => {
            setFrontUrl(reader.result);
        }

        reader.readAsDataURL(file)
    }

    function handleImageChangeReverse(e) {
        e.preventDefault();

        if (userInfo.info_status === 1) {
            setRState(1);
        }

        const reader = new FileReader();
        const file = e.target.files[0];
        setIdCardReverse(file);
        console.log(file, 'file');

        reader.onloadend = () => {
            setReverseUrl(reader.result);
        }

        reader.readAsDataURL(file)
    }

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
                    <button onClick={showModal} className="button">
                        {
                            userInfo.info_status == 1 ? '编辑个人信息' : '填写个人信息'
                        }
                    </button>
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
                                    message: '请输入贷款金额'
                                },
                                { pattern: /\b\d{1,6}\b/g, message: '金额只能为数字' }
                            ]}
                        >
                            <Input className="input" maxLength={6} placeholder='请输入贷款金额' suffix='元' />
                        </Form.Item>
                        <Form.Item
                            name="time"
                            label="贷款时间"
                            style={{ textAlign: 'start' }}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入贷款时间'
                                },
                            ]}
                        >
                            <span>
                                <Input
                                    type="number"
                                    min={0}
                                    max={10}
                                    placeholder="请输入贷款时间"
                                    onChange={onTimeChange}
                                    style={{
                                        width: 140,
                                    }}
                                />
                                <Select
                                    value={currency}
                                    style={{
                                        width: 60,
                                        margin: '0 8px',
                                    }}
                                    onChange={onCurrencyChange}
                                >
                                    <Option value="months">月</Option>
                                    <Option value="years">年</Option>
                                </Select>
                            </span>
                        </Form.Item>
                        <Form.Item
                            name="loanDate"
                            label="贷款开始日期"
                            style={{ textAlign: 'start' }}
                            rules={[
                                {
                                    required: true,
                                    message: '请选择贷款开始日期'
                                },
                            ]}
                        >
                            <DatePicker placeholder="选择日期" />
                        </Form.Item>
                        <Form.Item>
                            <div style={{ textAlign: 'start', paddingLeft: '12px' }}>{`利率(月): ${rate}%`}</div>
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
            <Modal
                title="填写个人信息"
                centered={true}
                visible={visible}
                onCancel={() => setVisible(false)}
                footer={null}
            >
                <Form
                    name="basic"
                    form={infoForm}
                    onFinish={onInfoFinish}
                    onFinishFailed={onInfoFinishFailed}
                    autoComplete="off"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 16 }}
                >
                    <Form.Item
                        name="name"
                        label="姓名"
                        style={{ textAlign: 'start' }}
                        rules={[
                            {
                                required: true,
                                message: '请输入姓名'
                            },
                        ]}
                    >
                        <Input className="input" maxLength={10} placeholder='请输入姓名' />
                    </Form.Item>
                    <Form.Item
                        name="age"
                        label="年龄"
                        style={{ textAlign: 'start' }}
                        rules={[
                            {
                                required: true,
                                message: '请输入年龄'
                            },
                        ]}
                    >
                        <Input className="input" type='number' min={1} max={200} placeholder='请输入年龄' />
                    </Form.Item>
                    <Form.Item
                        name="gender"
                        label="性别"
                        style={{ textAlign: 'start' }}
                        rules={[
                            {
                                required: true,
                                message: '请输入性别'
                            },
                        ]}
                    >
                        <Input className="input" maxLength={10} placeholder='请输入性别' />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="手机号"
                        style={{ textAlign: 'start' }}
                        rules={[
                            {
                                required: true,
                                message: '请输入手机号'
                            },
                            {
                                pattern: /^1[3456789]\d{9}$/,
                                message: '请检查手机号是否正确!',
                            }
                        ]}
                    >
                        <Input className="input" maxLength={11} placeholder='请输入手机号' />
                    </Form.Item>
                    <Form.Item
                        name="id_number"
                        label="身份证号"
                        style={{ textAlign: 'start' }}
                        rules={[
                            {
                                required: true,
                                message: '请输入身份证号'
                            },
                        ]}
                    >
                        <Input className="input" placeholder='请输入身份证号' />
                    </Form.Item>
                    <Form.Item
                        name="bank_card"
                        label="银行卡号"
                        style={{ textAlign: 'start' }}
                        rules={[
                            {
                                required: true,
                                message: '请输入银行卡号'
                            },
                        ]}
                    >
                        <Input className="input" placeholder='请输入银行卡号' />
                    </Form.Item>
                    <Form.Item
                        name="address"
                        label="地址"
                        style={{ textAlign: 'start' }}
                        rules={[
                            {
                                required: true,
                                message: '请输入居住地址'
                            },
                        ]}
                    >
                        <Input className="input" placeholder='请输入居住地址' />
                    </Form.Item>
                    <Form.Item
                        name="idCardFront"
                        label="身份证正面照"
                        style={{ textAlign: 'start' }}
                        rules={[
                            {
                                required: userInfo.info_status === 1 ? false : true,
                                message: '请上传身份证正面照'
                            },
                        ]}
                    >
                        <div>
                            <Input id="idCardFront" style={{ display: 'none' }} type="file" onChange={(e) => handleImageChangeFront(e)} />
                            <label className="label" style={{ display: frontUrl === '' ? 'block' : 'none' }} htmlFor="idCardFront">+点击上传图片</label>
                            {
                                frontUrl ? <label htmlFor="idCardFront">< img style={{ width: '240px', height: '150px', marginLeft: '5px', cursor: 'pointer' }} src={frontUrl} /></label> : null
                            }
                        </div>

                    </Form.Item>
                    <Form.Item
                        name="idCardFront"
                        label="身份证反面照"
                        style={{ textAlign: 'start' }}
                        rules={[
                            {
                                required: userInfo.info_status === 1 ? false : true,
                                message: '请上传身份证反面照'
                            },
                        ]}
                    >
                        <div>
                            <Input id="idCardReverse" style={{ display: 'none' }} type="file" onChange={(e) => handleImageChangeReverse(e)} />
                            <label className="label" style={{ display: reverseUrl === '' ? 'block' : 'none' }} htmlFor="idCardReverse">+点击上传图片</label>
                            {
                                reverseUrl ? <label htmlFor="idCardReverse">< img style={{ width: '240px', height: '150px', marginLeft: '5px', cursor: 'pointer' }} src={reverseUrl} /></label> : null
                            }
                        </div>

                    </Form.Item>
                    <Form.Item>
                        <div className="changepwd-footer">
                            <Button type="primary" style={{ marginRight: '45px' }} size='large' className='btn' htmlType="submit">
                                提交
                            </Button>
                            <Button type="primary" size='large' className='btn' onClick={handleCancel}>
                                取消
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
