#!/usr/bin/env python3
"""
Regeneruje 12 problematycznych zdjęć AI z poprawionymi promptami.
Główne problemy do naprawy:
  - Zbyt wiele portretów samej twarzy bez kontekstu
  - Absurdalne pozy (człowiek siedzi na ziemi w garniturze na budowie)
  - Nieodpowiedni kontekst (maska chirurgiczna zamiast kontekstu budowlanego)
  - Selfie telefonem zamiast skanowania QR
"""

import json, sys, time, urllib.request, io
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
IMAGES_DIR   = PROJECT_ROOT / "public" / "images" / "blog"

STABLE_HORDE_API = "https://stablehorde.net/api/v2"
STABLE_HORDE_KEY = "0000000000"

# ─── Lista złych zdjęć z poprawionymi promptami ────────────────────────────────
# Klucz: nazwa pliku JPG
# Wartość: (positive_prompt, seed)
# WAŻNE: Promptuj SCENĘ, nie "portret twarzy"!

BAD_IMAGES = {
    # PROBLEM: sama twarz, brak kontekstu GWP/emisji CO2
    "gwp-obowiazkowe-cpr-2024.jpg": (
        "industrial factory with smokestacks carbon emissions europe, "
        "power plant aerial view, environmental sustainability, "
        "professional stock photo, natural lighting, sharp focus",
        501
    ),

    # PROBLEM: sama twarz z nienaturalnymi niebieskimi oczami
    "importer-obowiazki-cpr-2024.jpg": (
        "european cargo port with shipping containers and cranes, "
        "import logistics freight ship, aerial view harbour, "
        "professional stock photo, natural lighting, sharp focus",
        502
    ),

    # PROBLEM: sama twarz bez kontekstu listy kontrolnej
    "checklist-producenta-2026.jpg": (
        "caucasian european male engineer holding clipboard checklist "
        "standing at factory production line, quality control inspection, "
        "professional DSLR photo, natural lighting, sharp focus",
        503
    ),

    # PROBLEM: sama twarz, brak kontekstu małej firmy
    "mala-firma-cpr-2024.jpg": (
        "small european workshop craftsman working with tools at workbench, "
        "small business manufacturing, caucasian male artisan, "
        "professional DSLR photo, natural lighting, sharp focus",
        504
    ),

    # PROBLEM: sama twarz, brak kontekstu certyfikacji
    "certyfikacja-krok-po-kroku.jpg": (
        "caucasian european engineer at factory reviewing certification documents, "
        "quality control process step by step, professional office, "
        "professional DSLR photo, natural lighting, sharp focus",
        505
    ),

    # PROBLEM: sama twarz z profilu, nienaturalne oczy
    "nowe-normy-zharmonizowane-2026.jpg": (
        "caucasian european male engineer sitting at desk reading technical "
        "standards documents books, modern office, "
        "professional DSLR photo, natural lighting, sharp focus",
        506
    ),

    # PROBLEM: sama twarz, nienaturalne oczy, temat = zielone zamówienia
    "gpp-zielone-zamowienia-publicz.jpg": (
        "modern green sustainable building with solar panels europe, "
        "eco-friendly architecture construction, green technology, "
        "professional stock photo, natural lighting, sharp focus",
        507
    ),

    # PROBLEM: człowiek W GARNITURZE siedzi na ziemi na budowie (absurd!)
    "cpr-2024-pierwsze-tygodnie-sto.jpg": (
        "european construction workers with hard hats on construction site "
        "building new structure, team at work, scaffold building, "
        "professional DSLR photo, natural lighting, sharp focus",
        508
    ),

    # PROBLEM: człowiek trzyma ręce za głową na tle wody (absurd dla e-commerce!)
    "sprzedaz-online-cpr-2024.jpg": (
        "caucasian european businessman working at laptop computer "
        "online store e-commerce, modern office desk, professional attire, "
        "professional DSLR photo, natural lighting, sharp focus",
        509
    ),

    # PROBLEM: maska chirurgiczna + intensywne oczy = wygląda jak lekarz/covid
    "svhc-reach-dopc-cpr-2024.jpg": (
        "european laboratory researcher in safety goggles and lab coat "
        "testing building material chemical samples, lab equipment, "
        "professional DSLR photo, natural lighting, sharp focus",
        510
    ),

    # PROBLEM: mężczyzna robi selfie telefonem (nie = skanowanie QR kodu produktu)
    "qr-kod-unikalny-kod-produktu-c.jpg": (
        "european warehouse worker scanning product QR code barcode "
        "with handheld scanner, inventory management, storage shelves, "
        "professional DSLR photo, natural lighting, sharp focus",
        511
    ),

    # PROBLEM: sama twarz z kaskiem, brak kontekstu systemu oceny AVS/AVCP
    "avs-vs-avcp-nowy-system-oceny-.jpg": (
        "caucasian european engineer in hard hat and suit reviewing "
        "certification quality assessment documents at construction site, "
        "professional DSLR photo, natural lighting, sharp focus",
        512
    ),
}

NEGATIVE_PROMPT = (
    "asian, chinese, japanese, korean, arabic, indian, "
    "chinese characters, asian text, asian architecture, "
    "back view, headless, no face, turned away, "
    "cartoon, painting, illustration, blurry, low quality, "
    "watermark, text, logo, surgical mask, medical, "
    "female, woman, girl, selfie, hands behind head, "
    "sitting on ground, sitting on dirt, collage, split screen, "
    "nsfw, nude"
)


def stable_horde_generate(prompt, seed, timeout_s=300):
    """Generuje obraz AI przez Stable Horde. Zwraca bajty JPEG lub None."""
    try:
        from PIL import Image
    except ImportError:
        print("    ⚠️  Brak Pillow (pip3 install Pillow)")
        return None

    full_prompt = f"{prompt} ### {NEGATIVE_PROMPT}"

    payload = json.dumps({
        "prompt": full_prompt,
        "params": {
            "width": 512, "height": 512,
            "steps": 25, "n": 1,
            "sampler_name": "k_euler_a",
            "seed": str(seed),
        },
        "nsfw": False, "censor_nsfw": True,
        "models": ["stable_diffusion"],
    }).encode()

    req = urllib.request.Request(
        f"{STABLE_HORDE_API}/generate/async", data=payload,
        headers={
            "Content-Type": "application/json",
            "apikey": STABLE_HORDE_KEY,
            "Client-Agent": "nowycpr:2:admin",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            resp = json.loads(r.read())
            job_id = resp["id"]
            print(f"    ✔ Job ID: {job_id}")
    except Exception as e:
        print(f"    ⚠️  Stable Horde start błąd: {e}")
        return None

    # Czekaj na wynik
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        time.sleep(8)
        try:
            chk = urllib.request.Request(
                f"{STABLE_HORDE_API}/generate/check/{job_id}",
                headers={"apikey": STABLE_HORDE_KEY, "Client-Agent": "nowycpr:2:admin"},
            )
            with urllib.request.urlopen(chk, timeout=10) as r:
                status = json.loads(r.read())
            if status.get("done"):
                print(f"    ✔ Gotowe!")
                break
            wait = status.get("wait_time", "?")
            print(f"    ⏳ Czekam ~{wait}s...")
        except Exception:
            pass
    else:
        print("    ⚠️  Timeout")
        return None

    # Pobierz URL obrazu
    try:
        res = urllib.request.Request(
            f"{STABLE_HORDE_API}/generate/status/{job_id}",
            headers={"apikey": STABLE_HORDE_KEY, "Client-Agent": "nowycpr:2:admin"},
        )
        with urllib.request.urlopen(res, timeout=10) as r:
            img_url = json.loads(r.read())["generations"][0]["img"]
    except Exception as e:
        print(f"    ⚠️  Status błąd: {e}")
        return None

    # Pobierz i konwertuj na JPEG 800×534
    try:
        dl = urllib.request.Request(img_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(dl, timeout=20) as r:
            raw = r.read()
        img = Image.open(io.BytesIO(raw)).convert("RGB").resize((800, 534), Image.LANCZOS)
        buf = io.BytesIO()
        img.save(buf, "JPEG", quality=88)
        return buf.getvalue()
    except Exception as e:
        print(f"    ⚠️  Konwersja błąd: {e}")
        return None


def main():
    print("🔧 Regeneracja 12 problematycznych zdjęć\n")
    print(f"📁 Cel: {IMAGES_DIR}\n")

    total = len(BAD_IMAGES)
    success = 0
    failed = []

    for i, (filename, (prompt, seed)) in enumerate(BAD_IMAGES.items(), 1):
        dest_path = IMAGES_DIR / filename
        print(f"[{i}/{total}] {filename}")
        print(f"  Prompt: \"{prompt[:80]}...\"")
        print(f"  Seed: {seed}")

        img_bytes = stable_horde_generate(prompt, seed)
        if img_bytes:
            dest_path.write_bytes(img_bytes)
            size_kb = len(img_bytes) // 1024
            print(f"  💾 Zapisano: {size_kb} KB ✅")
            success += 1
        else:
            print(f"  ❌ Błąd generowania!")
            failed.append(filename)

        print()
        time.sleep(3)

    print(f"\n{'='*50}")
    print(f"✅ Sukces: {success}/{total}")
    if failed:
        print(f"❌ Nieudane: {', '.join(failed)}")
    print(f"\n💡 Zatwierdź zmiany: git add public/images/blog/ && git commit -m 'fix: regeneracja 12 złych zdjęć AI'")


if __name__ == "__main__":
    main()
