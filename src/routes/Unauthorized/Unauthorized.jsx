import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
  <div className="h-screen grid place-items-center">
      <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={
        <Button
          style={{ backgroundColor: "#1890ff", color: "#fff" }}
          type="primary"
          onClick={() => navigate(-1)}
        >
          Back Home
        </Button>
      }
    />
  </div>
  );
};
export default Unauthorized;
