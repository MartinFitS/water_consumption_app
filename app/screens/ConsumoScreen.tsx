import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
} from 'react-native';
import HeaderSection from '../../components/HeaderSection';
import PeriodSelector from '../../components/PeriodSelector';
import ConsumptionChart from '../../components/ConsumptionChart';
import DetailsSection from '../../components/DetailsSection';
import { Picker, PickerValue } from 'react-native-ui-lib';
import mockData from "@/assets/mockData.json";
import { useFocusEffect } from '@react-navigation/native';

const ConsumoScreen = () => {
  const { tarifas: tarifasDisponibles } = mockData;

  const [selectedPeriod, setSelectedPeriod] = useState<'Hoy' | 'Bimestral'>('Hoy');
  const [selectedTarifa, setSelectedTarifa] = useState(
    tarifasDisponibles.length ? tarifasDisponibles[0].code : "DA"
  );

  const [datosHoy, setDatosHoy] = useState<any>(null); 
  const [datosMes, setDatosMes] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchConsumos = async () => {
    try {
      setLoading(true);

      const hoy = new Date();
      const fecha_hoy = hoy.toLocaleDateString('sv-SE'); 
      const mes = hoy.getMonth() + 1;
      const anio = hoy.getFullYear();


      const [resHoy, resMes] = await Promise.all([
        fetch('https://api-tesis-7k22.onrender.com/consumo/hoy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fecha: fecha_hoy }),
        }),
        fetch('https://api-tesis-7k22.onrender.com/consumo/mes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mes, anio }),
        }),
      ]);

      const [dataHoy, dataMes] = await Promise.all([
        resHoy.json(),
        resMes.json(),
      ]);

      setDatosHoy(dataHoy);
      setDatosMes(dataMes);
    } catch (error) {
      console.error('Error al obtener datos de consumo:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchConsumos(); // Al entrar

      const intervalId = setInterval(fetchConsumos, 180000); 

      return () => clearInterval(intervalId); 
    }, [])
  );

  return (
    <View style={styles.wrapper}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#1D61E7" />
          <Text style={styles.loaderText}>Cargando datos más recientes...</Text>
        </View>
      ) : (
        <ScrollView style={styles.container}>
          <HeaderSection
            tipoFactura={selectedPeriod}
          />

          <PeriodSelector
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />

          <ConsumptionChart
            selectedPeriod={selectedPeriod}
            data={selectedPeriod === 'Hoy' ? datosHoy : datosMes?.datos}
          />

          <Picker
            placeholder="Selecciona una tarifa"
            value={selectedTarifa}
            onChange={setSelectedTarifa as (value: PickerValue) => void}
            topBarProps={{ title: "Selecciona una tarifa" }}
            style={styles.picker}
          >
            {tarifasDisponibles.map((t, i) => (
              <Picker.Item key={i} value={t.code} label={t.label} />
            ))}
          </Picker>

          <DetailsSection
            selectedTarifa={selectedTarifa}
            selectedPeriod={selectedPeriod}
            data={datosMes}
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  picker: {
    marginLeft: 12,
    marginBottom: 20,
    borderColor: '#BCC1CA',
    borderWidth: 1,
    width: '40%',
    height: 40,
    borderRadius: 10,
    padding: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loaderText: {
    marginTop: 16,
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});

export default ConsumoScreen;
