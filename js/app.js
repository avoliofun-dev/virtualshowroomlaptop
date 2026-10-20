import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js';
import { VirtualOffice } from './virtual-office.js';

// Ekalaya Laptop Store Catalog Data
const LAPTOPS_DATA = [
  {
    id: 'rog',
    title: 'ROG Titan X Pro',
    category: 'Gaming & 3D Render Beast',
    badge: 'Ultimate Performance',
    priceNumber: 28500000,
    price: 'Rp 28.500.000',
    specs: {
      cpu: 'Intel Core i9-14900HX (24 Cores, up to 5.8 GHz)',
      gpu: 'NVIDIA GeForce RTX 4080 12GB GDDR6 (175W TGP)',
      ram: '32GB DDR5 5600MHz (Dual Channel)',
      storage: '1TB M.2 NVMe PCIe Gen4 SSD',
      display: '16" QHD+ (2560x1600) 240Hz, 100% DCI-P3, G-Sync',
      battery: '90WHr Battery + 330W Fast Charger',
      warranty: '2 Tahun Garansi Resmi + 1 Tahun ADP'
    },
    description: 'Monster performa untuk gaming AAA rata kanan, rendering 3D Blender, editing video 8K, dan machine learning lokal tanpa kompromi.'
  },
  {
    id: 'zenbook',
    title: 'ZenAir OLED 14',
    category: 'Executive & Ultra-Slim AI Laptop',
    badge: 'Lightweight & Luxury',
    priceNumber: 16900000,
    price: 'Rp 16.900.000',
    specs: {
      cpu: 'Intel Core Ultra 7 155H (16 Cores + Dedicated NPU AI)',
      gpu: 'Intel Arc Graphics Built-in',
      ram: '16GB LPDDR5X 7467MHz Onboard',
      storage: '1TB M.2 PCIe 4.0 Performance SSD',
      display: '14" 2.8K (2880x1800) Lumina OLED 120Hz, 0.2ms, 500 nits',
      battery: '75WHr (Tahan hingga 16 jam penggunaan)',
      warranty: '2 Tahun Garansi Global ASUS'
    },
    description: 'Elegan, super tipis dengan bobot hanya 1.1 kg dan bodi full metal CNC. Layar OLED spektakuler untuk pebisnis dan profesional mobile.'
  },
  {
    id: 'macbook',
    title: 'MacBook Pro Studio M3 Max',
    category: 'Creative Pro & Studio Workstation',
    badge: 'Industry Benchmark',
    priceNumber: 34900000,
    price: 'Rp 34.900.000',
    specs: {
      cpu: 'Apple M3 Max (14-Core CPU, 30-Core GPU)',
      gpu: 'Hardware-Accelerated Ray Tracing & Neural Engine',
      ram: '36GB Unified Memory Ultra-High Bandwidth',
      storage: '1TB Superfast SSD Storage',
      display: '14.2" Liquid Retina XDR, ProMotion 120Hz, 1600 nits peak',
      battery: 'Tahan hingga 18 jam playback video',
      warranty: '1 Tahun Garansi Resmi Apple Indonesia'
    },
    description: 'Standar emas dunia industri kreatif. Performa komputasi audio/video tak tertandingi tanpa drop performa meski menggunakan daya baterai.'
  },
  {
    id: 'swift',
    title: 'Swift Go 14 Everyday',
    category: 'Student, Office & Fast Daily Tasks',
    badge: 'Best Value Choice',
    priceNumber: 7800000,
    price: 'Rp 7.800.000',
    specs: {
      cpu: 'AMD Ryzen 5 7530U (6 Cores, 12 Threads, up to 4.5 GHz)',
      gpu: 'AMD Radeon Graphics',
      ram: '16GB LPDDR4X Dual Channel',
      storage: '512GB NVMe PCIe Gen4 SSD',
      display: '14" Full HD+ IPS 100% sRGB, Acer ComfyView',
      battery: '50WHr Fast Charging via USB Type-C',
      warranty: '2 Tahun Garansi Resmi Service & Part'
    },
    description: 'Laptop andalan mahasiswa, pengajar, dan tim kantor dengan performa kencang multitasking, keyboard nyaman, dan daya tahan baterai seharian.'
  }
];

// Benchmark Data Comparison
const BENCHMARK_DATA = {
  cyberpunk: {
    title: 'Cyberpunk 2077 (1440p Ultra Ray Tracing)',
    unit: 'FPS',
    scores: [
      { id: 'rog', name: 'ROG Titan X Pro', val: 118, max: 140, color: '#ff0055' },
      { id: 'macbook', name: 'MacBook Studio M3 Max', val: 78, max: 140, color: '#9d4edd' },
      { id: 'zenbook', name: 'ZenAir OLED 14', val: 34, max: 140, color: '#00f2fe' },
      { id: 'swift', name: 'Swift Go 14', val: 24, max: 140, color: '#00f59b' }
    ]
  },
  valorant: {
    title: 'Valorant (1080p Competitive High)',
    unit: 'FPS',
    scores: [
      { id: 'rog', name: 'ROG Titan X Pro', val: 385, max: 400, color: '#ff0055' },
      { id: 'macbook', name: 'MacBook Studio M3 Max', val: 250, max: 400, color: '#9d4edd' },
      { id: 'zenbook', name: 'ZenAir OLED 14', val: 195, max: 400, color: '#00f2fe' },
      { id: 'swift', name: 'Swift Go 14', val: 145, max: 400, color: '#00f59b' }
    ]
  },
  blender: {
    title: 'Blender 3D BMW Render Time (Makin kecil makin cepat)',
    unit: 'Detik',
    scores: [
      { id: 'rog', name: 'ROG Titan X Pro', val: 9.8, max: 60, inverse: true, color: '#ff0055' },
      { id: 'macbook', name: 'MacBook Studio M3 Max', val: 12.4, max: 60, inverse: true, color: '#9d4edd' },
      { id: 'zenbook', name: 'ZenAir OLED 14', val: 28.5, max: 60, inverse: true, color: '#00f2fe' },
      { id: 'swift', name: 'Swift Go 14', val: 46.0, max: 60, inverse: true, color: '#00f59b' }
    ]
  },
  premiere: {
    title: 'Premiere Pro 4K H.265 Export Time (Makin kecil makin cepat)',
    unit: 'Detik',
    scores: [
      { id: 'macbook', name: 'MacBook Studio M3 Max', val: 18.2, max: 100, inverse: true, color: '#9d4edd' },
      { id: 'rog', name: 'ROG Titan X Pro', val: 22.0, max: 100, inverse: true, color: '#ff0055' },
      { id: 'zenbook', name: 'ZenAir OLED 14', val: 49.5, max: 100, inverse: true, color: '#00f2fe' },
      { id: 'swift', name: 'Swift Go 14', val: 84.0, max: 100, inverse: true, color: '#00f59b' }
    ]
  }
};

// App State
const state = {
  activeMode: '3d',
  theme: localStorage.getItem('ekalaya_theme') || 'dark',
  audioPlaying: false,
  audioContext: null,
  n8nWebhookUrl: localStorage.getItem('ekalaya_n8n_url') || '',
  n8nSecret: localStorage.getItem('ekalaya_n8n_secret') || '',
  currentNearbyZone: null,
  selectedLaptop: LAPTOPS_DATA[0],
  currentInvoice: null,
  activeBenchmarkTab: 'cyberpunk',
  recommendedLaptop: null
};

// Initialize Application with resilient readyState check
function bootApp() {
  applyThemeUI(state.theme);
  initVirtualOffice();
  initHUD();
  initModals();
  initCheckoutFlow();
  initSpecMatcher();
  initBenchmarkStudio();
  initOwnerAnalytics();
  initFlashSaleCountdown();
  initChatWidget();
  initAudioSynthesizer();
  initMobileJoystick();
  render2DView();
  initTahap4Features();
  initTahap5Features();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootApp);
} else {
  bootApp();
}

// 1. Initialize Virtual Office 3D
let virtualOffice;
function initVirtualOffice() {
  const container = document.getElementById('canvas-container');
  if (!container) return;

  try {
    virtualOffice = new VirtualOffice({
      container,
      theme: state.theme,
      onZoneEnter: (zone) => {
        state.currentNearbyZone = zone;
        showInteractionPrompt(zone);
        highlightNavPill(zone.id);
      },
      onZoneLeave: (zone) => {
        if (state.currentNearbyZone && state.currentNearbyZone.id === zone.id) {
          state.currentNearbyZone = null;
          hideInteractionPrompt();
        }
      },
      onMinimapUpdate: (data) => {
        drawMinimap(data);
      },
      onFootstep: () => {
        playFootstepSound();
      }
    });
  } catch (err) {
    console.error('Failed to initialize 3D Virtual Showroom:', err);
    showToast('⚠️ Menyiapkan showroom 3D... Silakan refresh jika layar belum tampil.');
  }
}

// 2. Theme Switcher (Cerah / Gelap)
function applyThemeUI(theme) {
  if (theme === 'light') {
    document.body.classList.add('theme-light');
  } else {
    document.body.classList.remove('theme-light');
  }
  const themeIcon = document.getElementById('theme-icon-span');
  if (themeIcon) {
    themeIcon.textContent = theme === 'light' ? '☀️' : '🌙';
  }
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('ekalaya_theme', state.theme);
  applyThemeUI(state.theme);
  if (virtualOffice) {
    virtualOffice.applyTheme(state.theme);
  }
  showToast(`Mode ${state.theme === 'light' ? 'Cerah' : 'Gelap'} diaktifkan`);
}

// 3. HUD, Navigation, Fullscreen & Right Control Dock Interactions
function initHUD() {
  // Toggle Collapse / Expand Right Control Dock
  const dockToggleBtn = document.getElementById('btn-toggle-dock');
  const dockItems = document.getElementById('dock-action-items');
  if (dockToggleBtn && dockItems) {
    dockToggleBtn.addEventListener('click', () => {
      dockItems.classList.toggle('collapsed');
      dockToggleBtn.classList.toggle('active');
      const isCollapsed = dockItems.classList.contains('collapsed');
      dockToggleBtn.title = isCollapsed ? 'Tampilkan Menu Alat' : 'Sembunyikan Menu Alat';
      showToast(isCollapsed ? 'Menu alat disembunyikan' : 'Menu alat ditampilkan');
    });
  }

  // Fullscreen Button
  const fsBtn = document.getElementById('btn-toggle-fullscreen');
  const fsIcon = document.getElementById('fs-icon-span');
  if (fsBtn) {
    fsBtn.addEventListener('click', toggleFullscreen);
    document.addEventListener('fullscreenchange', () => {
      if (document.fullscreenElement) {
        if (fsIcon) fsIcon.textContent = '🗗';
        fsBtn.title = 'Keluar Layar Penuh';
      } else {
        if (fsIcon) fsIcon.textContent = '⛶';
        fsBtn.title = 'Layar Penuh (Fullscreen)';
      }
    });
  }

  // Theme toggle button
  const themeBtn = document.getElementById('btn-toggle-theme');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }

  // Spec Matcher Wizard button
  const specWizBtn = document.getElementById('btn-spec-wizard');
  if (specWizBtn) {
    specWizBtn.addEventListener('click', () => {
      openModal('modal-wizard');
      resetWizard();
    });
  }

  // Owner Analytics button
  const ownerBtn = document.getElementById('btn-owner-dashboard');
  if (ownerBtn) {
    ownerBtn.addEventListener('click', () => {
      openModal('modal-analytics');
      updateAnalyticsStats();
    });
  }

  const flashBadge = document.getElementById('flash-sale-badge');
  if (flashBadge) {
    flashBadge.addEventListener('click', () => {
      openModal('modal-promo');
    });
  }

  const navPills = document.querySelectorAll('.nav-pill');
  navPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const targetZone = pill.getAttribute('data-zone');
      navPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      if (state.activeMode === '2d') {
        const el = document.getElementById(`sec-2d-${targetZone}`);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (virtualOffice) {
        virtualOffice.teleportTo(targetZone);
      }
    });
  });

  // 2D / 3D Mode Switcher
  const modeToggleBtn = document.getElementById('btn-toggle-mode');
  const modeIcon = document.getElementById('mode-icon-span');
  const view3D = document.getElementById('canvas-container');
  const view2D = document.getElementById('view-2d-container');

  if (modeToggleBtn) {
    modeToggleBtn.addEventListener('click', () => {
      if (state.activeMode === '3d') {
        state.activeMode = '2d';
        view3D.style.display = 'none';
        view2D.classList.add('active');
        if (modeIcon) modeIcon.textContent = '🌐';
        modeToggleBtn.title = 'Kembali ke Showroom 3D';
        showToast('Beralih ke Katalog Laptop 2D');
      } else {
        state.activeMode = '3d';
        view3D.style.display = 'block';
        view2D.classList.remove('active');
        if (modeIcon) modeIcon.textContent = '📄';
        modeToggleBtn.title = 'Beralih ke Katalog 2D';
        showToast('Beralih ke Showroom 3D');
      }
    });
  }

  // Audio Ambience
  const audioBtn = document.getElementById('btn-toggle-audio');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      toggleAmbientAudio(audioBtn);
    });
  }

  const ctaBtn = document.getElementById('btn-header-cta');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', () => {
      openModal('modal-reception');
    });
  }

  const settingsBtn = document.getElementById('btn-settings');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      openModal('modal-settings');
      populateSettingsForm();
    });
  }

  const promptContainer = document.getElementById('interaction-prompt');
  if (promptContainer) {
    promptContainer.addEventListener('click', () => {
      if (state.currentNearbyZone) {
        handleZoneAction(state.currentNearbyZone);
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'e' && state.currentNearbyZone) {
      if (!document.querySelector('.modal-overlay.active')) {
        handleZoneAction(state.currentNearbyZone);
      }
    }
  });
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.warn('Fullscreen error:', err);
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

function highlightNavPill(zoneId) {
  const pills = document.querySelectorAll('.nav-pill');
  pills.forEach(p => {
    if (p.getAttribute('data-zone') === zoneId) {
      p.classList.add('active');
    } else {
      p.classList.remove('active');
    }
  });
}

function showInteractionPrompt(zone) {
  const container = document.getElementById('interaction-prompt');
  const title = document.getElementById('prompt-title');
  const desc = document.getElementById('prompt-desc');
  if (!container || !title || !desc) return;

  if (zone.id === 'lobby') {
    title.innerHTML = `👩‍💼 Frontliner Maya (n8n AI)`;
    desc.textContent = `Konsultasi Spek Cerdas, Cicilan 0% & Garansi (Tekan E / Klik)`;
  } else {
    title.innerHTML = `${zone.icon} ${zone.name}`;
    desc.textContent = zone.subtitle;
  }
  container.classList.add('visible');
}

function hideInteractionPrompt() {
  const container = document.getElementById('interaction-prompt');
  if (container) container.classList.remove('visible');
}

function handleZoneAction(zone) {
  if (zone.id === 'lobby') {
    // Open Maya Frontliner Chatbot with warm greeting
    if (window.openFrontlinerChat) {
      window.openFrontlinerChat();
    } else {
      openModal('modal-reception');
    }
  } else if (zone.id === 'display') {
    openModal('modal-services');
  } else if (zone.id === 'meeting') {
    openModal('modal-meeting');
    renderBenchmarkMeters(state.activeBenchmarkTab);
  } else if (zone.id === 'lounge') {
    openModal('modal-lounge');
  } else if (zone.id === 'promo') {
    openModal('modal-promo');
  }
}

// 4. Minimap Canvas Rendering
function drawMinimap(data) {
  const canvas = document.getElementById('minimap-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  const isLight = state.theme === 'light';
  const mapScale = (val) => ((val + 32) / 64) * w;

  data.zones.forEach(zone => {
    const cx = mapScale(zone.position.x);
    const cy = mapScale(zone.position.z);
    const cr = (zone.radius / 64) * w;

    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.fillStyle = (data.currentZone && data.currentZone.id === zone.id)
      ? (isLight ? 'rgba(2, 132, 199, 0.4)' : 'rgba(0, 242, 254, 0.45)')
      : (isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.12)');
    ctx.fill();
    ctx.strokeStyle = (data.currentZone && data.currentZone.id === zone.id)
      ? (isLight ? '#0284c7' : '#00f2fe')
      : (isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)');
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = isLight ? '#0f172a' : '#ffffff';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(zone.icon, cx, cy);
  });

  const px = mapScale(data.player.x);
  const py = mapScale(data.player.z);

  ctx.beginPath();
  ctx.arc(px, py, 6, 0, Math.PI * 2);
  ctx.fillStyle = isLight ? 'rgba(2, 132, 199, 0.3)' : 'rgba(0, 242, 254, 0.3)';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(px, py, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = isLight ? '#0284c7' : '#00f2fe';
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  ctx.stroke();
}

// 5. Tahap 2: Instant Checkout & Digital Invoice Simulator
function initCheckoutFlow() {
  const orderForm = document.getElementById('order-form');
  const voucherInput = document.getElementById('order-voucher');

  if (voucherInput) {
    voucherInput.addEventListener('input', updateOrderPricingDisplay);
  }

  if (orderForm) {
    orderForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await processOrderSubmission(orderForm);
    });
  }

  const simulatePaidBtn = document.getElementById('btn-simulate-paid');
  if (simulatePaidBtn) {
    simulatePaidBtn.addEventListener('click', async () => {
      await processPaymentConfirmation();
    });
  }
}

window.startLaptopCheckout = function(laptopId) {
  const laptop = LAPTOPS_DATA.find(l => l.id === laptopId) || LAPTOPS_DATA[0];
  state.selectedLaptop = laptop;

  document.getElementById('order-laptop-id').value = laptop.id;
  document.getElementById('checkout-laptop-title').textContent = `Pesan ${laptop.title}`;
  document.getElementById('checkout-laptop-subtitle').textContent = `${laptop.category} • Garansi Resmi`;
  document.getElementById('summary-laptop-name').textContent = laptop.title;
  document.getElementById('summary-laptop-price').textContent = laptop.price;
  
  updateOrderPricingDisplay();

  document.getElementById('checkout-step-form').style.display = 'block';
  document.getElementById('checkout-step-invoice').style.display = 'none';

  closeModal('modal-services');
  closeModal('modal-wizard');
  openModal('modal-checkout');
};

function updateOrderPricingDisplay() {
  if (!state.selectedLaptop) return;
  const voucherInput = document.getElementById('order-voucher');
  const totalDisplay = document.getElementById('summary-total-price');

  let price = state.selectedLaptop.priceNumber;
  const code = voucherInput ? voucherInput.value.trim().toUpperCase() : '';

  if (code === 'EKALAYA-LAPTOP-500K') {
    price = Math.max(0, price - 500000);
    totalDisplay.innerHTML = `Rp ${price.toLocaleString('id-ID')} <span style="font-size: 0.72rem; color: var(--success);">(Kupon Rp 500rb Terpasang)</span>`;
  } else {
    totalDisplay.textContent = `Rp ${price.toLocaleString('id-ID')}`;
  }
}

async function processOrderSubmission(form) {
  const submitBtn = form.querySelector('.btn-submit');
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>⏳</span> Menerbitkan Invoice...';

  const buyerName = form.buyerName.value;
  const buyerWhatsapp = form.buyerWhatsapp.value;
  const buyerAddress = form.buyerAddress.value;
  const paymentMethod = form.paymentMethod.value;
  const voucherCode = form.voucherCode.value.trim().toUpperCase();

  let finalPriceNumber = state.selectedLaptop.priceNumber;
  if (voucherCode === 'EKALAYA-LAPTOP-500K') {
    finalPriceNumber = Math.max(0, finalPriceNumber - 500000);
  }

  const invoiceNumber = `INV-EKL-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const orderPayload = {
    event: 'laptop_order_created',
    invoiceNumber,
    timestamp: new Date().toISOString(),
    order: {
      laptopId: state.selectedLaptop.id,
      laptopTitle: state.selectedLaptop.title,
      price: `Rp ${finalPriceNumber.toLocaleString('id-ID')}`,
      buyerName,
      buyerWhatsapp,
      buyerAddress,
      paymentMethod,
      voucherCode: voucherCode || 'None'
    }
  };

  state.currentInvoice = orderPayload;

  // Track in local analytics storage
  const orders = JSON.parse(localStorage.getItem('ekalaya_orders') || '[]');
  orders.push(orderPayload);
  localStorage.setItem('ekalaya_orders', JSON.stringify(orders));

  if (state.n8nWebhookUrl) {
    try {
      await fetch(state.n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(state.n8nSecret ? { 'X-Webhook-Secret': state.n8nSecret } : {})
        },
        body: JSON.stringify(orderPayload)
      });
    } catch (e) {
      console.warn('Order webhook call failed, fallback locally:', e);
    }
  }

  document.getElementById('invoice-number-tag').textContent = invoiceNumber;
  document.getElementById('inv-buyer-name').textContent = buyerName;
  document.getElementById('inv-buyer-whatsapp').textContent = buyerWhatsapp;
  document.getElementById('inv-laptop-item').textContent = state.selectedLaptop.title;
  document.getElementById('inv-final-price').textContent = `Rp ${finalPriceNumber.toLocaleString('id-ID')}`;

  // Populate Tahap 4 Cicilan 0% values
  const inst3 = document.getElementById('inst-val-3');
  const inst6 = document.getElementById('inst-val-6');
  const inst12 = document.getElementById('inst-val-12');
  const inst24 = document.getElementById('inst-val-24');
  if (inst3) inst3.textContent = `Rp ${Math.round(finalPriceNumber / 3).toLocaleString('id-ID')} / bln`;
  if (inst6) inst6.textContent = `Rp ${Math.round(finalPriceNumber / 6).toLocaleString('id-ID')} / bln`;
  if (inst12) inst12.textContent = `Rp ${Math.round(finalPriceNumber / 12).toLocaleString('id-ID')} / bln`;
  if (inst24) inst24.textContent = `Rp ${Math.round(finalPriceNumber / 24).toLocaleString('id-ID')} / bln`;
  
  const chip = document.getElementById('invoice-status-chip');
  chip.style.background = 'rgba(255, 190, 11, 0.2)';
  chip.style.color = 'var(--warning)';
  chip.textContent = 'MENUNGGU PEMBAYARAN';

  const paidBtn = document.getElementById('btn-simulate-paid');
  paidBtn.style.display = 'block';

  document.getElementById('checkout-step-form').style.display = 'none';
  document.getElementById('checkout-step-invoice').style.display = 'block';

  showToast(`Invoice ${invoiceNumber} berhasil diterbitkan!`);
  submitBtn.disabled = false;
  submitBtn.innerHTML = originalText;
}

async function processPaymentConfirmation() {
  if (!state.currentInvoice) return;
  const chip = document.getElementById('invoice-status-chip');
  const paidBtn = document.getElementById('btn-simulate-paid');

  chip.style.background = 'rgba(0, 245, 155, 0.2)';
  chip.style.color = 'var(--success)';
  chip.textContent = '✅ LUNAS / PEMBAYARAN TERVERIFIKASI';
  paidBtn.style.display = 'none';

  const paymentPayload = {
    event: 'laptop_payment_confirmed',
    invoiceNumber: state.currentInvoice.invoiceNumber,
    timestamp: new Date().toISOString(),
    status: 'PAID',
    laptop: state.currentInvoice.order.laptopTitle,
    buyer: state.currentInvoice.order.buyerName
  };

  if (state.n8nWebhookUrl) {
    try {
      await fetch(state.n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(state.n8nSecret ? { 'X-Webhook-Secret': state.n8nSecret } : {})
        },
        body: JSON.stringify(paymentPayload)
      });
    } catch (e) {
      console.warn('Payment webhook failed:', e);
    }
  }

  showToast('🎉 Pembayaran berhasil dikonfirmasi! Notifikasi dikirim ke n8n.');
}

// 6. Tahap 3: Spec Matcher Wizard AI
function initSpecMatcher() {
  const btn3D = document.getElementById('btn-wiz-view-3d');
  if (btn3D) {
    btn3D.addEventListener('click', () => {
      closeModal('modal-wizard');
      if (state.recommendedLaptop && virtualOffice) {
        virtualOffice.teleportTo('display');
        showToast(`Menampilkan ${state.recommendedLaptop.title} di Showroom 3D`);
      }
    });
  }
}

window.selectWizardUseCase = function(useCase) {
  let targetLaptop;
  if (useCase === 'gaming') {
    targetLaptop = LAPTOPS_DATA.find(l => l.id === 'rog');
  } else if (useCase === 'executive') {
    targetLaptop = LAPTOPS_DATA.find(l => l.id === 'zenbook');
  } else if (useCase === 'creator') {
    targetLaptop = LAPTOPS_DATA.find(l => l.id === 'macbook');
  } else {
    targetLaptop = LAPTOPS_DATA.find(l => l.id === 'swift');
  }

  state.recommendedLaptop = targetLaptop;

  document.getElementById('wiz-result-title').textContent = targetLaptop.title;
  document.getElementById('wiz-result-desc').textContent = `${targetLaptop.category} • ${targetLaptop.price}`;

  document.getElementById('wiz-result-box').innerHTML = `
    <div style="font-size: 0.85rem; line-height: 1.6;">
      <p style="margin-bottom: 8px;">${targetLaptop.description}</p>
      <div>⚡ <strong>Prosesor:</strong> ${targetLaptop.specs.cpu}</div>
      <div>🎮 <strong>Grafis:</strong> ${targetLaptop.specs.gpu}</div>
      <div>💾 <strong>Memori:</strong> ${targetLaptop.specs.ram} • ${targetLaptop.specs.storage}</div>
      <div>🖥️ <strong>Layar:</strong> ${targetLaptop.specs.display}</div>
    </div>
  `;

  document.getElementById('wiz-step-1').classList.remove('active');
  document.getElementById('wiz-step-2').classList.add('active');
};

window.resetWizard = function() {
  document.getElementById('wiz-step-1').classList.add('active');
  document.getElementById('wiz-step-2').classList.remove('active');
};

// 7. Tahap 3: Benchmark Studio Engine
function initBenchmarkStudio() {
  const tabs = document.querySelectorAll('.bench-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const gameKey = tab.getAttribute('data-game');
      state.activeBenchmarkTab = gameKey;
      renderBenchmarkMeters(gameKey);
    });
  });
}

function renderBenchmarkMeters(gameKey) {
  const container = document.getElementById('benchmark-meters-container');
  if (!container) return;

  const data = BENCHMARK_DATA[gameKey] || BENCHMARK_DATA.cyberpunk;

  container.innerHTML = `
    <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 12px;">
      Skenario Uji: <strong>${data.title}</strong>
    </div>
    ${data.scores.map(s => {
      const percentage = data.inverse
        ? Math.max(10, Math.min(100, 100 - (s.val / data.max) * 80))
        : Math.min(100, (s.val / s.max) * 100);

      return `
        <div class="benchmark-meter-card">
          <div class="bench-header">
            <strong>${s.name}</strong>
            <span style="font-weight: 800; color: ${s.color}; font-size: 0.95rem;">${s.val} ${data.unit}</span>
          </div>
          <div class="bench-bar-track">
            <div class="bench-bar-fill" style="width: ${percentage}%; background: ${s.color};"></div>
          </div>
        </div>
      `;
    }).join('')}
  `;
}

// 8. Tahap 3: Owner Analytics & Daily Report Generator
function initOwnerAnalytics() {
  const triggerBtn = document.getElementById('btn-trigger-daily-report');
  if (triggerBtn) {
    triggerBtn.addEventListener('click', async () => {
      await sendDailyReportToOwner();
    });
  }
}

function updateAnalyticsStats() {
  const orders = JSON.parse(localStorage.getItem('ekalaya_orders') || '[]');
  const leads = JSON.parse(localStorage.getItem('ekalaya_laptop_leads') || '[]');

  const totalVisitors = 142 + (parseInt(localStorage.getItem('ekalaya_vis_count') || '0'));
  const totalLeads = 18 + leads.length;
  const totalOrders = 6 + orders.length;

  let revenue = 114700000;
  orders.forEach(o => {
    const num = parseInt(o.order.price.replace(/[^0-9]/g, '')) || 0;
    revenue += num;
  });

  const vEl = document.getElementById('stat-visitors');
  const lEl = document.getElementById('stat-leads');
  const oEl = document.getElementById('stat-orders');
  const rEl = document.getElementById('stat-revenue');

  if (vEl) vEl.textContent = totalVisitors;
  if (lEl) lEl.textContent = totalLeads;
  if (oEl) oEl.textContent = totalOrders;
  if (rEl) rEl.textContent = `Rp ${revenue.toLocaleString('id-ID')}`;
}

async function sendDailyReportToOwner() {
  const statusEl = document.getElementById('analytics-status');
  statusEl.className = 'form-status';
  statusEl.style.display = 'block';
  statusEl.textContent = 'Mengirim laporan harian ke n8n...';

  const reportPayload = {
    event: 'daily_report_trigger',
    timestamp: new Date().toISOString(),
    metrics: {
      date: new Date().toLocaleDateString('id-ID', { dateStyle: 'full' }),
      totalVisitors: document.getElementById('stat-visitors').textContent,
      totalLeads: document.getElementById('stat-leads').textContent,
      totalOrders: document.getElementById('stat-orders').textContent,
      totalRevenue: document.getElementById('stat-revenue').textContent,
      topSellingUnit: 'ROG Titan X Pro & ZenAir OLED 14'
    }
  };

  if (state.n8nWebhookUrl) {
    try {
      const res = await fetch(state.n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(state.n8nSecret ? { 'X-Webhook-Secret': state.n8nSecret } : {})
        },
        body: JSON.stringify(reportPayload)
      });
      if (res.ok) {
        statusEl.className = 'form-status success';
        statusEl.textContent = '🚀 Sukses! Laporan harian terkirim ke n8n (WhatsApp/Telegram pemilik aktif).';
        showToast('Laporan harian berhasil dikirim!');
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (e) {
      statusEl.className = 'form-status success';
      statusEl.textContent = '✅ Laporan terkirim (Simulasi). Siapkan n8n URL aktif di pengaturan.';
      showToast('Laporan harian terkirim!');
    }
  } else {
    statusEl.className = 'form-status success';
    statusEl.textContent = '✅ Laporan harian tergenerate (Simulasi). Atur webhook n8n di pengaturan untuk kirim live ke WhatsApp.';
    showToast('Laporan harian terbuat!');
  }
}

// 9. Tahap 3: Live Flash Sale Countdown Timer
function initFlashSaleCountdown() {
  const timerEl = document.getElementById('countdown-timer');
  if (!timerEl) return;

  let totalSeconds = 4 * 3600 + 28 * 60 + 15;

  setInterval(() => {
    if (totalSeconds > 0) {
      totalSeconds--;
      const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
      const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
      const secs = String(totalSeconds % 60).padStart(2, '0');
      timerEl.textContent = `${hours}:${mins}:${secs}`;
    }
  }, 1000);
}

// 10. General Modals Management & Lead Dispatch to n8n
function initModals() {
  const closeButtons = document.querySelectorAll('.modal-close-btn');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) modal.classList.remove('active');
    });
  });

  const overlays = document.querySelectorAll('.modal-overlay');
  overlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    });
  });

  const leadForm = document.getElementById('lead-form');
  if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleLeadSubmission(leadForm);
    });
  }

  const meetingForm = document.getElementById('meeting-form');
  if (meetingForm) {
    meetingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleMeetingSubmission(meetingForm);
    });
  }

  const settingsForm = document.getElementById('settings-form');
  if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const url = document.getElementById('cfg-webhook-url').value.trim();
      const secret = document.getElementById('cfg-webhook-secret').value.trim();
      state.n8nWebhookUrl = url;
      state.n8nSecret = secret;
      localStorage.setItem('ekalaya_n8n_url', url);
      localStorage.setItem('ekalaya_n8n_secret', secret);
      showToast('Konfigurasi Webhook n8n berhasil disimpan!');
      closeModal('modal-settings');
    });
  }

  const testPingBtn = document.getElementById('btn-test-webhook');
  if (testPingBtn) {
    testPingBtn.addEventListener('click', async () => {
      await testWebhookPing();
    });
  }

  const copyPromoBtn = document.getElementById('btn-copy-promo');
  if (copyPromoBtn) {
    copyPromoBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('EKALAYA-LAPTOP-500K');
      copyPromoBtn.textContent = 'Tersalin!';
      showToast('Kode voucher EKALAYA-LAPTOP-500K berhasil disalin!');
      setTimeout(() => {
        copyPromoBtn.textContent = 'Salin Kode Voucher';
      }, 2500);
    });
  }
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

function populateSettingsForm() {
  const urlInput = document.getElementById('cfg-webhook-url');
  const secretInput = document.getElementById('cfg-webhook-secret');
  if (urlInput) urlInput.value = state.n8nWebhookUrl;
  if (secretInput) secretInput.value = state.n8nSecret;
}

async function handleLeadSubmission(form) {
  const submitBtn = form.querySelector('.btn-submit');
  const statusEl = document.getElementById('lead-status');
  const originalBtnText = submitBtn.innerHTML;

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>⏳</span> Mengirim data...';
  statusEl.className = 'form-status';
  statusEl.style.display = 'none';

  const payload = {
    event: 'laptop_lead_captured',
    source: 'Ekalaya Laptop Store - Virtual Showroom',
    timestamp: new Date().toISOString(),
    data: {
      fullName: form.fullName.value,
      contact: form.contact.value,
      laptopInterest: form.laptopInterest.value,
      budget: form.budget.value,
      notes: form.notes ? form.notes.value : ''
    }
  };

  saveLeadLocally(payload);

  if (state.n8nWebhookUrl) {
    try {
      const response = await fetch(state.n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(state.n8nSecret ? { 'X-Webhook-Secret': state.n8nSecret } : {})
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        statusEl.className = 'form-status success';
        statusEl.textContent = '🎉 Berhasil terhubung ke n8n! Tim sales laptop kami akan segera mengirim rekomendasi & promo ke WhatsApp Anda.';
        form.reset();
        showToast('Permintaan berhasil tercatat di n8n!');
        setTimeout(() => closeModal('modal-reception'), 2500);
      } else {
        throw new Error(`Webhook error ${response.status}`);
      }
    } catch (err) {
      statusEl.className = 'form-status success';
      statusEl.textContent = '✅ Data konsultasi tersimpan (Simulasi Lokal). Server n8n belum aktif.';
      form.reset();
      showToast('Data tersimpan secara lokal!');
    }
  } else {
    statusEl.className = 'form-status success';
    statusEl.textContent = '✨ Terima kasih! Rekomendasi spek & penawaran laptop akan dikirim ke WhatsApp Anda.';
    form.reset();
    showToast('Konsultasi berhasil diajukan!');
    setTimeout(() => closeModal('modal-reception'), 2200);
  }

  submitBtn.disabled = false;
  submitBtn.innerHTML = originalBtnText;
}

function saveLeadLocally(payload) {
  const existing = JSON.parse(localStorage.getItem('ekalaya_laptop_leads') || '[]');
  existing.push(payload);
  localStorage.setItem('ekalaya_laptop_leads', JSON.stringify(existing));
}

async function handleMeetingSubmission(form) {
  const statusEl = document.getElementById('meeting-status');
  statusEl.className = 'form-status success';
  statusEl.textContent = `📅 Sesi live demo & benchmark untuk ${form.meetingDate.value} jam ${form.meetingTime.value} telah dijadwalkan! Link Google Meet akan dikirim via WA.`;
  showToast('Jadwal demo berhasil diajukan!');
  setTimeout(() => closeModal('modal-booking-demo'), 2500);
}

async function testWebhookPing() {
  const statusEl = document.getElementById('settings-status');
  const url = document.getElementById('cfg-webhook-url').value.trim();
  const secret = document.getElementById('cfg-webhook-secret').value.trim();

  if (!url) {
    statusEl.className = 'form-status error';
    statusEl.textContent = 'Harap isi URL Webhook n8n terlebih dahulu.';
    return;
  }

  statusEl.className = 'form-status';
  statusEl.style.display = 'block';
  statusEl.textContent = 'Menguji koneksi ke n8n...';

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(secret ? { 'X-Webhook-Secret': secret } : {})
      },
      body: JSON.stringify({
        event: 'ping_test',
        store: 'Ekalaya Laptop Store',
        message: 'Tes koneksi webhook toko laptop',
        timestamp: new Date().toISOString()
      })
    });

    if (res.ok) {
      statusEl.className = 'form-status success';
      statusEl.textContent = '🚀 Sukses! Webhook n8n merespon status ' + res.status;
    } else {
      statusEl.className = 'form-status error';
      statusEl.textContent = `Gagal: n8n mengembalikan status ${res.status}. Pastikan workflow aktif.`;
    }
  } catch (e) {
    statusEl.className = 'form-status error';
    statusEl.textContent = `Gagal terhubung (${e.message}). Periksa izin CORS dan URL Tunnel.`;
  }
}

// 11. Chat Assistant "Maya" Widget
function initChatWidget() {
  const triggerBtn = document.getElementById('chat-trigger-btn');
  const chatWindow = document.getElementById('chat-window');
  const closeBtn = document.getElementById('chat-close-btn');
  const inputEl = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');
  const suggestions = document.querySelectorAll('.suggestion-chip');

  if (!triggerBtn || !chatWindow) return;

  triggerBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
    if (chatWindow.classList.contains('open')) {
      inputEl.focus();
    }
  });

  closeBtn.addEventListener('click', () => {
    chatWindow.classList.remove('open');
  });

  const sendMessage = () => {
    const text = inputEl.value.trim();
    if (!text) return;
    appendChatMessage('user', text);
    inputEl.value = '';

    setTimeout(() => {
      const botReply = generateSmartReply(text);
      appendChatMessage('bot', botReply);
    }, 550);
  };

  sendBtn.addEventListener('click', sendMessage);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  suggestions.forEach(chip => {
    chip.addEventListener('click', () => {
      inputEl.value = chip.textContent;
      sendMessage();
    });
  });
}

function appendChatMessage(sender, text) {
  const messagesEl = document.getElementById('chat-messages');
  if (!messagesEl) return;
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble bubble-${sender}`;
  bubble.textContent = text;
  messagesEl.appendChild(bubble);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function generateSmartReply(query) {
  const q = query.toLowerCase();
  if (q.includes('cicilan') || q.includes('kredit') || q.includes('angsuran')) {
    return 'Kami menyediakan opsi cicilan 0% hingga 12 bulan via Kartu Kredit serta pembiayaan rekanan (Kredivo, Akulaku, Home Credit). Untuk ROG Titan X (Rp 28.5jt), cicilan mulai Rp 2.375.000/bln (12x). Anda bisa memilih metode ini saat Checkout!';
  } else if (q.includes('gaming') || q.includes('rtx') || q.includes('render') || q.includes('rog')) {
    return 'Untuk gaming berat dan rendering 3D, pilihan nomor 1 kami adalah ROG Titan X Pro (i9-14900HX, RTX 4080 12GB, 32GB RAM) di harga Rp 28.500.000 dengan layar 240Hz QHD+! Anda bisa langsung klik "Beli Sekarang" di arena laptop untuk menerbitkan invoice.';
  } else if (q.includes('kuliah') || q.includes('murah') || q.includes('budget') || q.includes('kantor') || q.includes('swift')) {
    return 'Untuk kebutuhan kuliah, olah data, dan kantor harian, Swift Go 14 sangat direkomendasikan: Ryzen 5 7530U, RAM 16GB, SSD 512GB di harga Rp 7.800.000 dengan baterai tahan seharian.';
  } else if (q.includes('tipis') || q.includes('ringan') || q.includes('oled') || q.includes('zenbook')) {
    return 'ZenAir OLED 14 adalah primadona eksekutif: bobot cuma 1.1 kg, prosesor Intel Core Ultra 7 dengan AI NPU, dan layar 2.8K Lumina OLED seharga Rp 16.900.000.';
  } else if (q.includes('macbook') || q.includes('apple') || q.includes('editing') || q.includes('m3')) {
    return 'MacBook Pro Studio M3 Max (36GB Unified RAM, 1TB SSD) seharga Rp 34.900.000 adalah standar profesional video editor & komposer musik dengan layar Liquid Retina XDR.';
  } else if (q.includes('garansi') || q.includes('klaim') || q.includes('rusak')) {
    return 'Semua unit di Ekalaya Laptop Store adalah 100% Baru & Garansi Resmi Indonesia (1-2 Tahun) lengkap dengan perlindungan Accidental Damage Protection (ADP) untuk seri tertentu!';
  } else if (q.includes('promo') || q.includes('voucher') || q.includes('diskon')) {
    return 'Kunjungi Ruang Promo di sudut kanan bawah atau gunakan voucher "EKALAYA-LAPTOP-500K" saat checkout untuk potongan Rp 500.000 + bonus tas ransel laptop & mouse wireless!';
  } else {
    return 'Halo! Saya Maya, konsultan spesifikasi laptop di Ekalaya. Butuh laptop untuk gaming, desain grafis, coding, atau kuliah? Sebutkan kebutuhan dan budget Anda, atau klik tombol "Cari Spek" di atas!';
  }
}

// 12. Ambient Audio Synthesizer
function initAudioSynthesizer() {}

function toggleAmbientAudio(btn) {
  if (!state.audioContext) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    state.audioContext = new AudioContext();

    const osc1 = state.audioContext.createOscillator();
    const osc2 = state.audioContext.createOscillator();
    const filter = state.audioContext.createBiquadFilter();
    const gainNode = state.audioContext.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(110, state.audioContext.currentTime);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(164.81, state.audioContext.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, state.audioContext.currentTime);

    gainNode.gain.setValueAtTime(0.08, state.audioContext.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(state.audioContext.destination);

    osc1.start();
    osc2.start();

    state.audioPlaying = true;
    btn.innerHTML = '<span>🔊</span>';
    showToast('Musik showroom diaktifkan');
  } else {
    if (state.audioPlaying) {
      state.audioContext.suspend();
      state.audioPlaying = false;
      btn.innerHTML = '<span>🔇</span>';
    } else {
      state.audioContext.resume();
      state.audioPlaying = true;
      btn.innerHTML = '<span>🔊</span>';
    }
  }
}

// Procedural Sneaker Footstep Sound
function playFootstepSound() {
  if (!state.audioContext) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) state.audioContext = new AudioCtx();
    } catch (e) {
      return;
    }
  }
  if (!state.audioContext || state.audioContext.state !== 'running') return;

  try {
    const t = state.audioContext.currentTime;
    const bufferSize = Math.floor(state.audioContext.sampleRate * 0.035);
    const buffer = state.audioContext.createBuffer(1, bufferSize, state.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.22));
    }
    const noise = state.audioContext.createBufferSource();
    noise.buffer = buffer;

    const filter = state.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320 + Math.random() * 90, t);

    const gain = state.audioContext.createGain();
    gain.gain.setValueAtTime(0.045, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(state.audioContext.destination);

    noise.start(t);
  } catch (err) {}
}

// Crisp UI Crystal Chime Sound
function playUIChime() {
  if (!state.audioContext) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) state.audioContext = new AudioCtx();
    } catch (e) {
      return;
    }
  }
  if (!state.audioContext) return;
  if (state.audioContext.state === 'suspended') {
    state.audioContext.resume();
  }

  try {
    const t = state.audioContext.currentTime;
    const osc = state.audioContext.createOscillator();
    const gain = state.audioContext.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, t); // B5
    osc.frequency.exponentialRampToValueAtTime(1975.53, t + 0.07);

    gain.gain.setValueAtTime(0.05, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(state.audioContext.destination);
    osc.start(t);
    osc.stop(t + 0.12);
  } catch (err) {}
}

// 13. Mobile Virtual Joystick
function initMobileJoystick() {
  const base = document.getElementById('joystick-base');
  const thumb = document.getElementById('joystick-thumb');
  if (!base || !thumb) return;

  let active = false;
  let origin = { x: 0, y: 0 };
  const radius = 40;

  const handleStart = (clientX, clientY) => {
    active = true;
    const rect = base.getBoundingClientRect();
    origin = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    handleMove(clientX, clientY);
  };

  const handleMove = (clientX, clientY) => {
    if (!active) return;
    const dx = clientX - origin.x;
    const dy = clientY - origin.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    const clampedDist = Math.min(dist, radius);

    const nx = Math.cos(angle) * clampedDist;
    const ny = Math.sin(angle) * clampedDist;

    thumb.style.transform = `translate(calc(-50% + ${nx}px), calc(-50% + ${ny}px))`;

    if (virtualOffice) {
      virtualOffice.setJoystickVector(nx / radius, ny / radius);
    }
  };

  const handleEnd = () => {
    active = false;
    thumb.style.transform = `translate(-50%, -50%)`;
    if (virtualOffice) {
      virtualOffice.setJoystickVector(0, 0);
    }
  };

  base.addEventListener('pointerdown', (e) => {
    base.setPointerCapture(e.pointerId);
    handleStart(e.clientX, e.clientY);
  });

  base.addEventListener('pointermove', (e) => {
    handleMove(e.clientX, e.clientY);
  });

  base.addEventListener('pointerup', handleEnd);
  base.addEventListener('pointercancel', handleEnd);
}

// 14. 2D Fallback View Rendering
function render2DView() {
  const grid = document.getElementById('services-grid-2d');
  if (!grid) return;

  grid.innerHTML = LAPTOPS_DATA.map(l => `
    <div class="card-2d">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span class="spec-chip" style="background: rgba(0, 242, 254, 0.15); color: var(--primary);">${l.badge}</span>
          <span style="font-size: 0.72rem; color: var(--text-muted);">${l.category}</span>
        </div>
        <h3 style="font-family: var(--font-heading); font-size: 1.35rem; margin-bottom: 8px; color: var(--text-main);">${l.title}</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.45; margin-bottom: 16px;">${l.description}</p>
        
        <div style="margin-bottom: 18px; font-size: 0.8rem; line-height: 1.6;">
          <div>⚡ <strong>CPU:</strong> ${l.specs.cpu}</div>
          <div>🎮 <strong>GPU:</strong> ${l.specs.gpu}</div>
          <div>💾 <strong>RAM/SSD:</strong> ${l.specs.ram} • ${l.specs.storage}</div>
          <div>🖥️ <strong>Layar:</strong> ${l.specs.display}</div>
        </div>
      </div>
      <div>
        <div class="service-price" style="font-size: 1.4rem; font-weight: 800; color: var(--primary); margin-bottom: 14px;">${l.price}</div>
        <div style="display: flex; gap: 8px;">
          <button class="btn-submit" style="flex: 1; padding: 10px; font-size: 0.82rem;" onclick="startLaptopCheckout('${l.id}')">
            ⚡ Checkout
          </button>
          <button class="action-btn" style="flex: 1; justify-content: center; font-size: 0.82rem;" onclick="window.open('https://wa.me/?text=Halo%20Ekalaya%20Laptop,%20saya%20ingin%20tanya%20stok%20laptop%20${encodeURIComponent(l.title)}')">
            Tanya WA
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// 15. Toast Helper
function showToast(msg) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>✨</span> <div>${msg}</div>`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// 16. Tahap 4: Wardrobe Customizer, Cicilan 0% Calculator, VIP Referral & CSV Export
function initTahap4Features() {
  // A. Wardrobe & Avatar Customizer
  const wardrobeBtn = document.getElementById('btn-wardrobe');
  if (wardrobeBtn) {
    wardrobeBtn.addEventListener('click', () => {
      openModal('modal-wardrobe');
    });
  }

  const outfitPresets = {
    navy: { jacketColor: 0x1e293b, accentColor: 0x00f2fe, pantsColor: 0x334155 },
    rog: { jacketColor: 0x991b1b, accentColor: 0xff0055, pantsColor: 0x0f172a },
    creator: { jacketColor: 0x4c1d95, accentColor: 0xc084fc, pantsColor: 0x1e293b },
    white: { jacketColor: 0xf8fafc, accentColor: 0xfbbf24, pantsColor: 0x334155 },
    stealth: { jacketColor: 0x09090b, accentColor: 0x00f59b, pantsColor: 0x09090b }
  };

  const outfitCards = document.querySelectorAll('.wardrobe-card');
  outfitCards.forEach(card => {
    card.addEventListener('click', () => {
      outfitCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const outfitKey = card.getAttribute('data-outfit');
      if (outfitPresets[outfitKey] && virtualOffice) {
        virtualOffice.setAvatarStyle(outfitPresets[outfitKey]);
        showToast(`Outfit ${card.querySelector('.wardrobe-title').textContent} terpasang!`);
      }
    });
  });

  const hairButtons = document.querySelectorAll('.btn-hair-opt');
  hairButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      hairButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const hairHex = parseInt(btn.getAttribute('data-hair'), 16);
      if (virtualOffice) {
        virtualOffice.setAvatarStyle({ hairColor: hairHex });
        showToast('Warna rambut diperbarui!');
      }
    });
  });

  let glassesActive = true;
  const glassesToggleBtn = document.getElementById('btn-glasses-toggle');
  const glassesStatusText = document.getElementById('glasses-status-text');
  if (glassesToggleBtn && glassesStatusText) {
    glassesToggleBtn.addEventListener('click', () => {
      glassesActive = !glassesActive;
      glassesStatusText.textContent = glassesActive ? 'Aktif' : 'Nonaktif';
      glassesStatusText.style.color = glassesActive ? 'var(--primary)' : 'var(--text-muted)';
      if (virtualOffice) {
        virtualOffice.setAvatarStyle({ showGlasses: glassesActive });
        showToast(`Kacamata pintar: ${glassesActive ? 'Dipakai' : 'Dilepas'}`);
      }
    });
  }

  // B. Payment Method Tabs (QRIS vs Cicilan 0%)
  const qrisTab = document.getElementById('tab-pay-qris');
  const cicilanTab = document.getElementById('tab-pay-cicilan');
  const qrisBox = document.getElementById('payment-gateway-box');
  const cicilanBox = document.getElementById('payment-cicilan-box');

  if (qrisTab && cicilanTab) {
    qrisTab.addEventListener('click', () => {
      qrisTab.classList.add('active');
      cicilanTab.classList.remove('active');
      if (qrisBox) qrisBox.style.display = 'block';
      if (cicilanBox) cicilanBox.style.display = 'none';
    });

    cicilanTab.addEventListener('click', () => {
      cicilanTab.classList.add('active');
      qrisTab.classList.remove('active');
      if (qrisBox) qrisBox.style.display = 'none';
      if (cicilanBox) cicilanBox.style.display = 'block';
    });
  }

  const instCards = document.querySelectorAll('.installment-card');
  instCards.forEach(ic => {
    ic.addEventListener('click', () => {
      instCards.forEach(c => c.classList.remove('active'));
      ic.classList.add('active');
      const months = ic.getAttribute('data-months');
      showToast(`Simulasi cicilan ${months} bulan dipilih`);
    });
  });

  // C. VIP Referral Generator
  const genRefBtn = document.getElementById('btn-generate-ref');
  const refNameInput = document.getElementById('ref-name-input');
  const refResultBox = document.getElementById('ref-result-box');
  const refDisplay = document.getElementById('ref-link-display');
  const copyRefBtn = document.getElementById('btn-copy-ref-link');

  if (genRefBtn && refNameInput) {
    genRefBtn.addEventListener('click', () => {
      const name = refNameInput.value.trim().replace(/[^a-zA-Z0-9]/g, '');
      if (!name) {
        showToast('Masukkan nama Anda terlebih dahulu!');
        return;
      }
      const refCode = `EKALAYA-VIP-${name.toUpperCase()}`;
      const link = `https://ekalaya.store/?ref=${encodeURIComponent(refCode)}`;
      if (refDisplay) refDisplay.textContent = link;
      if (refResultBox) refResultBox.style.display = 'block';
      showToast(`Link Referral untuk ${name} siap dibagikan!`);
    });
  }

  if (copyRefBtn && refDisplay) {
    copyRefBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(refDisplay.textContent);
      showToast('Link referral berhasil disalin ke clipboard!');
    });
  }

  // D. CSV Export for Leads & Sales Report
  const exportCsvBtn = document.getElementById('btn-export-csv');
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      exportCRMDataToCSV();
    });
  }
}

function exportCRMDataToCSV() {
  const orders = JSON.parse(localStorage.getItem('ekalaya_orders') || '[]');
  const leads = JSON.parse(localStorage.getItem('ekalaya_laptop_leads') || '[]');

  let csvRows = [
    ['ID_Transaksi', 'Tanggal', 'Tipe', 'Nama_Klien', 'WhatsApp', 'Unit_Laptop', 'Nilai', 'Metode_Pembayaran', 'Status']
  ];

  // Default realistic records + stored records
  const sampleRecords = [
    ['INV-EKL-2026-8821', '2026-10-20 09:15', 'Order', 'Rizky Pratama', '0812984123xx', 'ROG Titan X Pro', 'Rp 28.500.000', 'QRIS Instan', 'PAID'],
    ['INV-EKL-2026-9142', '2026-10-20 11:42', 'Order', 'Clarissa Maya', '0813876543xx', 'MacBook Studio M3 Max', 'Rp 34.900.000', 'Cicilan 12x BCA', 'PAID'],
    ['INV-EKL-2026-9503', '2026-10-20 14:10', 'Order', 'Budi Santoso', '0857123456xx', 'ZenAir OLED 14', 'Rp 16.900.000', 'Transfer Bank', 'PAID'],
    ['LEAD-2026-4401', '2026-10-20 10:05', 'Lead', 'Dimas Aditya', '0819012345xx', 'ZenAir OLED 14', '-', 'Konsultasi Maya AI', 'HOT_PROSPECT'],
    ['LEAD-2026-4402', '2026-10-20 13:20', 'Lead', 'Fitri Handayani', '0821998877xx', 'Swift Go 14', '-', 'Formulir Resepsionis', 'PROSPECT']
  ];

  sampleRecords.forEach(r => csvRows.push(r));

  orders.forEach(o => {
    csvRows.push([
      o.invoiceNumber,
      o.timestamp.replace('T', ' ').substring(0, 16),
      'Order',
      `"${o.order.buyerName}"`,
      o.order.buyerWhatsapp,
      `"${o.order.laptopTitle}"`,
      `"${o.order.price}"`,
      o.order.paymentMethod,
      'PAID'
    ]);
  });

  leads.forEach((l, idx) => {
    csvRows.push([
      `LEAD-${1000 + idx}`,
      l.timestamp ? l.timestamp.replace('T', ' ').substring(0, 16) : '2026-10-20',
      'Lead',
      `"${l.name || l.clientName || 'Visitor'}"`,
      l.whatsapp || l.clientWhatsapp || '-',
      `"${l.topic || l.laptop || 'Laptop Showcase'}"`,
      '-',
      'Lead Capture',
      'NEW'
    ]);
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `rekap_leads_dan_penjualan_ekalaya_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('📥 Berhasil mengunduh file rekap CSV!');
}

// ==========================================================================
// 17. Tahap 5: 3D Laptop Inspector 360°, Head-to-Head Compare & Live Visitors
// ==========================================================================
let inspector3D = null;
let currentInspectorLaptopId = 'rog';

// Benchmark and specs matrix database for Tahap 5
const LAPTOP_BENCHMARKS = {
  rog: {
    cinebenchMulti: 34500,
    cinebenchSingle: 2280,
    gamingFpsCyberpunk: 98,
    renderTime4K: 2.1, // mins (lower is better)
    batteryLife: 6.5, // hrs
    weightKg: 2.6, // kg (lower is better)
    ports: '2x TB4, 1x HDMI 2.1, 3x USB-A 3.2, 2.5G LAN',
    cooling: 'Dual Liquid Metal + Vapor Chamber 7 Heatpipes',
    display: '16" QHD+ 240Hz Fast IPS 500 nits'
  },
  zenbook: {
    cinebenchMulti: 21800,
    cinebenchSingle: 1950,
    gamingFpsCyberpunk: 38,
    renderTime4K: 4.8,
    batteryLife: 15.5,
    weightKg: 1.1,
    ports: '2x TB4 Type-C, 1x USB-A 3.2, 1x HDMI 2.1 TMDS',
    cooling: 'Dual Fan IceBlade Ultra Slim 0.1mm Fin',
    display: '14" 2.8K 120Hz Lumina OLED 500 nits HDR'
  },
  macbook: {
    cinebenchMulti: 31200,
    cinebenchSingle: 2340,
    gamingFpsCyberpunk: 62,
    renderTime4K: 1.8,
    batteryLife: 18.0,
    weightKg: 1.6,
    ports: '3x Thunderbolt 4, 1x HDMI, SDXC, MagSafe 3',
    cooling: 'High-Efficiency Dual Fan Unibody Thermal Arch',
    display: '14.2" Liquid Retina XDR 120Hz ProMotion 1600 nits'
  },
  swift: {
    cinebenchMulti: 14200,
    cinebenchSingle: 1480,
    gamingFpsCyberpunk: 28,
    renderTime4K: 8.5,
    batteryLife: 12.0,
    weightKg: 1.4,
    ports: '2x USB Type-C, 2x USB-A 3.2, 1x HDMI 2.1',
    cooling: 'TwinAir Dual Fan Cooling System',
    display: '14" FHD+ IPS 100% sRGB 350 nits'
  }
};

function initTahap5Features() {
  // A. Dock buttons
  const compareDockBtn = document.getElementById('btn-compare-dock');
  if (compareDockBtn) {
    compareDockBtn.addEventListener('click', () => {
      openLaptopCompareModal('rog', 'macbook');
      playUIChime();
    });
  }

  const inspectDockBtn = document.getElementById('btn-inspect-dock');
  if (inspectDockBtn) {
    inspectDockBtn.addEventListener('click', () => {
      openLaptopInspector('rog');
      playUIChime();
    });
  }

  // B. Inspector Controls Setup
  initInspectorControls();

  // C. Head-to-Head Compare Listeners
  initLaptopCompareListeners();

  // D. Live Visitors Presence Counter Simulation
  initLiveVisitorCounter();
}

// --------------------------------------------------------------------------
// 3D LAPTOP INSPECTOR ENGINE (Tahap 5)
// --------------------------------------------------------------------------
function initInspectorControls() {
  const modelSelect = document.getElementById('inspector-model-select');
  if (modelSelect) {
    modelSelect.addEventListener('change', (e) => {
      openLaptopInspector(e.target.value);
    });
  }

  // Hinge Angle Slider
  const hingeSlider = document.getElementById('hinge-angle-slider');
  const hingeVal = document.getElementById('hinge-angle-val');
  if (hingeSlider && hingeVal) {
    hingeSlider.addEventListener('input', (e) => {
      const angle = parseInt(e.target.value);
      hingeVal.textContent = `${angle}°`;
      if (inspector3D && inspector3D.hingeGroup) {
        // Hinge rotates around X axis from closed (Math.PI/2) to open
        const rad = ((145 - angle) * Math.PI) / 180;
        inspector3D.hingeGroup.rotation.x = rad;
      }
    });
  }

  // Colorway Switcher
  const colorwayMap = {
    stealth: 0x181920,
    silver: 0xd1d5db,
    blue: 0x1e3a8a,
    purple: 0x581c87
  };

  const colorwayButtons = document.querySelectorAll('.colorway-btn');
  colorwayButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      colorwayButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const colorKey = btn.getAttribute('data-color');
      const hex = colorwayMap[colorKey] || 0x181920;
      if (inspector3D && inspector3D.chassisMat) {
        inspector3D.chassisMat.color.setHex(hex);
        playUIChime();
        showToast(`Warna bodi diubah ke: ${btn.getAttribute('title')}`);
      }
    });
  });

  // RGB Backlight Modes
  const rgbButtons = document.querySelectorAll('.rgb-mode-btn');
  rgbButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      rgbButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-rgb');
      if (inspector3D) {
        inspector3D.rgbMode = mode;
        if (mode === 'cyan') {
          inspector3D.keyboardMat.emissive.setHex(0x00f2fe);
          inspector3D.keyboardMat.emissiveIntensity = 0.8;
        } else if (mode === 'crimson') {
          inspector3D.keyboardMat.emissive.setHex(0xff0055);
          inspector3D.keyboardMat.emissiveIntensity = 0.9;
        } else if (mode === 'off') {
          inspector3D.keyboardMat.emissive.setHex(0x000000);
          inspector3D.keyboardMat.emissiveIntensity = 0.0;
        }
        playUIChime();
      }
    });
  });

  // Hotspots Chips
  const hotspotDescriptions = {
    screen: {
      title: '🖥️ Layar Panel Ultra Fast QHD+ / OLED',
      detail: 'Dukungan akurasi 100% DCI-P3, HDR True Black, dan refresh rate hingga 240Hz 3ms untuk visual gaming dan grading video tanpa ghosting.'
    },
    keyboard: {
      title: '⌨️ Keyboard Chiclet Per-Key RGB Mechanical',
      detail: 'Travel key 1.7mm yang empuk dengan anti-ghosting N-Key Rollover, tombol macro pintar, dan keycaps anti-minyak UV-coated.'
    },
    cooling: {
      title: '❄️ Dual-Fan Vapor Chamber Thermal Solution',
      detail: 'Chamber uap tembaga murni dengan cairan liquid metal pada CPU & GPU, menjaga suhu di bawah 75°C saat full load 175W TGP.'
    },
    ports: {
      title: '⚡ Port Lengkap: Thunderbolt 4 & HDMI 2.1',
      detail: 'Mendukung display output 8K 60Hz, transfer data supercepat 40Gbps, serta Power Delivery charging 100W fleksibel di mana saja.'
    }
  };

  const hotspotChips = document.querySelectorAll('.hotspot-chip');
  hotspotChips.forEach(chip => {
    chip.addEventListener('click', () => {
      hotspotChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const part = chip.getAttribute('data-part');
      const info = hotspotDescriptions[part];
      if (info) {
        const titleEl = document.getElementById('hotspot-title');
        const detailEl = document.getElementById('hotspot-detail');
        if (titleEl) titleEl.textContent = info.title;
        if (detailEl) detailEl.textContent = info.detail;
        playUIChime();

        if (inspector3D) {
          if (part === 'screen') inspector3D.targetPhi = Math.PI * 0.42;
          else if (part === 'keyboard') inspector3D.targetPhi = Math.PI * 0.28;
          else if (part === 'cooling') inspector3D.targetTheta = Math.PI;
          else if (part === 'ports') inspector3D.targetTheta = Math.PI * 0.5;
        }
      }
    });
  });

  // Direct Checkout from Inspector
  const inspectorCheckoutBtn = document.getElementById('btn-inspector-checkout');
  if (inspectorCheckoutBtn) {
    inspectorCheckoutBtn.addEventListener('click', () => {
      const modal = document.getElementById('modal-laptop-inspector');
      if (modal) modal.classList.remove('active');
      startLaptopCheckout(currentInspectorLaptopId);
    });
  }
}

// Global hook for laptop cards
window.openLaptopInspector = function(laptopId = 'rog') {
  currentInspectorLaptopId = laptopId;
  const laptop = LAPTOPS_DATA.find(l => l.id === laptopId) || LAPTOPS_DATA[0];

  const titleEl = document.getElementById('inspector-modal-title');
  if (titleEl) {
    titleEl.innerHTML = `🔍 ${laptop.title} — 3D Viewer 360°`;
  }

  const select = document.getElementById('inspector-model-select');
  if (select) select.value = laptopId;

  openModal('modal-laptop-inspector');
  mount3DLaptopInspector(laptopId);
};

function mount3DLaptopInspector(laptopId) {
  const container = document.getElementById('inspector-canvas-container');
  if (!container) return;

  // Clean old instance
  if (inspector3D && inspector3D.animId) {
    cancelAnimationFrame(inspector3D.animId);
  }
  container.innerHTML = '';

  const width = container.clientWidth || 540;
  const height = container.clientHeight || 440;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x07090e);

  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
  camera.position.set(0, 3.2, 5.8);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  // Studio Lighting
  const ambLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambLight);

  const keyLight = new THREE.DirectionalLight(0xfff5ea, 1.4);
  keyLight.position.set(6, 10, 8);
  keyLight.castShadow = true;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x00f2fe, 1.2);
  rimLight.position.set(-8, 4, -6);
  scene.add(rimLight);

  const fillLight = new THREE.PointLight(0xff0055, 0.8, 15);
  fillLight.position.set(0, -2, 4);
  scene.add(fillLight);

  // Group root
  const rootGroup = new THREE.Group();
  scene.add(rootGroup);

  // Chassis Material
  const chassisMat = new THREE.MeshStandardMaterial({
    color: laptopId === 'rog' ? 0x181920 : laptopId === 'macbook' ? 0x222329 : laptopId === 'zenbook' ? 0x1e293b : 0x334155,
    roughness: 0.32,
    metalness: 0.72
  });

  const keyboardMat = new THREE.MeshStandardMaterial({
    color: 0x09090b,
    roughness: 0.4,
    emissive: laptopId === 'rog' ? 0xff0055 : 0x00f2fe,
    emissiveIntensity: 0.75
  });

  const screenMat = new THREE.MeshStandardMaterial({
    color: 0x05070a,
    emissive: 0x00f2fe,
    emissiveIntensity: 0.45,
    roughness: 0.1,
    metalness: 0.9
  });

  // Base Body (3.4 x 0.14 x 2.3)
  const baseGeo = new THREE.BoxGeometry(3.4, 0.14, 2.3);
  const baseMesh = new THREE.Mesh(baseGeo, chassisMat);
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  rootGroup.add(baseMesh);

  // Recessed Keyboard Deck
  const kbGeo = new THREE.BoxGeometry(2.9, 0.02, 1.2);
  const kbMesh = new THREE.Mesh(kbGeo, keyboardMat);
  kbMesh.position.set(0, 0.075, -0.2);
  rootGroup.add(kbMesh);

  // Trackpad
  const tpGeo = new THREE.BoxGeometry(1.1, 0.015, 0.68);
  const tpMat = new THREE.MeshStandardMaterial({ color: 0x222634, roughness: 0.2, metalness: 0.5 });
  const tpMesh = new THREE.Mesh(tpGeo, tpMat);
  tpMesh.position.set(0, 0.075, 0.72);
  rootGroup.add(tpMesh);

  // Hinge Group (Pivot at rear edge)
  const hingeGroup = new THREE.Group();
  hingeGroup.position.set(0, 0.07, -1.14);
  rootGroup.add(hingeGroup);

  // Screen Lid Mesh (Child of HingeGroup, offset upwards)
  const lidGeo = new THREE.BoxGeometry(3.4, 2.2, 0.08);
  const lidMesh = new THREE.Mesh(lidGeo, chassisMat);
  lidMesh.position.set(0, 1.1, 0);
  lidMesh.castShadow = true;
  hingeGroup.add(lidMesh);

  // Display Panel Screen
  const screenGeo = new THREE.BoxGeometry(3.15, 1.95, 0.01);
  const screenMesh = new THREE.Mesh(screenGeo, screenMat);
  screenMesh.position.set(0, 1.1, 0.042);
  hingeGroup.add(screenMesh);

  // Outer Shell Logo
  const logoGeo = new THREE.BoxGeometry(0.5, 0.5, 0.01);
  const logoMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe });
  const logoMesh = new THREE.Mesh(logoGeo, logoMat);
  logoMesh.position.set(0, 1.1, -0.042);
  hingeGroup.add(logoMesh);

  // Set default hinge angle (115 degrees open)
  const initialRad = ((145 - 115) * Math.PI) / 180;
  hingeGroup.rotation.x = initialRad;

  // Orbit Control State
  let isDragging = false;
  let prevX = 0;
  let prevY = 0;
  let theta = 0.5;
  let phi = Math.PI * 0.35;
  let radius = 6.2;
  let targetTheta = theta;
  let targetPhi = phi;

  const onDown = (e) => {
    isDragging = true;
    prevX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    prevY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
  };

  const onMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    const dx = clientX - prevX;
    const dy = clientY - prevY;
    prevX = clientX;
    prevY = clientY;

    targetTheta -= dx * 0.012;
    targetPhi = Math.max(0.15, Math.min(Math.PI * 0.48, targetPhi - dy * 0.01));
  };

  const onUp = () => { isDragging = false; };

  const onWheel = (e) => {
    e.preventDefault();
    radius = Math.max(3.8, Math.min(9.5, radius + e.deltaY * 0.005));
  };

  renderer.domElement.addEventListener('mousedown', onDown);
  renderer.domElement.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);

  renderer.domElement.addEventListener('touchstart', onDown, { passive: true });
  renderer.domElement.addEventListener('touchmove', onMove, { passive: true });
  window.addEventListener('touchend', onUp);
  renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

  inspector3D = {
    scene,
    camera,
    renderer,
    hingeGroup,
    chassisMat,
    keyboardMat,
    screenMat,
    rgbMode: 'cyan',
    targetTheta,
    targetPhi,
    animId: null
  };

  // Render Loop
  let clock = new THREE.Clock();
  const animateInspector = () => {
    inspector3D.animId = requestAnimationFrame(animateInspector);
    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    // Auto subtle drift when idle
    if (!isDragging) {
      targetTheta += delta * 0.2;
    }

    theta = THREE.MathUtils.lerp(theta, targetTheta, 0.1);
    phi = THREE.MathUtils.lerp(phi, targetPhi, 0.1);

    // RGB Rainbow Spectrum animation
    if (inspector3D.rgbMode === 'rainbow') {
      const hue = (elapsed * 0.4) % 1;
      keyboardMat.emissive.setHSL(hue, 1.0, 0.5);
      keyboardMat.emissiveIntensity = 0.85;
    }

    // Camera Orbit positioning
    camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
    camera.position.y = radius * Math.cos(phi) + 0.3;
    camera.position.z = radius * Math.sin(phi) * Math.cos(theta);
    camera.lookAt(0, 0.6, 0);

    renderer.render(scene, camera);
  };
  animateInspector();
}

// --------------------------------------------------------------------------
// HEAD-TO-HEAD LAPTOP COMPARE ENGINE (Tahap 5)
// --------------------------------------------------------------------------
function initLaptopCompareListeners() {
  const selectA = document.getElementById('compare-select-a');
  const selectB = document.getElementById('compare-select-b');

  if (selectA && selectB) {
    selectA.addEventListener('change', () => {
      renderLaptopComparison(selectA.value, selectB.value);
      playUIChime();
    });
    selectB.addEventListener('change', () => {
      renderLaptopComparison(selectA.value, selectB.value);
      playUIChime();
    });
  }
}

window.openLaptopCompareModal = function(idA = 'rog', idB = 'macbook') {
  const selectA = document.getElementById('compare-select-a');
  const selectB = document.getElementById('compare-select-b');
  if (selectA) selectA.value = idA;
  if (selectB) selectB.value = idB;

  openModal('modal-laptop-compare');
  renderLaptopComparison(idA, idB);
};

function renderLaptopComparison(idA, idB) {
  const laptopA = LAPTOPS_DATA.find(l => l.id === idA) || LAPTOPS_DATA[0];
  const laptopB = LAPTOPS_DATA.find(l => l.id === idB) || LAPTOPS_DATA[1];
  const benchA = LAPTOP_BENCHMARKS[idA] || LAPTOP_BENCHMARKS.rog;
  const benchB = LAPTOP_BENCHMARKS[idB] || LAPTOP_BENCHMARKS.macbook;

  // 1. Header Duel Cards
  const cardA = document.getElementById('duel-card-a');
  const cardB = document.getElementById('duel-card-b');
  if (cardA) {
    cardA.innerHTML = `
      <span class="spec-chip" style="background: rgba(0, 242, 254, 0.15); color: var(--primary);">${laptopA.badge}</span>
      <h3 style="font-family: var(--font-heading); font-size: 1.15rem; margin: 8px 0 4px; color: var(--text-main);">${laptopA.title}</h3>
      <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 8px;">${laptopA.category}</div>
      <div style="font-size: 1.1rem; font-weight: 900; color: var(--primary); margin-bottom: 12px;">${laptopA.price}</div>
      <button class="btn-submit" style="padding: 7px 14px; font-size: 0.76rem;" onclick="document.getElementById('modal-laptop-compare').classList.remove('active'); startLaptopCheckout('${laptopA.id}')">
        Pilih Unit Ini
      </button>
    `;
  }
  if (cardB) {
    cardB.innerHTML = `
      <span class="spec-chip" style="background: rgba(168, 85, 247, 0.15); color: #a855f7;">${laptopB.badge}</span>
      <h3 style="font-family: var(--font-heading); font-size: 1.15rem; margin: 8px 0 4px; color: var(--text-main);">${laptopB.title}</h3>
      <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 8px;">${laptopB.category}</div>
      <div style="font-size: 1.1rem; font-weight: 900; color: #a855f7; margin-bottom: 12px;">${laptopB.price}</div>
      <button class="btn-submit" style="padding: 7px 14px; font-size: 0.76rem; background: linear-gradient(135deg, #a855f7, #ec4899);" onclick="document.getElementById('modal-laptop-compare').classList.remove('active'); startLaptopCheckout('${laptopB.id}')">
        Pilih Unit Ini
      </button>
    `;
  }

  // 2. Animated Benchmark Duel Bars
  const metricsContainer = document.getElementById('compare-metrics-container');
  if (metricsContainer) {
    const metrics = [
      {
        name: 'Performa Multi-Core CPU (Cinebench R23)',
        valA: benchA.cinebenchMulti,
        valB: benchB.cinebenchMulti,
        displayA: `${benchA.cinebenchMulti.toLocaleString()} Pts`,
        displayB: `${benchB.cinebenchMulti.toLocaleString()} Pts`,
        higherIsBetter: true
      },
      {
        name: 'Gaming FPS Cyberpunk 2077 (Ultra RTX)',
        valA: benchA.gamingFpsCyberpunk,
        valB: benchB.gamingFpsCyberpunk,
        displayA: `${benchA.gamingFpsCyberpunk} FPS`,
        displayB: `${benchB.gamingFpsCyberpunk} FPS`,
        higherIsBetter: true
      },
      {
        name: 'Waktu Render Video 4K 10 Menit (Lebih Cepat = Juara)',
        valA: benchA.renderTime4K,
        valB: benchB.renderTime4K,
        displayA: `${benchA.renderTime4K} Menit`,
        displayB: `${benchB.renderTime4K} Menit`,
        higherIsBetter: false
      },
      {
        name: 'Daya Tahan Baterai Real-World',
        valA: benchA.batteryLife,
        valB: benchB.batteryLife,
        displayA: `${benchA.batteryLife} Jam`,
        displayB: `${benchB.batteryLife} Jam`,
        higherIsBetter: true
      },
      {
        name: 'Portabilitas Bobot Bodi (Lebih Ringan = Nyaman)',
        valA: benchA.weightKg,
        valB: benchB.weightKg,
        displayA: `${benchA.weightKg} Kg`,
        displayB: `${benchB.weightKg} Kg`,
        higherIsBetter: false
      }
    ];

    metricsContainer.innerHTML = metrics.map(m => {
      let pctA, pctB;
      if (m.higherIsBetter) {
        const total = m.valA + m.valB;
        pctA = Math.round((m.valA / total) * 100);
        pctB = 100 - pctA;
      } else {
        // Lower is better (inverted weight)
        const total = (1 / m.valA) + (1 / m.valB);
        pctA = Math.round(((1 / m.valA) / total) * 100);
        pctB = 100 - pctA;
      }

      const winnerA = m.higherIsBetter ? m.valA >= m.valB : m.valA <= m.valB;
      const winnerB = m.higherIsBetter ? m.valB >= m.valA : m.valB <= m.valA;

      return `
        <div class="compare-metric-row">
          <div class="compare-metric-labels">
            <span style="color: ${winnerA ? 'var(--primary)' : 'var(--text-muted)'}; font-weight: ${winnerA ? '800' : '600'};">
              ${winnerA ? '👑 ' : ''}${m.displayA}
            </span>
            <span class="compare-metric-name">${m.name}</span>
            <span style="color: ${winnerB ? '#a855f7' : 'var(--text-muted)'}; font-weight: ${winnerB ? '800' : '600'};">
              ${m.displayB}${winnerB ? ' 👑' : ''}
            </span>
          </div>
          <div class="compare-bar-dual">
            <div class="compare-bar-l" style="width: ${pctA}%;"></div>
            <div class="compare-bar-r" style="width: ${pctB}%;"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  // 3. Detailed Specifications Matrix Table
  const tbody = document.getElementById('compare-tbody');
  const thA = document.getElementById('th-laptop-a');
  const thB = document.getElementById('th-laptop-b');
  if (thA) thA.textContent = laptopA.title;
  if (thB) thB.textContent = laptopB.title;

  if (tbody) {
    const specsList = [
      { label: 'Prosesor (CPU)', a: laptopA.specs.cpu, b: laptopB.specs.cpu },
      { label: 'Kartu Grafis (GPU)', a: laptopA.specs.gpu, b: laptopB.specs.gpu },
      { label: 'RAM & Kecepatan', a: laptopA.specs.ram, b: laptopB.specs.ram },
      { label: 'Kapasitas Storage', a: laptopA.specs.storage, b: laptopB.specs.storage },
      { label: 'Layar & Panel', a: laptopA.specs.display, b: laptopB.specs.display },
      { label: 'Sistem Pendingin', a: benchA.cooling, b: benchB.cooling },
      { label: 'Port & Konektivitas', a: benchA.ports, b: benchB.ports },
      { label: 'Garansi Resmi', a: laptopA.specs.warranty, b: laptopB.specs.warranty }
    ];

    tbody.innerHTML = specsList.map(s => `
      <tr>
        <td style="font-weight: 700; color: var(--text-main);">${s.label}</td>
        <td>${s.a}</td>
        <td>${s.b}</td>
      </tr>
    `).join('');
  }

  // 4. Smart AI Verdict
  const verdictBox = document.getElementById('compare-verdict-box');
  if (verdictBox) {
    let summaryText = '';
    if (benchA.cinebenchMulti > benchB.cinebenchMulti && benchA.gamingFpsCyberpunk > benchB.gamingFpsCyberpunk) {
      summaryText = `<strong>💡 Rekomendasi Ahli Ekalaya:</strong> <strong>${laptopA.title}</strong> adalah pemenang mutlak untuk komputasi berat, gaming AAA rata-kanan, dan simulasi 3D. Sedangkan <strong>${laptopB.title}</strong> unggul signifikan dari segi portabilitas bodi yang ramping dan efisiensi baterai hingga seharian penuh tanpa charger.`;
    } else {
      summaryText = `<strong>💡 Rekomendasi Ahli Ekalaya:</strong> <strong>${laptopB.title}</strong> memberikan efisiensi daya dan stabilitas rendering kelas profesional yang luar biasa. Jika anggaran dan kebutuhan Anda memprioritaskan performa grafis mentah RTX atau mobilitas ekstra ringan, sesuaikan dengan preferensi mobilitas harian Anda!`;
    }
    verdictBox.innerHTML = summaryText;
  }
}

// --------------------------------------------------------------------------
// LIVE VISITORS COUNTER SIMULATION (Tahap 5)
// --------------------------------------------------------------------------
function initLiveVisitorCounter() {
  const visitorText = document.getElementById('live-visitor-text');
  if (!visitorText) return;

  setInterval(() => {
    // Realistic fluctuation between 3 and 7 online users
    const count = 3 + Math.floor(Math.random() * 5);
    visitorText.textContent = `👥 ${count} Pengunjung Online`;
  }, 18000);
}

// ==========================================================================
// 18. FRONTLINER OFFICER MAYA — n8n AI CHAT & KNOWLEDGE ENGINE
// ==========================================================================

// Built-in intelligent knowledge base matching ekalaya-frontliner-knowledge.json
const FRONTLINER_KNOWLEDGE = {
  catalog: {
    rog: {
      id: 'rog',
      title: 'ROG Titan X Pro',
      price: 'Rp 28.500.000',
      badge: 'Ultimate Gaming & Render Beast',
      cpu: 'Core i9-14900HX (24-Core)',
      gpu: 'RTX 4080 12GB (175W TGP)',
      display: '16" QHD+ 240Hz 500 nits'
    },
    zenbook: {
      id: 'zenbook',
      title: 'ZenAir OLED 14',
      price: 'Rp 16.900.000',
      badge: 'Executive & Ultra-Slim 1.1kg',
      cpu: 'Intel Core Ultra 7 + NPU AI',
      gpu: 'Intel Arc Graphics',
      display: '14" 2.8K 120Hz Lumina OLED'
    },
    macbook: {
      id: 'macbook',
      title: 'MacBook Pro Studio M3 Max',
      price: 'Rp 34.900.000',
      badge: 'Creative Industry Benchmark',
      cpu: 'Apple M3 Max (14-Core)',
      gpu: '30-Core GPU Hardware Ray-Tracing',
      display: '14.2" Liquid Retina XDR 1600 nits'
    },
    swift: {
      id: 'swift',
      title: 'Swift Go 14',
      price: 'Rp 7.800.000',
      badge: 'Best Value & Everyday Work',
      cpu: 'AMD Ryzen 5 7530U',
      gpu: 'AMD Radeon Graphics',
      display: '14" FHD+ 100% sRGB, Baterai 12 Jam'
    }
  },
  rules: [
    {
      keywords: ['gaming', 'game', 'fps', 'rtx', 'cyberpunk', 'valorant', 'gta', 'dota', 'berat'],
      suggestedId: 'rog',
      reply: 'Untuk gaming AAA rata kanan dan olah grafis berat, rekomendasi mutlak saya adalah **ROG Titan X Pro** (Rp 28.500.000)! Ditenagai Intel Core i9-14900HX dan GPU RTX 4080 12GB (175W TGP). Layar 240Hz QHD+ memastikan visual sangat mulus tanpa screen tearing. Cyberpunk 2077 Ultra RTX berjalan stabil di ~98 FPS! Unit ini sedang promo cashback. Mau coba inspeksi 3D 360° unitnya?'
    },
    {
      keywords: ['kuliah', 'mahasiswa', 'kantor', 'skripsi', 'office', 'budget', 'murah', 'pelajar', 'ringan'],
      suggestedId: 'swift',
      reply: 'Untuk kebutuhan kuliah, skripsi, dan administrasi kantor harian dengan budget efisien, pilihan juara adalah **Swift Go 14** (Rp 7.800.000). Sudah ditenagai Ryzen 5 7530U, RAM 16GB besar yang anti-lemot untuk buka 30 tab Chrome bersamaan, layar 100% sRGB yang nyaman di mata, dan baterai awet 12 jam. Sudah termasuk Windows 11 & Office original seumur hidup!'
    },
    {
      keywords: ['desain', 'editing', 'video', 'premiere', 'photoshop', 'kreator', 'render', 'blender', 'macbook', 'oled'],
      suggestedId: 'macbook',
      reply: 'Untuk dunia konten kreator profesional, **MacBook Pro Studio M3 Max** (Rp 34.900.000) adalah standar emas dengan efisiensi render 4K tercepat (1.8 menit) dan layar Liquid Retina XDR 1600 nits. Namun jika mencari laptop Windows yang tipis dan layarnya OLED memukau, **ZenAir OLED 14** (Rp 16.900.000, 1.1kg) juga merupakan pilihan yang luar biasa!'
    },
    {
      keywords: ['cicilan', 'kredit', 'angsuran', 'bunga', 'paylater', 'kredivo', 'bca', 'mandiri', 'kartu kredit'],
      suggestedId: 'zenbook',
      reply: 'Ekalaya menyediakan fasilitas **Cicilan 0% tanpa biaya admin** melalui kartu kredit rekanan (BCA, Mandiri, BNI, BRI) tenor 3, 6, 12, hingga 24 bulan! Simulasi angsuran: Swift Go 14 cuma Rp 325.000/bln, ZenAir OLED Rp 704.000/bln, dan ROG Titan X Rp 1.187.500/bln. Kami juga menerima SpayLater dan Kredivo resmi tanpa kartu kredit!'
    },
    {
      keywords: ['garansi', 'rusak', 'rusak air', 'pecah', 'adp', 'service', 'resmi', 'distributor', 'klaim'],
      suggestedId: 'rog',
      reply: 'Semua unit di Ekalaya dijamin **100% Original & Bergaransi Resmi Distributor Indonesia** (1-2 tahun). Plus, Anda mendapatkan bonus eksklusif **Accidental Damage Protection (ADP) gratis 1 tahun** — menanggung kerusakan akibat ketumpahan kopi/air, jatuh tidak sengaja, atau lonjakan arus listrik tanpa biaya tambahan!'
    },
    {
      keywords: ['promo', 'diskon', 'voucher', 'cashback', 'bonus', 'flash sale', 'hadiah', 'gratis'],
      suggestedId: 'rog',
      reply: 'Hari ini kami sedang mengadakan event **Live Flash Sale** dengan diskon hingga 35%! Gunakan voucher promo kode `EKALAYASALE500` saat checkout untuk potongan instan Rp 500.000 + bonus paket ransel waterproof, mouse wireless silent, dan mousepad gaming XXL senilai Rp 1.200.000!'
    },
    {
      keywords: ['stok', 'ready', 'kirim', 'ongkir', 'packing', 'gojek', 'grab', 'jabodetabek', 'luar kota'],
      suggestedId: 'zenbook',
      reply: 'Seluruh 4 model laptop unggulan kami **Ready Stock** di showroom dan gudang pusat Ekalaya. Kami melayani pengiriman Instant/Same-Day untuk Jabodetabek, serta gratis ongkir ke seluruh Indonesia dengan proteksi packing kayu berlapis dan asuransi 100% aman!'
    }
  ],
  defaultReply: 'Halo! Saya Maya dari meja Frontliner Ekalaya Laptop Store. Kami menyediakan laptop Gaming RTX monster, Ultrabook OLED super tipis 1.1kg, MacBook Pro M3 Max untuk industri kreatif, hingga laptop kuliah mahasiswa hemat daya. Boleh tahu kisaran anggaran atau kebutuhan spesifik yang sedang Kakak rencanakan?'
};

function initChatWidget() {
  const chatWindow = document.getElementById('chat-window');
  const chatTriggerBtn = document.getElementById('chat-trigger-btn');
  const chatCloseBtn = document.getElementById('chat-close-btn');
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const statusBadge = document.getElementById('frontliner-online-badge');
  const suggestionChips = document.querySelectorAll('.suggestion-chip');

  if (!chatWindow || !chatTriggerBtn) return;

  const toggleChat = () => {
    chatWindow.classList.toggle('active');
    if (chatWindow.classList.contains('active') && chatInput) {
      chatInput.focus();
    }
    playUIChime();
  };

  chatTriggerBtn.addEventListener('click', toggleChat);
  if (chatCloseBtn) {
    chatCloseBtn.addEventListener('click', () => {
      chatWindow.classList.remove('active');
      playUIChime();
    });
  }

  // Global helper to open chat from 3D zone or button
  window.openFrontlinerChat = function(initialQuery = null) {
    if (!chatWindow.classList.contains('active')) {
      chatWindow.classList.add('active');
    }
    if (initialQuery && chatInput) {
      chatInput.value = initialQuery;
      submitUserQuery(initialQuery);
    } else if (chatInput) {
      chatInput.focus();
    }
    playUIChime();
  };

  // Suggestion chips click
  suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.textContent.replace(/^[^\w\s]+/, '').trim();
      submitUserQuery(text);
    });
  });

  // Input send actions
  if (chatSendBtn && chatInput) {
    chatSendBtn.addEventListener('click', () => {
      const text = chatInput.value.trim();
      if (text) submitUserQuery(text);
    });

    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const text = chatInput.value.trim();
        if (text) submitUserQuery(text);
      }
    });
  }

  // Core Submit and Response Handler
  async function submitUserQuery(text) {
    if (!chatMessages) return;

    // 1. Append User Bubble
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble bubble-user';
    userBubble.textContent = text;
    chatMessages.appendChild(userBubble);
    if (chatInput) chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // 2. Typing Indicator
    const typingBubble = document.createElement('div');
    typingBubble.className = 'chat-bubble bubble-bot';
    typingBubble.innerHTML = `<div class="chat-typing-dots"><span></span><span></span><span></span></div> <span style="font-size:0.75rem; opacity:0.8; margin-left:4px;">Maya sedang memproses...</span>`;
    chatMessages.appendChild(typingBubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Target n8n Webhook URL
    const webhookUrl = state.n8nWebhookUrl || 'https://n8n-production-82f8.up.railway.app/webhook/ekalaya-frontliner';
    let replyText = '';
    let suggestedLaptop = null;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          clientName: 'Pengunjung Virtual Showroom',
          timestamp: new Date().toISOString()
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        replyText = data.reply || data.output || data.message || '';
        suggestedLaptop = data.suggestedLaptop || null;
        if (statusBadge) statusBadge.textContent = '🟢 n8n AI Online';
      }
    } catch (err) {
      // Offline fallback: use built-in smart knowledge base
      if (statusBadge) statusBadge.textContent = '🟢 Maya AI (Smart Engine)';
    }

    // Fallback to local intelligent rules if n8n response was empty
    if (!replyText) {
      const lower = text.toLowerCase();
      const matched = FRONTLINER_KNOWLEDGE.rules.find(r => r.keywords.some(k => lower.includes(k)));
      if (matched) {
        replyText = matched.reply;
        suggestedLaptop = FRONTLINER_KNOWLEDGE.catalog[matched.suggestedId] || null;
      } else {
        replyText = FRONTLINER_KNOWLEDGE.defaultReply;
        suggestedLaptop = FRONTLINER_KNOWLEDGE.catalog.zenbook;
      }
    }

    // Remove typing bubble
    if (typingBubble.parentNode) {
      typingBubble.parentNode.removeChild(typingBubble);
    }

    // 3. Append Maya Bot Bubble
    const botBubble = document.createElement('div');
    botBubble.className = 'chat-bubble bubble-bot';
    
    // Format bold markdown (**text** -> <strong>text</strong>)
    const formattedHtml = replyText
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, '<code style="background:rgba(0,242,254,0.15); padding:2px 5px; border-radius:4px; color:#00f2fe;">$1</code>');
    
    botBubble.innerHTML = formattedHtml;

    // 4. If a laptop recommendation is returned, attach action card
    if (suggestedLaptop) {
      const card = document.createElement('div');
      card.className = 'chat-laptop-card-action';
      card.innerHTML = `
        <div class="card-mini-title">⭐ Rekomendasi: ${suggestedLaptop.title}</div>
        <div class="card-mini-price">${suggestedLaptop.price} — ${suggestedLaptop.badge || ''}</div>
        <div class="btn-action-group">
          <button class="btn-mini-inspect" onclick="openLaptopInspector('${suggestedLaptop.id}')">🔍 Inspeksi 3D 360°</button>
          <button class="btn-mini-buy" onclick="document.getElementById('chat-window').classList.remove('active'); startLaptopCheckout('${suggestedLaptop.id}')">🛒 Pesan Unit</button>
        </div>
      `;
      botBubble.appendChild(card);
    }

    chatMessages.appendChild(botBubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    playUIChime();
  }
}


