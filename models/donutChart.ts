import { TextStyle, ViewStyle } from "react-native";

// types.ts
export type StatusType =
  | 'In Review'
  | 'Overdue'
  | 'In Progress'
  | 'Completed'
  | 'Pending'
  | 'To Do'
  | 'Cancelled';

export interface ChartDataItem {
  status: StatusType;
  value: number;
}

export interface StyleProps {
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  sublabelStyle?: TextStyle;
}

export interface ChartConfig {
  strokeWidth: number;
  radius: number;
  centerX: number;
  centerY: number;
  circumference: number;
}

export interface Segment extends ChartDataItem {
  strokeDasharray: number[];
  rotation: number;
  percentage: number;
}