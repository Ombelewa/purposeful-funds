import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  score: number;
  showScore?: boolean;
}

export function getRiskLevel(score: number): "low" | "medium" | "high" | "critical" {
  if (score <= 30) return "low";
  if (score <= 60) return "medium";
  if (score <= 80) return "high";
  return "critical";
}

export function getRiskLabel(level: "low" | "medium" | "high" | "critical"): string {
  switch (level) {
    case "low": return "Low Risk";
    case "medium": return "Medium";
    case "high": return "High Risk";
    case "critical": return "Critical";
  }
}

export function RiskBadge({ score, showScore = true }: RiskBadgeProps) {
  const level = getRiskLevel(score);
  const label = getRiskLabel(level);

  return (
    <span className={cn(
      "risk-badge",
      level === "low" && "risk-low",
      level === "medium" && "risk-medium",
      level === "high" && "risk-high",
      level === "critical" && "risk-critical"
    )}>
      {showScore && <span className="font-mono">{score}</span>}
      <span>{label}</span>
    </span>
  );
}
