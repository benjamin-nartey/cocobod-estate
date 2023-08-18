import { Card, Space, Statistic } from "antd";

function DashboardCard({ title, value, icon }) {
  return (
   
      <Card hoverable>
        <Space size="large" direction="horizontal">
          {icon}
          <Statistic title={title} value={value} />
        </Space>
      </Card>
  );
}

export default DashboardCard;
