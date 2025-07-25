"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface UserData {
  id: string;
  full_name: string;
  email: string;
}
const Dashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const supabase = createClient();
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/login"; // Redirect to login if not authenticated
      }
    };

    checkSession();
  }, [supabase]);
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     const { data, error } = await supabase.from("users").select("*").single();
  //     if (error) {
  //       console.error("Error fetching user data:", error.message);
  //     } else {
  //       setUserData(data);
  //     }
  //   };

  //   fetchUserData();
  // }, [supabase]);
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    }
    window.location.href = "/login";
    toast.success("Logged out successfully");
  };
  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <h1 className="text-2xl font-bold text-center p-8">Dashboard</h1>
        <p className="text-center text-lg">Welcome to your dashboard!</p>
        {userData && (
          <div className="text-center mt-4">
            <p className="text-lg">User ID: {userData.id}</p>
            <p className="text-lg">Full Name: {userData.full_name}</p>
            <p className="text-lg">Email: {userData.email}</p>
          </div>
        )}
        <Button
          variant="destructive"
          onClick={handleLogout}
          className="mt-8 mx-auto block"
          size="lg"
        >
          Logout
        </Button>
      </div>
    </>
  );
};

export default Dashboard;
