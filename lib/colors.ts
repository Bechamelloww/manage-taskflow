export interface TaskColor {
  name: string;
  hex: string;
  tint: string;
}

export const TASK_COLORS: TaskColor[] = [
  { name: 'Bleu',      hex: '#007AFF', tint: '#E5F1FF' },
  { name: 'Violet',    hex: '#AF52DE', tint: '#F4E8FB' },
  { name: 'Rose',      hex: '#FF2D55', tint: '#FFE5EC' },
  { name: 'Orange',    hex: '#FF9500', tint: '#FFF0DB' },
  { name: 'Jaune',     hex: '#FFCC00', tint: '#FFF8D6' },
  { name: 'Vert',      hex: '#34C759', tint: '#DEF7E4' },
  { name: 'Turquoise', hex: '#5AC8FA', tint: '#E1F5FE' },
  { name: 'Gris',      hex: '#8E8E93', tint: '#ECECEE' },
];

export const DEFAULT_COLOR = TASK_COLORS[0].hex;

export const getTint = (hex?: string | null): string => {
  if (!hex) return '#F2F2F7';
  const found = TASK_COLORS.find(c => c.hex.toLowerCase() === hex.toLowerCase());
  return found ? found.tint : '#F2F2F7';
};

// App theme
export const theme = {
  bg: '#F5F6FA',
  surface: '#FFFFFF',
  text: '#1C1C1E',
  textMuted: '#8E8E93',
  textSoft: '#6B6B70',
  border: '#ECECEE',
  primary: '#5B6CFF',
  primaryDark: '#3D4FE0',
  danger: '#FF3B30',
  success: '#34C759',
};
