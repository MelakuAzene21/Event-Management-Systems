import { useState } from "react";
import QrReader from "react-qr-scanner";

const ScanQR = () => {
    const [scanResult, setScanResult] = useState(null);

    const handleScan = (data) => {
        if (data) {
            setScanResult(data.text);
        }
    };

    const handleError = (err) => {
        console.error("Error scanning QR code:", err);
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold mb-4">Scan QR Code</h2>
            <QrReader delay={300} onError={handleError} onScan={handleScan} style={{ width: "100%" }} />
            {scanResult && (
                <p className="mt-4 text-green-600 font-bold">Scanned Data: {scanResult}</p>
            )}
        </div>
    );
};

export default ScanQR;
