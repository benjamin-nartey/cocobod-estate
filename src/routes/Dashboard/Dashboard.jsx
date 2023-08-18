import { Space } from "antd";
import Typography from "antd/es/typography/Typography";
import DashboardCard from "../../components/DashboardCard/DashboardCard";
import { AiFillPropertySafety } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import { FaShoppingBag } from "react-icons/fa";
import { BiShoppingBag } from "react-icons/bi";

function Dashboard() {
  return (
    <div className="w-full p-6">
      <Typography.Title level={4}>Dashboard</Typography.Title>
      <div className="w-full flex gap-4">
        <NavLink to="/properties-table">
          <DashboardCard
            icon={
              <BiShoppingBag
                color="green"
                style={{
                  backgroundColor: "rgba(0,128,0,0.25)",
                  padding: 4,
                  borderRadius: 20,
                  fontSize: 26,
                }}
              />
            }
            title={"Properties"}
            value={2345}
          />
        </NavLink>

        <NavLink to="/properties-table">
          <DashboardCard
            icon={
              <AiFillPropertySafety
                color="green"
                style={{
                  backgroundColor: "rgba(0,128,0,0.25)",
                  padding: 4,
                  borderRadius: 20,
                  fontSize: 26,
                }}
              />
            }
            title={"Properties"}
            value={2145}
          />
        </NavLink>

        <NavLink to="/properties-table">
          <DashboardCard
            icon={
              <AiFillPropertySafety
                color="green"
                style={{
                  backgroundColor: "rgba(0,128,0,0.25)",
                  padding: 4,
                  borderRadius: 20,
                  fontSize: 26,
                }}
              />
            }
            title={"Properties"}
            value={2145}
          />
        </NavLink>
      </div>
    </div>
  );
}

export default Dashboard;
