import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "OpsConductor — AI Agent Orchestration for Revenue Teams"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#080C14",
          color: "#E5E7EB",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(245,158,11,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.05) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            zIndex: 1,
          }}
        >
          {/* Icon */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              borderRadius: 16,
              border: "2px solid rgba(245,158,11,0.3)",
              backgroundColor: "rgba(245,158,11,0.1)",
              fontSize: 36,
            }}
          >
            ⚡
          </div>

          {/* Brand */}
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              letterSpacing: -1,
              color: "#F5F5F5",
            }}
          >
            OpsConductor
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#F59E0B",
              fontWeight: 500,
            }}
          >
            YOUR AGENTS RUN. YOU STAY IN CONTROL.
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 18,
              color: "#9CA3AF",
              maxWidth: 600,
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            The command center for AI agent orchestration.
            Approve, monitor, and audit every autonomous action.
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, transparent, #F59E0B, transparent)",
          }}
        />
      </div>
    ),
    { ...size }
  )
}
