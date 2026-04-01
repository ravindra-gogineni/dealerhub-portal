import { jsPDF } from 'jspdf';

// Color palette
const COLORS = {
  primary: [26, 54, 93],       // #1a365d
  accent: [14, 165, 233],      // #0ea5e9
  success: [16, 185, 129],     // #10b981
  warning: [245, 158, 11],     // #f59e0b
  error: [239, 68, 68],        // #ef4444
  text: [15, 23, 42],          // #0f172a
  light: [241, 245, 249],      // #f1f5f9
  border: [226, 232, 240],     // #e2e8f0
  white: [255, 255, 255],
  gray: [100, 116, 139],       // #64748b
};

const setColor = (doc, rgb, type = 'text') => {
  if (type === 'text') doc.setTextColor(...rgb);
  else if (type === 'fill') doc.setFillColor(...rgb);
  else if (type === 'draw') doc.setDrawColor(...rgb);
};

export const generateExecutiveReport = (data = {}) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentW = pageW - margin * 2;
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // ────────────────────────────────────────────
  // PAGE 1: Cover + KPI Summary
  // ────────────────────────────────────────────

  // Header bar
  setColor(doc, COLORS.primary, 'fill');
  doc.rect(0, 0, pageW, 52, 'F');

  // Accent stripe
  setColor(doc, COLORS.accent, 'fill');
  doc.rect(0, 52, pageW, 3, 'F');

  // Logo area
  setColor(doc, COLORS.white, 'text');
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('DEALERHUB', margin, 22);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  setColor(doc, [148, 163, 184], 'text');
  doc.text('AUTOMOTIVE PORTAL', margin, 29);

  // Report title (right side)
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  setColor(doc, COLORS.white, 'text');
  doc.text('Executive Performance Report', pageW - margin, 20, { align: 'right' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  setColor(doc, [148, 163, 184], 'text');
  doc.text(`Generated: ${dateStr} at ${timeStr}`, pageW - margin, 28, { align: 'right' });
  doc.text('Confidential – Internal Use Only', pageW - margin, 34, { align: 'right' });

  // Section: KPI Overview
  let y = 68;
  setColor(doc, COLORS.text, 'text');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('KPI Overview', margin, y);
  y += 4;
  setColor(doc, COLORS.accent, 'fill');
  doc.rect(margin, y, 28, 0.8, 'F');
  y += 8;

  // KPI Cards (2x2 grid)
  const kpis = [
    { label: 'Operational Efficiency', value: '94.2%', trend: '+2.5%', color: COLORS.success, good: true },
    { label: 'F&I Penetration Rate', value: '78.5%', trend: '+5.2%', color: COLORS.accent, good: true },
    { label: 'Avg. Customer Wait', value: '14 min', trend: '-12.4%', color: COLORS.warning, good: true },
    { label: 'CSI Score', value: '96.8 / 100', trend: '+1.1%', color: COLORS.success, good: true },
  ];

  const cardW = (contentW - 8) / 2;
  const cardH = 30;
  kpis.forEach((kpi, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = margin + col * (cardW + 8);
    const cy = y + row * (cardH + 6);

    setColor(doc, COLORS.light, 'fill');
    setColor(doc, COLORS.border, 'draw');
    doc.setLineWidth(0.3);
    doc.roundedRect(cx, cy, cardW, cardH, 3, 3, 'FD');

    // Left accent bar
    setColor(doc, kpi.color, 'fill');
    doc.roundedRect(cx, cy, 3, cardH, 1.5, 1.5, 'F');

    setColor(doc, COLORS.gray, 'text');
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.text(kpi.label.toUpperCase(), cx + 8, cy + 9);

    setColor(doc, COLORS.text, 'text');
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(kpi.value, cx + 8, cy + 20);

    // Trend badge
    setColor(doc, kpi.good ? COLORS.success : COLORS.error, 'fill');
    doc.roundedRect(cx + cardW - 28, cy + 14, 22, 8, 2, 2, 'F');
    setColor(doc, COLORS.white, 'text');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(kpi.trend + ' vs LM', cx + cardW - 17, cy + 19.5, { align: 'center' });
  });

  y += 2 * (cardH + 6) + 12;

  // Section: Weekly Sales Performance Table
  setColor(doc, COLORS.text, 'text');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Weekly Sales Performance', margin, y);
  y += 4;
  setColor(doc, COLORS.accent, 'fill');
  doc.rect(margin, y, 42, 0.8, 'F');
  y += 8;

  const salesData = [
    { day: 'Monday', sales: '$45,200', target: '$40,000', units: 8, status: 'Above' },
    { day: 'Tuesday', sales: '$38,900', target: '$40,000', units: 6, status: 'Below' },
    { day: 'Wednesday', sales: '$52,100', target: '$45,000', units: 10, status: 'Above' },
    { day: 'Thursday', sales: '$41,800', target: '$45,000', units: 7, status: 'Below' },
    { day: 'Friday', sales: '$67,300', target: '$50,000', units: 13, status: 'Above' },
    { day: 'Saturday', sales: '$89,200', target: '$60,000', units: 18, status: 'Above' },
    { day: 'Sunday', sales: '$23,400', target: '$20,000', units: 4, status: 'Above' },
  ];

  const colWidths = [38, 38, 38, 25, 25];
  const headers = ['Day', 'Actual Sales', 'Target', 'Units', 'Status'];

  // Table header
  setColor(doc, COLORS.primary, 'fill');
  doc.rect(margin, y, contentW, 8, 'F');
  setColor(doc, COLORS.white, 'text');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  let cx = margin;
  headers.forEach((h, i) => {
    doc.text(h, cx + 3, y + 5.5);
    cx += colWidths[i];
  });
  y += 8;

  // Table rows
  salesData.forEach((row, idx) => {
    const bg = idx % 2 === 0 ? COLORS.white : [248, 250, 252];
    setColor(doc, bg, 'fill');
    setColor(doc, COLORS.border, 'draw');
    doc.setLineWidth(0.2);
    doc.rect(margin, y, contentW, 7.5, 'FD');

    const isAbove = row.status === 'Above';
    setColor(doc, COLORS.text, 'text');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    cx = margin;
    [row.day, row.sales, row.target, String(row.units)].forEach((val, i) => {
      doc.text(val, cx + 3, y + 5);
      cx += colWidths[i];
    });

    // Status chip
    setColor(doc, isAbove ? [220, 252, 231] : [254, 226, 226], 'fill');
    setColor(doc, isAbove ? COLORS.success : COLORS.error, 'draw');
    doc.setLineWidth(0.4);
    doc.roundedRect(cx + 1, y + 1.5, 18, 4.5, 1.5, 1.5, 'FD');
    setColor(doc, isAbove ? COLORS.success : COLORS.error, 'text');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.text(row.status, cx + 10, y + 4.8, { align: 'center' });
    y += 7.5;
  });

  // Total row
  setColor(doc, COLORS.primary, 'fill');
  doc.rect(margin, y, contentW, 8, 'F');
  setColor(doc, COLORS.white, 'text');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('WEEKLY TOTAL', margin + 3, y + 5.5);
  doc.text('$357,900', margin + 38 + 3, y + 5.5);
  doc.text('$300,000', margin + 76 + 3, y + 5.5);
  doc.text('66', margin + 114 + 3, y + 5.5);
  y += 8;

  // Footer page 1
  y = pageH - 14;
  setColor(doc, COLORS.border, 'fill');
  doc.rect(0, y, pageW, 0.4, 'F');
  setColor(doc, COLORS.gray, 'text');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('DealerHub — Confidential Executive Report', margin, y + 6);
  doc.text('Page 1 of 2', pageW - margin, y + 6, { align: 'right' });

  // ────────────────────────────────────────────
  // PAGE 2: Department + Service + Inventory
  // ────────────────────────────────────────────
  doc.addPage();
  y = 0;

  // Header bar (same as page 1)
  setColor(doc, COLORS.primary, 'fill');
  doc.rect(0, 0, pageW, 28, 'F');
  setColor(doc, COLORS.accent, 'fill');
  doc.rect(0, 28, pageW, 2, 'F');
  setColor(doc, COLORS.white, 'text');
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Executive Performance Report — Continued', margin, 18);
  setColor(doc, [148, 163, 184], 'text');
  doc.setFontSize(8);
  doc.text(dateStr, pageW - margin, 18, { align: 'right' });
  y = 42;

  // Department Automation
  setColor(doc, COLORS.text, 'text');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Department Automation Levels', margin, y);
  y += 4;
  setColor(doc, COLORS.accent, 'fill');
  doc.rect(margin, y, 50, 0.8, 'F');
  y += 10;

  const depts = [
    { name: 'Sales (CRM & Desking)', val: 85, color: COLORS.accent },
    { name: 'Service (Scheduling & RO)', val: 62, color: COLORS.warning },
    { name: 'Parts Inventory Management', val: 94, color: COLORS.success },
    { name: 'F&I Contracting', val: 78, color: COLORS.primary },
  ];

  depts.forEach((dept) => {
    setColor(doc, COLORS.gray, 'text');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(dept.name, margin, y);
    doc.text(`${dept.val}%`, pageW - margin, y, { align: 'right' });
    y += 4;

    // Bar track
    setColor(doc, COLORS.border, 'fill');
    doc.roundedRect(margin, y, contentW, 6, 3, 3, 'F');
    // Bar fill
    setColor(doc, dept.color, 'fill');
    doc.roundedRect(margin, y, contentW * dept.val / 100, 6, 3, 3, 'F');
    y += 11;
  });

  y += 4;

  // CSI Scores Table
  setColor(doc, COLORS.text, 'text');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Customer Satisfaction Index (CSI)', margin, y);
  y += 4;
  setColor(doc, COLORS.accent, 'fill');
  doc.rect(margin, y, 52, 0.8, 'F');
  y += 8;

  const csiData = [
    { dept: 'Sales Department', score: 96, benchmark: 90, rating: 'Excellent' },
    { dept: 'Finance & Insurance', score: 98, benchmark: 90, rating: 'Exceptional' },
    { dept: 'Service Department', score: 92, benchmark: 90, rating: 'Excellent' },
    { dept: 'Overall Dealership', score: 95, benchmark: 90, rating: 'Excellent' },
  ];

  // Header
  setColor(doc, COLORS.primary, 'fill');
  doc.rect(margin, y, contentW, 8, 'F');
  setColor(doc, COLORS.white, 'text');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  ['Department', 'CSI Score', 'Industry Benchmark', 'Rating'].forEach((h, i) => {
    const offsets = [3, 55, 100, 143];
    doc.text(h, margin + offsets[i], y + 5.5);
  });
  y += 8;

  csiData.forEach((row, idx) => {
    const bg = idx % 2 === 0 ? COLORS.white : [248, 250, 252];
    setColor(doc, bg, 'fill');
    setColor(doc, COLORS.border, 'draw');
    doc.setLineWidth(0.2);
    doc.rect(margin, y, contentW, 8, 'FD');
    setColor(doc, COLORS.text, 'text');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);

    doc.text(row.dept, margin + 3, y + 5.2);

    // Score in color
    setColor(doc, row.score >= 95 ? COLORS.success : COLORS.warning, 'text');
    doc.setFont('helvetica', 'bold');
    doc.text(String(row.score), margin + 55 + 3, y + 5.2);

    setColor(doc, COLORS.gray, 'text');
    doc.setFont('helvetica', 'normal');
    doc.text(String(row.benchmark), margin + 100 + 3, y + 5.2);

    // Rating badge
    const isExcellent = row.score >= 95;
    setColor(doc, isExcellent ? [220, 252, 231] : [254, 243, 199], 'fill');
    doc.roundedRect(margin + 143 + 1, y + 1.5, 28, 5, 1.5, 1.5, 'F');
    setColor(doc, isExcellent ? COLORS.success : COLORS.warning, 'text');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.text(row.rating, margin + 143 + 15, y + 4.8, { align: 'center' });
    y += 8;
  });

  y += 10;

  // Top Performers
  setColor(doc, COLORS.text, 'text');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Top Performers This Period', margin, y);
  y += 4;
  setColor(doc, COLORS.accent, 'fill');
  doc.rect(margin, y, 42, 0.8, 'F');
  y += 8;

  const performers = [
    { rank: '🥇', name: 'Sarah Jenkins', dept: 'Sales', units: 24, csi: 98 },
    { rank: '🥈', name: 'David Chen', dept: 'Service', units: 42, csi: 99 },
    { rank: '🥉', name: 'Mike Ross', dept: 'F&I', units: 18, csi: 96 },
    { rank: '  4', name: 'Elena Rodriguez', dept: 'Sales', units: 19, csi: 94 },
  ];

  // Header
  setColor(doc, COLORS.primary, 'fill');
  doc.rect(margin, y, contentW, 8, 'F');
  setColor(doc, COLORS.white, 'text');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  ['Rank', 'Employee', 'Department', 'Units / ROs', 'CSI Score'].forEach((h, i) => {
    const offsets = [3, 18, 70, 115, 148];
    doc.text(h, margin + offsets[i], y + 5.5);
  });
  y += 8;

  performers.forEach((p, idx) => {
    const bg = idx % 2 === 0 ? COLORS.white : [248, 250, 252];
    setColor(doc, bg, 'fill');
    setColor(doc, COLORS.border, 'draw');
    doc.setLineWidth(0.2);
    doc.rect(margin, y, contentW, 8, 'FD');
    setColor(doc, COLORS.text, 'text');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(p.rank, margin + 3, y + 5.2);
    doc.setFont('helvetica', 'bold');
    doc.text(p.name, margin + 18, y + 5.2);
    doc.setFont('helvetica', 'normal');
    setColor(doc, COLORS.gray, 'text');
    doc.text(p.dept, margin + 70, y + 5.2);
    setColor(doc, COLORS.text, 'text');
    doc.text(String(p.units), margin + 115, y + 5.2);
    setColor(doc, p.csi >= 97 ? COLORS.success : COLORS.accent, 'text');
    doc.setFont('helvetica', 'bold');
    doc.text(String(p.csi), margin + 148, y + 5.2);
    y += 8;
  });

  y += 10;

  // Recommendations Box
  setColor(doc, [239, 246, 255], 'fill');
  setColor(doc, COLORS.accent, 'draw');
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentW, 42, 3, 3, 'FD');
  setColor(doc, COLORS.accent, 'fill');
  doc.roundedRect(margin, y, 3, 42, 1.5, 1.5, 'F');

  setColor(doc, COLORS.primary, 'text');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('AI-Powered Recommendations', margin + 8, y + 8);

  const recs = [
    '• Service lane efficiency has improved 12.4% — consider expanding bay capacity before peak season.',
    '• Tuesday and Thursday are below sales targets. Recommend targeted promotions on these days.',
    '• F&I penetration at 78.5% is tracking ahead of industry average (71%). Maintain current menu strategy.',
    '• Parts inventory automation at 94% — flag remaining manual processes for Q2 digitization sprint.',
  ];

  setColor(doc, COLORS.text, 'text');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  recs.forEach((rec, i) => {
    doc.text(rec, margin + 8, y + 16 + i * 6.5, { maxWidth: contentW - 12 });
  });

  // Footer page 2
  y = pageH - 14;
  setColor(doc, COLORS.border, 'fill');
  doc.rect(0, y, pageW, 0.4, 'F');
  setColor(doc, COLORS.gray, 'text');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('DealerHub — Confidential Executive Report', margin, y + 6);
  doc.text('Page 2 of 2', pageW - margin, y + 6, { align: 'right' });

  // Download
  const fileName = `DealerHub_Executive_Report_${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}_${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}.pdf`;
  doc.save(fileName);
};
