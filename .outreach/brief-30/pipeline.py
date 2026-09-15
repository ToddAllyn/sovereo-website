#!/usr/bin/env python3
"""Scoreboard for the 30 day Brief campaign. Reads tracker.csv, scores against
the 10 sale goal, and says whether the current pace gets there.

Usage: python3 pipeline.py [path/to/tracker.csv]
"""
import csv
import os
import sys
from collections import Counter
from datetime import date, datetime

GOAL_SALES = 10
CAMPAIGN_START = date(2026, 9, 15)
CAMPAIGN_DAYS = 30
PRICE = {"monthly": 47, "annual": 470, "founding": 750}
ANNUALIZED = {"monthly": 47 * 12, "annual": 470, "founding": 750}

# Message targets from README section 2
TARGET_SENT = {"A": 80, "B": 350}  # C and D are opportunistic, no cap

STATUSES = [
    "NEW", "QUEUED", "SENT_1", "REPLIED", "QUALIFIED",
    "SAMPLE_SENT", "OFFER_MADE", "WON", "LOST", "NO_REPLY", "DNC",
]


def load(path):
    if not os.path.exists(path):
        sys.exit("No tracker at %s" % path)
    with open(path, newline="", encoding="utf-8") as fh:
        rows = [r for r in csv.DictReader(fh)]
    return [r for r in rows if r.get("name") and not r["name"].startswith("EXAMPLE")]


def yes(v):
    return (v or "").strip().lower() in ("yes", "y", "true", "1")


def bar(n, total, width=28):
    if total <= 0:
        return " " * width
    filled = min(width, int(round(width * n / total)))
    return "#" * filled + "." * (width - filled)


def main():
    path = sys.argv[1] if len(sys.argv) > 1 else os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "tracker.csv")
    rows = load(path)

    today = date.today()
    elapsed = (today - CAMPAIGN_START).days
    elapsed = max(0, min(CAMPAIGN_DAYS, elapsed))
    left = CAMPAIGN_DAYS - elapsed

    status = Counter((r.get("status") or "NEW").strip().upper() for r in rows)
    track = Counter((r.get("track") or "?").strip().upper() for r in rows)
    sent = Counter((r.get("track") or "?").strip().upper()
                   for r in rows if (r.get("msg1_date") or "").strip())
    replies = Counter((r.get("track") or "?").strip().upper()
                      for r in rows if yes(r.get("replied")))

    wins = [r for r in rows if (r.get("status") or "").strip().upper() == "WON"]
    plans = Counter((r.get("plan") or "unknown").strip().lower() for r in wins)
    cash = sum(PRICE.get(p, 0) * n for p, n in plans.items())
    annual = sum(ANNUALIZED.get(p, 0) * n for p, n in plans.items())

    total_sent = sum(sent.values())
    total_replies = sum(replies.values())
    offers = sum(1 for r in rows if yes(r.get("offer_made")))
    samples = sum(1 for r in rows if yes(r.get("sample_sent")))

    print()
    print("  SOVEREO BRIEF, 30 DAY LINKEDIN CAMPAIGN")
    print("  day %d of %d, %d days left" % (elapsed, CAMPAIGN_DAYS, left))
    print("  " + "-" * 52)
    print()

    print("  SALES   %2d of %2d   [%s]" % (len(wins), GOAL_SALES, bar(len(wins), GOAL_SALES)))
    print("          cash booked $%s, annualized $%s" % (f"{cash:,}", f"{annual:,}"))
    if plans:
        print("          " + ", ".join("%s x%d" % (p, n) for p, n in sorted(plans.items())))
    print()

    print("  FUNNEL")
    stages = [
        ("on list", len(rows)),
        ("messaged", total_sent),
        ("replied", total_replies),
        ("sample sent", samples),
        ("offer made", offers),
        ("won", len(wins)),
    ]
    top = max((n for _, n in stages), default=1) or 1
    for label, n in stages:
        print("    %-12s %4d  %s" % (label, n, bar(n, top)))
    print()

    if total_sent:
        print("  RATES")
        print("    reply rate        %5.1f%%   (healthy: A 25%%, B 12%%)" %
              (100.0 * total_replies / total_sent))
        if total_replies:
            print("    reply to offer    %5.1f%%" % (100.0 * offers / total_replies))
        if offers:
            print("    offer to close    %5.1f%%   (healthy: 25 to 35%%)" %
                  (100.0 * len(wins) / offers))
        print("    messaged to won   %5.1f%%" % (100.0 * len(wins) / total_sent))
        print()

    print("  BY TRACK")
    print("    %-6s %6s %6s %7s %6s %6s" % ("track", "list", "sent", "target", "repl", "won"))
    for t in sorted(set(list(track) + list(TARGET_SENT))):
        w = sum(1 for r in rows if (r.get("track") or "").strip().upper() == t
                and (r.get("status") or "").strip().upper() == "WON")
        print("    %-6s %6d %6d %7s %6d %6d" % (
            t, track.get(t, 0), sent.get(t, 0),
            TARGET_SENT.get(t, "-"), replies.get(t, 0), w))
    print()

    print("  STATUS")
    for s in STATUSES:
        if status.get(s):
            print("    %-12s %4d" % (s, status[s]))
    unknown = {k: v for k, v in status.items() if k not in STATUSES}
    for k, v in sorted(unknown.items()):
        print("    %-12s %4d  <- not a known status, fix the row" % (k, v))
    print()

    # Pace
    print("  PACE")
    need = GOAL_SALES - len(wins)
    if need <= 0:
        print("    Goal met. Decide whether to run a second lap or push annual upgrades.")
    elif left <= 0:
        print("    Campaign window closed at %d of %d. Score the reply rates above" % (len(wins), GOAL_SALES))
        print("    and rewrite the weakest opener before the next lap.")
    else:
        print("    %d sales needed in %d days." % (need, left))
        target_total = sum(TARGET_SENT.values())
        remaining_msgs = max(0, target_total - total_sent)
        workdays = max(1, int(left * 5 / 7))
        print("    %d messages left to send, about %d a day across %d working days."
              % (remaining_msgs, -(-remaining_msgs // workdays), workdays))
        if remaining_msgs / workdays > 25:
            print("    That is over the 25 a day safe cap. Extend the calendar, do not")
            print("    exceed the cap to catch up.")
        if total_sent >= 40 and total_replies / max(1, total_sent) < 0.08:
            print("    Reply rate is under 8 percent. The opener is wrong, not the list.")
            print("    Rewrite the first line before sending more.")
    print()


if __name__ == "__main__":
    main()
