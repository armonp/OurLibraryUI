import React, { useEffect, useRef, useState } from "react";
import { Modal, Box, Typography, Button, Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  BrowserMultiFormatReader,
  IScannerControls,
} from "@zxing/browser";
import { BarcodeFormat, DecodeHintType, NotFoundException } from "@zxing/library";

interface BarcodeScannerModalProps {
  open: boolean;
  onClose: () => void;
  onDetected: (isbn: string) => void;
}

// ISBN barcodes (Bookland EAN) are printed as EAN-13; older US-only stock
// sometimes still carries a UPC-A supplement, so we accept both.
const hints = new Map();
hints.set(DecodeHintType.POSSIBLE_FORMATS, [
  BarcodeFormat.EAN_13,
  BarcodeFormat.UPC_A,
]);

const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  open,
  onClose,
  onDetected,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setError(null);
    const reader = new BrowserMultiFormatReader(hints);
    let cancelled = false;

    const start = async () => {
      // decodeFromVideoDevice(undefined, ...) defaults to a
      // `facingMode: 'environment'` (rear-camera) constraint, which a
      // MacBook has no match for - some browsers then hand back a
      // "successful" stream that never produces real frames, showing as a
      // black preview even though permission was granted. Enumerate the
      // actual cameras instead and request one directly.
      let deviceId: string | undefined;
      try {
        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        const preferred =
          devices.find((d) => /back|rear|environment/i.test(d.label)) ??
          devices[0];
        deviceId = preferred?.deviceId || undefined;
      } catch (err) {
        console.warn("Could not enumerate video devices:", err);
      }

      if (cancelled) return;

      try {
        const controls = await reader.decodeFromConstraints(
          { video: deviceId ? { deviceId: { exact: deviceId } } : true },
          videoRef.current!,
          (result, err) => {
            if (cancelled) return;
            if (result) {
              controlsRef.current?.stop();
              onDetected(result.getText());
            } else if (err && !(err instanceof NotFoundException)) {
              // NotFoundException fires continuously while no barcode is in
              // frame yet - that's expected, not a real error.
              console.error("Barcode scan error:", err);
            }
          }
        );

        if (cancelled) {
          controls.stop();
        } else {
          controlsRef.current = controls;
        }
      } catch (err: any) {
        console.error("Could not start camera:", err);
        setError(
          err?.name === "NotAllowedError"
            ? "Camera access was denied. Allow camera access in your browser settings and try again."
            : err?.name === "NotFoundError"
            ? "No camera was found on this device."
            : "Could not start the camera. Please try again."
        );
      }
    };

    start();

    return () => {
      cancelled = true;
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
  }, [open, onDetected]);

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="barcode-scanner-modal">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
          width: { xs: "92%", sm: 480 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Scan a Barcode</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Point your camera at the book's barcode (the ISBN, usually on the
              back cover).
            </Typography>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                borderRadius: 1,
                overflow: "hidden",
                bgcolor: "black",
              }}
            >
              <video
                ref={videoRef}
                style={{ width: "100%", display: "block" }}
                muted
                playsInline
              />
            </Box>
          </>
        )}

        <Button
          variant="outlined"
          fullWidth
          onClick={onClose}
          sx={{ mt: 2 }}
        >
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};

export default BarcodeScannerModal;
