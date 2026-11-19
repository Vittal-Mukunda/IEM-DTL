import Link from "next/link";
import { studyUpdates } from "@/lib/updates";
import { formatUpdateDate } from "./UpdateParts";

/**
 * One quiet line at the top of the study-material page pointing at the newest
 * upload batch, with a link to the full log. Same look as the line on
 * /resources. Add entries in src/lib/updates.ts.
 */
export default function LatestUpdates() {
  const latest = studyUpdates[0];
  if (!latest) return null;
  return (
    <p className="mb-6 text-sm text-text-muted">
      Latest: {latest.summary} ({formatUpdateDate(latest.date)}).{" "}
      <Link
        href="/resources/updates"
        className="font-medium text-primary hover:text-accent hover:underline"
      >
        View log &rarr;
      </Link>
    </p>
  );
}
