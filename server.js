const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ─────────────────────────────────────────
// SKILL CHIPS
// ─────────────────────────────────────────
let skillChips = [
  {
    id: 'human_centered_design',
    name: 'Human-Centered Design',
    enabled: false,
    content: `HUMAN-CENTERED DESIGN (HCD) FRAMEWORK:

Core principle: Innovation is rooted in understanding people, not just technology or ideas.

The HCD Process (7 stages):
1. FRAME — Clarify the problem, constraints, stakeholders. Key questions: What problem are we solving? For whom? Why does it matter?
2. EMPATHIZE — Understand users deeply through interviews, observation, journey mapping. Focus on what users feel, think, and do — not what they say they want.
3. DEFINE — Synthesize insights into a user-centered problem statement. Format: "[User] needs a way to [need] because [insight]." Do NOT jump to solutions here.
4. IDEATE — Generate many diverse solutions before converging. Quantity before quality. Ask: "What are 10 radically different ways to solve this?"
5. PROTOTYPE — Build the cheapest, fastest representation of the idea. Test assumptions, not aesthetics.
6. TEST — Observe behavior, don't just ask opinions. Ask: What worked? What failed? What surprised us?
7. ITERATE — Refine based on learning. Returning to earlier stages is expected, not failure.

Key distinctions the coach should probe:
- Problem space vs. solution space (students often jump to solutions too fast)
- Insights vs. observations (insights explain WHY, observations just describe WHAT)
- User needs vs. user wants vs. user assumptions

Common mistakes to listen for:
- Jumping to solutions before understanding the problem
- Vague or generic problem statements
- Designing for themselves instead of the user
- Treating prototypes as finished products
- Confirmation bias

Assessment checklist:
Is the user clearly identified and specific?
Is the problem statement insight-driven, not solution-biased?
Is there real evidence from real users (not assumptions)?
Are ideas diverse and tied to user needs?
Is there a plan to test with real users?
Does the thinking show iteration, not just a linear plan?`
  },
  {
    id: 'innovators_dna',
    name: "Innovator's DNA",
    enabled: false,
    content: `INNOVATOR'S DNA FRAMEWORK (Dyer, Gregersen, Christensen):

Core insight: Innovation is a SKILL, not a talent. It can be deliberately practiced.

The Five Discovery Skills:
1. ASSOCIATING — Connecting seemingly unrelated ideas across domains
2. QUESTIONING — Challenging assumptions by asking why, why not, and what if
3. OBSERVING — Watching customers and industries to uncover unmet needs
4. NETWORKING — Engaging diverse people for new perspectives and ideas
5. EXPERIMENTING — Testing ideas through prototypes, pilots, and iteration

Key principle: Most innovative ideas come from ASSOCIATING — connecting inputs from the other four skills in unexpected ways.

Common gaps to listen for:
- Students who only execute but never question or experiment
- Confusing networking for career vs. networking for insight
- Treating experimentation as planning rather than actual testing
- Observing what people SAY vs. what people DO

Assessment checklist:
Can the student name which discovery skill they are using or missing?
Is their questioning challenging real assumptions?
Is their observing based on direct contact with users?
Are their experiments actual tests, or just detailed plans?
Are they connecting ideas across domains (associating)?`
  },
  {
    id: 'jtbd',
    name: 'Jobs-to-Be-Done',
    enabled: false,
    content: `JOBS-TO-BE-DONE (JTBD) FRAMEWORK:

Core principle: People do not buy products — they hire them to make progress in their lives.

Job Statement format:
"When [situation], I want to [motivation], so I can [desired outcome]."

Three dimensions of every job:
1. FUNCTIONAL JOB — The practical task the customer is trying to accomplish
2. EMOTIONAL JOB — How the customer wants to feel while doing it
3. SOCIAL JOB — How the customer wants to be perceived by others

The Four Forces of Progress:
- PUSH of the current situation (pain, frustration)
- PULL of the new solution (attraction, promise)
- ANXIETY of change (fear of switching)
- HABIT of the present (comfort with existing behavior)

Common mistakes to listen for:
- Defining the job in terms of the product
- Segmenting by demographics instead of situation
- Confusing solutions with jobs
- Ignoring emotional or social dimensions

Assessment checklist:
Is the job statement situation-based and outcome-focused?
Are all three job dimensions considered?
Are the four forces of progress identified?
Is the real competition correctly identified?
Is the student avoiding feature-based thinking?`
  },
  {
    id: 'tuna',
    name: 'TUNA Framework',
    enabled: false,
    content: `TUNA FRAMEWORK (Turbulence, Uncertainty, Novelty, Ambiguity):

Core principle: Different types of complexity require different responses.

The Four TUNA Dimensions:
- TURBULENCE — Rapid unpredictable change. Response: shorten cycles, adapt in real time.
- UNCERTAINTY — Unknown outcomes. Response: test assumptions, run experiments.
- NOVELTY — No precedent exists. Response: learn before scaling, use analogies.
- AMBIGUITY — Multiple valid interpretations. Response: reframe, explore interpretations.

DVF Risk Lens:
- DESIRABILITY — Do customers actually want this?
- FEASIBILITY — Can we actually build or deliver it?
- VIABILITY — Can it sustain itself economically?

Common mistakes to listen for:
- Treating all uncertainty the same way
- Making strategic decisions as if the environment is stable
- Confusing ambiguity (interpretation problem) with uncertainty (information problem)

Assessment checklist:
Can the student identify which TUNA dimensions are present?
Is their response matched to the correct TUNA dimension?
Are DVF risks identified and mapped to TUNA conditions?
Is experimentation built into their approach?`
  },
  {
    id: 'critical_assumptions',
    name: 'Critical Assumptions (DFV x BMC)',
    enabled: false,
    content: `CRITICAL ASSUMPTIONS FRAMEWORK (DFV x Business Model Canvas):

Core principle: Every business idea is a bundle of assumptions. Identify which are riskiest and test them before over-investing.

A Critical Assumption is HIGH UNCERTAINTY and HIGH IMPACT — if wrong, the whole model fails.

DFV Categories:
- DESIRABILITY (D) — Does this person have the problem? Do they care enough to act or pay?
- FEASIBILITY (F) — Can we actually build this? Does the technology work?
- VIABILITY (V) — Does the revenue model work? Are costs sustainable?

The Testing Sequence:
1. Extract assumptions (what must be true for this to work?)
2. Classify each as D, F, or V
3. Prioritize by uncertainty x impact
4. Convert to testable hypotheses: "We believe [customer] will [behavior] because [reason]"
5. Design the cheapest experiment that could prove it wrong

Common mistakes to listen for:
- Treating assumptions as facts because they feel true
- Testing easy assumptions instead of riskiest ones
- Vague assumptions that cannot be tested
- Skipping desirability to focus only on feasibility

Assessment checklist:
Are assumptions separated from solutions?
Are the top 3-5 riskiest assumptions identified?
Is each assumption classified as D, F, or V?
Are assumptions written as testable, falsifiable statements?
Is there a clear experiment for the riskiest assumption?`
  },
  {
    id: 'innovation_strategy',
    name: 'Innovation Strategy',
    enabled: false,
    content: `INNOVATION STRATEGY FRAMEWORK:

Core principle: Innovation without strategic alignment is just activity.

Portfolio Thinking (Horizon Model):
- H1 (Core/Incremental): Defending existing business. Typically 60-70% of resources.
- H2 (Adjacent/Expansion): Extending into nearby markets. Typically 20-30%.
- H3 (Transformational): Exploring new business models. Typically 10-15%.
- Most organizations over-invest in H1 and under-invest in H3.

Dynamic Capabilities:
- SENSING — Identifying emerging opportunities early
- SEIZING — Allocating resources quickly to capture them
- RECONFIGURING — Reorganizing to support new directions

Common mistakes to listen for:
- Innovation disconnected from strategic intent
- Portfolio overloaded with H1 work
- No plan for both exploration AND exploitation
- Strategy that ignores uncertainty

Assessment checklist:
Is there clear strategic intent driving the innovation?
Is the portfolio balanced across H1, H2, H3?
Are dynamic capabilities present?
Is the internal vs. external innovation mix justified?
Does the strategy account for uncertainty with experimentation?`
  },
  {
    id: 'innovation_op_model',
    name: 'Innovation Operating Model',
    enabled: false,
    content: `INNOVATION OPERATING MODEL FRAMEWORK (CES + Innovation Stack):

Core principle: Innovation is a SYSTEM. Missing any one layer causes predictable failures.

The CES Capability Model:
- CONCEPTUALIZATION — Identifying opportunities, generating hypotheses
- EXPERIMENTATION — Hypothesis-driven testing, generating real evidence
- SCALING — Mobilizing resources, integrating into the business

CES is a SYSTEM, not a sequence. All three must exist simultaneously.

The Innovation Stack:
1. GOVERNANCE — Strategic intent, risk appetite, resource authority
2. PORTFOLIO MANAGEMENT — Balancing bets, kill/scale criteria, learning metrics
3. EXECUTION SYSTEM — Discovery, Incubation, Acceleration pipeline

Common failure modes:
- Strong ideation, weak scaling
- Experimentation judged by ROI instead of learning
- No protected funding for breakthrough work
- Core business absorbs innovation before it scales

Assessment checklist:
Are all three CES capabilities present?
Is governance providing strategic intent and protecting resources?
Is the portfolio balanced?
Is there a clear pipeline from discovery through scaling?
Are metrics aligned to learning, not just financial return?`
  },
  {
    id: 'dtv',
    name: 'Design-to-Value (DTV)',
    enabled: false,
    content: `DESIGN-TO-VALUE (DTV) FRAMEWORK:

Core equation: Value = Customer Benefit MINUS Cost
Not all features create value. Many add cost without improving preference.

Three Non-Negotiable Insight Pillars:
1. CONSUMER INSIGHTS — What do customers actually value? What is willingness-to-pay for specific attributes?
2. COMPETITIVE INSIGHTS — How do competitors make design choices? Where are we over-engineering?
3. SUPPLIER AND COST INSIGHTS — What are the true cost drivers? What does clean-sheet analysis reveal?

Key principles:
- Optimize the WHOLE PRODUCT, not individual components
- Requires cross-functional integration: marketing, R&D, and operations together
- Every decision must be fact-based with data, trade-offs, and explicit assumptions

Common mistakes to listen for:
- Confusing more features with more value
- Ignoring willingness-to-pay data
- Treating DTV as pure cost-cutting
- Skipping competitive benchmarking

Assessment checklist:
Is the student using all three insight pillars?
Are they distinguishing features from value?
Is willingness-to-pay evidence present?
Are they thinking about the full product, not just components?
Are trade-offs explicitly stated?`
  },
  {
    id: 'storytelling',
    name: 'Innovative Storytelling',
    enabled: false,
    content: `ENTREPRENEURIAL STORYTELLING FRAMEWORK:

Core principle: Storytelling is how innovators secure resources, align stakeholders, and drive change.

The Core Elevator Pitch Structure (7 elements):
1. ACTOR — Who is experiencing the problem? Be specific.
2. PROBLEM — What real pain or unmet need exists?
3. INSIGHT — Why does this problem matter NOW? What shift makes it urgent?
4. SOLUTION — What is being proposed? Keep brief.
5. EVIDENCE — How will this be tested or proven?
6. VALUE — What is the specific upside?
7. ASK — What is needed? No clear ask equals no action.

The KBFA Model:
KNOW leads to BELIEVE leads to FEEL leads to ACT
To change action, you must first change what people know and believe.

Framing Archetypes:
- FEAR (Burning Platform): "If we do nothing, we lose..."
- GREED (Growth Opportunity): "If we act now, we capture..."

Common mistakes to listen for:
- No specific customer
- Solution-first thinking before the problem
- No emotional framing
- Generic value claims
- No clear ask

Assessment checklist:
Is the customer specific and real?
Does the problem come before the solution?
Is the KBFA flow present?
Is there a clear specific ask?
Is the framing archetype consciously chosen?
Is the story tailored to the specific audience?`
  },
  {
    id: 'team_traits',
    name: 'Innovative Team Traits',
    enabled: false,
    content: `INNOVATION TEAM TRAITS FRAMEWORK:

Core principle: Innovation effectiveness comes from diverse, interacting traits — not a single creative type.

Five Innovation Archetypes:
1. VISIONARIES — Generate bold ideas. Blind spot: lack of follow-through.
2. EXPERIMENTERS — Test assumptions, learn through iteration. Blind spot: stall without direction.
3. OPERATORS — Deliver results, build systems. Blind spot: resist ambiguity.
4. CONNECTORS — Build alignment, translate across groups. Blind spot: avoid hard trade-offs.
5. MULTIPLIERS — Amplify others, create conditions for innovation. Critical: if absent, teams underperform regardless of talent.

Team Coverage — four functions every innovation team needs:
- Idea generation
- Testing and learning
- Execution and scaling
- Alignment and influence

Common team imbalances:
- Over-indexed on ideas: great concepts, no execution
- Over-indexed on execution: efficient but no innovation
- Over-indexed on consensus: slow decisions

Assessment checklist:
Are all five archetypes represented or accounted for?
Are gaps in coverage identified?
Is friction between archetypes anticipated?
Is the leadership environment enabling or constraining?
Is composition matched to the stage of innovation?`
  },
  {
    id: 'coaching_rubric',
    name: 'Coaching Rubric',
    enabled: false,
    content: `MASTERY DEMONSTRATION COACHING RUBRIC:

Core standard: Strong work shows clear thinking, supported reasoning, and deliberate choices — not just correct answers.

Ten dimensions of strong thinking:
1. CLARITY OF CORE IDEA — Can the student state their argument in one precise sentence?
2. DEPTH OF THINKING — Does the student explore trade-offs and second-order effects?
3. STRUCTURED REASONING — Are claims connected to evidence and conclusions?
4. USE OF EVIDENCE — Are assertions supported by examples, data, or frameworks?
5. ALTERNATIVES GENERATED — Does the student weigh multiple approaches?
6. DECISIONS JUSTIFIED — Is there explicit reasoning behind recommendations?
7. CLEAR COMMUNICATION — Is the logic easy to follow?
8. ORIGINAL THINKING — Is the student adding insight beyond restating course material?
9. PRACTICAL FEASIBILITY — Are recommendations grounded in real constraints?
10. REFLECTION — Can the student identify the weakest part of their own argument?

Assessment checklist:
Is the core idea stated clearly and precisely?
Are trade-offs and implications explored?
Is every claim supported by evidence or reasoning?
Are alternatives considered before a recommendation?
Is the thinking original?
Is the recommendation feasible in a real context?`
  }
];

// ─────────────────────────────────────────
// LOGS
// ─────────────────────────────────────────
let usageLog = [];
let satisfactionLog = [];
let feedbackLog = [];

// ─────────────────────────────────────────
// BUILD SYSTEM PROMPT
// ─────────────────────────────────────────
function buildSystemPrompt() {
  const enabledChips = skillChips.filter(c => c.enabled);

  let chipContent = enabledChips.length > 0
    ? enabledChips.map(c => c.content).join('\n\n---\n\n')
    : 'No specific frameworks are active yet. Use general innovation coaching principles.';

  return `You are an Innovation Leadership Coach for MBA students at a top business school.

YOUR ROLE:
You are a COACH, not a consultant. Guide students to their own insights through questions and reflection. Never give direct answers or advice.

COACHING RULES:
1. Ask questions more than you give answers.
2. When a student shares an idea or plan, ask them to reflect — do not evaluate it for them.
3. If asked to evaluate a plan, guide the student through a self-assessment using the active frameworks below.
4. When giving feedback, use ONLY these two formats:
   - "It seems like you are on the right track because I am seeing evidence of [specific thing]..."
   - "I have some pause because I am not yet seeing evidence of [specific element]..."
5. Never say "You should do X" or "The answer is Y."
6. Keep all responses under 250 words.
7. Ask only one focused question at a time.
8. Be warm, encouraging, and curious.
9. Do not use markdown formatting like ** or ## in your responses. Write in plain conversational prose only.
10. If a student asks about something outside the active frameworks, gently let them know you are focused on specific topics this week and redirect.

ACTIVE FRAMEWORKS:
${chipContent}

TONE:
Warm, curious, supportive. Use phrases like "I am curious about..." and "Help me understand..."
Avoid "You need to..." or "You should..." or "The answer is..."

Remember: Help the student think better, not think for them.`;
}

// ─────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────

// User chat
app.post('/chat', async (req, res) => {
  const { message, history } = req.body;
  if (!message) return res.status(400).json({ error: 'No message provided' });

  try {
    const messages = [];
    if (history && history.length > 0) {
      history.forEach(h => messages.push({ role: h.role, content: h.content }));
    }
    messages.push({ role: 'user', content: message });

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 500,
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        ...messages
      ]
    });

    const reply = response.choices[0].message.content;

    usageLog.push({
      timestamp: new Date().toISOString(),
      userMessage: message.substring(0, 150),
      coachReply: reply.substring(0, 150),
      activeChips: skillChips.filter(c => c.enabled).map(c => c.name)
    });

    res.json({ reply });
  } catch (err) {
    console.error('OpenAI API error:', err.message);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// Satisfaction score
app.post('/satisfaction', (req, res) => {
  const { score } = req.body;
  satisfactionLog.push({
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleDateString('en-US'),
    score: Number(score)
  });
  res.json({ ok: true });
});

// Feedback
app.post('/feedback', (req, res) => {
  const { message } = req.body;
  feedbackLog.push({
    timestamp: new Date().toISOString(),
    message: message
  });
  res.json({ ok: true });
});

// Admin: verify password
app.post('/admin/verify', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    res.json({ ok: true });
  } else {
    res.status(401).json({ ok: false, error: 'Wrong password' });
  }
});

// Admin: get all data
app.get('/admin/data', (req, res) => {
  if (req.headers['x-admin-password'] !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.json({ chips: skillChips, usageLog, satisfactionLog, feedbackLog });
});

// Admin: toggle a chip on or off
app.post('/admin/toggle-chip', (req, res) => {
  if (req.headers['x-admin-password'] !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const chip = skillChips.find(c => c.id === req.body.id);
  if (!chip) return res.status(404).json({ error: 'Chip not found' });
  chip.enabled = !chip.enabled;
  res.json({ ok: true, chip });
});

// ─────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Innovation Coach running on port ${PORT}`));
