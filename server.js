const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─────────────────────────────────────────
// SKILL CHIPS
// These are your real course frameworks.
// enabled: false = OFF by default.
// Toggle them on in the Admin panel week by week.
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
- Confirmation bias — seeking data that confirms the solution they already want

Assessment checklist:
□ Is the user clearly identified and specific?
□ Is the problem statement insight-driven, not solution-biased?
□ Is there real evidence from real users (not assumptions)?
□ Are ideas diverse and tied to user needs?
□ Is there a plan to test with real users?
□ Does the thinking show iteration, not just a linear plan?`
  },
  {
    id: 'innovators_dna',
    name: "Innovator's DNA",
    enabled: false,
    content: `INNOVATOR'S DNA FRAMEWORK (Dyer, Gregersen, Christensen):

Core insight: Innovation is a SKILL, not a talent. It can be deliberately practiced and developed.

The Five Discovery Skills:
1. ASSOCIATING — Connecting seemingly unrelated ideas, problems, or domains. The ability to find unexpected links across industries, fields, or experiences.
2. QUESTIONING — Challenging assumptions by asking "why," "why not," and "what if." Questioning the status quo rather than accepting it.
3. OBSERVING — Watching customers, competitors, and adjacent industries carefully to uncover unmet needs. Noticing what others overlook.
4. NETWORKING — Engaging with people who have radically different perspectives to gain new ideas. Not networking for career — networking for insight.
5. EXPERIMENTING — Testing ideas through prototypes, pilots, and iteration. Treating the world as a lab.

Key principle: Most innovative ideas come from ASSOCIATING — connecting inputs from the other four skills in unexpected ways.

How these skills interact:
- Questioning + Observing = surfacing real problems worth solving
- Networking + Associating = finding solutions from unexpected places
- Experimenting = testing whether the associations and questions lead somewhere real

Common gaps to listen for:
- Students who only execute but never question or experiment
- Confusing networking (for career) with networking (for diverse perspective)
- Treating experimentation as planning rather than actual testing
- Observing what people SAY vs. what people DO

Assessment checklist:
□ Can the student name which discovery skill they are using (or missing)?
□ Is their questioning challenging real assumptions, or just asking surface questions?
□ Is their observing based on direct contact with users/customers?
□ Are their experiments actual tests, or just detailed plans?
□ Are they connecting ideas across domains (associating), or staying inside one field?`
  },
  {
    id: 'jtbd',
    name: 'Jobs-to-Be-Done',
    enabled: false,
    content: `JOBS-TO-BE-DONE (JTBD) FRAMEWORK:

Core principle: People do not buy products — they "hire" them to make progress in their lives. Understanding the JOB is more important than understanding the customer demographic.

The Job Statement format:
"When [situation/context], I want to [motivation/action], so I can [desired outcome]."
Always anchor to situation and outcome — not product features.

Three dimensions of every job:
1. FUNCTIONAL JOB — The practical task the customer is trying to accomplish
2. EMOTIONAL JOB — How the customer wants to feel (or avoid feeling) while doing it
3. SOCIAL JOB — How the customer wants to be perceived by others

The Four Forces of Progress (why customers switch or stay):
- PUSH of the current situation (pain, frustration, dissatisfaction)
- PULL of the new solution (attraction, promise, appeal)
- ANXIETY of change (fear of the new, switching cost)
- HABIT of the present (comfort with existing behavior)

Key distinction: Your competition is NOT other products in your category. It is whatever the customer currently uses — including doing nothing — to do that job.

Common mistakes to listen for:
- Defining the job in terms of the product ("the job is to use our app")
- Segmenting customers by demographics instead of situation
- Confusing solutions with jobs
- Ignoring emotional or social dimensions of the job
- Treating innovation as feature improvement rather than progress improvement

Assessment checklist:
□ Is the job statement situation-based and outcome-focused?
□ Are all three job dimensions considered (functional, emotional, social)?
□ Are the four forces of progress identified?
□ Is the real competition correctly identified (including non-consumption)?
□ Is the student avoiding feature-based or product-based thinking?`
  },
  {
    id: 'tuna',
    name: 'TUNA Framework',
    enabled: false,
    content: `TUNA FRAMEWORK (Turbulence, Uncertainty, Novelty, Ambiguity):

Core principle: Different types of complexity require different responses. Diagnosing WHICH dimension of TUNA you are facing determines what to do next.

The Four TUNA Dimensions:
- TURBULENCE — Rapid, unpredictable change in the environment. Response: shorten decision cycles, adapt in real time, probe before committing.
- UNCERTAINTY — Unknown outcomes even when change is visible. Response: test assumptions, run experiments, avoid false confidence.
- NOVELTY — No precedent exists. Response: learn before scaling, experiment, use analogies from other domains, avoid copy-paste strategies.
- AMBIGUITY — Multiple valid interpretations of the same situation. Response: reframe the problem, build narrative, explore multiple interpretations before acting.

DVF Risk Lens (always apply alongside TUNA):
- DESIRABILITY — Do customers actually want this? (demand risk)
- FEASIBILITY — Can we actually build or deliver it? (execution risk)
- VIABILITY — Can it sustain itself economically? (business model risk)

How to use TUNA + DVF together:
Map which TUNA dimension is amplifying which DVF risk. Example: High NOVELTY increases DESIRABILITY uncertainty because there is no market data.

Key principle: Under TUNA conditions, intuition is unreliable. Experimentation becomes the primary tool for making decisions.

Common mistakes to listen for:
- Treating all uncertainty the same way (mixing up TUNA dimensions)
- Making strategic decisions as if the environment is stable when it is not
- Skipping the diagnosis step and jumping to action
- Confusing ambiguity (interpretation problem) with uncertainty (information problem)

Assessment checklist:
□ Can the student correctly identify which TUNA dimension(s) are present?
□ Is their proposed response matched to the correct TUNA dimension?
□ Are DVF risks identified and mapped to TUNA conditions?
□ Is experimentation built into their approach?
□ Are they avoiding false certainty?`
  },
  {
    id: 'critical_assumptions',
    name: 'Critical Assumptions (DFV × BMC)',
    enabled: false,
    content: `CRITICAL ASSUMPTIONS FRAMEWORK (DFV × Business Model Canvas):

Core principle: Every business idea is a bundle of assumptions. The job is to identify WHICH assumptions are riskiest and test them BEFORE over-investing.

Definition of a Critical Assumption:
An assumption is CRITICAL when it is both:
- HIGH UNCERTAINTY (we don't actually know if it's true), AND
- HIGH IMPACT (if it's wrong, the whole model fails)

The DFV Categories:
- DESIRABILITY (D) — Assumptions about customers: Does this person have the problem? Do they care enough to act or pay? Does our solution create real value for them?
- FEASIBILITY (F) — Assumptions about execution: Can we actually build/deliver this? Does the technology work? Can our organization support it?
- VIABILITY (V) — Assumptions about the business model: Does the revenue model work? Are the costs sustainable? Do the unit economics scale?

Business Model Canvas mapping: Each assumption maps to one BMC block (Customer Segments, Value Proposition, Channels, Customer Relationships, Revenue Streams, Key Activities, Key Resources, Key Partners, Cost Structure).

The Testing Sequence:
1. Extract assumptions (what must be true for this to work?)
2. Classify each as D, F, or V
3. Prioritize by uncertainty × impact
4. Convert to testable hypotheses: "We believe [customer] will [behavior] because [reason]"
5. Design the cheapest experiment that could prove it wrong

Key principle: Assumptions are NOT solutions. Students often confuse what they plan to do (solution) with what must be true (assumption).

Common mistakes to listen for:
- Treating assumptions as facts because they "feel" true
- Testing easy assumptions instead of riskiest ones
- Vague assumptions that cannot be tested ("customers will like it")
- Skipping desirability to focus only on feasibility

Assessment checklist:
□ Are assumptions separated from solutions?
□ Are the top 3–5 riskiest assumptions correctly identified?
□ Is each assumption correctly classified as D, F, or V?
□ Are assumptions written as testable, falsifiable statements?
□ Is there a clear experiment designed for the riskiest assumption?`
  },
  {
    id: 'innovation_strategy',
    name: 'Innovation Strategy',
    enabled: false,
    content: `INNOVATION STRATEGY FRAMEWORK:

Core principle: Innovation without strategic alignment is just activity. All innovation must tie back to what the organization is trying to achieve.

Strategic Alignment:
- Every innovation initiative must connect to: strategic intent, growth goals, and competitive context.
- "Commander's intent" = clear top-down direction that guides bottom-up experimentation without micromanaging every decision.

Portfolio Thinking (Horizon Model):
- H1 (Core/Incremental): Defending and improving existing business. Typically 60–70% of resources.
- H2 (Adjacent/Expansion): Extending into nearby markets or capabilities. Typically 20–30%.
- H3 (Transformational/Breakthrough): Exploring entirely new business models. Typically 10–15%.
- Most organizations over-invest in H1 and under-invest in H3 — this creates long-term vulnerability.

Exploration vs. Exploitation:
- Exploitation: Getting better at what you already do (H1)
- Exploration: Discovering what you should do next (H2/H3)
- Ambidextrous organizations do both simultaneously.

Dynamic Capabilities (Teece):
- SENSING — Identifying emerging opportunities before competitors do
- SEIZING — Allocating resources quickly to capture those opportunities
- RECONFIGURING — Reorganizing the business to support new directions

Internal vs. External Innovation:
- Internal: R&D, product teams, intrapreneurs
- External: Partnerships, startups, acquisitions, open innovation
- The right mix depends on: capability gaps, speed needs, and control requirements

Operating Under Uncertainty:
- Strategy under VUCA/TUNA requires scenario thinking, learning loops, and adaptive decision-making — not just planning.

Assessment checklist:
□ Is there clear strategic intent driving the innovation?
□ Is the innovation portfolio balanced across H1/H2/H3?
□ Is there a plan for both exploration AND exploitation?
□ Are dynamic capabilities (sensing, seizing, reconfiguring) present?
□ Is the internal/external innovation mix justified?
□ Does the strategy account for uncertainty with experimentation?`
  },
  {
    id: 'innovation_op_model',
    name: 'Innovation Operating Model',
    enabled: false,
    content: `INNOVATION OPERATING MODEL FRAMEWORK (CES + Innovation Stack):

Core principle: Innovation is a SYSTEM, not a single activity. All three layers must work together — missing any one causes predictable failures.

The CES Capability Model (Primary Lens):
- CONCEPTUALIZATION — Identifying opportunities, framing strategic narratives, generating business model hypotheses. This is where possibilities are created.
- EXPERIMENTATION — Hypothesis-driven testing, generating real evidence (A/B tests, pilots, MVPs), learning velocity over certainty.
- SCALING — Mobilizing resources, integrating into the business (or spinning out), operationalizing and growing.

Important: CES is a SYSTEM, not a sequence. All three capabilities must exist simultaneously and interact.

The Innovation Stack (Three Layers):
1. GOVERNANCE (Top-down)
   - Strategic intent ("commander's intent")
   - Risk appetite and time horizons
   - Resource allocation authority
   - Independence vs. integration decisions
2. PORTFOLIO MANAGEMENT (Middle layer)
   - Balancing incremental vs. breakthrough bets
   - Kill/scale decision logic and criteria
   - Metrics aligned to learning (not just ROI)
3. EXECUTION SYSTEM (Bottom layer)
   - Discovery → Incubation → Acceleration pipeline
   - Discovery = opportunity + concept creation
   - Incubation = experimentation + validation
   - Acceleration = scaling + business integration

Common failure modes to diagnose:
- Strong ideation, weak scaling (most common)
- Experimentation judged by ROI metrics (wrong measurement)
- No protected funding for breakthrough innovation
- Too many projects, no kill criteria
- Core business rejects or absorbs innovation before it scales

Assessment checklist:
□ Are all three CES capabilities present, or is one missing?
□ Is governance providing strategic intent and protecting resources?
□ Is the portfolio balanced, or overloaded with incremental work?
□ Is there a clear pipeline from discovery through scaling?
□ Are metrics aligned to learning velocity, not just financial return?
□ Is breakthrough innovation structurally separated from the core business?`
  },
  {
    id: 'dtv',
    name: 'Design-to-Value (DTV)',
    enabled: false,
    content: `DESIGN-TO-VALUE (DTV) FRAMEWORK:

Core definition: DTV is a multi-dimensional, fact-based approach that improves margins through better product design and cost optimization — built on consumer, competitive, and supplier insights.

Core equation: Value = Customer Benefit MINUS Cost
Not all features create value. Many add cost without improving customer preference.

The Three Non-Negotiable Insight Pillars:
1. CONSUMER INSIGHTS — What do customers actually value? What is their willingness-to-pay for specific attributes (not features in general)? What designs land in "no man's land" with no clear advantage?
2. COMPETITIVE INSIGHTS — How do competitors make their design choices? Where are we over-engineering relative to the market? Where are we under-investing in what customers pay for?
3. SUPPLIER/COST INSIGHTS — What are the true cost drivers (materials, manufacturing complexity, design choices)? What does "clean-sheet" cost analysis reveal?

Key DTV principles:
- Optimize the WHOLE PRODUCT, not individual components in isolation
- Require cross-functional integration: marketing, R&D, and operations must work together from the start — not sequentially
- Every decision must be fact-based: data, trade-offs, and explicit assumptions. Reject intuition-only reasoning.

Typical DTV improvement levers:
- Remove low-value features (they add cost, not preference)
- Redesign for high-value attributes customers actually pay for
- Reduce material or design complexity where customers don't notice
- Shift investment toward configurations with highest value-to-cost ratio

Common mistakes to listen for:
- Confusing "more features" with "more value"
- Ignoring willingness-to-pay data
- Optimizing a component while degrading the full product experience
- Treating DTV as pure cost-cutting (it is about VALUE optimization, not just savings)
- Skipping competitive benchmarking

Assessment checklist:
□ Is the student using all three insight pillars (consumer, competitive, supplier)?
□ Are they distinguishing between features and value?
□ Is willingness-to-pay evidence present?
□ Are they thinking about the full product, not just components?
□ Is cross-functional thinking visible in the approach?
□ Are trade-offs explicitly stated (not just recommendations)?`
  },
  {
    id: 'storytelling',
    name: 'Innovative Storytelling',
    enabled: false,
    content: `ENTREPRENEURIAL STORYTELLING FRAMEWORK:

Core principle: Storytelling is a strategic and operational capability in innovation — not just communication polish. It is how innovators secure resources, align stakeholders, and drive change.

The Core Elevator Pitch Structure (7 elements):
1. ACTOR (Customer) — Who is experiencing the problem? Be specific, not generic.
2. PROBLEM — What real pain or unmet need exists? Must be grounded in evidence, not assumption.
3. INSIGHT / EXPERT VIEW — Why does this problem matter NOW? What shift (market, behavioral, technological) makes it urgent?
4. SOLUTION — What is being proposed? Keep brief — the problem should dominate the pitch, not the solution.
5. EVIDENCE / VALIDATION PATH — How will this be tested or proven? What experiments, data, or pilots exist?
6. VALUE — What is the upside? Be specific (growth, efficiency, competitive advantage — not vague claims).
7. ASK — What is needed? (Resources, approval, a next meeting.) No clear ask = no action.

The KBFA Behavior-Change Model:
KNOW → BELIEVE → FEEL → ACT
- To change someone's ACTION, you must first change what they KNOW (facts), which shifts what they BELIEVE (conclusions), which creates FEELING (urgency or excitement).
- Common mistake: arguing for action without addressing upstream beliefs and feelings.

Framing Archetypes (choose one intentionally):
- FEAR (Burning Platform): "If we do nothing, we lose..." — effective for resistant or complacent audiences
- GREED (Growth Opportunity): "If we act now, we capture..." — effective for growth-oriented audiences

Audience tailoring:
- Executives → Strategic alignment, growth, risk
- Middle management → Feasibility, resource trade-offs
- Operators → Execution clarity, workload impact
- Investors → Market size, scalability, return

Common mistakes to listen for:
- No clear, specific customer (too abstract)
- Solution-first thinking — leading with the product before the problem
- No emotional framing — missing the KBFA "Feel" step
- Generic value claims ("this will improve efficiency")
- No clear ask at the end
- One-size-fits-all message for all audiences

Assessment checklist:
□ Is the customer specific and real?
□ Does the problem come before the solution?
□ Is there an expert view or market insight creating urgency?
□ Is the KBFA flow present (facts → beliefs → feeling → action)?
□ Is there a clear, specific ask?
□ Is the framing archetype (fear or greed) consciously chosen?
□ Is the story tailored to the specific audience?`
  },
  {
    id: 'team_traits',
    name: 'Innovative Team Traits',
    enabled: false,
    content: `INNOVATION TEAM TRAITS FRAMEWORK:

Core principle: Innovation effectiveness comes from DIVERSE, INTERACTING TRAITS — not a single "creative type." Teams need different capabilities that complement and challenge each other.

Five Innovation Archetypes (behavioral tendencies, not fixed identities):
1. VISIONARIES (Conceptualizers) — Generate bold ideas, see future possibilities. Blind spot: lack of follow-through.
2. EXPERIMENTERS (Validators) — Test assumptions, learn through iteration. Blind spot: may stall without clear direction.
3. OPERATORS (Executors/Scalers) — Deliver results, build systems and processes. Blind spot: resist ambiguity and radical ideas.
4. CONNECTORS (Collaborators/Influencers) — Build alignment, translate across groups. Blind spot: may avoid hard trade-offs.
5. MULTIPLIERS (Leaders/Amplifiers) — Expand others' capabilities, create conditions for innovation to thrive. Critical: if absent, teams underperform regardless of individual talent.

Team Coverage Assessment — four functions every innovation team needs:
- Idea generation (Visionaries)
- Testing and learning (Experimenters)
- Execution and scaling (Operators)
- Alignment and influence (Connectors)
Missing any one creates a predictable bottleneck.

Common team imbalances:
- Over-indexed on ideas → great concepts, no execution
- Over-indexed on execution → efficient, but no innovation
- Over-indexed on consensus → slow decisions, watered-down ideas

The Leadership Multiplier Effect:
Leadership either EXPANDS or CONSTRAINS team capability. Even a talented team underperforms under leadership that avoids risk, demands certainty, or controls too tightly.

Common mistakes to listen for:
- Treating team composition as an afterthought after strategy is set
- Confusing personality with capability
- Assuming the loudest voices represent the full team
- Ignoring the absence of a multiplier role

Assessment checklist:
□ Are all five archetypes represented or consciously accounted for?
□ Are gaps in coverage identified (not just strengths)?
□ Is friction between archetypes anticipated and managed?
□ Is the leadership environment enabling or constraining the team?
□ Is the team composition matched to the stage of innovation (early exploration vs. scaling)?`
  },
  {
    id: 'coaching_rubric',
    name: 'Coaching Rubric',
    enabled: false,
    content: `MASTERY DEMONSTRATION COACHING RUBRIC:

Core standard: Strong work shows CLEAR THINKING, SUPPORTED REASONING, and DELIBERATE CHOICES — not just correct answers. The goal is to help students think like experts, not just produce answers.

Ten dimensions of strong thinking:

1. CLARITY OF CORE IDEA — Can the student state their main argument or analysis in one precise sentence? Are main ideas separated from supporting details?

2. DEPTH OF THINKING — Does the student explore implications, trade-offs, and second-order effects? Or do they stay at the surface level?

3. STRUCTURED REASONING — Are claims connected to evidence, which are connected to conclusions? Are there logical gaps?

4. USE OF EVIDENCE — Are assertions supported by specific examples, data, or frameworks? Or are they unsupported opinions?

5. ALTERNATIVES GENERATED — Does the student show awareness of multiple approaches? Do they weigh pros and cons before choosing?

6. DECISIONS JUSTIFIED — Is there explicit reasoning behind recommendations? Are decision criteria transparent?

7. CLEAR COMMUNICATION — Is the logic easy to follow (beginning → middle → end)? Is language precise, not vague?

8. ORIGINAL THINKING — Is the student adding insight beyond repeating what they were taught? Are they synthesizing ideas into something new?

9. PRACTICAL FEASIBILITY — Are recommendations grounded in real-world constraints (time, resources, organizational context)? Are they actionable?

10. REFLECTION AND IMPROVEMENT — Can the student identify the weakest part of their own argument? Do they show a continuous improvement mindset?

Coaching posture: Always push toward STRONGER THINKING, not just better answers.
Instead of "your analysis is weak," ask: "What would someone who disagrees say?"
Instead of "add more evidence," ask: "What specific example makes this more convincing?"

Assessment checklist:
□ Is the core idea stated clearly and precisely?
□ Are trade-offs and implications explored (not just the obvious)?
□ Is every claim supported by evidence or reasoning?
□ Are alternatives considered before a recommendation is made?
□ Is the thinking original — not just restating course material?
□ Is the recommendation feasible in a real organizational context?`
  }
];

// ─────────────────────────────────────────
// LOGS (stored in memory while server runs)
// ─────────────────────────────────────────
let usageLog = [];
let satisfactionLog = [];
let feedbackLog = [];

// ─────────────────────────────────────────
// BUILD THE SYSTEM PROMPT FROM ACTIVE CHIPS
// ─────────────────────────────────────────
function buildSystemPrompt() {
  const enabledChips = skillChips.filter(c => c.enabled);

  let chipContent = enabledChips.length > 0
    ? enabledChips.map(c => c.content).join('\n\n---\n\n')
    : 'No specific frameworks are active yet. Use general innovation coaching principles.';

  return `You are an Innovation Leadership Coach for MBA students at a top business school.

YOUR ROLE:
You are a COACH, not a consultant. Your job is to guide students to their own insights through questions and reflection — never give direct answers or advice.

COACHING RULES:
1. Ask questions more than you give answers.
2. When a student shares an idea or plan, ask them to reflect — do not evaluate it for them.
3. If asked to evaluate a plan, guide the student through a self-assessment using the active frameworks below. Use the "Assessment checklist" in each framework to notice what is present or missing.
4. When giving feedback, use ONLY these two formats:
   - "It seems like you are on the right track because I am seeing evidence of [specific thing from the frameworks]..."
   - "I have some pause because I am not yet seeing evidence of [specific element from the frameworks]..."
5. Never say "You should do X" or "The answer is Y."
6. Keep all responses under 250 words.
7. Ask only one focused question at a time — never multiple questions in one message.
8. Be warm, encouraging, and curious. Celebrate effort and reflection.
9. If a student asks about something outside the active frameworks below, gently let them know you are focused on specific topics this week and redirect.

ACTIVE FRAMEWORKS (Your coaching knowledge base this week):
${chipContent}

TONE:
Warm, curious, and supportive — like a trusted mentor who believes in the student's potential.
Use phrases like "I am curious about..." and "Help me understand..." and "What would you say if..."
Avoid "You need to..." or "You should..." or "The answer is..."

Remember: Your job is to help the student think better, not to think for them.`;
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

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      system: buildSystemPrompt(),
      messages: messages
    });

    const reply = response.content[0].text;

    usageLog.push({
      timestamp: new Date().toISOString(),
      userMessage: message.substring(0, 150),
      coachReply: reply.substring(0, 150),
      activeChips: skillChips.filter(c => c.enabled).map(c => c.name)
    });

    res.json({ reply });
  } catch (err) {
    console.error('Claude API error:', err.message);
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