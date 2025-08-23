import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Toast from 'react-native-toast-message';

const screenWidth = Dimensions.get('window').width;
 
const horasLabels = ['01:00', '07:00', '13:00', '19:00', '00:00'];

const formatHour12h = (hourString) => {
  const [hour, minute] = hourString.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12} ${period}`;
};

const ConsumptionChart = ({ selectedPeriod, data }) => {
  if (!data || !data.datos) return null;

  console.log("data", data);

  let chartData = {
    labels: [],
    datasets: [{ data: [] }],
    realLabels: [], // 🔹 nuevo arreglo para mantener todas las horas reales
  };

  if (selectedPeriod === 'Hoy') {
    const sortedHoy = [...data.datos].sort((a, b) => {
      const hourA = parseInt(a.hora.split(':')[0], 10);
      const hourB = parseInt(b.hora.split(':')[0], 10);
      return hourA - hourB;
    });

    const consumosPorHora = [];
    const allHourLabels = [];

    for (let i = 1; i < sortedHoy.length; i++) {
      const consumo = sortedHoy[i].lectura - sortedHoy[i - 1].lectura;
      consumosPorHora.push(consumo > 0 ? consumo : 0);
      allHourLabels.push(formatHour12h(sortedHoy[i].hora)); // 🟦 hora real
    }

    const labels = sortedHoy.slice(1).map((item) =>
      horasLabels.includes(item.hora) ? formatHour12h(item.hora) : ''
    );

    chartData.labels = labels;
    chartData.datasets[0].data = consumosPorHora;
    chartData.realLabels = allHourLabels; 
  }

  if (selectedPeriod === 'Bimestral') {
    const sortedMes = [...data.datos].sort((a, b) => a.fecha.localeCompare(b.fecha));
  
    const realLabels = sortedMes.map((item) => item.fecha.slice(8, 10)); 
  
    const labels = sortedMes.map((item) => {
      const dia = item.fecha.slice(8, 10);
      return ['01', '05', '10', '15',  '20', '25', '30'].includes(dia) ? dia : '';
    });
  
    chartData.labels = labels;
    chartData.datasets[0].data = sortedMes.map((item) => item.totalDia);
    chartData.realLabels = realLabels; 
  }
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consumo de agua (m³)</Text>
      <LineChart
        data={chartData}
        width={screenWidth - 32}
        height={260}
        yAxisSuffix=" m³"
        fromZero
        withShadow
        withDots
        withInnerLines={false}
        withVerticalLabels
        withHorizontalLabels
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
          labelColor: () => '#6e6e6e',
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#4A90E2',
          },
        }}
        bezier
        style={styles.chart}
        onDataPointClick={({ value, index }) => {
          const label =
            chartData.realLabels && chartData.realLabels[index]
              ? chartData.realLabels[index]
              : 'Desconocido';

          Toast.show({
            type: 'info',
            text1:
              selectedPeriod === 'Hoy'
                ? `Consumo a las ${label}`
                : `Consumo del día ${label}`,
            text2: `${value} m³`,
            visibilityTime: 2000,
            position: 'bottom',
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    color: '#444',
    marginBottom: 10,
  },
  chart: {
    borderRadius: 12,
  },
});

export default ConsumptionChart;
