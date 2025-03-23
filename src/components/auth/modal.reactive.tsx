'use client";';
import React, { useState } from "react";
import {
  Modal,
  Steps,
  Form,
  Col,
  Divider,
  theme,
  Input,
  Button,
  message,
  Spin,
  Row,
} from "antd";
import {
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { authenticate } from "@/utils/actions";

import { useHasMounted } from "@/utils/customHook";
import { useRouter } from "next/navigation";

const { Item } = Form;
import { sendRequest } from "@/utils/api";

interface ModalReactiveProps {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  emailUser: string;
}
interface FormEmailProps {
  emailUser: string;
  current: number;
  setCurrent: (value: number) => void;
  setIdUser: (value: string) => void;
}
interface VerifyProps {
  _id: string;
  current: number;
  setCurrent: (value: number) => void;
}
const VerifyForm = ({ _id, current, setCurrent }: VerifyProps) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (formData: any) => {
    const { code } = formData;
    setLoading(true);

    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/check-code`,
      method: "POST",
      body: { _id, code },
    });

    if (res?.data) {
      setCurrent(current + 1);
      setLoading(false);
    } else {
      messageApi.open({
        type: "error",
        content: `${res?.error}`,
      });
      setLoading(false);
    }
  };
  return (
    <>
      {" "}
      {contextHolder}{" "}
      <h3 style={{ textAlign: "left" }}>
        Mã code đã được gửi đến email của bạn. Vui lòng kiểm tra email!
      </h3>
      <Form
        name="basic"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Item
          label="Code"
          name="code"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mã code!",
            },
          ]}
        >
          <Input.Password />
        </Item>
        <Item style={{ textAlign: "right" }}>
          {" "}
          <Spin spinning={loading}>
            <Button type="primary" htmlType="submit">
              Xác thực
            </Button>
          </Spin>
        </Item>
      </Form>
    </>
  );
};
const EmailForm = ({
  emailUser,
  current,
  setCurrent,
  setIdUser,
}: FormEmailProps) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = React.useState<boolean>(false);
  const onFinish = async (values: any) => {
    const { email } = values;
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/retry-active`,
      method: "POST",
      body: { email },
    });

    if (res?.data) {
      setCurrent(current + 1);
      setIdUser(res.data._id);
      setLoading(false);
    } else {
      messageApi.open({
        type: "error",
        content: `${res?.error}`,
      });
      setLoading(false);
    }
  };
  return (
    <>
      {" "}
      {contextHolder}
      <h3 style={{ textAlign: "left" }}>
        Tài khoản của bạn chưa được kích hoạt
      </h3>
      <Form
        name="email"
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ email: emailUser }} // Điền email mặc định
      >
        <Item label="" name="email">
          <Input disabled />
        </Item>

        <Item style={{ textAlign: "right" }}>
          {" "}
          <Spin spinning={loading}>
            <Button type="primary" htmlType="submit">
              <SendOutlined /> Gửi mã xác nhận
            </Button>
          </Spin>
        </Item>
      </Form>
    </>
  );
};
const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState<boolean>(false);
  const onFinish = async (formData: any) => {
    const { email, password } = formData;
    setLoading(true);
    const res = await authenticate(email, password);
    if (res?.error) {
      if (res?.code == 2) {
        setLoading(false);
      }
    } else {
      router.push("/dashboard");
      setLoading(false);
    }
  };
  return (
    <>
      {" "}
      <h3 style={{ textAlign: "left" }}>
        Tài khoản bạn đã được kích hoạt. Vui lòng đăng nhập lại
      </h3>
      <Form
        name="basic"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input />
        </Item>
        <Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Item>
        <Item style={{ textAlign: "center" }}>
          <Spin spinning={loading}>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Spin>
        </Item>{" "}
      </Form>
    </>
  );
};

const ModalReactive = ({
  setIsModalOpen,
  isModalOpen,
  emailUser,
}: ModalReactiveProps) => {
  const [current, setCurrent] = useState(0);
  const [idUser, setIdUser] = useState<string>("");

  const { token } = theme.useToken();

  const steps = [
    {
      title: "Gửi mã xác nhận",
      status: "finish",
      icon: <UserOutlined />,
      content: (
        <EmailForm
          emailUser={emailUser}
          setCurrent={setCurrent}
          current={current}
          setIdUser={setIdUser}
        />
      ),
    },
    {
      title: "Nhập mã xác nhận",
      status: "finish",
      icon: <SolutionOutlined />,
      content: (
        <VerifyForm _id={idUser} setCurrent={setCurrent} current={current} />
      ),
    },

    {
      title: "Đăng nhập",
      status: "finish",
      icon: <SmileOutlined />,
      content: <Login />,
    },
  ];
  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle: React.CSSProperties = {
    lineHeight: "50px",
    textAlign: "center",
    color: token.colorTextTertiary,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 10,
    padding: 16,
  };
  const hasMounted = useHasMounted();
  if (!hasMounted) return <></>;

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        title="Kích hoạt tài khoản"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
        footer={null}
        width={600}
      >
        <Steps current={current} items={items} />
        <div style={contentStyle}>{steps[current].content}</div>
      </Modal>
    </>
  );
};

export default ModalReactive;
