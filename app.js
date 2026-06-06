const initialTransactions = [
  { id: "TX01", from: "Alice", to: "Bob", amount: 45, fee: 3, valid: true },
  { id: "TX02", from: "Cafe", to: "Supplier", amount: 12.5, fee: 2, valid: true },
  { id: "TX03", from: "Carol", to: "Dave", amount: 0, fee: 4, valid: false, reason: "Amount phải lớn hơn 0" },
  { id: "TX04", from: "Shop", to: "Bank", amount: 230, fee: 6, valid: true },
  { id: "TX05", from: "Eve", to: "Frank", amount: 17.25, fee: 0, valid: false, reason: "Fee phải lớn hơn 0" },
  { id: "TX06", from: "Lender", to: "Borrower", amount: 300, fee: 8, valid: true },
  { id: "TX07", from: "Oracle", to: "Contract", amount: 1, fee: 2, valid: true },
  { id: "TX08", from: "Treasury", to: "Miner", amount: 60.4, fee: 2, valid: true }
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

const state = {
  mempool: clone(initialTransactions),
  selected: new Set(),
  chain: [],
  mining: false,
  fork: null,
  pendingTimestamp: new Date().toISOString(),
  quizSubmitted: false
};

const quizQuestions = [
  {
    id: "tx-validation",
    question: "Một giao dịch sai dữ liệu, ví dụ số tiền = 0, nên bị chặn ở đâu trước tiên?",
    options: [
      "Trước khi vào mempool, ở bước kiểm tra giao dịch",
      "Sau khi đã được thêm vào blockchain",
      "Chỉ sau khi miner nhận phần thưởng"
    ],
    answer: 0,
    mechanism: "Giao dịch phải qua bước kiểm tra hợp lệ trước khi được đưa vào mempool.",
    meaning: "Điều này ngăn dữ liệu vô nghĩa hoặc không hợp lệ làm tắc hệ thống."
  },
  {
    id: "mempool",
    question: "Mempool trong mô phỏng đại diện cho điều gì?",
    options: [
      "Danh sách giao dịch đang chờ được chọn vào block",
      "Danh sách block đã được xác nhận vĩnh viễn",
      "Nơi miner nhận reward ngay lập tức"
    ],
    answer: 0,
    mechanism: "Mempool chứa các giao dịch hợp lệ nhưng chưa được xác nhận.",
    meaning: "Một giao dịch vào mempool chưa có nghĩa là nó đã nằm trên blockchain."
  },
  {
    id: "previous-hash",
    question: "Previous hash có vai trò gì trong một block?",
    options: [
      "Liên kết block mới với block trước đó",
      "Tăng transaction fee cho miner",
      "Chọn ngẫu nhiên miner thắng cuộc"
    ],
    answer: 0,
    mechanism: "Block mới lưu hash của block trước.",
    meaning: "Nhờ liên kết này, sửa lịch sử sẽ làm các block sau không còn khớp."
  },
  {
    id: "mining",
    question: "Trong Proof-of-Work, miner đang tìm gì?",
    options: [
      "Một nonce làm cho block hash đạt độ khó/target",
      "Một sender có số dư cao nhất",
      "Một transaction có amount lớn nhất"
    ],
    answer: 0,
    mechanism: "Nonce thay đổi đầu vào hash cho tới khi hash đạt điều kiện.",
    meaning: "Mining làm việc tạo block tốn công nhưng việc kiểm tra block lại dễ."
  },
  {
    id: "node-verification",
    question: "Vì sao mine được block chưa nên hiểu là block chắc chắn được chấp nhận?",
    options: [
      "Vì node vẫn phải kiểm tra block theo rule của mạng",
      "Vì miner luôn được tin tuyệt đối",
      "Vì mempool sẽ tự động đổi hash"
    ],
    answer: 0,
    mechanism: "Node kiểm tra previous hash, transaction, Merkle root, nonce và difficulty.",
    meaning: "Blockchain giảm nhu cầu tin vào miner vì mọi node có thể tự xác minh."
  },
  {
    id: "reward",
    question: "Phần thưởng của miner nên được ghi nhận khi nào?",
    options: [
      "Sau khi block được network/node chấp nhận",
      "Ngay khi miner chọn transaction",
      "Trước khi transaction vào mempool"
    ],
    answer: 0,
    mechanism: "Phần thưởng chỉ có ý nghĩa khi block hợp lệ được chấp nhận.",
    meaning: "Cơ chế khuyến khích gắn với việc đóng góp block hợp lệ cho chain."
  },
  {
    id: "tamper",
    question: "Nếu sửa amount trong một block cũ, điều gì xảy ra về mặt cơ chế?",
    options: [
      "Hash của block thay đổi và chain có thể trở nên không hợp lệ",
      "Phần thưởng tự tăng lên",
      "Độ khó tự giảm để block vẫn hợp lệ"
    ],
    answer: 0,
    mechanism: "Hash phụ thuộc vào dữ liệu trong block.",
    meaning: "Blockchain không làm dữ liệu không thể gõ sửa, nhưng làm sửa đổi dễ bị phát hiện."
  },
  {
    id: "fork",
    question: "Fork nghĩa là gì trong ngữ cảnh blockchain?",
    options: [
      "Hai block/nhánh hợp lệ tạm thời cùng cạnh tranh làm tip của chain",
      "Một transaction bị thiếu fee",
      "Một miner nhập sai nonce"
    ],
    answer: 0,
    mechanism: "Hai block có thể cùng trỏ về một previous hash.",
    meaning: "Đồng thuận giúp mạng chọn một lịch sử chính thức sau khi có bất đồng."
  },
  {
    id: "consensus",
    question: "Trong mô phỏng nhập môn PoW, quy tắc đồng thuận được giản lược thế nào?",
    options: [
      "Chuỗi hợp lệ dài hơn thắng, tức phiên bản đơn giản của quy tắc nhiều accumulated work hơn",
      "Chain nào có tổng số tiền giao dịch lớn nhất thắng",
      "Miner nào bấm nút trước luôn thắng mãi mãi"
    ],
    answer: 0,
    mechanism: "Mô phỏng dùng quy tắc chuỗi hợp lệ dài hơn để dễ hiểu.",
    meaning: "Điểm cốt lõi là mạng cần một rule chung để thống nhất lịch sử."
  },
  {
    id: "immutability",
    question: "Cách hiểu đúng nhất về tính bất biến của blockchain là gì?",
    options: [
      "Sửa lịch sử không phải là không thể, nhưng sẽ bị phát hiện và rất tốn công để làm hợp lệ lại",
      "Không ai có thể chỉnh bất kỳ dữ liệu nào trên màn hình",
      "Block một khi tạo ra thì không cần kiểm tra nữa"
    ],
    answer: 0,
    mechanism: "Muốn sửa block cũ mà vẫn hợp lệ, phải re-mine block đó và các block sau.",
    meaning: "An toàn đến từ chi phí sửa lịch sử và đồng thuận của mạng, không phải từ giao diện bị khóa."
  }
];

const els = {
  mempoolRows: document.querySelector("#mempoolRows"),
  selectedCount: document.querySelector("#selectedCount"),
  minerInput: document.querySelector("#minerInput"),
  difficultyInput: document.querySelector("#difficultyInput"),
  nonceInput: document.querySelector("#nonceInput"),
  nextIndex: document.querySelector("#nextIndex"),
  previousHash: document.querySelector("#previousHash"),
  merkleRoot: document.querySelector("#merkleRoot"),
  rewardPreview: document.querySelector("#rewardPreview"),
  currentHash: document.querySelector("#currentHash"),
  miningStatus: document.querySelector("#miningStatus"),
  chainStatus: document.querySelector("#chainStatus"),
  chainList: document.querySelector("#chainList"),
  forkLab: document.querySelector("#forkLab"),
  quizList: document.querySelector("#quizList"),
  quizStatus: document.querySelector("#quizStatus"),
  quizResult: document.querySelector("#quizResult"),
  studentNameInput: document.querySelector("#studentNameInput"),
  passingScoreInput: document.querySelector("#passingScoreInput"),
  gateResult: document.querySelector("#gateResult"),
  gateMechanism: document.querySelector("#gateMechanism"),
  gateMeaning: document.querySelector("#gateMeaning"),
  gateNext: document.querySelector("#gateNext"),
  mineBtn: document.querySelector("#mineBtn"),
  stopMineBtn: document.querySelector("#stopMineBtn")
};

function shortHash(hash) {
  return hash ? `${hash.slice(0, 12)}...${hash.slice(-8)}` : "-";
}

function leadingTarget(difficulty) {
  return "0".repeat(Number(difficulty));
}

function txPayload(tx) {
  return `${tx.id}|${tx.from}|${tx.to}|${tx.amount}|${tx.fee}`;
}

async function sha256(text) {
  if (window.crypto?.subtle) {
    const bytes = new TextEncoder().encode(text);
    const digest = await window.crypto.subtle.digest("SHA-256", bytes);
    return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(64, "0");
}

async function merkleRoot(transactions) {
  if (!transactions.length) return "";
  let layer = await Promise.all(transactions.map((tx) => sha256(txPayload(tx))));
  while (layer.length > 1) {
    const next = [];
    for (let i = 0; i < layer.length; i += 2) {
      next.push(await sha256(layer[i] + (layer[i + 1] || layer[i])));
    }
    layer = next;
  }
  return layer[0];
}

function getSelectedTransactions() {
  return state.mempool.filter((tx) => state.selected.has(tx.id));
}

function previousHash() {
  return state.chain.length ? state.chain[state.chain.length - 1].hash : "0".repeat(64);
}

function totalReward(transactions) {
  const blockReward = 10;
  return transactions.reduce((sum, tx) => sum + tx.fee, blockReward);
}

async function buildCandidate(nonceOverride) {
  const transactions = getSelectedTransactions();
  const root = await merkleRoot(transactions);
  const block = {
    index: state.chain.length + 1,
    timestamp: state.pendingTimestamp,
    miner: els.minerInput.value.trim() || "Miner chưa đặt tên",
    previousHash: previousHash(),
    merkleRoot: root,
    nonce: Number(nonceOverride ?? els.nonceInput.value) || 0,
    difficulty: Number(els.difficultyInput.value),
    transactions: clone(transactions),
    reward: totalReward(transactions)
  };
  block.hash = await hashBlock(block);
  return block;
}

async function hashBlock(block) {
  const payload = [
    block.index,
    block.timestamp,
    block.miner,
    block.previousHash,
    block.merkleRoot,
    block.nonce,
    block.difficulty,
    JSON.stringify(block.transactions)
  ].join("|");
  return sha256(payload);
}

function isMined(block) {
  return block.hash.startsWith(leadingTarget(block.difficulty));
}

async function validateChain() {
  const results = [];
  for (let i = 0; i < state.chain.length; i += 1) {
    const block = state.chain[i];
    const expectedPrev = i === 0 ? "0".repeat(64) : state.chain[i - 1].hash;
    const recalculatedRoot = await merkleRoot(block.transactions);
    const recalculatedHash = await hashBlock({ ...block, merkleRoot: recalculatedRoot });
    const valid =
      block.previousHash === expectedPrev &&
      block.merkleRoot === recalculatedRoot &&
      block.hash === recalculatedHash &&
      isMined(block);
    results.push(valid);
  }
  return results;
}

function renderMempool() {
  const rows = state.mempool
    .map((tx) => {
      const disabled = !state.selected.has(tx.id) && state.selected.size >= 3;
      return `
        <tr>
          <td><input type="checkbox" data-tx="${tx.id}" ${state.selected.has(tx.id) ? "checked" : ""} ${disabled ? "disabled" : ""}></td>
          <td><strong>${tx.id}</strong></td>
          <td>${tx.from}</td>
          <td>${tx.to}</td>
          <td>${tx.amount}</td>
          <td>${tx.fee}</td>
          <td class="${tx.valid ? "status-ok" : "status-bad"}">${tx.valid ? "Hợp lệ" : tx.reason}</td>
        </tr>
      `;
    })
    .join("");
  els.mempoolRows.innerHTML = rows;
  els.selectedCount.textContent = `Đã chọn ${state.selected.size}/3`;
}

async function renderBuilder() {
  const selected = getSelectedTransactions();
  const root = await merkleRoot(selected);
  const candidate = await buildCandidate();
  els.nextIndex.textContent = String(candidate.index);
  els.previousHash.textContent = shortHash(candidate.previousHash);
  els.merkleRoot.textContent = root ? shortHash(root) : "-";
  els.rewardPreview.textContent = selected.length ? String(totalReward(selected)) : "0";
  els.currentHash.textContent = selected.length ? candidate.hash : "Chọn giao dịch để bắt đầu";
}

async function renderChain() {
  const validity = await validateChain();
  if (!state.chain.length) {
    els.chainList.innerHTML = '<div class="empty">Chưa có block. Hãy chọn giao dịch và đào block đầu tiên.</div>';
    els.chainStatus.textContent = "Chưa có block";
    els.chainStatus.className = "pill neutral";
    return;
  }

  const allValid = validity.every(Boolean);
  els.chainStatus.textContent = allValid ? "Chuỗi hợp lệ" : "Chuỗi không hợp lệ";
  els.chainStatus.className = `pill ${allValid ? "good" : "bad"}`;
  els.chainList.innerHTML = state.chain
    .map((block, index) => `
      <article class="block-card ${validity[index] ? "" : "invalid"}">
        <header>
          <h3>Block #${block.index}</h3>
          <span class="pill ${validity[index] ? "good" : "bad"}">${validity[index] ? "Hợp lệ" : "Không hợp lệ"}</span>
        </header>
        <div class="block-grid">
          <div><span>Miner</span>${block.miner}</div>
          <div><span>Nonce</span>${block.nonce}</div>
          <div><span>Độ khó</span>${leadingTarget(block.difficulty)}...</div>
          <div><span>Phần thưởng</span>${block.reward}</div>
          <div><span>Hash block trước</span><code>${shortHash(block.previousHash)}</code></div>
          <div><span>Hash</span><code>${shortHash(block.hash)}</code></div>
          <div><span>Merkle Root</span><code>${shortHash(block.merkleRoot)}</code></div>
          <div><span>Giao dịch</span>${block.transactions.length}</div>
        </div>
        <ol class="tx-list">
          ${block.transactions.map((tx) => `<li>${tx.id}: ${tx.from} -> ${tx.to}, số tiền ${tx.amount}, fee ${tx.fee}</li>`).join("")}
        </ol>
      </article>
    `)
    .join("");
}

function renderFork() {
  if (!state.fork) {
    els.forkLab.className = "fork-lab empty";
    els.forkLab.textContent = "Hãy đào ít nhất một block, sau đó tạo fork demo.";
    return;
  }

  els.forkLab.className = "fork-lab";
  els.forkLab.innerHTML = `
    <div class="fork-grid">
      ${state.fork.branches
        .map((branch) => `
          <div class="fork-card">
            <h3>${branch.name}</h3>
            <p><strong>Miner:</strong> ${branch.block.miner}</p>
            <p><strong>Nonce:</strong> ${branch.block.nonce}</p>
            <p><strong>Hash:</strong> <code>${shortHash(branch.block.hash)}</code></p>
            <p><strong>Trạng thái:</strong> block hợp lệ đang cạnh tranh ở height ${branch.block.index}</p>
            <button data-adopt="${branch.name}">Chọn ${branch.name}</button>
          </div>
        `)
        .join("")}
    </div>
  `;
}

function renderQuiz() {
  els.quizList.innerHTML = quizQuestions
    .map((item, index) => `
      <article class="quiz-item" data-question="${item.id}">
        <p class="quiz-question">${index + 1}. ${item.question}</p>
        <div class="quiz-options">
          ${item.options
            .map((option, optionIndex) => `
              <label>
                <input type="radio" name="${item.id}" value="${optionIndex}">
                <span>${option}</span>
              </label>
            `)
            .join("")}
        </div>
        <p class="quiz-feedback"></p>
      </article>
    `)
    .join("");
}

async function renderAll() {
  renderMempool();
  await renderBuilder();
  await renderChain();
  renderFork();
}

async function commitBlock(block) {
  state.chain.push(block);
  block.transactions.forEach((tx) => state.selected.delete(tx.id));
  state.mempool = state.mempool.filter((tx) => !block.transactions.some((picked) => picked.id === tx.id));
  els.nonceInput.value = "0";
  state.pendingTimestamp = new Date().toISOString();
  setGate({
    result: "Được chấp nhận cục bộ",
    kind: "good",
    mechanism: "Block được thêm vào chain và các giao dịch của nó rời khỏi mempool.",
    meaning: "Trong mạng blockchain thật, việc chấp nhận xảy ra sau khi các node kiểm tra block được đề xuất.",
    next: "Hãy kiểm tra chuỗi hoặc đào thêm một block để thấy previous hash nối lịch sử như thế nào."
  });
  await renderAll();
}

async function checkNonce() {
  const block = await buildCandidate();
  if (!block.transactions.length) {
    setStatus("Hãy chọn ít nhất một giao dịch.", "bad");
    setGate({
      result: "Bị chặn",
      kind: "bad",
      mechanism: "Chưa có giao dịch nào được chọn.",
      meaning: "Trong hoạt động giản lược này, block cần cam kết với ít nhất một giao dịch.",
      next: "Hãy chọn một hoặc nhiều giao dịch, rồi kiểm tra nonce lại."
    });
    return;
  }
  const invalid = selectedInvalidTransactions();
  if (invalid.length) {
    setStatus("Kiểm tra giao dịch không đạt.", "bad");
    setGate({
      result: "Bị từ chối trước mining",
      kind: "bad",
      mechanism: `${invalid.map((tx) => tx.id).join(", ")} không vượt qua bước kiểm tra giao dịch.`,
      meaning: "Giao dịch không hợp lệ không nên đi vào block ứng viên, vì các node sẽ từ chối block đó về sau.",
      next: "Hãy bỏ giao dịch không hợp lệ hoặc giải thích rule nào bị vi phạm trước khi đào."
    });
    return;
  }
  if (isMined(block)) {
    setStatus(`Đào thành công với nonce ${block.nonce}. Block đã được commit.`, "good");
    setGate({
      result: "Đi qua",
      kind: "good",
      mechanism: "Nonce này tạo ra block hash đạt target của độ khó.",
      meaning: "Proof-of-Work làm cho việc đề xuất block tốn công, nhưng việc kiểm tra lại tương đối dễ.",
      next: "Hãy xem chain, sau đó thử sửa block để quan sát điều gì bị hỏng."
    });
    await commitBlock(block);
  } else {
    setStatus("Nonce chưa hợp lệ.", "bad");
    els.currentHash.textContent = block.hash;
    setGate({
      result: "Bị chặn",
      kind: "bad",
      mechanism: "Block hash chưa đạt target của độ khó.",
      meaning: "Dữ liệu block có thể đúng, nhưng nếu chưa có đủ Proof-of-Work thì block chưa được chấp nhận.",
      next: "Hãy đổi nonce thủ công hoặc dùng Tự động đào để tìm nonce hợp lệ."
    });
  }
}

function setStatus(text, kind = "neutral") {
  els.miningStatus.textContent = text;
  els.miningStatus.className = `pill ${kind}`;
}

function setGate({ result, kind = "neutral", mechanism, meaning, next }) {
  els.gateResult.textContent = result;
  els.gateResult.className = `pill ${kind}`;
  els.gateMechanism.textContent = mechanism;
  els.gateMeaning.textContent = meaning;
  els.gateNext.textContent = next;
}

function selectedInvalidTransactions() {
  return getSelectedTransactions().filter((tx) => !tx.valid);
}

async function autoMine() {
  if (state.mining) return;
  if (!getSelectedTransactions().length) {
    setStatus("Hãy chọn ít nhất một giao dịch.", "bad");
    setGate({
      result: "Bị chặn",
      kind: "bad",
      mechanism: "Chưa có giao dịch nào được chọn.",
      meaning: "Đào block diễn ra trên một block ứng viên, và block ứng viên cần dữ liệu giao dịch.",
      next: "Hãy chọn ít nhất một giao dịch ở cổng transaction."
    });
    return;
  }
  const invalid = selectedInvalidTransactions();
  if (invalid.length) {
    setStatus("Kiểm tra giao dịch không đạt.", "bad");
    setGate({
      result: "Bị từ chối trước mining",
      kind: "bad",
      mechanism: `${invalid.map((tx) => tx.id).join(", ")} không vượt qua bước kiểm tra giao dịch.`,
      meaning: "Miner có thể thử đưa dữ liệu xấu vào, nhưng các node trung thực sẽ từ chối giao dịch và block không hợp lệ.",
      next: "Hãy bỏ giao dịch không hợp lệ, rồi đào một block ứng viên sạch."
    });
    return;
  }

  state.mining = true;
  els.mineBtn.disabled = true;
  els.stopMineBtn.disabled = false;
  setStatus("Đang đào...", "neutral");

  let nonce = Number(els.nonceInput.value) || 0;
  while (state.mining) {
    for (let i = 0; i < 80; i += 1) {
      const block = await buildCandidate(nonce);
      if (isMined(block)) {
        state.mining = false;
        els.nonceInput.value = String(nonce);
        els.currentHash.textContent = block.hash;
        setStatus(`Đào thành công với nonce ${nonce}. Block đã được commit.`, "good");
        await commitBlock(block);
        break;
      }
      nonce += 1;
    }
    els.nonceInput.value = String(nonce);
    await renderBuilder();
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  els.mineBtn.disabled = false;
  els.stopMineBtn.disabled = true;
}

async function tamperLastBlock() {
  if (!state.chain.length) {
    setStatus("Hãy đào một block trước khi sửa dữ liệu.", "bad");
    return;
  }

  const last = state.chain[state.chain.length - 1];
  if (!last.transactions.length) return;
  last.transactions[0].amount = Number(last.transactions[0].amount) + 1;
  setStatus("Block cuối đã bị sửa. Hãy kiểm tra chuỗi.", "bad");
  setGate({
    result: "Đã bị sửa",
    kind: "bad",
    mechanism: "Một giao dịch bên trong block đã đào bị thay đổi.",
    meaning: "Hash được lưu không còn đại diện cho dữ liệu đã bị sửa, nên verification sẽ fail.",
    next: "Bấm Kiểm tra chuỗi và quan sát block nào trở nên không hợp lệ."
  });
  await renderAll();
}

async function mineForkBlock(baseHash, index, miner, startNonce) {
  const tx = state.mempool.find((item) => item.valid) || initialTransactions.find((item) => item.valid);
  const transactions = tx ? [clone(tx)] : [];
  const root = await merkleRoot(transactions);
  let nonce = startNonce;
  while (nonce < startNonce + 200000) {
    const block = {
      index,
      timestamp: new Date().toISOString(),
      miner,
      previousHash: baseHash,
      merkleRoot: root,
      nonce,
      difficulty: 1,
      transactions,
      reward: totalReward(transactions)
    };
    block.hash = await hashBlock(block);
    if (isMined(block)) return block;
    nonce += 1;
  }
  return null;
}

async function createForkDemo() {
  if (!state.chain.length) {
    setStatus("Hãy đào một block trước khi tạo fork.", "bad");
    return;
  }

  const baseHash = previousHash();
  const index = state.chain.length + 1;
  const [a, b] = await Promise.all([
    mineForkBlock(baseHash, index, "Đội Xanh", 0),
    mineForkBlock(baseHash, index, "Đội Lục", 200)
  ]);
  state.fork = {
    branches: [
      { name: "Nhánh A", block: a },
      { name: "Nhánh B", block: b }
    ].filter((branch) => branch.block)
  };
  setStatus("Đã tạo fork demo. Hãy chọn một nhánh để tiếp tục.", "neutral");
  setGate({
    result: "Hai tip cạnh tranh",
    kind: "neutral",
    mechanism: "Hai block ứng viên hợp lệ cùng trỏ về một previous hash.",
    meaning: "Phân nhánh có thể xảy ra tự nhiên trong mạng phân tán. Quy tắc đồng thuận quyết định nhánh nào tiếp tục.",
    next: "Chọn một nhánh, rồi thảo luận vì sao nhánh còn lại trở thành orphan."
  });
  renderFork();
}

async function adoptFork(name) {
  const branch = state.fork?.branches.find((item) => item.name === name);
  if (!branch) return;
  await commitBlock(branch.block);
  state.fork = null;
  setStatus(`${name} đã được chọn. Nhánh còn lại trở thành orphan.`, "good");
  setGate({
    result: "Đã chọn nhánh",
    kind: "good",
    mechanism: `${name} trở thành tip tiếp tục của chain.`,
    meaning: "Quy tắc đồng thuận giản lược chọn một lịch sử hợp lệ để tiếp tục và để nhánh còn lại thành orphan.",
    next: "Hãy đào thêm một block để thấy vì sao nhánh tiếp tục sẽ ngày càng khó bị thay thế."
  });
  await renderAll();
}

async function validateChainWithGate() {
  const results = await validateChain();
  await renderChain();
  if (!state.chain.length) {
    setGate({
      result: "Chưa có chain",
      kind: "neutral",
      mechanism: "Chưa có block nào được chấp nhận để kiểm tra.",
      meaning: "Verification cần một block được đề xuất hoặc đã được chấp nhận làm đầu vào.",
      next: "Hãy đào một block trước, rồi kiểm tra chuỗi."
    });
    return;
  }
  const invalidIndex = results.findIndex((valid) => !valid);
  if (invalidIndex === -1) {
    setGate({
      result: "Chain hợp lệ",
      kind: "good",
      mechanism: "Mọi kiểm tra về block hash, previous hash, Merkle root và difficulty đều đạt.",
      meaning: "Các node có thể tự kiểm tra chain mà không cần tin vào lời khai của miner.",
      next: "Hãy dùng Sửa block cuối để tạo mismatch, rồi kiểm tra lại."
    });
  } else {
    setGate({
      result: "Chain không hợp lệ",
      kind: "bad",
      mechanism: `Block #${state.chain[invalidIndex].index} không vượt qua verification.`,
      meaning: "Một chain có thể vẫn hiện trên màn hình nhưng bị từ chối nếu liên kết hash hoặc proof không khớp.",
      next: "Hãy thảo luận cần làm gì để sửa chain mà không xóa dữ liệu đã bị tamper."
    });
  }
}

function submitQuiz() {
  let score = 0;
  const unanswered = [];
  quizQuestions.forEach((item) => {
    const card = document.querySelector(`[data-question="${item.id}"]`);
    const selected = document.querySelector(`input[name="${item.id}"]:checked`);
    card.classList.remove("correct", "incorrect");
    const feedback = card.querySelector(".quiz-feedback");
    if (!selected) {
      unanswered.push(item.id);
      feedback.textContent = "Chưa trả lời câu này.";
      card.classList.add("incorrect");
      return;
    }

    const isCorrect = Number(selected.value) === item.answer;
    if (isCorrect) score += 1;
    card.classList.add(isCorrect ? "correct" : "incorrect");
    feedback.textContent = `${isCorrect ? "Đúng." : "Chưa đúng."} Cơ chế: ${item.mechanism} Ý nghĩa: ${item.meaning}`;
  });

  const percent = Math.round((score / quizQuestions.length) * 100);
  const passing = Number(els.passingScoreInput.value);
  const passed = percent >= passing && unanswered.length === 0;
  const name = els.studentNameInput.value.trim() || "Nhóm chưa đặt tên";
  state.quizSubmitted = true;
  els.quizStatus.textContent = passed ? "Đã hoàn thành" : "Chưa hoàn thành";
  els.quizStatus.className = `pill ${passed ? "good" : "bad"}`;
  els.quizResult.className = `quiz-result ${passed ? "pass" : "empty"}`;
  els.quizResult.innerHTML = `
    <strong>${name}</strong>: đúng ${score}/${quizQuestions.length} câu (${percent}%).
    Điểm đạt: ${passing}%.
    ${passed ? "Assignment đã hoàn thành." : "Hãy xem feedback và thử lại."}
  `;
}

function resetQuiz() {
  state.quizSubmitted = false;
  quizQuestions.forEach((item) => {
    document.querySelectorAll(`input[name="${item.id}"]`).forEach((input) => {
      input.checked = false;
    });
    const card = document.querySelector(`[data-question="${item.id}"]`);
    if (!card) return;
    card.classList.remove("correct", "incorrect");
    card.querySelector(".quiz-feedback").textContent = "";
  });
  els.quizStatus.textContent = "Chưa nộp";
  els.quizStatus.className = "pill neutral";
  els.quizResult.className = "quiz-result empty";
  els.quizResult.textContent = "Hoàn thành mô phỏng, sau đó trả lời quiz để kết thúc assignment.";
}

document.querySelector("#mempoolRows").addEventListener("change", async (event) => {
  const txId = event.target.dataset.tx;
  if (!txId) return;
  if (event.target.checked) {
    state.selected.add(txId);
  } else {
    state.selected.delete(txId);
  }
  const tx = state.mempool.find((item) => item.id === txId);
  if (tx?.valid) {
    setGate({
      result: event.target.checked ? "Đã chọn" : "Đã bỏ chọn",
      kind: "neutral",
      mechanism: `${tx.id} vượt qua rule kiểm tra giao dịch.`,
      meaning: "Giao dịch hợp lệ có thể chờ trong mempool và được cân nhắc đưa vào block ứng viên.",
      next: "Hãy chọn tối đa 3 giao dịch, rồi quan sát Merkle root và phần thưởng dự kiến."
    });
  } else if (tx) {
    setGate({
      result: "Đã chọn dữ liệu rủi ro",
      kind: "bad",
      mechanism: `${tx.id} vi phạm rule giao dịch: ${tx.reason}.`,
      meaning: "Đây là loại dữ liệu nên bị chặn trước khi block được đào.",
      next: "Hãy thử đào khi vẫn chọn nó để xem hệ thống từ chối block ứng viên ở đâu."
    });
  }
  state.pendingTimestamp = new Date().toISOString();
  await renderAll();
});

document.querySelector("#checkNonceBtn").addEventListener("click", checkNonce);
document.querySelector("#mineBtn").addEventListener("click", autoMine);
document.querySelector("#stopMineBtn").addEventListener("click", () => {
  state.mining = false;
  setStatus("Đã dừng", "neutral");
});
document.querySelector("#validateBtn").addEventListener("click", validateChainWithGate);
document.querySelector("#tamperBtn").addEventListener("click", tamperLastBlock);
document.querySelector("#forkBtn").addEventListener("click", createForkDemo);
document.querySelector("#submitQuizBtn").addEventListener("click", submitQuiz);
document.querySelector("#resetQuizBtn").addEventListener("click", resetQuiz);
document.querySelector("#resetBtn").addEventListener("click", async () => {
  state.mempool = clone(initialTransactions);
  state.selected = new Set();
  state.chain = [];
  state.fork = null;
  state.mining = false;
  state.pendingTimestamp = new Date().toISOString();
  els.nonceInput.value = "0";
  setStatus("Sẵn sàng", "neutral");
  setGate({
    result: "Đang chờ thao tác",
    kind: "neutral",
    mechanism: "Bắt đầu bằng cách chọn giao dịch.",
    meaning: "Quy trình blockchain là một chuỗi cổng kiểm tra. Mỗi cổng hoặc cho dữ liệu đi tiếp, hoặc từ chối vì một lý do cụ thể.",
    next: "Hãy thử chọn cả giao dịch hợp lệ và không hợp lệ, rồi quan sát hệ thống cho phép điều gì."
  });
  await renderAll();
  resetQuiz();
});
document.querySelector("#forkLab").addEventListener("click", async (event) => {
  const name = event.target.dataset.adopt;
  if (name) await adoptFork(name);
});
["input", "change"].forEach((eventName) => {
  els.minerInput.addEventListener(eventName, renderBuilder);
  els.difficultyInput.addEventListener(eventName, renderBuilder);
  els.nonceInput.addEventListener(eventName, renderBuilder);
});

renderQuiz();
renderAll();
