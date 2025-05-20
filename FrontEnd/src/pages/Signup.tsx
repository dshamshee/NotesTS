import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { type RegisterData, register } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterData & { confirmPassword: string }>();

  const password = watch("password");

  const onSubmit: SubmitHandler<RegisterData & { confirmPassword: string }> = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      
      if (response?.accessToken) {
        toast({
          title: "Success",
          description: "Account created successfully!",
        });
        navigate("/");
      } else {
        throw new Error("Registration failed - No access token received");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create account",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mainContainer h-screen flex flex-col justify-center items-center">
      <h1 className="text-blue-800 text-2xl font-bold">Welcome to Notify</h1>

      <div className="pageContainer rounded-md w-[40%] h-auto mx-auto">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center items-center py-5 px-5 space-y-4"
        >
          <h1 className="text-lg font-semibold">Create an Account</h1>

          <div className="w-full max-w-[300px] space-y-1">
            <input
              type="text"
              placeholder="Full Name"
              {...registerField("name", { 
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters"
                }
              })}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name.message}</span>
            )}
          </div>

          <div className="w-full max-w-[300px] space-y-1">
            <input
              type="email"
              placeholder="Email"
              {...registerField("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email.message}</span>
            )}
          </div>

          <div className="w-full max-w-[300px] space-y-1">
            <input
              type="password"
              placeholder="Password"
              {...registerField("password", { 
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password.message}</span>
            )}
          </div>

          <div className="w-full max-w-[300px] space-y-1">
            <input
              type="password"
              placeholder="Confirm Password"
              {...registerField("confirmPassword", { 
                required: "Please confirm your password",
                validate: value => value === password || "Passwords do not match"
              })}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>
            )}
          </div>

          <Button
            variant="outline"
            type="submit"
            className="w-[200px] mt-4 cursor-pointer hover:text-green-800"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>

          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-800">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}; 