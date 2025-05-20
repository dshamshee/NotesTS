import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { type LoginData } from "@/lib/api";
import { login } from "@/lib/api";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

// type Inputs = {
//   example: string;
//   exampleRequired: string;
// };

export const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm<LoginData>();

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    setIsLoading(true);
    try {
      const response = await login(data);
      if (response) {
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to login",
      });
    } finally {
      setIsLoading(false);
    }
  };

//   console.log(watch("example")); // watch input value by passing the name of it

  return (
    <div className="mainContainer h-screen flex flex-col justify-center items-center">

      <h1 className="text-blue-800 text-2xl font-bold">Welcome to Notify</h1>

      <div className="pageContainer rounded-md w-[40%] h-[400px] mx-auto">

        {/* "handleSubmit" will validate your inputs before invoking "onSubmit"  */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center items-center py-5 px-5 space-y-4"
        >

          <h1 className="text-white text-lg font-semibold">Please Login</h1>

          {/* register your input into the hook by invoking the "register" function */}
          <div className="w-full max-w-[300px] space-y-1">
            <input
              type="email"
              placeholder="Email"
              {...register("email", { 
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

          {/* include validation with required or other standard HTML validation rules */}
          <div className="w-full max-w-[300px] space-y-1">
            <input
              type="password"
              placeholder="Password"
              {...register("password", { 
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

          {/* <input type="submit" className="cursor-pointer text-white p-2 rounded-md mt-5 px-14" /> */}
          <Button
            variant="outline"
            type="submit"
            className="w-[200px] cursor-pointer hover:text-green-800"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>

          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:text-blue-800">
              Sign up here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
