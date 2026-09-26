# Methodology

How `analyze-interest.js` and `run-analysis.js` turn pageviews into conclusions.
All numbers below are the defaults in `lib/analysis/constants/`.

## Data

- Source: Wikimedia Pageviews API, `per-article` and `aggregate` endpoints, daily values,
  `agent=user` (bots and crawlers excluded by Wikimedia), `access=all-access` (desktop and
  mobile).
- Topic → articles: Wikidata search (`wbsearchentities`) picks the item, its sitelinks
  give the article title in each language. One main article per language.
- Period: the last 3 years by default, aligned to **full calendar months** (a partial
  first or last month would look like a drop).
- Days with no data count as 0 views. Months before the first month with views are
  dropped (the article did not exist yet or had another title).

## Metrics

| Metric                 | Definition                                                                                                                                                                                                                  |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Monthly views          | sum of daily views per calendar month                                                                                                                                                                                       |
| Normalized value       | article views per million views of the whole language edition in the same month; removes the growth or decline of Wikipedia itself                                                                                          |
| Spike days             | days above 2× the 29-day rolling median **and** with modified z-score > 3.5 (median absolute deviation, floored at √median and 1 view); replaced by the rolling median before the trend is measured                         |
| Trend direction        | seasonal Mann-Kendall test on monthly values (each calendar month compared only with the same month in other years, so school or holiday seasons are not a trend); `growing`/`declining` if p < 0.05, else `no_clear_trend` |
| `trend_pct_per_year`   | seasonal Sen's slope (median of same-month year-to-year changes) divided by the average level, in % per year                                                                                                                |
| `yoy_growth_pct`       | average of the last 12 months vs the previous 12 months, on the analyzed series (normalized, spikes removed); needs 24 months                                                                                               |
| `yoy_views_growth_pct` | the same on raw views with spikes; comparable to pageviews.wmcloud.org                                                                                                                                                      |
| `index_last_12m`       | average of the last 12 months, where the first 12 months = 100                                                                                                                                                              |
| `views_per_million`    | normalized value, average of the last 12 months                                                                                                                                                                             |

`--raw` switches the analyzed series to raw views, `--keep-spikes` keeps spike days.

## Robustness checks

- **Spikes:** the trend is measured with and without spike days.
- **Normalization:** the trend is measured on raw and normalized values.
- **Stability:** the trend is measured again with the start moved by 3, 6 and 12 months
  (only variants with at least 24 months left).

## Flags and confidence

| Flag                      | Rule                                                              | Effect |
| ------------------------- | ----------------------------------------------------------------- | ------ |
| `very_low_volume`         | < 50 views per month                                              | low    |
| `very_short_history`      | < 12 months of data                                               | low    |
| `spike_driven`            | trend with spikes is growing/declining, without spikes it differs | low    |
| `low_volume`              | 50–299 views per month                                            | medium |
| `short_history`           | 12–23 months of data                                              | medium |
| `late_start`              | no views in the first month of the period (created or renamed)    | medium |
| `spike_heavy`             | > 20% of views on spike days                                      | medium |
| `unstable_trend`          | direction changes when the start is moved                         | medium |
| `not_significant`         | p ≥ 0.05                                                          | medium |
| `raw_normalized_disagree` | raw and normalized directions differ                              | medium |

Confidence: **low** if any flag in the low group, **medium** if any other flag,
**high** if no flags. Every flag has a ready sentence in `data.limitations`.

## Ranking and "promising"

With 2+ languages, `data.ranking.order` sorts by `trend_pct_per_year` (highest first),
with low-confidence results last. A language is `promising` if confidence is not low,
average views per month ≥ `--min-monthly-views` (300) and growth (YoY, or the trend if
YoY is not available) ≥ `--min-growth` (0%).

## Known limitations

- Pageviews measure attention to one Wikipedia article, not demand, purchases or
  willingness to pay.
- Only the main article is counted. Related articles, other sites and search engines
  are not.
- Wikipedia traffic as a whole fell in 2025–2026 (AI answers in search, stricter bot
  filtering). Normalization offsets this only partly; compare languages with each other
  rather than reading absolute declines as lost interest.
- A renamed article loses the views under its old title (see `late_start`).
- Charts and PDFs use Noto Sans (Latin, Cyrillic, Greek). Titles in CJK, Arabic or
  Hebrew scripts may not render in the PDF.
