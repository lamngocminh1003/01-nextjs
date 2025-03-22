"use client";
import { Button, Col, Divider, Form, Input, Row, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import React from "react";
import Link from "next/link";
import { authenticate } from "@/utils/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [loadingRegister, setLoadingRegister] = React.useState<boolean>(false);

  const onFinish = async (formData: any) => {
    const { email, password } = formData;
    setLoading(true);
    const res = await authenticate(email, password);
    if (res?.error) {
      toast.error(res?.error);
      if (res?.code == 2) {
        router.push("/auth/verify");
        setLoading(false);
      }
    } else {
      router.push("/dashboard");
      setLoading(false);
    }
  };

  return (
    <Row justify={"center"} style={{ marginTop: "30px" }}>
      <Col xs={24} md={16} lg={8}>
        <fieldset
          style={{
            padding: "15px",
            margin: "5px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <legend>Đăng Nhập</legend>
          <Form
            name="basic"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
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
            </Form.Item>
            <Form.Item
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
            </Form.Item>
            <Form.Item style={{ textAlign: "center" }}>
              <Spin spinning={loading}>
                <Button type="primary" htmlType="submit">
                  Login
                </Button>
              </Spin>
            </Form.Item>{" "}
          </Form>
          <Link href={"/"}>
            <ArrowLeftOutlined /> Quay lại trang chủ
          </Link>
          <Divider />
          <Spin spinning={loadingRegister}>
            <div style={{ textAlign: "center" }}>
              Chưa có tài khoản?{" "}
              <Link
                href={"/auth/register"}
                onClick={() => setLoadingRegister(true)}
              >
                Đăng ký tại đây
              </Link>
            </div>
          </Spin>
        </fieldset>
      </Col>
    </Row>
  );
};

export default Login;
