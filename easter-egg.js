/* ==========================================
   AI Ethics Puzzle - Easter Egg
   Type "ethics" anywhere to activate
   ========================================== */
(function () {
  var buffer = '';
  var TRIGGER = 'ethics';

  document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    buffer += e.key.toLowerCase();
    if (buffer.length > 20) buffer = buffer.slice(-20);
    if (buffer.indexOf(TRIGGER) !== -1) {
      buffer = '';
      launchGame();
    }
  });

  /* ---------- Concepts for the puzzle ---------- */
  var CONCEPTS = [
    'Harm', 'Rights', 'Justice',
    'Autonomy', 'Accountability', 'Bias',
    'Consent', 'Fairness', 'Transparency',
    'Privacy', 'Safety', 'Trust',
    'Dignity', 'Oversight', 'Recourse'
  ];

  /* ---------- Launch ---------- */
  function launchGame() {
    if (document.getElementById('ee-overlay')) return;

    var overlay = document.createElement('div');
    overlay.id = 'ee-overlay';
    setStyles(overlay, {
      position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
      background: 'rgba(0,20,60,0.92)', zIndex: '99999',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
      animation: 'eeIn .35s ease'
    });

    var style = document.createElement('style');
    style.textContent =
      '@keyframes eeIn{from{opacity:0}to{opacity:1}}' +
      '@keyframes eePop{0%{transform:scale(1)}50%{transform:scale(1.12)}100%{transform:scale(1)}}' +
      '@keyframes eeShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}' +
      '@keyframes eeConfetti{0%{transform:translateY(0) rotate(0)}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}' +
      '.ee-tile{transition:all .15s ease;cursor:pointer;user-select:none}' +
      '.ee-tile:hover{filter:brightness(1.15);transform:scale(1.03)}';
    overlay.appendChild(style);

    var wrap = document.createElement('div');
    setStyles(wrap, {
      background: '#fff', borderRadius: '16px', padding: '2rem',
      maxWidth: '480px', width: '90%', textAlign: 'center',
      boxShadow: '0 20px 60px rgba(0,0,0,.5)', position: 'relative'
    });

    /* Close button */
    var close = document.createElement('button');
    close.innerHTML = '&times;';
    setStyles(close, {
      position: 'absolute', top: '12px', right: '16px', background: 'none',
      border: 'none', fontSize: '1.8rem', color: '#999', cursor: 'pointer',
      lineHeight: '1'
    });
    close.onclick = function () { document.body.removeChild(overlay); };
    wrap.appendChild(close);

    /* Header */
    var hdr = document.createElement('div');
    hdr.innerHTML =
      '<h2 style="color:#003478;margin:0 0 .25rem;font-size:1.5rem">AI Ethics Puzzle</h2>' +
      '<p style="color:#5a5a5a;margin:0 0 .15rem;font-size:.88rem">Arrange the concepts in alphabetical order!</p>';
    wrap.appendChild(hdr);

    /* Move counter & timer */
    var info = document.createElement('div');
    setStyles(info, {
      display: 'flex', justifyContent: 'center', gap: '1.5rem',
      margin: '.75rem 0', fontSize: '.9rem', color: '#003478', fontWeight: '600'
    });
    var movesEl = document.createElement('span');
    movesEl.textContent = 'Moves: 0';
    var timerEl = document.createElement('span');
    timerEl.textContent = 'Time: 0:00';
    info.appendChild(movesEl);
    info.appendChild(timerEl);
    wrap.appendChild(info);

    /* Grid */
    var grid = document.createElement('div');
    setStyles(grid, {
      display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '6px',
      margin: '0 auto', maxWidth: '380px'
    });
    wrap.appendChild(grid);

    /* Shuffle button */
    var shuffleBtn = document.createElement('button');
    shuffleBtn.textContent = 'New Game';
    setStyles(shuffleBtn, {
      marginTop: '1rem', padding: '.55rem 1.5rem', background: '#003478',
      color: '#F1C400', border: 'none', borderRadius: '8px', fontSize: '.9rem',
      fontWeight: '700', cursor: 'pointer', letterSpacing: '.03em'
    });
    wrap.appendChild(shuffleBtn);

    overlay.appendChild(wrap);
    document.body.appendChild(overlay);

    /* Overlay click to close */
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) document.body.removeChild(overlay);
    });

    /* ---- Game State ---- */
    var SIZE = 4;
    var TOTAL = SIZE * SIZE;
    var sorted = CONCEPTS.slice(0, TOTAL - 1).sort();
    var tiles; // current arrangement (null = empty)
    var moves = 0;
    var seconds = 0;
    var timerID = null;
    var solved = false;

    var PALETTE = [
      '#003478', '#0050a0', '#4A90D9', '#2d6cb4',
      '#1a4f8a', '#00245a', '#3373b8', '#5ba0e0',
      '#003478', '#0050a0', '#4A90D9', '#2d6cb4',
      '#1a4f8a', '#00245a', '#3373b8'
    ];

    function init() {
      tiles = sorted.slice();
      tiles.push(null);
      shuffle(tiles);
      while (!isSolvable(tiles)) shuffle(tiles);
      moves = 0;
      seconds = 0;
      solved = false;
      movesEl.textContent = 'Moves: 0';
      timerEl.textContent = 'Time: 0:00';
      if (timerID) clearInterval(timerID);
      timerID = setInterval(function () {
        if (solved) return;
        seconds++;
        var m = Math.floor(seconds / 60);
        var s = seconds % 60;
        timerEl.textContent = 'Time: ' + m + ':' + (s < 10 ? '0' : '') + s;
      }, 1000);
      render();
    }

    function shuffle(arr) {
      for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
      }
    }

    function isSolvable(arr) {
      var inv = 0;
      var flat = arr.filter(function (x) { return x !== null; });
      for (var i = 0; i < flat.length; i++)
        for (var j = i + 1; j < flat.length; j++)
          if (sorted.indexOf(flat[i]) > sorted.indexOf(flat[j])) inv++;
      var emptyRow = Math.floor(arr.indexOf(null) / SIZE);
      if (SIZE % 2 === 1) return inv % 2 === 0;
      return (inv + emptyRow) % 2 === 1; // even grid: inv + row of blank must be odd
    }

    function render() {
      grid.innerHTML = '';
      for (var i = 0; i < TOTAL; i++) {
        var cell = document.createElement('div');
        cell.className = 'ee-tile';
        if (tiles[i] === null) {
          setStyles(cell, {
            background: '#E8F0FE', borderRadius: '8px',
            aspectRatio: '1', display: 'flex', alignItems: 'center',
            justifyContent: 'center'
          });
        } else {
          var ci = sorted.indexOf(tiles[i]);
          setStyles(cell, {
            background: PALETTE[ci % PALETTE.length], color: '#fff',
            borderRadius: '8px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: '700', fontSize: '.82rem',
            aspectRatio: '1', boxShadow: '0 2px 6px rgba(0,52,120,.25)',
            textAlign: 'center', padding: '4px', lineHeight: '1.2'
          });
          cell.textContent = tiles[i];
          (function (idx) {
            cell.onclick = function () { tryMove(idx); };
          })(i);
        }
        grid.appendChild(cell);
      }
    }

    function tryMove(idx) {
      if (solved) return;
      var empty = tiles.indexOf(null);
      var row = Math.floor(idx / SIZE), col = idx % SIZE;
      var eRow = Math.floor(empty / SIZE), eCol = empty % SIZE;
      if ((Math.abs(row - eRow) + Math.abs(col - eCol)) !== 1) return;
      tiles[empty] = tiles[idx];
      tiles[idx] = null;
      moves++;
      movesEl.textContent = 'Moves: ' + moves;
      render();
      if (checkWin()) win();
    }

    function checkWin() {
      for (var i = 0; i < sorted.length; i++)
        if (tiles[i] !== sorted[i]) return false;
      return true;
    }

    function win() {
      solved = true;
      clearInterval(timerID);

      /* Confetti */
      var colors = ['#F1C400', '#003478', '#4A90D9', '#fff', '#FFD740'];
      for (var c = 0; c < 50; c++) {
        var dot = document.createElement('div');
        setStyles(dot, {
          position: 'fixed',
          left: Math.random() * 100 + '%',
          top: '-10px',
          width: (6 + Math.random() * 8) + 'px',
          height: (6 + Math.random() * 8) + 'px',
          background: colors[Math.floor(Math.random() * colors.length)],
          borderRadius: Math.random() > .5 ? '50%' : '2px',
          zIndex: '100000',
          animation: 'eeConfetti ' + (1.5 + Math.random() * 2) + 's ease-out forwards',
          animationDelay: Math.random() * .5 + 's',
          pointerEvents: 'none'
        });
        overlay.appendChild(dot);
      }

      var msg = document.createElement('div');
      setStyles(msg, {
        marginTop: '1rem', padding: '.75rem', background: '#FFF8E1',
        border: '2px solid #F1C400', borderRadius: '10px',
        animation: 'eePop .4s ease'
      });
      var m = Math.floor(seconds / 60);
      var s = seconds % 60;
      msg.innerHTML =
        '<p style="margin:0;font-weight:700;color:#003478;font-size:1.1rem">Puzzle Complete!</p>' +
        '<p style="margin:.25rem 0 0;color:#5a5a5a;font-size:.9rem">' +
        moves + ' moves in ' + m + ':' + (s < 10 ? '0' : '') + s +
        '</p>';
      wrap.appendChild(msg);
    }

    shuffleBtn.onclick = function () {
      var oldMsg = wrap.querySelector('div[style*="FFF8E1"]');
      if (oldMsg) wrap.removeChild(oldMsg);
      init();
    };

    init();
  }

  function setStyles(el, obj) {
    for (var k in obj) el.style[k] = obj[k];
  }
})();
