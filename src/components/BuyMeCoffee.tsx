import { useCallback, useMemo, useState, type ReactNode } from "react";
import Modal from "./Modal/Modal";
import {
  BuyMeCoffeeContext,
  type BuyMeCoffeeContextValue,
} from "./useBuyMeCoffee";
import { useCreateFeedbackMutation } from "../redux/api/feedbackApi";
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} from "../redux/api/paymentApi";
import { useGetMeQuery } from "../redux/api/authApi";

/**
 * Razorpay's checkout.js attaches a global `window.Razorpay` constructor.
 * We type it loosely - the SDK is small, untyped on npm, and the surface
 * we touch is a thin slice of the public API.
 */
type RazorpayHandlerArgs = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};
type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (args: RazorpayHandlerArgs) => void;
  modal?: { ondismiss?: () => void };
};
type RazorpayInstance = {
  open: () => void;
  on: (event: "payment.failed", cb: (resp: { error?: { description?: string } }) => void) => void;
};
type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

/**
 * Resolve `window.Razorpay`. The script is preloaded in index.html with
 * `defer`, so by the time any BuyMeCoffee click fires it's normally already
 * attached. If for some reason it isn't (ad-blocker stripping the tag,
 * intermittent network), poll briefly then fall back to an injected tag.
 */
function ensureRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);

    // Wait up to 1.5s for the deferred preload to finish. If still nothing,
    // try one self-hosted insert before giving up.
    let attempts = 0;
    const tick = () => {
      if (window.Razorpay) return resolve(true);
      attempts += 1;
      if (attempts >= 15) {
        const fallback = document.createElement("script");
        fallback.src = RAZORPAY_SCRIPT_SRC;
        fallback.async = true;
        fallback.onload = () => resolve(!!window.Razorpay);
        fallback.onerror = () => resolve(false);
        document.body.appendChild(fallback);
        return;
      }
      window.setTimeout(tick, 100);
    };
    tick();
  });
}

/**
 * "Buy us a coffee" support flow — a single provider owns the modal so the
 * header, footer, or any future surface can just call `useBuyMeCoffee().open()`
 * to trigger it. Keeping the modal mounted once at the root avoids rendering
 * it per-consumer and ensures the backdrop + scroll lock behave consistently.
 *
 * Payment integration is intentionally mocked — swap `handleSubmit` for a
 * real Stripe Checkout redirect once billing is wired up.
 */

// Preset amounts shown as selectable chips. $5 is the default + minimum so the
// support gesture stays accessible while still covering transaction fees.
const PRESET_AMOUNTS = [5, 10, 25, 50] as const;
const MIN_AMOUNT = 5;

export function BuyMeCoffeeProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo<BuyMeCoffeeContextValue>(
    () => ({ open: () => setIsOpen(true) }),
    [],
  );

  return (
    <BuyMeCoffeeContext.Provider value={value}>
      {children}
      <BuyMeCoffeeModal open={isOpen} onOpenChange={setIsOpen} />
    </BuyMeCoffeeContext.Provider>
  );
}

function BuyMeCoffeeModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [selected, setSelected] = useState<number>(5);
  const [custom, setCustom] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  const [createOrder, { isLoading: creatingOrder }] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [createFeedback] = useCreateFeedbackMutation();

  // Pull the signed-in user (if any) so we can prefill Razorpay's contact
  // form. The backend route is public so anonymous tipping still works.
  const { data: meData, isError: meHasError } = useGetMeQuery();
  const authedUser = meHasError ? undefined : meData?.user;

  const submitting = creatingOrder || paying;

  // Effective amount — custom input wins when filled, otherwise the selected
  // chip. Parsed as a positive integer (cents are out of scope for the demo).
  const customValue = custom.trim() === "" ? null : Number(custom);
  const amount =
    customValue !== null && !Number.isNaN(customValue) ? customValue : selected;
  const amountValid = amount >= MIN_AMOUNT;

  const reset = useCallback(() => {
    setSelected(5);
    setCustom("");
    setRating(0);
    setFeedback("");
    setSent(false);
    setSubmitError(null);
  }, []);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      // Close the modal first; defer the form reset until the close animation
      // has played out. Resetting synchronously flips `sent` back to false,
      // which would briefly re-mount the PickAmountStep behind the closing
      // modal and flash the wrong screen at the user.
      onOpenChange(false);
      window.setTimeout(reset, 250);
    } else {
      onOpenChange(true);
    }
  };

  const handleSubmit = async () => {
    if (!amountValid) return;
    setSubmitError(null);

    let orderResp;
    try {
      // Account has International Payments enabled, so we charge in USD to
      // match the dollar symbol in the UI. Amount is sent in cents (smallest
      // USD unit) - $5 -> 500.
      orderResp = await createOrder({
        amount: amount * 100,
        currency: "USD",
        receipt: `bmc_${Date.now()}`,
        notes: {
          source: "buy-me-coffee",
          rating: String(rating),
          feedback: feedback.slice(0, 200),
        },
        customer: authedUser
          ? { name: authedUser.name, email: authedUser.email }
          : undefined,
      }).unwrap();
    } catch (err) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Could not start payment. Please try again.";
      setSubmitError(msg);
      return;
    }

    setPaying(true);

    const scriptLoaded = await ensureRazorpay();
    if (!scriptLoaded || !window.Razorpay) {
      setPaying(false);
      setSubmitError(
        "Couldn't load the payment widget. If you have an ad-blocker, try disabling it on this site.",
      );
      return;
    }

    const rzp = new window.Razorpay({
      key: orderResp.key_id,
      amount: orderResp.amount,
      currency: orderResp.currency,
      name: "Chumlab",
      description: "Buy us a coffee",
      order_id: orderResp.order_id,
      prefill: authedUser
        ? { name: authedUser.name, email: authedUser.email }
        : undefined,
      theme: { color: "#f59e0b" },
      handler: async (response) => {
        try {
          await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }).unwrap();
        } catch {
          setPaying(false);
          setSubmitError(
            "Payment was captured but verification failed. Email hello@chumlab.com with your transaction id.",
          );
          return;
        }

        // Persist the rating + note alongside the captured payment so the
        // tip + the message land together in MongoDB. Awaited so we know if
        // it failed - the payment itself is final, but we want to surface
        // a missing feedback write instead of silently dropping it.
        try {
          await createFeedback({
            rating,
            feedback,
            amount,
            currency: "USD",
            selected,
            source: "buy-me-coffee",
            metadata: {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
            },
          }).unwrap();
        } catch (err) {
          // Log but don't abort - payment succeeded, the user shouldn't see
          // an error screen because their feedback row didn't insert.
          console.error("[BuyMeCoffee] feedback save failed:", err);
        }

        setPaying(false);
        setSent(true);
      },
      modal: {
        ondismiss: () => {
          setPaying(false);
        },
      },
    });

    rzp.on("payment.failed", (resp) => {
      setPaying(false);
      setSubmitError(
        `Payment failed: ${resp.error?.description || "please try again"}`,
      );
    });

    rzp.open();
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      showHeader={false}
      showCloseButton={false}
      preventOutsideClick={submitting}
      maxWidth={480}
      unstyled
      classes={{
        root: "fixed inset-0 z-50 flex items-center justify-center",
        overlay: "fixed inset-0 bg-black/75 backdrop-blur-sm",
        container:
          "relative z-10 flex items-center justify-center p-4 sm:p-6 w-full",
        content:
          "relative outline-none w-full sm:w-[480px] rounded-2xl border border-white/[0.1] bg-[#0a0a14]/85 backdrop-blur-2xl text-white overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)]",
      }}
    >
      {/* Warm amber glow in the top-right so the modal reads as "coffee"
          without leaning into a literal cup illustration. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 w-[360px] h-[280px] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.22)_0%,transparent_70%)] blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-20 w-[320px] h-[260px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.18)_0%,transparent_70%)] blur-2xl"
      />

      <button
        type="button"
        onClick={() => handleOpenChange(false)}
        aria-label="Close"
        className="cursor-pointer absolute top-4 right-4 z-10 w-9 h-9 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="px-6 sm:px-7 py-7">
        {sent ? (
          <ThankYouStep onClose={() => handleOpenChange(false)} amount={amount} />
        ) : (
          <PickAmountStep
            selected={selected}
            setSelected={(n) => {
              setSelected(n);
              setCustom("");
            }}
            custom={custom}
            setCustom={(v) => {
              setCustom(v);
              const parsed = Number(v);
              if (!Number.isNaN(parsed) && parsed > 0) setSelected(parsed);
            }}
            rating={rating}
            setRating={setRating}
            feedback={feedback}
            setFeedback={setFeedback}
            amount={amount}
            amountValid={amountValid}
            submitting={submitting}
            submitError={submitError}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </Modal>
  );
}

function PickAmountStep({
  selected,
  setSelected,
  custom,
  setCustom,
  rating,
  setRating,
  feedback,
  setFeedback,
  amount,
  amountValid,
  submitting,
  submitError,
  onSubmit,
}: {
  selected: number;
  setSelected: (n: number) => void;
  custom: string;
  setCustom: (v: string) => void;
  rating: number;
  setRating: (n: number) => void;
  feedback: string;
  setFeedback: (v: string) => void;
  amount: number;
  amountValid: boolean;
  submitting: boolean;
  submitError: string | null;
  onSubmit: () => void;
}) {
  const customActive = custom.trim() !== "";
  return (
    <>
      <div className="relative flex flex-col items-center text-center mb-6">
        <div className="relative mb-3">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/40 via-orange-400/30 to-rose-400/30 blur-2xl scale-[1.6]" />
          <div className="relative">
            <CoffeeCupIcon />
          </div>
        </div>
        <h2 className="text-[22px] sm:text-[24px] font-semibold tracking-tight leading-[1.2] mb-2">
          <span className="bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent">
            Keep open source{" "}
          </span>
          <span className="bg-gradient-to-r from-amber-200 via-orange-200 to-rose-200 bg-clip-text text-transparent">
            caffeinated
          </span>
        </h2>
        <p className="text-[13.5px] text-white/60 leading-snug max-w-[420px]">
          Chumlab is free and open source. A coffee funds late nights, new
          primitives, and the next release.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2.5 mb-3">
        {PRESET_AMOUNTS.map((value) => {
          const active = !customActive && selected === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setSelected(value)}
              className={`cursor-pointer relative group rounded-lg px-2 py-3 border transition-all duration-200 ${
                active
                  ? "border-amber-300/60 bg-gradient-to-br from-amber-400/20 via-orange-400/18 to-rose-400/15 shadow-[0_0_22px_-6px_rgba(251,191,36,0.55)]"
                  : "border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.15]"
              }`}
            >
              <div
                className={`text-[17px] font-semibold leading-tight ${
                  active ? "text-white" : "text-white/85"
                }`}
              >
                ${value}
              </div>
              <div
                className={`text-[10.5px] uppercase tracking-wider mt-0.5 ${
                  active ? "text-amber-100/90" : "text-white/40"
                }`}
              >
                {coffeeLabel(value)}
              </div>
            </button>
          );
        })}
      </div>

      <div className="relative mb-5">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-white/40 text-[14.5px] font-medium">
          $
        </div>
        <input
          type="text"
          inputMode="numeric"
          value={custom}
          onChange={(e) =>
            setCustom(e.target.value.replace(/[^\d]/g, "").slice(0, 5))
          }
          placeholder="Or enter a custom amount"
          aria-label="Custom amount in USD"
          className={`w-full pr-3.5 py-2.5 rounded-lg bg-white/[0.04] border text-[13.5px] text-white placeholder:text-white/30 focus:outline-none focus:bg-white/[0.06] transition-all ${
            customActive
              ? "border-amber-300/50 focus:border-amber-300/70 focus:shadow-[0_0_0_3px_rgba(251,191,36,0.18)]"
              : "border-white/[0.08] focus:border-blue-500/50 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]"
          }`}
          style={{ paddingLeft: "1.875rem" }}
        />
        {!amountValid && (
          <p className="mt-1 text-[11.5px] text-rose-300/85">
            Minimum support is ${MIN_AMOUNT}.
          </p>
        )}
      </div>

      {/* Optional feedback — rating + short note. Purely optional so the
          support flow never gatekeeps the donation on a review, but giving
          people room to say thanks or flag an issue makes the moment feel
          like a two-way conversation rather than a transaction. */}
      <div className="mb-5 rounded-lg border border-white/[0.06] bg-white/[0.015] px-3.5 py-3">
        <div className="flex items-center justify-between gap-3 mb-2">
          <p className="text-[13px] font-medium text-white/80">
            Rate your experience
          </p>
          <StarRating value={rating} onChange={setRating} />
        </div>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value.slice(0, 500))}
          rows={2}
          maxLength={500}
          placeholder="What’s working? What should we build next?"
          className="w-full px-3 py-2.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-[13.5px] text-white placeholder:text-white/30 focus:outline-none focus:border-amber-300/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(251,191,36,0.14)] transition-all resize-none leading-snug"
        />
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={!amountValid || submitting}
        className="cursor-pointer group relative overflow-hidden w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-[14.5px] text-[#4a1d08] bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 hover:from-amber-200 hover:via-orange-200 hover:to-rose-200 shadow-[0_10px_30px_-8px_rgba(251,191,36,0.55)] hover:shadow-[0_14px_36px_-6px_rgba(251,191,36,0.7)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_-10%,rgba(255,255,255,0.6),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="relative inline-flex items-center gap-2">
          {submitting ? (
            <>
              <Spinner />
              Opening checkout…
            </>
          ) : (
            <>
              <HeartIcon className="text-rose-600 drop-shadow-[0_1px_2px_rgba(190,18,60,0.35)]" />
              Send ${amount} of love
            </>
          )}
        </span>
      </button>

      {submitError && (
        <p
          role="alert"
          className="mt-2.5 text-[12px] text-rose-300/90 leading-relaxed text-center"
        >
          {submitError}
        </p>
      )}

      <div className="mt-3.5 flex items-center justify-center gap-4 text-[11.5px] text-white/45">
        <span className="inline-flex items-center gap-1.5">
          <RazorpayIcon />
          Secure via Razorpay
        </span>
        <span className="w-px h-3 bg-white/10" />
        <span className="inline-flex items-center gap-1.5">
          <HeartIcon size={11} className="text-rose-300" />
          100% to maintainers
        </span>
      </div>
    </>
  );
}

function ThankYouStep({
  onClose,
  amount,
}: {
  onClose: () => void;
  amount: number;
}) {
  return (
    <div className="flex flex-col items-center text-center py-2">
      <div className="relative mb-4">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/45 via-orange-400/35 to-rose-400/35 blur-2xl scale-[1.6]" />
        <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-amber-200 via-orange-200 to-rose-200 flex items-center justify-center shadow-[0_10px_30px_-6px_rgba(251,191,36,0.6)]">
          <HeartIcon size={24} className="text-rose-600" />
        </div>
      </div>
      <h2 className="text-[22px] font-semibold tracking-tight mb-2 leading-[1.2]">
        <span className="bg-gradient-to-b from-white to-white/85 bg-clip-text text-transparent">
          You just fuelled the next release.
        </span>
      </h2>
      <p className="text-[13.5px] text-white/60 leading-relaxed max-w-[340px] mb-6">
        Thank you for the ${amount} — seriously. Every coffee shows up in the
        next commit. We’ll keep shipping.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="cursor-pointer w-full px-5 py-2.5 rounded-xl bg-white text-gray-900 font-semibold text-[14px] hover:bg-gray-50 transition-colors"
      >
        You’re welcome
      </button>
    </div>
  );
}

function coffeeLabel(value: number) {
  if (value <= 5) return "Espresso";
  if (value <= 10) return "Latte";
  if (value <= 25) return "Brunch";
  return "Feast";
}

// ── Rating ─────────────────────────────────────────────────────────────────

/**
 * Compact 5-star rating control. Hover previews the rating (so the user sees
 * exactly which stars will be filled before committing); leaving the row
 * snaps back to the persisted value. Controlled — parent owns the number.
 */
function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const active = hover || value;
  return (
    <div
      className="inline-flex items-center gap-0.5"
      onMouseLeave={() => setHover(0)}
      role="radiogroup"
      aria-label="Rating"
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= active;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(value === n ? 0 : n)}
            onMouseEnter={() => setHover(n)}
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n === 1 ? "" : "s"}`}
            className="cursor-pointer p-0.5 rounded-md transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60"
          >
            <StarIcon filled={filled} />
          </button>
        );
      })}
    </div>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={
        filled
          ? "text-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.55)]"
          : "text-white/30 hover:text-amber-200/80 transition-colors"
      }
      aria-hidden
    >
      <path d="M12 3.5 14.85 9.3l6.4.93-4.63 4.51 1.09 6.37L12 18.1l-5.71 3 1.09-6.37L2.75 10.23l6.4-.93L12 3.5z" />
    </svg>
  );
}

// ── Icons ──────────────────────────────────────────────────────────────────

function CoffeeCupIcon() {
  return (
    <div className="relative w-14 h-14 flex items-end justify-center">
      {/* Steam wisps — stagger animations so the cup feels alive. */}
      <span className="absolute top-0 left-1/2 -translate-x-[14px] w-[3px] h-4 rounded-full bg-gradient-to-t from-transparent via-white/30 to-transparent bmc-steam" />
      <span className="absolute top-0 left-1/2 translate-x-[2px] w-[3px] h-5 rounded-full bg-gradient-to-t from-transparent via-white/35 to-transparent bmc-steam bmc-steam-delay-1" />
      <span className="absolute top-0 left-1/2 translate-x-[14px] w-[3px] h-4 rounded-full bg-gradient-to-t from-transparent via-white/25 to-transparent bmc-steam bmc-steam-delay-2" />
      <svg
        width="52"
        height="42"
        viewBox="0 0 52 42"
        fill="none"
        className="drop-shadow-[0_8px_18px_rgba(251,191,36,0.35)]"
        aria-hidden
      >
        <defs>
          <linearGradient id="bmc-cup" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="50%" stopColor="#fdba74" />
            <stop offset="100%" stopColor="#fda4af" />
          </linearGradient>
        </defs>
        <path
          d="M6 10h30v18a8 8 0 0 1-8 8H14a8 8 0 0 1-8-8V10Z"
          fill="url(#bmc-cup)"
        />
        <path
          d="M36 14h4a6 6 0 0 1 0 12h-4"
          stroke="url(#bmc-cup)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <ellipse cx="21" cy="10" rx="15" ry="2.5" fill="rgba(69,26,3,0.65)" />
      </svg>
      <style>{`
        @keyframes bmc-steam {
          0%   { transform: translate(-50%, 0) scale(0.7); opacity: 0; }
          30%  { opacity: 0.9; }
          100% { transform: translate(-50%, -14px) scale(1.1); opacity: 0; }
        }
        .bmc-steam { animation: bmc-steam 2.1s ease-in-out infinite; }
        .bmc-steam-delay-1 { animation-delay: 0.5s; }
        .bmc-steam-delay-2 { animation-delay: 1s; }
      `}</style>
    </div>
  );
}

export function CoffeeMiniIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M4 7h12v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V7Zm12 2h1.5a2.5 2.5 0 0 1 0 5H16V9Zm-9-5.5a.75.75 0 0 1 1.5 0c0 .47-.2.76-.5 1.06-.3.3-.5.59-.5 1.06a.75.75 0 0 1-1.5 0c0-.47.2-.76.5-1.06.3-.3.5-.59.5-1.06Zm4 0a.75.75 0 0 1 1.5 0c0 .47-.2.76-.5 1.06-.3.3-.5.59-.5 1.06a.75.75 0 0 1-1.5 0c0-.47.2-.76.5-1.06.3-.3.5-.59.5-1.06Z" />
    </svg>
  );
}

function HeartIcon({
  size = 16,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M11.645 20.91a.75.75 0 0 0 .71 0c2.7-1.44 10.645-6.21 10.645-12.66 0-3.1-2.4-5.5-5.5-5.5-1.7 0-3.3.72-4.5 1.98-1.2-1.26-2.8-1.98-4.5-1.98-3.1 0-5.5 2.4-5.5 5.5 0 6.45 7.946 11.22 10.645 12.66Z" />
    </svg>
  );
}

function Spinner() {
  return (
    <span className="inline-block w-4 h-4 rounded-full border-2 border-[#4a1d08]/30 border-t-[#4a1d08] animate-spin" />
  );
}

// Razorpay brand mark — just the blue/white "R" glyph from the full wordmark,
// tightly cropped so it reads as a bullet-sized icon in the trust row.
function RazorpayIcon() {
  return (
    <svg
      width="12"
      height="14"
      viewBox="0 0 18 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Razorpay"
    >
      <path
        d="M7.49374 6.48973L6.53128 10.0322L12.0402 6.46956L8.43726 19.9123L12.0964 19.9153L17.419 0.0598755"
        fill="#3395FF"
      />
      <path
        d="M1.56438 14.264L0.0488892 19.9153H7.54876L10.6176 8.41895L1.56438 14.264Z"
        fill="currentColor"
      />
    </svg>
  );
}

