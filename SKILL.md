---
name: wikipedia-interest-analysis
description: Analyzes Wikipedia pageview trends for a topic across language editions to estimate audience interest and how reliable its growth is. On request, it also renders charts and a one-page PDF report. Use when the user asks whether interest in a topic is growing, wants to compare languages or markets, choose which topic or localization to invest in next, or needs a shareable report based on Wikipedia data.
compatibility: Requires Node.js 22+, npm, and internet access to wikimedia.org and wikidata.org.
metadata:
  author: namanica
  version: "0.1.0"
---

# Wikipedia interest analysis

Measures how interest in a topic changes in different Wikipedia language editions, using
daily pageviews from the Wikimedia API. The scripts do all the math: trend, growth,
spikes, confidence, limitations. Your job: understand the request, run the right command,
and explain the JSON result to the user in their language.

## When to use

- "Is interest in X growing (in Ukrainian / Polish / …)?"
- "Compare interest in X between languages / markets."
- "Which language or audience should we localize X for next?"
- "Make a chart / a PDF report to share with the team."

Not for: article content, facts about the topic, sales or search-engine data.

## Setup (once)

`<skill>` below is the folder that contains this SKILL.md. Install dependencies once:

```sh
cd <skill> && npm ci
```

Always run scripts **from the user's working folder** with the full path
`node <skill>/scripts/...`: results are saved to `./wikipedia-interest-analysis-output/`
in the current folder. Downloaded data is cached in the user's cache folder, so repeated
and refined questions are fast and do not hit the network.

## Quick start: one command

```sh
node <skill>/scripts/run-analysis.js --topic "astronomy" --langs uk
node <skill>/scripts/run-analysis.js --topic "intermittent fasting" --langs pl,cs
```

It finds the articles (via Wikidata), downloads pageviews, analyzes them, saves the run
and prints a compact JSON. Read `summary` first, then `data.results`, `data.ranking`,
`data.limitations` and `hints`.

## Algorithm

1. **Pick the topic and languages.**
   - The languages come from the question's content ("in Polish and Czech Wikipedia",
     "for Ukrainian users"), not from the language the user writes in.
   - If no language is named, ask which markets or languages to compare. Do not guess.
   - Use Wikipedia language codes: uk, pl, cs, de, en, es, fr, …
   - Name the topic as a concept in English ("English as a second or foreign
     language", not "learning English"). For a non-English name, add
     `--query-lang <code>`: `--topic "астрономія" --query-lang uk`.
2. **Run `run-analysis.js`.** Default period: last 3 years (full months).
3. **Check what was resolved.** `data.topic.description` must match what the user means.
   If it does not (a journal, a film, a program with the same name), pick the right item
   from `data.alternatives` and rerun with `--qid <id>`, or ask the user.
4. **Check missing languages.** `data.topic.missing_langs` have no article about the
   topic: say so; it is a finding, not an error.
5. **Answer** using only numbers from the JSON (see below).
6. **Offer next steps**: a chart or a PDF report.

If the output says the run needs many requests (`estimated_requests`), ask the user
whether to continue, then rerun the same command with `--confirm`.

## How to read the result

Each item in `data.results`:

| Field                  | Meaning                                                           |
| ---------------------- | ----------------------------------------------------------------- |
| `trend`                | `growing`, `declining` or `no_clear_trend` (statistical test)     |
| `trend_pct_per_year`   | trend slope, % of the average level per year                      |
| `yoy_growth_pct`       | last 12 months vs previous 12 (normalized, spikes removed)        |
| `yoy_views_growth_pct` | the same for raw views (what pageviews.wmcloud.org shows)         |
| `avg_monthly_views`    | average raw views per month                                       |
| `views_per_million`    | article views per million views of the edition, last 12 months    |
| `confidence`           | `high`, `medium` or `low`: how much to trust the trend            |
| `flags`                | reasons for lower confidence; sentences are in `data.limitations` |
| `top_spikes`           | days with unusual one-day peaks (news, TV, viral links)           |

- By default values are **normalized** by the whole language edition, so general
  Wikipedia traffic changes do not look like topic interest.
- `data.ranking` (2+ languages) orders languages by growth, low confidence last;
  `promising: true` means not low confidence, enough views and growth above the threshold.
- When `trend` is `no_clear_trend`, say there is no clear trend. Do not quote
  `trend_pct_per_year` as growth or decline.

## How to answer

Default answer is **text**, in the user's language:

1. The conclusion in 1–2 sentences (growing / declining / no clear trend).
2. Key numbers from the JSON: trend per year, year-over-year, average views per month.
   For comparisons, a short table: language, views/month, trend/yr, YoY, confidence.
3. Confidence, stated plainly. If `low`, say the data cannot support a firm conclusion
   and why (from `data.limitations`).
4. The main limitations: always "pageviews show attention, not willingness to pay", plus
   every limitation of the flags present.
5. What to check next (other signals, other languages, related topics).
6. End with: "I can build a chart or prepare a one-page PDF report."

| The user asks                            | They get                                          |
| ---------------------------------------- | ------------------------------------------------- |
| A question ("is interest in X growing?") | text as above                                     |
| A comparison of languages or topics      | text + short table, offer a chart or report       |
| A chart ("show", "plot")                 | text + PNG chart (`--chart` or `render-chart.js`) |
| A report ("to share with the team")      | PDF + a short text summary                        |
| A refinement ("add Slovak", "5 years")   | same format as before, rerun with new parameters  |

## Refinements

Rerun `run-analysis.js` with changed parameters. Cached data is reused and only new data
is downloaded (`network_requests` shows how many requests were made).

| The user says                              | Change                                                   |
| ------------------------------------------ | -------------------------------------------------------- |
| "add Slovak"                               | add the code to `--langs`                                |
| "for 5 years" / "since 2020"               | `--years 5` / `--start 2020-01-01`                       |
| "without spikes" (default) / "keep spikes" | default / `--keep-spikes`                                |
| "without normalization", "raw views"       | `--raw`                                                  |
| "only markets with at least 1000 views"    | `--min-monthly-views 1000`                               |
| "growth of at least 10%"                   | `--min-growth 10`                                        |
| "wrong topic, I meant …"                   | `--qid <id>` from `alternatives`, or a clearer `--topic` |
| "what was the growth in Polish?"           | answer from the previous JSON, no new run                |

## Charts and reports (only on request)

```sh
node <skill>/scripts/run-analysis.js --topic "astronomy" --langs uk --chart
node <skill>/scripts/render-chart.js --run <run_id>
node <skill>/scripts/build-report.js --run <run_id> --locale uk \
  --summary "<your 2-3 sentence conclusion, in the user's language>" \
  --question "<the user's question, short>" --next "<what to check next>"
```

- `run_id` is in the output of `run-analysis.js`. `--run latest` uses the last run.
  Neither command downloads or recalculates anything.
- The chart for one language shows monthly values, the trend line and spike days. For
  several languages it shows an index (first 12 months = 100).
- The PDF takes the table, chart, confidence, assumptions and limitations from the run.
  Only `--summary`, `--question` and `--next` come from you. Write them in the user's
  language; `--locale` (`en` or `uk`) sets the labels.
- If the report does not fit on one page, the error says so: shorten `--summary` or
  `--next` and run it again.
- Give the user the file path from `files`.

## Do not

- Do not invent or recalculate numbers: every number in your answer must be in the JSON.
- Do not draw conclusions without running the analysis.
- Do not hide low confidence or skip limitations.
- Do not create charts or PDFs unless the user asks.
- Do not read or change the skill's code; use `--help` of a script if unsure.
- Do not treat pageviews as sales, revenue or willingness to pay.

## Before you answer, check

- [ ] Every number is copied from the JSON output.
- [ ] The resolved topic (`data.topic.description`) is what the user meant.
- [ ] Confidence is stated; low confidence is named plainly.
- [ ] Limitations are mentioned; missing languages are reported.
- [ ] The answer is in the user's language and ends with the chart/report offer.

## Errors

Scripts print `{"ok": false, "error", "hint"}` and exit with 1 (input problem) or
2 (network/API problem). Follow the `hint`. For a network error, wait a minute and retry
once.

## More

- [references/cli.md](references/cli.md): every script and option.
- [references/methodology.md](references/methodology.md): metrics, confidence rules, flags.
- [references/examples.md](references/examples.md): example answers for each request type.
