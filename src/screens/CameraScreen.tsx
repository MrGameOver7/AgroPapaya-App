import { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../../App';
import { styles } from '../styles/AgroPapayaScreens';

type Props = NativeStackScreenProps<RootStackParamList, 'Camera'>;

export default function CameraScreen({ navigation }: Props) {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const takePhoto = async () => {
    if (!cameraReady || !cameraRef.current || isCapturing) return;

    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
      if (photo?.uri) {
        navigation.navigate('Home', { imageUri: photo.uri });
      }
    } catch {
      Alert.alert('No se pudo tomar la fotografía', 'Inténtalo de nuevo.');
    } finally {
      setIsCapturing(false);
    }
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.permissionScreen}>
        <ActivityIndicator size="large" color={styles.permissionAccent.color} />
        <Text style={styles.permissionText}>Comprobando el permiso de cámara...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionScreen}>
        <Text style={styles.permissionTitle}>Se necesita acceso a la cámara</Text>
        <Text style={styles.permissionText}>
          AgroPapaya usa la cámara únicamente para fotografiar la hoja que quieres analizar.
        </Text>
        {permission.canAskAgain ? (
          <Pressable
            style={styles.primaryButton}
            onPress={requestPermission}
            accessibilityRole="button"
            accessibilityLabel="Permitir acceso a la cámara"
            accessibilityHint="Solicita permiso para abrir la cámara"
          >
            <Text style={styles.primaryButtonText}>Permitir cámara</Text>
          </Pressable>
        ) : (
          <Text style={styles.permissionText}>
            El permiso fue rechazado. Actívalo desde los ajustes del dispositivo para continuar.
          </Text>
        )}
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Volver a Inicio"
        >
          <Text style={styles.backButtonText}>Volver a Inicio</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.cameraScreen}>
      <View style={styles.cameraHeader}>
        <Pressable
          style={styles.cameraBackButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Volver a Inicio"
        >
          <Text style={styles.cameraBackText}>Volver</Text>
        </Pressable>
        <Text style={styles.cameraHeading}>Fotografía de hoja</Text>
        <View style={styles.cameraHeaderSpacer} />
      </View>
      <CameraView
        ref={cameraRef}
        style={styles.cameraPreview}
        facing="back"
        onCameraReady={() => setCameraReady(true)}
        onMountError={() => Alert.alert('Cámara no disponible', 'Comprueba los permisos del dispositivo.')}
        accessibilityLabel="Vista de cámara para fotografiar una hoja"
      />
      <View style={styles.cameraControls}>
        <Text style={styles.cameraTip}>Centra la hoja y procura que tenga buena luz.</Text>
        <Pressable
          style={({ pressed }) => [styles.shutterButton, pressed && styles.buttonPressed]}
          onPress={takePhoto}
          disabled={!cameraReady || isCapturing}
          accessibilityRole="button"
          accessibilityLabel="Capturar fotografía"
          accessibilityHint="Toma una fotografía y la muestra en Inicio"
        >
          {isCapturing ? (
            <ActivityIndicator color={styles.shutterIndicator.color} />
          ) : (
            <View style={styles.shutterInner} />
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}