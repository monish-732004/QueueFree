import React, { useState } from "react";
import { useRouter } from "next/router";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import Button from "$/components/Button";
import AuthCard from "$/components/auth/AuthCard";
import AuthTabs from "$/components/auth/AuthTabs";
import AuthInput from "$/components/auth/AuthInput";
import { supabase } from "$/integrations/supabase/client";

const StudentAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    studentId: "",
    year: "",
    department: "",
  });
  const router = useRouter();

  // Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/StudentPortal`,
          data: {
            name: formData.name,
            student_id: formData.studentId,
            year: formData.year,
            department: formData.department,
          },
        },
      });

      if (authError) throw authError;

      alert("Account created! Please check your email to verify.");
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign In
  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      router.push("/StudentPortal");
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // OAuth Login (Google, Facebook)
  const handleOAuthLogin = async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/StudentPortal`,
      },
    });

    if (error) {
      console.error(error);
      alert(`Error: ${error.message}`);
    } else {
      console.log(`Redirecting to ${provider} login...`, data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <AuthCard
        title="Student Portal"
        description="Sign in to order from canteen stalls"
      >
        {/* Tabs */}
        <div className="flex justify-center">
          <AuthTabs
            tabs={[
              {
                value: "signin",
                label: "Sign In",
                active: activeTab === "signin",
                onClick: () => setActiveTab("signin"),
              },
              {
                value: "signup",
                label: "Sign Up",
                active: activeTab === "signup",
                onClick: () => setActiveTab("signup"),
              },
            ]}
          />
        </div>

        {/* Sign In */}
        {activeTab === "signin" ? (
          <form onSubmit={handleSignIn} className="space-y-4 mt-6">
            <AuthInput
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <AuthInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        ) : (
          /* Sign Up */
          <form onSubmit={handleSignUp} className="space-y-4 mt-6">
            <AuthInput
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <AuthInput
              label="Student ID"
              type="text"
              placeholder="Enter your student ID"
              value={formData.studentId}
              onChange={(e) =>
                setFormData({ ...formData, studentId: e.target.value })
              }
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <AuthInput
                label="Year"
                type="number"
                placeholder="Year"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                required
              />
              <AuthInput
                label="Department"
                type="text"
                placeholder="Department"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                required
              />
            </div>
            <AuthInput
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <AuthInput
              label="Password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        )}

        {/* Social login buttons */}
        <div className="mt-6 space-y-3">
          <Button
            onClick={() => handleOAuthLogin("google")}
            variant="secondary"
            icon={FaGoogle}
            className="w-full"
          >
            Continue with Google
          </Button>
          <Button
            onClick={() => handleOAuthLogin("facebook")}
            variant="secondary"
            icon={FaFacebook}
            className="w-full"
          >
            Continue with Facebook
          </Button>
        </div>
      </AuthCard>
    </div>
  );
};

export default StudentAuth;
