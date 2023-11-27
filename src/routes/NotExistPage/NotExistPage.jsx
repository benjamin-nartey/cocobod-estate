import { Button, Result } from "antd";

import { useNavigate } from "react-router-dom";

const NotExistPage = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen grid place-items-center">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button
            style={{ backgroundColor: "#1890ff", color: "#fff" }}
            type="primary"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        }
      />
    </div>
  );
};

export default NotExistPage;
