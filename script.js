// ═══════════════════════════════════════════
// CORE UI LOGIC
// ═══════════════════════════════════════════

// Sidebar Toggle
function toggleSidebar() {
  const s = document.getElementById('sidebar');
  const m = document.getElementById('main');
  const t = document.getElementById('controlsWrap');
  if (window.innerWidth <= 768) {
    s.classList.toggle('open');
  } else {
    s.classList.toggle('collapsed');
    m.classList.toggle('expanded');
    t.classList.toggle('shifted');
  }
}

// Theme Toggle
function toggleTheme() {
  const root = document.documentElement;
  const currentTheme = root.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  // Re-render chart if it exists to match theme colors
  if (window.finChart) {
    updateChartTheme(newTheme);
  }
}

// Initialize Theme
const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to dark for premium feel
document.documentElement.setAttribute('data-theme', savedTheme);

// Scroll to Top
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Scroll Spy & Back-to-top button
window.addEventListener('scroll', function() {
  const b = document.getElementById('btt');
  if (b) {
    if (window.scrollY > 400) b.classList.add('show');
    else b.classList.remove('show');
  }

  const sections = document.querySelectorAll('.story, .hero');
  const navLinks = document.querySelectorAll('.nav-list a');
  let current = '';
  sections.forEach(function(s) {
    if (window.scrollY >= s.offsetTop - 120) {
      current = s.getAttribute('id');
    }
  });
  navLinks.forEach(function(l) {
    l.classList.remove('active');
    if (l.getAttribute('href') === '#' + current) {
      l.classList.add('active');
    }
  });
});

// Smooth scroll for nav links
document.querySelectorAll('.nav-list a').forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (window.innerWidth <= 768) {
      document.getElementById('sidebar').classList.remove('open');
    }
  });
});

// Accordion
function toggleAcc(h) {
  h.parentElement.classList.toggle('open');
}

// ═══════════════════════════════════════════
// INTERACTIVE FEATURES
// ═══════════════════════════════════════════

// 1. ROI Calculator
function updateCalc() {
  const txns = parseInt(document.getElementById('calc-txns').value);
  const comm = parseFloat(document.getElementById('calc-comm').value);
  
  document.getElementById('val-txns').innerText = txns;
  document.getElementById('val-comm').innerText = comm.toFixed(2);
  
  const avgValue = 3500000;
  const certFee = 15000;
  const escrowFee = avgValue * 0.003;
  const commFee = avgValue * (comm / 100);
  
  // Total Revenue per Txn
  const totalRev = certFee + commFee + escrowFee + 1000;
  const directCost = 5950;
  const contribution = totalRev - directCost;
  
  const monthlyContrib = contribution * txns;
  const fixedCost = 350000; // Rs 3.5L fixed
  const coverRatio = (monthlyContrib / fixedCost).toFixed(1);
  
  // Format Indian Currency
  const formattedContrib = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(monthlyContrib);
  
  document.getElementById('out-contrib').innerText = formattedContrib;
  document.getElementById('out-cover').innerText = coverRatio + 'x';
}

// 2. Chart.js Dashboard
document.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById('financialChart');
  if (ctx) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#f8fafc' : '#0f172a';
    const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    
    window.finChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Year 1', 'Year 2', 'Year 3'],
        datasets: [
          {
            label: 'Revenue (₹ Crores)',
            data: [3.2, 12.8, 28.5],
            backgroundColor: 'rgba(37, 99, 235, 0.8)',
            borderRadius: 6
          },
          {
            label: 'EBITDA (₹ Crores)',
            data: [-0.8, 1.5, 8.0],
            backgroundColor: 'rgba(16, 185, 129, 0.8)',
            borderRadius: 6
          },
          {
            label: 'Monthly Transactions',
            type: 'line',
            data: [180, 750, 1800],
            borderColor: '#a78bfa',
            borderWidth: 3,
            tension: 0.4,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: textColor, font: { family: 'Inter' } } }
        },
        scales: {
          x: { ticks: { color: textColor }, grid: { display: false } },
          y: { 
            ticks: { color: textColor }, 
            grid: { color: gridColor },
            title: { display: true, text: '₹ Crores', color: textColor }
          },
          y1: {
            position: 'right',
            ticks: { color: textColor },
            grid: { display: false },
            title: { display: true, text: 'Transactions', color: textColor }
          }
        }
      }
    });
  }
  
  // Initialize calc
  if(document.getElementById('calc-txns')) updateCalc();
  
  // Add fade-in animation to sections
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.story, .hero').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });
});

// Update Chart Theme Dynamically
function updateChartTheme(theme) {
  if (!window.finChart) return;
  const isDark = theme === 'dark';
  const textColor = isDark ? '#f8fafc' : '#0f172a';
  const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  
  window.finChart.options.plugins.legend.labels.color = textColor;
  window.finChart.options.scales.x.ticks.color = textColor;
  window.finChart.options.scales.y.ticks.color = textColor;
  window.finChart.options.scales.y.grid.color = gridColor;
  window.finChart.options.scales.y.title.color = textColor;
  window.finChart.options.scales.y1.ticks.color = textColor;
  window.finChart.options.scales.y1.title.color = textColor;
  window.finChart.update();
}

// 3. Download Agreement (html2pdf)
function downloadAgreement() {
  const element = document.getElementById('agreement-template');
  // Temporarily show it for rendering
  element.style.display = 'block';
  
  const opt = {
    margin:       1,
    filename:     'Realty_Managers_Master_Franchise_Agreement.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  
  html2pdf().set(opt).from(element).save().then(() => {
    // Hide it again
    element.style.display = 'none';
  });
}

// 4. Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
  // Ctrl/Cmd + K for theme toggle
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    toggleTheme();
  }
  // Ctrl/Cmd + B for sidebar toggle
  if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
    e.preventDefault();
    toggleSidebar();
  }
});