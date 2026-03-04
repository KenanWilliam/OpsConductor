import { Loader2 } from "lucide-react"

export default function AuditLoading() {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <Loader2 className="h-6 w-6 animate-spin text-text-tertiary" />
    </div>
  )
}
