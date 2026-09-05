import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useScrollToTop } from "./hooks/useScrollToTop.js";
import { useAnalytics } from "./hooks/useAnalytics.js";
import { BuyMeCoffeeProvider } from "./components/BuyMeCoffee.js";
import { PLAYGROUND_ENABLED } from "./lib/flags.js";

// Fixture pages exist so e2e can drive components without going through demo
// prose (E2E-INVENTORY.md). The import sits inside a ternary on
// import.meta.env.DEV, which is a literal in a production build, so Rollup
// drops the branch AND its chunk — a top-level lazy(() => import(...)) would
// have emitted the chunk regardless.
const FixtureRoutes = import.meta.env.DEV
  ? lazy(() => import("./pages/fixtures/FixtureRoutes.js"))
  : null;
import Home from "./pages/Home.js";
import OauthRedirect from "./pages/oauth/OauthRedirect.js";
import Playground from "./pages/playground/Playground.js";
import PlaygroundAdmin from "./pages/playground/PlaygroundAdmin.js";
import Faq from "./pages/Faq.js";
import BlogListing from "./pages/blog/BlogListing.js";
import BlogDetail from "./pages/blog/BlogDetail.js";
import Demo from "./pages/demo/Demo.js";
import AccordionDemo from "./pages/demo/AccordionDemo.js";
import AvatarDemo from "./pages/demo/AvatarDemo.js";
import BreadcrumbDemo from "./pages/demo/BreadcrumbDemo.js";
import ButtonDemo from "./pages/demo/ButtonDemo.js";
import CascadingDropdownDemo from "./pages/demo/CascadingDropdownDemo.js";
import CheckboxDemo from "./pages/demo/CheckboxDemo.js";
import CountryFlagDemo from "./pages/demo/CountryFlagDemo.js";
import DatePickerDemo from "./pages/demo/DatePickerDemo.js";
import DrawerDemo from "./pages/demo/DrawerDemo.js";
import DropdownDemo from "./pages/demo/DropdownDemo.js";
import InputDemo from "./pages/demo/InputDemo.js";
import InternationalPhoneInputDemo from "./pages/demo/InternationalPhoneInputDemo.js";
import LoaderDemo from "./pages/demo/LoaderDemo.js";
import ModalDemo from "./pages/demo/ModalDemo.js";
import MultiSelectDropdownDemo from "./pages/demo/MultiSelectDropdownDemo.js";
import MultiSelectSearchableDropdownDemo from "./pages/demo/MultiSelectSearchableDropdownDemo.js";
import OtpInputDemo from "./pages/demo/OtpInputDemo.js";
import PaginationDemo from "./pages/demo/PaginationDemo.js";
import RadioButtonDemo from "./pages/demo/RadioButtonDemo.js";
import ResizablePanelDemo from "./pages/demo/ResizablePanelDemo.js";
import SearchableDropdownDemo from "./pages/demo/SearchableDropdownDemo.js";
import SliderDemo from "./pages/demo/SliderDemo.js";
import StepperDemo from "./pages/demo/StepperDemo.js";
import SwitchDemo from "./pages/demo/SwitchDemo.js";
import TabPanelDemo from "./pages/demo/TabPanelDemo.js";
import TableDemo from "./pages/demo/TableDemo.js";
import TextAreaDemo from "./pages/demo/TextAreaDemo.js";
import TimePickerDemo from "./pages/demo/TimePickerDemo.js";
import ToastDemo from "./pages/demo/ToastDemo.js";
import TooltipDemo from "./pages/demo/TooltipDemo.js";
import GettingStartedDemo from "./pages/demo/GettingStartedDemo.js";
import IntroductionDemo from "./pages/demo/IntroductionDemo.js";
import AccessibilityDemo from "./pages/demo/AccessibilityDemo.js";
import StylingDemo from "./pages/demo/StylingDemo.js";
import ThemingDemo from "./pages/demo/ThemingDemo.js";
import AnimationDemo from "./pages/demo/AnimationDemo.js";
import AiLlmDemo from "./pages/demo/AiLlmDemo.js";

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
      {/* Registered only while the playground is enabled. With the flag off
          these paths fall through to the catch-all below and redirect home, so
          /playground is unreachable by direct URL as well as unlinked. */}
      {PLAYGROUND_ENABLED && (
        <Route path="playground">
          <Route index element={<Playground />} />
          <Route path="admin" element={<PlaygroundAdmin />} />
          {/* Route-based chat: the open chat lives in the URL so a refresh
              restores it (static /admin still wins by route ranking). */}
          <Route path=":chatId" element={<Playground />} />
        </Route>
      )}
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
      <Route path="oauth/google" element={<OauthRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </BuyMeCoffeeProvider>
  );
};

export default App;
