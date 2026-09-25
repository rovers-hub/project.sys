// TODO: 実際の音源ファイルに差し替えること
const EVENTS = [
  { date: "2026-09-26", word: "みつけた", audio: "audio/true.mp3" },
  { date: "2026-09-27", word: "しんれい", audio: "audio/true.mp3" },
];

const HIRAGANA_POOL =
  "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん".split("");

const BUTTON_COUNT = 12;
const WORD_LENGTH = 4;

const todayEvent = getTodayEvent();
let inputChars = [];

const inputBoxes = Array.from(document.querySelectorAll(".input-box"));
const buttonGrid = document.getElementById("buttonGrid");
const backspaceBtn = document.getElementById("backspaceBtn");
const decideBtn = document.getElementById("decideBtn");
const resultMessage = document.getElementById("resultMessage");
const player = document.getElementById("player");

function getTodayEvent() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const todayStr = `${y}-${m}-${d}`;
  return EVENTS.find((e) => e.date === todayStr) || EVENTS[0];
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildButtonChars(word) {
  const required = word.split("");
  const decoyCount = Math.max(BUTTON_COUNT - required.length, 0);
  const decoys = [];
  for (let i = 0; i < decoyCount; i++) {
    decoys.push(HIRAGANA_POOL[Math.floor(Math.random() * HIRAGANA_POOL.length)]);
  }
  return shuffle([...required, ...decoys]);
}

function renderButtons() {
  const chars = buildButtonChars(todayEvent.word);
  buttonGrid.innerHTML = "";
  chars.forEach((char) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "kana-btn";
    btn.textContent = char;
    btn.addEventListener("click", () => onKanaPress(char));
    buttonGrid.appendChild(btn);
  });
}

function renderInputBoxes() {
  inputBoxes.forEach((box, i) => {
    const char = inputChars[i] || "";
    box.textContent = char;
    box.classList.toggle("filled", Boolean(char));
  });
  decideBtn.disabled = inputChars.length !== WORD_LENGTH;
}

function onKanaPress(char) {
  if (inputChars.length >= WORD_LENGTH) return;
  inputChars.push(char);
  clearMessage();
  renderInputBoxes();
}

function onBackspace() {
  if (inputChars.length === 0) return;
  inputChars.pop();
  clearMessage();
  renderInputBoxes();
}

function onDecide() {
  if (inputChars.length !== WORD_LENGTH) return;
  const attempt = inputChars.join("");
  if (attempt === todayEvent.word) {
    showMessage("……扉が、開いた。", "success");
    player.src = todayEvent.audio;
    player.play().catch((err) => {
      console.warn("音声の再生に失敗しました（音源ファイル未設置の可能性があります）", err);
    });
  } else {
    showMessage("……何も起こらない。もう一度。", "error");
    renderButtons();
  }
}

function showMessage(text, type) {
  resultMessage.textContent = text;
  resultMessage.className = "result-message " + type;
}

function clearMessage() {
  resultMessage.textContent = "";
  resultMessage.className = "result-message";
}

function init() {
  renderButtons();
  renderInputBoxes();
  backspaceBtn.addEventListener("click", onBackspace);
  decideBtn.addEventListener("click", onDecide);
}

init();
