const transactions = [
  { id: "TX01", from: "An", to: "Bình", amount: 35, fee: 3, required: "signed", signed: true, balance: 80 },
  { id: "TX02", from: "Café", to: "Nhà cung cấp", amount: 18, fee: 2, required: "signed", signed: true, balance: 45 },
  { id: "TX03", from: "Châu", to: "Dũng", amount: 92, fee: 4, required: "signed", signed: true, balance: 50 },
  { id: "TX04", from: "Mai", to: "Hà", amount: 14, fee: 1, required: "signed", signed: false, balance: 70 },
  { id: "TX05", from: "Kho bạc", to: "Miner", amount: 60, fee: 5, required: "signed", signed: true, balance: 120 },
  { id: "TX06", from: "Oracle", to: "Contract", amount: 1, fee: 2, required: "oracle-data", signed: true, balance: 10, hasOracleData: false },
  { id: "TX07", from: "Lan", to: "Minh", amount: 22, fee: 2, required: "signed", signed: true, balance: 40 },
  { id: "TX08", from: "Shop", to: "Bank", amount: 130, fee: 6, required: "signed", signed: true, balance: 180 }
];

const steps = [
  { title: "Intro mission", terms: ["node"], mission: "Bạn là một node trong mạng blockchain. Nhiệm vụ của bạn là tạo các block mà mạng có thể chấp nhận." },
  { title: "Chọn giao dịch hợp lệ", terms: ["transaction", "mempool", "valid transaction"], mission: "Chọn giao dịch từ mempool để tạo block ứng viên. Mạng sẽ không nói trước giao dịch nào sai." },
  { title: "Tạo block ứng viên", terms: ["block", "candidate block", "hash"], mission: "Kiểm tra block ứng viên. Giao dịch đúng chưa đủ; block còn cần vượt mining gate." },
  { title: "Thử nonce thủ công", terms: ["nonce", "difficulty"], mission: "Nhập nonce thủ công vài lần để thấy mỗi nonce tạo ra hash khác nhau." },
  { title: "Auto-mine và thêm block", terms: ["mining", "Proof-of-Work"], mission: "Mở khóa auto-mine, quan sát nhiều nonce thất bại trước khi tìm nonce hợp lệ." },
  { title: "Block thứ hai và previous hash", terms: ["previous hash", "chain"], mission: "Tạo block thứ hai và quan sát previous hash của nó phải khớp hash của Block #1." },
  { title: "Sửa dữ liệu cũ", terms: ["tampering", "invalid chain"], mission: "Sửa một giao dịch trong Block #1 rồi kiểm tra vì sao chain bị invalid." },
  { title: "Re-mine sau khi sửa", terms: ["re-mining"], mission: "Làm cho chain bị sửa trở nên hợp lệ lại bằng cách re-mine block bị ảnh hưởng và các block sau." },
  { title: "Fork và đồng thuận", terms: ["fork", "consensus", "accumulated work"], mission: "Quan sát hai nhánh cùng hợp lệ, sau đó chọn nhánh có nhiều accumulated work hơn." },
  { title: "Final challenge", terms: [], mission: "Tổng kết dấu vết học tập và trả lời quiz tình huống cuối." }
];

const dictionary = {
  node: ["Một máy tham gia mạng blockchain.", "Bạn đóng vai node kiểm tra block.", "Node không phải miner duy nhất quyết định sự thật."],
  transaction: ["Một yêu cầu chuyển giá trị hoặc gọi logic.", "Bạn chọn transaction từ mempool.", "Transaction vào mempool chưa có nghĩa là đã confirmed."],
  mempool: ["Nơi giao dịch hợp lệ chờ được đưa vào block.", "Bạn chọn giao dịch từ danh sách này.", "Mempool không phải blockchain."],
  "valid transaction": ["Giao dịch vượt qua rule tối thiểu.", "Rule gồm đủ balance, chữ ký/dữ liệu bắt buộc.", "Fee cao không làm giao dịch sai thành đúng."],
  block: ["Gói dữ liệu gồm giao dịch và metadata.", "Block chứa transaction list, previous hash, nonce.", "Block không chỉ là một dòng giao dịch."],
  "candidate block": ["Block đang được đề xuất nhưng chưa được chấp nhận.", "Bạn tạo block ứng viên trước khi mining.", "Mine xong cũng cần kiểm tra rule."],
  hash: ["Dấu vân tay của dữ liệu.", "Dữ liệu block đổi thì hash đổi.", "Hash không phải mã bí mật để giải ngược."],
  nonce: ["Con số miner thay đổi để tạo hash khác.", "Bạn nhập nonce và thử hash.", "Nonce không phải password."],
  difficulty: ["Điều kiện hash phải thỏa mãn.", "Mô phỏng dùng hash bắt đầu bằng 00.", "Difficulty không nói giao dịch đúng hay sai."],
  mining: ["Quá trình thử nonce đến khi hash đạt target.", "Bạn quan sát nhiều nonce fail rồi một nonce success.", "Mining không phải chọn giao dịch fee cao."],
  "Proof-of-Work": ["Bằng chứng rằng miner đã tốn công thử nonce.", "Hash đạt target là proof trong mô phỏng.", "Tìm khó, kiểm tra dễ."],
  "previous hash": ["Hash của block trước được lưu trong block sau.", "Block #2 previous hash phải khớp Block #1 hash.", "Nó nối các block thành chain."],
  chain: ["Chuỗi block liên kết bằng previous hash.", "Bạn kiểm tra link giữa Block #1 và Block #2.", "Một chain nhìn thấy trên màn hình chưa chắc hợp lệ."],
  tampering: ["Sửa dữ liệu cũ sau khi block đã mined.", "Bạn sửa amount trong Block #1.", "Có thể sửa local, nhưng chain sẽ fail."],
  "invalid chain": ["Chain không vượt qua kiểm tra rule.", "Tamper làm previous hash không khớp.", "Invalid không có nghĩa là file biến mất."],
  "re-mining": ["Đào lại block sau khi dữ liệu đổi.", "Bạn re-mine Block #1 và Block #2.", "Sửa lịch sử kéo theo làm lại work."],
  fork: ["Hai nhánh cùng mở rộng một block trước.", "Nhánh A và B cùng hợp lệ tạm thời.", "Fork không nhất thiết là lỗi."],
  consensus: ["Quy tắc để mạng chọn lịch sử tiếp tục.", "Mô phỏng chọn nhánh có nhiều work hơn.", "Không phải node thích nhánh nào cũng được."],
  "accumulated work": ["Tổng lượng work đã tích lũy trên nhánh.", "Nhánh dài hơn đại diện giản lược cho nhiều work hơn.", "Chính xác hơn chỉ nói longest chain."]
};

const quizGates = {
  0: { q: "Bạn đang đóng vai gì trong mô phỏng này?", a: 0, options: ["Một node kiểm tra và chấp nhận block theo rule", "Một ngân hàng trung tâm quyết định mọi giao dịch", "Một ví chỉ gửi tiền nhưng không kiểm tra gì"] },
  1: { q: "Bạn chọn TX03 và bị transaction gate từ chối. Lý do hợp lý nhất là gì?", a: 1, options: ["Fee của TX03 quá thấp", "Sender không đủ balance cho amount + fee", "Hash của block chưa bắt đầu bằng 00"] },
  2: { q: "Vì sao block ứng viên có giao dịch hợp lệ vẫn chưa được accept?", a: 2, options: ["Vì mempool bị rỗng", "Vì chưa có tên miner", "Vì hash chưa đạt difficulty nên mining gate chưa qua"] },
  3: { q: "Bạn nhập nhiều nonce và hash thay đổi liên tục. Điều này cho thấy gì?", a: 0, options: ["Nonce thay đổi đầu vào hash của block", "Nonce là số thứ tự transaction", "Nonce càng lớn thì chắc chắn càng đúng"] },
  4: { q: "Vì sao Auto-mine phải thử nhiều nonce trước khi block được chấp nhận?", a: 1, options: ["Vì node không biết sender là ai", "Vì cần tìm nonce làm hash đạt difficulty target", "Vì mempool chỉ cho chọn một giao dịch"] },
  5: { q: "Block #2 previous hash phải khớp với giá trị nào?", a: 0, options: ["Hash của Block #1", "Merkle root của Block #2", "Nonce của Block #1"] },
  6: { q: "Bạn sửa giao dịch trong Block #1. Vì sao link sang Block #2 bị hỏng?", a: 2, options: ["Vì fee của Block #2 tự đổi", "Vì mempool xóa giao dịch", "Vì hash mới của Block #1 không còn khớp previous hash đang lưu trong Block #2"] },
  7: { q: "Muốn làm chain đã tamper hợp lệ lại, bạn phải làm gì?", a: 1, options: ["Chỉ sửa text hiển thị", "Re-mine block bị sửa và các block sau nó", "Tăng fee của transaction cuối"] },
  8: { q: "Khi hai nhánh đều hợp lệ tạm thời, mô phỏng chọn nhánh nào?", a: 2, options: ["Nhánh có amount lớn nhất", "Nhánh được bấm trước", "Nhánh có nhiều accumulated work hơn"] },
  9: { q: "Kết luận đúng nhất sau toàn bộ mô phỏng là gì?", a: 0, options: ["Blockchain làm việc sửa lịch sử bị phát hiện và tốn công để làm hợp lệ lại", "Blockchain cấm người dùng gõ sửa dữ liệu local", "Miner được tin tuyệt đối nên node không cần kiểm tra"] }
};

const hints = {
  1: "Đừng nhìn fee trước. Hãy kiểm tra sender có đủ balance và transaction có đủ dữ liệu bắt buộc không.",
  2: "So sánh transaction gate và mining gate: một gate kiểm tra dữ liệu, gate kia kiểm tra Proof-of-Work.",
  3: "Đừng cố đoán nonce đúng ngay. Hãy quan sát mỗi nonce làm hash đổi như thế nào.",
  4: "Mining là thử nhiều nonce cho đến khi hash đạt rule, không phải giải ngược hash.",
  5: "Đặt cạnh Hash của Block #1 và Previous hash của Block #2. Chúng phải giống nhau.",
  6: "So sánh hash mới của Block #1 với previous hash đang lưu trong Block #2.",
  7: "Dữ liệu Block #1 đổi làm hash đổi. Block #2 trỏ tới hash cũ, nên cũng phải cập nhật và re-mine.",
  8: "Đừng chọn ngay khi hai nhánh vừa xuất hiện. Hãy xem nhánh nào có thêm block/work."
};

const miniQuestions = [
  { q: "Mempool chứa gì?", a: 0, options: ["Giao dịch đang chờ", "Block đã confirm", "Private key"] },
  { q: "Hash thay đổi khi nào?", a: 1, options: ["Khi đổi màu UI", "Khi dữ liệu đầu vào đổi", "Khi refresh trang"] },
  { q: "Node làm gì với block?", a: 2, options: ["Tin ngay", "Xóa mempool", "Kiểm tra rule"] },
  { q: "Nonce dùng để làm gì?", a: 0, options: ["Tạo hash khác", "Tăng balance", "Ký giao dịch"] },
  { q: "Fork là gì?", a: 1, options: ["Giao dịch sai", "Hai nhánh cạnh tranh", "Một nonce đúng"] }
];

const state = {
  step: 0,
  completed: new Set(),
  introStarted: false,
  selectedTx: new Set(),
  revealedTx: new Set(),
  candidate: null,
  chain: [],
  manualAttempts: [],
  miningLog: [],
  fork: null,
  hints: { credits: 0, used: 0, miniIndex: 0, visible: false },
  quiz: { selected: null, attempts: 0, feedback: "" },
  explain: { fail: "", takeaway: "" },
  log: {
    invalidTxAttempts: 0,
    manualNonceAttempts: 0,
    firstValidNonce: "-",
    blocksMined: 0,
    tamperResult: "Chưa thử",
    chainFailure: "-",
    hintsUsed: 0,
    quizAttempts: 0,
    remineAttempts: 0
  }
};

const els = {
  missionMap: document.querySelector("#missionMap"),
  stepEyebrow: document.querySelector("#stepEyebrow"),
  stepTitle: document.querySelector("#stepTitle"),
  simulationArea: document.querySelector("#simulationArea"),
  currentMission: document.querySelector("#currentMission"),
  gateStatus: document.querySelector("#gateStatus"),
  explainPanel: document.querySelector("#explainPanel"),
  hintBalance: document.querySelector("#hintBalance"),
  hintBtn: document.querySelector("#hintBtn"),
  hintPanel: document.querySelector("#hintPanel"),
  dictionaryPanel: document.querySelector("#dictionaryPanel"),
  quizPanel: document.querySelector("#quizPanel"),
  learningLog: document.querySelector("#learningLog"),
  resetBtn: document.querySelector("#resetBtn")
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

async function sha256(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function txValid(tx) {
  if (tx.balance < tx.amount + tx.fee) return false;
  if (!tx.signed) return false;
  if (tx.required === "oracle-data" && !tx.hasOracleData) return false;
  return true;
}

function txReason(tx) {
  if (tx.balance < tx.amount + tx.fee) return "sender không đủ balance";
  if (!tx.signed) return "thiếu chữ ký/validation data";
  if (tx.required === "oracle-data" && !tx.hasOracleData) return "thiếu oracle data bắt buộc";
  return "hợp lệ";
}

function difficultyPrefix() {
  return "00";
}

async function hashBlock(block) {
  return sha256([
    block.index,
    block.previousHash,
    block.nonce,
    block.timestamp,
    JSON.stringify(block.transactions)
  ].join("|"));
}

async function merkleRoot(txs) {
  const payload = txs.map((tx) => `${tx.id}|${tx.from}|${tx.to}|${tx.amount}|${tx.fee}`).join("||");
  return sha256(payload || "empty");
}

function visibleTerms() {
  const terms = new Set();
  for (let i = 0; i <= state.step; i += 1) {
    steps[i].terms.forEach((term) => terms.add(term));
  }
  return [...terms];
}

function canAccessStep(index) {
  return index === 0 || state.completed.has(index - 1) || index <= state.step;
}

function setStep(index) {
  if (!canAccessStep(index)) return;
  state.step = index;
  state.quiz = { selected: null, attempts: 0, feedback: "" };
  state.explain = { fail: "", takeaway: "" };
  render();
}

function completeStep() {
  state.completed.add(state.step);
  state.explain.takeaway = takeawayForStep(state.step);
  if (state.step < steps.length - 1) {
    state.step += 1;
    state.quiz = { selected: null, attempts: 0, feedback: "" };
    state.explain.fail = "";
  }
  render();
}

function takeawayForStep(step) {
  const notes = [
    "Bạn là node: nhiệm vụ không phải tin ai, mà là kiểm tra rule.",
    "Transaction gate chặn dữ liệu sai trước khi block được đào.",
    "Block ứng viên đúng giao dịch vẫn chưa đủ; còn phải qua mining gate.",
    "Nonce làm hash đổi. Mining là thử nhiều nonce, không phải đoán password.",
    "Proof-of-Work tạo chi phí đề xuất block và giúp node kiểm tra dễ.",
    "Previous hash nối block sau với block trước, tạo thành chain.",
    "Dữ liệu có thể sửa local, nhưng chain sẽ fail khi hash link không khớp.",
    "Sửa lịch sử kéo theo re-mine block bị sửa và các block sau.",
    "Fork có thể cùng hợp lệ tạm thời; đồng thuận chọn nhánh có nhiều work hơn.",
    "Bạn đã đi qua các cơ chế chính: validation, mining, chain link, tamper, re-mine, consensus."
  ];
  return notes[step] || "";
}

function gateRows() {
  const defaults = {
    "Transaction gate": "Chưa kiểm tra",
    "Mining gate": "Khóa",
    "Chain link gate": "Khóa",
    "Consensus gate": "Khóa"
  };
  if (state.step >= 1) defaults["Transaction gate"] = state.candidate ? "Passed" : "Đang thử";
  if (state.step >= 2) defaults["Mining gate"] = state.chain.length ? "Passed" : "Failed/đang thử";
  if (state.step >= 5) defaults["Chain link gate"] = validateChainSync().valid ? "Passed" : "Failed";
  if (state.step >= 8) defaults["Consensus gate"] = state.fork?.chosen ? "Passed" : "Đang quan sát";
  return defaults;
}

function validateChainSync() {
  for (let i = 1; i < state.chain.length; i += 1) {
    if (state.chain[i].previousHash !== state.chain[i - 1].hash) {
      return { valid: false, at: `Block #${state.chain[i].index}` };
    }
  }
  return { valid: true, at: "-" };
}

function render() {
  renderMissionMap();
  renderStep();
  renderLearningPanel();
  renderLog();
}

function renderMissionMap() {
  els.missionMap.innerHTML = steps.map((step, index) => {
    const locked = !canAccessStep(index);
    const done = state.completed.has(index);
    const active = state.step === index;
    return `
      <li class="mission-item ${locked ? "locked" : ""} ${done ? "done" : ""} ${active ? "active" : ""}">
        <span class="mission-number">${done ? "✓" : index}</span>
        <button class="mission-link" data-step="${index}" ${locked ? "disabled" : ""}>
          <p class="mission-label">${step.title}</p>
          <p class="mission-state">${locked ? "Đang khóa" : done ? "Hoàn thành" : active ? "Đang học" : "Đã mở"}</p>
        </button>
      </li>
    `;
  }).join("");
}

function renderStep() {
  els.stepEyebrow.textContent = `Bước ${state.step}`;
  els.stepTitle.textContent = steps[state.step].title;
  const renderers = [
    renderIntro,
    renderTransactions,
    renderCandidateCheck,
    renderManualNonce,
    renderAutoMine,
    renderSecondBlock,
    renderTamper,
    renderRemine,
    renderFork,
    renderFinal
  ];
  els.simulationArea.innerHTML = renderers[state.step]();
}

function renderIntro() {
  return `
    <div class="mission-card">
      <h3>Bạn là một node trong mạng blockchain</h3>
      <p>Nhiệm vụ của bạn là tạo và kiểm tra các block sao cho mạng có thể chấp nhận. Bạn chưa cần biết hết lý thuyết. Hãy bắt đầu bằng hành động, quan sát phản hồi, rồi vượt quiz gate.</p>
      <button data-action="start">${state.introStarted ? "Mission đã bắt đầu" : "Start Mission"}</button>
    </div>
  `;
}

function renderTransactions() {
  return `
    <div class="work-card">
      <h3>Mempool</h3>
      <p>Chọn tối đa 3 giao dịch để tạo block ứng viên. Hệ thống chưa đánh dấu trước giao dịch nào sai.</p>
      <div class="tx-grid">
        ${transactions.map((tx) => {
          const checked = state.selectedTx.has(tx.id);
          const revealed = state.revealedTx.has(tx.id);
          const ok = txValid(tx);
          return `
            <label class="tx-card ${revealed ? ok ? "revealed-good" : "revealed-bad" : ""}">
              <input type="checkbox" data-tx="${tx.id}" ${checked ? "checked" : ""}>
              <span>
                <p class="tx-title">${tx.id}: ${tx.from} → ${tx.to}</p>
                <p class="tx-meta">Amount ${tx.amount}, fee ${tx.fee}, balance ${tx.balance}</p>
                ${revealed ? `<p class="tx-meta"><strong>${ok ? "Passed" : "Failed"}:</strong> ${txReason(tx)}</p>` : ""}
              </span>
            </label>
          `;
        }).join("")}
      </div>
      <div class="button-row">
        <button data-action="createCandidate">Tạo block ứng viên</button>
      </div>
    </div>
  `;
}

function renderCandidateCheck() {
  if (!state.candidate) return `<div class="locked-overlay">Bạn cần tạo block ứng viên hợp lệ ở bước trước.</div>`;
  return `
    <div class="block-card">
      <h3>Block ứng viên #${state.candidate.index}</h3>
      ${blockSummary(state.candidate)}
      <div class="button-row">
        <button data-action="checkCandidate">Kiểm tra block</button>
      </div>
    </div>
  `;
}

function renderManualNonce() {
  if (!state.candidate) return `<div class="locked-overlay">Chưa có block ứng viên.</div>`;
  return `
    <div class="block-card">
      <h3>Thử nonce thủ công</h3>
      <p>Nhập nonce và bấm thử. Bạn cần ít nhất 3 lần thử để mở quiz gate.</p>
      <div class="grid-2">
        <label class="field">Nonce<input id="manualNonce" inputmode="numeric" value="${state.candidate.nonce}"></label>
        <div class="hash-box"><span>Difficulty rule</span><code>Hash bắt đầu bằng ${difficultyPrefix()}</code></div>
      </div>
      <div class="button-row">
        <button data-action="tryNonce">Thử nonce</button>
      </div>
      <div class="chain-view">
        ${state.manualAttempts.map((item) => `<div class="log-line ${item.ok ? "success" : ""}">Nonce ${item.nonce}: ${item.hash.slice(0, 18)}... ${item.ok ? "success" : "failed"}</div>`).join("")}
      </div>
    </div>
  `;
}

function renderAutoMine() {
  if (!state.candidate) return `<div class="locked-overlay">Chưa có block ứng viên.</div>`;
  return `
    <div class="block-card">
      <h3>Auto-mine</h3>
      <p>Bây giờ bạn đã trải nghiệm nonce thủ công. Auto-mine sẽ thử nhanh nhiều nonce và hiển thị log.</p>
      <div class="button-row">
        <button data-action="autoMine">Bắt đầu auto-mine</button>
        <button data-action="addMinedBlock" ${state.candidate.mined ? "" : "disabled"}>Thêm block vào chain</button>
      </div>
      <div class="chain-view">
        ${state.miningLog.map((line, index) => `<div class="log-line ${line.includes("success") ? "success" : ""}">${index + 1}. ${line}</div>`).join("")}
      </div>
    </div>
  `;
}

function renderSecondBlock() {
  return `
    <div class="block-card">
      <h3>Block thứ hai</h3>
      <p>Tạo block #2. Nó phải lưu hash của Block #1 trong trường previous hash.</p>
      <div class="button-row">
        <button data-action="createSecondBlock">Tạo và mine Block #2</button>
        <button data-action="breakPrevHash" ${state.chain.length >= 2 ? "" : "disabled"}>Cố tình sửa previous hash sai</button>
        <button data-action="checkLinks" ${state.chain.length >= 2 ? "" : "disabled"}>Kiểm tra liên kết chain</button>
      </div>
      ${renderChain()}
    </div>
  `;
}

function renderTamper() {
  return `
    <div class="block-card">
      <h3>Sửa dữ liệu cũ</h3>
      <p>Hãy sửa amount trong Block #1. Mô phỏng không cấm bạn sửa local, nhưng chain có thể trở nên invalid.</p>
      <div class="button-row">
        <button data-action="tamperBlock">Sửa transaction trong Block #1</button>
        <button data-action="checkLinks">Kiểm tra chain</button>
      </div>
      ${renderChain()}
    </div>
  `;
}

function renderRemine() {
  return `
    <div class="block-card">
      <h3>Re-mine chain đã sửa</h3>
      <p>Để chain hợp lệ lại, bạn phải re-mine Block #1, cập nhật previous hash của Block #2, rồi re-mine Block #2.</p>
      <div class="button-row">
        <button data-action="remineChain">Re-mine các block bị ảnh hưởng</button>
      </div>
      ${renderChain()}
    </div>
  `;
}

function renderFork() {
  return `
    <div class="block-card">
      <h3>Fork và đồng thuận</h3>
      <p>Tạo hai nhánh cùng mở rộng một block. Lúc đầu cả hai có thể hợp lệ tạm thời.</p>
      <div class="button-row">
        <button data-action="createFork">Tạo fork</button>
        <button data-action="chooseFork" ${state.fork ? "" : "disabled"}>Chọn nhánh ngay</button>
        <button data-action="extendFork" ${state.fork ? "" : "disabled"}>Quan sát block tiếp theo</button>
        <button data-action="chooseWinner" ${state.fork?.extended ? "" : "disabled"}>Chọn nhánh nhiều work hơn</button>
      </div>
      ${renderForkView()}
    </div>
  `;
}

function renderFinal() {
  return `
    <div class="mission-card">
      <h3>Final challenge</h3>
      <p>Bạn đã đi qua các cơ chế chính. Quiz cuối kiểm tra xem bạn hiểu vì sao hệ thống chặn, accept, làm invalid và chọn nhánh.</p>
      <p>Hãy xem Learning log bên dưới để tự kiểm tra mình có thật sự trải nghiệm trial-and-error chưa.</p>
    </div>
  `;
}

function blockSummary(block) {
  return `
    <div class="grid-2">
      <div class="hash-box"><span>Previous hash</span><code>${block.previousHash.slice(0, 24)}...</code></div>
      <div class="hash-box"><span>Current hash</span><code>${block.hash ? `${block.hash.slice(0, 24)}...` : "Chưa tính"}</code></div>
      <div class="hash-box"><span>Nonce</span><code>${block.nonce}</code></div>
      <div class="hash-box"><span>Difficulty</span><code>Hash bắt đầu bằng ${difficultyPrefix()}</code></div>
    </div>
    <p><strong>Transactions:</strong> ${block.transactions.map((tx) => tx.id).join(", ")}</p>
  `;
}

function renderChain() {
  if (!state.chain.length) return `<div class="locked-overlay">Chain chưa có block.</div>`;
  return `
    <div class="chain-view">
      ${state.chain.map((block, index) => `
        <div class="block-row ${block.invalid ? "invalid" : ""}">
          <h4>Block #${block.index}</h4>
          <div class="block-data">
            <div><span class="data-label">Hash</span><code>${block.hash.slice(0, 30)}...</code></div>
            <div><span class="data-label">Previous hash</span><code>${block.previousHash.slice(0, 30)}...</code></div>
            ${index > 0 ? `<div><span class="data-label">So khớp với block trước</span>${block.previousHash === state.chain[index - 1].hash ? "Khớp" : "Không khớp"}</div>` : ""}
            <div><span class="data-label">Transactions</span>${block.transactions.map((tx) => `${tx.id}:${tx.amount}`).join(", ")}</div>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderForkView() {
  if (!state.fork) return `<div class="locked-overlay">Chưa tạo fork.</div>`;
  return `
    <div class="grid-2">
      <div class="block-row">
        <h4>Nhánh A</h4>
        <p>Blocks: ${state.fork.a}</p>
        <p>Accumulated work: ${state.fork.a}</p>
      </div>
      <div class="block-row ${state.fork.extended ? "" : ""}">
        <h4>Nhánh B</h4>
        <p>Blocks: ${state.fork.b}</p>
        <p>Accumulated work: ${state.fork.b}</p>
      </div>
    </div>
  `;
}

function renderLearningPanel() {
  els.currentMission.textContent = steps[state.step].mission;
  const gates = gateRows();
  els.gateStatus.innerHTML = Object.entries(gates).map(([name, value]) => `
    <div class="gate-row"><strong>${name}</strong><span class="pill ${value.includes("Passed") ? "ok" : value.includes("Failed") ? "bad" : "warn"}">${value}</span></div>
  `).join("");
  els.explainPanel.innerHTML = [
    ["Bạn đang làm gì?", steps[state.step].mission],
    ["Vì sao hệ thống kiểm tra?", whyForStep(state.step)],
    ["Bạn fail ở đâu?", state.explain.fail || "Chưa có lỗi nào ở bước này."],
    ["Key takeaway", state.explain.takeaway || "Chỉ hiện sau khi bạn vượt quiz gate của bước này."]
  ].map(([title, text]) => `<div class="explain-item"><h4>${title}</h4><p>${text}</p></div>`).join("");
  els.hintBalance.textContent = `Hint credits: ${state.hints.credits}/3. Hints đã dùng: ${state.hints.used}.`;
  renderHintPanel();
  renderDictionary();
  renderQuiz();
}

function whyForStep(step) {
  const text = [
    "Node phải kiểm tra rule để không cần tin mù quáng vào miner.",
    "Transaction gate bảo vệ mempool và block khỏi dữ liệu sai.",
    "Block phải qua nhiều gate: transaction đúng chưa đủ để được accept.",
    "Nonce là biến miner thay đổi để tạo hash mới.",
    "Proof-of-Work tạo chi phí cho việc đề xuất block.",
    "Previous hash nối lịch sử giữa các block.",
    "Tamper làm hash của block cũ đổi, phá liên kết với block sau.",
    "Re-mine cho thấy sửa lịch sử kéo theo chi phí tính toán.",
    "Consensus giúp mạng chọn một lịch sử khi có fork.",
    "Final quiz kiểm tra hiểu cơ chế từ tình huống, không phải học thuộc."
  ];
  return text[step];
}

function renderHintPanel() {
  if (state.hints.visible && hints[state.step]) {
    els.hintPanel.innerHTML = `<div class="explain-item"><h4>Gợi ý đã mở khóa</h4><p>${hints[state.step]}</p></div>`;
    return;
  }
  const mini = miniQuestions[state.hints.miniIndex % miniQuestions.length];
  els.hintPanel.innerHTML = `
    <div class="explain-item">
      <h4>Mua hint bằng mini-quiz</h4>
      <p>Một hint cần 3 credits. Trả lời đúng mini-question để nhận 1 credit.</p>
      <p><strong>${mini.q}</strong></p>
      <div class="quiz-options">
        ${mini.options.map((option, index) => `<label><input type="radio" name="miniHint" value="${index}"><span>${option}</span></label>`).join("")}
      </div>
      <button data-action="answerMiniHint">Trả lời mini-quiz</button>
    </div>
  `;
}

function renderDictionary() {
  els.dictionaryPanel.innerHTML = visibleTerms().map((term) => {
    const [def, role, misunderstanding] = dictionary[term];
    return `
      <details class="dict-entry">
        <summary>${term}</summary>
        <p><strong>Định nghĩa ngắn:</strong> ${def}</p>
        <p><strong>Vai trò trong mô phỏng:</strong> ${role}</p>
        <p><strong>Hiểu nhầm thường gặp:</strong> ${misunderstanding}</p>
      </details>
    `;
  }).join("");
}

function renderQuiz() {
  const gate = quizGates[state.step];
  if (!gate) {
    els.quizPanel.innerHTML = "";
    return;
  }
  const allowed = quizAllowed();
  els.quizPanel.innerHTML = `
    <div class="quiz-card">
      <p>${allowed ? gate.q : "Quiz gate đang khóa. Hãy hoàn thành hành động của bước này trước."}</p>
      ${allowed ? `
        <div class="quiz-options">
          ${gate.options.map((option, index) => `<label><input type="radio" name="quizGate" value="${index}" ${state.quiz.selected === index ? "checked" : ""}><span>${option}</span></label>`).join("")}
        </div>
        <button data-action="submitQuiz">Vượt quiz gate</button>
      ` : ""}
      ${state.quiz.feedback ? `<p><strong>Feedback:</strong> ${state.quiz.feedback}</p>` : ""}
    </div>
  `;
}

function quizAllowed() {
  if (state.step === 0) return state.introStarted;
  if (state.step === 1) return !!state.candidate;
  if (state.step === 2) return state.explain.fail.includes("Mining gate");
  if (state.step === 3) return state.manualAttempts.length >= 3;
  if (state.step === 4) return state.chain.length >= 1;
  if (state.step === 5) return state.chain.length >= 2 && validateChainSync().valid;
  if (state.step === 6) return state.log.chainFailure !== "-";
  if (state.step === 7) return validateChainSync().valid && state.log.remineAttempts > 0;
  if (state.step === 8) return state.fork?.chosen;
  return true;
}

function renderLog() {
  const items = [
    ["Invalid TX attempts", state.log.invalidTxAttempts],
    ["Manual nonce attempts", state.log.manualNonceAttempts],
    ["First valid nonce", state.log.firstValidNonce],
    ["Blocks mined", state.log.blocksMined],
    ["Tamper result", state.log.tamperResult],
    ["Chain failure", state.log.chainFailure],
    ["Hints used", state.log.hintsUsed],
    ["Quiz attempts", state.log.quizAttempts]
  ];
  els.learningLog.innerHTML = items.map(([label, value]) => `<div class="log-stat"><span>${label}</span><strong>${value}</strong></div>`).join("");
}

async function createCandidate() {
  const selected = transactions.filter((tx) => state.selectedTx.has(tx.id));
  if (!selected.length) {
    state.explain.fail = "Transaction gate failed: bạn chưa chọn giao dịch nào.";
    return render();
  }
  const invalid = selected.filter((tx) => !txValid(tx));
  selected.forEach((tx) => state.revealedTx.add(tx.id));
  if (invalid.length) {
    state.log.invalidTxAttempts += 1;
    state.explain.fail = `Transaction gate failed: ${invalid.map((tx) => `${tx.id} (${txReason(tx)})`).join(", ")}.`;
    return render();
  }
  const root = await merkleRoot(selected);
  state.candidate = {
    index: 1,
    previousHash: "0".repeat(64),
    nonce: 0,
    timestamp: Date.now(),
    transactions: clone(selected),
    merkleRoot: root,
    hash: ""
  };
  state.candidate.hash = await hashBlock(state.candidate);
  state.explain.fail = "";
  render();
}

async function checkCandidate() {
  state.explain.fail = "Transaction gate passed, nhưng Mining gate failed: hash hiện tại chưa đạt difficulty rule.";
  render();
}

async function tryNonce() {
  const input = document.querySelector("#manualNonce");
  const nonce = Number(input?.value) || 0;
  state.candidate.nonce = nonce;
  state.candidate.hash = await hashBlock(state.candidate);
  const ok = state.candidate.hash.startsWith(difficultyPrefix());
  state.manualAttempts.push({ nonce, hash: state.candidate.hash, ok });
  state.log.manualNonceAttempts += 1;
  state.explain.fail = ok ? "Nonce này đã đạt target. Nhưng bạn vẫn cần hiểu cơ chế qua quiz gate." : "Mining gate failed: hash chưa bắt đầu bằng 00.";
  render();
}

async function autoMineBlock(block, start = 0, max = 20000) {
  let nonce = start;
  let attempts = 0;
  const logs = [];
  while (nonce < max) {
    block.nonce = nonce;
    block.hash = await hashBlock(block);
    attempts += 1;
    if (logs.length < 12) logs.push(`Trying nonce ${nonce}: ${block.hash.slice(0, 12)}... failed`);
    if (block.hash.startsWith(difficultyPrefix())) {
      logs.push(`Trying nonce ${nonce}: ${block.hash.slice(0, 12)}... success`);
      return { block, attempts, logs };
    }
    nonce += 1;
  }
  return { block, attempts, logs };
}

async function autoMine() {
  const result = await autoMineBlock(state.candidate, Number(state.candidate.nonce) || 0);
  state.candidate = result.block;
  state.candidate.mined = true;
  state.miningLog = result.logs;
  state.log.firstValidNonce = state.log.firstValidNonce === "-" ? state.candidate.nonce : state.log.firstValidNonce;
  state.explain.fail = "";
  render();
}

function addMinedBlock() {
  if (!state.candidate?.mined) return;
  state.chain.push(clone(state.candidate));
  state.log.blocksMined = state.chain.length;
  state.explain.fail = "";
  render();
}

async function createSecondBlock() {
  const selected = transactions.filter((tx) => ["TX05", "TX07"].includes(tx.id));
  const block = {
    index: 2,
    previousHash: state.chain[0].hash,
    nonce: 0,
    timestamp: Date.now(),
    transactions: clone(selected),
    merkleRoot: await merkleRoot(selected),
    hash: ""
  };
  const result = await autoMineBlock(block, 0);
  state.chain[1] = result.block;
  state.log.blocksMined = state.chain.length;
  state.explain.fail = "Block #2 lưu previous hash khớp với hash của Block #1.";
  render();
}

function breakPrevHash() {
  if (state.chain[1]) {
    state.chain[1].previousHash = "x".repeat(64);
    state.chain[1].invalid = true;
    state.explain.fail = "Chain link gate failed: previous hash của Block #2 không khớp Hash của Block #1.";
  }
  render();
}

function checkLinks() {
  const result = validateChainSync();
  if (result.valid) {
    state.explain.fail = "Chain link gate passed: các previous hash đang khớp.";
  } else {
    state.log.chainFailure = result.at;
    state.explain.fail = `Chain link gate failed tại ${result.at}.`;
  }
  render();
}

async function tamperBlock() {
  if (!state.chain[0]) return;
  state.chain[0].transactions[0].amount += 7;
  state.chain[0].hash = await hashBlock(state.chain[0]);
  state.chain[0].invalid = true;
  state.log.tamperResult = "Block #1 hash đã đổi";
  state.explain.fail = "Bạn đã sửa dữ liệu local. Hash mới của Block #1 không còn khớp previous hash trong Block #2.";
  render();
}

async function remineChain() {
  if (state.chain.length < 2) return;
  const first = await autoMineBlock(state.chain[0], 0);
  state.chain[0] = first.block;
  state.chain[0].invalid = false;
  state.chain[1].previousHash = state.chain[0].hash;
  const second = await autoMineBlock(state.chain[1], 0);
  state.chain[1] = second.block;
  state.chain[1].invalid = false;
  state.log.remineAttempts = first.attempts + second.attempts;
  state.log.blocksMined = state.chain.length;
  state.explain.fail = "";
  render();
}

function createFork() {
  state.fork = { a: 1, b: 1, extended: false, chosen: false };
  state.explain.fail = "Consensus gate chưa thể chọn: cả hai nhánh đang hợp lệ tạm thời.";
  render();
}

function chooseFork() {
  if (!state.fork?.extended) {
    state.explain.fail = "Cả hai nhánh đều hợp lệ tại thời điểm này. Hãy quan sát block tiếp theo trước khi chọn.";
  }
  render();
}

function extendFork() {
  state.fork.b += 1;
  state.fork.extended = true;
  state.explain.fail = "Nhánh B vừa có thêm một block, đại diện cho nhiều accumulated work hơn trong mô phỏng giản lược.";
  render();
}

function chooseWinner() {
  if (state.fork?.extended) {
    state.fork.chosen = true;
    state.explain.fail = "Consensus gate passed: chọn nhánh có nhiều accumulated work hơn.";
  }
  render();
}

function submitQuiz() {
  const selected = document.querySelector("input[name='quizGate']:checked");
  if (!selected) {
    state.quiz.feedback = "Hãy chọn một đáp án.";
    return render();
  }
  const gate = quizGates[state.step];
  state.quiz.attempts += 1;
  state.log.quizAttempts += 1;
  if (Number(selected.value) === gate.a) {
    state.quiz.feedback = "Đúng. Bạn đã mở khóa bước tiếp theo.";
    completeStep();
  } else {
    state.quiz.feedback = "Chưa đúng. Hãy nhìn lại phản hồi gate và thử lại.";
    render();
  }
}

function answerMiniHint() {
  const selected = document.querySelector("input[name='miniHint']:checked");
  const mini = miniQuestions[state.hints.miniIndex % miniQuestions.length];
  if (!selected) return;
  if (Number(selected.value) === mini.a) {
    state.hints.credits += 1;
    state.hints.miniIndex += 1;
    if (state.hints.credits >= 3 && hints[state.step]) {
      state.hints.credits -= 3;
      state.hints.used += 1;
      state.log.hintsUsed += 1;
      state.hints.visible = true;
    }
  } else {
    state.hints.miniIndex += 1;
    state.explain.fail = "Mini-quiz chưa đúng. Không cộng hint credit, nhưng bạn có thể thử câu khác.";
  }
  render();
}

function handleAction(action) {
  const actions = {
    start: () => {
      state.introStarted = true;
      state.explain.fail = "Mission đã bắt đầu. Hãy trả lời quiz gate để mở bước chọn giao dịch.";
      render();
    },
    createCandidate,
    checkCandidate,
    tryNonce,
    autoMine,
    addMinedBlock,
    createSecondBlock,
    breakPrevHash,
    checkLinks,
    tamperBlock,
    remineChain,
    createFork,
    chooseFork,
    extendFork,
    chooseWinner,
    submitQuiz,
    answerMiniHint
  };
  actions[action]?.();
}

els.simulationArea.addEventListener("change", (event) => {
  const txId = event.target.dataset.tx;
  if (!txId) return;
  if (event.target.checked) {
    if (state.selectedTx.size >= 3) {
      event.target.checked = false;
      state.explain.fail = "Bạn chỉ được chọn tối đa 3 giao dịch cho block này.";
    } else {
      state.selectedTx.add(txId);
    }
  } else {
    state.selectedTx.delete(txId);
  }
  render();
});

document.body.addEventListener("click", (event) => {
  const action = event.target.dataset.action;
  const step = event.target.dataset.step;
  if (step !== undefined) setStep(Number(step));
  if (action) handleAction(action);
});

els.hintBtn.addEventListener("click", () => {
  if (state.hints.credits >= 3 && hints[state.step]) {
    state.hints.credits -= 3;
    state.hints.used += 1;
    state.log.hintsUsed += 1;
    state.hints.visible = true;
  } else {
    state.explain.fail = "Bạn cần trả lời đúng 3 mini-quiz để mở một hint.";
  }
  render();
});

els.resetBtn.addEventListener("click", () => {
  window.location.reload();
});

render();
