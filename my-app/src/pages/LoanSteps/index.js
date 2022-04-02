import React from "react";
import { Image } from 'antd';
import privateInfo from '../../public/privateInfo.png';
import loanInfo from '../../public/loanInfo.png';
import './index.scss';

export default function LoanSteps() {
    return (
        <div className="loan-steps">
            <h1 style={{ fontSize: '28px', marginBottom: '40px', textAlign: 'start' }}>贷款的操作步骤</h1>
            <p>1：在贷款中心填写个人信息并提交</p>
            <Image
                src={privateInfo}
            />
            <p>2：提交完个人信息后，再填写下方的贷款信息并提交即可完成贷款申请</p>
            <Image
                src={loanInfo}
            />
            <p>3：注意事项</p>
            <div style={{textAlign: 'start', fontSize: '20px'}}>(1) 请正确填写个人身份信息，如发现有虚假信息将不会通过您的任何贷款申请</div>
            <div style={{textAlign: 'start', fontSize: '20px'}}>(2) 提交完贷款申请后可在我的贷款模块查看您提交过的贷款申请，并且可以取消未被审批的贷款申请</div>
        </div>
    )
}
