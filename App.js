import React from 'react';
import { View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import createAppbarStyle from './src/utils/createAppBar'
import styles from './src/styles/styles'
import HomePage from './src/pages/home_page'
import BaralhoViewPage from './src/pages/baralho_view_page';
import BaralhoCardsEditPage from './src/pages/baralho_cards_edit_page';
import PraticarPage from './src/pages/praticar_page'
import animationTransitionPage from './src/styles/animation_transition_page';

const Stack = createStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{transitionSpec: {open: animationTransitionPage, close: animationTransitionPage}}}>
        <Stack.Screen name="Home" component={HomePage} options={createAppbarStyle('LFlashCards')}/>
        <Stack.Screen name="BView" component={BaralhoViewPage} options={createAppbarStyle('LFlashCards')}/>
        <Stack.Screen name="BEdit" component={BaralhoCardsEditPage} options={createAppbarStyle('Editando cartas...')}/>
        <Stack.Screen name="Praticar" component={PraticarPage} options={createAppbarStyle('Estudando...')}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}