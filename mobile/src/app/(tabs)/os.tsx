import { StyleSheet,Text,View } from "react-native";
export default function OS(){return <View style={s.screen}><Text style={s.title}>Ordens de serviço</Text><Text style={s.text}>Próxima etapa: trazer o fluxo completo de OS, estoque e financeiro do Chave 10 web.</Text></View>}
const s=StyleSheet.create({screen:{flex:1,backgroundColor:"#f5f7fa",padding:20},title:{fontSize:26,fontWeight:"800",color:"#172033",marginBottom:12},text:{fontSize:16,color:"#687386",lineHeight:24}});
