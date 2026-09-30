import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../../App';
import { styles } from '../styles/AgroPapayaScreens';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

// Datos de demostración: reemplazar por la respuesta del backend/modelo de IA.
const simulatedResult = {
  disease: 'Mancha anular',
  confidence: 92,
  description: 'Posible presencia de una enfermedad foliar en la hoja analizada.',
  recommendations: [
    'Retira las hojas que presenten manchas muy extendidas.',
    'Evita mojar el follaje durante el riego.',
    'Consulta a un especialista antes de aplicar un tratamiento.',
  ],
};

export default function ResultScreen({ navigation, route }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.resultContent}>
        <Text style={styles.eyebrow}>AGROPAPAYA · ANÁLISIS</Text>
        <Text style={styles.resultTitle}>Resultado del análisis</Text>
        <Image
          source={{ uri: route.params.imageUri }}
          style={styles.resultImage}
          resizeMode="cover"
          accessibilityLabel="Fotografía de la hoja analizada"
        />

        <View style={styles.resultHeadingRow}>
          <View style={styles.resultDiseaseGroup}>
            <Text style={styles.resultLabel}>ENFERMEDAD DETECTADA</Text>
            <Text style={styles.diseaseName}>{simulatedResult.disease}</Text>
          </View>
          <View style={styles.confidenceBadge}>
            <Text style={styles.confidenceValue}>{simulatedResult.confidence}%</Text>
            <Text style={styles.confidenceLabel}>confianza</Text>
          </View>
        </View>

        <View style={styles.resultSection}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.resultBody}>{simulatedResult.description}</Text>
        </View>

        <View style={styles.resultSection}>
          <Text style={styles.sectionTitle}>Recomendaciones básicas</Text>
          {simulatedResult.recommendations.map((recommendation, index) => (
            <View style={styles.recommendationRow} key={recommendation}>
              <Text style={styles.recommendationNumber}>{index + 1}</Text>
              <Text style={styles.resultBody}>{recommendation}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.simulationNote}>
          Resultado de demostración. No sustituye la evaluación de un especialista.
        </Text>

        <Pressable
          style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
          onPress={() => navigation.popToTop()}
          accessibilityRole="button"
          accessibilityLabel="Analizar otra hoja"
          accessibilityHint="Regresa a Inicio para elegir otra fotografía"
        >
          <Text style={styles.primaryButtonText}>Analizar otra hoja</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}