import { Plan } from '@app/interfaces';

import { MauiPlan } from './maui/plan';
import { OahuPlan } from './oahu/plan';
import { HecoPlan } from './oahu-heco/plan';
import { BigIslandPlan } from './bigisland/plan';

export const Plans: Plan[] = [ HecoPlan, OahuPlan, BigIslandPlan, MauiPlan ];


