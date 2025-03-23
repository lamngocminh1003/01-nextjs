"use client";
import React from "react";
import { Button, Col, Divider, Form, Input, Spin, Row } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { sendRequest } from "@/utils/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
const { Item } = Form;

const Register = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState<boolean>(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    const { email, password, name } = values;

    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register`,
      method: "POST",
      body: { email, password, name },
    });

    if (res?.data) {
      router.push(`/auth/verify/${res.data._id}`);
      setLoading(false);
    } else {
      toast.error(res?.error);
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
          <legend>Đăng Ký Tài Khoản</legend>
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

            <Item label="Name" name="name">
              <Input />
            </Item>

            <Item style={{ textAlign: "center" }}>
              <Spin spinning={loading}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>{" "}
              </Spin>
            </Item>
          </Form>
          <Link href={"/"}>
            <ArrowLeftOutlined /> Quay lại trang chủ
          </Link>
          <Divider />
          <div style={{ textAlign: "center" }}>
            Đã có tài khoản? <Link href={"/auth/login"}>Đăng nhập</Link>
          </div>
        </fieldset>
      </Col>
    </Row>
  );
};

export default Register;
