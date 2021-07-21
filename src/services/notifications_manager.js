import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const EXPO_URL = 'https://exp.host/--/api/v2/push/send'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

export async function sendPushNotification(expoPushToken, message={title: '', subtitle: '', body: '', data: {}, sound: 'default'}){
  const messageToSend = {
    to: expoPushToken,
    sound: message.sound ? message.sound : 'default',
    title: message.title ? message.title : '',
    subtitle: message.subtitle ? message.subtitle : '',
    body: message.body ? message.body : '',
    data: message.data ? message.data : {},
  };
  await fetch(EXPO_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messageToSend),
  })
}

export async function sendScheduleNotification(message={identifier: '', title: '', subtitle: '', body: '', sound: 'default', data: {}, secondsToSend: 1, repeats: false, channelId: ''}){
  const messageScheduled = {
    content: {
      sound: message.sound ? message.sound : 'default',
      title: message.title ? message.title : '',
      subtitle: message.subtitle ? message.subtitle : '',
      body: message.body ? message.body : '',
      data: message.data ? message.data : {},
    },
    trigger: { seconds: message.secondsToSend > 0 ? message.secondsToSend : 1, repeats: message.repeats, channelId: message.channelId ? message.channelId : ''}
  }
  if(message.identifier) messageScheduled.identifier = message.identifier
  return await Notifications.scheduleNotificationAsync(messageScheduled);
}

export function setNotificationChannelAsync(channelId='', channel={name: '', importance: Notifications.AndroidImportance.MAX, vibrationPattern: [0, 250, 250, 250], lightColor: '#FF231F7C', sound: 'default'}){
  if(channelId){
    if(!channel.name) channel.name = channelId
    if(!channel.importance) channel.importance = Notifications.AndroidImportance.MAX
    if(!channel.lightColor) channel.lightColor = [0, 250, 250, 250]
    if(!channel.lightColor) channel.lightColor = '#FF231F7C'
    return Notifications.setNotificationChannelAsync(channelId, channel)
  }
  return undefined
}

export function setNotificationHandler(handler={handleNotification: async ()=>({shouldShowAlert: true, shouldPlaySound: false, shouldSetBadge: false,})}){
  Notifications.setNotificationHandler(handler)
}

export function deleteNotificationChannelAsync(channelId=''){
  return Notifications.deleteNotificationChannelAsync(channelId)
}

export function addNotificationReceivedListener(listener=(notification)=>console.log(notification)){
  return Notifications.addNotificationReceivedListener(listener)
}

export function addNotificationResponseReceivedListener(listener=(response)=>console.log(response)){
  return Notifications.addNotificationResponseReceivedListener(listener)
}

export function removeNotificationSubscription(subscribedListener){
  Notifications.removeNotificationSubscription(subscribedListener)
}

export function removeToken(subscription){
  Notifications.removePushTokenSubscription(subscription)
}

export function dismissAllNotificationsAsync(){
  return Notifications.dismissAllNotificationsAsync()
}

export function dismissNotificationAsync(notificationIdentifier=''){
  return Notifications.dismissNotificationAsync(notificationIdentifier)
}

export function cancelScheduledNotificationAsync(identifier=''){
  return Notifications.cancelScheduledNotificationAsync(identifier)
}

export function cancelAllScheduledNotificationsAsync(){
  return Notifications.cancelAllScheduledNotificationsAsync()
}

export async function registerDeviceForPushNotification(){
  let token
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Falha ao carregar Token!');
      return;
    }
    token = (await Notifications.getDevicePushTokenAsync()).data
  }else alert('Para pegar o Token este App deve estar rodando em um dispositivo físico!');
  if (Platform.OS === 'android')
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  return token
}

export async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Falha ao carregar Token!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  }else alert('Para pegar o Token este App deve estar rodando em um dispositivo físico!');
  if (Platform.OS === 'android')
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  return token;
}