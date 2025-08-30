export type RangeKey = 'YTD' | 'MTD' | 'WTD' | 'DAILY' | 'CUSTOM';

export interface MetricPoint {
  date: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface MetricsResponse {
  points: MetricPoint[];
  summary: {
    periodRevenue: number;
    periodExpenses: number;
    periodProfit: number;
    lastYearSamePeriodProfit: number;
  };
}

export type AlertLevel = 'success' | 'warning' | 'info';
export interface Alert {
  level: AlertLevel;
  message: string;
}

export interface ParamProps {
  params: URLSearchParams;
}


export type CustomTooltipPayload = {
  color: string;
  dataKey: keyof MetricPoint; // "revenue" | "expenses" | "profit"
  fill: string;
  hide?: boolean;
  name: string;
  nameKey?: string;
  payload: MetricPoint;
  stroke: string;
  strokeWidth: number;
  type?: string;
  unit?: string;
  value: number;
};
export type CustomTooltipProps = {
  active?: boolean;
  label?: string;
  payload?: CustomTooltipPayload[];
};
