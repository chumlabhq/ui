import { useCallback, useMemo, useState, type ReactNode } from "react";
import Modal from "./Modal/Modal";
import {
  BuyMeCoffeeContext,
  type BuyMeCoffeeContextValue,
} from "./useBuyMeCoffee";
import { Button } from "./ui";
import { trackEvent } from "../lib/analytics";
import { useCreateFeedbackMutation } from "../redux/api/feedbackApi";
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} from "../redux/api/paymentApi";
import { useGetMeQuery } from "../redux/api/authApi";

/**
 * Razorpay's checkout.js attaches a global `window.Razorpay` constructor.
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
  on: (
    event: "payment.failed",
    cb: (resp: { error?: { description?: string; code?: string } }) => void,
  ) => void;
};
type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function ensureRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);

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

const PRESET_AMOUNTS = [
  { value: 5, label: "Espresso" },
  { value: 10, label: "Latte" },
  { value: 25, label: "Brunch" },
  { value: 50, label: "Feast" },
] as const;
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

  const { data: meData, isError: meHasError } = useGetMeQuery();
  const authedUser = meHasError ? undefined : meData?.user;

  const submitting = creatingOrder || paying;

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
      onOpenChange(false);
      window.setTimeout(reset, 250);
    } else {
      onOpenChange(true);
    }
  };

  const handleSubmit = async () => {
    if (!amountValid) return;
    setSubmitError(null);

    trackEvent("coffee_submit_attempt", {
      amount,
      rating,
      has_feedback: feedback.trim().length > 0,
      signed_in: !!authedUser,
    });

    let orderResp;
    try {
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
      trackEvent("coffee_submit_error", { stage: "create_order" });
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
      theme: { color: "#5b9bff" },
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
          trackEvent("coffee_submit_error", { stage: "verify_payment" });
          return;
        }

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
          console.error("[BuyMeCoffee] feedback save failed:", err);
        }

        setPaying(false);
        setSent(true);
        trackEvent("coffee_submit_success", { amount, rating });
      },
      modal: {
        ondismiss: () => {
          setPaying(false);
          trackEvent("coffee_submit_dismissed", { amount });
        },
      },
    });

    rzp.on("payment.failed", (resp) => {
      setPaying(false);
      setSubmitError(
        `Payment failed: ${resp.error?.description || "please try again"}`,
      );
      trackEvent("coffee_submit_error", {
        stage: "razorpay_failed",
        reason: resp.error?.code ?? "unknown",
      });
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
      maxWidth={520}
      unstyled
      classes={{
        root: "fixed inset-0 z-50 flex items-center justify-center",
        overlay: "fixed inset-0 bg-cl-bg/80",
        container:
          "relative z-10 flex items-center justify-center p-4 sm:p-6 w-full",
        content:
          "relative outline-none w-full sm:w-[520px] rounded-lg bg-cl-bg-elevated text-cl-text overflow-hidden",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-lg"
        style={{ border: "0.5px solid var(--border-soft)" }}
      />

      <Button
        variant="icon"
        size="sm"
        onClick={() => handleOpenChange(false)}
        aria-label="Close"
        className="absolute top-4 right-4 z-10"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </Button>

      <div className="relative px-7 sm:px-9 py-9">
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
      <div className="eyebrow text-cl-text-secondary mb-2">Support the project</div>

      <h2
        className="font-sans font-medium text-cl-text mb-3 leading-[1.05]"
        style={{ fontSize: 30, letterSpacing: "-0.025em" }}
      >
        Keep open source <span className="serif-accent">caffeinated.</span>
      </h2>
      <p className="text-[14.5px] text-cl-text-secondary leading-[1.55] mb-7">
        Chumlab is free and open source. A coffee funds late nights, new
        primitives, and the next release.
      </p>

      <div className="grid grid-cols-4 gap-2.5 mb-5">
        {PRESET_AMOUNTS.map(({ value, label }) => {
          const active = !customActive && selected === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setSelected(value)}
              className="cursor-pointer p-[14px] rounded-md transition-colors duration-150 text-left"
              style={{
                background: active ? "var(--text-primary)" : "var(--bg-elevated)",
                color: active ? "var(--bg-base)" : "var(--text-primary)",
                border: `0.5px solid ${active ? "transparent" : "var(--border-faint)"}`,
              }}
              data-track-event="coffee_amount_preset"
              data-track-amount={String(value)}
            >
              <div className="text-[24px] font-medium leading-none">${value}</div>
              <div
                className="mt-1.5 text-[10.5px] tracking-[0.14em] uppercase"
                style={{
                  color: active
                    ? "rgba(5,6,8,0.6)"
                    : "var(--text-tertiary)",
                }}
              >
                {label}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mb-6">
        <label
          htmlFor="bmc-custom"
          className="block eyebrow text-cl-text-tertiary mb-2"
        >
          Custom amount
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-cl-text-tertiary text-[15px]">
            $
          </span>
          <input
            id="bmc-custom"
            type="text"
            inputMode="numeric"
            value={custom}
            onChange={(e) =>
              setCustom(e.target.value.replace(/[^\d]/g, "").slice(0, 5))
            }
            placeholder="25"
            aria-label="Custom amount in USD"
            className="w-full py-2.5 pl-7 pr-3 bg-cl-bg-elevated text-cl-text placeholder:text-cl-text-disabled rounded-md outline-none transition-colors"
            style={{ border: "0.5px solid var(--border-faint)" }}
          />
        </div>
        {!amountValid && (
          <p className="mt-1.5 text-[12px]" style={{ color: "var(--accent)" }}>
            Minimum support is ${MIN_AMOUNT}.
          </p>
        )}
      </div>

      <div className="mb-5 flex items-center justify-between">
        <span className="text-[13.5px] font-medium text-cl-text">
          How would you rate Chumlab?
        </span>
        <StarRating value={rating} onChange={setRating} />
      </div>

      <div className="mb-6">
        <label
          htmlFor="bmc-feedback"
          className="block eyebrow text-cl-text-tertiary mb-2"
        >
          What&rsquo;s working? What should we build next?
        </label>
        <textarea
          id="bmc-feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value.slice(0, 500))}
          rows={3}
          maxLength={500}
          placeholder="Optional. Short and specific is best."
          className="w-full px-3 py-2.5 bg-cl-bg-elevated text-cl-text placeholder:text-cl-text-disabled rounded-md outline-none resize-none leading-snug text-[14px]"
          style={{ border: "0.5px solid var(--border-faint)" }}
        />
      </div>

      <Button
        variant="primary"
        size="md"
        onClick={onSubmit}
        disabled={!amountValid || submitting}
        loading={submitting}
        className="sm:w-full"
      >
        {submitting ? (
          "Opening checkout..."
        ) : (
          <>
            Send ${amount} of love <span aria-hidden>&rarr;</span>
          </>
        )}
      </Button>

      {submitError && (
        <p
          role="alert"
          className="mt-3 text-[12.5px] leading-relaxed text-center"
          style={{ color: "var(--accent)" }}
        >
          {submitError}
        </p>
      )}

      <div className="mt-5 eyebrow text-cl-text-tertiary text-center">
        Secure via Razorpay · 100% to maintainers
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
    <>
      <div className="eyebrow text-cl-text-secondary mb-2">With thanks</div>

      <h2
        className="font-sans font-medium text-cl-text mb-3 leading-[1.05]"
        style={{ fontSize: 30, letterSpacing: "-0.025em" }}
      >
        You just fuelled the{" "}
        <span className="serif-accent">next release.</span>
      </h2>
      <p className="text-[14.5px] text-cl-text-secondary leading-[1.55] mb-8">
        Thank you for the ${amount}. Every coffee shows up in the next commit.
        We&rsquo;ll keep shipping.
      </p>
      <Button variant="primary" size="md" onClick={onClose} className="sm:w-full">
        You&rsquo;re welcome
      </Button>
    </>
  );
}

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
      className="inline-flex items-center gap-1"
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
            className="cursor-pointer p-0.5 focus:outline-none"
            data-track-event="coffee_rating_select"
            data-track-rating={String(n)}
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
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: filled ? "var(--accent)" : "var(--text-tertiary)" }}
      aria-hidden
    >
      <path d="M12 3.5 14.85 9.3l6.4.93-4.63 4.51 1.09 6.37L12 18.1l-5.71 3 1.09-6.37L2.75 10.23l6.4-.93L12 3.5z" />
    </svg>
  );
}

/**
 * Mini coffee glyph kept as a backward-compatible export. Header/footer no
 * longer use it, but other consumers may still import it.
 */
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
      <path d="M4 7h12v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V7Zm12 2h1.5a2.5 2.5 0 0 1 0 5H16V9Z" />
    </svg>
  );
}
