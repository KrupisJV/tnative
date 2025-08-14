// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import HomeScreen from '../screens/HomeScreen';
// import DetailsScreen from '../screens/DetailsScreen';
// import PlayerScreen from '../screens/PlayerScreen';

// export type RootStackParamList = {
//   Home: undefined;
//   Details: { itemId: string };
//   Player: { streamUrl: string; title: string };
// };

// const Stack = createNativeStackNavigator<RootStackParamList>();

// export default function AppNavigator() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen name="Details" component={DetailsScreen} />
//         <Stack.Screen name="Player" component={PlayerScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
