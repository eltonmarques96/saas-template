"use client";

import api from "@/services/api";
import Link from "next/link";
import { useState } from "react";
import bcrypt from "bcryptjs";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  async function submitForm(event: React.FormEvent) {
    try {
      event.preventDefault();

      await api.post("/auth/login", {
        email,
        password,
      });
      // Handle successful login (e.g., redirect to dashboard)
      alert("Login successful");
    } catch (error) {
      if (error instanceof Error) {
        alert("Login failed");
      } else {
        alert("An unknown error occurred");
      }
      console.error("Error during form submission:", error);
    }
  }

  return (
    <div className="hold-transition login-page" style={{ minHeight: "100vh" }}>
      <div className="login-box">
        <div className="login-logo">
          <a href="#">
            <b>My</b> SAAS
          </a>
        </div>

        <div className="card">
          <div className="card-body login-card-body">
            <p className="login-box-msg">Sign in to start your session</p>

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

              <div className="input-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
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

              <div className="row">
                <div className="col-8">
                  <div className="icheck-primary">
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember"> Remember Me </label>
                  </div>
                </div>

                <div className="col-4">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    onClick={(event) => submitForm(event)}
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </form>

            {/* Links */}
            <div className="mt-3">
              <p className="mb-1">
                <Link href="/forgot-password">I forgot my password</Link>
              </p>
              <p className="mb-0">
                <Link href="/register" className="text-center">
                  Register a new account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
