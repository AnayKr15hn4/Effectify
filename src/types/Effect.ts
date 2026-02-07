export interface Effect {
  id: string;
  title: string;
  category: 'text' | 'scroll' | 'bg' | 'gallery' | 'button' | 'loading' | 'others';
  description: string;
  preview: string;
  video?: string;
  thumbnail?: string;
  code: {
    html: string;
    css: string;
    js: string;
  };
  tags: string[];
  author: string;
  status: string;
}