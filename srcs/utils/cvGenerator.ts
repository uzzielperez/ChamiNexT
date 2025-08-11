import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ProfileData } from '../types';

export const generateCV = (data: ProfileData) => {
    const cvElement = document.getElementById('cv-template');

    if (cvElement) {
        html2canvas(cvElement).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('cv.pdf');
        });
    }
};
