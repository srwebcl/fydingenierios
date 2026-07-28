import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    border: '20px solid #00C896', 
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    borderBottom: '2px solid #00A6A6',
    paddingBottom: 20
  },
  logoPlaceholder: {
    fontSize: 24,
    color: '#00A6A6',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    color: '#00A6A6',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 18,
    color: '#0B3B3F',
    textAlign: 'center',
    marginBottom: 30,
  },
  content: {
    fontSize: 16,
    color: '#0B3B3F',
    textAlign: 'center',
    lineHeight: 2,
    marginBottom: 40,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginVertical: 10,
    borderBottom: '1px solid #e4e4e7',
    paddingBottom: 5,
  },
  courseName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00A6A6',
    marginVertical: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTop: '2px solid #00A6A6',
    paddingTop: 15,
  },
  qrContainer: {
    width: 100,
    alignItems: 'center'
  },
  qrImage: {
    width: 70,
    height: 70,
    marginBottom: 5
  },
  codeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0B3B3F'
  },
  disclaimer: {
    fontSize: 9,
    color: '#5B6B6C',
    textAlign: 'right',
    width: '70%'
  }
});

interface DiplomaData {
  studentName: string;
  studentRut: string;
  courseName: string;
  approvalType: string; // 'PARTICIPACION' o 'APROBACION'
  scorePercent?: number | null;
  issueDate: string;
  validationCode: string;
  qrBase64: string;
  logoBase64?: string;
}

export const CourseDiplomaPDF = ({ data }: { data: DiplomaData }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.headerContainer}>
        {data.logoBase64 ? (
          <Image src={data.logoBase64} style={{ width: 160, height: 43 }} />
        ) : (
          <Text style={styles.logoPlaceholder}>F&D INGENIEROS</Text>
        )}
        <Text style={{ fontSize: 12, color: '#5B6B6C' }}>División de Capacitación Industrial</Text>
      </View>
      
      <Text style={styles.title}>DIPLOMA DE {data.approvalType}</Text>
      <Text style={styles.subtitle}>Otorgado a</Text>
      
      <View style={styles.content}>
        <Text style={styles.name}>{data.studentName}</Text>
        <Text style={{ fontSize: 12, color: '#5B6B6C', marginBottom: 15 }}>RUT: {data.studentRut}</Text>
        
        <Text>Por haber participado y completado satisfactoriamente el programa de capacitación en:</Text>
        <Text style={styles.courseName}>{data.courseName}</Text>
        
        {data.scorePercent != null && data.approvalType === 'APROBACION' && (
          <Text style={{ marginTop: 10, fontSize: 14 }}>
            Con un rendimiento del <Text style={{ fontWeight: 'bold' }}>{data.scorePercent}%</Text>
          </Text>
        )}
        
        <Text style={{ marginTop: 20, fontSize: 14 }}>Fecha de Emisión: {data.issueDate}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.qrContainer}>
          <Image src={data.qrBase64} style={styles.qrImage} />
          <Text style={styles.codeText}>Código: {data.validationCode}</Text>
        </View>
        <Text style={styles.disclaimer}>
          Este diploma es oficial y auditable. Puede verificar su autenticidad escaneando el código QR o ingresando el código de validación en el portal de certificados de F&D Ingenieros.
        </Text>
      </View>
    </Page>
  </Document>
);
