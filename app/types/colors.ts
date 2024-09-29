import { z } from 'zod';

export const colors_enum = z.enum(['bitt','indigo', 'violet', 'fuchsia', 'slate', 'zinc', 'neutral', 'stone', 'cool', 'green', 'emerald', 'teal', 'cyan', 'lime', 'blue', 'sky', 'orange', 'amber', 'yellow']);
export const dark_colors_enum = z.enum(['slate', 'cool', 'zinc', 'stone', 'neutral']);