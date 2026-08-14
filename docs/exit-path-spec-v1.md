# THE EXIT PATH
## Capital egress instrument, specification version 1

Companion instrument to the Reference Basket.
Publication: **Living**
Judgment layer: Decision Exposure Score (DES), domains 2 and 8.

This file is the source of record for the instrument. The public page is
`/exit-path.html`. Where the two disagree, this file governs and the page is
corrected.

---

## 1. WHAT THIS MEASURES

The Reference Basket answers what a dollar buys in a country.

The Exit Path answers whether the dollar comes back out.

Every competitor in this category covers entry. Visa routes, purchase costs, yields, incorporation steps. Almost nobody covers exit, because exit is where the failures are and failures do not sell relocation services.

The structural insight the instrument is built on: **egress failure is almost always caused at entry.** A registration not filed, a structure chosen for convenience, an account opened at the wrong institution. The consequence appears five to ten years later when the person tries to sell and leave, at which point it is irreversible.

The instrument's job is to surface those irreversible points before the money moves, not after.

---

## 2. STRUCTURE: SIX GATES

Sequential. Each gate is answered per jurisdiction, per asset class. Failing an earlier gate can block a later one even when the later rule is permissive.

### Gate 1. Entry registration
Was the inbound capital required to be registered with a central bank, investment authority, or tax authority at the moment of entry, and what does that registration confer?

Fixed questions:
- Is registration of foreign investment mandatory, voluntary, or absent?
- Which body registers it and under what instrument?
- What is the filing window, and is late filing curable or fatal?
- Does registration confer repatriation rights, and are those rights lost without it?
- Does the registration attach to the asset, the investor, or the transaction?
- Are real estate, operating business equity, and portfolio holdings treated differently?

**This is the single highest-value question in the instrument.** In several roster jurisdictions the right to repatriate is conferred by an entry filing that a buyer never hears about, because the person selling them the asset has no reason to mention it.

### Gate 2. Holding period compliance
What must be filed, annually and continuously, to preserve the ability to exit?

Fixed questions:
- Local tax residency trigger, in days and in any secondary test.
- Worldwide income reporting obligation once resident.
- Worldwide asset or net worth reporting obligation once resident.
- Annual foreign investment registration renewal or update requirement.
- Beneficial ownership register filing obligation.
- Consequence of a missed filing: penalty only, or loss of a right.

### Gate 3. Conversion
Can local currency be converted to dollars, at what rate, and under what limits?

Fixed questions:
- Is there a single official rate, a multiple rate regime, or a parallel market?
- Annual or per-transaction conversion limits for individuals and for entities.
- Documentation required to convert above threshold.
- Is prior authorisation required, and from whom?
- Practical time from request to settlement.
- Does the country appear on any Financial Action Task Force list, and is correspondent banking affected?

### Gate 4. Transfer
Can converted funds leave, and what is withheld on the way?

Fixed questions:
- Withholding rate on dividends, interest, royalties, and rental income paid to a non-resident.
- Applicable United States treaty rate and the procedure to claim it, including whether a residency certificate is required in advance.
- Is there a totalisation agreement covering social contributions? Where none exists, state the double contribution exposure explicitly.
- Cross-border payment reporting thresholds.
- Bank-level friction: documentation, wire limits, whether the receiving United States institution will accept the corridor.

### Gate 5. Disposal
What happens when the asset is sold?

Fixed questions:
- Capital gains treatment for a non-resident seller, rate and base.
- Is gain computed on gross proceeds or net of an indexed cost base?
- Notary, registry, or buyer-side withholding at closing, and whether it is final or creditable.
- Holding period affecting rate or exemption.
- Foreign buyer or foreign seller surcharge.
- Are sale proceeds subject to a separate repatriation authorisation distinct from Gate 4?
- Time from closing to funds available offshore.

### Gate 6. Severance
What happens when the person stops being a tax resident, or dies holding the asset?

Fixed questions:
- Is there an exit tax on unrealized gains at cessation of residency?
- Procedure and documentation to terminate tax residency, and whether a clearance certificate is required.
- Continuing source-country obligations after departure.
- Inheritance, estate, or succession tax on assets held by a non-resident.
- Forced heirship rules affecting disposition by will.
- Whether local law recognises a foreign trust or the United States estate structure the person already has.
- Bank account closure and final transfer friction.

---

## 3. THE UNITED STATES LAYER

Half the egress problem is on the American side and the relocation category almost never covers it, because it is unglamorous and it is the seller's least favourite subject.

Reported per structure, not per country:

- Foreign Bank Account Report filing threshold and scope.
- Foreign Account Tax Compliance Act reporting on specified foreign financial assets.
- Information return obligations for a United States person owning a foreign corporation, partnership, or disregarded entity, and the penalty exposure for late or missed filing.
- Passive Foreign Investment Company exposure. This is the trap that catches Americans who buy foreign mutual funds or certain foreign insurance wrappers, and the tax treatment is punitive.
- Controlled foreign corporation and global intangible low-taxed income exposure for an American who owns an operating business abroad.
- Foreign tax credit mechanics and where credit is denied, creating genuine double taxation.
- Whether the local entity form chosen at Gate 1 creates or avoids these obligations. It almost always creates them by accident.

**Design rule.** Every Gate 1 entry structure entry must state its United States reporting consequence in the same table row. Separating them is what causes the failure.

---

## 4. STATUS MARKING

Each gate, per jurisdiction, per asset class, carries one status:

- **Open.** No restriction beyond ordinary documentation.
- **Conditional.** Permitted subject to a filing, authorisation, or threshold that is obtainable.
- **Restricted.** Permitted but with a material cost, delay, or quantitative limit. State the cost.
- **Blocked.** Not permitted, or permitted only in circumstances the reader will not meet.
- **Unverified.** Could not be sourced to standard. Published as unverified, never inferred.

### Trap Points

Separate flag, and the instrument's headline output.

A **Trap Point** is any requirement that must be satisfied at an earlier gate to preserve a right at a later gate, where late compliance is not curable.

Trap Points publish as a standing list per jurisdiction, at the top of every country read, regardless of what else changed that week. They are the thing a reader forwards.

---

## 5. SOURCE REGISTER

### Cross-jurisdiction spine

- **International Monetary Fund, Annual Report on Exchange Arrangements and Exchange Restrictions.** The authoritative record of exchange and capital controls by country. Annual, narrative, written for central bankers. This is the single most underused document in the category. It answers Gates 3 and 4 for every country in the roster and almost nobody in the relocation space reads it.
- **Organisation for Economic Co-operation and Development, Foreign Direct Investment Regulatory Restrictiveness Index.** Sectoral foreign ownership limits. Covers Gate 1 partially.
- **World Bank Business Ready.** Firm lifecycle topics including business entry, taxation, dispute resolution, insolvency. National aggregate, annual. Useful as cross-check, never as sole authority for a specific rule.
- **Financial Action Task Force** public statements and increased-monitoring list. Drives correspondent banking friction at Gate 3.
- **Bilateral tax treaty texts and protocols**, from both the source country tax authority and the United States Treasury. Treaty rate claims must cite the article, not a summary table.
- **United States Internal Revenue Service** guidance for the United States layer. Statute and official guidance only.

### Per country, by gate

Every endpoint requires hand verification. Foreign exchange regimes change by circular, not by statute, and circulars do not announce themselves.

**COLOMBIA**
Gate 1: Banco de la República, international investment regime and foreign investment registration rules. Verify current resolution and the registration instrument.
Gate 2: DIAN. Migración Colombia for the residency trigger.
Gate 3: Banco de la República foreign exchange regime, authorised intermediary rules.
Gate 4: DIAN withholding schedule. Note there is no United States totalisation agreement, which creates double social contribution exposure for the self-employed.
Gate 5: DIAN capital gains regime. Notariado y Registro for closing withholding.
Gate 6: DIAN residency cessation. Ganancias ocasionales regime for inheritance. Civil code forced heirship.
Live watch: Constitutional Court rulings, currently material given the emergency regime and the wealth tax question.

**MEXICO**
Gate 1: Registro Nacional de Inversiones Extranjeras. Fideicomiso requirement for restricted-zone coastal and border property. This is a live Trap Point.
Gate 2: Servicio de Administración Tributaria. Instituto Nacional de Migración for residency.
Gate 3: Banco de México. No general exchange control, verify current cash and reporting thresholds.
Gate 4: SAT withholding schedule. United States treaty in force, verify current protocol.
Gate 5: SAT non-resident capital gains election, gross versus net basis. Notary withholding at closing. Verify current principal residence exemption conditions and whether a non-resident can claim it.
Gate 6: SAT residency cessation. State-level inheritance treatment.

**PORTUGAL**
Gate 1: European Union free movement of capital baseline. Banco de Portugal reporting for foreign direct investment positions.
Gate 2: Autoridade Tributária e Aduaneira. AIMA for residency. Verify current status of the incentivised resident regime, which has been rewritten.
Gate 3: Euro area, no conversion gate at the currency level. Documentation and anti-money-laundering friction only.
Gate 4: Autoridade Tributária withholding. United States treaty in force. Totalisation agreement exists, confirm scope.
Gate 5: Capital gains on property for a non-resident, verify current inclusion rate and whether the resident and non-resident treatment has converged.
Gate 6: Portuguese forced heirship applies to a resident's estate. European Union succession regulation permits election of national law by will. This is a Trap Point for anyone who does not execute the election.

**REMAINING ROSTER**
Same six gates, same source classes: central bank foreign exchange regulation, investment registration authority, tax authority, land or commercial registry, notary association, immigration authority, national gazette, and the treaty text. Panama and Ecuador are dollarised, which collapses Gate 3 but not Gate 4. Thailand's treatment of remitted foreign income has moved recently and requires verification before publication.

---

## 6. UPDATE TRIGGERS

The Exit Path does not run on a calendar. It runs on triggers, monitored weekly in the Class A slot alongside currency.

- Central bank foreign exchange circular or resolution.
- Capital control decree or emergency measure.
- Tax reform bill filed, passed, or struck down.
- Constitutional or supreme court ruling on a tax or exchange measure.
- Treaty protocol signed or ratified.
- Financial Action Task Force listing change.
- Investment registration rule change.
- Residency programme opened, amended, or closed.
- Annual Report on Exchange Arrangements and Exchange Restrictions annual release.

**Status discipline, carried from the Basket.** Announced, filed, passed, in force, struck down. A rule enters the Exit Path only when in force. Announcements are reported and flagged, never scored.

---

## 7. OUTPUT FORMATS

**Weekly.** Trigger events only. What moved, which gate, which jurisdiction, status.

**Country read, on the ten week rotation.** All six gates, all statuses, the standing Trap Point list, and the United States layer for the two or three structures most commonly used in that jurisdiction.

**The Exit Path table, quarterly.** All roster countries, six gates, status marked. One page. This is the artifact that gets forwarded and the one that will be screenshotted.

**Country Dossier integration.** The Exit Path section becomes a standing chapter in every Country Dossier. It is the chapter that justifies the price.

---

## 8. WHAT THIS INSTRUMENT MUST NOT DO

It states rules and sources them. It does not advise.

No structure recommendations. No entity selection guidance. No "you should register through" language. The output is what the rule is, where it is written, when it changed, and what it blocks.

That line is not caution. It is the position. Sovereo does not source deals, does not take fees on transactions, and does not advise on structures, which is exactly why its account of the rules can be trusted. An operator who sells offshore structures cannot publish a neutral account of when those structures backfire.

Every issue carries the standing line: this is a published account of rules in force, not legal or tax advice, and no reader should act on it without qualified counsel in both jurisdictions.

---

## 9. BUILD SEQUENCE

1. Pull the Annual Report on Exchange Arrangements and Exchange Restrictions entries for Mexico, Portugal, Colombia. Extract Gates 3 and 4 in full.
2. Source Gate 1 registration rules from each central bank or investment authority directly. Do not accept a secondary summary.
3. Source Gate 5 and Gate 6 from the tax authority statute.
4. Draft the United States layer once, structure by structure, not country by country.
5. Identify Trap Points. Expect three to six per jurisdiction. If you find none, the sourcing is incomplete.
6. Send the draft Trap Point list for each country to a qualified local practitioner for factual review before first publication. Pay for this. One wrong Trap Point costs more credibility than the whole instrument earns in a year.
7. Publish the Colombia read first. You live there, you can verify the practical friction personally, and the wealth tax and emergency regime make it the most consequential jurisdiction on the roster right now.

---

## 10. PUBLICATION STATE

Section 9 is the operating plan and is deliberately not carried to the public page.

The public page publishes the instrument itself: what it measures, the six gates and their fixed questions, the Trap Point definition, the status vocabulary, the United States layer, the source register, the update triggers, the output formats, and the non-advice position.

No gate status for any jurisdiction publishes until step 2 through step 6 are complete for that jurisdiction. Until then the roster publishes its build state only. Under the section 4 rule, a status is never inferred, so an unsourced cell publishes as **Unverified** or does not publish at all. Colombia is first, per step 7.
