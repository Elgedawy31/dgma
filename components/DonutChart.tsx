// DonutChart.tsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { StatusType, ChartDataItem } from '../models/donutChart';
import { TaskColors2 } from '@colors';

export interface DonutChartProps {
  data: ChartDataItem[];
  size?: number;
  strokeWidth?: number;
  centerLabelSize?: number;
  centerSubLabelSize?: number;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  sublabelStyle?: TextStyle;
}



export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 200,
  strokeWidth,
  centerLabelSize,
  centerSubLabelSize,
  style,
  labelStyle,
  sublabelStyle,
}) => {
  const chartConfig = useMemo(() => {
    const calculatedStrokeWidth = strokeWidth || size * 0.2;
    const radius = (size - calculatedStrokeWidth) * 0.5;
    const centerX = size * 0.5;
    const centerY = size * 0.5;
    const circumference = 2 * Math.PI * radius;

    return {
      strokeWidth: calculatedStrokeWidth,
      radius,
      centerX,
      centerY,
      circumference,
    };
  }, [size, strokeWidth]);

  const { segments, inProgressPercentage } = useMemo(() => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let startAngle = 0;

    const calculatedSegments = data.map((item) => {
      const percentage = item.value / total;
      const strokeDasharray = [
        percentage * chartConfig.circumference,
        chartConfig.circumference,
      ];
      const rotation = startAngle * 360;
      startAngle += percentage;

      return {
        ...item,
        strokeDasharray,
        rotation,
        percentage,
      };
    });

    const inProgressItem = data.find((item) => item.status === 'In Progress');
    const progressPercentage = Math.round(
      ((inProgressItem?.value || 0) / total) * 100
    );

    return {
      segments: calculatedSegments,
      inProgressPercentage: progressPercentage,
    };
  }, [data, chartConfig.circumference]);

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G rotation="-90" origin={`${chartConfig.centerX}, ${chartConfig.centerY}`}>
          {segments.map((segment, index) => (
            <Circle
              key={`${segment.status}-${index}`}
              cx={chartConfig.centerX}
              cy={chartConfig.centerY}
              r={chartConfig.radius}
              stroke={TaskColors2[segment.status]}
              strokeWidth={chartConfig.strokeWidth}
              strokeDasharray={segment.strokeDasharray}
              strokeDashoffset={0}
              rotation={segment.rotation}
              origin={`${chartConfig.centerX}, ${chartConfig.centerY}`}
              fill="none"
            />
          ))}
        </G>
      </Svg>
      <View style={styles.centerContent}>
        <Text
          style={[
            styles.percentageText,
            { fontSize: centerLabelSize || size * 0.2 },
            labelStyle,
          ]}
        >
          {inProgressPercentage}%
        </Text>
        <Text
          style={[
            styles.labelText,
            { fontSize: centerSubLabelSize || size * 0.08 },
            sublabelStyle,
          ]}
        >
          inprogress
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  centerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontWeight: 'bold',
    color: '#FFC400',
  },
  labelText: {
    color: '#666',
  },
});

export default DonutChart;