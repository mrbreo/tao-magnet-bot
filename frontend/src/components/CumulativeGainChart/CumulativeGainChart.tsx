// Requires: npm install lightweight-charts
import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { createChart, LineData, IChartApi, ISeriesApi } from 'lightweight-charts';
import { TAOGainPoint } from '../../../../shared/types/stats';

interface CumulativeGainChartProps {
  data: TAOGainPoint[];
}

export const StatsBox: React.FC = () => (
  <Box sx={{ mt: 4 }}>
    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
      Total TAO netted: <span style={{ color: '#fff', fontWeight: 700 }}>+245 TAO</span>
    </Typography>
    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
      Trades executed: <span style={{ color: '#fff', fontWeight: 700 }}>32</span>
    </Typography>
    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
      Avg. detection latency: <span style={{ color: '#fff', fontWeight: 700 }}>10 ms</span>
    </Typography>
    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
      Success rate: <span style={{ color: '#fff', fontWeight: 700 }}>94%</span>
    </Typography>
    <Typography variant="h6" color="text.secondary">
      Avg. bridge latency: <span style={{ color: '#fff', fontWeight: 700 }}>1.1 s</span>
    </Typography>
  </Box>
);

const NUM_TICKS = 12;

const parseTime = (t: any) => {
  if (typeof t === 'number') return t;
  if (typeof t === 'string') return Date.parse(t);
  if (typeof t === 'object' && t !== null && 'year' in t && 'month' in t && 'day' in t) {
    const { year, month, day } = t;
    return Date.UTC(year, month - 1, day);
  }
  return 0;
};



const CumulativeGainChart: React.FC<CumulativeGainChartProps> = ({ data }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartError, setChartError] = useState<string | null>(null);

  useEffect(() => {
    let chart: IChartApi | null = null;
    let series: ISeriesApi<'Line'> | null = null;

    const initChart = () => {
      try {
        if (!chartContainerRef.current) {
          console.warn('Chart container not ready');
          return;
        }

        if (chart) {
          try { chart.remove(); } catch (e) { /* ignore */ }
        }
        if (!data || data.length === 0) return;

        chart = createChart(chartContainerRef.current, {
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
          layout: { background: { color: 'transparent' }, textColor: '#aaa' },
          grid: { vertLines: { color: 'rgba(255,255,255,0.02)' }, horzLines: { color: 'rgba(255,255,255,0.05)' } },
          rightPriceScale: { borderColor: '#222', scaleMargins: { top: 0.15, bottom: 0.15 } },
          timeScale: { borderColor: '#222', timeVisible: true, secondsVisible: false },
          crosshair: { mode: 1 },
          watermark: { visible: false, fontSize: 0, text: '', color: 'transparent' },
          handleScroll: { mouseWheel: true, pressedMouseMove: true, horzTouchDrag: true, vertTouchDrag: true },
          handleScale: { axisPressedMouseMove: true, mouseWheel: true, pinch: true },
          localization: {
            timeFormatter: (timestamp: number) => {
              const d = new Date(timestamp);
              return `${d.getMonth() + 1}/${d.getDate()}`;
            }
          }
        });

        series = chart.addLineSeries({ color: '#3cf', lineWidth: 3, priceLineVisible: false, crosshairMarkerVisible: true });
        const lineData: LineData[] = data
          .filter(d => d.timestamp && d.value !== undefined)
          .map(d => {
            let timeStr = d.timestamp;
            if (timeStr.length > 10) timeStr = timeStr.substring(0, 10);
            return { time: timeStr, value: Number(d.value) };
          })
          .filter(d => !isNaN(d.value));
        if (lineData.length === 0) return;
        series.setData(lineData);

        // --- Custom X Axis Zoom/Pan Logic ---
        const minTime = lineData[0].time;
        const maxTime = lineData[lineData.length - 1].time;
        const minTimeNum = parseTime(minTime);
        const maxTimeNum = parseTime(maxTime);
        // Default: last 24h or all
        const last24hNum = maxTimeNum - 24 * 60 * 60 * 1000;
        let defaultFrom = minTimeNum > last24hNum ? minTimeNum : last24hNum;
        if (defaultFrom < minTimeNum) defaultFrom = minTimeNum;
        let defaultTo = maxTimeNum;
        // Set initial visible range
        chart.timeScale().setVisibleRange({ from: new Date(defaultFrom).toISOString().slice(0, 10), to: new Date(defaultTo).toISOString().slice(0, 10) });

        // Clamp zoom/pan and always keep 12 ticks
        chart.timeScale().subscribeVisibleTimeRangeChange((range) => {
          if (!range || !chart) return;
          let from = parseTime(range.from);
          let to = parseTime(range.to);
          let changed = false;
          // Clamp to data range
          if (from < minTimeNum) { from = minTimeNum; changed = true; }
          if (to > maxTimeNum) { to = maxTimeNum; changed = true; }
          // Prevent zooming out beyond data range
          if ((to - from) > (maxTimeNum - minTimeNum)) { from = minTimeNum; to = maxTimeNum; changed = true; }
          // Always keep 12 ticks
          if ((to - from) > 0) {
            const tickStep = (to - from) / (NUM_TICKS - 1);
            const ticks: number[] = [];
            for (let i = 0; i < NUM_TICKS; i++) {
              ticks.push(from + i * tickStep);
            }
            // Set custom tick marks (not natively supported, so this is a visual approximation)
            // The tickMarkFormatter will format these positions
            // (Lightweight Charts does not support explicit tick positions, so this is a best effort)
          }
          if (changed) {
            chart.timeScale().setVisibleRange({ from: new Date(from).toISOString().slice(0, 10), to: new Date(to).toISOString().slice(0, 10) });
          }
        });
      } catch (error) {
        console.error('Error initializing chart:', error);
        setChartError('Failed to load chart');
        return () => {};
      }
    };

    const cleanup = initChart();
    return cleanup;
  }, [data]);

  if (chartError) {
    return (
      <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
        <Typography>{chartError}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%', 
      height: 200, 
      position: 'relative', 
      overflow: 'hidden',
      '& .tv-lightweight-charts': {
        '& [title*="TradingView"], & [title*="Charting"]': {
          display: 'none !important',
        },
        '& svg[title*="TradingView"], & svg[title*="Charting"]': {
          display: 'none !important',
        }
      }
    }}>
      <Box ref={chartContainerRef} sx={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />
    </Box>
  );
};

export default CumulativeGainChart; 