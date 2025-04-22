"use client";

import api from "@/services/api";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/user/forgot-password", {
        email,
      });
      alert("Password reset link sent to your email.");
    } catch {
      alert("Error: Unable to send password reset link.");
    }
  };

  return (
    <div className="hold-transition login-page" style={{ minHeight: "100vh" }}>
      <div className="login-box">
        {/* Logo */}
        <div className="login-logo">
          <a href="#">
            <b>My</b> SAAS
          </a>
        </div>

        {/* Card */}
        <div className="card">
          <div className="card-body login-card-body">
            <p className="login-box-msg">
              You forgot your password? Here you can easily retrieve a new one.
            </p>

            {/* Forgot Password Form */}
            <form>
              <div className="input-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-envelope"></span>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block col-12"
                    onClick={(event) => submitForm(event)}
                  >
                    Request new password
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-3">
              <p className="mb-1 ">
                <Link href="/login" className="">
                  Back to login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
