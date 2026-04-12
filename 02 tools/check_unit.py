#!/usr/bin/env python3
"""
Unit health checker for the Swedish study static site.

The checker is intentionally read-only. It validates page files, bank files,
manifests, audio file paths, and homepage links so content changes can be
reviewed before publishing.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import xml.etree.ElementTree as ET
from collections import Counter
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Iterable
from zipfile import ZipFile


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_UNITS = ("a1", "a2", "a3", "a4", "b1", "b2", "b3")
XLSX_NS = {"main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
MAPPING_SECTION_DIRS = {
    "单词页": "vocab",
    "对话页": "dialogue",
    "练习页": "question",
    "练习页进阶": "question",
}


@dataclass
class Finding:
    severity: str
    unit: str
    title: str
    detail: str = ""


@dataclass
class UnitReport:
    unit: str
    counts: dict[str, int] = field(default_factory=dict)
    findings: list[Finding] = field(default_factory=list)

    def add(self, severity: str, title: str, detail: str = "") -> None:
        self.findings.append(Finding(severity, self.unit, title, detail))


def parse_unit(raw: str) -> tuple[str, int]:
    match = re.fullmatch(r"([a-dA-D])(\d+)", raw.strip())
    if not match:
        raise ValueError(f"Invalid unit id: {raw!r}. Expected examples: a1, b3.")
    return match.group(1).lower(), int(match.group(2))


def rel(path: Path) -> str:
    try:
        return str(path.relative_to(ROOT))
    except ValueError:
        return str(path)


def load_json(path: Path) -> tuple[Any | None, str | None]:
    try:
        with path.open("r", encoding="utf-8") as fh:
            return json.load(fh), None
    except FileNotFoundError:
        return None, "file not found"
    except json.JSONDecodeError as exc:
        return None, f"invalid json: {exc}"


def manifest_items(raw: Any) -> list[dict[str, Any]]:
    if isinstance(raw, list):
        return [item for item in raw if isinstance(item, dict)]
    if isinstance(raw, dict) and isinstance(raw.get("items"), list):
        return [item for item in raw["items"] if isinstance(item, dict)]
    return []


def duplicates(values: Iterable[str]) -> list[str]:
    counter = Counter(values)
    return sorted(value for value, count in counter.items() if count > 1)


def sample(values: Iterable[Any], limit: int = 5) -> str:
    out = [str(value) for value in values if value is not None]
    if not out:
        return ""
    suffix = "" if len(out) <= limit else f" ... (+{len(out) - limit} more)"
    return " | ".join(out[:limit]) + suffix


def strip_mp3(value: Any) -> str:
    text = str(value or "").strip()
    return text[:-4] if text.lower().endswith(".mp3") else text


def col_to_idx(cell_ref: str) -> int:
    match = re.match(r"([A-Z]+)", cell_ref)
    if not match:
        return 0
    total = 0
    for char in match.group(1):
        total = total * 26 + ord(char) - 64
    return total - 1


def read_xlsx_first_sheet(path: Path) -> list[dict[str, str]]:
    with ZipFile(path) as archive:
        names = archive.namelist()
        shared_strings: list[str] = []
        if "xl/sharedStrings.xml" in names:
            shared_root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
            for item in shared_root.findall("main:si", XLSX_NS):
                shared_strings.append("".join(t.text or "" for t in item.findall(".//main:t", XLSX_NS)))

        sheet_name = "xl/worksheets/sheet1.xml"
        sheet_root = ET.fromstring(archive.read(sheet_name))
        raw_rows: list[list[str]] = []
        for row in sheet_root.findall("main:sheetData/main:row", XLSX_NS):
            values: list[str] = []
            for cell in row.findall("main:c", XLSX_NS):
                idx = col_to_idx(cell.attrib.get("r", "A1"))
                while len(values) < idx:
                    values.append("")

                cell_type = cell.attrib.get("t")
                if cell_type == "s":
                    value_node = cell.find("main:v", XLSX_NS)
                    text = shared_strings[int(value_node.text)] if value_node is not None and value_node.text else ""
                elif cell_type == "inlineStr":
                    text = "".join(node.text or "" for node in cell.findall(".//main:t", XLSX_NS))
                else:
                    value_node = cell.find("main:v", XLSX_NS)
                    text = value_node.text if value_node is not None and value_node.text is not None else ""
                values.append(text)
            raw_rows.append(values)

    if not raw_rows:
        return []

    headers = raw_rows[0]
    records: list[dict[str, str]] = []
    for row in raw_rows[1:]:
        padded = row + [""] * (len(headers) - len(row))
        records.append({header: value for header, value in zip(headers, padded) if header})
    return records


def mapping_path_for_unit(unit: str) -> Path | None:
    level, number = parse_unit(unit)
    candidates = [
        ROOT / "01 音频整理" / f"瑞典语学习-音频整理_{level.upper()}_unit{number}.xlsx",
        ROOT / "01 音频整理" / "瑞典语学习-音频整理.xlsx",
    ]
    return next((path for path in candidates if path.exists()), None)


def mapping_paths_for_unit(unit: str) -> list[Path]:
    level, number = parse_unit(unit)
    candidates = [
        ROOT / "01 音频整理" / f"瑞典语学习-音频整理_{level.upper()}_unit{number}.xlsx",
        ROOT / "01 音频整理" / "瑞典语学习-音频整理.xlsx",
    ]
    return [path for path in candidates if path.exists()]


def read_mapping_rows_for_unit(unit: str) -> tuple[list[dict[str, str]], list[Path]]:
    level, number = parse_unit(unit)
    unit_path = ROOT / "01 音频整理" / f"瑞典语学习-音频整理_{level.upper()}_unit{number}.xlsx"
    master_path = ROOT / "01 音频整理" / "瑞典语学习-音频整理.xlsx"

    def unit_rows(path: Path) -> list[dict[str, str]]:
        records = read_xlsx_first_sheet(path)
        return [
            row for row in records
            if str(row.get("级别", "")).strip().lower() == level
            and str(row.get("单元", "")).strip() in {str(number), f"{number}.0"}
        ]

    if master_path.exists():
        rows = unit_rows(master_path)
        if rows:
            return rows, [master_path]

    if unit_path.exists():
        return unit_rows(unit_path), [unit_path]

    return [], []


def mapping_override_path_for_unit(unit: str) -> Path:
    level, number = parse_unit(unit)
    return ROOT / "01 音频整理" / f"{level}{number}_unit{number}_mapping_overrides.json"


def mapping_additions_path_for_unit(unit: str) -> Path:
    level, number = parse_unit(unit)
    return ROOT / "01 音频整理" / f"{level}{number}_unit{number}_mapping_additions.json"


def load_mapping_additions(unit: str) -> list[dict[str, str]]:
    path = mapping_additions_path_for_unit(unit)
    raw, error = load_json(path)
    if error or not isinstance(raw, dict):
        return []

    rows = raw.get("rows")
    if not isinstance(rows, list):
        return []

    additions = []
    for row in rows:
        if not isinstance(row, dict):
            continue
        additions.append({
            "级别": str(row.get("level", "")),
            "单元": str(row.get("unit", "")),
            "板块": str(row.get("section", "")),
            "语音内容": str(row.get("sourceText", "")),
            "声音性别": str(row.get("voiceGender", "")),
            "是否主文件": "是" if row.get("isPrimary") else "",
            "沿用的原文件名": strip_mp3(row.get("originalFileName")),
            "复用时的新文件名": strip_mp3(row.get("newFileName")),
        })
    return additions


def apply_mapping_additions(unit: str, rows: list[dict[str, str]]) -> int:
    seen_new_names = {
        strip_mp3(row.get("复用时的新文件名"))
        for row in rows
        if strip_mp3(row.get("复用时的新文件名"))
    }
    applied = 0
    for row in load_mapping_additions(unit):
        new_name = strip_mp3(row.get("复用时的新文件名"))
        if new_name and new_name not in seen_new_names:
            rows.append(row)
            seen_new_names.add(new_name)
            applied += 1
    return applied


def load_mapping_overrides(unit: str) -> dict[str, dict[str, Any]]:
    path = mapping_override_path_for_unit(unit)
    raw, error = load_json(path)
    if error or not isinstance(raw, dict):
        return {}

    overrides: dict[str, dict[str, Any]] = {}
    rows = raw.get("rows")
    if not isinstance(rows, list):
        return overrides

    for row in rows:
        if not isinstance(row, dict):
            continue
        new_name = strip_mp3(row.get("newFileName"))
        if new_name:
            overrides[new_name] = row
    return overrides


def apply_mapping_overrides(unit: str, rows: list[dict[str, str]]) -> int:
    overrides = load_mapping_overrides(unit)
    applied = 0
    if not overrides:
        return applied

    for row in rows:
        new_name = strip_mp3(row.get("复用时的新文件名"))
        override = overrides.get(new_name)
        if not override:
            continue
        if "isPrimary" in override:
            row["是否主文件"] = "是" if override.get("isPrimary") else ""
            row["是否与当前沿用原文件一致"] = "" if override.get("isPrimary") else "是"
        if "originalFileName" in override:
            row["沿用的原文件名"] = strip_mp3(override.get("originalFileName"))
        if "newFileName" in override:
            row["复用时的新文件名"] = strip_mp3(override.get("newFileName"))
        applied += 1
    return applied


def expected_paths(unit: str) -> dict[str, Path]:
    level, number = parse_unit(unit)
    return {
        "learn": ROOT / f"sfi_{level}{number}_unit{number}.html",
        "practice": ROOT / f"sfi_practice_{level.upper()}_unit{number}.html",
        "bank": ROOT / f"{level}{number}_unit{number}_bank.js",
        "audio_manifest": ROOT / "audio" / "sv" / f"{level}{number}" / f"unit{number}" / "audio-manifest.json",
        "content_manifest": ROOT / "audio" / "sv" / f"{level}{number}" / f"unit{number}" / "content-manifest.json",
    }


def extract_bank_info(path: Path) -> dict[str, Any]:
    text = path.read_text(encoding="utf-8")
    ids = re.findall(r"\bid\s*:\s*['\"]([^'\"]+)['\"]", text)
    kinds = re.findall(r"\bkind\s*:\s*['\"]([^'\"]+)['\"]", text)
    unit_match = re.search(r"\bunit\s*:\s*['\"]([^'\"]+)['\"]", text)
    title_match = re.search(r"\b(?:unitTitle|title)\s*:\s*['\"]([^'\"]+)['\"]", text)
    global_match = re.search(r"window\.(UNIT_BANK_[A-D]\d+)\s*=", text)
    return {
        "ids": ids,
        "kinds": kinds,
        "declared_unit": unit_match.group(1) if unit_match else "",
        "title": title_match.group(1) if title_match else "",
        "global_name": global_match.group(1) if global_match else "",
    }


def collect_audio_refs(content_items: list[dict[str, Any]]) -> list[str]:
    refs: list[str] = []
    for item in content_items:
        audio_ref = item.get("audioRef")
        if isinstance(audio_ref, str) and audio_ref:
            refs.append(audio_ref)
        audio_refs = item.get("audioRefs")
        if isinstance(audio_refs, list):
            refs.extend(ref for ref in audio_refs if isinstance(ref, str) and ref)
    return refs


def check_unit(unit: str) -> UnitReport:
    level, number = parse_unit(unit)
    expected_unit_name = f"{level}{number}_unit{number}"
    expected_audio_prefix = f"audio/sv/{level}{number}/unit{number}/"
    paths = expected_paths(unit)
    report = UnitReport(unit)

    for label, path in paths.items():
        if not path.exists():
            report.add("ERROR", f"Missing {label} file", rel(path))

    bank_ids: list[str] = []
    if paths["bank"].exists():
        info = extract_bank_info(paths["bank"])
        bank_ids = info["ids"]
        report.counts["bank_ids"] = len(bank_ids)
        report.counts["bank_kinds"] = len(set(info["kinds"]))
        expected_global = f"UNIT_BANK_{level.upper()}{number}"
        if info["global_name"] != expected_global:
            report.add(
                "ERROR",
                "Bank global name mismatch",
                f"expected {expected_global}, found {info['global_name'] or 'none'}",
            )
        if info["declared_unit"] and info["declared_unit"].lower() != f"{level}{number}":
            report.add(
                "WARN",
                "Bank declared unit mismatch",
                f"expected {level}{number}, found {info['declared_unit']}",
            )
        dup_bank_ids = duplicates(bank_ids)
        if dup_bank_ids:
            report.add("ERROR", "Duplicate bank question ids", sample(dup_bank_ids))

    audio_raw, audio_error = load_json(paths["audio_manifest"])
    content_raw, content_error = load_json(paths["content_manifest"])

    if audio_error:
        report.add("ERROR", "Audio manifest cannot be read", f"{rel(paths['audio_manifest'])}: {audio_error}")
        audio_items: list[dict[str, Any]] = []
    else:
        audio_items = manifest_items(audio_raw)

    if content_error:
        report.add(
            "ERROR",
            "Content manifest cannot be read",
            f"{rel(paths['content_manifest'])}: {content_error}",
        )
        content_items: list[dict[str, Any]] = []
    else:
        content_items = manifest_items(content_raw)

    report.counts["audio_items"] = len(audio_items)
    report.counts["content_items"] = len(content_items)

    if isinstance(audio_raw, dict):
        declared_manifest_unit = str(audio_raw.get("unit") or "")
        accepted_manifest_units = {f"{level}{number}", expected_unit_name}
        if declared_manifest_unit and declared_manifest_unit not in accepted_manifest_units:
            report.add(
                "WARN",
                "Audio manifest unit label mismatch",
                f"expected one of {sorted(accepted_manifest_units)}, found {declared_manifest_unit}",
            )

    audio_ids = [str(item.get("audioId")) for item in audio_items if item.get("audioId")]
    content_ids = [str(item.get("contentId")) for item in content_items if item.get("contentId")]
    audio_id_set = set(audio_ids)
    content_id_set = set(content_ids)

    dup_audio_ids = duplicates(audio_ids)
    if dup_audio_ids:
        report.add("ERROR", "Duplicate audio ids", sample(dup_audio_ids))

    dup_content_ids = duplicates(content_ids)
    if dup_content_ids:
        report.add("ERROR", "Duplicate content ids", sample(dup_content_ids))

    no_content_id = [item for item in content_items if not item.get("contentId")]
    report.counts["content_without_id"] = len(no_content_id)
    if no_content_id:
        report.add(
            "WARN",
            "Content rows without contentId",
            f"{len(no_content_id)} rows cannot be addressed reliably by exercises",
        )

    missing_file_rows = []
    cross_unit_rows = []
    for item in audio_items:
        file_path = item.get("filePath")
        audio_id = item.get("audioId") or "missing-audioId"
        if not isinstance(file_path, str) or not file_path:
            report.add("ERROR", "Audio row without filePath", str(audio_id))
            continue
        clean_path = file_path.lstrip("/")
        if not (ROOT / clean_path).exists():
            missing_file_rows.append(f"{audio_id} -> {file_path}")
        if not clean_path.startswith(expected_audio_prefix):
            cross_unit_rows.append(f"{audio_id} -> {file_path}")

    report.counts["audio_missing_files"] = len(missing_file_rows)
    if missing_file_rows:
        report.add("ERROR", "Audio manifest points to missing mp3 files", sample(missing_file_rows))

    report.counts["audio_cross_unit_paths"] = len(cross_unit_rows)
    if cross_unit_rows:
        report.add(
            "WARN",
            "Audio manifest references files outside this unit folder",
            sample(cross_unit_rows),
        )

    audio_refs = collect_audio_refs(content_items)
    missing_refs = sorted(set(ref for ref in audio_refs if ref not in audio_id_set))
    report.counts["content_audio_refs"] = len(audio_refs)
    report.counts["content_missing_audio_refs"] = len(missing_refs)
    if missing_refs:
        report.add("ERROR", "Content manifest references unknown audio ids", sample(missing_refs))

    if bank_ids and content_items:
        missing_bank_content = sorted(set(bank_ids) - content_id_set)
        report.counts["bank_ids_without_content"] = len(missing_bank_content)
        if missing_bank_content:
            report.add(
                "WARN",
                "Bank question ids without matching contentId",
                sample(missing_bank_content),
            )

    check_audio_mapping(unit, report)

    return report


def check_audio_mapping(unit: str, report: UnitReport) -> None:
    mapping_paths = mapping_paths_for_unit(unit)
    if not mapping_paths:
        report.counts["mapping_rows"] = 0
        return

    try:
        unit_rows, used_paths = read_mapping_rows_for_unit(unit)
    except Exception as exc:
        report.add("ERROR", "Audio mapping file cannot be read", str(exc))
        return

    report.add("INFO", "Audio mapping source", " + ".join(rel(path) for path in used_paths))
    if not unit_rows:
        report.counts["mapping_rows"] = 0
        return

    level, number = parse_unit(unit)
    applied_overrides = apply_mapping_overrides(unit, unit_rows)
    report.counts["mapping_overrides_applied"] = applied_overrides
    report.counts["mapping_additions_applied"] = apply_mapping_additions(unit, unit_rows)

    report.counts["mapping_rows"] = len(unit_rows)
    primary_rows = [row for row in unit_rows if str(row.get("是否主文件", "")).strip() == "是"]
    reuse_rows = [row for row in unit_rows if str(row.get("是否主文件", "")).strip() != "是"]
    report.counts["mapping_primary_rows"] = len(primary_rows)
    report.counts["mapping_reuse_rows"] = len(reuse_rows)

    all_mp3 = {path.stem: path for path in (ROOT / "audio" / "sv").rglob("*.mp3")}
    local_root = ROOT / "audio" / "sv" / f"{level}{number}" / f"unit{number}"
    local_mp3 = {path.stem: path for path in local_root.rglob("*.mp3")} if local_root.exists() else {}

    rows_missing_new_name = []
    primary_missing = []
    reuse_missing_original = []
    reuse_new_exists = []
    expected_local_primary_names: set[str] = set()

    for row in unit_rows:
        section = str(row.get("板块", "")).strip()
        folder = MAPPING_SECTION_DIRS.get(section)
        new_name = strip_mp3(row.get("复用时的新文件名"))
        original_name = strip_mp3(row.get("沿用的原文件名"))
        is_primary = row in primary_rows

        if not new_name:
            rows_missing_new_name.append(row.get("语音内容"))
            continue

        if is_primary:
            expected_local_primary_names.add(new_name)
            if folder:
                expected_path = local_root / folder / f"{new_name}.mp3"
                if not expected_path.exists():
                    primary_missing.append(f"{new_name} ({section}: {row.get('语音内容')})")
            elif new_name not in local_mp3:
                primary_missing.append(f"{new_name} ({section}: {row.get('语音内容')})")
        else:
            if original_name and original_name not in all_mp3:
                reuse_missing_original.append(f"{original_name} for {new_name} ({row.get('语音内容')})")
            if new_name in local_mp3:
                reuse_new_exists.append(new_name)

    report.counts["mapping_missing_new_names"] = len(rows_missing_new_name)
    report.counts["mapping_primary_missing_files"] = len(primary_missing)
    report.counts["mapping_reuse_missing_originals"] = len(reuse_missing_original)
    report.counts["mapping_reuse_new_files_present"] = len(reuse_new_exists)

    if rows_missing_new_name:
        report.add("ERROR", "Audio mapping rows missing new file names", sample(rows_missing_new_name))
    if primary_missing:
        report.add("ERROR", "Primary mapped audio files missing from unit folder", sample(primary_missing))
    if reuse_missing_original:
        report.add("ERROR", "Reused mapped audio originals cannot be found", sample(reuse_missing_original))
    if reuse_new_exists:
        report.add(
            "INFO",
            "Reused mapped audio also exists in this unit folder",
            sample(reuse_new_exists),
        )

    local_unmapped = sorted(set(local_mp3) - expected_local_primary_names)
    report.counts["mapping_local_unmapped_files"] = len(local_unmapped)
    if local_unmapped:
        report.add(
            "WARN",
            "Unit folder has mp3 files not listed as primary in mapping",
            sample(local_unmapped),
        )


def check_homepage(units: list[str]) -> list[Finding]:
    findings: list[Finding] = []
    index_path = ROOT / "index.html"
    if not index_path.exists():
        findings.append(Finding("ERROR", "index", "Missing homepage", rel(index_path)))
        return findings

    text = index_path.read_text(encoding="utf-8")
    hrefs = re.findall(r"href=['\"]([^'\"]+)['\"]", text)
    for href in hrefs:
        if not href or href.startswith(("#", "http://", "https://", "mailto:", "tel:")):
            continue
        target = href.split("#", 1)[0].split("?", 1)[0]
        if not target:
            continue
        if not (ROOT / target).exists():
            findings.append(Finding("ERROR", "index", "Homepage link points to missing file", href))

    for unit in units:
        level, number = parse_unit(unit)
        learn_name = f"sfi_{level}{number}_unit{number}.html"
        practice_name = f"sfi_practice_{level.upper()}_unit{number}.html"
        if f'href="{learn_name}"' not in text and f"href='{learn_name}'" not in text:
            findings.append(Finding("WARN", "index", "Expected learn link not found", learn_name))
        if f'href="{practice_name}"' not in text and f"href='{practice_name}'" not in text:
            findings.append(Finding("WARN", "index", "Expected practice link not found", practice_name))

    return findings


def print_report(reports: list[UnitReport], homepage_findings: list[Finding]) -> None:
    print(f"Root: {ROOT}")
    print("")
    for report in reports:
        print(f"== {report.unit.upper()} ==")
        counts = ", ".join(f"{key}={value}" for key, value in sorted(report.counts.items()))
        print(f"Counts: {counts or 'n/a'}")
        if report.findings:
            for finding in report.findings:
                detail = f" - {finding.detail}" if finding.detail else ""
                print(f"[{finding.severity}] {finding.title}{detail}")
        else:
            print("[OK] No findings")
        print("")

    if homepage_findings:
        print("== INDEX ==")
        for finding in homepage_findings:
            detail = f" - {finding.detail}" if finding.detail else ""
            print(f"[{finding.severity}] {finding.title}{detail}")
        print("")

    all_findings = [finding for report in reports for finding in report.findings] + homepage_findings
    summary = Counter(finding.severity for finding in all_findings)
    print("== SUMMARY ==")
    print(
        f"ERROR={summary.get('ERROR', 0)}, "
        f"WARN={summary.get('WARN', 0)}, "
        f"INFO={summary.get('INFO', 0)}"
    )


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description="Check SFI unit structure and audio manifests.")
    parser.add_argument(
        "--unit",
        action="append",
        help="Unit id to check, for example --unit b3. Can be repeated.",
    )
    parser.add_argument(
        "--skip-index",
        action="store_true",
        help="Skip homepage link checks.",
    )
    args = parser.parse_args(argv)

    units = [unit.lower() for unit in (args.unit or DEFAULT_UNITS)]
    for unit in units:
        parse_unit(unit)

    reports = [check_unit(unit) for unit in units]
    homepage_findings = [] if args.skip_index else check_homepage(units)
    print_report(reports, homepage_findings)

    all_findings = [finding for report in reports for finding in report.findings] + homepage_findings
    return 1 if any(finding.severity == "ERROR" for finding in all_findings) else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
