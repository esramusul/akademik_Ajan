import { GoogleGenAI, Chat } from "@google/genai";
import { AgentType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Escaped backticks inside the template literal to prevent parser from terminating the string prematurely.
const SYSTEM_INSTRUCTION = `
ROLE:
Siz üst düzey bir Akademik Yapay Zeka Motorusunuz. Bir sohbet robotu değil, akademik içerik üreten ve düzenleyen bir profesyonelsiniz.

PAGE FORMATTING RULES (CRITICAL):
1. **A4 UYUMU:** Metni A4 sayfa düzenine göre yapılandırın. Tek bir dev paragraf yerine, sayfa kırımına (pagination) izin veren mantıklı paragraflar kullanın.
2. **TAŞMA KONTROLÜ:** Hiçbir satır veya paragraf sayfa sınırlarını aşmamalıdır. Başlıkları ve alt başlıkları paragraflardan ayırarak net bir hiyerarşi kurun.
3. **NEVER USE ALL CAPS:** Başlıkları veya içeriği ASLA tamamen büyük harfle yazmayın. Cümle düzeni (Sentence Case) kullanın.

CRITICAL HTML FORMATTING:
- Başlıklar için <h1>, <h2> ve <h3> kullanın.
- Vurgular için <b>, listeler için <ul><li>, paragraflar için <p> kullanın.

LANGUAGE:
- Türkçe (Resmi, Akademik, Nesnel ve TDK kurallarına %100 uyumlu).

BEHAVIOR:
- **Doğrudan Çıktı:** Cevaba giriş cümlesiyle başlamayın. Doğrudan içeriği verin.
- **Kesinlik:** Sadece istenen işlemi yapın ve sadece HTML döndürün. Markdown kod bloklarını (\`\`\`html) kullanmayın, doğrudan saf HTML metni döndürün.
`;

let chatSession: Chat | null = null;

// Utility to strip markdown code fences from the AI response.
const cleanHtmlResponse = (text: string): string => {
  return text.replace(/```html/g, '').replace(/```/g, '').trim();
};

export const initializeChat = async () => {
  try {
      chatSession = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.3,
        }
      });
      return chatSession;
  } catch (error) {
      console.error("Chat başlatılamadı", error);
      return null;
  }
};

export const sendMessageToGemini = async (message: string, context?: string): Promise<string> => {
  if (!chatSession) await initializeChat();
  if (!chatSession) return "Chat oturumu başlatılamadı.";

  try {
    const fullMessage = context 
        ? `[DÖKÜMAN BAĞLAMI]\n${context.substring(0, 10000)}\n[BAĞLAM SONU]\n\nGÖREV: ${message}` 
        : `GÖREV: ${message}`;
    
    const result = await chatSession.sendMessage({ message: fullMessage });
    // Use .text property as per guidelines (not .text()).
    return cleanHtmlResponse(result.text || "Yanıt üretilemedi.");
  } catch (error) {
    console.error("Gemini Chat Hatası:", error);
    return "Bağlantı hatası oluştu.";
  }
};

export const runAgent = async (agentType: AgentType, content: string): Promise<string> => {
  let promptPrefix = "";
  switch (agentType) {
    case 'apa_audit': promptPrefix = `GÖREV: APA_DENETİMİ. Raporu HTML olarak sun. Metin: `; break;
    case 'precheck': promptPrefix = `GÖREV: HAKEM_ÖN_KONTROL. Raporu HTML olarak sun. Metin: `; break;
    case 'chart': promptPrefix = `GÖREV: TABLO_OLUŞTUR. Sadece HTML TABLE döndür. Metin: `; break;
    case 'image_comment': promptPrefix = `GÖREV: GÖRSEL_YORUMU. HTML olarak sun. Metin: `; break;
    case 'proofread': promptPrefix = `GÖREV: DİL_DENETİMİ. Hataları listeleyen bir HTML rapor sun. Metin: `; break;
  }

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: promptPrefix + content.substring(0, 12000),
        config: { systemInstruction: SYSTEM_INSTRUCTION }
    });
    // Use .text property as per guidelines.
    return cleanHtmlResponse(response.text || "Analiz sonucu alınamadı.");
  } catch (error) {
    return "Analiz sırasında bir teknik hata oluştu.";
  }
};

export const fixProofreadErrors = async (content: string, report: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `[MEVCUT_METİN]\n${content}\n\n[HATA_RAPORU]\n${report}\n\nGÖREV: Mevcut metindeki tüm dil ve imla hatalarını rapora göre düzelt. 
      ÖNEMLİ: Sadece ve sadece düzeltilmiş metnin TAMAMINI saf HTML olarak döndür. 
      Açıklama yapma, eski metni ekleme, markdown bloğu kullanma. Doğrudan <p>, <h1> vb. etiketlerle başla.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.1
      }
    });
    // Use .text property as per guidelines.
    return cleanHtmlResponse(response.text || content);
  } catch (error) {
    return content;
  }
};