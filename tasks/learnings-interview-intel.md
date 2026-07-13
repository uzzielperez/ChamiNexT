# Learnings: Interview Intel Pipeline (July 2026)

Source: first real run of `scripts/interview-intel/` (238 documents scraped from
Reddit, Hacker News, blogs, and YouTube transcripts; heuristic extraction into
`content/interview-intel/intel.json`).

## What the field data showed

1. **Most of a real interview is not algorithms.** Coding questions were a
   minority of what candidates report being asked. The bulk: domain-knowledge
   rapid-fire ("How does DNS work?", "SQL vs NoSQL?", "abstract class vs
   interface?"), behavioral ("How do you handle conflicts in a team?"), and
   recruiter/logistics questions. Prep that only trains problem-solving covers
   roughly half of what decides an offer.

2. **Screening rounds are a distinct format.** Phone screens are short, factual,
   many questions in a row: fast recall plus a crisp two-sentence explanation.
   These map almost one-to-one onto the skill-tree "fundamentals" bullets; the
   field data says those bullets are literally the questions.

3. **Process unpreparedness is a real failure mode.** Threads are full of
   timelines (OA → phone screen → 3x45 loop) and people blindsided by a stage
   type, not a question. Candidates need to rehearse each stage, not just
   harder problems.

4. **First-party data is the moat; scraping is the fragile half.** Reddit 403s
   non-browser clients, YouTube requires proof-of-origin tokens, PullPush rate
   limits. Scraped intel seeds the flywheel; user-filed field reports keep it
   spinning and make the dataset proprietary.

## Shipped from these learnings

- Behavioral + recruiter rounds as first-class domains: dedicated interviewer
  personas (STAR probing, recruiter-fit probing), soft-round score
  reinterpretation.
- `/intel` page: real processes and exact questions, each practiceable in one
  click against the AI interviewer.
- Recommendation engine steers toward the weakest scored domain.
- Full-loop simulation at `/loop`: recruiter screen → technical screen →
  behavioral round, with per-stage readiness debrief. (This session.)

## Roadmap (priority order)

1. ~~Full-loop simulation~~ — shipped at `/loop`.
2. ~~Rapid-fire drill mode~~ — shipped at `/drill`.
3. ~~Project walkthrough coaching~~ — shipped at `/coaching/project-walkthrough`
   (deployment, tests, PR defense; NotebookLM brief in
   `tasks/brief-notebooklm-project-walkthrough.md`).
4. **Behavioral signal in the talent profile**: communication-under-pressure as
   a third axis for the Interview Studio (employers see thinking + shipping;
   add behavioral).
4. **Automate the pipeline**: weekly scheduled run (GitHub Action) with
   `GROQ_API_KEY` so LLM extraction pulls process timelines the heuristic
   cannot; intel stays fresh.
5. **Close the field-report loop harder**: after any intel-sourced session,
   prompt "Did you have this interview for real? Log what they asked."

## Operational notes

- `npm run intel` = scrape + extract. Re-run scrape after a few minutes to
  backfill PullPush 429s (cache merges incrementally by doc id).
- Heuristic extraction is precision-tuned (~24 clean questions from 238 docs);
  LLM extraction multiplies recall and adds stage timelines.
- yt-dlp (installed via pip --user) is required for YouTube transcripts.
