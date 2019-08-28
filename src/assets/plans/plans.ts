import { Plan } from '@app/interfaces';

import { AlphaPlan } from './alpha/plan';
import { BetaPlan } from './beta/plan';

export const Plans: Plan[] = [ AlphaPlan, BetaPlan ];


