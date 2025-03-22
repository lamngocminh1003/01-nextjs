"use client";
import React from "react";
import { SmileOutlined } from "@ant-design/icons";
import { Result, Button, Col, Form, Input, Row, Spin } from "antd";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { sendRequest } from "@/utils/api";
import "react-toastify/dist/ReactToastify.css";

// Định nghĩa kiểu Props
interface VerifyProps {
  _id: string;
}
const Verify: React.FC<VerifyProps> = ({ _id }) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const router = useRouter();

  const onFinish = async (formData: any) => {
    const { code } = formData;
    setLoading(true);

    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/check-code`,
      method: "POST",
      body: { _id, code },
    });

    if (res?.data) {
      router.push(`/auth/login`);
      setLoading(false);
    } else {
      toast.error(res?.message);
      setLoading(false);
    }
  };
  return (
    <>
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
            <legend>
              <h2>Xác thực tài khoản</h2>
            </legend>

            <Form
              name="basic"
              onFinish={onFinish}
              autoComplete="off"
              layout="vertical"
            >
              <Result
                icon={<SmileOutlined />}
                title="Mã code đã được gửi đến email của bạn. Vui lòng kiểm tra email!"
              />
              <Form.Item
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
              </Form.Item>
              <Form.Item style={{ textAlign: "center" }}>
                <Spin spinning={loading}>
                  <Button type="primary" htmlType="submit">
                    Xác thực
                  </Button>
                </Spin>
              </Form.Item>{" "}
            </Form>
          </fieldset>
        </Col>
      </Row>
    </>
  );
};

export default Verify;
