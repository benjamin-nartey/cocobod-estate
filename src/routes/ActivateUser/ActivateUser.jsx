import { Button, Form, Input, message } from "antd";
import logo from "../../assets/logo-cocobod.png";
import Password from "antd/es/input/Password";
import { MdOutlinePassword } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LockOutlined } from "@ant-design/icons";
import { axiosInstance } from "../../axios/axiosInstance";

const ActivateUser = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const token = urlParams.get("token");
    setToken(token);
  }, [location.search]);

  console.log(token);

  const handleSubmit = async (values) => {
    try {
      const response = await axiosInstance.post("/auth/activate-user", values, {
        params: { token: token },
      });

      if (response) {
        message.success("Account activated successfully");
        navigate("/login");
      }
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  return (
    <div className="bg-gray-100 w-screen h-screen grid place-items-center p-6">
      <div className="w-[25rem] max-md:w-full bg-[#e0cab5] rounded-xl p-8 grid place-items-center ">
        <h2 className="text-base text-[#6E431D] mb-4">WELCOME TO</h2>
        <div className=" logo-box mb-8 flex justify-center items-center gap-2 ">
          <img className="w-[50px] h-auto " src={logo} alt="logo" />
          <div className="line w-[1.5px] h-[30px] bg-[#6E431D]"></div>
          <h4 className="">
            <span className="block text-[16px] text-[#6E431D] font-semibold">
              Ghana Cocoa Board
            </span>
            <span className="block text-[8px] text-[#6E431D]">
              Poised to Maintain Premium Quality Cocoa
            </span>
          </h4>
        </div>
        <h5 className="text-[#B67F4E] text-[14px] mb-4 ">
          Enter password to activate user account
        </h5>

        <Form
          className="bg-transparent w-full"
          form={form}
          layout="vertical"
          onFinish={(values) => handleSubmit(values)}
          // initialValues={propertyReferenceCategories}
          name="wrap"
          // labelCol={{
          //   flex: "110px",
          // }}
          labelAlign="left"
          labelWrap
          // wrapperCol={{
          //   flex: 1,
          // }}
          colon={false}
          style={
            {
              // maxWidth: 600,
            }
          }
        >
          <Form.Item
            label=""
            name="password"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Password
              name="password"
              placeholder="Enter password"
              prefix={<LockOutlined />}
            />
          </Form.Item>

          <Button
            className="w-full"
            type="primary"
            htmlType="submit"
            style={{ backgroundColor: "#6E431D", color: "#fff" }}
          >
            Activate
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ActivateUser;
