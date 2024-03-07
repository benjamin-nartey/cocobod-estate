import { Button, Form, Input, message } from 'antd';
import logo from '../../assets/logo-cocobod.png';
import Password from 'antd/es/input/Password';
import { MdOutlinePassword } from 'react-icons/md';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LockOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '../../http/auth';

const ResetPassword = () => {
  const [form] = Form.useForm();

  const [showForm, setShowForm] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { mutate } = useMutation({
    mutationKey: 'resetPassword',
    mutationFn: (data) => {
      return resetPassword(data, searchParams.get('token'));
    },
    onSuccess: () => {
      message.success('Password reset successfully');
      setShowForm(false);
    },
    onError: (err) => {
      message.error(err.response.data.message);
      setShowForm(true);
    },
  });

  const handleSubmit = (values) => {
    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match');
      return;
    } else {
      mutate({ password: values.password });
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
          Fill Form to reset your password
        </h5>

        {showForm ? (
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
                  min: 8,
                },
              ]}
            >
              <Password
                name="password"
                placeholder="New Password"
                prefix={<LockOutlined />}
              />
            </Form.Item>
            <Form.Item
              label=""
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  min: 8,
                },
              ]}
            >
              <Password
                name="password"
                placeholder="Confirm Password"
                prefix={<LockOutlined />}
              />
            </Form.Item>

            <Button
              className="w-full"
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: '#6E431D', color: '#fff' }}
            >
              Submit
            </Button>
            <div className="flex justify-center flex-col items-center text-sm  font-light  text-left  text-[#B67F4E] mt-10">
              <span className="mb-2">Password must satisfy atleast</span>
              <ul>
                <li>an UpperCase Letter</li>
                <li>a lowerCase Letter</li>
                <li>a Sepcial Character</li>
                <li>8 Character</li>
              </ul>
            </div>
          </Form>
        ) : (
          <div className="grid place-items-center">
            <Button
              href="/login"
              className="w-full"
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: '#6E431D', color: '#fff' }}
            >
              {' '}
              &larr; Back To Login{' '}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
