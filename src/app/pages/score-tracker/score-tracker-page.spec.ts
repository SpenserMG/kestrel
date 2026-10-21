import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { vi } from 'vitest';
import { ScoreTrackerPage } from './score-tracker-page';
import { expectNoA11yViolations } from '../../test-utils/axe';

const STORAGE_KEY = 'kestrel.score-tracker';

class ScoreTrackerPageHarness {
  async renderComponent() {
    return render(ScoreTrackerPage);
  }

  cell(row: number, column: number) {
    return screen.getByRole('textbox', { name: `Row ${row + 1}, column ${column + 1}` });
  }

  cells() {
    return screen.getAllByRole('textbox');
  }
}

describe('ScoreTrackerPage', () => {
  let harness: ScoreTrackerPageHarness;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    localStorage.clear();
    harness = new ScoreTrackerPageHarness();
    user = userEvent.setup();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts with a 2-row by 4-column grid', async () => {
    await harness.renderComponent();
    expect(harness.cells()).toHaveLength(8);
  });

  it('reports no unsaved changes until a cell is edited', async () => {
    const { fixture } = await harness.renderComponent();
    expect(fixture.componentInstance.hasUnsavedProgress()).toBe(false);
  });

  it('typing into a cell updates it and marks unsaved changes', async () => {
    const { fixture } = await harness.renderComponent();

    await user.type(harness.cell(0, 0), 'Alex');

    expect(harness.cell(0, 0)).toHaveValue('Alex');
    expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
    expect(fixture.componentInstance.hasUnsavedProgress()).toBe(true);
  });

  it('adds a row of the same width when "Add row" is pressed', async () => {
    await harness.renderComponent();

    await user.click(screen.getByRole('button', { name: 'Add row' }));

    expect(harness.cells()).toHaveLength(12);
    expect(harness.cell(2, 3)).toBeInTheDocument();
  });

  it('adds a column to every row when "Add column" is pressed', async () => {
    await harness.renderComponent();

    await user.click(screen.getByRole('button', { name: 'Add column' }));

    expect(harness.cells()).toHaveLength(10);
    expect(harness.cell(0, 4)).toBeInTheDocument();
    expect(harness.cell(1, 4)).toBeInTheDocument();
  });

  it('removes an empty last row without prompting, disabling it at a minimum of one row', async () => {
    await harness.renderComponent();
    const confirmSpy = vi.spyOn(window, 'confirm');

    await user.click(screen.getByRole('button', { name: 'Remove row' }));

    expect(confirmSpy).not.toHaveBeenCalled();
    expect(harness.cells()).toHaveLength(4);
    expect(screen.getByRole('button', { name: 'Remove row' })).toBeDisabled();
  });

  it('removes an empty last column without prompting, disabling it at a minimum of one column', async () => {
    await harness.renderComponent();
    const confirmSpy = vi.spyOn(window, 'confirm');

    await user.click(screen.getByRole('button', { name: 'Remove column' }));

    expect(confirmSpy).not.toHaveBeenCalled();
    expect(harness.cells()).toHaveLength(6);

    await user.click(screen.getByRole('button', { name: 'Remove column' }));
    await user.click(screen.getByRole('button', { name: 'Remove column' }));
    expect(harness.cells()).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Remove column' })).toBeDisabled();
  });

  it('prompts before removing a last row that has values, and removes it when confirmed', async () => {
    await harness.renderComponent();
    await user.type(harness.cell(1, 0), 'Alex');
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    await user.click(screen.getByRole('button', { name: 'Remove row' }));

    expect(window.confirm).toHaveBeenCalledWith('This row has values in it. Remove it anyway?');
    expect(harness.cells()).toHaveLength(4);
  });

  it('keeps a last row with values when the removal prompt is cancelled', async () => {
    await harness.renderComponent();
    await user.type(harness.cell(1, 0), 'Alex');
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    await user.click(screen.getByRole('button', { name: 'Remove row' }));

    expect(harness.cells()).toHaveLength(8);
    expect(harness.cell(1, 0)).toHaveValue('Alex');
  });

  it('prompts before removing a last column that has values, and removes it when confirmed', async () => {
    await harness.renderComponent();
    await user.type(harness.cell(0, 3), '10');
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    await user.click(screen.getByRole('button', { name: 'Remove column' }));

    expect(window.confirm).toHaveBeenCalledWith('This column has values in it. Remove it anyway?');
    expect(harness.cells()).toHaveLength(6);
  });

  it('keeps a last column with values when the removal prompt is cancelled', async () => {
    await harness.renderComponent();
    await user.type(harness.cell(0, 3), '10');
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    await user.click(screen.getByRole('button', { name: 'Remove column' }));

    expect(harness.cells()).toHaveLength(8);
    expect(harness.cell(0, 3)).toHaveValue('10');
  });

  it('clears the table back to the starting 2x4 grid and saves it when confirmed', async () => {
    const { fixture } = await harness.renderComponent();
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    await user.type(harness.cell(0, 0), 'Alex');
    await user.click(screen.getByRole('button', { name: 'Clear table' }));

    expect(window.confirm).toHaveBeenCalledWith('Clear the entire table? This cannot be undone.');
    expect(harness.cells()).toHaveLength(8);
    expect(harness.cell(0, 0)).toHaveValue('');
    expect(screen.getByText('All changes saved')).toBeInTheDocument();
    expect(fixture.componentInstance.hasUnsavedProgress()).toBe(false);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).cells).toEqual([
      ['', '', '', ''],
      ['', '', '', ''],
    ]);
  });

  it('leaves the table untouched when clearing is cancelled', async () => {
    await harness.renderComponent();
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    await user.type(harness.cell(0, 0), 'Alex');
    await user.click(screen.getByRole('button', { name: 'Clear table' }));

    expect(harness.cell(0, 0)).toHaveValue('Alex');
  });

  it('saves to localStorage and clears the unsaved-changes flag', async () => {
    const { fixture } = await harness.renderComponent();

    await user.type(harness.cell(0, 0), 'Alex');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByText('All changes saved')).toBeInTheDocument();
    expect(fixture.componentInstance.hasUnsavedProgress()).toBe(false);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).cells[0][0]).toBe('Alex');
  });

  it('restores a previously saved grid on load', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ cells: [['Alex', 'Sam'], ['10', '12']] }),
    );

    await harness.renderComponent();

    expect(harness.cells()).toHaveLength(4);
    expect(harness.cell(0, 0)).toHaveValue('Alex');
    expect(harness.cell(1, 1)).toHaveValue('12');
  });

  it('has no accessibility violations', async () => {
    const { container } = await harness.renderComponent();
    await expectNoA11yViolations(container);
  });
});
