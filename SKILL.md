---
name: wikipedia-interest-analysis
description: Measures whether interest in a topic is growing or falling, and how reliable that conclusion is, using Wikipedia pageviews across language editions. Use for any question whether interest in, popularity of or attention to a topic is growing or declining, even when Wikipedia is not mentioned; to compare languages or markets; to choose which topic or localization to invest in next; or to prepare a chart or a one-page PDF report on it. Not for writing or editing articles.
compatibility: Requires Node.js 22+, npm, and internet access to wikimedia.org and wikidata.org.
metadata:
  author: namanica
  version: "0.2.0"
---

# Wikipedia interest analysis

Measures how interest in a topic changes in different Wikipedia language editions, using
daily pageviews from the Wikimedia API. The scripts do all the math: trend, growth,
spikes, confidence, comparisons, limitations. Your job: understand the request, run the
right command, and retell the JSON result to the user in their language.

## When to use

- "Is interest in X growing?" (with or without "in Wikipedia" / a language)
- "Compare interest in X between languages / markets."
- "Which language or audience should we localize X for next?"
- "Make a chart / a PDF report to share with the team."

Not for: writing articles, facts about the topic, sales or search-engine data.

## Setup

`<skill>` below is the folder that contains this SKILL.md. Do not install anything in
advance: text analysis needs no packages. If a chart or report command says that
dependencies are not installed, run the command from its `hint` once, then rerun.

Always run scripts **from the user's working folder** with the full path
`node <skill>/scripts/...`: results are saved to `./wikipedia-interest-analysis-output/`
in the current folder. Downloaded data is cached, so refined questions are fast.

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
   - If no language is named, say that you can measure it with Wikipedia pageviews and
     ask which languages or markets to compare. Do not guess, and do not answer from
     general knowledge.
   - Use Wikipedia language codes: uk, pl, cs, de, en, es, fr, …
   - Name the topic as a concept in English ("English as a second or foreign
     language", not "learning English"). For a non-English name, add
     `--query-lang <code>`: `--topic "астрономія" --query-lang uk`.
2. **Run `run-analysis.js`.** Default period: last 3 years (full months).
3. **Check the topic.** If `data.topic.description` is not what the user most likely
   means (a car brand instead of a planet, a journal instead of a science), do not give
   the analysis yet: ask which meaning they want, naming the options in words from
   `data.alternatives` descriptions (no QIDs), then rerun with `--qid <id>`.
4. **Missing languages.** `data.topic.missing_langs` have no article about the topic.
   Say plainly that interest there cannot be measured with this topic. If
   `data.topic.broader_topics` has a topic for those languages, offer to measure it
   (`--qid <id>`) and say it measures the broader topic. Never ask the user to rephrase
   the question or to write in another language.
5. **Answer** using only numbers from the JSON (see below).
6. **Offer next steps**: a chart or a PDF report.

If the output says the run needs many requests (`estimated_requests`), tell the user the
number and ask whether to continue; only after "yes" rerun the same command with
`--confirm`.

## How to read the result

Each item in `data.results`:

| Field                  | Meaning                                                                    |
| ---------------------- | -------------------------------------------------------------------------- |
| `trend`                | `growing`, `declining` or `no_clear_trend` (statistical test)              |
| `trend_pct_per_year`   | trend slope over the whole period, % of the average level per year         |
| `yoy_growth_pct`       | last 12 months vs the previous 12 (normalized, spikes removed)             |
| `yoy_views_growth_pct` | the same for raw views (what pageviews.wmcloud.org shows)                  |
| `avg_monthly_views`    | average raw views per month                                                |
| `index_last_12m`       | last 12 months as an index, first 12 months of the period = 100            |
| `confidence`           | `high`, `medium` or `low`: how much to trust the trend                     |
| `flags`                | reasons for lower confidence (not levels); sentences in `data.limitations` |

- By default values are **normalized** by the whole language edition, so general
  Wikipedia traffic changes do not look like topic interest.
- `data.ranking` (2+ languages) orders languages by growth, low confidence last;
  `promising: true` means not low confidence, enough views and growth above the
  threshold. `data.ranking.highlights` names the largest audience, the fastest growth
  and decline, languages with no clear trend and with low confidence.

## How to answer

Default answer is **text**, entirely in the user's language (no words or sentences in
other languages; numbers in the user's format, for Ukrainian `−43,9%`). Article titles
exactly as in `article`.

1. The conclusion in 1–2 sentences, with the period from `assumptions.period`
   ("from September 2023 to August 2026").
   - `confidence: low`: start with "the data is too thin for a conclusion" and why; do
     not present percentages as growth or decline.
   - `trend: no_clear_trend`: say there is no clear trend; do not call
     `trend_pct_per_year` or `yoy_growth_pct` growth or decline.
2. Key numbers from the JSON. For 2+ languages, a table with exactly these columns:
   language, views/month, trend/yr, year over year, confidence.
3. Confidence: the value of `confidence`, stated plainly, with its reasons from
   `data.limitations`.
4. Limitations: every sentence of `data.limitations.general` (attention is not
   willingness to pay; only the main article; Wikipedia traffic fell) and every flag
   sentence.
5. What to check next (other signals, other languages, related topics).
6. End with: "I can build a chart or prepare a one-page PDF report."

Rules for every answer:

- Every number must be in the JSON. Do not compute differences, ratios or "X% less".
- Comparisons ("largest", "fastest decline") only from `data.ranking.highlights`.
- Do not explain causes that are not in the JSON; a guess may only appear as something
  "worth checking".
- Runs of the same period with different options (`--raw`, `--keep-spikes`) differ by
  method, not by time: never read their difference as acceleration or change. Say which
  options each number comes from.
- If you measured a broader topic, report the main topic first, then the broader one
  separately, saying it measures interest in the broader topic.

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

After a refinement, answer in the same format and only offer a chart or report.

## Charts and reports (only when the user asks)

```sh
node <skill>/scripts/render-chart.js --run <run_id>
node <skill>/scripts/build-report.js --run <run_id> --locale uk \
  --summary "<2-3 sentences with facts from the JSON, in the user's language>" \
  --question "<the user's question, short>" --next "<one sentence: what to check next>"
```

- `run_id` is in the output of `run-analysis.js`. Neither command downloads anything.
- Use the run that matches the user's question. If the last run is a side variant
  (`--raw`, `--keep-spikes`, another period) and the user did not ask for that variant,
  ask which one to show. Always say which variant the file shows (see `summary`).
- Give the user the full file path from `files`: in a terminal they see only the path.
- Do not open the chart image. Describe it with `data.shows` and numbers from the
  analysis JSON.
- Formats: charts are PNG; add `--format svg` only if the user asks for SVG. Reports are
  PDF only: if the user asks for Word, slides or another format, say plainly that only
  PDF is available and offer it.
- The PDF takes the table, chart, confidence, assumptions and limitations from the run.
  Only `--summary`, `--question` and `--next` come from you: facts from the JSON, no
  judgments like "the audience is gone"; reread them for typos. `--locale` (`en` or
  `uk`) sets the labels.
- If the report does not fit on one page, the error says so: shorten the texts as the
  `hint` says and run it again.

## Do not

- Do not invent or recalculate numbers: every number in your answer must be in the JSON.
- Do not draw conclusions without running the analysis.
- Do not hide low confidence or skip limitations.
- Do not create charts or PDFs unless the user asks.
- Do not read or change the skill's code; use `--help` of a script if unsure.
- Do not treat pageviews as sales, revenue or willingness to pay.

## Before you answer, check

- [ ] Every number is copied from the JSON output; comparisons come from `highlights`.
- [ ] The topic (`data.topic.description`) is what the user meant.
- [ ] The period is named; confidence is stated; low confidence comes first.
- [ ] All general limitations and flag limitations are mentioned; missing languages are
      reported.
- [ ] The whole answer is in the user's language and ends with the chart/report offer.

## Errors

Scripts print `{"ok": false, "error", "hint"}` and exit with 1 (input problem) or
2 (network/API problem). Follow the `hint`. For a network error, wait a minute and retry
once.

## More

- [references/cli.md](references/cli.md): every script and option.
- [references/methodology.md](references/methodology.md): metrics, confidence rules, flags.
- [references/examples.md](references/examples.md): example answers for each request type.
