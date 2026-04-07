import httpx
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

async def crawl_website(url: str):

    async with httpx.AsyncClient(timeout=20, verify=False) as client:
     response = await client.get(url)

    html = response.text
    soup = BeautifulSoup(html, "html.parser")

    # -------------------
    # META TAGS
    # -------------------
    title = soup.title.string.strip() if soup.title else None

    description = None
    desc_tag = soup.find("meta", attrs={"name": "description"})
    if desc_tag:
        description = desc_tag.get("content")

    canonical = None
    canonical_tag = soup.find("link", rel="canonical")
    if canonical_tag:
        canonical = canonical_tag.get("href")

    headings = {
        "h1": [h.get_text(strip=True) for h in soup.find_all("h1")],
        "h2": [h.get_text(strip=True) for h in soup.find_all("h2")],
        "h3": [h.get_text(strip=True) for h in soup.find_all("h3")],
        "h4": [h.get_text(strip=True) for h in soup.find_all("h4")],
        "h5": [h.get_text(strip=True) for h in soup.find_all("h5")],
        "h6": [h.get_text(strip=True) for h in soup.find_all("h6")],
    }

    # -------------------
    # IMAGE AUDIT
    # -------------------
    images = soup.find_all("img")

    missing_alt = []
    image_list = []

    for img in images:
        src = img.get("src")
        alt = img.get("alt")

        if not alt:
            missing_alt.append(src)

        image_list.append({
            "src": src,
            "alt": alt
        })

    # -------------------
    # LINKS
    # -------------------
    internal_links = []
    external_links = []

    domain = urlparse(url).netloc

    for link in soup.find_all("a", href=True):
        href = link.get("href")
        full_url = urljoin(url, href)

        if domain in urlparse(full_url).netloc:
            internal_links.append(full_url)
        else:
            external_links.append(full_url)

    # -------------------
    # robots.txt
    # -------------------
    robots_url = urljoin(url, "/robots.txt")

    try:
        async with httpx.AsyncClient() as client:
           robots = await client.get(robots_url)
        robots_exists = robots.status_code == 200
    except:
        robots_exists = False

    # -------------------
    # sitemap.xml
    # -------------------
    sitemap_url = urljoin(url, "/sitemap.xml")

    try:
        async with httpx.AsyncClient() as client:
           sitemap = await client.get(sitemap_url)
        sitemap_exists = sitemap.status_code == 200
    except:
        sitemap_exists = False

    # -------------------
    # RENDER BLOCKING RESOURCES
    # -------------------
    scripts = soup.find_all("script")
    styles = soup.find_all("link", rel="stylesheet")

    render_blocking = {
        "scripts": len(scripts),
        "stylesheets": len(styles)
    }

    # -------------------
    # RAW DATA RESULT
    # -------------------
    data = {
        "meta": {
            "title": title,
            "description": description,
            "canonical": canonical,
            "headings": headings
        },

        "images": {
            "total": len(image_list),
            "missing_alt": missing_alt,
            "images": image_list
        },

        "links": {
            "internal": internal_links,
            "external": external_links
        },

        "technical": {
            "robots_txt": robots_exists,
            "sitemap_xml": sitemap_exists
        },

        "performance": render_blocking
    }

    return data