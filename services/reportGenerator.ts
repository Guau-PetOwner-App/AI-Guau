import { PetAnalysis } from '../App';
import jsPDF from 'jspdf';
import i18n from '../i18n';

/**
 * Generate a professional multi-page PDF report from pet analysis
 * OPTIMIZED: Efficient spacing + High contrast
 * LOCALIZED: Uses current i18n language
 */
export async function generateReportImage(analysis: PetAnalysis): Promise<void> {
  const t = (key: string) => i18n.t(key);
  // Create PDF with A4 portrait format
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const margin = 12; // Reduced from 15
  const contentWidth = pageWidth - (margin * 2);

  // ============================================
  // PAGE 1: HEADER, PHOTO, BASIC INFO
  // ============================================
  
  let yPosition = 0;

  // Compact header
  const headerHeight = 22; // Reduced from 30
  pdf.setFillColor(83, 198, 240); // #53C6F0 - Guau blue
  pdf.rect(0, 0, pageWidth, headerHeight, 'F');
  
  // Logo/Title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(26); // Reduced from 32
  pdf.setFont('helvetica', 'bold');
  pdf.text(t('report.app_title'), pageWidth / 2, 10, { align: 'center' });
  
  // Subtitle
  pdf.setFontSize(10); // Reduced from 12
  pdf.setFont('helvetica', 'normal');
  pdf.text(t('report.app_subtitle'), pageWidth / 2, 17, { align: 'center' });

  yPosition = headerHeight + 10; // Reduced spacing

  // Smaller Pet Image
  try {
    const imgData = await getImageDataURL(analysis.imageUrl);
    const imgSize = 65; // Reduced from 90
    const imgX = (pageWidth - imgSize) / 2;
    
    // White background with shadow
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.5);
    pdf.roundedRect(imgX - 2, yPosition - 2, imgSize + 4, imgSize + 4, 3, 3, 'FD');
    
    // Image
    pdf.addImage(imgData, 'JPEG', imgX, yPosition, imgSize, imgSize);
    
    yPosition += imgSize + 10; // Reduced spacing
  } catch (error) {
    console.error('Error loading pet image:', error);
    yPosition += 8;
  }

  // Compact Section Title
  pdf.setFillColor(245, 245, 245);
  pdf.rect(margin, yPosition, contentWidth, 8, 'F'); // Reduced from 10
  pdf.setTextColor(50, 50, 50);
  pdf.setFontSize(12); // Reduced from 14
  pdf.setFont('helvetica', 'bold');
  pdf.text(t('report.basic_info'), margin + 3, yPosition + 6);
  yPosition += 12; // Reduced spacing

  // Info Cards Section
  const cards = [
    { icon: 'TIPO', label: t('report.pet_type'), value: analysis.species, color: [145, 255, 58] },
    { icon: 'EDAD', label: t('report.estimated_age'), value: analysis.age, color: [83, 198, 240] },
    { icon: 'ENERGIA', label: t('report.energy_level'), value: analysis.energyLevel, color: [255, 127, 80] },
    { icon: 'RAZA', label: t('report.detected_breed'), value: analysis.breeds.join(', '), color: [167, 139, 250] },
  ];

  // Add colors card if available - with better contrast
  if (analysis.colors && analysis.colors.length > 0) {
    cards.push({ 
      icon: 'COLOR', 
      label: t('report.colors'), 
      value: analysis.colors.join(', '), 
      color: [255, 165, 0] // Changed from gold to orange for better contrast
    });
  }

  // Add coat type if available - with better contrast
  if (analysis.coatType) {
    const coatText = analysis.coatType.charAt(0).toUpperCase() + analysis.coatType.slice(1);
    cards.push({ 
      icon: 'PELAJE', 
      label: t('report.coat_type'), 
      value: coatText, 
      color: [219, 39, 119] // Changed to darker pink for better contrast
    });
  }

  // Draw info cards
  cards.forEach((card) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 35) {
      pdf.addPage();
      yPosition = margin;
    }

    drawInfoCard(pdf, margin, yPosition, contentWidth, card.icon, card.label, card.value, card.color);
    yPosition += 20; // Reduced from 26
  });

  // ============================================
  // PAGE 2: ROUTINE
  // ============================================
  
  pdf.addPage();
  yPosition = margin;

  // Compact section header
  pdf.setFillColor(83, 198, 240);
  pdf.rect(0, yPosition, pageWidth, 12, 'F'); // Reduced from 15
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16); // Reduced from 18
  pdf.setFont('helvetica', 'bold');
  pdf.text(t('report.recommended_routine'), pageWidth / 2, yPosition + 8, { align: 'center' });

  yPosition += 18; // Reduced spacing

  // Routine items
  analysis.routine.forEach((item, index) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = margin;
    }

    const parts = item.activity.split(':');
    const title = parts[0].trim();
    const notes = parts.length > 1 ? parts.slice(1).join(':').trim() : '';

    drawRoutineCard(pdf, margin, yPosition, contentWidth, item.time, title, notes, index);
    yPosition += 26; // Reduced from 32
  });

  // ============================================
  // PAGE 3: PERSONALITY & ADDITIONAL INFO
  // ============================================
  
  // Personality section (if available)
  if (analysis.personality) {
    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = margin;
    }

    yPosition += 8;

    // Compact section header
    pdf.setFillColor(145, 255, 58);
    pdf.rect(0, yPosition, pageWidth, 12, 'F'); // Reduced from 15
    
    pdf.setTextColor(26, 26, 26);
    pdf.setFontSize(16); // Reduced from 18
    pdf.setFont('helvetica', 'bold');
    pdf.text(t('report.personality'), pageWidth / 2, yPosition + 8, { align: 'center' });

    yPosition += 18; // Reduced spacing

    // Personality text box
    const personalityHeight = drawTextBox(
      pdf, 
      margin, 
      yPosition, 
      contentWidth, 
      analysis.personality,
      [240, 249, 255], // Light blue background
      [8, 145, 178]    // Blue border
    );

    yPosition += personalityHeight + 10;
  }

  // Confidence badge (if available)
  if (analysis.confidence !== undefined) {
    // Check if we need a new page
    if (yPosition > pageHeight - 35) {
      pdf.addPage();
      yPosition = margin;
    }

    const confidencePercent = Math.round(analysis.confidence * 100);
    
    // Compact badge
    pdf.setFillColor(240, 253, 244); // Light green
    pdf.setDrawColor(16, 185, 129); // Green border
    pdf.setLineWidth(1.5);
    pdf.roundedRect(margin + 15, yPosition, contentWidth - 30, 14, 3, 3, 'FD'); // Reduced height
    
    // Text
    pdf.setTextColor(5, 150, 105); // Dark green
    pdf.setFontSize(13); // Reduced from 16
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${t('report.confidence')}: ${confidencePercent}%`, pageWidth / 2, yPosition + 9.5, { align: 'center' });
    
    yPosition += 22; // Reduced spacing
  }

  // Disclaimers (if available)
  if (analysis.disclaimers && analysis.disclaimers.length > 0) {
    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = margin;
    }

    // Compact section header
    pdf.setFillColor(255, 127, 80);
    pdf.rect(0, yPosition, pageWidth, 12, 'F'); // Reduced from 15
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16); // Reduced from 18
    pdf.setFont('helvetica', 'bold');
    pdf.text(t('report.important'), pageWidth / 2, yPosition + 8, { align: 'center' });

    yPosition += 18; // Reduced spacing

    analysis.disclaimers.forEach((disclaimer) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 35) {
        pdf.addPage();
        yPosition = margin;
      }

      const disclaimerHeight = drawTextBox(
        pdf,
        margin,
        yPosition,
        contentWidth,
        disclaimer,
        [254, 243, 199], // Light yellow background
        [217, 119, 6]    // Orange border
      );

      yPosition += disclaimerHeight + 8;
    });
  }

  // ============================================
  // FOOTER ON LAST PAGE
  // ============================================
  
  yPosition = pageHeight - 20;
  
  // Footer separator line
  pdf.setDrawColor(220, 220, 220);
  pdf.setLineWidth(0.5);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  
  yPosition += 6;
  
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text(t('report.created_with'), pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 5;
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(140, 140, 140);
  pdf.text(t('report.website'), pageWidth / 2, yPosition, { align: 'center' });

  // ============================================
  // DOWNLOAD PDF
  // ============================================
  
  const timestamp = new Date().toISOString().split('T')[0];
  pdf.save(`guau-reporte-${timestamp}.pdf`);
}

/**
 * Convert image URL to data URL with CORS support
 */
async function getImageDataURL(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not create canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Draw info card with icon, label, and value
 * IMPROVED: Better contrast, compact layout
 */
function drawInfoCard(
  pdf: jsPDF,
  x: number,
  y: number,
  width: number,
  icon: string,
  label: string,
  value: string,
  color: number[]
) {
  const cardHeight = 18; // Reduced from 22
  
  // Card background - white with subtle shadow
  pdf.setFillColor(255, 255, 255);
  pdf.setDrawColor(230, 230, 230);
  pdf.setLineWidth(0.5);
  pdf.roundedRect(x, y, width, cardHeight, 2.5, 2.5, 'FD');

  // Left colored stripe (wider and more visible)
  pdf.setFillColor(color[0], color[1], color[2]);
  pdf.rect(x, y, 4, cardHeight, 'F');

  // Icon badge at top left - IMPROVED CONTRAST
  const iconBadgeWidth = 30;
  const iconBadgeHeight = 7;
  
  // Solid colored background for better contrast
  pdf.setFillColor(color[0], color[1], color[2]);
  pdf.roundedRect(x + 7, y + 3.5, iconBadgeWidth, iconBadgeHeight, 1.5, 1.5, 'F');

  // Icon text - WHITE for maximum contrast
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');
  pdf.text(icon, x + 9, y + 8);

  // Label text - next to icon
  pdf.setTextColor(90, 90, 90);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text(label, x + iconBadgeWidth + 10, y + 8);

  // Value (large and bold) - INCREASED SIZE
  pdf.setTextColor(20, 20, 20);
  pdf.setFontSize(13);
  pdf.setFont('helvetica', 'bold');
  
  // Truncate if too long
  const maxWidth = width - 12;
  let displayValue = value;
  while (pdf.getTextWidth(displayValue) > maxWidth && displayValue.length > 0) {
    displayValue = displayValue.substring(0, displayValue.length - 1);
  }
  if (displayValue.length < value.length) {
    displayValue = displayValue.substring(0, displayValue.length - 3) + '...';
  }
  
  pdf.text(displayValue, x + 7, y + 15);
}

/**
 * Draw routine card with time, title, and notes
 * IMPROVED: Compact layout, better contrast
 */
function drawRoutineCard(
  pdf: jsPDF,
  x: number,
  y: number,
  width: number,
  time: string,
  title: string,
  notes: string,
  index: number
) {
  const colors = [
    [255, 127, 80],  // Coral
    [83, 198, 240],  // Blue
    [145, 255, 58],  // Green
    [167, 139, 250], // Purple
  ];
  const color = colors[index % colors.length];
  const cardHeight = 22; // Reduced from 28

  // Card background
  pdf.setFillColor(255, 255, 255);
  pdf.setDrawColor(230, 230, 230);
  pdf.setLineWidth(0.5);
  pdf.roundedRect(x, y, width, cardHeight, 2.5, 2.5, 'FD');

  // Left colored stripe (wider)
  pdf.setFillColor(color[0], color[1], color[2]);
  pdf.rect(x, y, 5, cardHeight, 'F');

  // Time badge with SOLID background for better contrast
  const timeBadgeWidth = 26;
  const timeBadgeHeight = 9;
  pdf.setFillColor(color[0], color[1], color[2]);
  pdf.roundedRect(x + 9, y + 4, timeBadgeWidth, timeBadgeHeight, 2, 2, 'F');

  // Time text - WHITE for maximum contrast
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text(time, x + 11.5, y + 10);

  // Title - INCREASED SIZE
  pdf.setTextColor(20, 20, 20);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  
  let displayTitle = title;
  const maxTitleWidth = width - 50;
  while (pdf.getTextWidth(displayTitle) > maxTitleWidth && displayTitle.length > 0) {
    displayTitle = displayTitle.substring(0, displayTitle.length - 1);
  }
  if (displayTitle.length < title.length) {
    displayTitle = displayTitle.substring(0, displayTitle.length - 3) + '...';
  }
  
  pdf.text(displayTitle, x + 42, y + 10);

  // Notes - compact
  if (notes) {
    pdf.setTextColor(70, 70, 70);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    
    let displayNotes = notes;
    const maxNotesWidth = width - 14;
    while (pdf.getTextWidth(displayNotes) > maxNotesWidth && displayNotes.length > 0) {
      displayNotes = displayNotes.substring(0, displayNotes.length - 1);
    }
    if (displayNotes.length < notes.length) {
      displayNotes = displayNotes.substring(0, displayNotes.length - 3) + '...';
    }
    
    pdf.text(displayNotes, x + 9, y + 17.5);
  }
}

/**
 * Draw text box with word wrapping and background
 * IMPROVED: Compact spacing, better contrast
 * Returns the height of the box
 */
function drawTextBox(
  pdf: jsPDF,
  x: number,
  y: number,
  width: number,
  text: string,
  bgColor: number[],
  borderColor: number[]
): number {
  const padding = 6; // Reduced from 7
  const lineHeight = 5.5; // Reduced from 6
  const fontSize = 10; // Reduced from 11

  pdf.setFontSize(fontSize);
  pdf.setFont('helvetica', 'normal');

  // Split text into lines that fit within the width
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach(word => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = pdf.getTextWidth(testLine);
    
    if (testWidth > width - (padding * 2) && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });
  
  if (currentLine) {
    lines.push(currentLine);
  }

  const boxHeight = (lines.length * lineHeight) + (padding * 2) + 2;

  // Background
  pdf.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
  pdf.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  pdf.setLineWidth(0.8);
  pdf.roundedRect(x, y, width, boxHeight, 2.5, 2.5, 'FD');

  // Text - BETTER CONTRAST
  pdf.setTextColor(20, 20, 20);
  
  lines.forEach((line, i) => {
    pdf.text(line, x + padding, y + padding + (i * lineHeight) + 4);
  });

  return boxHeight;
}
