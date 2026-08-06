import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyCg4QxlF.ttf' },
    { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyCg4QxlF.ttf', fontWeight: 'bold' }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
    position: 'relative'
  },
  pageBorder: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    border: '1px solid #000'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 10
  },
  headerColLeft: {
    width: '30%',
    alignItems: 'flex-start',
    flexDirection: 'column'
  },
  headerColCenter: {
    width: '40%',
    alignItems: 'center'
  },
  headerColRight: {
    width: '30%',
    alignItems: 'flex-end'
  },
  qrCode: {
    width: 50,
    height: 50,
    marginBottom: 5
  },
  validationText: {
    fontSize: 7,
    color: '#666',
    width: 150
  },
  logo: {
    width: 250,
    objectFit: 'contain'
  },
  certNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right'
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  studentName: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    textTransform: 'uppercase'
  },
  studentRut: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30
  },
  bodyText: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 1.5,
    marginHorizontal: 30,
    marginBottom: 20
  },
  courseName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  locationDate: {
    fontSize: 12,
    textAlign: 'center'
  },
  signaturesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 50,
    marginBottom: 20
  },
  signatureBox: {
    alignItems: 'center',
    width: '40%',
    position: 'relative'
  },
  signatureLine: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 5
  },
  signatureName: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  signatureTitle: {
    fontSize: 9,
    textAlign: 'center'
  },
  watermark: {
    position: 'absolute',
    width: 150,
    height: 150,
    top: -40,
    opacity: 0.1,
    zIndex: -1,
    objectFit: 'contain'
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    color: '#00A6A6',
    fontWeight: 'bold',
  }
});

interface DiplomaData {
  studentName: string;
  studentRut: string;
  courseName: string;
  approvalType: string;
  scorePercent?: number | null;
  courseDates: string;
  courseHours: number;
  certificateNumber: string;
  issueDate: string; // The full issue date string to derive Month/Year if needed
  validationCode: string;
  qrBase64: string;
  logoBase64?: string;
  signatureDanielBase64?: string;
  signatureAlamiroBase64?: string;
  timbreBase64?: string;
}

export const CourseDiplomaPDF = ({ data }: { data: DiplomaData }) => {
  // Extract month and year from issueDate to show "Rancagua-Chile, [mes] [año]"
  const dateObj = new Date(); // Fallback
  const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const currentMonth = monthNames[dateObj.getMonth()];
  const currentYear = dateObj.getFullYear();

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.pageBorder}></View>
        
        {/* HEADER SECTION (3 Columns) */}
        <View style={styles.header}>
          <View style={styles.headerColLeft}>
            <Image src={data.qrBase64} style={styles.qrCode} />
            <Text style={styles.validationText}>
              Código Interno QR: {data.validationCode}. Documento generado digitalmente por F&D Ingeniería.
            </Text>
          </View>
          <View style={styles.headerColCenter}>
            {data.logoBase64 ? (
              <Image src={data.logoBase64} style={styles.logo} />
            ) : (
              <Text style={{ fontSize: 24, color: '#00A6A6', fontWeight: 'bold' }}>F&D INGENIEROS</Text>
            )}
          </View>
          <View style={styles.headerColRight}>
            <Text style={styles.certNumber}>Certificado N° {data.certificateNumber}</Text>
            <Text style={{ fontSize: 10, color: '#00A6A6', fontWeight: 'bold', textAlign: 'right', marginTop: 4 }}>www.fydingenieria.cl</Text>
          </View>
        </View>

        {/* MIDDLE SECTION (Vertically Centered) */}
        <View style={styles.middleSection}>
          <Text style={styles.subtitle}>CERTIFICADO DE ENTRENAMIENTO:</Text>
          <Text style={styles.studentName}>{data.studentName}</Text>
          <Text style={styles.studentRut}>{
            (() => {
              const cleanRut = data.studentRut.replace(/[^0-9kK]/g, '').toUpperCase();
              if (cleanRut.length < 2) return data.studentRut;
              const body = cleanRut.slice(0, -1);
              const dv = cleanRut.slice(-1);
              return body.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + dv;
            })()
          }</Text>
          
          <Text style={styles.bodyText}>
            Este certificado acredita la participación y finalización del entrenamiento. No constituye certificación oficial de competencia según ASNT o ISO, el curso se realizó durante los días del {data.courseDates} con duración total de {data.courseHours} horas, de acuerdo con la práctica de F&D INGENIERIA EN MANTENIMIENTO "entrenamiento confeccionado de acuerdo con los lineamientos de la norma ISO 18436-2, en el método de ensayo:"
          </Text>
          
          <Text style={styles.courseName}>"{data.courseName}"</Text>
          <Text style={styles.locationDate}>Rancagua-Chile, {currentMonth} {currentYear}</Text>
        </View>
        
        {/* SIGNATURES SECTION */}
        <View style={styles.signaturesContainer}>
          <View style={styles.signatureBox}>
            {data.timbreBase64 && (
              <Image src={data.timbreBase64} style={styles.watermark} />
            )}
            {data.signatureDanielBase64 ? (
              <Image src={data.signatureDanielBase64} style={{ width: 120, height: 60, marginBottom: -10, objectFit: 'contain', zIndex: 1 }} />
            ) : null}
            <View style={styles.signatureLine}></View>
            <Text style={styles.signatureName}>DANIEL ALEJANDRO DINAMARCA ASTUDILLO</Text>
            <Text style={styles.signatureTitle}>Firma y Timbre</Text>
            <Text style={styles.signatureTitle}>Representante Legal</Text>
          </View>
          
          <View style={styles.signatureBox}>
            {data.signatureAlamiroBase64 ? (
              <Image src={data.signatureAlamiroBase64} style={{ width: 120, height: 60, marginBottom: -10, objectFit: 'contain' }} />
            ) : null}
            <View style={styles.signatureLine}></View>
            <Text style={styles.signatureName}>ALAMIRO ANDRÉS FERNÁNDEZ HUENUQUEO</Text>
            <Text style={styles.signatureTitle}>Mg. Ing Civil Industrial / VA CAT IV ISO 18436-2</Text>
            <Text style={styles.signatureTitle}>Instructor Responsable del Curso</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
};
