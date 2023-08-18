import { Button, Result } from "antd";

const NotExistPage = () => (
  <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={
      <Button
        style={{ backgroundColor: "#1890ff", color: "#fff" }}
        type="primary"
      >
        Go Back
      </Button>
    }
  />
);

export default NotExistPage;
