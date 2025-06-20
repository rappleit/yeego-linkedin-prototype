// @ts-nocheck
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const body = await req.json();
    console.log("Received webhook:", JSON.stringify(body));
    
    // Ignore webhooks with AccountStatus objects
    if (body?.AccountStatus) {
      console.log("Ignoring webhook with AccountStatus object");
      return new Response("Ignoring AccountStatus webhook", { status: 200 });
    }
    
    const status = body?.status;
    const accountId = body?.account_id;
    const supabaseUserId = body?.name;

    console.log("Parsed webhook data:", { status, accountId, supabaseUserId });

    if (!status || !accountId || !supabaseUserId) {
      console.error("Missing required fields:", { status, accountId, supabaseUserId });
      return new Response("Missing required fields", { status: 400 });
    }

    // Only process successful connections
    if (status !== "CREATION_SUCCESS" && status !== "RECONNECTED") {
      console.log("Ignoring webhook with status:", status);
      return new Response("Status not handled", { status: 200 });
    }

    const { data: updatedProfile, error } = await supabase
      .from("profiles")
      .update({
        linkedin_connected: true,
        unipile_id: accountId,
      })
      .eq("id", supabaseUserId)
      .select()
      .single();

    if (error) {
      console.error("Update error:", error);
      return new Response("Failed to update LinkedIn connection", { status: 500 });
    }

    console.log("Successfully updated profile:", updatedProfile);

    // Fetch account details from Unipile to get LinkedIn profile ID
    try {
      const unipileApiKey = Deno.env.get("UNIPILE_API_KEY");
      if (!unipileApiKey) {
        console.error("UNIPILE_API_KEY not found in environment");
        return new Response("Missing Unipile API key", { status: 500 });
      }

      const unipileResponse = await fetch(`https://api14.unipile.com:14496/api/v1/accounts/${accountId}`, {
        headers: {
          "X-API-KEY": unipileApiKey,
          "accept": "application/json",
        },
      });

      if (!unipileResponse.ok) {
        console.error("Failed to fetch account details from Unipile:", unipileResponse.status);
        return new Response("Failed to fetch account details", { status: 500 });
      }

      const accountDetails = await unipileResponse.json();
      console.log("Account details from Unipile:", JSON.stringify(accountDetails));

      const linkedinProfileId = accountDetails?.connection_params?.im?.publicIdentifier;
      
      if (linkedinProfileId) {
        // Update the user's linkedin_profile_id
        const { error: linkedinUpdateError } = await supabase
          .from("profiles")
          .update({
            linkedin_profile_id: linkedinProfileId,
          })
          .eq("id", supabaseUserId);

        if (linkedinUpdateError) {
          console.error("Failed to update LinkedIn profile ID:", linkedinUpdateError);
          return new Response("Failed to update LinkedIn profile ID", { status: 500 });
        }

        console.log("Successfully updated LinkedIn profile ID:", linkedinProfileId);
      } else {
        console.warn("LinkedIn profile ID not found in account details");
      }
    } catch (unipileError) {
      console.error("Error fetching account details from Unipile:", unipileError);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      accountId,
      userId: supabaseUserId 
    }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (err) {
    console.error("Webhook error:", err);
    return new Response("Invalid JSON body", { status: 400 });
  }
});
