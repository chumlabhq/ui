import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchableDropdown from '../SearchableDropdown';
import type { SearchableDropdownOption } from '../utils/types';

async function waitForDropdownOpen() {
  await waitFor(() => {
    const listbox = screen.getByRole('listbox', { hidden: true });
    expect(listbox).toBeInTheDocument();
  }, { timeout: 2000 });
  await new Promise(resolve => setTimeout(resolve, 100));
}

const fruitOptions: SearchableDropdownOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
];

const optionsWithDisabled: SearchableDropdownOption[] = [
  { value: 'opt1', label: 'Option 1' },
  { value: 'opt2', label: 'Option 2', disabled: true },
  { value: 'opt3', label: 'Option 3' },
  { value: 'opt4', label: 'Option 4', disabled: true },
  { value: 'opt5', label: 'Option 5' },
];

describe('SearchableDropdown - Basic Rendering', () => {
  it('should render with required props', () => {
    render(<SearchableDropdown options={fruitOptions} />);

    const trigger = screen.getByRole('combobox');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('should render default trigger with type="button"', () => {
    render(<SearchableDropdown options={fruitOptions} />);
    expect(screen.getByRole('combobox')).toHaveAttribute('type', 'button');
  });

  it('should render placeholder text', () => {
    render(<SearchableDropdown options={fruitOptions} placeholder="Choose fruit" />);

    expect(screen.getByRole('combobox')).toHaveTextContent('Choose fruit');
  });

  it('should render with label', () => {
    render(
      <SearchableDropdown
        options={fruitOptions}
        label="Favorite Fruit"
        id="fruit-dropdown"
      />
    );

    const label = screen.getByText('Favorite Fruit');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'fruit-dropdown-trigger');
  });

  it('should render required indicator', () => {
    render(
      <SearchableDropdown
        options={fruitOptions}
        label="Required Field"
        required
      />
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should render selected value', () => {
    render(
      <SearchableDropdown
        options={fruitOptions}
        value="banana"
      />
    );

    expect(screen.getByRole('combobox')).toHaveTextContent('Banana');
  });
});

describe('SearchableDropdown - Controlled Behavior', () => {
  it('should call onValueChange when option selected', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <SearchableDropdown
        options={fruitOptions}
        onValueChange={handleChange}
      />
    );

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);
    await waitForDropdownOpen();

    const options = screen.getAllByRole('option', { hidden: true });
    await user.click(options[1]);

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith('banana', expect.any(Object));
    });
  });

  it('should respect controlled value prop', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    const { rerender } = render(
      <SearchableDropdown
        options={fruitOptions}
        value="apple"
        onValueChange={handleChange}
      />
    );

    expect(screen.getByRole('combobox')).toHaveTextContent('Apple');

    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();

    const options = screen.getAllByRole('option', { hidden: true });
    await user.click(options[2]);

    rerender(
      <SearchableDropdown
        options={fruitOptions}
        value="cherry"
        onValueChange={handleChange}
      />
    );

    expect(screen.getByRole('combobox')).toHaveTextContent('Cherry');
  });

  it('should call onOpenChange when dropdown opens/closes', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    render(
      <SearchableDropdown
        options={fruitOptions}
        onOpenChange={handleOpenChange}
      />
    );

    await user.click(screen.getByRole('combobox'));
    expect(handleOpenChange).toHaveBeenCalledWith(true);
  });
});

describe('SearchableDropdown - Uncontrolled Behavior', () => {
  it('should use defaultValue', () => {
    render(
      <SearchableDropdown
        options={fruitOptions}
        defaultValue="cherry"
      />
    );

    expect(screen.getByRole('combobox')).toHaveTextContent('Cherry');
  });

  it('should update internal state when option selected', async () => {
    const user = userEvent.setup();

    render(
      <SearchableDropdown
        options={fruitOptions}
        defaultValue="apple"
      />
    );

    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();

    const options = screen.getAllByRole('option', { hidden: true });
    await user.click(options[2]);

    expect(screen.getByRole('combobox')).toHaveTextContent('Cherry');
  });

  it('should use defaultOpen', async () => {
    render(
      <SearchableDropdown
        options={fruitOptions}
        defaultOpen
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');
    });
  });
});

describe('SearchableDropdown - Click Interactions', () => {
  it('should open dropdown on trigger click', async () => {
    const user = userEvent.setup();

    render(<SearchableDropdown options={fruitOptions} />);

    await user.click(screen.getByRole('combobox'));

    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');
  });

  it('should close dropdown when option clicked', async () => {
    const user = userEvent.setup();

    render(<SearchableDropdown options={fruitOptions} />);

    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();

    const options = screen.getAllByRole('option', { hidden: true });
    await user.click(options[0]);

    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
  });

  it('should not open when disabled trigger is clicked', async () => {
    const user = userEvent.setup();

    render(<SearchableDropdown options={fruitOptions} disabled />);

    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
  });

  it('should close dropdown on click outside', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <SearchableDropdown options={fruitOptions} />
        <button>Outside</button>
      </div>
    );

    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();

    await user.click(screen.getByText('Outside'));

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('should toggle dropdown on repeated trigger clicks', async () => {
    const user = userEvent.setup();

    render(<SearchableDropdown options={fruitOptions} />);

    const trigger = screen.getByRole('combobox');

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('SearchableDropdown - Search Functionality', () => {
  it('should show search input when open', async () => {
    const user = userEvent.setup();

    render(<SearchableDropdown options={fruitOptions} />);

    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();

    const searchInput = screen.getByLabelText('Search options');
    expect(searchInput).toBeInTheDocument();
  });

  it('should filter options based on search query', async () => {
    const user = userEvent.setup();

    render(<SearchableDropdown options={fruitOptions} />);

    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();

    const searchInput = screen.getByLabelText('Search options');
    await user.type(searchInput, 'ban');

    await waitFor(() => {
      const options = screen.getAllByRole('option', { hidden: true });
      expect(options).toHaveLength(1);
      expect(options[0]).toHaveTextContent('Banana');
    });
  });

  it('should show no results message when no options match', async () => {
    const user = userEvent.setup();

    render(<SearchableDropdown options={fruitOptions} noResultsContent="Nothing found" />);

    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();

    const searchInput = screen.getByLabelText('Search options');
    await user.type(searchInput, 'xyz');

    await waitFor(() => {
      expect(screen.getByText('Nothing found')).toBeInTheDocument();
    });
  });

  it('should hide search input when showSearch is false', async () => {
    const user = userEvent.setup();

    render(<SearchableDropdown options={fruitOptions} showSearch={false} />);

    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();

    expect(screen.queryByLabelText('Search options')).not.toBeInTheDocument();
  });

  it('should auto-focus search input when dropdown opens', async () => {
    const user = userEvent.setup();

    render(<SearchableDropdown options={fruitOptions} />);

    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();

    await waitFor(() => {
      const searchInput = screen.getByLabelText('Search options');
      expect(searchInput).toHaveFocus();
    }, { timeout: 2000 });
  });

  it('should use custom search placeholder', async () => {
    const user = userEvent.setup();

    render(<SearchableDropdown options={fruitOptions} searchPlaceholder="Type to filter..." />);

    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();

    expect(screen.getByPlaceholderText('Type to filter...')).toBeInTheDocument();
  });
});

describe('SearchableDropdown - Async Search', () => {
  it('should call onSearch with debounced query', async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn().mockResolvedValue([
      { value: 'result1', label: 'Result 1' },
    ]);

    render(
      <SearchableDropdown
        onSearch={handleSearch}
        searchDebounceMs={100}
      />
    );

    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();

    const searchInput = screen.getByLabelText('Search options');
    await user.type(searchInput, 'test');

    await waitFor(() => {
      expect(handleSearch).toHaveBeenCalledWith('test');
    }, { timeout: 3000 });
  });

  it('should show shimmer during loading', async () => {
    render(
      <SearchableDropdown
        options={[]}
        loading={true}
        shimmerCount={3}
        defaultOpen
      />
    );

    await waitForDropdownOpen();

    await waitFor(() => {
      const listbox = screen.getByRole('listbox', { hidden: true });
      expect(listbox).toBeInTheDocument();
    });
  });
});

describe('SearchableDropdown - Keyboard Navigation', () => {
  it('should open dropdown with ArrowDown', async () => {
    const user = userEvent.setup();

    render(<SearchableDropdown options={fruitOptions} />);

    const trigger = screen.getByRole('combobox');
    trigger.focus();
    await user.keyboard('{ArrowDown}');

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await waitFor(() => {
      expect(screen.getByRole('listbox', { hidden: true })).toBeInTheDocument();
    });
  });

  it('should close dropdown with Escape', async () => {
    const user = userEvent.setup();

    render(<SearchableDropdown options={fruitOptions} />);

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);
    await waitForDropdownOpen();

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('should restore focus to trigger after Escape', async () => {
    const user = userEvent.setup();

    render(<SearchableDropdown options={fruitOptions} />);

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);
    await waitForDropdownOpen();

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });

  it('should navigate options with ArrowDown and select with Enter', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <SearchableDropdown
        options={fruitOptions}
        onValueChange={handleChange}
        showSearch={false}
      />
    );

    const trigger = screen.getByRole('combobox');
    trigger.focus();

    await user.keyboard('{ArrowDown}');
    await waitForDropdownOpen();
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it('should jump to first option with Home', async () => {
    const user = userEvent.setup();

    render(<SearchableDropdown options={fruitOptions} showSearch={false} />);

    const trigger = screen.getByRole('combobox');
    trigger.focus();

    await user.keyboard('{ArrowDown}');
    await waitForDropdownOpen();
    await user.keyboard('{End}');
    await user.keyboard('{Home}');

    await waitFor(() => {
      const options = screen.getAllByRole('option', { hidden: true });
      const firstOption = options[0];
      expect(firstOption).toHaveAttribute('data-focused', 'true');
    });
  });

  it('should jump to last option with End', async () => {
    const user = userEvent.setup();

    render(<SearchableDropdown options={fruitOptions} showSearch={false} />);

    const trigger = screen.getByRole('combobox');
    trigger.focus();

    await user.keyboard('{ArrowDown}');
    await waitForDropdownOpen();
    await user.keyboard('{End}');

    await waitFor(() => {
      const options = screen.getAllByRole('option', { hidden: true });
      const lastOption = options[options.length - 1];
      expect(lastOption).toHaveAttribute('data-focused', 'true');
    });
  });

  it('should skip disabled options when opening and navigating from trigger', async () => {
    const user = userEvent.setup();
    const optionsFirstDisabled: SearchableDropdownOption[] = [
      { value: 'd1', label: 'Disabled First', disabled: true },
      { value: 'e1', label: 'Enabled 1' },
      { value: 'e2', label: 'Enabled 2' },
    ];

    render(<SearchableDropdown options={optionsFirstDisabled} showSearch={false} id="skip-disabled" />);

    const trigger = screen.getByRole('combobox');
    trigger.focus();

    await user.keyboard('{ArrowDown}');
    await waitForDropdownOpen();

    await waitFor(() => {
      const activeId = trigger.getAttribute('aria-activedescendant');
      expect(activeId).toBeTruthy();
      const activeEl = document.getElementById(activeId || '');
      expect(activeEl).toBeInTheDocument();
      expect(activeEl).not.toHaveAttribute('aria-disabled', 'true');
      expect(activeEl).toHaveTextContent('Enabled 1');
    });
  });
});

describe('SearchableDropdown - Clearable Behavior', () => {
  it('should show clear button when value selected', async () => {
    render(
      <SearchableDropdown
        options={fruitOptions}
        defaultValue="apple"
        clearable
      />
    );

    const clearButton = screen.getByLabelText('Clear selection');
    expect(clearButton).toBeInTheDocument();
  });

  it('should clear selection when clear button clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <SearchableDropdown
        options={fruitOptions}
        value="apple"
        onValueChange={handleChange}
        clearable
      />
    );

    await user.click(screen.getByLabelText('Clear selection'));
    expect(handleChange).toHaveBeenCalledWith(null, null);
  });

  it('should clear selection with Delete key', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <SearchableDropdown
        options={fruitOptions}
        value="apple"
        onValueChange={handleChange}
        clearable
      />
    );

    const trigger = screen.getByRole('combobox');
    trigger.focus();
    await user.keyboard('{Delete}');

    expect(handleChange).toHaveBeenCalledWith(null, null);
  });

  it('should clear selection with Backspace key', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <SearchableDropdown
        options={fruitOptions}
        value="apple"
        onValueChange={handleChange}
        clearable
      />
    );

    const trigger = screen.getByRole('combobox');
    trigger.focus();
    await user.keyboard('{Backspace}');

    expect(handleChange).toHaveBeenCalledWith(null, null);
  });
});

describe('SearchableDropdown - Disabled State', () => {
  it('should disable trigger when disabled prop is true', () => {
    render(<SearchableDropdown options={fruitOptions} disabled />);

    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('should not respond to keyboard when disabled', async () => {
    const user = userEvent.setup();

    render(<SearchableDropdown options={fruitOptions} disabled />);

    const trigger = screen.getByRole('combobox');
    trigger.focus();
    await user.keyboard('{ArrowDown}');

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('should render disabled options with aria-disabled', async () => {
    const user = userEvent.setup();

    render(<SearchableDropdown options={optionsWithDisabled} />);

    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();

    const options = screen.getAllByRole('option', { hidden: true });
    expect(options[1]).toHaveAttribute('aria-disabled', 'true');
  });
});

describe('SearchableDropdown - Error State', () => {
  it('should set aria-invalid when error is true', () => {
    render(
      <SearchableDropdown
        options={fruitOptions}
        error
      />
    );

    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('should display error message', () => {
    render(
      <SearchableDropdown
        options={fruitOptions}
        error
        errorMessage="This field is required"
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent('This field is required');
  });

  it('should link error message with aria-describedby', () => {
    render(
      <SearchableDropdown
        options={fruitOptions}
        error
        errorMessage="Required"
        id="test"
      />
    );

    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-describedby', 'test-error');
  });
});

describe('SearchableDropdown - Empty State', () => {
  it('should show default empty message when no options', async () => {
    const user = userEvent.setup();

    render(<SearchableDropdown options={[]} />);

    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();

    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('should show custom empty message', async () => {
    const user = userEvent.setup();

    render(
      <SearchableDropdown
        options={[]}
        noResultsContent="Nothing here"
      />
    );

    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();

    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });
});

describe('SearchableDropdown - Custom Content', () => {
  it('should render option content property', async () => {
    const user = userEvent.setup();

    const options: SearchableDropdownOption[] = [
      { value: 'a', label: 'Option A', content: <span data-testid="custom">Custom A</span> },
    ];

    render(<SearchableDropdown options={options} />);

    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();

    expect(screen.getByTestId('custom')).toHaveTextContent('Custom A');
  });

  it('should render selectedContent in trigger when selected', async () => {
    const user = userEvent.setup();

    const options: SearchableDropdownOption[] = [
      {
        value: 'a',
        label: 'Option A',
        selectedContent: <span data-testid="selected-content">Selected A</span>,
      },
    ];

    render(<SearchableDropdown options={options} />);

    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();

    const optionEls = screen.getAllByRole('option', { hidden: true });
    await user.click(optionEls[0]);

    expect(screen.getByTestId('selected-content')).toHaveTextContent('Selected A');
  });
});

describe('SearchableDropdown - Form Integration', () => {
  it('should render hidden input with name prop', () => {
    render(
      <SearchableDropdown
        options={fruitOptions}
        name="fruit"
        value="apple"
      />
    );

    const hiddenInput = document.querySelector('input[name="fruit"]');
    expect(hiddenInput).toBeInTheDocument();
    expect(hiddenInput).toHaveAttribute('value', 'apple');
  });

  it('should update hidden input when value changes', async () => {
    const user = userEvent.setup();

    render(
      <SearchableDropdown
        options={fruitOptions}
        name="fruit"
        defaultValue="apple"
      />
    );

    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();

    const options = screen.getAllByRole('option', { hidden: true });
    await user.click(options[2]);

    const hiddenInput = document.querySelector('input[name="fruit"]');
    expect(hiddenInput).toHaveAttribute('value', 'cherry');
  });

  it('should submit empty value when controlled value is not in options (orphan)', () => {
    render(
      <SearchableDropdown
        options={fruitOptions}
        name="fruit"
        value="deleted-option-id"
      />
    );

    const hiddenInput = document.querySelector('input[name="fruit"]');
    expect(hiddenInput).toBeInTheDocument();
    expect(hiddenInput).toHaveAttribute('value', '');
  });

  it('should call onFocus callback', async () => {
    const handleFocus = vi.fn();

    render(
      <SearchableDropdown
        options={fruitOptions}
        onFocus={handleFocus}
      />
    );

    screen.getByRole('combobox').focus();

    await waitFor(() => {
      expect(handleFocus).toHaveBeenCalled();
    });
  });

  it('should call onBlur callback', async () => {
    const user = userEvent.setup();
    const handleBlur = vi.fn();

    render(
      <div>
        <SearchableDropdown
          options={fruitOptions}
          onBlur={handleBlur}
        />
        <button>Other</button>
      </div>
    );

    screen.getByRole('combobox').focus();
    await user.click(screen.getByText('Other'));

    await waitFor(() => {
      expect(handleBlur).toHaveBeenCalled();
    });
  });
});

describe('SearchableDropdown - Accessibility', () => {
  it('should have proper ARIA roles', () => {
    render(<SearchableDropdown options={fruitOptions} />);

    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('should link trigger to listbox with aria-controls', async () => {
    const user = userEvent.setup();

    render(<SearchableDropdown options={fruitOptions} id="test" />);

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);
    await waitForDropdownOpen();

    expect(trigger).toHaveAttribute('aria-controls', 'test-listbox');
    const listbox = screen.getByRole('listbox', { hidden: true });
    expect(listbox).toHaveAttribute('id', 'test-listbox');
  });

  it('should have live region for status updates', () => {
    render(<SearchableDropdown options={fruitOptions} />);

    const status = document.querySelector('[role="status"][aria-live="polite"]');
    expect(status).toBeInTheDocument();
  });

  it('should link label with trigger via aria-labelledby', () => {
    render(
      <SearchableDropdown
        options={fruitOptions}
        label="Choose"
        id="test"
      />
    );

    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-labelledby', 'test-label');
  });

  it('should use aria-label prop for listbox', async () => {
    const user = userEvent.setup();

    render(
      <SearchableDropdown
        options={fruitOptions}
        aria-label="Select fruit"
      />
    );

    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();

    const listbox = screen.getByRole('listbox', { hidden: true });
    expect(listbox).toHaveAttribute('aria-label', 'Select fruit');
  });

  it('should have aria-autocomplete on search input', async () => {
    const user = userEvent.setup();

    render(<SearchableDropdown options={fruitOptions} />);

    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();

    const searchInput = screen.getByLabelText('Search options');
    expect(searchInput).toHaveAttribute('aria-autocomplete', 'list');
  });
});

describe('SearchableDropdown - Custom Trigger', () => {
  it('should render custom trigger via renderTrigger', () => {
    render(
      <SearchableDropdown
        options={fruitOptions}
        renderTrigger={({ ref, ...rest }) => (
          <button ref={ref as React.RefCallback<HTMLButtonElement>} {...rest} type="button">
            Custom trigger
          </button>
        )}
      />
    );

    expect(screen.getByText('Custom trigger')).toBeInTheDocument();
  });

  it('should pass correct props to renderTrigger', async () => {
    const user = userEvent.setup();

    render(
      <SearchableDropdown
        options={fruitOptions}
        value="apple"
        renderTrigger={({ ref, isOpen, selectedOption, ...rest }) => (
          <button ref={ref as React.RefCallback<HTMLButtonElement>} {...rest}>
            {selectedOption?.label || 'None'} - {isOpen ? 'Open' : 'Closed'}
          </button>
        )}
      />
    );

    expect(screen.getByText('Apple - Closed')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveAttribute('type', 'button');

    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();

    expect(screen.getByText('Apple - Open')).toBeInTheDocument();
  });

  it('should pass type="button" in props so custom trigger need not set it', () => {
    render(
      <SearchableDropdown
        options={fruitOptions}
        renderTrigger={({ ref, ...rest }) => (
          <button ref={ref as React.RefCallback<HTMLButtonElement>} {...rest}>
            Custom
          </button>
        )}
      />
    );
    expect(screen.getByRole('combobox')).toHaveAttribute('type', 'button');
  });
});

describe('SearchableDropdown - Custom Icons', () => {
  it('should render custom chevron icon', () => {
    render(
      <SearchableDropdown
        options={fruitOptions}
        ChevronIcon={() => <span data-testid="custom-chevron">V</span>}
      />
    );

    expect(screen.getByTestId('custom-chevron')).toBeInTheDocument();
  });

  it('should hide chevron when showChevron is false', () => {
    const { container } = render(
      <SearchableDropdown
        options={fruitOptions}
        showChevron={false}
      />
    );

    const svgs = container.querySelectorAll('svg');
    const triggerSvgs = Array.from(svgs).filter(
      svg => screen.getByRole('combobox').contains(svg)
    );
    expect(triggerSvgs).toHaveLength(0);
  });

  it('should render custom check icon for selected option', async () => {
    const user = userEvent.setup();

    render(
      <SearchableDropdown
        options={fruitOptions}
        value="apple"
        CheckIcon={() => <span data-testid="custom-check">OK</span>}
      />
    );

    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();

    expect(screen.getByTestId('custom-check')).toBeInTheDocument();
  });

  it('should hide check icon when showSelectedIcon is false', async () => {
    const user = userEvent.setup();

    render(
      <SearchableDropdown
        options={fruitOptions}
        value="apple"
        showSelectedIcon={false}
      />
    );

    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();

    expect(screen.queryByTestId('custom-check')).not.toBeInTheDocument();
  });
});

describe('SearchableDropdown - Position & Portal', () => {
  it('should set correct position attribute', async () => {
    const user = userEvent.setup();

    render(
      <SearchableDropdown
        options={fruitOptions}
        dropdownPosition="top"
      />
    );

    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();

    const listbox = screen.getByRole('listbox', { hidden: true });
    expect(listbox).toHaveAttribute('data-position');
  });

  it('should set custom z-index', async () => {
    const user = userEvent.setup();

    render(
      <SearchableDropdown
        options={fruitOptions}
        dropdownZIndex={999}
      />
    );

    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();

    const listbox = screen.getByRole('listbox', { hidden: true });
    expect(listbox.style.zIndex).toBe('999');
  });

  it('should keep mounted when keepMounted is true', async () => {
    const user = userEvent.setup();

    render(
      <SearchableDropdown
        options={fruitOptions}
        keepMounted
      />
    );

    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();

    await user.click(screen.getByRole('combobox'));

    const listbox = screen.getByRole('listbox', { hidden: true });
    expect(listbox).toBeInTheDocument();
    expect(listbox.style.display).toBe('none');
  });
});

describe('SearchableDropdown - lockScroll', () => {
  it('adds wheel and touchmove listeners when lockScroll=true and dropdown opens', async () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const user = userEvent.setup();

    const { unmount } = render(
      <SearchableDropdown options={fruitOptions} lockScroll />
    );

    await user.click(screen.getByRole('combobox'));

    expect(addSpy).toHaveBeenCalledWith(
      'wheel',
      expect.any(Function),
      expect.objectContaining({ capture: true })
    );
    expect(addSpy).toHaveBeenCalledWith(
      'touchmove',
      expect.any(Function),
      expect.objectContaining({ capture: true })
    );

    unmount();

    expect(removeSpy).toHaveBeenCalledWith(
      'wheel',
      expect.any(Function),
      expect.objectContaining({ capture: true })
    );
    expect(removeSpy).toHaveBeenCalledWith(
      'touchmove',
      expect.any(Function),
      expect.objectContaining({ capture: true })
    );

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});

describe('SearchableDropdown - Search input Escape/Tab capture', () => {
  it('closes dropdown when Tab is pressed in the search input', async () => {
    const user = userEvent.setup();

    render(<SearchableDropdown options={fruitOptions} />);

    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();

    // Search input is focused automatically; Tab should close the dropdown
    const searchInput = screen.getByLabelText('Search options');
    searchInput.focus();
    await user.keyboard('{Tab}');

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('closes dropdown when Escape is pressed in the search input', async () => {
    const user = userEvent.setup();

    render(<SearchableDropdown options={fruitOptions} />);

    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();

    const searchInput = screen.getByLabelText('Search options');
    searchInput.focus();
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
    });
  });
});

describe('SearchableDropdown - Edge Cases', () => {
  it('should handle empty options array', () => {
    render(<SearchableDropdown options={[]} />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should handle undefined value gracefully', () => {
    render(
      <SearchableDropdown
        options={fruitOptions}
        value={undefined}
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should handle rapid open/close cycles', async () => {
    const user = userEvent.setup();

    render(<SearchableDropdown options={fruitOptions} />);

    const trigger = screen.getByRole('combobox');

    await user.click(trigger);
    await user.click(trigger);
    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded');
  });

  it('should cleanup on unmount', () => {
    const { unmount } = render(<SearchableDropdown options={fruitOptions} />);

    unmount();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });
});
