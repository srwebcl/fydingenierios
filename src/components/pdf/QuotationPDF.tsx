import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#0B3B3F',
    lineHeight: 1.5,
    backgroundColor: '#FFFFFF',
    paddingBottom: 60, // Space for footer
  },
  headerBanner: {
    backgroundColor: '#0B3B3F',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '30 40',
    marginBottom: 30,
  },
  logo: {
    width: 140,
  },
  headerTextContainer: {
    alignItems: 'flex-end',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#00A6A6',
    fontSize: 10,
  },
  contentContainer: {
    paddingHorizontal: 40,
  },
  titleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #E5E7EB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    backgroundColor: '#F4FAF9',
  },
  titleCardLeft: {
    flex: 1,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00A6A6',
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 10,
    color: '#5B6B6C',
  },
  titleCardRight: {
    alignItems: 'flex-end',
  },
  badge: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: 4,
    padding: '4 8',
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#00A6A6',
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    width: '48%',
    border: '1px solid #E5E7EB',
    borderRadius: 8,
    padding: 16,
  },
  cardFull: {
    width: '100%',
    border: '1px solid #E5E7EB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderBottom: '1px solid #F4FAF9',
    paddingBottom: 8,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0B3B3F',
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    width: 80,
    color: '#5B6B6C',
    fontSize: 9,
  },
  value: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 10,
  },
  paragraph: {
    color: '#5B6B6C',
    lineHeight: 1.5,
  },
  table: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F4FAF9',
    padding: 10,
    borderBottom: '2px solid #00A6A6',
  },
  tableHeaderCell: {
    fontWeight: 'bold',
    color: '#00A6A6',
    fontSize: 9,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottom: '1px solid #E5E7EB',
  },
  tableCell: {
    color: '#5B6B6C',
    fontSize: 9,
  },
  col1: { width: '45%' },
  col2: { width: '15%', textAlign: 'center' },
  col3: { width: '15%', textAlign: 'center' },
  col4: { width: '25%', textAlign: 'right' },
  totalsContainer: {
    width: '50%',
    backgroundColor: '#F4FAF9',
    borderRadius: 8,
    padding: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalLabel: {
    color: '#5B6B6C',
    fontSize: 10,
  },
  totalValue: {
    fontWeight: 'bold',
    fontSize: 10,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTop: '1px solid #00A6A6',
    marginTop: 4,
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
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0B3B3F',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: 9,
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
        
        {/* HEADER BANNER */}
        <View style={styles.headerBanner} fixed>
          {logoBase64 ? (
            <Image src={logoBase64} style={styles.logo} />
          ) : (
            <Text style={{ fontSize: 24, color: '#00A6A6', fontWeight: 'bold' }}>F&D INGENIERÍA</Text>
          )}
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>PROPUESTA COMERCIAL</Text>
            <Text style={styles.headerSubtitle}>CONFIABILIDAD • PRECISIÓN • RESULTADOS</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          
          {/* TITLE CARD */}
          <View style={styles.titleCard}>
            <View style={styles.titleCardLeft}>
              <Text style={styles.mainTitle}>DOCUMENTO OFICIAL</Text>
              <Text style={styles.subTitle}>La siguiente propuesta técnica y económica ha sido emitida directamente por F&D Ingeniería en Mantenimiento.</Text>
            </View>
            <View style={styles.titleCardRight}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>N° {data.quoteNumber}</Text>
              </View>
              <Text style={{ fontSize: 9, color: '#5B6B6C' }}>Fecha: {new Date(data.date).toLocaleDateString('es-CL')}</Text>
            </View>
          </View>

          {/* TWO COLUMN INFO */}
          <View style={styles.grid}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Información del Cliente</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Nombre</Text>
                <Text style={styles.value}>{data.clientName}</Text>
              </View>
              {data.clientType === 'EMPRESA' && (
                <View style={styles.row}>
                  <Text style={styles.label}>Empresa</Text>
                  <Text style={styles.value}>{data.clientCompany}</Text>
                </View>
              )}
              <View style={styles.row}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{data.clientEmail}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Teléfono</Text>
                <Text style={styles.value}>{data.clientPhone}</Text>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Datos del Emisor</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Empresa</Text>
                <Text style={styles.value}>{data.senderCompany}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>RUT</Text>
                <Text style={styles.value}>{data.senderRut}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Ejecutivo</Text>
                <Text style={styles.value}>{data.senderName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{data.senderEmail}</Text>
              </View>
            </View>
          </View>

          {/* SERVICE HIGHLIGHT */}
          <View style={styles.cardFull}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Detalle del Requerimiento</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Servicio</Text>
              <Text style={[styles.value, { color: '#00A6A6' }]}>{data.serviceName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Descripción</Text>
              <Text style={[styles.value, { fontWeight: 'normal', color: '#5B6B6C' }]}>{data.requirements}</Text>
            </View>
          </View>

          {/* TABLE */}
          <View style={styles.cardFull}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Inversión Estimada</Text>
            </View>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, styles.col1]}>Detalle</Text>
                <Text style={[styles.tableHeaderCell, styles.col2]}>Unidad</Text>
                <Text style={[styles.tableHeaderCell, styles.col3]}>Cant.</Text>
                <Text style={[styles.tableHeaderCell, styles.col4]}>Total</Text>
              </View>
              
              {items.map((item: any, i: number) => (
                <View key={i} style={styles.tableRow} wrap={false}>
                  <Text style={[styles.tableCell, styles.col1]}>{item.detail}</Text>
                  <Text style={[styles.tableCell, styles.col2]}>{item.unit}</Text>
                  <Text style={[styles.tableCell, styles.col3]}>{item.quantity}</Text>
                  <Text style={[styles.tableCell, styles.col4]}>${(item.quantity * item.unitPrice).toLocaleString('es-CL')}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* TOTALS & TERMS - WRAPPED TOGETHER SO THEY DONT CUT */}
          <View wrap={false}>
            <View style={styles.grid}>
              <View style={[styles.card, { width: '45%' }]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Condiciones Comerciales</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Validez</Text>
                  <Text style={styles.value}>{data.validityDays} días corridos</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Pago</Text>
                  <Text style={styles.value}>{data.paymentTerms}</Text>
                </View>
              </View>

              <View style={styles.totalsContainer}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Subtotal Neto</Text>
                  <Text style={styles.totalValue}>${data.subtotal.toLocaleString('es-CL')}</Text>
                </View>
                {data.clientType === 'EMPRESA' && (
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>IVA (19%)</Text>
                    <Text style={styles.totalValue}>${data.iva.toLocaleString('es-CL')}</Text>
                  </View>
                )}
                <View style={styles.grandTotalRow}>
                  <Text style={styles.grandTotalLabel}>TOTAL</Text>
                  <Text style={styles.grandTotalValue}>${data.total.toLocaleString('es-CL')}</Text>
                </View>
              </View>
            </View>
          </View>
          
        </View>

        {/* FOOTER BANNER */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Ingeniería en Mantenimiento F&D SpA.</Text>
          <Text style={styles.footerText}>www.fydingenieria.cl</Text>
        </View>
      </Page>
    </Document>
  );
};
