"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, Mail, Store, Upload } from "lucide-react";
import { useState, useRef } from "react";
import Link from "next/link";


export default function RegisterPage() {
  // Stepper: 0 = email/password, 1 = IC, 2 = Bank, 3 = SSM, 4 = done
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  // File states
  const [icFile, setIcFile] = useState<File | null>(null);
  const [bankFile, setBankFile] = useState<File | null>(null);
  const [ssmFile, setSsmFile] = useState<File | null>(null);
  // File input refs
  const icInputRef = useRef<HTMLInputElement>(null);
  const bankInputRef = useRef<HTMLInputElement>(null);
  const ssmInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Step 0: Email/Password submit
  const handleEmailPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    if (!acceptTerms) {
      alert("Please accept the terms and conditions");
      return;
    }
    setStep(1);
  };

  // Step 1: IC upload
  const handleIcSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };
  const handleIcSkip = () => setStep(2);

  // Step 2: Bank statement upload
  const handleBankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };
  const handleBankSkip = () => setStep(3);

  // Step 3: SSM upload
  const handleSsmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFinalRegister();
  };
  const handleSsmSkip = () => handleFinalRegister();

  // Final registration (simulate)
  const handleFinalRegister = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(4);
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join PayPort Real as a merchant</p>
        </div>

        {/* Stepper UI */}
        <div className="flex justify-center mb-6">
          {["Account", "IC", "Bank", "SSM"].map((label, idx) => (
            <div key={label} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${step === idx ? "bg-pink-500" : "bg-gray-300"}`}>{idx + 1}</div>
              {idx < 3 && <div className="w-8 h-1 bg-gray-300 mx-1 rounded" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 min-h-[340px] flex flex-col justify-center">
          {/* Step 0: Email/Password */}
          {step === 0 && (
            <form onSubmit={handleEmailPasswordSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Create a password"
                    className="pl-10 pr-10 h-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10 h-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 mt-1"
                />
                <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-600">
                  I agree to the{" "}
                  <Link href="/terms" className="text-pink-600 hover:text-pink-700 font-medium">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-pink-600 hover:text-pink-700 font-medium">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !acceptTerms}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white h-12 text-base font-semibold rounded-lg disabled:opacity-50"
              >
                Next
              </Button>
            </form>
          )}

          {/* Step 1: IC Upload */}
          {step === 1 && (
            <form onSubmit={handleIcSubmit} className="space-y-6">
              <div className="text-center">
                <Upload className="w-10 h-10 mx-auto text-pink-500 mb-2" />
                <h2 className="text-xl font-semibold mb-2">Upload IC (eKYC)</h2>
                <p className="text-gray-500 text-sm mb-4">Optional. You can skip this step.</p>
              </div>
              <input
                type="file"
                accept="image/*,application/pdf"
                ref={icInputRef}
                onChange={e => setIcFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
              />
              {icFile && <div className="text-green-600 text-sm">Selected: {icFile.name}</div>}
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-pink-500 text-white">Next</Button>
                <Button type="button" variant="outline" className="flex-1" onClick={handleIcSkip}>Skip</Button>
              </div>
            </form>
          )}

          {/* Step 2: Bank Statement Upload */}
          {step === 2 && (
            <form onSubmit={handleBankSubmit} className="space-y-6">
              <div className="text-center">
                <Upload className="w-10 h-10 mx-auto text-pink-500 mb-2" />
                <h2 className="text-xl font-semibold mb-2">Upload 3-Month Bank Statement</h2>
                <p className="text-gray-500 text-sm mb-4">Optional. You can skip this step.</p>
              </div>
              <input
                type="file"
                accept="application/pdf,image/*"
                ref={bankInputRef}
                onChange={e => setBankFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
              />
              {bankFile && <div className="text-green-600 text-sm">Selected: {bankFile.name}</div>}
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-pink-500 text-white">Next</Button>
                <Button type="button" variant="outline" className="flex-1" onClick={handleBankSkip}>Skip</Button>
              </div>
            </form>
          )}

          {/* Step 3: SSM Upload */}
          {step === 3 && (
            <form onSubmit={handleSsmSubmit} className="space-y-6">
              <div className="text-center">
                <Upload className="w-10 h-10 mx-auto text-pink-500 mb-2" />
                <h2 className="text-xl font-semibold mb-2">Upload SSM Document</h2>
                <p className="text-gray-500 text-sm mb-4">Optional. You can skip this step.</p>
              </div>
              <input
                type="file"
                accept="application/pdf,image/*"
                ref={ssmInputRef}
                onChange={e => setSsmFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
              />
              {ssmFile && <div className="text-green-600 text-sm">Selected: {ssmFile.name}</div>}
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-pink-500 text-white">Finish</Button>
                <Button type="button" variant="outline" className="flex-1" onClick={handleSsmSkip}>Skip</Button>
              </div>
            </form>
          )}

          {/* Step 4: Done */}
          {step === 4 && (
            <div className="flex flex-col items-center justify-center min-h-[200px]">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Complete!</h2>
              <p className="text-gray-600">Redirecting to dashboard...</p>
            </div>
          )}
        </div>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-pink-600 hover:text-pink-700 font-medium"
            >
              Sign In
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            © 2024 PayPort Real. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}