import { CSSProperties } from "react";
import { Avatar, AvatarBadge } from "@chumlab/ui/avatar";

const BADGE_TONES = [
  { bg: "#e0e7ff", text: "#4f46e5", darkBg: "#312e81", darkText: "#a5b4fc" },
  { bg: "#ede9fe", text: "#7c3aed", darkBg: "#3b0764", darkText: "#c4b5fd" },
  { bg: "#cffafe", text: "#155e75", darkBg: "#164e63", darkText: "#67e8f9" },
  { bg: "#d1fae5", text: "#047857", darkBg: "#064e3b", darkText: "#6ee7b7" },
];

const badgeToneStyle = (i: number) => {
  const t = BADGE_TONES[i % BADGE_TONES.length];
  return {
    backgroundColor: t.bg,
    color: t.text,
    "--avatar-dark-bg": t.darkBg,
    "--avatar-dark-text": t.darkText,
  } as CSSProperties;
};

export default function AvatarExample() {
  return (
    <>
      {
        [
          { label: "count", props: { count: 5 } },
          { label: "max=99", props: { count: 150, max: 99 } },
          { label: "dot", props: { dot: true } },
          {
            label: "pulse",
            props: { dot: true, pulse: true, color: "#22c55e" }
          },
          {
            label: "outline",
            props: { count: 3, variant: "outline" as const }
          },
          {
            label: "soft",
            props: { count: 7, variant: "soft" as const }
          },
          { label: "showZero", props: { count: 0, showZero: true } }
        ].map(({ label, props }, i) => (
          <div key={label} className="text-center pt-2 pb-1">
            <div className="relative inline-flex">
              <Avatar name={label} style={badgeToneStyle(i)} />
              <AvatarBadge {...props} />
            </div>
            <p className="text-xs mt-3 text-xs font-medium text-cl-text-tertiary">
              {label}
            </p>
          </div>
        ))
      }
      {
        (["xs", "sm", "md", "lg"] as const).map((s, i) => (
          <div key={s} className="text-center pt-2 pb-1">
            <div className="relative inline-flex">
              <Avatar name={s} style={badgeToneStyle(i)} />
              <AvatarBadge count={3} size={s} />
            </div>
            <p className="text-xs mt-3 text-xs font-medium text-cl-text-tertiary">
              {s}
            </p>
          </div>
        ))
      }
      {
        (
          [
            { tone: "accent" as const, label: "accent (default)", count: 5 },
            { tone: "error" as const, label: "error", count: 5 },
            { tone: "accent" as const, label: "accent dot", dot: true },
            { tone: "error" as const, label: "error dot", dot: true }
          ]
        ).map(({ tone, label, count, dot }, i) => (
          <div key={label} className="text-center pt-2 pb-1">
            <div className="relative inline-flex">
              <Avatar name={label} style={badgeToneStyle(i)} />
              <AvatarBadge tone={tone} count={count} dot={dot} />
            </div>
            <p className="text-xs mt-3 text-xs font-medium text-cl-text-tertiary">
              {label}
            </p>
          </div>
        ))
      }
      {
        (
          [
            "top-end",
            "top-start",
            "bottom-end",
            "bottom-start"
          ] as const
        ).map((pos) => (
          <div key={pos} className="text-center pt-2 pb-1">
            <div className="relative inline-flex">
              <Avatar
                name={pos.slice(0, 2)}
                autoColor
                colors={
                  {
                    backgrounds: [
                      "#e0e7ff",
                      "#dbeafe",
                      "#d1fae5",
                      "#fef9c3",
                      "#fce7f3",
                      "#ede9fe",
                      "#cffafe",
                      "#fef2f2"
                    ],
                    text: [
                      "#4f46e5",
                      "#1d4ed8",
                      "#047857",
                      "#854d0e",
                      "#be185d",
                      "#7c3aed",
                      "#0e7490",
                      "#ef4444"
                    ]
                  }
                }
              />
              <AvatarBadge dot color="#22c55e" position={pos} />
            </div>
            <p className="text-xs mt-3 text-xs font-medium text-cl-text-tertiary">
              {pos}
            </p>
          </div>
        ))
      }
      <div className="text-center pt-2 pb-1">
        <div className="relative inline-flex">
          <Avatar
            name="Circ"
            autoColor
            colors={
              {
                backgrounds: [
                  "#e0e7ff",
                  "#dbeafe",
                  "#d1fae5",
                  "#fef9c3",
                  "#fce7f3",
                  "#ede9fe",
                  "#cffafe",
                  "#fef2f2"
                ],
                text: [
                  "#4f46e5",
                  "#1d4ed8",
                  "#047857",
                  "#854d0e",
                  "#be185d",
                  "#7c3aed",
                  "#0e7490",
                  "#ef4444"
                ]
              }
            }
          />
          <AvatarBadge count={2} overlap="circular" />
        </div>
        <p className="text-xs mt-3 text-xs font-medium text-cl-text-tertiary">circular</p>
      </div>
      <div className="text-center pt-2 pb-1">
        <div className="relative inline-flex">
          <Avatar
            name="Rect"
            shape="square"
            autoColor
            colors={
              {
                backgrounds: [
                  "#e0e7ff",
                  "#dbeafe",
                  "#d1fae5",
                  "#fef9c3",
                  "#fce7f3",
                  "#ede9fe",
                  "#cffafe",
                  "#fef2f2"
                ],
                text: [
                  "#4f46e5",
                  "#1d4ed8",
                  "#047857",
                  "#854d0e",
                  "#be185d",
                  "#7c3aed",
                  "#0e7490",
                  "#ef4444"
                ]
              }
            }
          />
          <AvatarBadge count={2} overlap="rectangular" />
        </div>
        <p className="text-xs mt-3 text-xs font-medium text-cl-text-tertiary">rectangular</p>
      </div>
      <div className="text-center pt-2 pb-1">
        <div className="relative inline-flex">
          <Avatar
            name="Off"
            autoColor
            colors={
              {
                backgrounds: [
                  "#e0e7ff",
                  "#dbeafe",
                  "#d1fae5",
                  "#fef9c3",
                  "#fce7f3",
                  "#ede9fe",
                  "#cffafe",
                  "#fef2f2"
                ],
                text: [
                  "#4f46e5",
                  "#1d4ed8",
                  "#047857",
                  "#854d0e",
                  "#be185d",
                  "#7c3aed",
                  "#0e7490",
                  "#ef4444"
                ]
              }
            }
          />
          <AvatarBadge count={9} offset={{ x: 2, y: -2 }} />
        </div>
        <p className="text-xs mt-3 text-xs font-medium text-cl-text-tertiary">custom offset</p>
      </div>
    </>
  );
}
