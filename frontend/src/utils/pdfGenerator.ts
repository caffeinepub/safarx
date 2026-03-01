import type { GeneratedItinerary } from '@/utils/itineraryGenerator';

/**
 * Generates and downloads a formatted PDF of the travel itinerary
 * using the browser's built-in print-to-PDF functionality.
 */
export function downloadItineraryPDF(itinerary: GeneratedItinerary): void {
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
        alert('Please allow pop-ups to download the PDF.');
        return;
    }

    const timeColors: Record<string, { bg: string; text: string; border: string }> = {
        Morning: { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA' },
        Afternoon: { bg: '#FFF1EE', text: '#C2410C', border: '#FECACA' },
        Evening: { bg: '#F0FDFA', text: '#0F766E', border: '#99F6E4' },
    };

    const timeEmojis: Record<string, string> = {
        Morning: '🌅',
        Afternoon: '☀️',
        Evening: '🌙',
    };

    const daysHTML = itinerary.days.map((day) => {
        const activitiesHTML = day.activities.map((activity) => {
            const colors = timeColors[activity.time] || timeColors.Morning;
            const emoji = timeEmojis[activity.time] || '⏰';
            return `
        <div style="display:flex;gap:12px;margin-bottom:16px;">
          <div style="flex-shrink:0;width:32px;height:32px;border-radius:50%;background:${colors.bg};border:1px solid ${colors.border};display:flex;align-items:center;justify-content:center;font-size:14px;margin-top:2px;">
            ${emoji}
          </div>
          <div style="flex:1;">
            <div style="margin-bottom:4px;">
              <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;padding:2px 8px;border-radius:20px;background:${colors.bg};border:1px solid ${colors.border};color:${colors.text};">
                ${activity.time}
              </span>
              <span style="margin-left:6px;font-size:14px;">${activity.icon}</span>
            </div>
            <div style="font-weight:700;font-size:14px;color:#1C0A00;margin-bottom:4px;font-family:'Georgia',serif;">${activity.title}</div>
            <div style="font-size:12px;color:#6B4226;line-height:1.6;">${activity.description}</div>
          </div>
        </div>`;
        }).join('');

        return `
      <div style="margin-bottom:20px;border:1px solid #E8D5C4;border-radius:12px;overflow:hidden;page-break-inside:avoid;">
        <div style="background:linear-gradient(135deg,#F4A261,#E76F51);padding:12px 16px;display:flex;align-items:center;gap:12px;">
          <div style="width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <span style="font-weight:800;color:#fff;font-size:13px;">D${day.day}</span>
          </div>
          <div>
            <div style="font-size:10px;color:rgba(255,255,255,0.75);text-transform:uppercase;letter-spacing:0.08em;">Day ${day.day}</div>
            <div style="font-weight:800;color:#fff;font-size:15px;font-family:'Georgia',serif;">${day.theme}</div>
          </div>
        </div>
        <div style="padding:16px 16px 4px;">
          ${activitiesHTML}
        </div>
      </div>`;
    }).join('');

    const tipsHTML = itinerary.tips.map((tip) => `
      <li style="display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;font-size:12px;color:#6B4226;line-height:1.6;">
        <span style="color:#F4A261;font-weight:700;flex-shrink:0;margin-top:1px;">✦</span>
        <span>${tip}</span>
      </li>`).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>SafarX — ${itinerary.destination} ${itinerary.duration}-Day Itinerary</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      background: #F8F4EC;
      color: #1C0A00;
      padding: 0;
    }
    @media print {
      body { background: #fff; }
      .no-print { display: none !important; }
      @page { margin: 15mm 12mm; size: A4; }
    }
    .page { max-width: 800px; margin: 0 auto; padding: 32px 24px; }
    .header-bar {
      background: linear-gradient(135deg, #3D2B1F, #5C3D2E);
      color: #F8F4EC;
      padding: 28px 32px;
      border-radius: 16px;
      margin-bottom: 24px;
    }
    .brand {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #F4A261;
      margin-bottom: 8px;
    }
    .title {
      font-family: 'Georgia', serif;
      font-size: 26px;
      font-weight: 800;
      color: #F8F4EC;
      margin-bottom: 6px;
      line-height: 1.2;
    }
    .subtitle {
      font-size: 13px;
      color: rgba(248,244,236,0.75);
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 24px;
    }
    .meta-card {
      background: #fff;
      border: 1px solid #E8D5C4;
      border-radius: 10px;
      padding: 12px 14px;
    }
    .meta-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #9B6B4A;
      margin-bottom: 4px;
    }
    .meta-value {
      font-size: 13px;
      color: #1C0A00;
      font-weight: 600;
      line-height: 1.4;
    }
    .section-title {
      font-family: 'Georgia', serif;
      font-size: 18px;
      font-weight: 800;
      color: #1C0A00;
      margin-bottom: 14px;
      padding-bottom: 8px;
      border-bottom: 2px solid #F4A261;
    }
    .tips-box {
      background: #FFF7ED;
      border: 1px solid #FED7AA;
      border-radius: 12px;
      padding: 16px 20px;
      margin-top: 20px;
      page-break-inside: avoid;
    }
    .tips-title {
      font-family: 'Georgia', serif;
      font-size: 15px;
      font-weight: 700;
      color: #1C0A00;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .footer-bar {
      margin-top: 28px;
      padding-top: 16px;
      border-top: 1px solid #E8D5C4;
      text-align: center;
      font-size: 11px;
      color: #9B6B4A;
    }
    .print-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #F4A261;
      color: #1C0A00;
      font-weight: 700;
      font-size: 14px;
      padding: 10px 24px;
      border-radius: 50px;
      border: none;
      cursor: pointer;
      margin-bottom: 24px;
      font-family: inherit;
    }
    .print-btn:hover { background: #E8924A; }
  </style>
</head>
<body>
  <div class="page">
    <div class="no-print" style="text-align:center;padding:16px 0;">
      <button class="print-btn" onclick="window.print()">
        🖨️ Save as PDF / Print
      </button>
    </div>

    <div class="header-bar">
      <div class="brand">✈ SafarX — Travel Itinerary</div>
      <div class="title">Your ${itinerary.duration}-Day ${itinerary.destination} Itinerary</div>
      <div class="subtitle">${itinerary.travelStyle} style · ${itinerary.groupType} trip</div>
    </div>

    <div class="meta-grid">
      <div class="meta-card">
        <div class="meta-label">📅 Duration</div>
        <div class="meta-value">${itinerary.duration} Days</div>
      </div>
      <div class="meta-card">
        <div class="meta-label">🎯 Travel Style</div>
        <div class="meta-value">${itinerary.travelStyle}</div>
      </div>
      <div class="meta-card">
        <div class="meta-label">👥 Group Type</div>
        <div class="meta-value">${itinerary.groupType}</div>
      </div>
      <div class="meta-card">
        <div class="meta-label">🌤 Best Time to Visit</div>
        <div class="meta-value">${itinerary.bestTimeToVisit}</div>
      </div>
    </div>

    <div class="meta-card" style="margin-bottom:24px;">
      <div class="meta-label">🚌 How to Reach</div>
      <div class="meta-value" style="font-weight:400;font-size:12px;line-height:1.6;">${itinerary.howToReach}</div>
    </div>

    <div class="section-title">Day-by-Day Itinerary</div>
    ${daysHTML}

    <div class="tips-box">
      <div class="tips-title">💡 Travel Tips for Your Trip</div>
      <ul style="list-style:none;padding:0;">
        ${tipsHTML}
      </ul>
    </div>

    <div class="footer-bar">
      Generated by SafarX · safarx.in · Plan your perfect India journey
    </div>
  </div>
  <script>
    // Auto-trigger print dialog after a short delay for better UX
    setTimeout(() => window.print(), 600);
  </script>
</body>
</html>`;

    printWindow.document.write(html);
    printWindow.document.close();
}
