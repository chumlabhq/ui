import { Routes, Route, Navigate } from "react-router-dom";
import { useScrollToTop } from "./hooks/useScrollToTop";
import { BuyMeCoffeeProvider } from "./components/BuyMeCoffee";
import Home from "./pages/Home";
import OauthRedirect from "./pages/oauth/OauthRedirect";
import Faq from "./pages/Faq";
import BlogListing from "./pages/blog/BlogListing";
import BlogDetail from "./pages/blog/BlogDetail";
import Demo from "./pages/demo/Demo";
import AccordionDemo from "./pages/demo/AccordionDemo";
import AvatarDemo from "./pages/demo/AvatarDemo";
import BreadcrumbDemo from "./pages/demo/BreadcrumbDemo";
import ButtonDemo from "./pages/demo/ButtonDemo";
import CascadingDropdownDemo from "./pages/demo/CascadingDropdownDemo";
import CheckboxDemo from "./pages/demo/CheckboxDemo";
import CountryFlagDemo from "./pages/demo/CountryFlagDemo";
import DatePickerDemo from "./pages/demo/DatePickerDemo";
import DrawerDemo from "./pages/demo/DrawerDemo";
import DropdownDemo from "./pages/demo/DropdownDemo";
import InputDemo from "./pages/demo/InputDemo";
import InternationalPhoneInputDemo from "./pages/demo/InternationalPhoneInputDemo";
import LoaderDemo from "./pages/demo/LoaderDemo";
import ModalDemo from "./pages/demo/ModalDemo";
import MultiSelectDropdownDemo from "./pages/demo/MultiSelectDropdownDemo";
import MultiSelectSearchableDropdownDemo from "./pages/demo/MultiSelectSearchableDropdownDemo";
import OtpInputDemo from "./pages/demo/OtpInputDemo";
import PaginationDemo from "./pages/demo/PaginationDemo";
import RadioButtonDemo from "./pages/demo/RadioButtonDemo";
import ResizablePanelDemo from "./pages/demo/ResizablePanelDemo";
import SearchableDropdownDemo from "./pages/demo/SearchableDropdownDemo";
import SliderDemo from "./pages/demo/SliderDemo";
import StepperDemo from "./pages/demo/StepperDemo";
import SwitchDemo from "./pages/demo/SwitchDemo";
import TabPanelDemo from "./pages/demo/TabPanelDemo";
import TableDemo from "./pages/demo/TableDemo";
import TextAreaDemo from "./pages/demo/TextAreaDemo";
import TimePickerDemo from "./pages/demo/TimePickerDemo";
import ToastDemo from "./pages/demo/ToastDemo";
import TooltipDemo from "./pages/demo/TooltipDemo";
import GettingStartedDemo from "./pages/demo/GettingStartedDemo";
import IntroductionDemo from "./pages/demo/IntroductionDemo";
import AccessibilityDemo from "./pages/demo/AccessibilityDemo";
import StylingDemo from "./pages/demo/StylingDemo";
import ThemingDemo from "./pages/demo/ThemingDemo";
import AnimationDemo from "./pages/demo/AnimationDemo";
import AiLlmDemo from "./pages/demo/AiLlmDemo";

const App = () => {
  useScrollToTop();

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
      <Route path="oauth/google" element={<OauthRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </BuyMeCoffeeProvider>
  );
};

export default App;
