import { Space } from "antd";
import Typography from "antd/es/typography/Typography";
import DashboardCard from "../../components/DashboardCard/DashboardCard";
import { AiFillPropertySafety } from "react-icons/ai";
import { NavLink } from "react-router-dom";

function Dashboard() {
  return (
    <div className="w-full p-6">
      <Typography.Title level={4}>Dashboard</Typography.Title>
      <Space size='middle' direction="horizontal">
        <NavLink to="/properties-table">
          <DashboardCard
            icon={<AiFillPropertySafety />}
            title={"Properties"}
            value={2345}
          />
        </NavLink>

        <NavLink to="/properties-table">
          <DashboardCard
            icon={<AiFillPropertySafety />}
            title={"Properties"}
            value={2145}
          />
        </NavLink>

        <NavLink to="/properties-table">
          <DashboardCard
            icon={<AiFillPropertySafety />}
            title={"Properties"}
            value={2145}
          />
        </NavLink>
        
      </Space>
    </div>
  );
}

export default Dashboard;
