#!/usr/bin/env python3
"""
Build preview audio/content manifests from the unit audio mapping table.

This script writes *.preview.json files only. It is designed as a review step
before replacing the live manifests used by the pages.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import OrderedDict
from pathlib import Path
from typing import Any

import check_unit


ROOT = check_unit.ROOT
SECTION_AUDIO_TYPE = {
    "单词页": "vocab",
    "对话页": "dialogue_line_group",
    "练习页": "question_prompt",
    "练习页进阶": "question_prompt",
}
SECTION_DIRS = check_unit.MAPPING_SECTION_DIRS


def audio_id(stem: str) -> str:
    stem = check_unit.strip_mp3(stem)
    return stem if stem.startswith("sv_") else f"sv_{stem}"


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"[^\w\sÅÄÖåäöÉéÜü-]", "", str(text), flags=re.UNICODE)).strip().lower()


def file_path_for_stem(stem: str, all_mp3: dict[str, Path]) -> str:
    path = all_mp3.get(check_unit.strip_mp3(stem))
    if not path:
        return ""
    return "/" + str(path.relative_to(ROOT))


def load_unit_mapping(unit: str) -> list[dict[str, str]]:
    rows, paths = check_unit.read_mapping_rows_for_unit(unit)
    if not paths:
        raise FileNotFoundError(f"No mapping file found for {unit}")

    check_unit.apply_mapping_overrides(unit, rows)
    check_unit.apply_mapping_additions(unit, rows)
    return rows


def add_unique(items: OrderedDict[str, dict[str, Any]], item: dict[str, Any]) -> None:
    key = item.get("audioId") or item.get("contentId") or json.dumps(item, ensure_ascii=False)
    if key not in items:
        items[key] = item


def build_audio_manifest(unit: str, rows: list[dict[str, str]]) -> tuple[dict[str, Any], list[str]]:
    level, number = check_unit.parse_unit(unit)
    local_root = ROOT / "audio" / "sv" / f"{level}{number}" / f"unit{number}"
    all_mp3 = {path.stem: path for path in (ROOT / "audio" / "sv").rglob("*.mp3")}
    audio_items: OrderedDict[str, dict[str, Any]] = OrderedDict()
    errors: list[str] = []

    for row in rows:
        section = str(row.get("板块", "")).strip()
        folder = SECTION_DIRS.get(section, "")
        source_text = str(row.get("语音内容", "")).strip()
        new_name = check_unit.strip_mp3(row.get("复用时的新文件名"))
        original_name = check_unit.strip_mp3(row.get("沿用的原文件名"))
        is_primary = str(row.get("是否主文件", "")).strip() == "是"

        if not new_name:
            errors.append(f"mapping row without new file name: {source_text}")
            continue

        if is_primary:
            actual_path = local_root / folder / f"{new_name}.mp3" if folder else all_mp3.get(new_name)
            if not actual_path or not actual_path.exists():
                errors.append(f"primary file missing: {new_name} ({source_text})")
                continue
            file_name = f"{new_name}.mp3"
            file_path = "/" + str(actual_path.relative_to(ROOT))
        else:
            actual_path = all_mp3.get(original_name)
            if not actual_path:
                errors.append(f"reused original missing: {original_name} for {new_name} ({source_text})")
                continue
            file_name = actual_path.name
            file_path = "/" + str(actual_path.relative_to(ROOT))

        base_item = {
            "audioId": audio_id(new_name),
            "sourceText": source_text,
            "fileName": file_name,
            "filePath": file_path,
            "status": "ready",
        }
        if not is_primary:
            base_item["reusedFromAudioId"] = audio_id(original_name)
        add_unique(audio_items, base_item)

        if not is_primary and original_name:
            add_unique(audio_items, {
                "audioId": audio_id(original_name),
                "sourceText": source_text,
                "fileName": file_name,
                "filePath": file_path,
                "status": "ready",
                "aliasFor": audio_id(new_name),
            })

    return {
        "unit": f"{level}{number}_unit{number}",
        "generatedBy": "02 tools/build_unit_audio_manifests.py",
        "items": list(audio_items.values()),
    }, errors


def build_mapping_content_rows(rows: list[dict[str, str]]) -> list[dict[str, Any]]:
    content: list[dict[str, Any]] = []
    dialogue_seen = set()

    for row in rows:
        section = str(row.get("板块", "")).strip()
        source_text = str(row.get("语音内容", "")).strip()
        new_name = check_unit.strip_mp3(row.get("复用时的新文件名"))
        if not new_name:
            continue

        content.append({
            "contentId": new_name,
            "audioType": SECTION_AUDIO_TYPE.get(section, "question_prompt"),
            "sourceText": source_text,
            "audioRef": audio_id(new_name),
        })

        dialogue_match = re.search(r"_dialog_(\d{3})_line_(\d{2})_", new_name)
        if dialogue_match:
            content_id = f"b3_dialog_line_{dialogue_match.group(1)}_{dialogue_match.group(2)}"
            if content_id not in dialogue_seen:
                content.append({
                    "contentId": content_id,
                    "audioType": "dialogue_line_group",
                    "sourceText": source_text,
                    "audioRef": audio_id(new_name),
                })
                dialogue_seen.add(content_id)

    return content


def parse_bank_items(unit: str) -> list[dict[str, str]]:
    level, number = check_unit.parse_unit(unit)
    path = ROOT / f"{level}{number}_unit{number}_bank.js"
    if not path.exists():
        return []

    items = []
    for line in path.read_text(encoding="utf-8").splitlines():
        if "{ id:" not in line:
            continue
        item: dict[str, str] = {}
        for field in ("id", "kind", "source", "labelScheme", "answer", "template"):
            match = re.search(rf"\b{field}\s*:\s*'([^']*)'", line)
            if match:
                item[field] = match.group(1)
        if item.get("id"):
            items.append(item)
    return items


def filled_template(template: str) -> str:
    text = re.sub(r"\{\{(.*?)\}\}", lambda match: match.group(1), template or "")
    text = text.replace(" | ", " ")
    return re.sub(r"\s+", " ", text).strip()


def template_slots(template: str) -> list[str]:
    return [match.strip() for match in re.findall(r"\{\{(.*?)\}\}", template or "") if match.strip()]


def refs_for_text(text: str, mapping_by_norm: dict[str, list[dict[str, str]]]) -> list[str]:
    key = normalize(text)
    direct = mapping_by_norm.get(key) or []
    if direct:
        return [audio_id(check_unit.strip_mp3(direct[0].get("复用时的新文件名"))) ]

    refs = []
    for token in re.findall(r"[\wÅÄÖåäöÉéÜü-]+", text, flags=re.UNICODE):
        matches = mapping_by_norm.get(normalize(token)) or []
        if matches:
            refs.append(audio_id(check_unit.strip_mp3(matches[0].get("复用时的新文件名"))))
    return refs


def refs_for_bank_item(item: dict[str, str], mapping_by_norm: dict[str, list[dict[str, str]]]) -> list[str]:
    if item.get("labelScheme") == "noun_forms":
        slots = template_slots(item.get("template", ""))
        if len(slots) >= 2:
            refs = refs_for_text(f"{slots[0]} {slots[1]}", mapping_by_norm)
            for slot in slots[2:]:
                refs.extend(refs_for_text(slot, mapping_by_norm))
            return refs

    source_text = item.get("answer") or filled_template(item.get("template", ""))
    refs = refs_for_text(source_text, mapping_by_norm)
    if not refs and item.get("template"):
        for slot in template_slots(item["template"]):
            refs.extend(refs_for_text(slot, mapping_by_norm))
    return refs


def build_bank_content_rows(unit: str, rows: list[dict[str, str]]) -> list[dict[str, Any]]:
    mapping_by_norm: dict[str, list[dict[str, str]]] = {}
    section_rank = {"练习页": 0, "练习页进阶": 1, "单词页": 2, "对话页": 3}
    for row in sorted(rows, key=lambda r: section_rank.get(str(r.get("板块", "")), 9)):
        key = normalize(str(row.get("语音内容", "")))
        if key:
            mapping_by_norm.setdefault(key, []).append(row)

    content = []
    for item in parse_bank_items(unit):
        source_text = item.get("answer") or filled_template(item.get("template", ""))
        refs = refs_for_bank_item(item, mapping_by_norm)

        if not refs:
            continue

        row = {
            "contentId": item["id"],
            "audioType": "question_prompt",
            "sourceText": source_text,
        }
        if len(refs) == 1:
            row["audioRef"] = refs[0]
        else:
            row["audioRefs"] = refs
        content.append(row)
    return content


def build_content_manifest(unit: str, rows: list[dict[str, str]]) -> dict[str, Any]:
    content_items: OrderedDict[str, dict[str, Any]] = OrderedDict()
    for item in build_mapping_content_rows(rows) + build_bank_content_rows(unit, rows):
        add_unique(content_items, item)
    return {
        "unit": unit,
        "generatedBy": "02 tools/build_unit_audio_manifests.py",
        "items": list(content_items.values()),
    }


def write_json(path: Path, data: Any) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description="Build preview manifests from an audio mapping table.")
    parser.add_argument("--unit", default="b3", help="Unit id, for example b3.")
    parser.add_argument("--write", action="store_true", help="Write preview files.")
    args = parser.parse_args(argv)

    unit = args.unit.lower()
    level, number = check_unit.parse_unit(unit)
    rows = load_unit_mapping(unit)
    audio_manifest, errors = build_audio_manifest(unit, rows)
    content_manifest = build_content_manifest(unit, rows)

    out_dir = ROOT / "audio" / "sv" / f"{level}{number}" / f"unit{number}"
    audio_path = out_dir / "audio-manifest.preview.json"
    content_path = out_dir / "content-manifest.preview.json"

    print(f"Unit: {unit}")
    print(f"Mapping rows: {len(rows)}")
    print(f"Audio items: {len(audio_manifest['items'])}")
    print(f"Content items: {len(content_manifest['items'])}")
    print(f"Errors: {len(errors)}")
    for err in errors[:20]:
        print(f"[ERROR] {err}")
    if len(errors) > 20:
        print(f"... (+{len(errors) - 20} more)")

    if args.write:
        write_json(audio_path, audio_manifest)
        write_json(content_path, content_manifest)
        print(f"Wrote: {audio_path.relative_to(ROOT)}")
        print(f"Wrote: {content_path.relative_to(ROOT)}")

    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
