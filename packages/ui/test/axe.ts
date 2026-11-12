import axe from 'axe-core';

/** Runs axe on a rendered container and returns readable violations (empty when accessible). */
export async function axeViolations(container: Element): Promise<string[]> {
  const { violations } = await axe.run(container, {
    rules: {
      // jsdom has no layout, so colour contrast is checked against tokens in @ggem/tokens instead.
      'color-contrast': { enabled: false },
      // Page-level rule: isolated components are not inside page landmarks in tests.
      region: { enabled: false },
    },
  });
  return violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length} nodes)`);
}
