"use client";

import { useState } from "react";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import styles from "./Login.module.css";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <>
      <SiteHeader />
      <section className={styles.section}>
        <div className={`seg ${styles.tabs}`}>
          <label className={`seg-opt ${styles.tab}`}>
            <input type="radio" name="mode" checked={mode === "login"} onChange={() => setMode("login")} />
            <span>Sign In</span>
          </label>
          <label className={`seg-opt ${styles.tab}`}>
            <input type="radio" name="mode" checked={mode === "signup"} onChange={() => setMode("signup")} />
            <span>Create Account</span>
          </label>
        </div>

        {mode === "login" ? (
          <>
            <h1>Welcome back</h1>
            <p className={`${styles.subtext} text-muted`}>Pick up your story where you left it.</p>
            <div className={styles.fields}>
              <input type="email" placeholder="Email address" className="input" />
              <input type="password" placeholder="Password" className="input" />
            </div>
            <a href="#" className={styles.forgot}>
              Forgot password?
            </a>
            <Link href="/" className="btn btn-primary btn-block">
              Sign In
            </Link>
          </>
        ) : (
          <>
            <h1>Start your story</h1>
            <p className={`${styles.subtext} text-muted`}>
              Create an account for faster checkout and order tracking.
            </p>
            <div className={styles.fields} style={{ marginBottom: 24 }}>
              <input type="text" placeholder="Full name" className="input" />
              <input type="email" placeholder="Email address" className="input" />
              <input type="password" placeholder="Password" className="input" />
            </div>
            <Link href="/" className="btn btn-primary btn-block">
              Create Account
            </Link>
          </>
        )}
      </section>
      <Footer />
    </>
  );
}
