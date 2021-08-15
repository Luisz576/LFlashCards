import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { NativeBaseProvider } from 'native-base'
import createAppbarStyle from './src/utils/createAppBar'
import HomePage from './src/pages/home_page'
import BaralhoViewPage from './src/pages/baralho_view_page';
import BaralhoCardsEditPage from './src/pages/baralho_cards_edit_page';
import PraticarPage from './src/pages/praticar_page'
import animationTransitionPage from './src/styles/animation_transition_page';
import { getRandomMessage } from './src/utils/messages'
import * as NotificationManager from './src/services/notifications_manager'

const Stack = createStackNavigator()

export default function App() {
  function sendNotification(){
    //Sistema de verificação do momento do dia
    let duration = 1
    const hourNow = (new Date()).getHours()
    if(hourNow > 0 && hourNow < 3) duration = (60 * 60) * 8 + 1 //5h 1s
    else if(hourNow > 3 && hourNow < 6) duration = (60 * 60) * 3.5 + 1 //3.5h 1s
    else if(hourNow > 6 && hourNow < 12) duration = (60 * 60) * 5 + 1 //5h 1s
    else if(hourNow > 17 && hourNow < 20) duration = (60 * 60) * 2.5  + 1 //2.5h 1s
    else if(hourNow > 20 && hourNow < 22) duration = (60 * 60) * 1.5 + 1 //1.5h 1s
    else if(hourNow > 22 && hourNow < 24) duration = (60 * 60) * 8 + 1 //8h 1s
    else duration = (60 * 60) + 1 //1h 1s
    
    //criação da mensagem
    const message = getRandomMessage()
    message.secondsToSend = duration
    message.identifier = "message-study-lflashcards"
    message.repeats = true
    
    //send
    NotificationManager.sendScheduleNotification(message)
  }

  useEffect(() => {
    sendNotification()

    const subscription = NotificationManager.addNotificationReceivedListener(_notification => {
      sendNotification()
    })

    return () => {
      NotificationManager.removeNotificationSubscription(subscription)
      //NotificationManager.cancelAllScheduledNotificationsAsync() //Cancela as mensagens assim que fechar o app
    }
  }, [])
  
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ transitionSpec: { open: animationTransitionPage, close: animationTransitionPage } }}>
          <Stack.Screen name="Home" component={HomePage} options={createAppbarStyle('LFlashCards')}/>
          <Stack.Screen name="BView" component={BaralhoViewPage} options={createAppbarStyle('LFlashCards')}/>
          <Stack.Screen name="BEdit" component={BaralhoCardsEditPage} options={createAppbarStyle('Editando cartas...')}/>
          <Stack.Screen name="Praticar" component={PraticarPage} options={createAppbarStyle('Estudando...')}/>
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}