import React from 'react';

import { Select, Space } from 'antd';

const CustomSelect = ({
  mode,
  value,
  onChange,
  options,
  placeholder,
  ...props
}) => {
  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  return (
    <Space
      style={{
        width: '100%',
      }}
      direction="vertical"
    >
      <Select
        showSearch
        mode={mode}
        allowClear
        style={{
          width: '100%',
        }}
        placeholder={placeholder}
        onChange={onChange}
        options={options}
        value={value}
        optionFilterProp="children"
        filterOption={filterOption}
        {...props}
      />
    </Space>
  );
};
export default CustomSelect;
