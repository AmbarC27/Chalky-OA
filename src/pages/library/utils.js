export function labelToPrefixes(label) {
    // "A-B" -> ["A","B"], "C-D-E" -> ["C","D","E"]
    return label.split("-").map((s) => s.trim()).filter(Boolean);
  }