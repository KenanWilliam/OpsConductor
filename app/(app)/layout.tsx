import { AppSidebar } from "@/components/app-sidebar"
import { CommandPalette } from "@/components/command-palette"
import { NotificationBell } from "@/components/notification-bell"
import { WorkspaceProvider } from "@/lib/hooks/use-workspace"
import { TutorialOverlayClient } from "@/components/onboarding/TutorialOverlayClient"
import { Toaster } from "sonner"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <WorkspaceProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top bar with notification bell */}
          <div className="flex h-12 shrink-0 items-center justify-end border-b border-border-subtle bg-surface-1 px-4">
            <div className="flex items-center gap-2">
              <kbd className="hidden rounded border border-border-subtle bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-text-tertiary sm:inline-block">
                ⌘K
              </kbd>
              <NotificationBell />
            </div>
          </div>
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
        <CommandPalette />
        <TutorialOverlayClient />
      </div>
      <Toaster theme="dark" position="bottom-right" richColors />
    </WorkspaceProvider>
  )
}
