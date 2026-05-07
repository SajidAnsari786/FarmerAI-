import React, { useEffect, useState } from 'react';
import SoilHealthCard from './SoilHealthCard';
import YieldCard from './YieldCard';
import CropCard from './CropCard';
import PestRiskCard from './PestRiskCard';
import FertilizerCard from './FertilizerCard';
import CalendarCard from './CalendarCard';
import { jsPDF } from 'jspdf';

const API = 'http://localhost:8000';
const RANK_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#06b6d4'];
const RANK_LABELS = ['🥇 Best Pick', '🥈 2nd Choice', '🥉 3rd Choice', '4th', '5th'];

function generatePDF(reportData) {
  const doc = new jsPDF();
  let y = 10;
  doc.setFontSize(16);
  doc.text('Farmer AI Recommendations', 105, y, { align: 'center' });
  y += 12;
  doc.setFontSize(12);
  doc.text('Top Crop Recommendations:', 10, y);
  y += 8;
  reportData.recommendations.forEach((rec, i) => {
 doc.text(`${i + 1}. ${rec.crop} – Confidence: ${rec.confidence}%`, 12, y);
    y += 6;
  });
  y += 4;
  if (reportData.pestData) {
    doc.text('Pest & Disease Risk:', 10, y);
    y += 8;
    doc.text(`Alert: ${reportData.pestData.alert}`, 12, y);
    y += 6;
    reportData.pestData.pests?.forEach(p => {
      doc.text(`- ${p.pest}: ${p.risk_percent}% risk`, 12, y);
      y += 5;
    });
    y += 4;
  }
  if (reportData.fertData) {
    doc.text('Fertilizer Prescription:', 10, y);
    y += 8;
    const f = reportData.fertData.fertilizer_qty;
    doc.text(`Urea: ${f?.urea_kg ?? '-'} kg`, 12, y);
    y += 5;
    doc.text(`DAP: ${f?.dap_kg ?? '-'} kg`, 12, y);
    y += 5;
    doc.text(`MOP: ${f?.mop_kg ?? '-'} kg`, 12, y);
    y += 8;
  }
  if (reportData.calData) {
    doc.text('Crop Calendar Highlights:', 10, y);
    y += 8;
    const cal = reportData.calData.calendar || {};
    doc.text(`Sowing: ${cal.sow || '-'}`, 12, y);
    y += 5;
    doc.text(`Harvest: ${cal.harvest || '-'}`, 12, y);
    y += 8;
  }
  if (reportData.soil_advice?.length) {
    doc.text('Soil Improvement Tips:', 10, y);
    y += 8;
    reportData.soil_advice.forEach(tip => {
      doc.text(`- ${tip}`, 12, y);
      y += 5;
    });
  }
  doc.save('farmer_ai_report.pdf');
}

export default function ResultsPanel({ results, yieldData, soilHealth, onBack }) {
  const [selectedCrop, setSelectedCrop] = useState(0);
  const [pestData, setPestData] = useState(null);
  const [fertData, setFertData] = useState(null);
  const [calData, setCalData] = useState(null);
  const recs = results?.recommendations || [];
  const topCrop = recs[0]?.crop;
  const inputData = results?.input;

  useEffect(() => {
    if (!topCrop || !inputData) return;
    const body = JSON.stringify({ ...inputData, crop: topCrop });
    const headers = { 'Content-Type': 'application/json' };
    fetch(`${API}/pest-risk`, { method: 'POST', headers, body })
      .then(r => (r.ok ? r.json() : null))
      .then(setPestData)
      .catch(() => {});
    fetch(`${API}/fertilizer-calc`, { method: 'POST', headers, body })
      .then(r => (r.ok ? r.json() : null))
      .then(setFertData)
      .catch(() => {});
    fetch(`${API}/crop-calendar?crop=${encodeURIComponent(topCrop)}`)
      .then(r => (r.ok ? r.json() : null))
      .then(setCalData)
      .catch(() => {});
  }, [topCrop, inputData]);

  const handleDownload = () => {
    const report = {
      recommendations: recs,
      pestData,
      fertData,
      calData,
      soil_advice: results?.soil_advice,
    };
    generatePDF(report);
  };

  const handleShare = () => {
    const text = `🌾 Farmer AI Recommendations for ${topCrop}\n` +
      recs.map(r => `${r.crop}: ${r.confidence}%`).join('\n') +
      (pestData ? `\n⚠️ Pest Alert: ${pestData.alert}` : '') +
      (fertData ? `\n🔧 Fertilizer: Urea ${fertData.fertilizer_qty?.urea_kg}kg, DAP ${fertData.fertilizer_qty?.dap_kg}kg` : '');
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="anim-fade" style={{ paddingTop: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button onClick={onBack} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>← Back</button>
        <button onClick={handleDownload} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>📥 Download Report</button>
        <button onClick={handleShare} className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>📤 Share via WhatsApp</button>
        <div>
          <h2 className="heading-lg">🎯 AI Recommendations</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Complete analysis with pest risks, fertilizer plan & crop calendar</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        {/* Top 5 crops */}
        <div className="glass" style={{ padding: '1.75rem' }}>
          <div style={{ marginBottom: '1rem' }}><span className="badge badge-green">TOP {recs.length} RECOMMENDATIONS</span></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.875rem' }}>
            {recs.map((rec, i) => (
              <CropCard key={rec.crop} rec={rec} rank={i} selected={selectedCrop === i} onClick={() => setSelectedCrop(i)} />
            ))}
          </div>
        </div>

        {/* Soil + Yield row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <SoilHealthCard soilHealth={soilHealth} />
          <YieldCard yieldData={yieldData} />
        </div>

        {/* Practical insights row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <PestRiskCard pestData={pestData} />
          <FertilizerCard fertData={fertData} />
        </div>

        {/* Calendar */}
        <CalendarCard calData={calData} />

        {/* Soil advice */}
        {results?.soil_advice?.length > 0 && (
          <div className="glass" style={{ padding: '1.75rem' }}>
            <h3 className="heading-md" style={{ marginBottom: '1rem' }}>🧪 Soil Improvement Advice</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
              {results.soil_advice.map((tip, i) => (
                <div key={i} style={{ padding: '0.875rem 1rem', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                  🌱 {tip}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
