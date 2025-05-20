import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EditIcon, LogOutIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { logout } from "@/lib/api";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <div className="w-full py-4 border-b">
      <div className="mainContainer w-[70%] h-auto mx-auto">
        <div className="flex justify-between items-center px-8">
          <div className="logo text-xl font-bold cursor-pointer" onClick={() => navigate("/")}>
            Notify
          </div>
          {isAuthenticated && (
            <div className="sections">
              <ul className="flex gap-16">
                <a href="/createNote">
                  <Button variant="outline" className="cursor-pointer hover:text-green-500 text-center">
                    New Note
                    <EditIcon className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </ul>
            </div>
          )}
          <div className="profile font-bold flex items-center gap-3">
            <ModeToggle />
            {isAuthenticated && (
              <>
                <Button
                  variant="outline"
                  className="cursor-pointer hover:text-red-500"
                  onClick={handleLogout}
                >
                  Logout
                  <LogOutIcon className="ml-2 h-4 w-4" />
                </Button>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
