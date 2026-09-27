# Example answers

Numbers come from real runs on 2026-09-26. Yours will differ: always copy them from the
JSON output of your own run.

## Question: "Is interest in astronomy growing in Ukrainian Wikipedia? We are deciding on a course."

Command:

```sh
node <skill>/scripts/run-analysis.js --topic "astronomy" --langs uk
```

Answer (in the user's language, here Ukrainian):

> Ні, інтерес до астрономії в українській Вікіпедії спадає. Стаття «Астрономія» має
> в середньому 1650 переглядів на місяць. З поправкою на загальний трафік Вікіпедії тренд
> становить −43,9% на рік, а останні 12 місяців на 45,8% нижчі за попередні 12.
> Рівень довіри високий: тренд значущий, не залежить від окремих сплесків і не змінюється,
> якщо зсунути початок періоду.
>
> Обмеження: перегляди показують увагу до статті, а не готовність платити за курс;
> враховано лише основну статтю; у 2025–2026 роках трафік усієї Вікіпедії впав, і
> нормалізація компенсує це лише частково.
>
> Що перевірити далі: пов'язані теми (космос, телескопи), пошукові тренди, конкурентів.
> Можу побудувати графік або підготувати PDF-звіт.

## Comparison: "Compare interest in intermittent fasting in Polish and Czech Wikipedia over two years."

Command:

```sh
node <skill>/scripts/run-analysis.js --topic "intermittent fasting" --langs pl,cs --years 2
```

Answer:

> From September 2024 to August 2026 only Czech Wikipedia has an article about
> intermittent fasting ("Přerušovaný půst"). Polish Wikipedia has none, so interest in
> Polish cannot be measured with this topic; I can measure the broader topic "fasting",
> which has a Polish article.
>
> | Language | Views/month | Trend/yr | YoY    | Confidence |
> | -------- | ----------- | -------- | ------ | ---------- |
> | cs       | 289         | −42.5%   | −34.9% | medium     |
>
> In Czech, interest is declining. Confidence is medium: with about 290 views a month,
> percentages swing a lot. Limitations: pageviews show attention, not willingness to pay;
> only the main article counts.
>
> Next: check a related Polish article (for example about diets) or search trends in
> Poland. I can build a chart or prepare a one-page PDF report.

## Market choice: "Which audiences should we research next for learning English?"

Command (the topic named as a concept):

```sh
node <skill>/scripts/run-analysis.js --topic "English as a second or foreign language" --langs de,es,en,uk,pl
```

Answer:

> Interest is declining in every edition that has the article. Ranked by trend:
> German first (−17% a year, but only 102 views a month, medium confidence), then
> English (−29.5%, 8554 views a month, high confidence) and Spanish (−34.5%, 248 views,
> medium). No language is marked promising. Ukrainian and Polish have no article on this
> topic. For them I can measure the broader topic "English" (the language itself), but it
> shows interest in the language, not in learning it.
>
> Low view counts in German and Spanish make those percentages unreliable. All
> Wikipedia traffic fell in 2025–2026, so compare languages with each other rather than
> reading the decline as lost interest.
>
> Next: research the German and English-speaking audiences with other signals (search
> trends, surveys). I can build a chart or prepare a one-page PDF report.

## Refinement: "Add Slovak and look at 5 years."

```sh
node <skill>/scripts/run-analysis.js --topic "intermittent fasting" --langs pl,cs,sk --years 5
```

Answer in the same format as before. Only the new data is downloaded; mention it if the
user asks about speed.

## Chart: "Show it on a chart."

```sh
node <skill>/scripts/render-chart.js --run <run_id>
```

Give the full PNG path from `files`, the analysis variant from `summary` and one
sentence from `data.shows`, with numbers only from the analysis JSON. Do not open the
image. For SVG, add `--format svg`.

## Report: "Prepare a report for the team."

```sh
node <skill>/scripts/build-report.js --run <run_id> --locale uk \
  --question "Чи зростає інтерес до астрономії в українській Вікіпедії?" \
  --summary "З вересня 2023 по серпень 2026 інтерес до астрономії в українській Вікіпедії спадає: −43,9% на рік з поправкою на загальний трафік. Довіра висока." \
  --next "Перевірити пов'язані теми та пошукові тренди перед запуском курсу."
```

Reply with the full PDF path from `files`, the analysis variant and the 1–2 sentence
conclusion. Reports are PDF only; if the user asks for Word or slides, say so and offer
the PDF.

## Low confidence

When `confidence` is `low`, say it first:

> The data is too thin for a conclusion: the article gets about 40 views a month, so a
> few visits change the percentages a lot.
