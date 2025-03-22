"use server";
import { signIn } from "@/auth";

export async function authenticate(email: string, password: string) {
  try {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, // Không redirect khi lỗi
    });

    // Nếu có lỗi từ `signIn()`, trả về lỗi thay vì `throw`
    if (res?.error) {
      return { error: res.error, code: 1 }; // Lưu lỗi và gửi về
    }

    return res; // Đăng nhập thành công
  } catch (error: any) {
    console.error("Auth Error:", JSON.stringify(error)); // Log lỗi

    // Nếu lỗi là `InvalidEmailPasswordError`
    if (error.name.includes("InvalidEmailPasswordError")) {
      return { error: "Email hoặc mật khẩu không đúng", code: 1 };
    } else if (error.name.includes("InactiveAccountError")) {
      return { error: "Tài khoản của bạn chưa được kích hoạt", code: 2 };
    } else {
      return { error: "Lỗi máy chủ, vui lòng thử lại!", code: 0 };
    }
  }
}
