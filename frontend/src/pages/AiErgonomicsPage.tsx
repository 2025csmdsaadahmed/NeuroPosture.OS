import React from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Cpu, BrainCircuit, ShieldCheck } from 'lucide-react';

export const AiErgonomicsPage: React.FC = () => {
  const plannedPipelines = [
    {
      title: 'Real-Time Spine Anomaly Detection',
      input: 'Ultrasonic Distance (V2) & Time-delta',
      output: 'Slouching / Kyphotic risk indicator',
      status: 'Ready for Model Weight Deployment'
    },
    {
      title: 'Ischial Pressure Imbalance Predictor',
      input: '4x FSR Seat Matrix (V9–V12) & Balance Diff (V7)',
      output: 'Pelvic asymmetry & uneven lumbar compression',
      status: 'Awaiting ESP32 Firmware V2 Telemetry'
    },
    {
      title: 'Ergonomic Fatigue & Bio-Stress Engine',
      input: 'Body Temp (V0), Ambient Temp (V4), Humidity (V5), Stress Index (V6)',
      output: 'Predictive micro-break recommendation index',
      status: 'Ready for Telemetry Training Ingestion'
    },
    {
      title: 'Continuous Posture Classification',
      input: 'Multi-sensor temporal feature vector',
      output: 'Comprehensive Ergonomic Risk Score (0–100)',
      status: 'Architecture Defined'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Prominent Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-dark-900/90 via-dark-850 to-dark-900/90 border border-cyan-500/30 backdrop-blur-xl shadow-glass relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-3">
              <BrainCircuit className="w-4 h-4" />
              AI ERGONOMIC ANALYSIS
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white mb-2">
              AI ENGINE: READY FOR INTEGRATION
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              NeuroPosture OS includes architectural hooks for deep learning and anomaly detection models. In strict accordance with the current ESP32 firmware data flow, synthetic AI predictions are not simulated as live until inference models are connected to the pipeline.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-dark-950/70 border border-slate-800 text-center min-w-[200px] shrink-0">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              AI ENGINE STATE
            </div>
            <div className="mt-1 text-lg font-extrabold text-cyan-400 font-mono">
              READY FOR INTEGRATION
            </div>
            <div className="mt-1 text-[11px] text-slate-500">
              Zero Synthetic Hallucinations
            </div>
          </div>
        </div>
      </div>

      {/* Planned AI Multi-Sensor Fusion Pipelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plannedPipelines.map((pipe, index) => (
          <Card key={index}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-100">
                  {pipe.title}
                </h3>
              </div>
              <Badge variant="neutral">{pipe.status}</Badge>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-dark-850/60 border border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                  Input Telemetry:
                </span>
                <span className="font-mono text-cyan-300">{pipe.input}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-dark-850/60 border border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                  Target Output:
                </span>
                <span className="text-slate-200">{pipe.output}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Architecture Transparency Card */}
      <Card>
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-4">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            TRANSPARENCY &amp; FIRMWARE ALIGNMENT POLICY
          </h3>
        </div>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            The project specification explicitly requires that the web application not pretend an AI model is active when the firmware is currently running edge algorithmic thresholding on the ESP32.
          </p>
          <p className="text-slate-400">
            Once trained neural networks (e.g. lightweight TensorFlow Lite / ONNX models for ergonomic classification) are deployed to the backend service, this interface will automatically ingest multi-stream tensors from Distance, 4-quadrant FSR loads, Balance Difference, and Thermal readings.
          </p>
        </div>
      </Card>
    </div>
  );
};
