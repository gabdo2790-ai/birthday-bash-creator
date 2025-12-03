import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.86.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { slug, password, type } = await req.json();
    
    console.log(`Verifying ${type} password for celebration: ${slug}`);

    // Validate input
    if (!slug || !password || !type) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ valid: false, error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (type !== 'view' && type !== 'admin') {
      console.error("Invalid password type");
      return new Response(
        JSON.stringify({ valid: false, error: "Invalid password type" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role to bypass RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch the celebration with password (server-side only)
    const { data: celebration, error } = await supabase
      .from('celebrations')
      .select('id, view_password, admin_password')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ valid: false, error: "Database error" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!celebration) {
      console.log("Celebration not found");
      return new Response(
        JSON.stringify({ valid: false, error: "Celebration not found" }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Compare passwords server-side
    const storedPassword = type === 'view' ? celebration.view_password : celebration.admin_password;
    const isValid = password === storedPassword;

    console.log(`Password validation result: ${isValid}`);

    return new Response(
      JSON.stringify({ 
        valid: isValid, 
        celebrationId: isValid ? celebration.id : undefined 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ valid: false, error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});