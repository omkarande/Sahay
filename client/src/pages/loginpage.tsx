import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.error) {
        setErrorMessage(data.error);
      } else {
        // Store the token for future authenticated requests
        localStorage.setItem("token", data.token);
        // Store user data
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.id,
            name: data.name,
            email: data.email,
            skills: data.skills,
          })
        );
        login(data);
        navigate("/"); // Redirect to Index.tsx after login
      }
    } catch (err) {
      setErrorMessage("Login failed. Please try again.");
      console.error("Error during login:", err);
    }
  };

  // For future authenticated requests, include the token:
  const fetchProtectedData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect to login if no token
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      // Handle the response...
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-16 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome Back!
          </CardTitle>
          <CardDescription>Login to continue</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Mail className="w-4 h-4" /> Email
              </label>
              <Input
                type="email"
                placeholder="you@viit.ac.in"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Lock className="w-4 h-4" /> Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            <Button type="submit" className="w-full">
              Login <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-4 p-2 text-red-700 bg-red-100 rounded-md text-center">
              {errorMessage}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;

//import { AuthContext } from "../context/AuthContext";

// const LoginPage: React.FC = () => {
//     const [formData, setFormData] = useState({ email: "", password: "" });
//     const navigate = useNavigate();
//     const auth = useContext(AuthContext);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         try {
//             const response = await fetch("http://localhost:5000/api/login", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(formData),
//             });

//             const data = await response.json();
//             if (data.error) {
//                 console.error("Login error:", data.error);
//             } else {
//                 auth?.login(data.user, data.token);
//                 navigate("/");
//             }
//         } catch (err) {
//             console.error("Error during login:", err);
//         }
//     };
