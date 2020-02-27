import { IResolvers } from 'apollo-server-express';
import { Booking, Listing, Database } from '../../../lib/types';

export const bookingsResolver: IResolvers = {
  Mutation: {
    createBooking: () => {
      return 'Mutation.createBooking';
    }
  },
  Booking: {
    id: (booking: Booking): string => {
      return booking._id.toString();
    },
    listing: (
      booking: Booking,
      _args: {},
      { db }: { db: Database }
    ): Promise<Listing | null> => {
      return db.listings.findOne({ _id: booking.listing });
    }
  }
};
