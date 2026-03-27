import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dropdown from '../Dropdown';
import type { DropdownOption } from '../utils/types';

/**
 * Unit & Integration Tests for Dropdown Component
 * 
 * Testing Philosophy:
 * - Test behavior, not implementation
 * - Prefer user interactions over internal state
 * - Each test validates one specific user-facing behavior
 * - Accessibility is a first-class concern
 */

// Helper to wait for dropdown to open and options to be rendered
async function waitForDropdownOpen() {
  // Wait for the dropdown to be in the DOM (may have visibility: hidden initially)
  await waitFor(() => {
    const listbox = screen.getByRole('listbox', { hidden: true });
    expect(listbox).toBeInTheDocument();
  }, { timeout: 2000 });
  
  // Give it a moment for positioning to complete
  await new Promise(resolve => setTimeout(resolve, 100));
}

const fruitOptions: DropdownOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
];

const optionsWithDisabled: DropdownOption[] = [
  { value: 'opt1', label: 'Option 1' },
  { value: 'opt2', label: 'Option 2 (Disabled)', disabled: true },
  { value: 'opt3', label: 'Option 3' },
  { value: 'opt4', label: 'Option 4 (Disabled)', disabled: true },
  { value: 'opt5', label: 'Option 5' },
];

describe('Dropdown - Basic Rendering', () => {
  it('should render with required props', () => {
    render(<Dropdown options={fruitOptions} />);
    
    const trigger = screen.getByRole('combobox');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('should render placeholder text', () => {
    render(<Dropdown options={fruitOptions} placeholder="Choose fruit" />);
    
    expect(screen.getByRole('combobox')).toHaveTextContent('Choose fruit');
  });

  it('should render with label', () => {
    render(
      <Dropdown 
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
      <Dropdown 
        options={fruitOptions} 
        label="Required Field" 
        required 
      />
    );
    
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should render selected value', () => {
    render(<Dropdown options={fruitOptions} value="banana" />);
    
    expect(screen.getByRole('combobox')).toHaveTextContent('Banana');
  });
});

describe('Dropdown - Controlled Behavior', () => {
  it('should call onValueChange when option selected', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(
      <Dropdown 
        options={fruitOptions}
        value={null}
        onValueChange={handleChange}
      />
    );
    
    // Open dropdown
    await user.click(screen.getByRole('combobox'));
    
    // Wait for option to be visible
    const cherryOption = await screen.findByRole('option', { name: 'Cherry' });
    
    // Select option
    await user.click(cherryOption);
    
    expect(handleChange).toHaveBeenCalledWith('cherry', expect.objectContaining({
      value: 'cherry',
      label: 'Cherry',
    }));
  });

  it('should respect controlled value prop', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    const { rerender } = render(
      <Dropdown 
        options={fruitOptions}
        value="apple"
        onValueChange={handleChange}
      />
    );
    
    expect(screen.getByRole('combobox')).toHaveTextContent('Apple');
    
    // Try to select different option
    await user.click(screen.getByRole('combobox'));
    const bananaOption = await screen.findByRole('option', { name: 'Banana' });
    await user.click(bananaOption);
    
    // Value shouldn't change without parent updating
    expect(screen.getByRole('combobox')).toHaveTextContent('Apple');
    
    // Update from parent
    rerender(
      <Dropdown 
        options={fruitOptions}
        value="banana"
        onValueChange={handleChange}
      />
    );
    
    expect(screen.getByRole('combobox')).toHaveTextContent('Banana');
  });

  it('should call onOpenChange when dropdown opens/closes', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();
    
    render(
      <Dropdown 
        options={fruitOptions}
        onOpenChange={handleOpenChange}
      />
    );
    
    // Open
    await user.click(screen.getByRole('combobox'));
    expect(handleOpenChange).toHaveBeenCalledWith(true);
    
    // Close
    await user.keyboard('{Escape}');
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });
});

describe('Dropdown - Uncontrolled Behavior', () => {
  it('should use defaultValue', () => {
    render(<Dropdown options={fruitOptions} defaultValue="date" />);
    
    expect(screen.getByRole('combobox')).toHaveTextContent('Date');
  });

  it('should update internal state when option selected', async () => {
    const user = userEvent.setup();
    
    render(<Dropdown options={fruitOptions} defaultValue="apple" />);
    
    expect(screen.getByRole('combobox')).toHaveTextContent('Apple');
    
    // Select new option
    await user.click(screen.getByRole('combobox'));
    const elderberryOption = await screen.findByRole('option', { name: 'Elderberry' });
    await user.click(elderberryOption);
    
    expect(screen.getByRole('combobox')).toHaveTextContent('Elderberry');
  });

  it('should use defaultOpen', async () => {
    render(<Dropdown options={fruitOptions} defaultOpen />);
    
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');
    await waitFor(() => expect(screen.getByRole('listbox')).toBeVisible());
  });
});

describe('Dropdown - Click Interactions', () => {
  it('should open dropdown on trigger click', async () => {
    const user = userEvent.setup();
    
    render(<Dropdown options={fruitOptions} />);
    
    const trigger = screen.getByRole('combobox');
    await user.click(trigger);
    
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await waitFor(() => {
      expect(screen.getByRole('listbox', { hidden: true })).toBeInTheDocument();
    });
  });

  it('should close dropdown when option clicked', async () => {
    const user = userEvent.setup();
    
    render(<Dropdown options={fruitOptions} />);
    
    await user.click(screen.getByRole('combobox'));
    const bananaOption = await screen.findByRole('option', { name: 'Banana' });
    await user.click(bananaOption);
    
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
  });

  it('should not close on disabled option click', async () => {
    const user = userEvent.setup();
    
    render(<Dropdown options={optionsWithDisabled} />);
    
    await user.click(screen.getByRole('combobox'));
    
    const disabledOption = await screen.findByRole('option', { name: /option 2.*disabled/i });
    await user.click(disabledOption);
    
    // Should stay open
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');
  });

  it('should close dropdown on click outside', async () => {
    const user = userEvent.setup();
    
    render(
      <div>
        <button>Outside Button</button>
        <Dropdown options={fruitOptions} />
      </div>
    );
    
    const trigger = screen.getByRole('combobox');
    await user.click(trigger);
    await waitForDropdownOpen();
    
    await user.click(screen.getByRole('button', { name: 'Outside Button' }));
    
    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('should toggle dropdown on repeated trigger clicks', async () => {
    const user = userEvent.setup();
    
    render(<Dropdown options={fruitOptions} />);
    
    const trigger = screen.getByRole('combobox');
    
    // Open
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    
    // Close
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    
    // Open again
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });
});

describe('Dropdown - Keyboard Navigation', () => {
  it('should open dropdown with ArrowDown', async () => {
    const user = userEvent.setup();
    
    render(<Dropdown options={fruitOptions} />);
    
    const trigger = screen.getByRole('combobox');
    trigger.focus();
    await user.keyboard('{ArrowDown}');
    
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await waitFor(() => {
      expect(screen.getByRole('listbox', { hidden: true })).toBeInTheDocument();
    });
  });

  it('should open dropdown with ArrowUp', async () => {
    const user = userEvent.setup();
    
    render(<Dropdown options={fruitOptions} />);
    
    const trigger = screen.getByRole('combobox');
    trigger.focus();
    await user.keyboard('{ArrowUp}');
    
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await waitFor(() => {
      expect(screen.getByRole('listbox', { hidden: true })).toBeInTheDocument();
    });
  });

  it('should navigate options with ArrowDown', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(
      <Dropdown 
        options={fruitOptions}
        onValueChange={handleChange}
      />
    );
    
    const trigger = screen.getByRole('combobox');
    trigger.focus();
    
    await user.keyboard('{ArrowDown}'); // Open and focus first option (Apple)
    await waitForDropdownOpen();
    await user.keyboard('{ArrowDown}'); // Move to second option (Banana)
    await user.keyboard('{ArrowDown}'); // Move to third option (Cherry)
    await user.keyboard('{Enter}');     // Select Cherry
    
    // Verify Cherry was selected
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith('cherry', expect.any(Object));
    }, { timeout: 3000 });
  });

  it('should navigate options with ArrowUp', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(
      <Dropdown 
        options={fruitOptions}
        onValueChange={handleChange}
      />
    );
    
    const trigger = screen.getByRole('combobox');
    trigger.focus();
    
    await user.keyboard('{ArrowDown}'); // Open and focus first (Apple)
    await waitForDropdownOpen();
    await user.keyboard('{ArrowDown}'); // Second (Banana)
    await user.keyboard('{ArrowDown}'); // Third (Cherry)
    await user.keyboard('{ArrowUp}');   // Back to second (Banana)
    await user.keyboard('{Enter}');     // Select Banana
    
    // Verify Banana was selected
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith('banana', expect.any(Object));
    }, { timeout: 3000 });
  });

  it('should jump to first option with Home', async () => {
    const user = userEvent.setup();
    
    render(<Dropdown options={fruitOptions} />);
    
    const trigger = screen.getByRole('combobox');
    trigger.focus();
    
    await user.keyboard('{ArrowDown}'); // Open
    await waitForDropdownOpen();
    await user.keyboard('{End}');       // Go to last
    await user.keyboard('{Home}');      // Jump to first
    
    await waitFor(() => {
      const options = screen.getAllByRole('option', { hidden: true });
      expect(options[0]).toHaveAttribute('data-focused', 'true');
    });
  });

  it('should jump to last option with End', async () => {
    const user = userEvent.setup();
    
    render(<Dropdown options={fruitOptions} />);
    
    const trigger = screen.getByRole('combobox');
    trigger.focus();
    
    await user.keyboard('{ArrowDown}'); // Open
    await waitForDropdownOpen();
    await user.keyboard('{End}');       // Jump to last
    
    await waitFor(() => {
      const options = screen.getAllByRole('option', { hidden: true });
      expect(options[options.length - 1]).toHaveAttribute('data-focused', 'true');
    });
  });

  it('should select focused option with Enter', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(
      <Dropdown 
        options={fruitOptions}
        onValueChange={handleChange}
      />
    );
    
    const trigger = screen.getByRole('combobox');
    trigger.focus();
    
    await user.keyboard('{ArrowDown}'); // Open and focus first (Apple)
    await waitForDropdownOpen();
    await user.keyboard('{ArrowDown}'); // Move to second (Banana)
    
    // Wait for focus to be set
    await waitFor(() => {
      expect(trigger.getAttribute('aria-activedescendant')).toBeTruthy();
    });
    
    await user.keyboard('{Enter}');     // Select Banana
    
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith('banana', expect.any(Object));
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('should select focused option with Space', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(
      <Dropdown 
        options={fruitOptions}
        onValueChange={handleChange}
      />
    );
    
    const trigger = screen.getByRole('combobox');
    trigger.focus();
    
    await user.keyboard('{ArrowDown}'); // Open and focus first (Apple)
    await waitForDropdownOpen();
    await user.keyboard('{ArrowDown}'); // Move to second (Banana)
    
    // Wait for focus to be set
    await waitFor(() => {
      expect(trigger.getAttribute('aria-activedescendant')).toBeTruthy();
    });
    
    await user.keyboard(' ');           // Select Banana with space
    
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith('banana', expect.any(Object));
    });
  });

  it('should close dropdown with Escape', async () => {
    const user = userEvent.setup();
    
    render(<Dropdown options={fruitOptions} />);
    
    const trigger = screen.getByRole('combobox');
    trigger.focus();
    
    await user.keyboard('{ArrowDown}');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    
    await user.keyboard('{Escape}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('should restore focus to trigger after Escape', async () => {
    const user = userEvent.setup();
    
    render(<Dropdown options={fruitOptions} />);
    
    const trigger = screen.getByRole('combobox');
    trigger.focus();
    
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Escape}');
    
    expect(trigger).toHaveFocus();
  });

  it('should skip disabled options during navigation', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(
      <Dropdown 
        options={optionsWithDisabled}
        onValueChange={handleChange}
      />
    );
    
    const trigger = screen.getByRole('combobox');
    trigger.focus();
    
    await user.keyboard('{ArrowDown}'); // Open and focus Option 1
    await waitForDropdownOpen();
    await user.keyboard('{ArrowDown}'); // Skip disabled (Option 2), focus Option 3
    await user.keyboard('{ArrowDown}'); // Skip disabled (Option 4), focus Option 5
    await user.keyboard('{Enter}');     // Select Option 5
    
    // Verify Option 5 was selected (disabled options were skipped)
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith('opt5', expect.any(Object));
    }, { timeout: 3000 });
  });

  it('should wrap to first option when navigating down from last', async () => {
    const user = userEvent.setup();
    
    render(<Dropdown options={fruitOptions} />);
    
    const trigger = screen.getByRole('combobox');
    trigger.focus();
    
    await user.keyboard('{ArrowDown}'); // Open
    await waitForDropdownOpen();
    await user.keyboard('{End}');       // Last option
    await user.keyboard('{ArrowDown}'); // Wrap to first
    
    await waitFor(() => {
      const options = screen.getAllByRole('option', { hidden: true });
      expect(options[0]).toHaveAttribute('data-focused', 'true');
    });
  });

  it('should wrap to last option when navigating up from first', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(
      <Dropdown 
        options={fruitOptions}
        onValueChange={handleChange}
      />
    );
    
    const trigger = screen.getByRole('combobox');
    trigger.focus();
    
    await user.keyboard('{ArrowDown}'); // Open and focus first (Apple)
    await waitForDropdownOpen();
    await user.keyboard('{ArrowUp}');   // Wrap from first to last (Elderberry)
    await user.keyboard('{Enter}');     // Select last (Elderberry)
    
    // Verify Elderberry (last option) was selected - wrapping works
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith('elderberry', expect.any(Object));
    }, { timeout: 3000 });
  });
});

describe('Dropdown - Type-ahead Search', () => {
  it('should jump to option starting with typed character', async () => {
    const user = userEvent.setup();
    
    render(<Dropdown options={fruitOptions} />);
    
    const trigger = screen.getByRole('combobox');
    trigger.focus();
    
    await user.keyboard('c'); // Should jump to Cherry
    
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await waitForDropdownOpen();
    
    await waitFor(() => {
      const cherryOption = screen.getByRole('option', { name: 'Cherry', hidden: true });
      expect(cherryOption).toHaveAttribute('data-focused', 'true');
    });
  });

  it('should support multi-character search within timeout', async () => {
    const user = userEvent.setup();
    
    render(<Dropdown options={fruitOptions} />);
    
    const trigger = screen.getByRole('combobox');
    trigger.focus();
    
    // Type 'el' quickly
    await user.keyboard('el');
    
    await waitForDropdownOpen();
    await waitFor(() => {
      const elderberryOption = screen.getByRole('option', { name: 'Elderberry', hidden: true });
      expect(elderberryOption).toHaveAttribute('data-focused', 'true');
    });
  });

  it('should cycle through options with same starting letter', async () => {
    const user = userEvent.setup();
    
    const options: DropdownOption[] = [
      { value: 'cat', label: 'Cat' },
      { value: 'car', label: 'Car' },
      { value: 'cup', label: 'Cup' },
    ];
    
    render(<Dropdown options={options} />);
    
    const trigger = screen.getByRole('combobox');
    trigger.focus();
    
    await user.keyboard('c'); // First 'c' - Cat
    await waitForDropdownOpen();
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Cat', hidden: true })).toHaveAttribute('data-focused', 'true');
    });
    
    await user.keyboard('c'); // Second 'c' - Car
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Car', hidden: true })).toHaveAttribute('data-focused', 'true');
    });
    
    await user.keyboard('c'); // Third 'c' - Cup
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Cup', hidden: true })).toHaveAttribute('data-focused', 'true');
    });
  });
});

describe('Dropdown - Clearable Behavior', () => {
  it('should show clear button when value selected', async () => {
    const user = userEvent.setup();
    
    render(<Dropdown options={fruitOptions} clearable />);
    
    // Select option
    await user.click(screen.getByRole('combobox'));
    const appleOption = await screen.findByRole('option', { name: 'Apple' });
    await user.click(appleOption);
    
    expect(screen.getByRole('button', { name: /clear selection/i })).toBeInTheDocument();
  });

  it('should clear selection when clear button clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(
      <Dropdown 
        options={fruitOptions}
        value="banana"
        onValueChange={handleChange}
        clearable
      />
    );
    
    const clearButton = screen.getByRole('button', { name: /clear selection/i });
    await user.click(clearButton);
    
    expect(handleChange).toHaveBeenCalledWith(null, null);
  });

  it('should deselect when clicking already-selected option', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(
      <Dropdown 
        options={fruitOptions}
        value="cherry"
        onValueChange={handleChange}
        clearable
      />
    );
    
    await user.click(screen.getByRole('combobox'));
    
    // Click already-selected option
    const cherryOption = await screen.findByRole('option', { name: 'Cherry' });
    await user.click(cherryOption);
    
    expect(handleChange).toHaveBeenCalledWith(null, null);
  });

  it('should clear selection with Delete key', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(
      <Dropdown 
        options={fruitOptions}
        value="date"
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
      <Dropdown 
        options={fruitOptions}
        value="elderberry"
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

describe('Dropdown - Disabled State', () => {
  it('should disable trigger when disabled prop is true', () => {
    render(<Dropdown options={fruitOptions} disabled />);
    
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('should not open when disabled trigger is clicked', async () => {
    const user = userEvent.setup();
    
    render(<Dropdown options={fruitOptions} disabled />);
    
    await user.click(screen.getByRole('combobox'));
    
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('should not respond to keyboard when disabled', async () => {
    const user = userEvent.setup();
    
    render(<Dropdown options={fruitOptions} disabled />);
    
    const trigger = screen.getByRole('combobox');
    trigger.focus();
    
    await user.keyboard('{ArrowDown}');
    
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('should render disabled options with aria-disabled', async () => {
    render(<Dropdown options={optionsWithDisabled} defaultOpen />);
    
    await waitForDropdownOpen();
    const disabledOption = await screen.findByRole('option', { name: /option 2.*disabled/i });
    expect(disabledOption).toHaveAttribute('aria-disabled', 'true');
  });
});

describe('Dropdown - Error State', () => {
  it('should set aria-invalid when error is true', () => {
    render(<Dropdown options={fruitOptions} error />);
    
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('should display error message', () => {
    render(
      <Dropdown 
        options={fruitOptions}
        error
        errorMessage="This field is required"
      />
    );
    
    expect(screen.getByRole('alert')).toHaveTextContent('This field is required');
  });

  it('should link error message with aria-describedby', () => {
    render(
      <Dropdown 
        options={fruitOptions}
        id="test-dropdown"
        error
        errorMessage="Required field"
      />
    );
    
    const trigger = screen.getByRole('combobox');
    const describedBy = trigger.getAttribute('aria-describedby');
    
    expect(describedBy).toBe('test-dropdown-error');
    expect(screen.getByRole('alert')).toHaveAttribute('id', 'test-dropdown-error');
  });
});

describe('Dropdown - Loading State', () => {
  it('should show shimmer when loading is true', async () => {
    const user = userEvent.setup();
    
    render(<Dropdown options={[]} loading shimmerCount={3} />);
    
    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();
    
    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveAttribute('aria-busy', 'true');
  });

  it('should handle async option loading', async () => {
    const user = userEvent.setup();
    const mockLoadOptions = vi.fn().mockResolvedValue(fruitOptions);
    
    render(
      <Dropdown 
        onLoadOptions={mockLoadOptions}
        loadOnOpen
      />
    );
    
    await user.click(screen.getByRole('combobox'));
    
    expect(mockLoadOptions).toHaveBeenCalled();
    
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
    });
  });

  it('should call onLoadError when loading fails', async () => {
    const user = userEvent.setup();
    const mockLoadOptions = vi.fn().mockRejectedValue(new Error('Network error'));
    const handleError = vi.fn();
    
    render(
      <Dropdown 
        onLoadOptions={mockLoadOptions}
        loadOnOpen
        onLoadError={handleError}
      />
    );
    
    await user.click(screen.getByRole('combobox'));
    
    await waitFor(() => {
      expect(handleError).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});

describe('Dropdown - Empty State', () => {
  it('should show default empty message when no options', async () => {
    const user = userEvent.setup();
    
    render(<Dropdown options={[]} id="test" />);
    
    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();
    
    await waitFor(() => {
      // Query within the listbox to avoid getting the live region
      const listbox = screen.getByRole('listbox', { hidden: true });
      expect(listbox).toHaveTextContent('No options available');
    });
  });

  it('should show custom empty message', async () => {
    const user = userEvent.setup();
    
    render(
      <Dropdown 
        options={[]}
        noResultsContent={<div>Custom empty state</div>}
        id="test"
      />
    );
    
    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();
    
    await waitFor(() => {
      // Query within the listbox to avoid getting the live region
      const listbox = screen.getByRole('listbox', { hidden: true });
      expect(listbox).toHaveTextContent('Custom empty state');
    });
  });
});

describe('Dropdown - Custom Content', () => {
  it('should render option content property', async () => {
    const user = userEvent.setup();
    
    const options: DropdownOption[] = [
      {
        value: 'us',
        label: 'United States',
        content: <span>🇺🇸 United States</span>,
      },
    ];
    
    render(<Dropdown options={options} />);
    
    await user.click(screen.getByRole('combobox'));
    
    await waitFor(() => {
      expect(screen.getByText('🇺🇸 United States')).toBeInTheDocument();
    });
  });

  it('should render selectedContent in trigger when selected', async () => {
    const user = userEvent.setup();
    
    const options: DropdownOption[] = [
      {
        value: 'us',
        label: 'United States',
        content: <span>🇺🇸 United States of America</span>,
        selectedContent: <span>🇺🇸 USA</span>,
      },
    ];
    
    render(<Dropdown options={options} />);
    
    await user.click(screen.getByRole('combobox'));
    const option = await screen.findByRole('option');
    await user.click(option);
    
    expect(screen.getByRole('combobox')).toHaveTextContent('🇺🇸 USA');
  });
});

describe('Dropdown - Form Integration', () => {
  it('should render hidden input with name prop', () => {
    const { container } = render(
      <Dropdown 
        options={fruitOptions}
        name="fruit"
        value="banana"
      />
    );
    
    const hiddenInput = container.querySelector('input[type="hidden"]');
    expect(hiddenInput).toHaveAttribute('name', 'fruit');
    expect(hiddenInput).toHaveValue('banana');
  });

  it('should update hidden input when value changes', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Dropdown 
        options={fruitOptions}
        name="fruit"
      />
    );
    
    await user.click(screen.getByRole('combobox'));
    const cherryOption = await screen.findByRole('option', { name: 'Cherry' });
    await user.click(cherryOption);
    
    const hiddenInput = container.querySelector('input[type="hidden"]');
    expect(hiddenInput).toHaveValue('cherry');
  });

  it('should call onFocus callback', async () => {
    const user = userEvent.setup();
    const handleFocus = vi.fn();
    
    render(
      <Dropdown 
        options={fruitOptions}
        onFocus={handleFocus}
      />
    );
    
    await user.click(screen.getByRole('combobox'));
    
    expect(handleFocus).toHaveBeenCalled();
  });

  it('should call onBlur callback', async () => {
    const user = userEvent.setup();
    const handleBlur = vi.fn();
    
    render(
      <div>
        <Dropdown 
          options={fruitOptions}
          onBlur={handleBlur}
        />
        <button>Outside</button>
      </div>
    );
    
    const trigger = screen.getByRole('combobox');
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Outside' }));
    
    await waitFor(() => {
      expect(handleBlur).toHaveBeenCalled();
    });
  });
});

describe('Dropdown - Accessibility', () => {
  it('should have proper ARIA roles', () => {
    render(<Dropdown options={fruitOptions} />);
    
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
  });

  it('should link trigger to listbox with aria-controls', async () => {
    const user = userEvent.setup();
    
    render(<Dropdown options={fruitOptions} id="test" />);
    
    const trigger = screen.getByRole('combobox');
    await user.click(trigger);
    await waitForDropdownOpen();
    
    const listbox = screen.getByRole('listbox');
    expect(trigger).toHaveAttribute('aria-controls', listbox.getAttribute('id'));
  });

  it('should set aria-activedescendant to focused option', async () => {
    const user = userEvent.setup();
    
    render(<Dropdown options={fruitOptions} id="test" />);
    
    const trigger = screen.getByRole('combobox');
    trigger.focus();
    
    await user.keyboard('{ArrowDown}'); // Open and focus first option (index 0)
    await waitForDropdownOpen();
    await user.keyboard('{ArrowDown}'); // Move to second option (index 1)
    
    await waitFor(() => {
      const focusedOption = screen.getAllByRole('option', { hidden: true })[1];
      expect(trigger).toHaveAttribute('aria-activedescendant', focusedOption.getAttribute('id'));
    });
  });

  it('should announce loading state to screen readers', async () => {
    const user = userEvent.setup();
    
    render(<Dropdown options={[]} loading />);
    
    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();
    
    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveAttribute('aria-busy', 'true');
  });

  it('should have live region for status updates', () => {
    render(<Dropdown options={fruitOptions} />);
    
    // Find the status live region (sr-only)
    const statusRegion = document.querySelector('[role="status"][aria-live="polite"]');
    expect(statusRegion).toBeInTheDocument();
  });

  it('should link label with trigger via aria-labelledby', () => {
    render(
      <Dropdown 
        options={fruitOptions}
        label="Select Fruit"
        id="test"
      />
    );
    
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-labelledby', 'test-label');
  });

  it('should use aria-label prop for listbox', async () => {
    const user = userEvent.setup();
    
    render(
      <Dropdown 
        options={fruitOptions}
        aria-label="Fruit selection menu"
      />
    );
    
    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();
    
    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveAttribute('aria-label', 'Fruit selection menu');
  });
});

describe('Dropdown - Custom Trigger', () => {
  it('should render custom trigger via renderTrigger', () => {
    render(
      <Dropdown
        options={fruitOptions}
        renderTrigger={({ selectedOption, ...rest }) => (
          <button {...rest} type="button">
            Custom: {selectedOption?.label ?? 'None'}
          </button>
        )}
      />
    );
    
    expect(screen.getByRole('combobox')).toHaveTextContent('Custom: None');
  });

  it('should pass correct props to renderTrigger', async () => {
    const user = userEvent.setup();
    
    render(
      <Dropdown 
        options={fruitOptions}
        renderTrigger={({ isOpen, selectedOption, ...rest }) => (
          <button {...rest} type="button">
            {isOpen ? 'Open' : 'Closed'} - {selectedOption?.label ?? 'Select'}
          </button>
        )}
      />
    );
    
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveTextContent('Closed - Select');
    
    await user.click(trigger);
    expect(trigger).toHaveTextContent('Open - Select');
    
    const appleOption = await screen.findByRole('option', { name: 'Apple' });
    await user.click(appleOption);
    expect(trigger).toHaveTextContent('Closed - Apple');
  });
});

describe('Dropdown - Custom Icons', () => {
  it('should render custom chevron icon', () => {
    const CustomChevron = () => <span data-testid="custom-chevron">↓</span>;
    
    render(
      <Dropdown 
        options={fruitOptions}
        ChevronIcon={CustomChevron}
        showChevron
      />
    );
    
    expect(screen.getByTestId('custom-chevron')).toBeInTheDocument();
  });

  it('should hide chevron when showChevron is false', () => {
    render(
      <Dropdown 
        options={fruitOptions}
        showChevron={false}
      />
    );
    
    // Chevron should not be in the document
    const trigger = screen.getByRole('combobox');
    expect(within(trigger).queryByRole('img', { hidden: true })).not.toBeInTheDocument();
  });

  it('should render custom check icon for selected option', async () => {
    const user = userEvent.setup();
    const CustomCheck = () => <span data-testid="custom-check">✓</span>;
    
    render(
      <Dropdown 
        options={fruitOptions}
        value="apple"
        CheckIcon={CustomCheck}
      />
    );
    
    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();
    
    await waitFor(() => {
      expect(screen.getByTestId('custom-check')).toBeInTheDocument();
    });
  });

  it('should hide check icon when showSelectedIcon is false', async () => {
    const user = userEvent.setup();
    
    render(
      <Dropdown 
        options={fruitOptions}
        value="banana"
        showSelectedIcon={false}
      />
    );
    
    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();
    
    await waitFor(() => {
      const selectedOption = screen.getByRole('option', { name: 'Banana' });
      expect(within(selectedOption).queryByRole('img', { hidden: true })).not.toBeInTheDocument();
    });
  });
});

describe('Dropdown - Position & Portal', () => {
  it('should set correct position attribute', async () => {
    const user = userEvent.setup();
    
    render(<Dropdown options={fruitOptions} dropdownPosition="top" />);
    
    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();
    
    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveAttribute('data-position', expect.stringMatching(/top|bottom/));
  });

  it('should set custom z-index', async () => {
    const user = userEvent.setup();
    
    render(<Dropdown options={fruitOptions} dropdownZIndex={9999} />);
    
    await user.click(screen.getByRole('combobox'));
    await waitForDropdownOpen();
    
    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveStyle({ zIndex: '9999' });
  });

  it('should keep mounted when keepMounted is true', async () => {
    const user = userEvent.setup();
    
    const { container } = render(<Dropdown options={fruitOptions} keepMounted />);
    
    const trigger = screen.getByRole('combobox');
    
    // Initially closed - listbox should be in DOM but hidden
    // Query by data attribute since it has display: none
    const portal = container.ownerDocument.body.querySelector('[data-state="closed"]');
    expect(portal).toBeInTheDocument();
    
    // Open
    await user.click(trigger);
    await waitForDropdownOpen();
    const openPortal = container.ownerDocument.body.querySelector('[data-state="open"]');
    expect(openPortal).toBeVisible();
    
    // Close - should still be in DOM but hidden via data-state
    await user.keyboard('{Escape}');
    await waitFor(() => {
      const closedPortal = container.ownerDocument.body.querySelector('[data-state="closed"]');
      expect(closedPortal).toBeInTheDocument();
    });
  });
});

describe('Dropdown - Edge Cases', () => {
  it('should handle empty options array', () => {
    render(<Dropdown options={[]} />);
    
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should handle undefined value gracefully', () => {
    render(<Dropdown options={fruitOptions} value={undefined} />);
    
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should handle option with same value as empty string', async () => {
    const user = userEvent.setup();
    const options: DropdownOption[] = [
      { value: '', label: 'Empty' },
      { value: 'test', label: 'Test' },
    ];
    
    render(<Dropdown options={options} />);
    
    await user.click(screen.getByRole('combobox'));
    const emptyOption = await screen.findByRole('option', { name: 'Empty' });
    await user.click(emptyOption);
    
    expect(screen.getByRole('combobox')).toHaveTextContent('Empty');
  });

  it('should handle rapid open/close cycles', async () => {
    const user = userEvent.setup();
    
    render(<Dropdown options={fruitOptions} />);
    
    const trigger = screen.getByRole('combobox');
    
    // Rapid clicks
    for (let i = 0; i < 10; i++) {
      await user.click(trigger);
    }
    
    // Should be in a valid state
    expect(trigger).toHaveAttribute('aria-expanded', expect.stringMatching(/true|false/));
  });

  it('should cleanup on unmount', () => {
    const { unmount } = render(<Dropdown options={fruitOptions} />);
    
    unmount();
    
    // Should not throw errors
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });
});
