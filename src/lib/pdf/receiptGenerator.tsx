import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 12, fontFamily: "Helvetica" },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: "#000",
        borderBottomStyle: "solid",
        paddingBottom: 10,
    },
    title: { fontSize: 18, fontWeight: "bold", color: "#1a1a1a" },
    section: { marginBottom: 10 },
    row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
    label: { fontWeight: "bold", color: "#555" },
    value: { color: "#000" },
    footer: {
        marginTop: 40,
        borderTopWidth: 1,
        borderTopColor: "#ccc",
        borderTopStyle: "solid",
        paddingTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    stamp: { textAlign: "right", fontSize: 10, color: "#888" },
});

export interface ReceiptData {
    receiptNo: string;
    date: string;
    studentName: string;
    studentId: string;
    courseName: string;
    amount: number;
    paymentMode: string;
    academyName: string;
}

export const ReceiptDocument = ({ data }: { data: ReceiptData }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>{data.academyName}</Text>
                    <Text style={{ fontSize: 10, color: "#666", marginTop: 4 }}>
                        Official Fee Receipt
                    </Text>
                </View>
                <View style={{ textAlign: "right" }}>
                    <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                        Receipt No: {data.receiptNo}
                    </Text>
                    <Text style={{ fontSize: 10, color: "#666", marginTop: 4 }}>
                        Date: {data.date}
                    </Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text
                    style={{
                        fontSize: 14,
                        fontWeight: "bold",
                        marginBottom: 10,
                        color: "#2563eb",
                    }}
                >
                    Student Details
                </Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.value}>{data.studentName}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Student ID:</Text>
                    <Text style={styles.value}>{data.studentId}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Course:</Text>
                    <Text style={styles.value}>{data.courseName}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text
                    style={{
                        fontSize: 14,
                        fontWeight: "bold",
                        marginBottom: 10,
                        color: "#2563eb",
                    }}
                >
                    Payment Details
                </Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Amount Paid:</Text>
                    <Text style={{ ...styles.value, fontSize: 14, fontWeight: "bold" }}>
                        Rs. {data.amount.toFixed(2)}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Payment Mode:</Text>
                    <Text style={styles.value}>{data.paymentMode.toUpperCase()}</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <Text style={styles.stamp}>This is a computer-generated receipt.</Text>
                <View style={{ textAlign: "right" }}>
                    <Text style={{ fontWeight: "bold" }}>Authorized Signatory</Text>
                    <Text style={{ fontSize: 10, color: "#888" }}>{data.academyName}</Text>
                </View>
            </View>
        </Page>
    </Document>
);

export async function generateReceiptBuffer(data: ReceiptData): Promise<Buffer> {
    const instance = pdf(<ReceiptDocument data={data} />);
    const stream = await instance.toBuffer();

    const chunks: Buffer[] = [];
    for await (const chunk of stream as any) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
}