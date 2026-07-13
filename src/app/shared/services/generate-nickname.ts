const adjectives = [
  'Angry', 'Mad', 'Deadly', 'Ghostly', 'Dark', 'Silent', 'Toxic', 'Shadow', 'Epic', 'Sharp',
  'Golden', 'Iron', 'Stone', 'Diamond', 'Rusty', 'Deep', 'Wild', 'Hard', 'Ancient', 'Lucky',
  'Magic', 'Mystic', 'Cosmic', 'Red', 'Neon', 'Crypto', 'Mega', 'Alpha', 'Omega', 'Secret',
  'Super', 'Frosty', 'Fiery', 'Atomic', 'Cyber', 'Pixel', 'Sonic', 'Hyper', 'Brave', 'Crazy',
  'Sosun', 'Perdun'
];

const nouns = [
  'Hunter', 'Knight', 'Blade', 'Phantom', 'Rogue', 'Slayer', 'Ninja', 'Beast', 'Warrior', 'Viper',
  'Crafter', 'Miner', 'Builder', 'Golem', 'Digger', 'Zombie', 'Axolotl', 'Opezdal', 'Skuff', 'Oguzok',
  'Wizard', 'Hacker', 'Admin', 'Dragon', 'Lord', 'King', 'Boss', 'Pixel', 'Cube', 'Block',
  'Hero', 'Noob', 'Pro', 'Spider', 'Skeleton', 'Slime', 'Wolf', 'Titan', 'Raptor', 'Ghost'
];

const leetReplacements: Record<string, string> = {
  'e': '3', 'E': '3', 'i': '1', 'I': '1',
  'o': '0', 'O': '0', 's': '5', 'S': '5'
};

const customWrappers = [
  { prefix: 'IQ_', suffix: '' },
  { prefix: 'Mr_', suffix: '' },
  { prefix: 'Miss_', suffix: '' },
  { prefix: 'Dr_', suffix: '' },
  { prefix: '', suffix: '_YT' },
  { prefix: '', suffix: '_Top' },
  { prefix: '', suffix: '666' },
  { prefix: '', suffix: '777' },
  { prefix: 'The_', suffix: '' },
  { prefix: 'i_', suffix: '' }
];

const getRandomItem = (arr: any[]): any => arr[Math.floor(Math.random() * arr.length)];

const mutateWord = (nickname: string): string =>
  nickname
    .split('')
    .map(char => (leetReplacements[char] && Math.random() < 0.2 ? leetReplacements[char] : char))
    .join('');

/**
 * Генерирует уникальный игровой никнейм.
 * Строго гарантирует длину строки от 3 до 16 символов.
 */
export function generateNickname(): string {
  let baseWords = '';
  let prefix = '';
  let tail = '';
  let totalLength = 0;

  while (totalLength < 3 || totalLength > 16) {
    const adj = getRandomItem(adjectives);
    const noun = getRandomItem(nouns);

    baseWords = Math.random() < 0.5 ? `${adj}${noun}` : `${noun}${adj}`;

    const randomWrap = getRandomItem(customWrappers);
    prefix = Math.random() < 0.5 ? randomWrap.prefix : '';

    if (Math.random() < 0.5 && randomWrap.suffix) {
      tail = randomWrap.suffix;
    } else {
      tail = Array.from({ length: 3 }, () => Math.floor(Math.random() * 5)).join('');
    }

    totalLength = prefix.length + baseWords.length + tail.length;
  }

  return mutateWord(`${prefix}${baseWords}${tail}`);
}
