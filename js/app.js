/**
 * Main Application Logic
 * Arnold Masatu Mutunda - Apple Style Portfolio
 */

// Certificate data directory
const CERTIFICATES_DATA = {
  time_mgmt: {
    title: 'Effective Time Management MOOC',
    issuer: 'Master Union / MOOC',
    date: 'Oct 2024',
    category: 'Productivity & Leadership',
    driveId: '1V_gj2UaGxLO0eiJpran4G-U5GXb8Wv4O',
    directLink: 'https://drive.google.com/file/d/1V_gj2UaGxLO0eiJpran4G-U5GXb8Wv4O/view?usp=drive_link',
    description: 'Comprehensive certification covering prioritization frameworks, agile task planning, time-blocking methods, and productivity workflows.'
  },
  cpp: {
    title: 'C++ Programming Specialist',
    issuer: 'Professional Programming Series',
    date: '2024 - 2025',
    category: 'Computer Science',
    driveId: '1b7zMUCDyzoszqeObPeCg-QwdbSd4LIH2',
    directLink: 'https://drive.google.com/file/d/1b7zMUCDyzoszqeObPeCg-QwdbSd4LIH2/view?usp=drive_link',
    description: 'Advanced modern C++ certification covering object-oriented design, STL containers, memory pointers, and high-performance algorithmic execution.'
  },
  dsa: {
    title: 'Data Structures and Algorithms',
    issuer: 'NeoColab',
    date: 'Apr 2026',
    category: 'Algorithms & Architecture',
    driveId: '19y7YONQCu-dKITAj9q4o2PPKCUmpBNFW',
    directLink: 'https://drive.google.com/file/d/19y7YONQCu-dKITAj9q4o2PPKCUmpBNFW/view?usp=drive_link',
    description: 'Rigorous credential in Trees, Graphs, Dynamic Programming, Sorting algorithms, Hash maps, and asymptotic time-space complexity optimization.'
  },
  java: {
    title: 'Java Programming Certification',
    issuer: 'Technical Computing Academy',
    date: '2024 - 2025',
    category: 'Object-Oriented Development',
    driveId: '1oZMlHmLW6cPSk1PBWsjmsn1RhV3xT_eA',
    directLink: 'https://drive.google.com/file/d/1oZMlHmLW6cPSk1PBWsjmsn1RhV3xT_eA/view?usp=drive_link',
    description: 'Core and Enterprise Java development covering OOP principles, Collections framework, Exception handling, Multi-threading, and JVM architecture.'
  },
  c_lang: {
    title: 'C Language Programming',
    issuer: 'Foundational Systems Engineering',
    date: '2024 - 2025',
    category: 'Systems Programming',
    driveId: '1FHreL7cPEA-4mjQDKdqUcRvtgOYSrtAp',
    directLink: 'https://drive.google.com/file/d/1FHreL7cPEA-4mjQDKdqUcRvtgOYSrtAp/view?usp=drive_link',
    description: 'Low-level systems programming fundamentals in C: manual memory management, pointer arithmetic, struct memory layout, and system calls.'
  },
  excel: {
    title: 'Advanced Microsoft Excel',
    issuer: 'Infosys Springboard',
    date: 'Aug 2026',
    category: 'Data Analytics & Modeling',
    driveId: '1pBdix26OVglxH1ABcrXWVb1RDAIzNiG7',
    directLink: 'https://drive.google.com/file/d/1pBdix26OVglxH1ABcrXWVb1RDAIzNiG7/view?usp=drive_link',
    description: 'Comprehensive business analytics certification covering Pivot Tables, VLOOKUP/XLOOKUP, statistical functions, data cleaning, and executive dashboard modeling.'
  },
  google_data: {
    title: 'Foundations: Data, Data, Everywhere',
    issuer: 'Google & Coursera',
    date: 'Mar 2024',
    category: 'Data Science & Data Engineering',
    driveId: '1CsK16F1N-aGD4SOymbogBJsJAVTGW0lZ',
    directLink: 'https://drive.google.com/file/d/1CsK16F1N-aGD4SOymbogBJsJAVTGW0lZ/view?usp=drive_link',
    description: 'Official Google Career Certificate foundation covering the end-to-end data lifecycle, analytical thinking, SQL queries, spreadsheet modeling, and data ethics.'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initTheme();
  initScrollSpy();
  initCertModal();
  initHUDToast();
  initSimulatorWidget();
  initContactForm();
  initScrollReveal();
});

// ==========================================
// Apple Menu Clock & Status
// ==========================================
function initClock() {
  const clockEl = document.getElementById('topBarClock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    const options = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    clockEl.textContent = now.toLocaleDateString('en-US', options);
  }
  update();
  setInterval(update, 30000);
}

// ==========================================
// Theme Toggle (Dark / Gold / Light)
// ==========================================
function initTheme() {
  const segmentBtns = document.querySelectorAll('[data-theme-set]');
  const legacyToggleBtn = document.getElementById('themeToggleBtn');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('arnold-theme') || (prefersDark ? 'dark' : 'dark');

  applyTheme(savedTheme, false);

  segmentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme-set');
      applyTheme(theme, true);
    });
  });

  if (legacyToggleBtn) {
    legacyToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      let next = 'dark';
      if (current === 'dark') next = 'gold';
      else if (current === 'gold') next = 'light';
      else next = 'dark';
      applyTheme(next, true);
    });
  }
}

function applyTheme(theme, notify = false) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('arnold-theme', theme);

  // Update active segment button
  document.querySelectorAll('[data-theme-set]').forEach(btn => {
    if (btn.getAttribute('data-theme-set') === theme) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Re-render simulator canvas if exists
  if (window.currentSimulator && window.lastSimulationSequence) {
    window.currentSimulator.render(window.lastSimulationSequence);
  }

  if (notify) {
    const labels = {
      dark: 'Space Black (Dark)',
      gold: 'Desert Titanium (Gold)',
      light: 'Silver Aluminum (Light)'
    };
    showHUDToast(`Switched to ${labels[theme] || theme} theme`);
  }
}

// ==========================================
// Apple Dock Scrollspy
// ==========================================
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const dockItems = document.querySelectorAll('.apple-dock .dock-item');

  function onScroll() {
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    dockItems.forEach(item => {
      const href = item.getAttribute('href');
      if (href === `#${currentId}`) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ==========================================
// Apple Sheet Modal for Certificates
// ==========================================
function initCertModal() {
  const modalOverlay = document.getElementById('certModalOverlay');
  const closeBtn = document.getElementById('certModalClose');
  const titleEl = document.getElementById('modalCertTitle');
  const issuerEl = document.getElementById('modalCertIssuer');
  const descEl = document.getElementById('modalCertDesc');
  const frameEl = document.getElementById('certIframe');
  const openLinkBtn = document.getElementById('modalDirectLinkBtn');
  const copyLinkBtn = document.getElementById('modalCopyLinkBtn');

  if (!modalOverlay) return;

  function closeModal() {
    modalOverlay.classList.remove('open');
    if (frameEl) frameEl.src = 'about:blank';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  // Attach click listener to certificate cards
  document.querySelectorAll('[data-cert-id]').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't open if clicked direct link button inside card
      if (e.target.closest('a') && !e.target.closest('.cert-open-modal-trigger')) {
        return;
      }
      
      const certKey = card.getAttribute('data-cert-id');
      const cert = CERTIFICATES_DATA[certKey];
      if (!cert) return;

      if (titleEl) titleEl.textContent = cert.title;
      if (issuerEl) issuerEl.textContent = `${cert.issuer} • ${cert.date}`;
      if (descEl) descEl.textContent = cert.description;
      if (openLinkBtn) openLinkBtn.href = cert.directLink;

      // Google Drive interactive embed preview
      if (frameEl) {
        frameEl.src = `https://drive.google.com/file/d/${cert.driveId}/preview`;
      }

      if (copyLinkBtn) {
        copyLinkBtn.onclick = () => {
          navigator.clipboard.writeText(cert.directLink).then(() => {
            showHUDToast('Certificate link copied to clipboard');
          });
        };
      }

      modalOverlay.classList.add('open');
    });
  });
}

// ==========================================
// Apple Dynamic Island / HUD Toast
// ==========================================
function showHUDToast(message) {
  const toast = document.getElementById('appleHudToast');
  const messageEl = document.getElementById('toastMessage');
  if (!toast || !messageEl) return;

  messageEl.textContent = message;
  toast.classList.add('visible');

  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove('visible');
  }, 2600);
}

function initHUDToast() {
  // Setup copy buttons
  document.querySelectorAll('[data-copy-text]').forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy-text');
      const label = btn.getAttribute('data-copy-label') || 'Copied';
      navigator.clipboard.writeText(textToCopy).then(() => {
        showHUDToast(`${label} copied to clipboard!`);
      }).catch(() => {
        showHUDToast(`Copied: ${textToCopy}`);
      });
    });
  });
}

// ==========================================
// Interactive Simulator Integration
// ==========================================
function initSimulatorWidget() {
  const canvas = document.getElementById('diskCanvas');
  if (!canvas || !window.DiskSimulator) return;

  const sim = new window.DiskSimulator('diskCanvas');
  window.currentSimulator = sim;

  const queueInput = document.getElementById('simQueueInput');
  const headInput = document.getElementById('simHeadInput');
  const algoSelect = document.getElementById('simAlgoSelect');
  const runBtn = document.getElementById('simRunBtn');

  const totalSeekEl = document.getElementById('simTotalSeek');
  const avgSeekEl = document.getElementById('simAvgSeek');
  const sequenceEl = document.getElementById('simSequence');

  function runSimulation() {
    const queue = sim.parseQueue(queueInput.value || '98, 183, 37, 122, 14, 124, 65, 67');
    const head = parseInt(headInput.value, 10) || 53;
    const algo = algoSelect.value;

    let result;
    if (algo === 'FCFS') result = sim.runFCFS(queue, head);
    else if (algo === 'SSTF') result = sim.runSSTF(queue, head);
    else if (algo === 'SCAN') result = sim.runSCAN(queue, head, 'right');
    else if (algo === 'C-SCAN') result = sim.runCSCAN(queue, head, 'right');

    if (result) {
      window.lastSimulationSequence = result.sequence;
      if (totalSeekEl) totalSeekEl.textContent = `${result.totalSeek} Cylinders`;
      if (avgSeekEl) avgSeekEl.textContent = `${result.avgSeek} Cylinders`;
      if (sequenceEl) sequenceEl.textContent = result.sequence.join(' → ');
      sim.render(result.sequence);
    }
  }

  if (runBtn) {
    runBtn.addEventListener('click', runSimulation);
  }

  if (algoSelect) {
    algoSelect.addEventListener('change', runSimulation);
  }

  // Run initial simulation
  setTimeout(runSimulation, 300);
}

// ==========================================
// Contact Form Submission (Simulated)
// ==========================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('#contactName')?.value || 'Friend';
    showHUDToast(`Thank you, ${name}! Your message was received.`);
    form.reset();
  });
}

// ==========================================
// Scroll Reveal Observer
// ==========================================
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal-on-scroll');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => observer.observe(el));
}
