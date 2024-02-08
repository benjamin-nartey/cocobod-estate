import React from 'react';
import { useSnapshot } from 'valtio';
import state from '../../store/store';
import { Navigate, Outlet } from 'react-router-dom';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const ProtectedLogin = ({ children }) => {
  const snap = useSnapshot(state);
  const { currentUser, loadingState } = snap.auth;

  console.log(currentUser);

  if (!currentUser && loadingState === true) {
    return (
      <div className="w-screen h-screen fixed left-0 top-0 z-[99999]  grid place-items-center">
        <Spin
          indicator={
            <LoadingOutlined style={{ fontSize: '10rem', color: '#6E431D' }} />
          }
          size="large"
        />
      </div>
    );
  } else if (currentUser && loadingState === false) {
    return <Navigate to={'/dashboard'} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedLogin;
