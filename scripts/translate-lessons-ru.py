#!/usr/bin/env python3
"""
Translates double-quoted string literals in lesson .ts files (EN→RU) via deep-translator.
Uses a small lexer so backticks inside normal strings (e.g. `application/json`) do not
disable translation for following strings — fixes the bug that left many list items in English.

Skips strings inside `...` template literals (including codeTemplate / code fields).
Skips python/ and git/ (hand-translated). Skips index.ts.

Usage: python3 scripts/translate-lessons-ru.py
"""
from __future__ import annotations

import re
import sys
import time
from pathlib import Path

from deep_translator import GoogleTranslator
from deep_translator.exceptions import TranslationNotFound

ROOT = Path(__file__).resolve().parents[1]
LESSONS_DIR = ROOT / "src/lib/accenture-training/lessons"
SKIP = {"index.ts"}

_translator = GoogleTranslator(source="en", target="ru")
DELAY = 0.05

HAND_DONE_PREFIXES = (
    "python/",
    "git/",
)


def translate_chunk(text: str) -> str:
    text = text.strip()
    if len(text) < 12 or not re.search(r"[a-zA-Z]{3,}", text):
        return text
    time.sleep(DELAY)
    try:
        r = _translator.translate(text)
        return (r or text).replace("\u00a0", " ")
    except TranslationNotFound:
        return text
    except Exception as e:
        print(f"    translate error: {e!r}", file=sys.stderr)
        return text


def cyrillic_ratio(s: str) -> float:
    cyr = len(re.findall(r"[\u0400-\u04FF]", s))
    lat = len(re.findall(r"[a-zA-Z]", s))
    if lat == 0:
        return 1.0 if cyr else 0.0
    return cyr / lat


def should_translate_decoded(decoded: str) -> bool:
    if len(decoded) < 12 or not re.search(r"[a-zA-Z]{3,}", decoded):
        return False
    if " " not in decoded and len(decoded) < 48:
        return False
    if re.fullmatch(r"[a-z0-9./@_+-]+", decoded, re.I):
        return False
    # Second pass: mostly-Russian strings need no work
    if cyrillic_ratio(decoded) >= 0.35 and len(re.findall(r"[a-zA-Z]{4,}", decoded)) < 3:
        return False
    return True


def decode_escapes(inner: str) -> str:
    return inner.replace("\\n", "\n").replace('\\"', '"').replace("\\\\", "\\")


def encode_escapes(inner: str) -> str:
    return inner.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")


def collect_double_quoted_segments(raw: str) -> list[tuple[int, int]]:
    """Return (start, end) exclusive end indices of double-quoted string literals, excluding those inside ``."""
    segments: list[tuple[int, int]] = []
    i = 0
    n = len(raw)
    state = "code"  # code | template | texpr | line_com | block_com

    def peek(k: int = 0) -> str:
        return raw[i + k] if i + k < n else ""

    while i < n:
        c = raw[i]
        nxt = peek(1)

        if state == "code":
            if c == "/" and nxt == "/":
                state = "line_com"
                i += 2
                continue
            if c == "/" and nxt == "*":
                state = "block_com"
                i += 2
                continue
            if c == '"':
                start = i
                i += 1
                while i < n:
                    cc = raw[i]
                    if cc == "\\":
                        i += 2
                        continue
                    if cc == '"':
                        segments.append((start, i + 1))
                        i += 1
                        break
                    i += 1
                continue
            if c == "`":
                state = "template"
                i += 1
                continue
            i += 1
            continue

        if state == "template":
            if c == "\\":
                i += 2
                continue
            if c == "`":
                state = "code"
                i += 1
                continue
            if c == "$" and nxt == "{":
                state = "texpr"
                brace = 1
                i += 2
                while i < n and brace > 0:
                    if raw[i] == "{":
                        brace += 1
                    elif raw[i] == "}":
                        brace -= 1
                    i += 1
                state = "template"
                continue
            i += 1
            continue

        if state == "line_com":
            if c in "\n\r":
                state = "code"
            i += 1
            continue

        if state == "block_com":
            if c == "*" and nxt == "/":
                state = "code"
                i += 2
                continue
            i += 1
            continue

        i += 1

    return segments


def process_file(path: Path) -> None:
    rel = path.relative_to(LESSONS_DIR).as_posix()
    if any(rel.startswith(p) for p in HAND_DONE_PREFIXES):
        print(f"skip hand-done: {rel}")
        return

    raw = path.read_text(encoding="utf-8")
    print(f"translate: {rel}")

    segments = collect_double_quoted_segments(raw)
    out: list[str] = []
    pos = 0
    for start, end in segments:
        out.append(raw[pos:start])
        inner_escaped = raw[start + 1 : end - 1]
        decoded = decode_escapes(inner_escaped)
        if not should_translate_decoded(decoded):
            out.append(raw[start:end])
        else:
            ru = translate_chunk(decoded)
            out.append('"' + encode_escapes(ru) + '"')
        pos = end
    out.append(raw[pos:])
    path.write_text("".join(out), encoding="utf-8")


def main() -> None:
    files = sorted(
        p for p in LESSONS_DIR.rglob("*.ts") if p.name not in SKIP and p.is_file()
    )
    for p in files:
        try:
            process_file(p)
        except Exception as e:
            print(f"FAIL {p}: {e}", file=sys.stderr)


if __name__ == "__main__":
    main()
