import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyCg4QxlF.ttf' },
    { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyCg4QxlF.ttf', fontWeight: 'bold' } // Fallback to standard for now, adjust in prod
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 50,
    backgroundColor: '#ffffff',
    position: 'relative'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    borderBottomWidth: 3,
    borderBottomColor: '#00A6A6',
    paddingBottom: 20
  },
  logo: {
    width: 140,
  },
  headerTextContainer: {
    textAlign: 'right'
  },
  headerTitle: {
    fontSize: 22,
    color: '#0B3B3F',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#5B6B6C',
    marginTop: 4
  },
  content: {
    marginTop: 20
  },
  mainTitle: {
    fontSize: 26,
    color: '#0B3B3F',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  section: {
    marginBottom: 20
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F4FAF9',
    paddingBottom: 4
  },
  label: {
    width: '35%',
    fontSize: 11,
    color: '#5B6B6C',
    fontWeight: 'bold',
  },
  value: {
    width: '65%',
    fontSize: 11,
    color: '#0B3B3F',
  },
  findingsBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F4FAF9',
    borderLeftWidth: 4,
    borderLeftColor: '#00A6A6',
    borderRadius: 4
  },
  findingsTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0B3B3F',
    marginBottom: 8
  },
  findingsText: {
    fontSize: 10,
    color: '#5B6B6C',
    lineHeight: 1.5
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 50,
    right: 50,
  },
  footerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
    paddingBottom: 20,
    marginBottom: 20
  },
  qrCode: {
    width: 80,
    height: 80,
  },
  validationText: {
    width: '70%',
    fontSize: 9,
    color: '#5B6B6C',
    lineHeight: 1.4,
    textAlign: 'right'
  },
  footerBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerLegal: {
    fontSize: 8,
    color: '#A0AAB2'
  },
  footerLink: {
    fontSize: 8,
    color: '#00A6A6',
    fontWeight: 'bold'
  }
});

interface ServiceReportData {
  evaluatorName: string;
  evaluatorRut: string;
  serviceName: string;
  clientCompany: string;
  equipmentTag: string;
  reportTitle: string;
  findingsSummary: string;
  issueDate: string;
  validationCode: string;
  qrBase64: string;
  logoBase64?: string;
}

export const ServiceReportPDF = ({ data }: { data: ServiceReportData }) => (
  <Document>
    <Page size="LETTER" style={styles.page}>
      
      {/* Header */}
      <View style={styles.header}>
        {data.logoBase64 ? (
          <Image src={data.logoBase64} style={styles.logo} />
        ) : (
          <Text style={{ fontSize: 24, color: '#00A6A6', fontWeight: 'bold' }}>F&D INGENIEROS</Text>
        )}
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>CERTIFICADO OFICIAL</Text>
          <Text style={styles.headerSubtitle}>VALIDACIÓN DE INFORME TÉCNICO</Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.mainTitle}>Certificado de Emisión</Text>
        
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>TÍTULO DEL INFORME:</Text>
            <Text style={styles.value}>{data.reportTitle}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>EMPRESA MANDANTE:</Text>
            <Text style={styles.value}>{data.clientCompany}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>SERVICIO PRESTADO:</Text>
            <Text style={styles.value}>{data.serviceName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>EQUIPO / ACTIVO:</Text>
            <Text style={styles.value}>{data.equipmentTag}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>EVALUADOR RESPONSABLE:</Text>
            <Text style={styles.value}>{data.evaluatorName} (RUT: {data.evaluatorRut})</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>FECHA DE EMISIÓN:</Text>
            <Text style={styles.value}>{data.issueDate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>CÓDIGO DE VALIDACIÓN:</Text>
            <Text style={[styles.value, { fontWeight: 'bold' }]}>{data.validationCode}</Text>
          </View>
        </View>

        {data.findingsSummary && (
          <View style={styles.findingsBox}>
            <Text style={styles.findingsTitle}>RESUMEN DE RESULTADOS</Text>
            <Text style={styles.findingsText}>{data.findingsSummary}</Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerTop}>
          <Image src={data.qrBase64} style={styles.qrCode} />
          <Text style={styles.validationText}>
            Este documento certifica la emisión oficial del informe técnico descrito por parte de F&D Ingenieros. {'\n'}
            Para verificar su autenticidad y vigencia, escanee el código QR o ingrese el código de validación en: {'\n'}
            <Text style={{ fontWeight: 'bold', color: '#0B3B3F' }}>www.fydingenieria.cl/certificados</Text>
          </Text>
        </View>
        <View style={styles.footerBottom}>
          <Text style={styles.footerLegal}>Documento generado electrónicamente. No requiere firma física.</Text>
          <Text style={styles.footerLink}>F&D INGENIERÍA EN MANTENIMIENTO SPA</Text>
        </View>
      </View>

    </Page>
  </Document>
);
