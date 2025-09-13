import json, time, random, urllib.parse, requests

UA = "ProyectoEducativo/1.0 (contacto: tu_email@dominio.com)"
TARGET = 100
SLEEP = 0.2

CATS = [
    "Categoría:Tecnología_de_la_información",
    "Categoría:Informática",
    "Categoría:Telecomunicaciones",
    "Categoría:Inteligencia_artificial",
    "Categoría:Ciberseguridad",
    "Categoría:Ingeniería_de_software",
    "Categoría:Redes_informáticas",
    "Categoría:Bases_de_datos",
]

def w_get(url, params=None):
    r = requests.get(url, params=params, headers={"User-Agent": UA, "Accept-Language": "es"}, timeout=20)
    r.raise_for_status()
    return r

def get_members(cat):
    url = "https://es.wikipedia.org/w/api.php"
    params = {
        "action": "query", "list": "categorymembers",
        "cmtitle": cat, "cmlimit": "200", "cmtype": "page", "format": "json"
    }
    data = w_get(url, params=params).json()
    return [it["title"] for it in data["query"]["categorymembers"] if it["ns"] == 0 and ":" not in it["title"]]

def get_summary(title):
    safe = urllib.parse.quote(title)
    url = f"https://es.wikipedia.org/api/rest_v1/page/summary/{safe}"
    r = w_get(url)
    if r.status_code != 200: return None
    d = r.json()
    txt = (d.get("extract") or "").strip()
    if not txt: return None
    # solo la primera frase
    short = txt.split(". ")[0].strip().rstrip(".") + "."
    return {
        "palabra": title,
        "significado": short,
        "fuente": d.get("content_urls", {}).get("desktop", {}).get("page")
    }

def main():
    titles = []
    for cat in CATS:
        titles.extend(get_members(cat))
    random.shuffle(titles)

    out = []
    for t in titles:
        if len(out) >= TARGET: break
        try:
            item = get_summary(t)
            if item:
                out.append(item)
        except: pass
        time.sleep(SLEEP)

    with open("tecnologia_diccionario.json", "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

    print(f"✅ Guardadas {len(out)} definiciones en tecnologia_diccionario.json")

if __name__ == "__main__":
    main()
