# Sovereo Brief, 30-Day LinkedIn Campaign

Goal: 10 paid Brief subscribers in 30 days from a 2,700 follower network.
Price: $47 monthly, $470 annual (two months free), $750 founding.

This folder lives under a dotted directory so Cloudflare Pages does not deploy it.
Nothing here is public. A 404 rule in `_redirects` is the second layer.

---

## 1. The honest constraint, read this first

Nothing that sends LinkedIn messages can be automated with software. Bulk
connection and DM tools violate LinkedIn's terms and get accounts restricted,
and a restricted account ends this campaign permanently. Scraping follower
lists is the same problem.

So the automation here is split. The machine does everything except the click:

| Step | Who does it |
|---|---|
| Segment and score the list | Claude, from pasted profile text |
| Write every message, personalized, one at a time | Claude |
| Sequence, timing, follow-up reminders | Scheduled Routines |
| Track pipeline and score against the goal | `pipeline.py` |
| Draft the offer posts and objection replies | Claude |
| Paste and send | Todd, by hand, 25 minutes a day |

The daily human cost is about 25 minutes. Everything else is handled.

The second honest note: a first message that pitches a $47 a month
subscription to a cold reader converts near zero and burns the name
permanently. The sell happens on message two or three, after a real sample.
That is built into the sequences below. The A list is the exception, because
they have already engaged, and they get a shorter arc.

---

## 2. The math

Three tracks run at once. Built to yield 14 so that 10 lands.

**Track A, warm direct.** People who engaged a post, viewed the profile, or
already read the free SITREP, and who qualify on the rubric.
- List size: about 80
- Reply rate on personal, specific messages: 25 percent, so 20 replies
- Real conversations: 12
- Close rate on a conversation: 25 to 35 percent
- **Expect 3 to 4 sales**

**Track B, qualified followers, two step.** Followers whose title or bio
sit in a sector the current issue marks HIGH or MEDIUM, no engagement yet.
- List size: about 350, messaged at 20 a day across four weeks
- Reply rate: 12 percent, so 42 replies
- Take the sample issue: 60 percent of repliers, so 25
- Convert inside 30 days: 20 percent
- **Expect 5 sales**

**Track C, public offer posts.** Two offer posts a week for four weeks,
pointed at the Brief rather than the SITREP.
- Reaches the full 2,700 plus whatever travels
- **Expect 2 to 4 sales**

**Total: 10 to 13.** The floor, if reply rates land at the low end across all
three, is about 6. That is why the list is built to 430 and not to 100.

### Revenue, and why annual is the default ask

| Mix | Cash booked in year one |
|---|---|
| 10 monthly | $470 recurring, $564 if all hold twelve months |
| 6 monthly, 4 annual | $2,162 |
| 10 annual | $4,700 |
| 8 annual, 2 founding | $5,260 |

Same ten people, nine times the cash. So the offer leads with $470 annual and
treats $47 monthly as the fallback for someone who hesitates. Never open with
monthly. The two-months-free line does the work.

The top five names on the A list get one founding member ask at $750 instead.

### Volume safety

| Action | Daily cap | Weekly cap |
|---|---|---|
| Connection requests | 20 to 40 | 100 to 200 |
| DMs to existing connections | 25 | 125 |
| Follow-ups in a thread | 1 per person | 1 per person |

430 messages across 20 working days is about 22 a day. Inside the line.
Never exceed it to catch up on a missed day. Extend the calendar instead.

---

## 3. The four week calendar

**Week 1, build and open the warm track**
- Mon: profile rebuild (headline, About, Featured), so every DM lands on a page
  that sells. Featured order: free SITREP, Issue #009 sample, consultation.
- Mon to Fri: A list, 16 a day, opener only. No pitch.
- Two offer posts.
- Reply to every A list answer same day.

**Week 2, close the warm track, open the cold track**
- A list moves to sample and offer.
- B list opens, 20 a day.
- Two offer posts.
- First sales should land here. Expect 2 to 4.

**Week 3, depth**
- B list continues, 20 a day.
- A list non-responders get one close-out message, then stop.
- B list week 1 cohort hits the day 7 bridge.
- Two offer posts, one of them a client proof or track record post.

**Week 4, convert**
- B list week 1 and 2 cohorts hit the day 14 offer.
- Founding member ask to the top five.
- Two offer posts, the last one carrying a real deadline if one exists.
- Friday: score the campaign, decide whether to run a second lap.

---

## 4. The daily block, 25 minutes

1. Five minutes: open the three lists (profile viewers, new followers,
   post engagers). Paste the new names and their profile text into the session.
   Claude scores them and appends qualified ones to `tracker.csv`.
2. Ten minutes: Claude returns today's messages, each one personalized to its
   person. Paste and send, in order, one at a time.
3. Five minutes: substantive comments on four ideal-client posts. This is the
   quiet engine. It lifts post reach and surfaces tomorrow's warm names.
4. Five minutes: reply to every inbound DM. Same day, always.

Post once. One strong post a day, never two. Two posts split reach.

---

## 5. Files

| File | What it is |
|---|---|
| `positioning.md` | What Sovereo is. Read first. Every other file defers to it. |
| `hooks-current.md` | Live hooks by sector, rebuilt every issue. |
| `qualify.md` | The scoring rubric. Who goes on which list. |
| `notes.md` | Connection request notes, under the 300 character cap. |
| `messages.md` | Every message frame, by track and step. |
| `posts.md` | The eight offer posts and their hooks. |
| `objections.md` | Replies to the five objections that will come. |
| `tracker.csv` | The pipeline. One row per person. |
| `pipeline.py` | Scoreboard against the 10 sale goal. |

Run the scoreboard any time:

```
python3 .outreach/brief-30/pipeline.py
```

---

## 6. What gets measured

Replies and booked sales, not impressions. Check on Friday:

- Messages sent this week, against the 110 target
- Reply rate by track. If Track B is under 8 percent, the opener is wrong,
  not the list. Rewrite the first line, do not send more.
- Samples delivered
- Offers made
- Sales, and the annual to monthly split
- Free SITREP signups, which are the compounding asset even when the sale misses

If the campaign ends at 6 or 7 rather than 10, the shortfall is almost always
reply rate on Track B. The fix is the opener, and the opener is rewritten from
the replies that did land.
