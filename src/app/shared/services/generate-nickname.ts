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
 * Объединяет базовые слова, опционально накладывает префиксы и строго разделяет
 * использование текстовых суффиксов или генерации трех случайных чисел.
 */
export function generateNickname(): string {
  const adj = getRandomItem(adjectives);
  const noun = getRandomItem(nouns);

  // 1. Базовая склейка слов (50/50)
  const baseWords = Math.random() < 0.5 ? `${adj}${noun}` : `${noun}${adj}`;

  // 2. Выбираем случайные обертки
  const randomWrap = getRandomItem(customWrappers);

  // Применяем префикс с шансом 50%
  const prefix = Math.random() < 0.5 ? randomWrap.prefix : '';

  // 3. Строгое ветвление хвоста: или текстовый суффикс, или числа (но не вместе)
  let tail = '';
  if (Math.random() < 0.5 && randomWrap.suffix) {
    tail = randomWrap.suffix;
  } else {
    // Алгоритм генерации 3 цифр в диапазоне [0..4]
    tail = Array.from({ length: 3 }, () => Math.floor(Math.random() * 5)).join('');
  }

  // 4. Сборка полной строки и финальная Leet-мутация
  return mutateWord(`${prefix}${baseWords}${tail}`);
}
