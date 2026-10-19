/**
 * Navigateur de la section Événements (Stack)
 * Liste → Détail → Formulaire
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EventsStackParamList } from '../types/navigation';
import { EventsListScreen } from '../screens/events/EventsListScreen';
import { EventDetailScreen } from '../screens/events/EventDetailScreen';
import { EventFormScreen } from '../screens/events/EventFormScreen';

const Stack = createNativeStackNavigator<EventsStackParamList>();

export const EventsStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="EventsList" component={EventsListScreen} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
      <Stack.Screen
        name="EventForm"
        component={EventFormScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
};
