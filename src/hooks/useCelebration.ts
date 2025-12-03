import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Celebration {
  id: string;
  slug: string;
  birthday_person_name: string;
  view_password: string;
  admin_password: string;
  main_media_url: string | null;
  main_media_type: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  celebration_id: string;
  sender_name: string;
  message: string;
  media_url: string | null;
  media_type: string | null;
  created_at: string;
}

export const useCelebration = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["celebration", slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from("celebrations")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data as Celebration | null;
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
      return data as Message[];
    },
    enabled: !!celebrationId,
  });
};

export const useCreateCelebration = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      slug: string;
      birthday_person_name: string;
      view_password: string;
      admin_password: string;
    }) => {
      const { data: result, error } = await supabase
        .from("celebrations")
        .insert(data)
        .select()
        .single();
      if (error) throw error;
      return result as Celebration;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["celebration"] });
    },
  });
};

export const useUpdateCelebration = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Celebration> }) => {
      const { data: result, error } = await supabase
        .from("celebrations")
        .update(data)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return result as Celebration;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["celebration"] });
    },
  });
};

export const useAddMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      celebration_id: string;
      sender_name: string;
      message: string;
      media_url?: string;
      media_type?: string;
    }) => {
      const { data: result, error } = await supabase
        .from("messages")
        .insert(data)
        .select()
        .single();
      if (error) throw error;
      return result as Message;
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
