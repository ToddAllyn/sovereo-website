# Site Plan: Aligning sovereo.com to the Positioning

How the site changes to match `POSITIONING.md`. Audit as of 23 September 2026.

## Where the site stands

The homepage, the SITREP, the Brief, the Reckoning, and the research standard already speak the new language: global intelligence, five domains, consequence first. The relocation framing survives in three places:

1. **The paid products.** The dossiers and advisory are sold as move products ("Talk your move through," residency routes first, "Aspiring expat" and "Active expat" lenses).
2. **Navigation and structure.** The site is organized around countries and tools only. There is no path in by life stage or by decision.
3. **US defaults in "global" tools.** The inflation calculator uses US price data only, currency erosion is measured only against the dollar, and the debt clock leads with the US.

Most other relocation mentions are fine as they are: data notes inside the Best-Fit tool, legal disclaimers, and the "we broker nothing, unlike relocation firms" contrast on the homepage.

## Proposed structure

Top navigation, five items plus the call to action:

| Nav item | What it holds |
|---|---|
| **Intelligence** | Daily SITREP, The Sovereo Brief, The Reckoning, Research Standard |
| **Your Stage** | Four life-stage hubs, in decision-value order: Pre-retirement, Retirement, Building, Launch |
| **Countries** | The Sovereo Index, Dossiers, World Map and Atlas, Best-Fit Countries, Capital and Enterprise |
| **Tools** | All free tools, grouped by domain (Income, Education, Health, Lifestyle, Legacy) |
| **Advisory** | One-to-one consultation |
| CTA | Get the free SITREP |

### New pages

- **Life-stage hubs (4).** Each one: the decisions this stage faces, the current macro events that touch them, the relevant tools and country lenses, and the latest SITREP and Brief items tagged to the stage. Pre-retirement first.
- **How Sovereo works.** One page on the method: event, mechanism, country exposure, life stage, choice, tradeoff, signal. Economics as the benchmark. Links to the research standard.
- **Domain hubs (5), later.** Income, Education, Health, Lifestyle, Legacy. Start as tool groupings on the Tools page; promote to pages once there is enough content per domain.

## Page by page

| Page | Action | Notes |
|---|---|---|
| `index.html` | Light edit | Add a "Your stage" section and the method line. Keep the rest. |
| `assets/site-nav.js` | Done | Dropdown nav in the structure above; grouped mobile menu; footer grouped by the same sections. Falls back to the compact menu whenever the full menu does not fit. |
| `Sovereo_Country_Reports.html` (Dossiers) | Reframe, needs decision | Replace "Aspiring expat / Active expat / Retiree / Legacy builder" lenses with the four life stages. Lead with "what this country means for your decisions" before residency routes. |
| `advisory.html` | Reframe, needs decision | From "talk your move through" to "talk your decision through." Moving becomes one topic among income, retirement, education, health, and legacy. |
| `contact.html` | Reframe | Follows the dossier decision. "Tell us where you are headed" becomes "tell us the decision you are facing." |
| `best-fit-countries.html` (was `Sovereo_Relocation_Diagnostic.html`) | Done: renamed, 301 redirects in place | Tool is already titled Best-Fit Countries. Rename to `best-fit-countries.html` with a 301 in `_redirects` so old links keep working. |
| `Sovereo_Scientific_Basis.html` | Light edit | Title says "Best-Fit Countries"; add the link to the five domains. |
| `free-tools.html` | Regroup | Group tools by domain. Retitle "Location decision" as a country decision among others. |
| `guides.html` | Light edit | "Guides to living, retiring, and moving your money across borders" becomes guides to decisions, with country guides as one shelf. |
| `inflation-calculator.html` | Globalize | Add official CPI series for the priority markets (UK, Canada, Australia, eurozone at minimum). |
| `currency-erosion.html` | Globalize | Let the reader pick the base currency, not only the US dollar. |
| `debt-clock.html` | Light edit | Done: removed "a site about moving abroad." Consider leading with the global ranking. |
| `retire-on-social-security.html` | Keep, add siblings | Good pre-retirement content. Add equivalents for the UK State Pension, Canada CPP and OAS, and Australia Age Pension. |
| `infographics.html`, `ig/great-relocation-2026.html` | Keep | Published social assets. Future infographics follow the new framing. |
| `sitrep/` archive | Keep | Published record. Do not edit. |
| `terms.html`, `privacy.html` | Keep | "Not relocation advice" stays in the disclaimer list. Check privacy against GDPR as the baseline. |

## Done in this pass

- Debt clock: "Why an intelligence site about moving abroad tracks this" replaced with a decision-first explanation.
- Infographics, dossier, contact, and advisory metadata: "relocation" removed from descriptions and schema where it described the business rather than a specific topic.

## Decisions made

1. **Dossiers.** Only the sales page changes. The PDFs stay as they are, so the page must not promise anything they do not contain.
2. **Advisory.** The call covers any major life decision. Done: advisory and consultation pages reframed.
3. **"The Great Relocation" infographic.** Keep.
4. **Atlas "Rank X of 192".** Correct as written.
5. **Rename the Best-Fit file.** Done.

## Sequence

1. Navigation (done), Your Stage page `life-stages.html` (done, one page for all four stages), homepage "Your stage" section, How Sovereo works page.
2. Pre-retirement hub, then Retirement, Building, Launch.
3. Dossier and advisory reframe (after decisions 1 and 2).
4. Tool regrouping and globalizing inflation and currency tools.
5. Pension siblings for the priority markets.
