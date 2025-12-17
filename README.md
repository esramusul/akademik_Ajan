# Akademik Ajan (Academic Agent)

Akademik Ajan, araştırmacılar ve öğrenciler için geliştirilmiş, yapay zeka destekli bir akademik yazım ve düzenleme asistanıdır. Bu proje, akademik çalışma süreçlerini hızlandırmak için özel şablonlar ve yapay zeka araçları sunar.

<div align="center">
<img src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" alt="Uygulama Ekran Görüntüsü" width="800" />
</div>

## 🚀 Özellikler

Uygulama, akademik yazım sürecinin farklı aşamaları için özelleştirilmiş araçlar içerir:

### 📄 Belge Yönetimi ve Editör
- **Kapsamlı Dashboard:** Tüm çalışmalarınızı tek bir yerden yönetin, yeni belgeler oluşturun veya mevcutları düzenleyin.
- **Zengin Metin Editörü:** Akademik formatlara uygun yazım deneyimi.
- **Otomatik Kayıt:** Çalışmalarınız tarayıcı hafızasında (LocalStorage) güvenle saklanır.
- **Karanlık Mod Arayüzü:** Göz yormayan, odaklanmayı artıran modern tasarım.

### 🤖 Yapay Zeka Destekli Şablonlar
Proje, belirli akademik görevler için hazır senaryolar (protokoller) sunar:

1.  **Literatür Taraması:** Mevcut çalışmaları analiz etmek ve metodolojik farkları özetlemek için taslaklar.
2.  **Veri Analizi:** Ham veri setlerini (anket sonuçları vb.) profesyonel tablolara dönüştürmek için "İstatistik Görselleştirici" entegrasyonu.
3.  **Yayın Denetimi (Audit):** Metinlerinizi "Desk Rejection Simülatörü" ile tarayarak editör reddi risklerini önceden belirleyin.
4.  **Proje Önerisi (Grant):** TÜBİTAK vb. kurumlar için proje önerisi yazım taslakları.
5.  **Tez Yazımı:** Tez bölümlerini yapılandırmak için hazır iskeletler.
6.  **Görsel Analiz:** Grafikleri yorumlamak ve metne dökmek için "Şekil Yorumlayıcı" desteği.

## 🛠️ Teknolojiler

Bu proje modern web teknolojileri kullanılarak geliştirilmiştir:

- **Frontend:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Dil:** [TypeScript](https://www.typescriptlang.org/)
- **Stil:** [Tailwind CSS](https://tailwindcss.com/)
- **AI Entegrasyonu:** [Google Gemini API](https://ai.google.dev/) (@google/genai)

## 💻 Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

### Ön Gereksinimler
- Node.js (v18 veya üzeri önerilir)
- npm veya yarn

### Adımlar

1.  **Depoyu klonlayın:**
    ```bash
    git clone https://github.com/esramusul/akademik_Ajan.git
    cd akademik_Ajan
    ```

2.  **Bağımlılıkları yükleyin:**
    ```bash
    npm install
    ```

3.  **Çevre Değişkenlerini Ayarlayın:**
    Proje ana dizininde `.env.local` dosyası oluşturun ve Gemini API anahtarınızı ekleyin:
    ```env
    VITE_GEMINI_API_KEY=Sizin_API_Anahtariniz
    ```

4.  **Uygulamayı başlatın:**
    ```bash
    npm run dev
    ```
    Tarayıcınızda `http://localhost:5173` adresine giderek uygulamayı görüntüleyebilirsiniz.

## 🤝 Katkıda Bulunma

1.  Bu depoyu fork'layın.
2.  Yeni bir özellik dalı (feature branch) oluşturun (`git checkout -b ozellik/YeniOzellik`).
3.  Değişikliklerinizi commit'leyin (`git commit -m 'Yeni özellik eklendi'`).
4.  Dalınızı push'layın (`git push origin ozellik/YeniOzellik`).
5.  Bir Pull Request oluşturun.

## 📝 Lisans

Bu proje MIT lisansı ile lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakınız.
