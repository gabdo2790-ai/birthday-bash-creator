import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface VerifyPasswordResult {
  valid: boolean;
  celebrationId?: string;
  error?: string;
}

export const useVerifyPassword = () => {
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyPassword = async (
    slug: string,
    password: string,
    type: 'view' | 'admin'
  ): Promise<VerifyPasswordResult> => {
    setIsVerifying(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('verify-password', {
        body: { slug, password, type }
      });

      if (error) {
        console.error("Error verifying password:", error);
        return { valid: false, error: "Failed to verify password" };
      }

      return data as VerifyPasswordResult;
    } catch (error) {
      console.error("Unexpected error:", error);
      return { valid: false, error: "Failed to verify password" };
    } finally {
      setIsVerifying(false);
    }
  };

  return { verifyPassword, isVerifying };
};