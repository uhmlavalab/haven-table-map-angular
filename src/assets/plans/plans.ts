import { Plan } from '@app/interfaces';

//import { MaunaKeaPlan } from './maunakea/plan';
import { MauiPlan } from './maui/plan';
import { OahuPlan } from './oahu/plan';
import { BigIslandPlan } from './bigisland/plan';

//export const Plans: Plan[] = [ OahuPlan, BigIslandPlan, MaunaKeaPlan ];
export const Plans: Plan[] = [ OahuPlan, BigIslandPlan, MauiPlan ];
