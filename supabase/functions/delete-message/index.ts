import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const { messageId, slug, adminPassword } = await req.json();

    // Validate input
    if (!messageId || typeof messageId !== 'string') {
      console.error("Missing or invalid messageId");
      return new Response(
        JSON.stringify({ error: "Message ID is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!slug || typeof slug !== 'string') {
      console.error("Missing or invalid slug");
      return new Response(
        JSON.stringify({ error: "Celebration slug is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!adminPassword || typeof adminPassword !== 'string') {
      console.error("Missing or invalid adminPassword");
      return new Response(
        JSON.stringify({ error: "Admin password is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch the celebration to verify admin password
    const { data: celebration, error: celebrationError } = await supabase
      .from('celebrations')
      .select('id, admin_password')
      .eq('slug', slug)
      .single();

    if (celebrationError || !celebration) {
      console.error("Celebration not found:", celebrationError);
      return new Response(
        JSON.stringify({ error: "Celebration not found" }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify admin password
    if (celebration.admin_password !== adminPassword) {
      console.error("Invalid admin password for slug:", slug);
      return new Response(
        JSON.stringify({ valid: false, error: "Invalid admin password" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the message belongs to this celebration
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .select('id, celebration_id')
      .eq('id', messageId)
      .single();

    if (messageError || !message) {
      console.error("Message not found:", messageError);
      return new Response(
        JSON.stringify({ error: "Message not found" }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (message.celebration_id !== celebration.id) {
      console.error("Message does not belong to this celebration");
      return new Response(
        JSON.stringify({ error: "Message does not belong to this celebration" }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Delete the message
    const { error: deleteError } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (deleteError) {
      console.error("Error deleting message:", deleteError);
      return new Response(
        JSON.stringify({ error: "Failed to delete message" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Message deleted successfully:", messageId);
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Unexpected error in delete-message:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
