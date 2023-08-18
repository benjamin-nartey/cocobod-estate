import { Button, Result } from "antd";
const Unauthorized = () => (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button
        style={{ backgroundColor: "#6E431D", text: "#fff", outline: "none" }}
        type="primary"
      >
        Back Home
      </Button>
    }
  />
);
export default Unauthorized;
