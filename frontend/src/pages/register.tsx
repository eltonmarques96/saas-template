"use client";

import { useState } from "react";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (form.password !== form.passwordConfirm) {
        setError("Passwords do not match.");
        return;
      }

      const hashedPassword = await bcrypt.hash(form.password, 10);

      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: hashedPassword,
      };

      const response = await api.post("/user/register", payload);

      if (response.status !== 201) {
        const data = await response.data();
        throw new Error(data.message || "Failed to register");
      } else {
        alert(
          "Registration successful. Please check your email to verify your account."
        );
      }

      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div
      className="hold-transition register-page"
      style={{ minHeight: "100vh" }}
    >
      <div className="register-box">
        <div className="register-logo">
          <a href="#">
            <b>My</b> SAAS
          </a>
        </div>

        <div className="card">
          <div className="card-body register-card-body">
            <p className="login-box-msg">Register a new account</p>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-user"></span>
                  </div>
                </div>
              </div>

              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-user"></span>
                  </div>
                </div>
              </div>

              <div className="input-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
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
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
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
                  placeholder="Confirm Password"
                  name="passwordConfirm"
                  value={form.passwordConfirm}
                  onChange={handleChange}
                  required
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
                    Register
                  </button>
                </div>
              </div>
            </form>

            <a href="/login" className="text-center d-block mt-3">
              I already have an account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
