import { userResolvers } from './User';
import merge from 'lodash.merge';
import { viewerResolvers } from './Viewer';

export const resolvers = merge(viewerResolvers, userResolvers);
