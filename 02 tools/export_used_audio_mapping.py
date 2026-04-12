#!/usr/bin/env python3
"""
Export the currently used audio mapping for a unit as a simple XLSX workbook.

The workbook has two sheets:
1. 当前使用音频 - one row for each unique audio id referenced by content-manifest.json
2. 本地未使用候选 - local mp3 files not referenced by the current manifest
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import OrderedDict
from pathlib import Path
from typing import Any
from zipfile import ZIP_DEFLATED, ZipFile

import check_unit


ROOT = check_unit.ROOT
HEADERS = [
    "级别",
    "单元",
    "板块",
    "语音内容",
    "声音性别",
    "是否主文件",
    "沿用的原文件名",
    "复用时的新文件名",
    "使用来源",
    "是否建议保留",
    "备注",
]


def xml_escape(value: Any) -> str:
    text = str(value or "")
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def column_name(index: int) -> str:
    name = ""
    index += 1
    while index:
        index, rem = divmod(index - 1, 26)
        name = chr(65 + rem) + name
    return name


def sheet_xml(rows: list[list[Any]]) -> str:
    out = [
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">',
        "<sheetData>",
    ]
    for row_index, row in enumerate(rows, start=1):
        out.append(f'<row r="{row_index}">')
        for col_index, value in enumerate(row):
            cell_ref = f"{column_name(col_index)}{row_index}"
            out.append(
                f'<c r="{cell_ref}" t="inlineStr"><is><t>{xml_escape(value)}</t></is></c>'
            )
        out.append("</row>")
    out.extend(["</sheetData>", "</worksheet>"])
    return "\n".join(out)


def write_xlsx(path: Path, sheets: list[tuple[str, list[list[Any]]]]) -> None:
    workbook_sheets = []
    workbook_rels = []
    content_overrides = []

    for idx, (name, _) in enumerate(sheets, start=1):
        workbook_sheets.append(
            f'<sheet name="{xml_escape(name)}" sheetId="{idx}" r:id="rId{idx}"/>'
        )
        workbook_rels.append(
            f'<Relationship Id="rId{idx}" '
            'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" '
            f'Target="worksheets/sheet{idx}.xml"/>'
        )
        content_overrides.append(
            f'<Override PartName="/xl/worksheets/sheet{idx}.xml" '
            'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
        )

    workbook_xml = "\n".join([
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
        '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">',
        "<sheets>",
        *workbook_sheets,
        "</sheets>",
        "</workbook>",
    ])

    rels_xml = "\n".join([
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
        '<Relationship Id="rId1" '
        'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" '
        'Target="xl/workbook.xml"/>',
        "</Relationships>",
    ])

    workbook_rels_xml = "\n".join([
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
        *workbook_rels,
        "</Relationships>",
    ])

    content_types_xml = "\n".join([
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">',
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>',
        '<Default Extension="xml" ContentType="application/xml"/>',
        '<Override PartName="/xl/workbook.xml" '
        'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>',
        *content_overrides,
        "</Types>",
    ])

    with ZipFile(path, "w", compression=ZIP_DEFLATED) as zf:
        zf.writestr("[Content_Types].xml", content_types_xml)
        zf.writestr("_rels/.rels", rels_xml)
        zf.writestr("xl/workbook.xml", workbook_xml)
        zf.writestr("xl/_rels/workbook.xml.rels", workbook_rels_xml)
        for idx, (_, rows) in enumerate(sheets, start=1):
            zf.writestr(f"xl/worksheets/sheet{idx}.xml", sheet_xml(rows))


def section_from_content(content_id: str, audio_type: str) -> str:
    if "_vocab_" in content_id or content_id.startswith("b3_vocab_") or audio_type == "vocab":
        return "单词页"
    if "_dialog_" in content_id or "dialog_line" in content_id or audio_type == "dialogue_line_group":
        return "对话页"
    if "_adv_" in content_id or content_id.startswith("b3_noun_") or content_id.startswith("b3_struct_"):
        return "练习页进阶"
    return "练习页"


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", str(text or "").strip()).lower()


def load_mapping_rows(unit: str) -> list[dict[str, str]]:
    rows, _ = check_unit.read_mapping_rows_for_unit(unit)
    check_unit.apply_mapping_overrides(unit, rows)
    check_unit.apply_mapping_additions(unit, rows)
    return rows


def build_mapping_lookup(rows: list[dict[str, str]]) -> dict[str, dict[str, str]]:
    lookup: dict[str, dict[str, str]] = {}
    for row in rows:
        new_name = check_unit.strip_mp3(row.get("复用时的新文件名"))
        if new_name:
            lookup[new_name] = row
            lookup[f"sv_{new_name}"] = row
    return lookup


def collect_used_refs(content_items: list[dict[str, Any]]) -> OrderedDict[str, dict[str, Any]]:
    used: OrderedDict[str, dict[str, Any]] = OrderedDict()
    for content in content_items:
        refs = []
        if content.get("audioRef"):
            refs.append(content["audioRef"])
        refs.extend(content.get("audioRefs") or [])

        for ref in refs:
            if ref not in used:
                used[ref] = {
                    "contentIds": [],
                    "sourceTexts": [],
                    "audioTypes": [],
                }
            if content.get("contentId"):
                used[ref]["contentIds"].append(content["contentId"])
            if content.get("sourceText"):
                used[ref]["sourceTexts"].append(content["sourceText"])
            if content.get("audioType"):
                used[ref]["audioTypes"].append(content["audioType"])
    return used


def first(values: list[str]) -> str:
    return values[0] if values else ""


def compact(values: list[str], limit: int = 3) -> str:
    unique = []
    for value in values:
        if value and value not in unique:
            unique.append(value)
    if len(unique) <= limit:
        return "；".join(unique)
    return "；".join(unique[:limit]) + f"；另{len(unique) - limit}处"


def first_two_words(text: str) -> str:
    words = normalize_text(text).split()
    return " ".join(words[:2]) if len(words) >= 2 else ""


def article_audio_advice(
    ref: str,
    audio: dict[str, Any],
    mapping: dict[str, str],
    content_items: list[dict[str, Any]],
    full_phrase_sources: set[str],
) -> tuple[str | None, str]:
    source_text = normalize_text(mapping.get("语音内容") or audio.get("sourceText", ""))
    if source_text not in {"en", "ett"}:
        return None, ""

    group_users = [
        item for item in content_items
        if ref in (item.get("audioRefs") or [])
    ]
    if not group_users:
        return "否", "旧拆分音频；未被组合题引用，可清理"

    replaceable_phrases = []
    missing_phrases = []
    for item in group_users:
        phrase = first_two_words(item.get("sourceText", ""))
        if not phrase:
            continue
        if phrase in full_phrase_sources:
            replaceable_phrases.append(phrase)
        else:
            missing_phrases.append(phrase)

    replaceable_unique = sorted(set(replaceable_phrases))
    missing_unique = sorted(set(missing_phrases))
    if missing_unique:
        note = (
            f"旧拆分音频；仍被{len(group_users)}处组合题引用；"
            "完整连读音频接入后可删；"
            f"尚缺或未接入：{compact(missing_unique, limit=6)}"
        )
        return "待替换", note

    note = (
        f"旧拆分音频；{len(group_users)}处组合题已有完整连读可替代；"
        f"可替代项：{compact(replaceable_unique, limit=6)}"
    )
    return "替换后可删", note


def build_workbook_rows(unit: str) -> tuple[list[list[Any]], list[list[Any]]]:
    level, number = check_unit.parse_unit(unit)
    base = ROOT / "audio" / "sv" / f"{level}{number}" / f"unit{number}"
    audio_manifest = json.loads((base / "audio-manifest.json").read_text(encoding="utf-8"))
    content_manifest = json.loads((base / "content-manifest.json").read_text(encoding="utf-8"))
    audio_items = audio_manifest.get("items", [])
    content_items = content_manifest.get("items", [])
    audio_by_id = {item.get("audioId"): item for item in audio_items if item.get("audioId")}
    used_refs = collect_used_refs(content_items)
    mapping_lookup = build_mapping_lookup(load_mapping_rows(unit))
    full_phrase_sources = {
        normalize_text(item.get("sourceText", ""))
        for item in content_items
        if len(normalize_text(item.get("sourceText", "")).split()) == 2
        and item.get("audioRef")
    }

    used_rows = [HEADERS]
    for ref, usage in used_refs.items():
        audio = audio_by_id.get(ref, {})
        mapping = mapping_lookup.get(ref) or mapping_lookup.get(str(ref).replace("sv_", "", 1)) or {}
        content_id = first(usage["contentIds"])
        audio_type = first(usage["audioTypes"])
        source_text = mapping.get("语音内容") or first(usage["sourceTexts"]) or audio.get("sourceText", "")
        new_name = check_unit.strip_mp3(mapping.get("复用时的新文件名")) or str(ref).replace("sv_", "", 1)
        original_name = (
            check_unit.strip_mp3(mapping.get("沿用的原文件名"))
            or str(audio.get("reusedFromAudioId") or "").replace("sv_", "", 1)
        )
        is_primary = "是" if not original_name else ""
        reuse_same = "是" if original_name else ""
        section = mapping.get("板块") or section_from_content(content_id, audio_type)
        note_parts = []
        if original_name:
            note_parts.append("复用旧音频")
        if len(usage["contentIds"]) > 1:
            note_parts.append(f"被{len(set(usage['contentIds']))}个内容引用")
        suggested = "是"
        article_suggested, article_note = article_audio_advice(
            ref, audio, mapping, content_items, full_phrase_sources
        )
        if article_suggested:
            suggested = article_suggested
            note_parts.append(article_note)

        used_rows.append([
            level.upper(),
            number,
            section,
            source_text,
            mapping.get("声音性别", ""),
            is_primary,
            original_name,
            new_name,
            compact(usage["contentIds"]),
            suggested,
            "；".join(note_parts),
        ])

    local_mp3 = sorted(base.rglob("*.mp3"))
    local_stems = {path.stem: path for path in local_mp3}
    local_used_stems = {
        Path(str(audio_by_id[ref].get("filePath", "")).lstrip("/")).stem
        for ref in used_refs
        if ref in audio_by_id and str(audio_by_id[ref].get("filePath", "")).lstrip("/").startswith(f"audio/sv/{level}{number}/unit{number}/")
    }

    cleanup_rows = [HEADERS]
    for stem in sorted(set(local_stems) - local_used_stems):
        mapping = mapping_lookup.get(stem) or mapping_lookup.get(f"sv_{stem}") or {}
        original_name = check_unit.strip_mp3(mapping.get("沿用的原文件名"))
        cleanup_rows.append([
            level.upper(),
            number,
            mapping.get("板块") or local_stems[stem].parent.name,
            mapping.get("语音内容", ""),
            mapping.get("声音性别", ""),
            mapping.get("是否主文件", ""),
            original_name,
            stem,
            "本地文件未被当前 manifest 引用",
            "待确认",
            str(local_stems[stem].relative_to(ROOT)),
        ])

    return used_rows, cleanup_rows


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description="Export currently used audio mapping as XLSX.")
    parser.add_argument("--unit", default="b3", help="Unit id, for example b3.")
    parser.add_argument("--out", help="Output xlsx path.")
    args = parser.parse_args(argv)

    unit = args.unit.lower()
    out_path = Path(args.out) if args.out else ROOT / "01 音频整理" / f"{unit.upper()}_当前使用音频清单.xlsx"
    used_rows, cleanup_rows = build_workbook_rows(unit)
    write_xlsx(out_path, [
        ("当前使用音频", used_rows),
        ("本地未使用候选", cleanup_rows),
    ])

    print(f"Wrote: {out_path}")
    print(f"当前使用音频 rows: {len(used_rows) - 1}")
    print(f"本地未使用候选 rows: {len(cleanup_rows) - 1}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
