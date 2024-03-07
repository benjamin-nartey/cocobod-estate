import { Button, Form, Input, message } from 'antd';
import logo from '../../assets/logo-cocobod.png';

import { MdOutlinePassword } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LockOutlined } from '@ant-design/icons';
import { axiosInstance } from '../../axios/axiosInstance';
import { HiOutlineMail } from 'react-icons/hi';
import { useMutation } from '@tanstack/react-query';
import { forgotPassword } from '../../http/auth';

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const [showForm, setShowForm] = useState(true);

  const { mutate } = useMutation({
    mutationKey: 'ForgotPassword',
    mutationFn: (data) => {
      return forgotPassword(data);
    },
    onSuccess: () => {
      setShowForm(false);
    },
    onError: (err) => {
      message.error(err.response.data.message);
    },
  });

  const handleSubmit = (values) => {
    mutate({ ...values, tokenType: 1 });
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
          Enter email to reset your password
        </h5>

        {showForm ? (
          <Form
            className="bg-transparent w-full"
            form={form}
            layout="vertical"
            onFinish={(values) => handleSubmit(values)}
            name="wrap"
            // labelCol={{
            //   flex: "110px",
            // }}
            labelAlign="left"
            labelWrap
            colon={false}
            style={
              {
                // maxWidth: 600,
              }
            }
          >
            <Form.Item
              label=""
              name="email"
              rules={[
                {
                  required: true,
                },
                {
                  validator: (_, value) => {
                    const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
                    if (!value || emailRegex.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      'Please enter a valid email address!'
                    );
                  },
                },
              ]}
            >
              <Input
                name="email"
                placeholder="Enter email"
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
          </Form>
        ) : (
          <div className="flex items-center gap-2">
            <HiOutlineMail color="#6E431D" />{' '}
            <span className=" text-sm text-[#6E431D]">
              An email has been sent to {form.getFieldValue('email')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
