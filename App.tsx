import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CameraScreen from './src/screens/CamaraScreen';
import HomeScreen from './src/screens/InicioScreen';
import LoadingScreen from './src/screens/CragandoScreen';
import ResultScreen from './src/screens/ResultoScreen';
import TreatmentScreen from './src/screens/TratamientoScreen';

export type RootStackParamList = {
  Home: { imageUri?: string } | undefined;
  Camera: undefined;
  Loading: { imageUri: string };
  Result: { imageUri: string };
  Treatment: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="Treatment" component={TreatmentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}