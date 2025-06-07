/**
 * CLI color utility for terminal output
 */
export enum Colors {
  Reset = '\x1b[0m',
  Bright = '\x1b[1m',
  Dim = '\x1b[2m',
  Underscore = '\x1b[4m',
  Blink = '\x1b[5m',
  Reverse = '\x1b[7m',
  Hidden = '\x1b[8m',
  
  // Foreground colors
  FgBlack = '\x1b[30m',
  FgRed = '\x1b[31m',
  FgGreen = '\x1b[32m',
  FgYellow = '\x1b[33m',
  FgBlue = '\x1b[34m',
  FgMagenta = '\x1b[35m',
  FgCyan = '\x1b[36m',
  FgWhite = '\x1b[37m',
  
  // Background colors
  BgBlack = '\x1b[40m',
  BgRed = '\x1b[41m',
  BgGreen = '\x1b[42m',
  BgYellow = '\x1b[43m',
  BgBlue = '\x1b[44m',
  BgMagenta = '\x1b[45m',
  BgCyan = '\x1b[46m',
  BgWhite = '\x1b[47m'
}

/**
 * Colorize text for terminal output
 * @param text Text to colorize
 * @param color ANSI color code
 * @returns Colorized text
 */
export function colorize(text: string, color: Colors): string {
  return `${color}${text}${Colors.Reset}`;
}

/**
 * Format text as a success message (green)
 */
export function success(text: string): string {
  return colorize(text, Colors.FgGreen);
}

/**
 * Format text as an error message (red)
 */
export function error(text: string): string {
  return colorize(text, Colors.FgRed);
}

/**
 * Format text as a warning message (yellow)
 */
export function warning(text: string): string {
  return colorize(text, Colors.FgYellow);
}

/**
 * Format text as an info message (cyan)
 */
export function info(text: string): string {
  return colorize(text, Colors.FgCyan);
}

/**
 * Format text as a header (blue background, white text)
 */
export function header(text: string): string {
  return colorize(` ${text} `, Colors.FgWhite) + colorize('', Colors.BgBlue);
}

/**
 * Format text as a title (bright, magenta)
 */
export function title(text: string): string {
  return colorize(text, Colors.Bright) + colorize(text, Colors.FgMagenta);
}

/**
 * Format text as a prompt (bright, cyan)
 */
export function prompt(text: string): string {
  return colorize(`${text}`, Colors.FgCyan) + colorize('', Colors.Bright);
}
