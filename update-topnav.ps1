$content = Get-Content -Raw components/blueprint/top-nav.tsx

$content = $content -replace '<span>Export Report</span>', '<span>{t("exportReport")}</span>'

$content = $content -replace '<div className="font-semibold">All-in-One Full Report \(\.pdf\)</div>', '<div className="font-semibold">{t("allInOne")}</div>'
$content = $content -replace '<div className="text-\[10px\] text-slate-400">Everything combined in one file</div>', '<div className="text-[10px] text-slate-400">{t("allInOneDesc")}</div>'

$content = $content -replace '<div className="font-semibold">Guide & Roadmap \(\.pdf\)</div>', '<div className="font-semibold">{t("guideRoadmap")}</div>'
$content = $content -replace '<div className="text-\[10px\] text-slate-400">Step-by-step plan & timeline</div>', '<div className="text-[10px] text-slate-400">{t("guideRoadmapDesc")}</div>'

$content = $content -replace '<div className="font-semibold">Database & APIs \(\.pdf\)</div>', '<div className="font-semibold">{t("dbApi")}</div>'
$content = $content -replace '<div className="text-\[10px\] text-slate-400">Tables and REST endpoints</div>', '<div className="text-[10px] text-slate-400">{t("dbApiDesc")}</div>'

$content = $content -replace '<div className="font-semibold">Wireframe UI \(\.pdf\)</div>', '<div className="font-semibold">{t("wireframeUI")}</div>'
$content = $content -replace '<div className="text-\[10px\] text-slate-400">Design layout structures</div>', '<div className="text-[10px] text-slate-400">{t("wireframeUIDesc")}</div>'

$content = $content -replace '<div className="font-semibold">Chat History \(\.pdf\)</div>', '<div className="font-semibold">{t("chatHistory")}</div>'
$content = $content -replace '<div className="text-\[10px\] text-slate-400">Conversation thread only</div>', '<div className="text-[10px] text-slate-400">{t("chatHistoryDesc")}</div>'

$content = $content -replace 'RAW DATA FORMATS', '{t("rawData")}'
$content = $content -replace '<div className="font-semibold">Markdown \(\.md\)</div>', '<div className="font-semibold">{t("markdown")}</div>'
$content = $content -replace '<div className="font-semibold">Raw Architecture \(\.json\)</div>', '<div className="font-semibold">{t("rawJson")}</div>'

Set-Content -Path components/blueprint/top-nav.tsx -Value $content
