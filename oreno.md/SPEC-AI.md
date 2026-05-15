# SPEC — AI / CLOUDFLARE WORKER

## Current setup

The site has a Cloudflare Worker (`worker.js`) deployed as a Claude API
proxy. It keeps the Anthropic API key off the frontend.

**Model used:** `claude-opus-4-5` (as of v8.4)
**Max tokens:** 1024

---

## Worker architecture

```
Browser → fetch POST → Cloudflare Worker URL
            ↓
Worker → fetch POST → api.anthropic.com/v1/messages
            ↓
Worker → return response → Browser
```

CORS headers set to `*` for open access from the domain.

**Worker env var required:**
- `ANTHROPIC_API_KEY` — set as a secret in Cloudflare dashboard

**Worker URL placeholder in script.js:**
```js
const WORKER_URL = "YOUR_WORKER_URL";  // replace with actual workers.dev URL
```

---

## System prompt (full, in worker.js)

The worker uses a hardcoded system prompt defining the studio assistant:

**Personality:** Direct, confident, quiet authority. No filler affirmations.
No bullet lists in responses unless laying out services.

**About the studio:** Brand architecture studio. Not decoration — structure.
Works with founders, operators, growing companies.

**Services (with pricing):**

| Service | Timeline | Starting price |
|---------|----------|----------------|
| Brand Architecture | 4–8 weeks | $3,500 |
| Motion & Content Systems | 2–4 weeks/system | $1,800 |
| Web Design & Development | 3–6 weeks | $2,500 |
| Creative Direction | Scoped per project | — |
| Full Brand Launch | 8–14 weeks | $7,500 |

**Process:** Inquiry → Discovery call → Proposal → Contract + deposit →
Strategy → Design/build → Refinement (2 rounds) → Delivery + handoff

**Does NOT do:**
- One-off social posts
- Logo-only projects
- Rush work without planning
- Projects without a defined goal/decision-maker

**Contact in system prompt:**
- Email: `contact@oreno.lk`
- WhatsApp: `+94729537427` / `wa.me/94729537427`
- Website: `oreno.lk`

---

## Chat widget (PLANNED — not yet built)

The worker exists but as of v8.4 there is **no UI chat widget** on the
site. The next phase includes building this.

### Planned spec:

**Trigger:** Floating "Ask us" button (bottom-left or bottom-right, not
conflicting with WhatsApp btn).

**UI:**
- Slide-up panel, fixed position
- Matches site aesthetic: `--c-bg` background, Montserrat, minimal borders
- Message thread + input + send button
- "ØRENO" label at top, not "AI" or "Chatbot"

**JS pattern:**
```js
const WORKER_URL = "https://xxx.workers.dev";
let messages = [];   // maintain conversation history

async function sendMessage(userText) {
  messages.push({ role: "user", content: userText });
  
  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    });
    const data = await res.json();
    const reply = data.content[0].text;
    messages.push({ role: "assistant", content: reply });
    renderMessage("assistant", reply);
  } catch (err) {
    renderMessage("error", "Connection failed. Try WhatsApp instead.");
  }
}
```

**Design notes:**
- No chat bubble icon — use text "Ask →" or "Talk to us"
- Panel width ~360px desktop, full-width mobile
- Send on Enter (+ Shift+Enter for newline)
- Loading state: animated dots `···`

---

## Deploying the worker

1. cloudflare.com → sign up (free)
2. Workers & Pages → Create Worker → paste `worker.js`
3. Settings → Variables & Secrets → add `ANTHROPIC_API_KEY`
4. Deploy → copy the `xxx.workers.dev` URL
5. In `script.js`: replace `YOUR_WORKER_URL` with that URL

---

## Update system prompt

Edit the `SYSTEM_PROMPT` const at the top of `worker.js` and redeploy.
No need to change the frontend for prompt updates.
