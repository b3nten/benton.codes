package core

import (
	"strings"
)

// dedent removes the common leading whitespace from a multiline string.
func Dedent(s string) string {
	lines := strings.Split(s, "\n")
	if len(lines) == 0 {
		return ""
	}

	// Find the minimum common indentation
	minIndent := -1
	for _, line := range lines {
		if strings.TrimSpace(line) == "" { // Skip empty lines for indentation calculation
			continue
		}
		indent := 0
		for _, r := range line {
			if r == ' ' || r == '\t' {
				indent++
			} else {
				break
			}
		}
		if minIndent == -1 || indent < minIndent {
			minIndent = indent
		}
	}

	if minIndent <= 0 { // No common indent or empty string
		return strings.TrimSpace(s) // Trim leading/trailing whitespace from the whole string
	}

	// Apply dedent
	var resultLines []string
	for _, line := range lines {
		if len(line) >= minIndent {
			resultLines = append(resultLines, line[minIndent:])
		} else {
			resultLines = append(resultLines, line) // Line is shorter than minIndent, keep as is
		}
	}

	return strings.Join(resultLines, "\n")
}
