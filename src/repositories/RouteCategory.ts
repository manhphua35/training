import { Route } from '../entities/Route';
import { myDataSource } from '../config/app-data-source';

export const RouteRepository = myDataSource.getRepository(Route);
