import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFExportOptions {
  filename?: string;
  title?: string;
  subtitle?: string;
  includeDate?: boolean;
  includeMetadata?: boolean;
}

/**
 * Exporta contenido HTML a PDF
 * @param elementId - ID del elemento HTML a exportar
 * @param options - Opciones de exportación
 */
export const exportHTMLToPDF = async (
  elementId: string,
  options: PDFExportOptions = {}
): Promise<void> => {
  const {
    filename = 'diario-misional.pdf',
    title = 'Diario Misional',
    subtitle = 'Exportación de entradas',
    includeDate = true,
    includeMetadata = true
  } = options;

  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Elemento con ID "${elementId}" no encontrado`);
    }

    // Crear canvas del elemento
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Configurar página
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20; // Margen de 10mm en cada lado
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Agregar título
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, pageWidth / 2, 20, { align: 'center' });

    // Agregar subtítulo
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(subtitle, pageWidth / 2, 30, { align: 'center' });

    // Agregar fecha de exportación
    if (includeDate) {
      const exportDate = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      pdf.setFontSize(10);
      pdf.text(`Exportado el: ${exportDate}`, pageWidth / 2, 40, { align: 'center' });
    }

    // Agregar línea separadora
    pdf.line(10, 45, pageWidth - 10, 45);

    // Calcular posición inicial para la imagen
    let yPosition = 50;

    // Si la imagen es muy alta, dividir en múltiples páginas
    if (imgHeight > pageHeight - yPosition) {
      const totalPages = Math.ceil(imgHeight / (pageHeight - yPosition));
      
      for (let i = 0; i < totalPages; i++) {
        if (i > 0) {
          pdf.addPage();
          yPosition = 10;
        }

        const sourceY = (i * (pageHeight - yPosition)) * (canvas.height / imgHeight);
        const sourceHeight = Math.min(
          (pageHeight - yPosition) * (canvas.height / imgHeight),
          canvas.height - sourceY
        );

        // Crear canvas temporal para esta página
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) throw new Error('No se pudo crear contexto de canvas');

        tempCanvas.width = canvas.width;
        tempCanvas.height = sourceHeight;
        tempCtx.drawImage(
          canvas,
          0, sourceY,
          canvas.width, sourceHeight,
          0, 0,
          canvas.width, sourceHeight
        );

        const tempImgData = tempCanvas.toDataURL('image/png');
        const tempImgHeight = (sourceHeight * imgWidth) / canvas.width;

        pdf.addImage(
          tempImgData,
          'PNG',
          10,
          yPosition,
          imgWidth,
          tempImgHeight
        );
      }
    } else {
      // Imagen cabe en una página
      pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, imgHeight);
    }

    // Agregar metadata en la última página
    if (includeMetadata) {
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'italic');
      pdf.text(
        'Generado por Diario Misional Web App',
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    // Descargar PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error al exportar PDF:', error);
    throw new Error('No se pudo exportar el PDF. Inténtalo de nuevo.');
  }
};

/**
 * Exporta entradas del diario a PDF
 * @param entries - Array de entradas del diario
 * @param options - Opciones de exportación
 */
export const exportDiaryToPDF = async (
  entries: any[],
  options: PDFExportOptions = {}
): Promise<void> => {
  const {
    filename = 'diario-misional.pdf',
    title = 'Mi Diario Misional',
    subtitle = `Entradas del diario (${entries.length} entradas)`
  } = options;

  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Configurar fuente
    pdf.setFont('helvetica');

    // Título principal
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, pageWidth / 2, 30, { align: 'center' });

    // Subtítulo
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.text(subtitle, pageWidth / 2, 40, { align: 'center' });

    // Fecha de exportación
    const exportDate = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    pdf.setFontSize(10);
    pdf.text(`Exportado el: ${exportDate}`, pageWidth / 2, 50, { align: 'center' });

    // Línea separadora
    pdf.line(20, 55, pageWidth - 20, 55);

    let yPosition = 65;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // Procesar cada entrada
    entries.forEach((entry, index) => {
      // Verificar si necesitamos una nueva página
      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = 20;
      }

      // Número de entrada
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Entrada ${index + 1}`, margin, yPosition);
      yPosition += 8;

      // Fecha y hora
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const dateTime = `${entry.date} • ${entry.time}`;
      pdf.text(dateTime, margin, yPosition);
      yPosition += 6;

      // Título
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      const titleLines = pdf.splitTextToSize(entry.title, contentWidth);
      pdf.text(titleLines, margin, yPosition);
      yPosition += titleLines.length * 5 + 3;

      // Contenido
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      const contentLines = pdf.splitTextToSize(entry.content, contentWidth);
      
      // Verificar si el contenido cabe en la página actual
      const contentHeight = contentLines.length * 4;
      if (yPosition + contentHeight > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.text(contentLines, margin, yPosition);
      yPosition += contentLines.length * 4 + 5;

      // Información adicional (ubicación, compañero, categoría)
      if (entry.location || entry.companion) {
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'italic');
        
        let additionalInfo = '';
        if (entry.location) additionalInfo += `Ubicación: ${entry.location}`;
        if (entry.companion) additionalInfo += additionalInfo ? ` • Compañero: ${entry.companion}` : `Compañero: ${entry.companion}`;
        if (entry.category) additionalInfo += additionalInfo ? ` • Categoría: ${entry.category}` : `Categoría: ${entry.category}`;

        if (additionalInfo) {
          pdf.text(additionalInfo, margin, yPosition);
          yPosition += 5;
        }
      }

      // Separador entre entradas
      if (index < entries.length - 1) {
        yPosition += 5;
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;
      }
    });

    // Pie de página
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.text(
      'Generado por Diario Misional Web App',
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );

    // Descargar PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error al exportar diario a PDF:', error);
    throw new Error('No se pudo exportar el diario. Inténtalo de nuevo.');
  }
};

/**
 * Exporta datos como JSON
 * @param data - Datos a exportar
 * @param filename - Nombre del archivo
 */
export const exportToJSON = (data: any, filename: string = 'diario-data.json'): void => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error al exportar JSON:', error);
    throw new Error('No se pudo exportar los datos. Inténtalo de nuevo.');
  }
};
