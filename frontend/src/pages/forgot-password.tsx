"use client";

import Link from "next/link";

export default function ForgotPasswordPage() {
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
