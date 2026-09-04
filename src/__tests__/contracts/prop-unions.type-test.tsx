/**
 * The dropdown family's invalid prop combinations, asserted at the type level.
 *
 * Each of these typechecked and did nothing before this phase:
 *
 * - `options` + `onSearch`: `displayOptions` reads only the async sources once
 *   `onSearch` is a function, while the selection lookup still spreads
 *   `options` -- an empty menu under a correctly-labelled trigger.
 * - either half of a loader pair alone: the effect is guarded on both, so one
 *   without the other fetches nothing, or has nothing to fetch.
 * - CascadingDropdown's `onMenuSearch`/`onSubmenuSearch` without the
 *   `showMenuSearch`/`showSubmenuSearch` that renders the input: the query never
 *   leaves `""`, so the callback is unreachable. Both default to false, which is
 *   what made the dead combination the easy one to write.
 *
 * `@ts-expect-error` is the assertion: `tsc --build` fails if any line below
 * stops being an error, which is what makes the unions a gate rather than a
 * convention. This file is typechecked, never executed.
 */
import { Dropdown } from "../../components/Dropdown";
import { MultiSelectDropdown } from "../../components/MultiSelectDropdown";
import { SearchableDropdown } from "../../components/SearchableDropdown";
import { MultiSelectSearchableDropdown } from "../../components/MultiSelectSearchableDropdown";
import { CascadingDropdown } from "../../components/CascadingDropdown";
import { Tooltip } from "../../components/Tooltip";

const OPTIONS = [{ value: "a", label: "A" }];
const load = async () => OPTIONS;
const TREE = [{ value: "a", label: "A", hasChildren: true }];
const loadChildren = async () => TREE;

export const valid = (
  <>
    <Dropdown options={OPTIONS} />
    <Dropdown onLoadOptions={load} loadOnOpen />
    <MultiSelectDropdown options={OPTIONS} />
    <MultiSelectDropdown onLoadOptions={load} loadOnOpen />
    <SearchableDropdown options={OPTIONS} />
    <SearchableDropdown onSearch={load} initialOptions={OPTIONS} />
    <SearchableDropdown onSearch={load} onLoadInitialOptions={load} loadInitialOnOpen />
    <MultiSelectSearchableDropdown options={OPTIONS} />
    <MultiSelectSearchableDropdown onSearch={load} initialOptions={OPTIONS} />
    <MultiSelectSearchableDropdown
      onSearch={load}
      onLoadInitialOptions={load}
      loadInitialOnOpen
    />
    <CascadingDropdown options={TREE} />
    <CascadingDropdown options={TREE} onLoadChildren={loadChildren} />
    <CascadingDropdown options={TREE} showMenuSearch />
    <CascadingDropdown options={TREE} onMenuSearch={load} showMenuSearch />
    <CascadingDropdown options={TREE} onSubmenuSearch={loadChildren} showSubmenuSearch />
    <Tooltip content="x" portalContainer={null}>
      <span />
    </Tooltip>
    <Tooltip content="x" portal={false}>
      <span />
    </Tooltip>
  </>
);

export const invalid = (
  <>
    {/* @ts-expect-error `options` never reaches the menu once onSearch is set */}
    <SearchableDropdown options={OPTIONS} onSearch={load} />
    {/* @ts-expect-error same defect, multi-select */}
    <MultiSelectSearchableDropdown options={OPTIONS} onSearch={load} />
    {/* @ts-expect-error the initial-load family is read only on the async branch */}
    <SearchableDropdown options={OPTIONS} onLoadInitialOptions={load} />
    {/* @ts-expect-error a loader with nothing to trigger it */}
    <SearchableDropdown onSearch={load} onLoadInitialOptions={load} />
    {/* @ts-expect-error a trigger with no loader */}
    <MultiSelectSearchableDropdown onSearch={load} loadInitialOnOpen />
    {/* @ts-expect-error a loader with nothing to trigger it */}
    <Dropdown options={OPTIONS} onLoadOptions={load} />
    {/* @ts-expect-error a trigger with no loader */}
    <Dropdown options={OPTIONS} loadOnOpen />
    {/* @ts-expect-error a loader with nothing to trigger it */}
    <MultiSelectDropdown onLoadOptions={load} />
    {/* @ts-expect-error a trigger with no loader */}
    <MultiSelectDropdown loadOnOpen />
    {/* @ts-expect-error a menu searcher with no search input to type into */}
    <CascadingDropdown options={TREE} onMenuSearch={load} />
    {/* @ts-expect-error the search input is what fires it, and it is off by default */}
    <CascadingDropdown options={TREE} onMenuSearch={load} showMenuSearch={false} />
    {/* @ts-expect-error same pairing, one level down */}
    <CascadingDropdown options={TREE} onSubmenuSearch={loadChildren} />
    {/* @ts-expect-error portalContainer chooses nothing when portal is off */}
    <Tooltip content="x" portal={false} portalContainer={document.body}>
      <span />
    </Tooltip>
  </>
);
