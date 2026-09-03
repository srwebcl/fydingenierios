import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#1F2937', // Dark gray instead of pure black
    padding: 30,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  logoContainer: {
    width: '60%',
  },
  logo: {
    width: 150,
    marginBottom: 10,
  },
  companyInfo: {
    fontSize: 8,
    color: '#4B5563',
    lineHeight: 1.3,
  },
  folioBox: {
    width: '35%',
    border: '2px solid #00A6A6', // Brand Teal border
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#F4FAF9', // Very light teal
  },
  folioTextRut: {
    color: '#0B3B3F', // Brand Dark
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  folioTextTitle: {
    color: '#00A6A6',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  folioTextNumber: {
    color: '#E53E3E',
    fontSize: 11,
    fontWeight: 'bold',
  },
  clientBox: {
    border: '1px solid #E5E7EB',
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
  },
  clientLeft: {
    width: '60%',
  },
  clientRight: {
    width: '38%',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    width: 70,
    fontWeight: 'bold',
    color: '#0B3B3F',
  },
  value: {
    flex: 1,
  },
  serviceTitleBox: {
    marginBottom: 15,
    paddingBottom: 5,
    borderBottom: '2px solid #00A6A6',
  },
  serviceTitle: {
    fontWeight: 'bold',
    fontSize: 11,
    color: '#0B3B3F',
    textTransform: 'uppercase',
  },
  serviceDesc: {
    fontSize: 9,
    marginTop: 4,
    color: '#4B5563',
  },
  table: {
    width: '100%',
    border: '1px solid #E5E7EB',
    borderRadius: 6,
    marginBottom: 15,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0B3B3F',
  },
  tableHeaderCell: {
    padding: 6,
    fontWeight: 'bold',
    color: '#FFFFFF',
    borderRight: '1px solid #1F4F53', // slightly lighter than header bg
    textAlign: 'center',
    fontSize: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #E5E7EB',
  },
  tableCell: {
    padding: 6,
    borderRight: '1px solid #E5E7EB',
    fontSize: 8,
    color: '#1F2937',
  },
  col1: { width: '8%', textAlign: 'center' },
  col2: { width: '45%' },
  col3: { width: '10%', textAlign: 'center' },
  col4: { width: '12%', textAlign: 'center' },
  col5: { width: '12.5%', textAlign: 'right' },
  col6: { width: '12.5%', textAlign: 'right', borderRight: 'none' },
  totalsContainerWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalsContainer: {
    width: '40%',
    border: '1px solid #00A6A6',
    borderRadius: 6,
    backgroundColor: '#F4FAF9',
    overflow: 'hidden',
  },
  totalRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #BFE8E8', // Soft teal line
  },
  totalLabel: {
    width: '60%',
    padding: 6,
    borderRight: '1px solid #BFE8E8',
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 8,
    color: '#0B3B3F',
  },
  totalValue: {
    width: '40%',
    padding: 6,
    textAlign: 'right',
    fontSize: 8,
    fontWeight: 'bold',
  },
  footerText: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 7,
    color: '#9CA3AF',
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
        
        {/* HEADER */}
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            {logoBase64 ? (
              <Image src={logoBase64} style={styles.logo} />
            ) : (
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>F&D INGENIERÍA</Text>
            )}
            <Text style={styles.companyInfo}>{data.senderCompany}</Text>
            <Text style={styles.companyInfo}>Giro: Servicios de Ingeniería en Mantenimiento</Text>
            <Text style={styles.companyInfo}>Email: {data.senderEmail}</Text>
            <Text style={styles.companyInfo}>Ejecutivo: {data.senderName}</Text>
          </View>
          
          <View style={styles.folioBox}>
            <Text style={styles.folioTextRut}>R.U.T.: {data.senderRut}</Text>
            <Text style={styles.folioTextTitle}>COTIZACIÓN</Text>
            <Text style={styles.folioTextNumber}>Nº {data.quoteNumber}</Text>
          </View>
        </View>

        {/* CLIENT INFO BOX */}
        <View style={styles.clientBox}>
          <View style={styles.clientLeft}>
            <View style={styles.row}>
              <Text style={styles.label}>SEÑOR(ES):</Text>
              <Text style={styles.value}>{data.clientName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>EMPRESA:</Text>
              <Text style={styles.value}>{data.clientCompany || 'Independiente'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>EMAIL:</Text>
              <Text style={styles.value}>{data.clientEmail}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>TELÉFONO:</Text>
              <Text style={styles.value}>{data.clientPhone || 'No registrado'}</Text>
            </View>
          </View>
          <View style={styles.clientRight}>
            <View style={styles.row}>
              <Text style={styles.label}>FECHA:</Text>
              <Text style={styles.value}>{new Date(data.date).toLocaleDateString('es-CL')}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>VALIDEZ:</Text>
              <Text style={styles.value}>{data.validityDays} días corridos</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>PAGO:</Text>
              <Text style={styles.value}>{data.paymentTerms}</Text>
            </View>
          </View>
        </View>

        {/* SERVICE DESCRIPTION */}
        <View style={styles.serviceTitleBox}>
          <Text style={styles.serviceTitle}>Referencia: {data.serviceName}</Text>
          <Text style={styles.serviceDesc}>{data.requirements}</Text>
        </View>

        {/* TABLE */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.col1]}>N°</Text>
            <Text style={[styles.tableHeaderCell, styles.col2]}>Descripción</Text>
            <Text style={[styles.tableHeaderCell, styles.col3]}>Cant.</Text>
            <Text style={[styles.tableHeaderCell, styles.col4]}>Unidad</Text>
            <Text style={[styles.tableHeaderCell, styles.col5]}>Precio</Text>
            <Text style={[styles.tableHeaderCell, styles.col6, { borderRight: 'none' }]}>Valor</Text>
          </View>
          
          {items.map((item: any, i: number) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.col1]}>{i + 1}</Text>
              <Text style={[styles.tableCell, styles.col2]}>{item.detail}</Text>
              <Text style={[styles.tableCell, styles.col3]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, styles.col4]}>{item.unit}</Text>
              <Text style={[styles.tableCell, styles.col5]}>${item.unitPrice.toLocaleString('es-CL')}</Text>
              <Text style={[styles.tableCell, styles.col6, { borderRight: 'none' }]}>${(item.quantity * item.unitPrice).toLocaleString('es-CL')}</Text>
            </View>
          ))}
        </View>

        {/* TOTALS & BANK DETAILS */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }} wrap={false}>
          {/* BANK DETAILS */}
          <View style={{ width: '50%', fontSize: 9, color: '#4B5563', lineHeight: 1.5, padding: 10, backgroundColor: '#F3F4F6', borderRadius: 4 }}>
            <Text style={{ fontWeight: 'bold', color: '#0B3B3F', marginBottom: 4, fontSize: 10 }}>Datos para Transferencia:</Text>
            <Text>Razón Social: INGENIERÍA EN MANTENIMIENTO F&D SpA</Text>
            <Text>R.U.T: 78.243.503-5</Text>
            <Text>Banco: Banco de Chile</Text>
            <Text>Tipo de Cuenta: Cuenta Vista</Text>
            <Text>N° de Cuenta: 00-004-37252-65</Text>
            <Text>Correo: Contacto@fydingenieria.cl</Text>
          </View>
          
          {/* TOTALS */}
          <View style={[styles.totalsContainerWrapper, { marginTop: 0, width: '45%' }]}>
            <View style={[styles.totalsContainer, { width: '100%' }]}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>MONTO NETO</Text>
                <Text style={styles.totalValue}>$ {data.subtotal.toLocaleString('es-CL')}</Text>
              </View>
              {data.discountPercent > 0 && (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>DESCUENTO ({data.discountPercent}%)</Text>
                  <Text style={[styles.totalValue, { color: '#E53E3E' }]}>-$ {(data.subtotal * (data.discountPercent / 100)).toLocaleString('es-CL')}</Text>
                </View>
              )}
              {data.iva > 0 ? (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>I.V.A. 19%</Text>
                  <Text style={styles.totalValue}>$ {data.iva.toLocaleString('es-CL')}</Text>
                </View>
              ) : (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>I.V.A. (Exento)</Text>
                  <Text style={styles.totalValue}>$ 0</Text>
                </View>
              )}
              <View style={[styles.totalRow, { borderBottom: 'none' }]}>
                <Text style={styles.totalLabel}>TOTAL</Text>
                <Text style={styles.totalValue}>$ {data.total.toLocaleString('es-CL')}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* FOOTER */}
        <Text style={styles.footerText} fixed>
          Documento generado oficialmente por F&D Ingeniería en Mantenimiento SpA | www.fydingenieria.cl
        </Text>

      </Page>
    </Document>
  );
};
