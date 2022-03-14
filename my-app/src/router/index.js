import React from 'react';
import { Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Login from '../pages/Login';
import Layout from '../pages/Layout';
import HomePage from '../pages/HomePage';
import LoanPrepare from '../pages/LoanPrepare';
import LoanSteps from '../pages/LoanSteps';
import LoanCenter from '../pages/LoanCenter';
import MyLoan from '../pages/MyLoan';

const BasicRoute = () => {
    const location = useLocation();
    const history = useNavigate();

    React.useEffect(() => {
        const isLogin = sessionStorage.token ? true : false;
        if (location.pathname != '/login' && isLogin === false) {
            console.log('/login11111');
            history('/login');
        }
    }, [])

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
                <Route path="HomePage" element={<HomePage />} />
                <Route path="LoanPrepare" element={<LoanPrepare />} />
                <Route path="LoanSteps" element={<LoanSteps />} />
                <Route path="LoanCenter" element={<LoanCenter />} />
                <Route path="MyLoan" element={<MyLoan />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
}

export default BasicRoute;