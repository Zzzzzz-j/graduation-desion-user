import React from "react";
import { Carousel } from 'antd';
import { useNavigate } from 'react-router-dom';
import './index.scss';
import shuffling0 from '../../public/shuffling0.png';
import shuffling1 from '../../public/shuffling1.png';
import shuffling2 from '../../public/shuffling2.png';
import intro from '../../public/intro.png';

export default function HomePage() {
    const history = useNavigate();
    const contentStyle = {
        width: '100%',
        height: '440px',
        textAlign: 'center',
    };

    React.useEffect(() => {

    }, [])

    return (
        <div className="home-page">
            <Carousel autoplay>
                <div style={contentStyle}>
                    <img style={contentStyle} src={shuffling0} alt="" />
                </div>
                <div style={contentStyle}>
                    <img style={contentStyle} src={shuffling1} alt="" />
                </div>
                <div style={contentStyle}>
                    <img style={contentStyle} src={shuffling2} alt="" />
                </div>
            </Carousel>
            <div className="intro">
                <img src={intro} alt="" />
            </div>
            <div className="loan-center">
                <h1 style={{ fontSize: '32px' }}>贷款中心</h1>
                <p className="title-text">安心融资 想你所贷</p>
                <div className="loan-main">
                    <div className="loan-item" onClick={() => history('/LoanPrepare')}>
                        <div className="item-num">01</div>
                        <div className="item-body">
                            <p className="item-title">贷款申请前要做哪些准备？</p>
                            <p className="item-text">
                                在贷款行业呆久了，发现很多贷款人会有贷款失败的情况，花费了时间和精力，
                                结果就是因为贷款前没有做好准备工作，急忙去申请贷款，频繁贷款不通过。
                                今天我们就来说说在贷款之前应该做好哪些准备?
                            </p>
                        </div>
                    </div>
                    <div className="loan-item" onClick={() => history('/LoanSteps')}>
                        <div className="item-num">02</div>
                        <div className="item-body">
                            <p className="item-title">贷款的操作步骤</p>
                            <p className="item-text">
                                不知道怎么贷款？
                            </p>
                            <p className="item-text">
                                手把手教你按步骤进行小额贷款。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="go-loan">
                <button className="button">立即贷款</button>
            </div>
        </div>
    )
}