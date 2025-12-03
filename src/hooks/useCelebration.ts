import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Celebration = Tables<"celebrations">;
export type Message = Tables<"messages">;

export const useCelebration = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["celebration", slug],
    queryFn: async () => {
      if (!slug) return null;
      // Only select non-sensitive fields - passwords are validated server-side
      const { data, error } = await supabase
        .from("celebrations")
        .select("id, slug, birthday_person_name, main_media_url, main_media_type, created_at, updated_at")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
};

export const useMessages = (celebrationId: string | undefined) => {
  return useQuery({
    queryKey: ["messages", celebrationId],
    queryFn: async () => {
      if (!celebrationId) return [];
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("celebration_id", celebrationId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!celebrationId,
  });
};

export const useCreateCelebration = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: TablesInsert<"celebrations">) => {
      console.log("Creating celebration with data:", data);
      const { data: result, error } = await supabase
        .from("celebrations")
        .insert(data)
        .select()
        .single();
      if (error) {
        console.error("Error creating celebration:", error);
        throw error;
      }
      console.log("Celebration created:", result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["celebration"] });
    },
  });
};

export const useUpdateCelebration = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TablesUpdate<"celebrations"> }) => {
      const { data: result, error } = await supabase
        .from("celebrations")
        .update(data)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["celebration"] });
    },
  });
};

export const useAddMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: TablesInsert<"messages">) => {
      const { data: result, error } = await supabase
        .from("messages")
        .insert(data)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["messages", variables.celebration_id] });
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("messages")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};
