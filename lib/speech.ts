// Tipe minimal Web Speech API — belum standar penuh di semua browser, jadi
// TypeScript's lib.dom tidak menyertakannya. Deklarasi ini cukup untuk yang
// dipakai di sini (Chrome/Edge desktop & Android mendukung; Firefox & Safari
// lama tidak — karenanya selalu dicek lewat `isSpeechSupported()` dulu).
type SpeechRecognitionResultLike = { transcript: string };
type SpeechRecognitionResultList = ArrayLike<ArrayLike<SpeechRecognitionResultLike>>;
type SpeechRecognitionEventLike = { resultIndex: number; results: SpeechRecognitionResultList };
type SpeechRecognitionErrorEventLike = { error: string };

interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export function isSpeechSupported() {
  return typeof window !== "undefined" && Boolean(window.SpeechRecognition ?? window.webkitSpeechRecognition);
}

export type SpeechController = {
  stop: () => void;
};

/**
 * Mulai pengenalan suara Bahasa Indonesia. `onUpdate` dipanggil berulang
 * dengan transkrip berjalan (interim + final); `onDone` dipanggil sekali
 * saat sesi berhenti (manual atau otomatis oleh browser).
 */
export function startListening(
  onUpdate: (transcript: string, isFinal: boolean) => void,
  onDone: () => void,
  onError: (message: string) => void,
): SpeechController | null {
  const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
  if (!Ctor) {
    onError("Browser ini tidak mendukung input suara.");
    return null;
  }

  const recognition = new Ctor();
  recognition.lang = "id-ID";
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event) => {
    let finalText = "";
    let interimText = "";
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const result = event.results[i][0];
      // `isFinal` ada di objek SpeechRecognitionResult asli tapi tidak masuk
      // tipe minimal di atas — baca lewat cast tipis, aman secara runtime.
      const isFinal = Boolean((event.results[i] as unknown as { isFinal?: boolean }).isFinal);
      if (isFinal) finalText += result.transcript;
      else interimText += result.transcript;
    }
    if (finalText) onUpdate(finalText, true);
    else if (interimText) onUpdate(interimText, false);
  };

  recognition.onerror = (event) => {
    const messages: Record<string, string> = {
      "not-allowed": "Izin mikrofon ditolak. Aktifkan lewat pengaturan browser.",
      "no-speech": "Tidak ada suara terdengar. Coba lagi.",
      network: "Koneksi bermasalah saat mengenali suara.",
    };
    onError(messages[event.error] ?? "Gagal mengenali suara. Coba lagi.");
  };

  recognition.onend = onDone;

  try {
    recognition.start();
  } catch {
    onError("Gagal memulai mikrofon.");
    return null;
  }

  return { stop: () => recognition.stop() };
}
