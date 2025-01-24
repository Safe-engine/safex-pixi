interface FontTag {
  color?: string;
  size?: number;
  text: string;
}

type ParsedResult = FontTag[];

type StyledElement = {
  tag?: string;
  style?: { color?: string; size?: number };
  text: string;
};

export function parseFontString(input: string): ParsedResult {
  const regex = /<font\s+color=['"](#?[0-9a-fA-F]{6})['"](?:\s+size=(\d+))?>(.*?)<\/font>/gi;
  const results: ParsedResult = [];
  let lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = regex.exec(input)) !== null) {
    // Add plain text before the match if it exists
    if (match.index > lastIndex) {
      const plainText = input.slice(lastIndex, match.index)
      if (plainText) {
        results.push({ text: plainText });
      }
    }

    const color = match[1];
    const size = match[2] ? parseInt(match[2], 10) : undefined;
    const text = match[3];

    results.push({ color, size, text });

    lastIndex = regex.lastIndex;
  }

  // Add remaining plain text after the last match
  if (lastIndex < input.length) {
    const plainText = input.slice(lastIndex);
    if (plainText) {
      results.push({ text: plainText });
    }
  }

  return results;
}

export function transformToStyledElements(parsed: ParsedResult): StyledElement[] {
  return parsed.map((item, index) => {
    if (item.color || item.size) {
      return {
        tag: `b${index + 1}`,
        style: { color: item.color, size: item.size },
        text: item.text,
      };
    }
    return {
      text: item.text,
    };
  });
}

export function generateStringFromStyledElements(elements: StyledElement[]): string {
  return elements
    .map((element) => {
      if (!element.tag) {
        return element.text;
      }
      return `<${element.tag}>${element.text}</${element.tag}>`;
    })
    .join('');
}

export function generateStylesFromStyledElements(elements: StyledElement[]) {
  const styles = {};
  elements
    .forEach((element) => {
      const { tag, style } = element
      if (!tag) {
        return;
      }
      styles[element.tag] = style
    })
  return styles
}
