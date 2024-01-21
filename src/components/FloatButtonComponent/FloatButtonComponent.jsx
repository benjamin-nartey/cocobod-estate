import { DownloadOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import { FloatButton } from 'antd';

const FloatButtonComponent = ({ handleClick }) => {
  return (
    <FloatButton
      onClick={handleClick}
      icon={<DownloadOutlined style={{ color: '#fff' }} />}
      type="default"
      style={{
        right: 94,
      }}
    />
  );
};

export default FloatButtonComponent;
