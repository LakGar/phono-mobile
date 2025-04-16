import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Dimensions,
  Platform,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useRouter } from "expo-router";
import { searchDiscogs } from "@/services/discogs";

const { width } = Dimensions.get("window");

export default function QR() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [barcode, setBarcode] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);
    try {
      const results = await searchDiscogs(data);
      if (results.length > 0) {
        router.push({
          pathname: "/record/[id]",
          params: { id: results[0].id },
        });
      } else {
        Alert.alert("Not Found", "Record not found in Discogs database");
      }
    } catch (error) {
      console.error("Error scanning barcode:", error);
      Alert.alert("Error", "Failed to search for record");
    }
  };

  const handleManualEntry = async () => {
    if (!barcode) {
      Alert.alert("Error", "Please enter a valid barcode");
      return;
    }

    try {
      const results = await searchDiscogs(barcode);
      if (results.length > 0) {
        setShowManualEntry(false);
        router.push({
          pathname: "/record/[id]",
          params: { id: results[0].id },
        });
      } else {
        Alert.alert("Not Found", "Record not found in Discogs database");
      }
    } catch (error) {
      console.error("Error with manual entry:", error);
      Alert.alert("Error", "Failed to search for record");
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowManualEntry(true)}
        >
          <Text style={styles.buttonText}>Enter Barcode Manually</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e"],
        }}
        style={styles.camera}
      >
        <View style={styles.overlay}>
          <View style={styles.scanArea} />
          <Text style={styles.overlayText}>Scan a record barcode</Text>
        </View>
      </CameraView>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setShowManualEntry(true)}
        >
          <IconSymbol name="keyboard" size={24} color="#FFFFFF" />
          <Text style={styles.controlButtonText}>Manual Entry</Text>
        </TouchableOpacity>

        {scanned && (
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setScanned(false)}
          >
            <IconSymbol name="arrow.clockwise" size={24} color="#FFFFFF" />
            <Text style={styles.controlButtonText}>Scan Again</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={showManualEntry}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowManualEntry(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setShowManualEntry(false)}
                style={styles.closeButton}
              >
                <IconSymbol name="xmark" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Enter Barcode</Text>
              <View style={styles.closeButton} />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Record Barcode</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter barcode number"
                placeholderTextColor="#666666"
                value={barcode}
                onChangeText={setBarcode}
                keyboardType="numeric"
                autoFocus
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleManualEntry}
            >
              <Text style={styles.submitButtonText}>Search</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanArea: {
    width: width * 0.7,
    height: width * 0.7,
    borderWidth: 2,
    borderColor: "#1DB954",
    borderRadius: 20,
  },
  overlayText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
  },
  controls: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  controlButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 120,
  },
  controlButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },
  modalContent: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? 60 : 20,
    marginBottom: 40,
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    marginBottom: 40,
  },
  inputLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 15,
    color: "#FFFFFF",
    fontSize: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  submitButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#1DB954",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
