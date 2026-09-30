import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../../App';
import { styles } from '../styles/AgroPapayaScreens';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation, route }: Props) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isPicking, setIsPicking] = useState(false);

  useEffect(() => {
    const capturedUri = route.params?.imageUri;
    if (capturedUri) {
      setImageUri(capturedUri);
      navigation.setParams({ imageUri: undefined });
    }
  }, [navigation, route.params?.imageUri]);

  const openGallery = async () => {
    setIsPicking(true);
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Acceso a fotos denegado',
          'Permite el acceso a tus fotos para seleccionar una imagen de una hoja.',
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert('No se pudo abrir la galería', 'Inténtalo de nuevo.');
    } finally {
      setIsPicking(false);
    }
  };

  const analyzeImage = () => {
    if (imageUri) {
      navigation.navigate('Result', { imageUri });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.homeContent}>
        <View style={styles.brandRow}>
          <View style={styles.brandMark} accessibilityElementsHidden>
            <Text style={styles.brandMarkText}>A</Text>
          </View>
          <Text style={styles.brandName}>AgroPapaya</Text>
        </View>

        <View style={styles.intro}>
          <Text style={styles.eyebrow}>SALUD DE TUS CULTIVOS</Text>
          <Text style={styles.homeTitle}>Detecta enfermedades en hojas de papaya</Text>
          <Text style={styles.bodyText}>
            Toma o selecciona una fotografía de una hoja para iniciar su análisis.
          </Text>
        </View>

        <View style={styles.photoFrame}>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.previewImage}
              resizeMode="cover"
              accessibilityLabel="Vista previa de la hoja seleccionada para analizar"
            />
          ) : (
            <View style={styles.emptyPreview}>
              <View style={styles.leafMark} accessibilityElementsHidden>
                <Text style={styles.leafMarkText}>+</Text>
              </View>
              <Text style={styles.emptyTitle}>Tu hoja aparecerá aquí</Text>
              <Text style={styles.emptyHint}>Usa una imagen clara y bien iluminada</Text>
            </View>
          )}
        </View>

        <View style={styles.actionGroup}>
          <Pressable
            style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
            onPress={() => navigation.navigate('Camera')}
            accessibilityRole="button"
            accessibilityLabel="Tomar fotografía de una hoja"
            accessibilityHint="Abre la cámara del dispositivo"
          >
            <Text style={styles.primaryButtonText}>Tomar fotografía</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
            onPress={openGallery}
            disabled={isPicking}
            accessibilityRole="button"
            accessibilityLabel="Seleccionar fotografía de la galería"
            accessibilityHint="Abre tus fotos para elegir una imagen de hoja"
          >
            {isPicking ? (
              <ActivityIndicator color={styles.secondaryButtonText.color} />
            ) : (
              <Text style={styles.secondaryButtonText}>Seleccionar de galería</Text>
            )}
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.analyzeButton,
              !imageUri && styles.disabledButton,
              pressed && imageUri && styles.buttonPressed,
            ]}
            onPress={analyzeImage}
            disabled={!imageUri}
            accessibilityRole="button"
            accessibilityLabel="Analizar hoja"
            accessibilityHint={
              imageUri ? 'Muestra el resultado simulado del análisis' : 'Primero selecciona una fotografía'
            }
          >
            <Text style={[styles.primaryButtonText, !imageUri && styles.disabledButtonText]}>
              Analizar hoja
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}