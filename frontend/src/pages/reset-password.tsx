import api from "@/services/api";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();

  const router = useRouter();

  const token = searchParams?.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!token) {
      alert("Invalid or missing token.");
      return;
    }

    try {
      const payload = {
        password,
        token,
      };
      const response = await api.post("/user/reset-password", payload);
      if (response.status !== 200) {
        const data = await response.data();
        throw new Error(data.message || "Failed to reset password");
      } else {
        alert(
          "Password reset successful. You can now log in with your new password."
        );
      }

      router.push("/login");
    } catch (err) {
      console.error("Error resetting password:", err);
      alert("There was an error resetting your password.");
    }
  };

  return (
    <div className="hold-transition login-page" style={{ minHeight: "100vh" }}>
      <div className="login-box">
        {/* Logo */}
        <div className="login-logo">
          <a href="/login">
            <b>My</b> SAAS
          </a>
        </div>

        {/* Card */}
        <div className="card">
          <div className="card-body login-card-body">
            <p className="login-box-msg">Enter your new password</p>

            {/* Reset Password Form */}
            <form onSubmit={handleSubmit}>
              <div className="input-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="New password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock"></span>
                  </div>
                </div>
              </div>

              <div className="input-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock"></span>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block col-12"
                  >
                    Reset Password
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-3">
              <p className="mb-0 text-center ">
                <a href="/login">Back to login</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
