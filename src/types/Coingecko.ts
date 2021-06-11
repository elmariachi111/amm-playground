export interface CoinInfo {
  id: string;
  symbol: string;
  name: string;
  categories: string[];
  description: Record<'en', string>;
  image: Record<'thumb' | 'small' | 'large', string>;
  last_updated: string;
}
