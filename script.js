var currentStep = 1;
var totalSteps = 5;
var isAutoPlaying = false;
var autoPlayTimer = null;
var hasReachedStep5 = false;

var stepNum = document.getElementById('step-num');
var prevBtn = document.getElementById('prevBtn');
var nextBtn = document.getElementById('nextBtn');
var autoPlayBtn = document.getElementById('autoPlayBtn');
var finalPhoto = document.getElementById('finalPhoto');
var hiddenMsg = document.getElementById('hiddenMsg');

var BIRTH_DATE = new Date(2012, 9, 31);

function updateTimer() {
  var now = new Date();
  var years = Math.floor((now - BIRTH_DATE) / (365.25 * 24 * 60 * 60 * 1000));
  var mDiff = (now.getFullYear() - BIRTH_DATE.getFullYear()) * 12 + (now.getMonth() - BIRTH_DATE.getMonth());
  var months = mDiff % 12;
  var dDiff = now.getDate() - BIRTH_DATE.getDate();
  if (dDiff < 0) { months--; var prev = new Date(now.getFullYear(), now.getMonth(), 0); dDiff += prev.getDate(); }
  if (months < 0) months += 12;
  document.getElementById('yearsNum').textContent = years;
  document.getElementById('monthsNum').textContent = months;
  document.getElementById('daysNum').textContent = dDiff;
}

function goToStep(step) {
  if (step < 1 || step > totalSteps) return;
  currentStep = step;
  document.querySelectorAll('.step').forEach(function(s) { s.classList.remove('active'); });
  document.querySelector('.step[data-step="' + step + '"]').classList.add('active');
  stepNum.textContent = step;
  stepNum.classList.remove('pop');
  void stepNum.offsetWidth;
  stepNum.classList.add('pop');
  prevBtn.disabled = step === 1;
  if (step === 5) {
    nextBtn.disabled = true;
    nextBtn.classList.add('done');
    nextBtn.innerHTML = '❤';
    triggerStep5();
  } else {
    nextBtn.disabled = false;
    nextBtn.classList.remove('done');
    nextBtn.innerHTML = '<span class="gift-lid">🎀</span><span class="gift-box-body">🎁</span><span class="gift-ribbon"></span><span class="gift-ribbon-h"></span>';
  }
}

function nextStep() {
  if (currentStep < totalSteps) {
    nextBtn.classList.add('open');
    setTimeout(function() { nextBtn.classList.remove('open'); goToStep(currentStep + 1); }, 400);
  }
}

function prevStep() {
  if (currentStep > 1) goToStep(currentStep - 1);
}

nextBtn.addEventListener('click', nextStep);
prevBtn.addEventListener('click', prevStep);

// CARD FLIP
document.querySelectorAll('.card').forEach(function(card) {
  card.addEventListener('click', function(e) {
    if (e.target.closest('.nav-btn') || e.target.closest('.gift-btn') || e.target.closest('.auto-play-btn')) return;
    if (e.target.closest('input') || e.target.closest('textarea')) return;
    if (e.target.closest('.crypto-input') || e.target.closest('.crypto-btn') || e.target.closest('details') || e.target.closest('summary')) return;
    if (finalPhoto && (e.target === finalPhoto || finalPhoto.contains(e.target))) return;
    this.classList.toggle('flipped');
  });
});

// AUTO-PLAY
autoPlayBtn.addEventListener('click', function() {
  isAutoPlaying = !isAutoPlaying;
  if (isAutoPlaying) {
    this.textContent = '⏹ Detener';
    this.classList.add('active');
    if (currentStep < totalSteps) {
      autoPlayTimer = setInterval(function() {
        if (currentStep < totalSteps) nextStep();
        else stopAutoPlay();
      }, 6000);
    } else stopAutoPlay();
  } else stopAutoPlay();
});

function stopAutoPlay() {
  isAutoPlaying = false;
  autoPlayBtn.textContent = '▶ Reproducir recuerdos';
  autoPlayBtn.classList.remove('active');
  if (autoPlayTimer) { clearInterval(autoPlayTimer); autoPlayTimer = null; }
}

function triggerStep5() {
  if (hasReachedStep5) return;
  hasReachedStep5 = true;
  stopAutoPlay();
  updateTimer();
  setTimeout(fireConfetti, 300);
  setTimeout(fireConfetti, 800);
  setTimeout(fireConfetti, 1300);
}

function fireConfetti() {
  var def = { origin: { y: 0.7 }, spread: 60, ticks: 100 };
  confetti({ ...def, particleCount: 80, colors: ['#e74c3c', '#f1c40f', '#2ecc71', '#d4a574', '#c71585'] });
  confetti({ ...def, particleCount: 40, angle: 60, spread: 80 });
  confetti({ ...def, particleCount: 40, angle: 120, spread: 80 });
}

if (finalPhoto) {
  finalPhoto.addEventListener('click', function() { hiddenMsg.classList.toggle('show'); });
}

// KEYBOARD
document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextStep(); }
  if (e.key === 'ArrowLeft') { e.preventDefault(); prevStep(); }
});

// ========================================
// THREEDCARD 3D HOVER EFFECT (Vanilla JS)
// ========================================
document.querySelectorAll('.card-3d').forEach(function(card) {
  var cardInner = card.querySelector('.card-inner');
  var glowEl = card.querySelector('.card-glow');

  function updateTilt(e) {
    var rect = card.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var xPct = x / rect.width - 0.5;
    var yPct = y / rect.height - 0.5;
    var rotX = yPct * -8;
    var rotY = xPct * 8;
    card.style.transform = 'perspective(1000px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) scale3d(1,1,1)';
    card.style.boxShadow = (rotY * 0.8) + 'px ' + (20 - rotX * 0.6) + 'px 30px rgba(0,0,0,0.3)';
    if (glowEl) { glowEl.style.background = 'radial-gradient(circle at ' + (x/rect.width*100) + '% ' + (y/rect.height*100) + '%, rgba(255,255,255,0.15), transparent)'; }
  }

  card.addEventListener('mouseenter', function() {
    card.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1), box-shadow 0.6s cubic-bezier(0.23,1,0.32,1)';
    if (glowEl) glowEl.style.opacity = '1';
  });

  card.addEventListener('mousemove', updateTilt);

  card.addEventListener('mouseleave', function() {
    card.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1), box-shadow 0.6s cubic-bezier(0.23,1,0.32,1)';
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    card.style.boxShadow = '0 8px 32px rgba(139,94,60,0.12), 0 2px 8px rgba(139,94,60,0.08)';
    if (glowEl) glowEl.style.opacity = '0';
  });
});

// ========================================
// Background Ripple Effect
// ========================================
(function() {
  var container = document.getElementById('rippleBackground');
  if (!container) return;
  var cols = 24, rows, cells = [];
  var lastIdx = -1;
  var throttle = false;

  function resize() {
    rows = Math.ceil(window.innerHeight / (window.innerWidth / cols)) + 2;
    container.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';
    container.innerHTML = '';
    cells = [];
    for (var i = 0; i < rows * cols; i++) {
      var cell = document.createElement('div');
      cell.className = 'ripple-cell';
      cells.push(cell);
      container.appendChild(cell);
    }
  }

  function getNeighbors(idx) {
    var r = Math.floor(idx / cols), c = idx % cols;
    var n = [];
    for (var dr = -2; dr <= 2; dr++) {
      for (var dc = -2; dc <= 2; dc++) {
        if (dr === 0 && dc === 0) continue;
        var nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols)
          n.push({ idx: nr * cols + nc, dist: Math.abs(dr) + Math.abs(dc) });
      }
    }
    return n;
  }

  function trigger(idx) {
    if (idx < 0 || idx >= cells.length || idx === lastIdx) return;
    lastIdx = idx;
    var el = cells[idx];
    if (!el) return;
    el.classList.add('active');
    setTimeout(function() { el.classList.remove('active'); }, 800);
    var neighbors = getNeighbors(idx);
    neighbors.forEach(function(n) {
      var neb = cells[n.idx];
      if (!neb) return;
      var waveClass = 'wave' + n.dist;
      setTimeout(function() {
        neb.classList.add(waveClass);
        setTimeout(function() { neb.classList.remove(waveClass); }, 600);
      }, n.dist * 60);
    });
  }

  document.addEventListener('mousemove', function(e) {
    if (throttle) return;
    throttle = true;
    setTimeout(function() { throttle = false; }, 40);
    var col = Math.floor(e.clientX / (window.innerWidth / cols));
    var row = Math.floor(e.clientY / (window.innerHeight / rows));
    trigger(row * cols + col);
  });

  window.addEventListener('resize', resize);
  resize();
})();

// ========================================
// VALIS/137 Cipher
// ========================================
var BASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_.";

function getReorganized(seed) {
  var result = "", seen = {};
  var s = seed.toUpperCase();
  for (var i = 0; i < s.length; i++) {
    if (BASE.indexOf(s[i]) !== -1 && !seen[s[i]]) { seen[s[i]] = true; result += s[i]; }
  }
  for (var i = 0; i < BASE.length; i++) {
    if (!seen[BASE[i]]) result += BASE[i];
  }
  return result;
}

function buildBoard(reorg) {
  var board = [];
  for (var i = 0; i < 28; i++) {
    var row = "";
    for (var j = 0; j < 28; j++) row += reorg[(i + j) % 28];
    board.push(row);
  }
  return board;
}

function filterValid(t) {
  var r = "";
  for (var i = 0; i < t.length; i++) if (BASE.indexOf(t[i]) !== -1) r += t[i];
  return r;
}

function repeatKey(text, key) {
  var k = "";
  for (var i = 0; i < text.length; i++) k += key[i % key.length];
  return k;
}

function encrypt(text, key, seed) {
  var reorg = getReorganized(seed), board = buildBoard(reorg);
  var t = filterValid(text.toUpperCase()), k = repeatKey(t, key.toUpperCase());
  var r = "";
  for (var i = 0; i < t.length; i++) {
    r += board[BASE.indexOf(t[i])][BASE.indexOf(k[i])];
  }
  return r;
}

function decrypt(text, key, seed) {
  var reorg = getReorganized(seed);
  var t = filterValid(text.toUpperCase()), k = repeatKey(t, key.toUpperCase());
  var r = "";
  for (var i = 0; i < t.length; i++) {
    var cipherIdx = reorg.indexOf(t[i]);
    var keyIdx = BASE.indexOf(k[i]);
    r += BASE[(cipherIdx - keyIdx + 28) % 28];
  }
  return r;
}

// UI
var cryptoBtn = document.getElementById('cryptoBtn');
var crackBtn = document.getElementById('crackBtn');
var chainBtn = document.getElementById('chainBtn');

if (cryptoBtn) {
  cryptoBtn.addEventListener('click', function() {
    var input = document.getElementById('cryptoInput').value;
    var key = document.getElementById('cryptoKey').value;
    var seed = document.getElementById('cryptoSeed').value || 'VALIS';
    var mode = document.querySelector('input[name="cryptoMode"]:checked').value;
    var output = document.getElementById('cryptoOutput');
    if (!input || !key) { output.value = 'Completa todos los campos'; return; }
    try {
      output.value = mode === 'encrypt' ? encrypt(input, key, seed) : decrypt(input, key, seed);
    } catch(e) { output.value = 'Error: ' + e.message; }
  });
}

if (crackBtn) {
  crackBtn.addEventListener('click', function() {
    var ciphertext = document.getElementById('cryptoInput').value;
    var seed = document.getElementById('cryptoSeed').value || 'VALIS';
    var dict = document.getElementById('crackDict').value;
    var resultEl = document.getElementById('crackResult');
    if (!ciphertext || !dict) { resultEl.textContent = 'Completa el texto cifrado y el diccionario'; return; }
    var words = dict.split(',').map(function(w) { return w.trim().toUpperCase(); }).filter(function(w) { return w.length > 0; });
    resultEl.textContent = 'Probando ' + words.length + ' claves...';
    setTimeout(function() {
      for (var i = 0; i < words.length; i++) {
        try {
          var r = decrypt(ciphertext, words[i], seed);
          if (r.length > 0) { resultEl.innerHTML = '✅ Clave: <strong>' + words[i] + '</strong> → ' + r; return; }
        } catch(e) {}
      }
      resultEl.textContent = '❌ No se encontró ninguna clave válida';
    }, 50);
  });
}

if (chainBtn) {
  chainBtn.addEventListener('click', function() {
    var input = document.getElementById('cryptoInput').value;
    var seed = document.getElementById('cryptoSeed').value || 'VALIS';
    var keysStr = document.getElementById('chainKeys').value;
    var output = document.getElementById('cryptoOutput');
    if (!input || !keysStr) { output.value = 'Completa el texto y las claves'; return; }
    var keys = keysStr.split(',').map(function(k) { return k.trim(); }).filter(function(k) { return k.length > 0; });
    var result = input;
    try {
      for (var i = 0; i < keys.length; i++) result = encrypt(result, keys[i], seed);
      output.value = result;
    } catch(e) { output.value = 'Error: ' + e.message; }
  });
}

goToStep(1);
