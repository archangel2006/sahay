import { ActivityMeta } from '../../types';

export const ACTIVITIES: ActivityMeta[] = [
  {
    id: 'memory',
    title: 'Memory Match',
    description: 'Find pairs of familiar tea garden objects and nature motifs',
    category: 'Memory',
    level: 2,
    maxLevel: 5,
    status: 'active',
    iconName: 'leaf',
  },
  {
    id: 'pattern',
    title: 'Pattern Recall',
    description: 'Watch the sequence light up, then repeat it back correctly',
    category: 'Working Memory',
    level: 1,
    maxLevel: 5,
    status: 'active',
    iconName: 'grid',
  },
  {
    id: 'routine',
    title: 'Daily Routine Recall',
    description: 'Arrange daily morning habits and tasks in sequential order',
    category: 'Executive Function',
    level: 1,
    maxLevel: 3,
    status: 'active',
    iconName: 'calendar',
  },
  {
    id: 'spot',
    title: 'Spot the Difference',
    description: 'Train visual focus and attention by identifying subtle contrast differences',
    category: 'Attention',
    level: 1,
    maxLevel: 3,
    status: 'active',
    iconName: 'eye',
  },
  {
    id: 'faces',
    title: 'Face & Family Match',
    description: 'Match family names to their relationships and warm memories',
    category: 'Memory',
    level: 1,
    maxLevel: 3,
    status: 'contribute', // Open for contributor PR
    iconName: 'user',
  },
  {
    id: 'odd',
    title: 'Odd One Out',
    description: 'Categorical classification — discover which item belongs to another group',
    category: 'Executive Function',
    level: 1,
    maxLevel: 3,
    status: 'contribute', // Open for contributor PR
    iconName: 'sparkles',
  },
  {
    id: 'numbers',
    title: 'Number Recall (Digit Span)',
    description: 'Memorise digit sequences of expanding lengths and key them in',
    category: 'Working Memory',
    level: 1,
    maxLevel: 6,
    status: 'contribute', // Open for contributor PR
    iconName: 'hash',
  },
];
