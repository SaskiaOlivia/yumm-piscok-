// ==========================================
// KONFIGURASI
// ==========================================

const NOMOR_WA = "6285766311757";

const produk = document.getElementById("orderProduct");
const jumlah = document.getElementById("quantity");
const total = document.getElementById("totalPrice");

// ==========================================
// FORMAT RUPIAH
// ==========================================

function formatRupiah(angka) {
  return "Rp" + angka.toLocaleString("id-ID");
}

// Mengambil harga produk
function hargaProduk() {
  return Number(
    produk.options[produk.selectedIndex].dataset.price
  );
}

// ==========================================
// HITUNG TOTAL HARGA
// ==========================================

function hitungTotal() {
  let qty = Number.parseInt(jumlah.value, 10) || 1;

  qty = Math.max(1, Math.min(99, qty));
  jumlah.value = qty;

  total.textContent = formatRupiah(
    hargaProduk() * qty
  );
}

produk.addEventListener("change", hitungTotal);
jumlah.addEventListener("input", hitungTotal);

// Tombol kurangi jumlah
document.getElementById("minusQty")
  .addEventListener("click", function () {
    jumlah.value = Math.max(
      1,
      (Number.parseInt(jumlah.value, 10) || 1) - 1
    );

    hitungTotal();
  });

// Tombol tambah jumlah
document.getElementById("plusQty")
  .addEventListener("click", function () {
    jumlah.value = Math.min(
      99,
      (Number.parseInt(jumlah.value, 10) || 1) + 1
    );

    hitungTotal();
  });

// ==========================================
// TOMBOL TAMBAH PRODUK
// ==========================================

document.querySelectorAll(".add-button").forEach(button => {
  button.addEventListener("click", function () {
    const namaProduk = this.dataset.product;

    produk.value = namaProduk;
    jumlah.value = 1;

    hitungTotal();

    document.getElementById("pesan")
      .scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
  });
});

// ==========================================
// PESAN MELALUI WHATSAPP
// ==========================================

document.getElementById("orderButton")
  .addEventListener("click", function () {
    hitungTotal();

    const namaProduk = produk.value;
    const qty = Number(jumlah.value);
    const totalHarga = hargaProduk() * qty;

    const pesan = `Halo Yumm! Piscok, saya mau pesan:

Produk: ${namaProduk}
Jumlah: ${qty}
Total: ${formatRupiah(totalHarga)}

Apakah produknya masih tersedia?`;

    const link =
      "https://wa.me/" + NOMOR_WA +
      "?text=" + encodeURIComponent(pesan);

    window.open(link, "_blank");
  });

// ==========================================
// NAVIGASI MOBILE
// ==========================================

const tombolMenu = document.getElementById("menuToggle");
const navigasi = document.getElementById("mainNav");

tombolMenu.addEventListener("click", function () {
  navigasi.classList.toggle("open");

  const menuTerbuka = navigasi.classList.contains("open");
  

  this.textContent = menuTerbuka ? "×" : "☰";
  this.setAttribute("aria-expanded", menuTerbuka);
});

navigasi.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", function () {
    navigasi.classList.remove("show");

    tombolMenu.textContent = "☰";
    tombolMenu.setAttribute("aria-expanded", "false");
  });
});

// ==========================================
// TAHUN OTOMATIS FOOTER
// ==========================================

document.getElementById("year").textContent =
  new Date().getFullYear();

// ==========================================
// SISTEM ULASAN
// ==========================================

const formUlasan = document.getElementById("reviewForm");
const daftarUlasan = document.getElementById("reviewsList");

const kunciPenyimpanan = "yummPiscokReviews";

// Membaca ulasan dari browser
function bacaUlasan() {
  try {
    return JSON.parse(
      localStorage.getItem(kunciPenyimpanan) || "[]"
    );
  } catch {
    return [];
  }
}

// Menampilkan ulasan
function tampilkanUlasan() {
  const ulasan = bacaUlasan();

  // Jika belum ada ulasan baru,
  // ulasan contoh dari HTML tetap ditampilkan
  if (ulasan.length === 0) return;

  daftarUlasan.replaceChildren();

  ulasan.slice().reverse().forEach(item => {
    const kartu = document.createElement("article");
    kartu.className = "review-card";

    const bagianAtas = document.createElement("div");
    bagianAtas.className = "comment-top";

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = item.nama.charAt(0).toUpperCase();

    const pengguna = document.createElement("div");
    pengguna.className = "comment-user";

    const nama = document.createElement("strong");
    nama.textContent = item.nama;

    const keterangan = document.createElement("small");
    keterangan.textContent = "Pelanggan Yumm! Piscok";

    pengguna.append(nama, keterangan);
    bagianAtas.append(avatar, pengguna);

    const bintang = document.createElement("div");
    bintang.className = "stars";

    bintang.textContent =
      "★".repeat(item.rating) +
      "☆".repeat(5 - item.rating);

    const komentar = document.createElement("p");
    komentar.textContent = item.komentar;

    kartu.append(
      bagianAtas,
      bintang,
      komentar
    );

    daftarUlasan.appendChild(kartu);
  });
}

// Mengirim ulasan
formUlasan.addEventListener("submit", function (event) {
  event.preventDefault();

  const nama = document.getElementById("reviewName")
    .value.trim();

  const rating = Number(
    document.getElementById("reviewRating").value
  );

  const komentar = document.getElementById("reviewText")
    .value.trim();

  if (!nama || !komentar) return;

  const ulasan = bacaUlasan();

  ulasan.push({
    nama: nama,
    rating: rating,
    komentar: komentar
  });

  try {
    localStorage.setItem(
      kunciPenyimpanan,
      JSON.stringify(ulasan.slice(-30))
    );

    tampilkanUlasan();
    formUlasan.reset();

  } catch {
    alert("Ulasan gagal disimpan. Coba lagi.");
  }
});

// ==========================================
// JALANKAN SAAT WEBSITE DIBUKA
// ==========================================

hitungTotal();
tampilkanUlasan();