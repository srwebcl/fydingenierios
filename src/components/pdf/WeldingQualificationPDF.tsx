import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    border: '20px solid #00A6A6', 
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    borderBottom: '2px solid #00C896',
    paddingBottom: 20
  },
  logoPlaceholder: {
    fontSize: 24,
    color: '#00A6A6',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    color: '#00A6A6',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 30,
    textTransform: 'uppercase',
  },
  content: {
    fontSize: 14,
    color: '#5B6B6C',
    lineHeight: 2,
  },
  dataRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  dataLabel: {
    width: 200,
    fontWeight: 'bold',
    color: '#0B3B3F',
  },
  dataValue: {
    flex: 1,
    borderBottom: '1px solid #e4e4e7',
    color: '#000000',
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

interface WeldingData {
  welderName: string;
  welderRut: string;
  process: string;
  standard: string;
  position: string;
  issueDate: string;
  expiryDate: string;
  validationCode: string;
  qrBase64: string;
  logoBase64?: string;
}

export const WeldingQualificationPDF = ({ data }: { data: WeldingData }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.headerContainer}>
        {data.logoBase64 ? (
          <Image src={data.logoBase64} style={{ width: 160, height: 43 }} />
        ) : (
          <Text style={styles.logoPlaceholder}>FYD INGENIEROS</Text>
        )}
        <Text style={{ fontSize: 12, color: '#5B6B6C' }}>Mantenimiento, Confiabilidad y Certificación</Text>
      </View>
      
      <Text style={styles.title}>Certificado de Calificación de Soldador</Text>
      
      <View style={styles.content}>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Nombre Completo:</Text>
          <Text style={styles.dataValue}>{data.welderName}</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>RUT:</Text>
          <Text style={styles.dataValue}>{data.welderRut}</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Proceso Calificado:</Text>
          <Text style={styles.dataValue}>{data.process}</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Norma de Referencia:</Text>
          <Text style={styles.dataValue}>{data.standard}</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Posición:</Text>
          <Text style={styles.dataValue}>{data.position}</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Fecha de Emisión:</Text>
          <Text style={styles.dataValue}>{data.issueDate}</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Válido Hasta:</Text>
          <Text style={styles.dataValue}>{data.expiryDate}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.qrContainer}>
          <Image src={data.qrBase64} style={styles.qrImage} />
          <Text style={styles.codeText}>Código: {data.validationCode}</Text>
        </View>
        <Text style={styles.disclaimer}>
          Este documento certifica que el soldador ha sido calificado cumpliendo rigurosamente con los estándares y normativas internacionales aplicables. Documento auditable vía portal oficial FYD Ingenieros.
        </Text>
      </View>
    </Page>
  </Document>
);
