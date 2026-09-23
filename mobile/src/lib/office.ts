import { supabase } from "./supabase";
export async function getOfficeId(){
 const {data:u}=await supabase.auth.getUser();
 if(!u.user) throw new Error("Sessão inválida.");
 const {data:p,error}=await supabase.from("user_profiles").select("office_id").eq("user_id",u.user.id).single();
 if(error||!p?.office_id) throw new Error("Oficina não encontrada.");
 return p.office_id;
}
