import axe from 'axe-core';

/** Runs axe on a rendered container and returns readable violations (empty when accessible). */
export async function axeViolations(container: Element): Promise<string[]> {
  const { violations } = await axe.run(container, {
    // jsdom has no layout, so colour contrast is checked against tokens in @ggem/tokens instead.
    rules: { 'color-contrast': { enabled: false } },
  });
  return violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length} nodes)`);
}
