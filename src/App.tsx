import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { useScrollToTop } from "./hooks/useScrollToTop.js";
import { useAnalytics } from "./hooks/useAnalytics.js";
import { BuyMeCoffeeProvider } from "./components/BuyMeCoffee.js";

// Fixture pages exist so e2e can drive components without going through demo
// prose (E2E-INVENTORY.md). The import sits inside a ternary on
// import.meta.env.DEV, which is a literal in a production build, so Rollup
// drops the branch AND its chunk — a top-level lazy(() => import(...)) would
// have emitted the chunk regardless.
const FixtureRoutes = import.meta.env.DEV
  ? lazy(() => import("./pages/fixtures/FixtureRoutes.js"))
  : null;
import Home from "./pages/Home.js";
import Faq from "./pages/Faq.js";
import NotFound from "./pages/NotFound.js";
import BlogListing from "./pages/blog/BlogListing.js";
import BlogDetail from "./pages/blog/BlogDetail.js";
import Demo from "./pages/demo/Demo.js";

/**
 * The component pages, one chunk each.
 *
 * They were static imports, so every demo — every example class string and
 * every sample dataset — landed in the entry chunk a visitor downloads before
 * the homepage paints. `Demo` itself stays eager: it is the shell they render
 * into, and lazy-loading it would blank the sidebar on the way to a page.
 */
const AccordionDemo = lazy(() => import("./pages/demo/AccordionDemo.js"));
const AvatarDemo = lazy(() => import("./pages/demo/AvatarDemo.js"));
const BreadcrumbDemo = lazy(() => import("./pages/demo/BreadcrumbDemo.js"));
const ButtonDemo = lazy(() => import("./pages/demo/ButtonDemo.js"));
const CascadingDropdownDemo = lazy(() => import("./pages/demo/CascadingDropdownDemo.js"));
const CheckboxDemo = lazy(() => import("./pages/demo/CheckboxDemo.js"));
const CountryFlagDemo = lazy(() => import("./pages/demo/CountryFlagDemo.js"));
const DatePickerDemo = lazy(() => import("./pages/demo/DatePickerDemo.js"));
const DrawerDemo = lazy(() => import("./pages/demo/DrawerDemo.js"));
const DropdownDemo = lazy(() => import("./pages/demo/DropdownDemo.js"));
const InputDemo = lazy(() => import("./pages/demo/InputDemo.js"));
const InternationalPhoneInputDemo = lazy(() => import("./pages/demo/InternationalPhoneInputDemo.js"));
const LoaderDemo = lazy(() => import("./pages/demo/LoaderDemo.js"));
const ModalDemo = lazy(() => import("./pages/demo/ModalDemo.js"));
const MultiSelectDropdownDemo = lazy(() => import("./pages/demo/MultiSelectDropdownDemo.js"));
const MultiSelectSearchableDropdownDemo = lazy(() => import("./pages/demo/MultiSelectSearchableDropdownDemo.js"));
const OtpInputDemo = lazy(() => import("./pages/demo/OtpInputDemo.js"));
const PaginationDemo = lazy(() => import("./pages/demo/PaginationDemo.js"));
const RadioButtonDemo = lazy(() => import("./pages/demo/RadioButtonDemo.js"));
const ResizablePanelDemo = lazy(() => import("./pages/demo/ResizablePanelDemo.js"));
const SearchableDropdownDemo = lazy(() => import("./pages/demo/SearchableDropdownDemo.js"));
const SliderDemo = lazy(() => import("./pages/demo/SliderDemo.js"));
const StepperDemo = lazy(() => import("./pages/demo/StepperDemo.js"));
const SwitchDemo = lazy(() => import("./pages/demo/SwitchDemo.js"));
const TabPanelDemo = lazy(() => import("./pages/demo/TabPanelDemo.js"));
const TableDemo = lazy(() => import("./pages/demo/TableDemo.js"));
const TextAreaDemo = lazy(() => import("./pages/demo/TextAreaDemo.js"));
const TimePickerDemo = lazy(() => import("./pages/demo/TimePickerDemo.js"));
const ToastDemo = lazy(() => import("./pages/demo/ToastDemo.js"));
const TooltipDemo = lazy(() => import("./pages/demo/TooltipDemo.js"));
const GettingStartedDemo = lazy(() => import("./pages/demo/GettingStartedDemo.js"));
const IntroductionDemo = lazy(() => import("./pages/demo/IntroductionDemo.js"));
const AccessibilityDemo = lazy(() => import("./pages/demo/AccessibilityDemo.js"));
const StylingDemo = lazy(() => import("./pages/demo/StylingDemo.js"));
const ThemingDemo = lazy(() => import("./pages/demo/ThemingDemo.js"));
const AnimationDemo = lazy(() => import("./pages/demo/AnimationDemo.js"));
const AiLlmDemo = lazy(() => import("./pages/demo/AiLlmDemo.js"));
/** One demo example per page with no site chrome, for the docs pages' phone-width frames. */
const PreviewRoute = lazy(() => import("./pages/demo/previews/PreviewRoute.js"));

const App = () => {
  useScrollToTop();
  useAnalytics();

  return (
    <BuyMeCoffeeProvider>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/blog" element={<BlogListing />} />
      <Route path="/blog/:id" element={<BlogDetail />} />
      <Route element={<Demo />}>
        <Route path="introduction" element={<IntroductionDemo />} />
        <Route path="getting-started" element={<GettingStartedDemo />} />
        <Route path="accessibility" element={<AccessibilityDemo />} />
        <Route path="guides/styling" element={<StylingDemo />} />
        <Route path="guides/theming" element={<ThemingDemo />} />
        <Route path="guides/animation" element={<AnimationDemo />} />
        <Route path="guides/ai-llm" element={<AiLlmDemo />} />
        <Route path="accordion" element={<AccordionDemo />} />
        <Route path="avatar" element={<AvatarDemo />} />
        <Route path="breadcrumb" element={<BreadcrumbDemo />} />
        <Route path="button" element={<ButtonDemo />} />
        <Route path="cascading-dropdown" element={<CascadingDropdownDemo />} />
        <Route path="checkbox" element={<CheckboxDemo />} />
        <Route path="country-flag" element={<CountryFlagDemo />} />
        <Route path="date-picker" element={<DatePickerDemo />} />
        <Route path="drawer" element={<DrawerDemo />} />
        <Route path="dropdown" element={<DropdownDemo />} />
        <Route path="input" element={<InputDemo />} />
        <Route
          path="international-phone-input"
          element={<InternationalPhoneInputDemo />}
        />
        <Route path="loader" element={<LoaderDemo />} />
        <Route path="modal" element={<ModalDemo />} />
        <Route
          path="multi-select-dropdown"
          element={<MultiSelectDropdownDemo />}
        />
        <Route
          path="multi-select-searchable-dropdown"
          element={<MultiSelectSearchableDropdownDemo />}
        />
        <Route path="otp-input" element={<OtpInputDemo />} />
        <Route path="pagination" element={<PaginationDemo />} />
        <Route path="radio-button" element={<RadioButtonDemo />} />
        <Route path="resizable-panel" element={<ResizablePanelDemo />} />
        <Route
          path="searchable-dropdown"
          element={<SearchableDropdownDemo />}
        />
        <Route path="slider" element={<SliderDemo />} />
        <Route path="stepper" element={<StepperDemo />} />
        <Route path="switch" element={<SwitchDemo />} />
        <Route path="tab-panel" element={<TabPanelDemo />} />
        <Route path="table" element={<TableDemo />} />
        <Route path="text-area" element={<TextAreaDemo />} />
        <Route path="time-picker" element={<TimePickerDemo />} />
        <Route path="toast" element={<ToastDemo />} />
        <Route path="tooltip" element={<TooltipDemo />} />
      </Route>
      {/* No /playground and no /oauth/google. The playground was removed from
          the site on 2026-09-07 and returns as a feature release; its code is
          still in `src/pages/playground` and is not reachable from any route,
          so it neither renders nor enters the bundle. `docs/playground-removal.md`
          is the restore list. Both paths fall through to the catch-all below. */}
      <Route
        path="/preview/:component/:example"
        element={
          <Suspense fallback={null}>
            <PreviewRoute />
          </Suspense>
        }
      />
      {FixtureRoutes && (
        <Route
          path="__fixtures/*"
          element={
            <Suspense fallback={null}>
              <FixtureRoutes />
            </Suspense>
          }
        />
      )}
      <Route path="*" element={<NotFound />} />
    </Routes>
    </BuyMeCoffeeProvider>
  );
};

export default App;
