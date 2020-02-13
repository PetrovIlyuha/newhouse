import { userResolvers } from './User';
import { viewerResolvers } from './Viewer';
import { listingResolvers } from './Listing';
import { bookingsResolver } from './Booking';

import merge from 'lodash.merge';

export const resolvers = merge(
  viewerResolvers,
  bookingsResolver,
  userResolvers,
  listingResolvers
);
