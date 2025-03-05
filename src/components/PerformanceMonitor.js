import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const MonitorContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  padding: 10px;
  border-radius: 8px;
  color: #fff;
  font-family: monospace;
  font-size: 12px;
  z-index: 1000;
  display: ${props => props.isVisible ? 'block' : 'none'};
`;

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 2px 0;
`;

const PerformanceMonitor = ({ isVisible = false }) => {
  const [metrics, setMetrics] = useState({
    fps: 0,
    memory: 0,
    renderTime: 0,
    cellUpdates: 0
  });

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let frameId;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        setMetrics(prev => ({
          ...prev,
          fps: Math.round(frameCount * 1000 / (currentTime - lastTime)),
          memory: Math.round(performance.memory?.usedJSHeapSize / 1048576) || 0
        }));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      frameId = requestAnimationFrame(measureFPS);
    };

    if (isVisible) {
      frameId = requestAnimationFrame(measureFPS);
    }

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [isVisible]);

  return (
    <MonitorContainer isVisible={isVisible}>
      <MetricRow>
        <span>FPS:</span>
        <span>{metrics.fps}</span>
      </MetricRow>
      <MetricRow>
        <span>Memory:</span>
        <span>{metrics.memory} MB</span>
      </MetricRow>
      <MetricRow>
        <span>Render Time:</span>
        <span>{metrics.renderTime.toFixed(2)} ms</span>
      </MetricRow>
      <MetricRow>
        <span>Cell Updates:</span>
        <span>{metrics.cellUpdates}/s</span>
      </MetricRow>
    </MonitorContainer>
  );
};

export default PerformanceMonitor; 