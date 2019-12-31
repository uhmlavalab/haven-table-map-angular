import { TouchPoint } from '@app/touch-ui/touchpoint';
import { Cluster } from '@app/touch-ui/cluster';

export interface TouchData {
    touchList: { [key: string]: TouchPoint };
    clusters: { [key: string]: Cluster[] };
    clicks: Touch[];
}
