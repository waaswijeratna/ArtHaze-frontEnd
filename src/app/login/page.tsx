/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";
import Lottie from "react-lottie-player";
import relaxingGirl from "@/../../public/lottieFiles/relaxingGirl.json";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex items-center justify-center h-[100vh] bg-fourth overflow-auto scrollbar-hide">
      <div className="bg-primary shadow-lg shadow-secondary/40 rounded-2xl flex w-[90%] overflow-hidden">
        {/* Left Section (Login/Signup) */}
        <div className="w-1/2 px-8 pb-2 pt-2 flex flex-col justify-center">
          {isLogin ? (
            <LoginForm onSwitch={() => setIsLogin(false)} />
          ) : (
            <SignupForm onSwitch={() => setIsLogin(true)} />
          )}
        </div>

        {/* Right Section (Lottie Animation) */}
        <div className="w-1/2 flex flex-col items-center justify-center bg-fourth/90">
          <div>
            <div className="flex items-center justify-center mb-4">
              <img src="images/logo.png" alt="logo" className="w-9 h-9 rounded-full object-cover mr-2" />
              <h2 className="text-white font-bold text-xl">Arthaze</h2>
            </div>
            <h3 className="text-white font-bold  text-center ml-3">Find Your peace</h3>
          </div>
          <Lottie loop animationData={relaxingGirl} play className="" />
        </div>
      </div>
    </div>
  );
}
