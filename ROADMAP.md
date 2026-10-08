# InfluenceIt — Yol Haritası

Influencer ve markaları buluşturan bir pazaryeri prototipi. Amaç: ölçeklenebilir bir ürün değil, **kısa sürede çalışan, cilalı bir demo** ile hızlı ürün çıkarabildiğini göstermek. Proje yerelde çalışır, canlıya alınması şart değildir.

## İlkeler

- **Dar ama sağlam:** Tek bir ana akışı (arama → profil → sipariş → teslim → onay) iyi yap. Yarım kalmış özellik, eksik özellikten kötüdür.
- **Dil:** Düz JavaScript (TypeScript sonradan eklenebilir).
- **Gerçek olmayanlar bilerek sahte:** Ödeme, giriş sistemi ve sosyal medya verisi mock. README'de bunu açıkça yaz.
- **Her faz sonunda çalışan bir sürüm olsun.** Faz bitmeden sonrakine geçme.

## Teknoloji yığını

| Katman | Seçim |
|---|---|
| Uygulama | Next.js (JavaScript, `.js` / `.jsx`) |
| Stil | Tailwind CSS (+ shadcn/ui istenirse) |
| Veritabanı | SQLite + Prisma |
| Veri | Seed script ile uydurma creator ve marka verisi |
| Giriş | Yok: üstte "Marka / Creator olarak gir" geçişi |
| Ödeme | Sahte onay ekranı, durum "ödendi (escrow'da)" olur |

## Faz 0 — Hazırlık (yarım gün)

- [ ] GitHub reposu açık, arkadaş davet edildi (kabul bekleniyor)
- [ ] Node.js ve Git kurulu olduğunu doğrula (`node -v`, `git -v`)
- [ ] Branch kuralı: `main` dalı sağlam kalır, her iş için `feature/...` dalı + pull request
- [ ] `.gitignore` içinde `node_modules/`, `.env`, `*.db` olduğundan emin ol
- [ ] İş bölümü: kim hangi sayfayı yapıyor (çakışmayı önler)

**Çıktı:** Boş ama düzenli bir repo ve ortak çalışma kuralları.

## Faz 1 — İskelet ve veri (1 gün)

- [ ] Next.js projesini kur, Tailwind ekle
- [ ] Prisma şeması: `User`, `CreatorProfile`, `BrandProfile`, `Package` (fiyat paketi), `Order`
- [ ] Seed script: 20-30 uydurma creator, 5-6 marka (uydurma isim, rastgele avatar; gerçek kişi kullanma)
- [ ] `npm run reset` komutu: veritabanını sıfırlar ve yeniden doldurur
- [ ] Ortak sayfa düzeni: üst menü, Marka/Creator geçişi

**Çıktı:** Uygulama açılıyor, veritabanı seed veriyle dolu.

## Faz 2 — Creator keşfi (1 gün)

- [ ] Creator arama sayfası: kart görünümü
- [ ] Filtreler: niş, fiyat aralığı, takipçi aralığı, şehir
- [ ] Sıralama ve sayfalama
- [ ] Creator profil sayfası: bio, istatistikler, fiyat paketleri, örnek içerik görselleri
- [ ] Boş durum ve yükleniyor ekranları

**Çıktı:** Marka olarak creator bulup profilini inceleyebiliyorsun.

## Faz 3 — Sipariş akışı (1-2 gün) ← projenin kalbi

- [ ] "Sipariş ver" formu (paket seçimi, kısa brief)
- [ ] Sahte ödeme ekranı → durum "ödendi (escrow'da)"
- [ ] Sipariş durum makinesi: `beklemede → ödendi → teslim edildi → revizyon | onaylandı`
- [ ] Geçersiz durum geçişlerini engelle (ör. ödenmemiş siparişi onaylayamazsın)
- [ ] Marka paneli: siparişlerim, onayla / revizyon iste
- [ ] Creator paneli: gelen siparişler, teslim et (dosya/link yükle)
- [ ] Durum çubuğu ile görsel ilerleme gösterimi

**Çıktı:** Aynı siparişi iki taraftan görüp baştan sona ilerletebiliyorsun.

## Faz 4 — Fark yaratan özellik (1 gün)

Birini seç, ikisini birden yapma:

- [ ] **Seçenek A:** "Doğrulanmış metrik" rozeti (mock veriyle; gerçek API'ye nasıl bağlanacağını README'de anlat)
- [ ] **Seçenek B:** Marka brief'ine göre önerilen creator listesi (basit puanlama: niş + bütçe + kitle uyumu, nedenini göster)

**Çıktı:** Demoda "bunu özellikle düşündüm" diyebileceğin bir an.

## Faz 5 — Cilalama ve sunum hazırlığı (1 gün)

- [ ] Mobil uyum ve genel görsel tutarlılık
- [ ] Hata durumları (kullanıcı dostu mesajlar)
- [ ] README: proje ne, nasıl çalıştırılır, neyi bilerek yapmadık, sonraki adımlar
- [ ] Ekran görüntüleri veya kısa ekran kaydı (yedek)
- [ ] Demo provası: sıfırdan reset → baştan sona bir sipariş, 3-5 dakikada
- [ ] Her teknik kararı tek cümleyle savunabil (neden Next.js, neden SQLite, neden durum makinesi)

**Çıktı:** Mülakatta güvenle gösterilebilecek bir demo.

## Kapsam dışı (bilerek yapılmıyor)

Gerçek ödeme / escrow, gerçek kimlik doğrulama, gerçek sosyal medya API bağlantısı, mesajlaşma, yorum sistemi, bildirimler, mobil uygulama, canlıya alma.

Bunların neden dışarıda bırakıldığını anlatabilmek de mülakatta artı puandır. Ör. gerçek escrow için lisanslı bir ödeme sağlayıcısı gerekir.

## Tahmini süre

| Faz | Süre |
|---|---|
| 0 Hazırlık | 0,5 gün |
| 1 İskelet ve veri | 1 gün |
| 2 Creator keşfi | 1 gün |
| 3 Sipariş akışı | 1-2 gün |
| 4 Fark yaratan özellik | 1 gün |
| 5 Cilalama ve sunum | 1 gün |
| **Toplam** | **~5-6 gün** (iki kişi paralel çalışırsa daha kısa) |

Mülakata az kaldıysa Faz 4'ü atla, Faz 5'i koru.

## Mülakatta anlatım iskeleti (3-5 dk)

1. **Problem:** Marka-influencer eşleşmelerinde güven ve kalite sorunu.
2. **Demo:** Arama → profil → sipariş → teslim → onay.
3. **Teknik kararlar:** Durum makinesi, seed ve reset, neyi bilerek yapmadığın.
4. **Sizin ekibinizde nasıl büyütürdüm:** Gerçek ödeme sağlayıcısı, OAuth ile doğrulanmış metrik, arama altyapısı.

## İş bölümü (arkadaşınla)

| Kişi | Önerilen alan |
|---|---|
| Sen | Veritabanı, sipariş akışı ve durum makinesi (Faz 1, 3) |
| Arkadaşın | Arama, profil sayfaları ve görünüm (Faz 2, 5) |
| Birlikte | Faz 4 ve demo provası |

(Dağılımı kendi güçlü yanlarınıza göre değiştirin.)
