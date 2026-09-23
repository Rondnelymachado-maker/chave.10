import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
const url=process.env.EXPO_PUBLIC_SUPABASE_URL;
const key=process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export const supabase=createClient(url||"https://sglfehaznxlanjpkkjel.supabase.co",key||"",{
  auth:{storage:{getItem:(k)=>SecureStore.getItemAsync(k),setItem:(k,v)=>SecureStore.setItemAsync(k,v),removeItem:(k)=>SecureStore.deleteItemAsync(k)},autoRefreshToken:true,persistSession:true,detectSessionInUrl:false}
});
