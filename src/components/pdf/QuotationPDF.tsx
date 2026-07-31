import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register fonts if needed (using default for now to avoid async loading issues)

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#0B3B3F',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 12,
    backgroundColor: '#00A6A6',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    marginTop: 20,
  },
  logo: {
    width: 140,
  },
  titleContainer: {
    alignItems: 'flex-end',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  infoLabel: {
    fontWeight: 'bold',
    marginRight: 4,
  },
  contactGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  contactBox: {
    width: '48%',
    backgroundColor: '#F4FAF9',
    padding: 12,
    borderRadius: 6,
    border: '1px solid #E5E7EB',
  },
  contactBoxTitle: {
    fontSize: 9,
    color: '#00A6A6',
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  contactName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contactText: {
    color: '#5B6B6C',
    marginBottom: 2,
  },
  serviceHighlight: {
    backgroundColor: '#0B3B3F',
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
  },
  serviceHighlightText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    borderBottom: '1px solid #E5E7EB',
    paddingBottom: 4,
    marginBottom: 8,
  },
  paragraph: {
    color: '#5B6B6C',
    marginBottom: 20,
    lineHeight: 1.4,
  },
  table: {
    width: '100%',
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F4FAF9',
    padding: 8,
    borderBottom: '1px solid #00A6A6',
  },
  tableHeaderCell: {
    fontWeight: 'bold',
    color: '#00A6A6',
    fontSize: 9,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: '1px solid #E5E7EB',
  },
  tableCell: {
    color: '#5B6B6C',
  },
  col1: { width: '50%' },
  col2: { width: '10%', textAlign: 'center' },
  col3: { width: '15%', textAlign: 'center' },
  col4: { width: '25%', textAlign: 'right' },
  totalsContainer: {
    width: '40%',
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottom: '1px solid #E5E7EB',
  },
  totalLabel: {
    fontWeight: 'bold',
    color: '#5B6B6C',
  },
  totalValue: {
    fontWeight: 'bold',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    backgroundColor: '#F4FAF9',
    marginTop: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  grandTotalLabel: {
    fontWeight: 'bold',
    color: '#00A6A6',
    fontSize: 12,
  },
  grandTotalValue: {
    fontWeight: 'bold',
    color: '#00A6A6',
    fontSize: 12,
  },
  termsBox: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 6,
    border: '1px dashed #D1D5DB',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    borderTop: '1px solid #E5E7EB',
    paddingTop: 10,
  },
  footerText: {
    color: '#9CA3AF',
    fontSize: 8,
  }
});

interface QuotationPDFProps {
  data: any;
  logoBase64?: string;
}

export const QuotationPDF = ({ data, logoBase64 }: QuotationPDFProps) => {
  const items = typeof data.items === 'string' ? JSON.parse(data.items) : data.items;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.topBar} />
        
        <View style={styles.headerRow}>
          {logoBase64 ? (
            <Image src={logoBase64} style={styles.logo} />
          ) : (
            <Text style={{ fontSize: 20, color: '#00A6A6', fontWeight: 'bold' }}>F&D INGENIEROS</Text>
          )}
          
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>COTIZACIÓN</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>N°:</Text>
              <Text>{data.quoteNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>FECHA:</Text>
              <Text>{new Date(data.date).toLocaleDateString('es-CL')}</Text>
            </View>
          </View>
        </View>

        <View style={styles.contactGrid}>
          <View style={styles.contactBox}>
            <Text style={styles.contactBoxTitle}>Preparado Para</Text>
            <Text style={styles.contactName}>{data.clientName}</Text>
            {data.clientType === 'EMPRESA' && <Text style={styles.contactText}>{data.clientCompany}</Text>}
            <Text style={styles.contactText}>{data.clientPhone}</Text>
            <Text style={styles.contactText}>{data.clientEmail}</Text>
          </View>
          
          <View style={styles.contactBox}>
            <Text style={styles.contactBoxTitle}>Emitido Por</Text>
            <Text style={styles.contactName}>{data.senderName}</Text>
            <Text style={styles.contactText}>{data.senderCompany}</Text>
            <Text style={styles.contactText}>RUT: {data.senderRut}</Text>
            <Text style={styles.contactText}>{data.senderAddress}</Text>
            <Text style={styles.contactText}>{data.senderEmail}</Text>
          </View>
        </View>

        <View style={styles.serviceHighlight}>
          <Text style={styles.serviceHighlightText}>Servicio: {data.serviceName}</Text>
        </View>

        <Text style={styles.sectionTitle}>Descripción del Requerimiento</Text>
        <Text style={styles.paragraph}>{data.requirements}</Text>

        <Text style={styles.sectionTitle}>Detalle de Inversión</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.col1]}>Detalle</Text>
            <Text style={[styles.tableHeaderCell, styles.col2]}>Unidad</Text>
            <Text style={[styles.tableHeaderCell, styles.col3]}>Cant.</Text>
            <Text style={[styles.tableHeaderCell, styles.col4]}>Total</Text>
          </View>
          
          {items.map((item: any, i: number) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.col1]}>{item.detail}</Text>
              <Text style={[styles.tableCell, styles.col2]}>{item.unit}</Text>
              <Text style={[styles.tableCell, styles.col3]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, styles.col4]}>${(item.quantity * item.unitPrice).toLocaleString('es-CL')}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsContainer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal Netos:</Text>
            <Text style={styles.totalValue}>${data.subtotal.toLocaleString('es-CL')}</Text>
          </View>
          {data.clientType === 'EMPRESA' && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>IVA (19%):</Text>
              <Text style={styles.totalValue}>${data.iva.toLocaleString('es-CL')}</Text>
            </View>
          )}
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>TOTAL:</Text>
            <Text style={styles.grandTotalValue}>${data.total.toLocaleString('es-CL')}</Text>
          </View>
        </View>

        <View style={styles.termsBox}>
          <Text style={[styles.sectionTitle, { borderBottom: 'none', marginBottom: 4 }]}>Condiciones Comerciales</Text>
          <Text style={{ marginBottom: 4 }}><Text style={styles.infoLabel}>Validez:</Text> {data.validityDays} días corridos</Text>
          <Text><Text style={styles.infoLabel}>Condiciones de Pago:</Text> {data.paymentTerms}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>F&D INGENIEROS - WWW.FYDINGENIERIA.CL</Text>
        </View>
      </Page>
    </Document>
  );
};
