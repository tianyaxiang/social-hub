import { PlatformAdapter } from '@/lib/platforms/adapter';
import { TwitterAdapter } from './platforms/twitter';

const adapters: Map<string, PlatformAdapter> = new Map();

export function getAdapter(name: string): PlatformAdapter | undefined {
  if (!adapters.has(name)) {
    switch (name) {
      case 'twitter':
        adapters.set(name, new TwitterAdapter());
        break;
      default:
        return undefined;
    }
  }
  return adapters.get(name);
}
