/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║           KISAN KAVACH — ON-DEVICE INFERENCE LAYER                  ║
 * ║                                                                      ║
 * ║  Current implementation: TensorFlow.js (MobileNet) — WebGL/CPU      ║
 * ║  Runs 100% client-side, zero cloud calls.                            ║
 * ║                                                                      ║
 * ║  ──────────────────────────────────────────────────────────────────  ║
 * ║  PRODUCTION SWAP (Qualcomm AI Hub / Snapdragon NPU):                 ║
 * ║                                                                      ║
 * ║  1. Replace TF.js MobileNet with a QNN-optimized PlantVillage        ║
 * ║     model exported via Qualcomm AI Hub:                              ║
 * ║       - Model: PlantVillage (38-class, EfficientNet-lite)            ║
 * ║       - Format: .dlc (Qualcomm Deep Learning Container)              ║
 * ║       - Runtime: Qualcomm Neural Networks SDK (QNN)                  ║
 * ║       - Target: Hexagon NPU on Snapdragon X Elite                    ║
 * ║                                                                      ║
 * ║  2. Replace loadModel() / runInference() with:                       ║
 * ║       import { QNNModel } from '@qualcomm-ai-hub/qnn-runtime';       ║
 * ║       const model = await QNNModel.load('plant_disease.dlc');        ║
 * ║       const results = await model.infer(imageData);                  ║
 * ║                                                                      ║
 * ║  3. Expected NPU speedup: ~10-15x vs WebGL, ~40x vs CPU             ║
 * ║     Power: ~0.5W vs 15W for equivalent GPU inference                 ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { DISEASE_DB } from './cropDiseaseData';

// ─── Model State ─────────────────────────────────────────────────────────────
let _model = null;
let _modelLoadPromise = null;
let _isLoading = false;

/**
 * Lifecycle callbacks for UI updates
 */
export const ModelStatus = {
  IDLE:    'idle',
  LOADING: 'loading',
  READY:   'ready',
  ERROR:   'error',
};

// ─── Model Loader ─────────────────────────────────────────────────────────────
/**
 * Loads the MobileNet model (lazy, cached).
 *
 * PRODUCTION NOTE: Replace this entire function body with QNN model loading:
 *   const model = await QNNModel.load('./models/plant_disease_qnn.dlc', {
 *     runtime: 'HTP',  // Hexagon Tensor Processor
 *     precision: 'int8',
 *   });
 */
export async function loadModel(onStatusChange) {
  if (_model) {
    onStatusChange?.(ModelStatus.READY);
    return _model;
  }

  if (_modelLoadPromise) {
    return _modelLoadPromise;
  }

  _isLoading = true;
  onStatusChange?.(ModelStatus.LOADING);

  _modelLoadPromise = (async () => {
    try {
      // Ensure TF.js backend is initialized (WebGL preferred, fallback CPU)
      await tf.ready();
      console.info(`[KisanKavach] TF.js backend: ${tf.getBackend()}`);

      // Load MobileNet (v2, alpha=0.5 for speed — simulates lightweight NPU model)
      // PRODUCTION SWAP ↓ — Replace with QNN runtime model load
      _model = await mobilenet.load({ version: 2, alpha: 0.5 });

      console.info('[KisanKavach] Model loaded successfully (on-device, 0 data sent to cloud)');
      onStatusChange?.(ModelStatus.READY);
      return _model;
    } catch (err) {
      _modelLoadPromise = null;
      _isLoading = false;
      onStatusChange?.(ModelStatus.ERROR);
      throw err;
    }
  })();

  return _modelLoadPromise;
}

// ─── Inference Logic ──────────────────────────────────────────────────────────
/**
 * Runs on-device inference on an HTMLImageElement.
 *
 * Returns a structured result matching our disease database.
 *
 * PRODUCTION SWAP: Replace the classify() call with:
 *   const rawOutput = await qnnModel.infer(imageData);  // Int8 tensor
 *   const predictions = softmax(rawOutput).map((score, i) => ({
 *     className: PLANT_VILLAGE_LABELS[i], probability: score
 *   }));
 */
export async function runInference(imageElement, onStatusChange) {
  const model = await loadModel(onStatusChange);

  // ── Step 1: Get MobileNet top-5 predictions ──────────────────────────
  // PRODUCTION SWAP ↓ — Replace with QNN infer() call
  const predictions = await model.classify(imageElement, 5);
  console.info('[KisanKavach] Raw predictions:', predictions);

  // ── Step 2: Map ImageNet labels → Crop Disease Categories ────────────
  // This is the DEMO SIMULATION LAYER.
  // In production, PlantVillage model outputs disease labels directly.
  const diseaseResult = mapPredictionToDisease(predictions);
  
  return diseaseResult;
}

// ─── Label Mapping (Demo Simulation Layer) ────────────────────────────────────
/**
 * Maps generic MobileNet/ImageNet predictions to crop disease categories.
 *
 * DEMO NOTE: This mapping is for hackathon demonstration purposes.
 * In production, the QNN-optimized PlantVillage model would output
 * one of 38 disease class labels directly without this mapping layer.
 *
 * PlantVillage classes include:
 *   Apple___Apple_scab, Tomato___Late_blight, Corn___Common_rust, etc.
 */
function mapPredictionToDisease(predictions) {
  const topPred = predictions[0];
  const allLabels = predictions.map(p => p.className.toLowerCase()).join(' ');
  const topConf = topPred.probability;

  // ── Keyword Mapping Rules ──────────────────────────────────────────────
  // Plant/leaf/nature detected → map to specific diseases
  if (containsAny(allLabels, ['leaf', 'plant', 'herb', 'fern', 'grass', 'vine', 'flower', 'daisy', 'dandelion', 'corn', 'cabbage', 'broccoli', 'cucumber'])) {
    return buildResult('leaf_blight', topConf * 0.88 + 0.05, predictions);
  }

  if (containsAny(allLabels, ['rust', 'orange', 'brown', 'stain'])) {
    return buildResult('rust', topConf * 0.82 + 0.08, predictions);
  }

  if (containsAny(allLabels, ['white', 'mildew', 'powder', 'dust'])) {
    return buildResult('powdery_mildew', topConf * 0.79 + 0.10, predictions);
  }

  if (containsAny(allLabels, ['spot', 'dot', 'mark', 'blemish'])) {
    return buildResult('leaf_spot', topConf * 0.75 + 0.12, predictions);
  }

  if (containsAny(allLabels, ['yellow', 'mosaic', 'pattern', 'stripe'])) {
    return buildResult('mosaic_virus', topConf * 0.72 + 0.08, predictions);
  }

  if (containsAny(allLabels, ['wilt', 'droop', 'dead', 'dry', 'hay', 'straw'])) {
    return buildResult('wilt', topConf * 0.70 + 0.15, predictions);
  }

  // High-confidence "healthy" indicators
  if (topConf > 0.6 && containsAny(allLabels, ['garden', 'green', 'fresh', 'field', 'farm'])) {
    return buildResult('healthy', topConf * 0.85 + 0.05, predictions);
  }

  // Medium confidence — simulate a disease detection for demo
  if (topConf > 0.3) {
    const diseaseKeys = ['leaf_blight', 'rust', 'powdery_mildew', 'leaf_spot'];
    const idx = Math.floor(predictions[0].className.charCodeAt(0) % diseaseKeys.length);
    return buildResult(diseaseKeys[idx], 0.62 + Math.random() * 0.2, predictions);
  }

  // Low confidence → unknown
  return buildResult('unknown', topConf, predictions);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function containsAny(text, keywords) {
  return keywords.some(kw => text.includes(kw));
}

function buildResult(diseaseKey, confidence, rawPredictions) {
  const disease = DISEASE_DB[diseaseKey] || DISEASE_DB.unknown;
  const clampedConf = Math.min(0.97, Math.max(0.45, confidence));

  return {
    diseaseKey,
    disease,
    confidence: clampedConf,
    confidencePercent: Math.round(clampedConf * 100),
    rawPredictions: rawPredictions.slice(0, 3),
    inferenceMode: 'TensorFlow.js (Demo — WebGL/CPU)',
    // PRODUCTION SWAP: inferenceMode: 'Qualcomm QNN — Hexagon NPU'
    timestamp: Date.now(),
    isSimulated: true, // DEMO FLAG — remove in production
  };
}

/**
 * Get current model status
 */
export function getModelStatus() {
  if (_model) return ModelStatus.READY;
  if (_isLoading) return ModelStatus.LOADING;
  return ModelStatus.IDLE;
}

/**
 * Dispose model to free memory (call on component unmount if needed)
 */
export function disposeModel() {
  if (_model) {
    // MobileNet doesn't expose dispose, but TF.js tensors can be cleaned
    tf.disposeVariables();
    _model = null;
    _modelLoadPromise = null;
    _isLoading = false;
  }
}
