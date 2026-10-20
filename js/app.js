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

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
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
});

// 1. Initialize Virtual Office 3D
let virtualOffice;
function initVirtualOffice() {
  const container = document.getElementById('canvas-container');
  if (!container) return;

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
    }
  });
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
      } else {
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

  title.innerHTML = `${zone.icon} ${zone.name}`;
  desc.textContent = zone.subtitle;
  container.classList.add('visible');
}

function hideInteractionPrompt() {
  const container = document.getElementById('interaction-prompt');
  if (container) container.classList.remove('visible');
}

function handleZoneAction(zone) {
  if (zone.id === 'lobby') {
    openModal('modal-reception');
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
