
const QUIZ = [
  {
    q: "Why did the study include an audio-diary control group?",
    options: [
      "To make sure every participant received advice from an AI",
      "To separate the effect of responsive chatbot interaction from simply doing a daily speaking activity or taking part in the study",
      "To prevent participants from having social interactions during the study",
      "To test whether audio diaries were more entertaining than chatbots"
    ],
    answer: 1,
    why: "The audio diary provided an active comparison: participants still spoke regularly, but they did not receive a response. This helped distinguish chatbot-specific effects from the effects of completing a daily activity, reflecting on one's day, or receiving study attention."
  },
  {
    q: "What is the most accurate summary of the current evidence about AI chatbots and older adults?",
    options: [
      "AI chatbots have already been proven to improve loneliness and well-being for nearly all older adults",
      "AI chatbots have been proven to be harmful for older adults",
      "The evidence is still mixed or inconclusive for many outcomes, so larger and longer studies are needed",
      "Research is no longer necessary because AI is already widely available"
    ],
    answer: 2,
    why: "The webinar emphasizes that evidence for many social, psychological, and cognitive outcomes is still limited, mixed, or inconclusive. Stronger studies with larger and more diverse samples and longer follow-up are still needed."
  },
  {
    q: "What was the most notable descriptive pattern in this study's results?",
    options: [
      "Loneliness clearly decreased in the chatbot group",
      "Well-being increased dramatically only in the chatbot group",
      "Meaningful social interactions appeared to increase in the chatbot group while decreasing in the control group",
      "All cognitive scores declined in the chatbot group"
    ],
    answer: 2,
    why: "The most interesting descriptive pattern was an apparent increase in meaningful social interactions in the chatbot condition alongside a downward trend in the control condition. Because the chatbot group was very small, this should be treated as a preliminary pattern rather than firm evidence of an effect."
  },
  {
    q: "What does the webinar recommend in light of research on AI and cognitive offloading?",
    options: [
      "Avoid all AI use because it has been proven to cause cognitive decline",
      "Let AI do as much thinking as possible so mental effort can be eliminated",
      "Use AI to support your thinking while continuing to reason, question, and form your own judgments",
      "Only use AI for entertainment and never for learning"
    ],
    answer: 2,
    why: "Research discussed in the webinar links greater AI reliance with more cognitive offloading and lower critical-thinking performance, but it does not prove that AI automatically causes cognitive decline. The recommended approach is to use AI as a support for thinking rather than a replacement for it."
  },
  {
    q: "If an AI chatbot gives you an important factual claim, what is the best approach?",
    options: [
      "Assume it is correct if the chatbot sounds confident",
      "Verify the claim by checking the cited source and, when needed, reliable primary, official, or academic sources",
      "Trust the answer as long as it is repeated several times",
      "Avoid checking outside sources because AI systems already filter out incorrect information"
    ],
    answer: 1,
    why: "AI chatbots can hallucinate and present incorrect information confidently. For important claims—especially in areas such as health, politics, finances, or law—the webinar recommends checking the source provided and verifying independently with reliable sources when necessary."
  }
];

const dialog = document.querySelector("#quizDialog");
const launchers = document.querySelectorAll("[data-open-quiz]");
let index = 0;
let score = 0;
let streak = 0;
let selected = null;
let answered = false;

function openQuiz(){
  renderQuestion();
  if (dialog.showModal) dialog.showModal();
  else dialog.setAttribute("open","");
}
launchers.forEach(btn => btn.addEventListener("click", openQuiz));
document.querySelector("[data-close-quiz]")?.addEventListener("click", () => dialog.close());
dialog?.addEventListener("click", e => {
  const r = dialog.getBoundingClientRect();
  const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
  if (!inside) dialog.close();
});

function renderQuestion(){
  const q = QUIZ[index];
  const content = document.querySelector("#quizContent");
  content.innerHTML = `
    <div class="quiz-meta">
      <span class="pill">Question ${index + 1} / ${QUIZ.length}</span>
      <span class="pill">Score: ${score}</span>
      <span class="pill">Streak: ${streak}</span>
    </div>
    <div class="quiz-progress" aria-label="Quiz progress"><span style="width:${(index/QUIZ.length)*100}%"></span></div>
    <div class="question">${q.q}</div>
    <div class="answer-list" role="radiogroup" aria-label="Answer choices">
      ${q.options.map((opt,i)=>`
        <button class="answer" data-answer="${i}" role="radio" aria-checked="false">
          <span class="answer-key">${String.fromCharCode(65+i)}</span><span>${opt}</span>
        </button>`).join("")}
    </div>
    <div class="feedback" id="feedback" aria-live="polite"></div>
    <div class="quiz-actions">
      <button class="primary" id="checkAnswer" disabled>Check answer</button>
    </div>`;
  selected = null;
  answered = false;
  content.querySelectorAll("[data-answer]").forEach(btn => btn.addEventListener("click", () => {
    if(answered) return;
    selected = Number(btn.dataset.answer);
    content.querySelectorAll("[data-answer]").forEach(b => {
      b.classList.toggle("selected", b === btn);
      b.setAttribute("aria-checked", b === btn ? "true" : "false");
    });
    content.querySelector("#checkAnswer").disabled = false;
  }));
  content.querySelector("#checkAnswer").addEventListener("click", checkAnswer);
}

function checkAnswer(){
  if(selected === null || answered) return;
  answered = true;
  const q = QUIZ[index];
  const answers = document.querySelectorAll("[data-answer]");
  answers.forEach((btn,i) => {
    btn.disabled = true;
    if(i === q.answer) btn.classList.add("correct");
    if(i === selected && i !== q.answer) btn.classList.add("incorrect");
  });
  const correct = selected === q.answer;
  if(correct){ score += 100 + streak * 20; streak += 1; }
  else { streak = 0; }
  const feedback = document.querySelector("#feedback");
  feedback.className = "feedback show";
  feedback.innerHTML = `<strong>${correct ? "Correct! +" + (100 + (streak-1)*20) + " points" : "Not quite."}</strong><br>${q.why}`;
  document.querySelector("#checkAnswer").outerHTML =
    `<button class="primary" id="nextQuestion">${index === QUIZ.length - 1 ? "See my score" : "Next question"}</button>`;
  document.querySelector("#nextQuestion").addEventListener("click", nextQuestion);
}

function nextQuestion(){
  if(index < QUIZ.length - 1){
    index += 1;
    renderQuestion();
  } else {
    finishQuiz();
  }
}

function finishQuiz(){
  // Some browsers/privacy settings block localStorage, especially when the
  // webinar is opened directly from local files. The score screen should
  // still work even if saving a best score is unavailable.
  let best = score;
  let bestSaved = false;

  try {
    const previousBest = Number(localStorage.getItem("webinarQuizBest") || 0);
    best = Math.max(score, previousBest);
    localStorage.setItem("webinarQuizBest", String(best));
    bestSaved = true;
  } catch (err) {
    console.warn("Could not save quiz best score:", err);
  }

  const content = document.querySelector("#quizContent");
  if (!content) return;

  content.innerHTML = `
    <div class="quiz-finish">
      <div class="eyebrow">Knowledge Quest complete</div>
      <h2>${score >= 500 ? "Excellent understanding!" : score >= 300 ? "Strong work!" : "Good start—review and retry."}</h2>
      <div class="score-ring">${score}</div>
      <p>Your score includes streak bonuses.${bestSaved ? ` Best score on this device: <strong>${best}</strong>.` : ""}</p>
      <div class="quiz-actions" style="justify-content:center">
        <button class="secondary" id="reviewWebinar">Close and review</button>
        <button class="primary" id="restartQuiz">Play again</button>
      </div>
    </div>`;
  celebrate();
  document.querySelector("#reviewWebinar").addEventListener("click", () => dialog.close());
  document.querySelector("#restartQuiz").addEventListener("click", () => {
    index = 0; score = 0; streak = 0; renderQuestion();
  });
}

function celebrate(){
  const layer = document.createElement("div");
  layer.className = "confetti";
  for(let i=0;i<55;i++){
    const piece = document.createElement("i");
    piece.style.left = Math.random()*100 + "vw";
    piece.style.animationDelay = Math.random()*.7 + "s";
    piece.style.transform = `rotate(${Math.random()*360}deg)`;
    piece.style.opacity = .6 + Math.random()*.4;
    if(i%3===1) piece.style.background = "#a8c7fa";
    if(i%3===2) piece.style.background = "#f4c36a";
    layer.appendChild(piece);
  }
  document.body.appendChild(layer);
  setTimeout(()=>layer.remove(),2600);
}

// Mark external links and protect new tabs.
document.querySelectorAll('a[target="_blank"]').forEach(a => {
  a.rel = "noopener noreferrer";
});
