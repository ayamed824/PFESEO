from typing import Dict, Any


def score_technical(raw: Dict[str, Any]) -> (int, list):
    score = 0
    issues = []

    tech = raw.get("technical", {})
    perf = raw.get("performance", {})

    if tech.get("robots_txt"):
        score += 20
    else:
        issues.append("Missing robots.txt")

    if tech.get("sitemap_xml"):
        score += 20
    else:
        issues.append("Missing sitemap.xml")

    scripts = perf.get("scripts", 0)
    styles = perf.get("stylesheets", 0)

    if scripts < 20:
        score += 20
    else:
        issues.append("Too many render-blocking scripts")

    if styles < 10:
        score += 20
    else:
        issues.append("Too many stylesheets")

    if raw.get("meta", {}).get("canonical"):
        score += 20
    else:
        issues.append("Missing canonical tag")

    return min(score, 100), issues


def score_content(raw: Dict[str, Any]) -> (int, list):
    score = 0
    issues = []

    meta = raw.get("meta", {})
    headings = meta.get("headings", {})

    if meta.get("title"):
        score += 25
    else:
        issues.append("Missing title tag")

    if meta.get("description"):
        score += 25
    else:
        issues.append("Missing meta description")

    if len(headings.get("h1", [])) >= 1:
        score += 25
    else:
        issues.append("No H1 tag found")

    if len(headings.get("h2", [])) >= 1:
        score += 25
    else:
        issues.append("No H2 tags found")

    return min(score, 100), issues


def score_ux(raw: Dict[str, Any]) -> (int, list):
    issues = []
    images = raw.get("images", {})

    total = images.get("total", 0)
    missing_alt = len(images.get("missing_alt", []))

    if total == 0:
        return 0, ["No images found"]

    ratio = (total - missing_alt) / total

    if ratio > 0.9:
        score = 100
    elif ratio > 0.7:
        score = 80
    elif ratio > 0.5:
        score = 60
    else:
        score = 40
        issues.append("Many images missing alt text")

    return score, issues


def score_popularity(raw: Dict[str, Any]) -> (int, list):
    score = 0
    issues = []

    links = raw.get("links", {})
    internal = len(links.get("internal", []))
    external = len(links.get("external", []))

    if internal > 20:
        score += 50
    elif internal > 10:
        score += 30
    else:
        score += 10
        issues.append("Low internal linking")

    if external > 10:
        score += 50
    elif external > 5:
        score += 30
    else:
        score += 10
        issues.append("Low external backlinks")

    return min(score, 100), issues


# =============================
# MAIN FUNCTION
# =============================
def compute_scores(raw_data: Dict[str, Any]) -> Dict[str, Any]:

    tech_score, tech_issues = score_technical(raw_data)
    content_score, content_issues = score_content(raw_data)
    ux_score, ux_issues = score_ux(raw_data)
    pop_score, pop_issues = score_popularity(raw_data)

    global_score = round(
        (tech_score * 0.35) +
        (content_score * 0.30) +
        (ux_score * 0.20) +
        (pop_score * 0.15)
    )

    return {
        "global_score": global_score,

        # ✅ IMPORTANT FIX
        "categories": {
            "technical": tech_score,
            "content": content_score,
            "ux": ux_score,
            "popularity": pop_score
        },

        # ✅ ALL ISSUES MERGED
        "issues": (
            tech_issues +
            content_issues +
            ux_issues +
            pop_issues
        )
    }