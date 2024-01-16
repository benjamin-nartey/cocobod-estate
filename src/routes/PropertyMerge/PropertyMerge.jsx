import React, { useState } from 'react';
import { Button, message, Steps, theme } from 'antd';
import PropertyCreateForm from './PropertyMergeForm';
import PropertyUnitMerge from './PropertyUnitMerge';
import { useSnapshot } from 'valtio';
import state from '../../store/store';
import { CRUDTYPES } from '../../store/modalSlice';

const PropertyMerge = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };

  const snap = useSnapshot(state);
  const { crudType } = snap.modalSlice;

  const steps = [
    {
      title: crudType === CRUDTYPES.ADD ? 'Create Property' : 'Update Property',
      content: (
        <div className="w-[50%] mx-auto p-4 h-[260px] my-auto mt-10">
          <PropertyCreateForm move={next} />
        </div>
      ),
    },
    {
      title:
        crudType === CRUDTYPES.ADD
          ? 'Assign Property Unit to Property'
          : 'Update Property Assignment',
      content: (
        <div className="w-[99%] mx-auto p-4  ">
          <PropertyUnitMerge />
        </div>
      ),
    },
  ];

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  const contentStyle = {
    lineHeight: '260px',
    textAlign: 'center',
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
    minHeight: '40rem',
  };
  return (
    <div className="w-[90%] mx-auto mt-6">
      <Steps current={current} items={items} />
      <div style={contentStyle}>{steps[current].content}</div>
      <div
        style={{
          marginTop: 24,
        }}
      ></div>
    </div>
  );
};

export default PropertyMerge;
