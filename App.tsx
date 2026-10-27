import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { requireOptionalNativeModule } from 'expo-modules-core';
const PG = requireOptionalNativeModule('PlacementGuard');

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [dryRun, setDryRun] = useState(true);
  const [ignoreGroups, setIgnoreGroups] = useState(true);
  const [threshold, setThreshold] = useState('0.85');
  const [cooldown, setCooldown] = useState('24');
  const [model, setModel] = useState('meta/llama-3.3-70b-instruct');
  const [reply, setReply] = useState("Hello! I’m currently unavailable for placement-related queries. Kindly contact another Placement Representative (PR) of your respective branch for assistance. Thank you.");
  const [exclusions, setExclusions] = useState('');
  const [logs, setLogs] = useState('No activity yet.');
  const [access, setAccess] = useState(false);

  const refresh = async () => {
    if (!PG) return;
    const s = await PG.getSettings();
    setApiKey(s.apiKey); setEnabled(s.enabled); setDryRun(s.dryRun); setIgnoreGroups(s.ignoreGroups);
    setThreshold(String(s.threshold)); setCooldown(String(s.cooldownHours));
    setModel(s.model); setReply(s.replyText); setExclusions(s.exclusionsRaw);
    setLogs(await PG.getLogs()); setAccess(await PG.hasNotificationAccess());
  };
  useEffect(() => { refresh(); }, []);

  const save = async () => {
    await PG.saveSettings({ apiKey, enabled, dryRun, ignoreGroups, threshold: Number(threshold) || 0.85, cooldownHours: Number(cooldown) || 24, model, replyText: reply, exclusionsRaw: exclusions });
    Alert.alert('Saved', 'PlacementGuard settings saved.');
    refresh();
  };
  const testNim = async () => {
    try { const r = await PG.testNim(); Alert.alert('NVIDIA NIM', `placement=${r.placementRelated}\nconfidence=${r.confidence}\n${r.reason}`); }
    catch (e:any) { Alert.alert('NIM test failed', String(e?.message || e)); }
  };

  if (!PG) return <SafeAreaView style={styles.center}><Text>Native PlacementGuard module not loaded. Use an EAS development/preview build — not Expo Go.</Text></SafeAreaView>;

  return <SafeAreaView style={styles.root}><StatusBar style="dark"/><ScrollView contentContainerStyle={styles.content}>
    <Text style={styles.title}>PlacementGuard AI</Text>
    <Text style={styles.sub}>AI auto-reply for placement-related WhatsApp messages</Text>
    <View style={styles.card}><Row label="Automation enabled" value={enabled} setValue={setEnabled}/><Row label="Test mode (no sending)" value={dryRun} setValue={setDryRun}/><Row label="Ignore group chats" value={ignoreGroups} setValue={setIgnoreGroups}/></View>
    <View style={styles.card}><Text style={styles.h}>Notification access</Text><Text style={access?styles.ok:styles.bad}>{access?'Granted':'Not granted'}</Text><Button text="Open notification access" onPress={()=>PG.openNotificationAccess()}/></View>
    <Field label="NVIDIA API key (stored only on this phone)" value={apiKey} setValue={setApiKey} secure/><Field label="NVIDIA NIM model" value={model} setValue={setModel}/><Field label="Confidence threshold" value={threshold} setValue={setThreshold} keyboard="decimal-pad"/><Field label="Cooldown hours" value={cooldown} setValue={setCooldown} keyboard="number-pad"/>
    <Field label="Automatic reply" value={reply} setValue={setReply} multiline/><Field label="Excluded contacts (one name/number per line)" value={exclusions} setValue={setExclusions} multiline/>
    <Button text="Save settings" onPress={save}/><Button text="Test NVIDIA NIM" onPress={testNim} secondary/><Button text="Refresh logs" onPress={refresh} secondary/>
    <View style={styles.card}><Text style={styles.h}>Recent activity</Text><Text style={styles.logs}>{logs}</Text></View>
    <Text style={styles.foot}>Use a preview/development APK built by EAS. Expo Go cannot load the required Android notification-listener native module.</Text>
  </ScrollView></SafeAreaView>;
}

function Row({label,value,setValue}:any){return <View style={styles.row}><Text style={styles.label}>{label}</Text><Switch value={value} onValueChange={setValue}/></View>}
function Field({label,value,setValue,multiline,keyboard,secure}:any){return <View style={styles.card}><Text style={styles.h}>{label}</Text><TextInput style={[styles.input,multiline&&styles.multi]} value={value} onChangeText={setValue} multiline={multiline} keyboardType={keyboard} secureTextEntry={secure} autoCapitalize="none"/></View>}
function Button({text,onPress,secondary}:any){return <TouchableOpacity style={[styles.btn,secondary&&styles.btn2]} onPress={onPress}><Text style={[styles.btnText,secondary&&styles.btnText2]}>{text}</Text></TouchableOpacity>}
const styles=StyleSheet.create({root:{flex:1,backgroundColor:'#f6f7f9'},center:{flex:1,alignItems:'center',justifyContent:'center',padding:24},content:{padding:18,paddingBottom:50},title:{fontSize:30,fontWeight:'800'},sub:{fontSize:14,color:'#667085',marginBottom:18},card:{backgroundColor:'white',padding:16,borderRadius:16,marginBottom:12},row:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingVertical:7},label:{fontSize:16,flex:1},h:{fontWeight:'700',fontSize:14,marginBottom:8},input:{borderWidth:1,borderColor:'#d0d5dd',borderRadius:10,padding:12,fontSize:15},multi:{minHeight:92,textAlignVertical:'top'},btn:{backgroundColor:'#101828',padding:15,borderRadius:12,alignItems:'center',marginBottom:10},btn2:{backgroundColor:'white',borderWidth:1,borderColor:'#d0d5dd'},btnText:{color:'white',fontWeight:'700'},btnText2:{color:'#101828'},ok:{color:'#067647',fontWeight:'700',marginBottom:10},bad:{color:'#b42318',fontWeight:'700',marginBottom:10},logs:{fontFamily:'monospace',fontSize:12,color:'#344054'},foot:{fontSize:12,color:'#667085',lineHeight:18,marginTop:8}});
