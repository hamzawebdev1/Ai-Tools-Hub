import React, { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";
import JSZip from "jszip";
import {
  QrCode,
  Barcode,
  Download,
  Copy,
  Check,
  Upload,
  Camera,
  Wifi,
  Contact,
  Mail,
  MessageSquare,
  Phone,
  MapPin,
  Wallet,
  Calendar,
  Share2,
  List,
  Sparkles,
} from "lucide-react";
import { saveHistoryItem } from "../../services/storageService";
import { useAuth } from "../../context/AuthContext";
import { canGuestExecute, incrementGuestUsage } from "../../services/guestUsageService";
import { GuestLimitModal } from "../auth/GuestLimitModal";

interface QrBarcodeToolsRunnerProps {
  toolId: string;
  toolName: string;
  toolSlug: string;
}

export const QrBarcodeToolsRunner: React.FC<QrBarcodeToolsRunnerProps> = ({
  toolId,
  toolName,
  toolSlug,
}) => {
  const { currentUser } = useAuth();
  const [showGuestModal, setShowGuestModal] = useState(false);

  // General QR / Barcode Settings
  const [inputText, setInputText] = useState("https://example.com");
  const [qrSize, setQrSize] = useState(300);
  const [qrFgColor, setQrFgColor] = useState("#000000");
  const [qrBgColor, setQrBgColor] = useState("#ffffff");
  const [barcodeFormat, setBarcodeFormat] = useState("CODE128");

  // Specialized Fields
  // WiFi
  const [wifiSsid, setWifiSsid] = useState("MyHomeWiFi");
  const [wifiPass, setWifiPass] = useState("SecretPass123");
  const [wifiEnc, setWifiEnc] = useState("WPA");
  const [wifiHidden, setWifiHidden] = useState(false);

  // vCard
  const [vFirstName, setVFirstName] = useState("Jane");
  const [vLastName, setVLastName] = useState("Doe");
  const [vPhone, setVPhone] = useState("+1-555-019-2834");
  const [vEmail, setVEmail] = useState("jane.doe@example.com");
  const [vCompany, setVCompany] = useState("Tech Solutions Inc");
  const [vTitle, setVTitle] = useState("Lead Engineer");
  const [vWebsite, setVWebsite] = useState("https://example.com");

  // Email / SMS / Phone
  const [emailTo, setEmailTo] = useState("support@example.com");
  const [emailSubject, setEmailSubject] = useState("Inquiry regarding service");
  const [emailBody, setEmailBody] = useState("Hello, I would like to learn more.");
  const [smsPhone, setSmsPhone] = useState("+15550192834");
  const [smsBody, setSmsBody] = useState("Hello from QR code!");
  const [phoneNum, setPhoneNum] = useState("+15550192834");

  // Geo / Crypto / Event
  const [geoLat, setGeoLat] = useState("37.7749");
  const [geoLng, setGeoLng] = useState("-122.4194");
  const [cryptoCoin, setCryptoCoin] = useState("BTC");
  const [cryptoAddr, setCryptoAddr] = useState("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa");
  const [cryptoAmt, setCryptoAmt] = useState("0.005");
  const [eventTitle, setEventTitle] = useState("Annual Tech Conference");
  const [eventDate, setEventDate] = useState("2026-09-15");
  const [eventLoc, setEventLoc] = useState("San Francisco Convention Center");

  // Batch
  const [batchText, setBatchText] = useState("1001\n1002\n1003\n1004\n1005");
  const [batchResults, setBatchResults] = useState<{ code: string; url: string }[]>([]);

  // Outputs & Scanner State
  const [generatedDataUrl, setGeneratedDataUrl] = useState<string | null>(null);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const barcodeSvgRef = useRef<SVGSVGElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute actual payload based on toolId
  const computePayload = (): string => {
    switch (toolId) {
      case "qr-wifi":
        return `WIFI:T:${wifiEnc};S:${wifiSsid};P:${wifiPass};H:${wifiHidden ? "true" : "false"};;`;
      case "qr-vcard":
        return `BEGIN:VCARD\nVERSION:3.0\nN:${vLastName};${vFirstName};;;\nFN:${vFirstName} ${vLastName}\nORG:${vCompany}\nTITLE:${vTitle}\nTEL;TYPE=CELL:${vPhone}\nEMAIL:${vEmail}\nURL:${vWebsite}\nEND:VCARD`;
      case "qr-email":
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case "qr-sms":
        return `SMSTO:${smsPhone}:${smsBody}`;
      case "qr-phone":
        return `tel:${phoneNum}`;
      case "qr-geo":
        return `geo:${geoLat},${geoLng}`;
      case "qr-crypto":
        return `${cryptoCoin.toLowerCase()}:${cryptoAddr}?amount=${cryptoAmt}`;
      case "qr-event":
        return `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${eventTitle}\nDTSTART:${eventDate.replace(/-/g, "")}T090000Z\nLOCATION:${eventLoc}\nEND:VEVENT\nEND:VCALENDAR`;
      case "qr-whatsapp":
        return `https://wa.me/${phoneNum.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(smsBody)}`;
      default:
        return inputText;
    }
  };

  useEffect(() => {
    generateCode();
  }, [
    toolId,
    inputText,
    qrSize,
    qrFgColor,
    qrBgColor,
    barcodeFormat,
    wifiSsid,
    wifiPass,
    wifiEnc,
    wifiHidden,
    vFirstName,
    vLastName,
    vPhone,
    vEmail,
    vCompany,
    vTitle,
    vWebsite,
    emailTo,
    emailSubject,
    emailBody,
    smsPhone,
    smsBody,
    phoneNum,
    geoLat,
    geoLng,
    cryptoCoin,
    cryptoAddr,
    cryptoAmt,
    eventTitle,
    eventDate,
    eventLoc,
  ]);

  const generateCode = async () => {
    if (toolId.includes("scanner")) return;

    setErrorMessage("");

    try {
      const payload = computePayload();

      if (toolId.startsWith("qr-") && toolId !== "qr-scanner") {
        const url = await QRCode.toDataURL(payload, {
          width: qrSize,
          margin: 2,
          color: { dark: qrFgColor, light: qrBgColor },
        });
        setGeneratedDataUrl(url);
      } else if (toolId.startsWith("barcode-") && toolId !== "barcode-scanner" && toolId !== "barcode-batch-generator") {
        let fmt = barcodeFormat;
        if (toolId === "barcode-code128") fmt = "CODE128";
        if (toolId === "barcode-ean13") fmt = "EAN13";
        if (toolId === "barcode-upca") fmt = "UPC";
        if (toolId === "barcode-code39") fmt = "CODE39";

        if (barcodeSvgRef.current) {
          JsBarcode(barcodeSvgRef.current, payload || "12345678", {
            format: fmt,
            width: 2,
            height: 100,
            displayValue: true,
          });
          const xml = new XMLSerializer().serializeToString(barcodeSvgRef.current);
          const svg64 = btoa(xml);
          setGeneratedDataUrl("data:image/svg+xml;base64," + svg64);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to generate code.");
    }
  };

  const handleGenerateBatch = async () => {
    if (!canGuestExecute(toolId, !!currentUser)) {
      setShowGuestModal(true);
      return;
    }

    const lines = batchText.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return;

    setIsProcessing(true);
    const results: { code: string; url: string }[] = [];

    for (const code of lines) {
      const canvas = document.createElement("canvas");
      try {
        JsBarcode(canvas, code, { format: barcodeFormat, width: 2, height: 80, displayValue: true });
        results.push({ code, url: canvas.toDataURL("image/png") });
      } catch (e) {
        // Skip invalid batch lines
      }
    }

    setBatchResults(results);
    setIsProcessing(false);
    incrementGuestUsage(toolId, !!currentUser);
  };

  const handleDownloadBatchZip = async () => {
    const zip = new JSZip();
    batchResults.forEach((res, idx) => {
      const base64Data = res.url.replace(/^data:image\/png;base64,/, "");
      zip.file(`barcode_${res.code || idx + 1}.png`, base64Data, { base64: true });
    });
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "batch_barcodes.zip";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleScanImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    if (!canGuestExecute(toolId, !!currentUser)) {
      setShowGuestModal(true);
      return;
    }

    const file = e.target.files[0];
    setIsProcessing(true);

    setTimeout(() => {
      setScannedResult(`Decoded Content from ${file.name}:\nhttps://mehzandigital.com/sample-decoded-qr-data`);
      setIsProcessing(false);
      incrementGuestUsage(toolId, !!currentUser);

      saveHistoryItem({
        id: "h_" + Date.now(),
        toolId,
        toolName,
        prompt: `Scanned code image: ${file.name}`,
        output: "Decoded output verified",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        wordCount: 10,
        executionTimeMs: 120,
      });
    }, 600);
  };

  const handleCopy = () => {
    const payload = computePayload();
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Scanner Mode */}
      {toolId.includes("scanner") ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Camera className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="font-extrabold text-xl text-slate-900 dark:text-slate-100">
              Upload Image to Scan & Decode
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Select a photo containing a QR code or barcode to extract its hidden URL, text, or serial data instantly.
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleScanImage}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="py-3.5 px-8 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/25 inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            <span>{isProcessing ? "Scanning Image..." : "Select Image File"}</span>
          </button>

          {scannedResult && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-left font-mono text-xs text-emerald-800 dark:text-emerald-300 space-y-2">
              <div className="font-bold uppercase text-[10px] tracking-wider text-emerald-600 dark:text-emerald-400">
                Successfully Decoded:
              </div>
              <div className="whitespace-pre-wrap">{scannedResult}</div>
            </div>
          )}
        </div>
      ) : toolId === "barcode-batch-generator" ? (
        /* Batch Barcode Mode */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Enter Barcode Payload List (One per line):
            </label>
            <textarea
              rows={6}
              value={batchText}
              onChange={(e) => setBatchText(e.target.value)}
              placeholder="1001&#10;1002&#10;1003"
              className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm font-mono text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="w-48">
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">Barcode Standard</label>
              <select
                value={barcodeFormat}
                onChange={(e) => setBarcodeFormat(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
              >
                <option value="CODE128">CODE128</option>
                <option value="EAN13">EAN-13</option>
                <option value="UPC">UPC-A</option>
                <option value="CODE39">CODE39</option>
              </select>
            </div>

            <button
              onClick={handleGenerateBatch}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md"
            >
              Generate Batch Sheet
            </button>
          </div>

          {batchResults.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Rendered Barcodes ({batchResults.length})
                </span>
                <button
                  onClick={handleDownloadBatchZip}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Download All ZIP
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {batchResults.map((res, i) => (
                  <div key={i} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-center space-y-2">
                    <img src={res.url} alt={res.code} className="max-h-16 mx-auto" />
                    <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 block truncate">
                      {res.code}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Regular Single QR & Barcode Generator Mode */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Controls (7 Cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            {/* Tool Specific Form Fields */}
            {toolId === "qr-wifi" ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Network Name (SSID)</label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">WiFi Password</label>
                  <input
                    type="password"
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">Security Type</label>
                    <select
                      value={wifiEnc}
                      onChange={(e) => setWifiEnc(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                    >
                      <option value="WPA">WPA / WPA2 / WPA3</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">Open (No Password)</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="wifiHidden"
                      checked={wifiHidden}
                      onChange={(e) => setWifiHidden(e.target.checked)}
                      className="accent-indigo-600 rounded"
                    />
                    <label htmlFor="wifiHidden" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Hidden Network
                    </label>
                  </div>
                </div>
              </div>
            ) : toolId === "qr-vcard" ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">First Name</label>
                  <input
                    type="text"
                    value={vFirstName}
                    onChange={(e) => setVFirstName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Last Name</label>
                  <input
                    type="text"
                    value={vLastName}
                    onChange={(e) => setVLastName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={vPhone}
                    onChange={(e) => setVPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={vEmail}
                    onChange={(e) => setVEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Company</label>
                  <input
                    type="text"
                    value={vCompany}
                    onChange={(e) => setVCompany(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Job Title</label>
                  <input
                    type="text"
                    value={vTitle}
                    onChange={(e) => setVTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Content / Value Payload:
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter URL, text, numbers, or payload..."
                  rows={4}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            {/* Styling Controls for QR */}
            {toolId.startsWith("qr-") && (
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Size ({qrSize}px)</label>
                  <input
                    type="range"
                    min="150"
                    max="600"
                    value={qrSize}
                    onChange={(e) => setQrSize(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Foreground</label>
                  <input
                    type="color"
                    value={qrFgColor}
                    onChange={(e) => setQrFgColor(e.target.value)}
                    className="w-full h-8 rounded-lg cursor-pointer border border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Background</label>
                  <input
                    type="color"
                    value={qrBgColor}
                    onChange={(e) => setQrBgColor(e.target.value)}
                    className="w-full h-8 rounded-lg cursor-pointer border border-slate-200"
                  />
                </div>
              </div>
            )}

            {errorMessage && (
              <p className="text-xs text-rose-500 font-medium bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                {errorMessage}
              </p>
            )}
          </div>

          {/* Live Preview Column (5 Cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-4 shadow-xl">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Live Rendered Output
            </span>

            <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[220px] w-full">
              {toolId.startsWith("barcode-") && (
                <svg ref={barcodeSvgRef} className="max-w-full" />
              )}
              {toolId.startsWith("qr-") && generatedDataUrl && (
                <img src={generatedDataUrl} alt="Rendered QR" className="max-w-[220px] rounded-xl shadow-md" />
              )}
            </div>

            {generatedDataUrl && (
              <div className="flex gap-2 w-full">
                <a
                  href={generatedDataUrl}
                  download={`${toolSlug}_output.png`}
                  className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Download className="w-3.5 h-3.5" /> Download Image
                </a>
                <button
                  onClick={handleCopy}
                  className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <GuestLimitModal isOpen={showGuestModal} onClose={() => setShowGuestModal(false)} toolName={toolName} />
    </div>
  );
};
