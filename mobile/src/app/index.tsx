import { Redirect } from "expo-router";
import { useEffect,useState } from "react";
import { ActivityIndicator,View } from "react-native";
import { supabase } from "@/lib/supabase";
export default function Index(){
 const[ready,setReady]=useState(false);const[session,setSession]=useState(false);
 useEffect(()=>{supabase.auth.getSession().then(({data})=>{setSession(!!data.session);setReady(true)});const{data:l}=supabase.auth.onAuthStateChange((_e,s)=>{setSession(!!s);setReady(true)});return()=>l.subscription.unsubscribe()},[]);
 if(!ready)return <View style={{flex:1,alignItems:"center",justifyContent:"center",backgroundColor:"#172033"}}><ActivityIndicator color="#f59b32"/></View>;
 return session?<Redirect href="/(tabs)"/>:<Redirect href="/login"/>;
}
