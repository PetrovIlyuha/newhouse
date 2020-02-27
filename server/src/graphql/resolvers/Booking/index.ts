import { IResolvers } from 'apollo-server-express';
import { Request } from 'express';
import { Booking, Listing, Database } from '../../../lib/types';
import { authorize } from '../../../lib/utils';
import { CreateBookingArgs } from './types';
import { ObjectId } from 'mongodb';

export const bookingsResolver: IResolvers = {
  Mutation: {
    createBooking: async (
      _root: undefined,
      { input }: CreateBookingArgs,
      { db, req }: { db: Database; req: Request }
    ): Promise<Booking> => {
      try {
        const { id, source, checkIn, checkOut } = input;

        const viewer = await authorize(db, req);
        if (!viewer) {
          throw new Error('viewer cannot be found');
        }
        const listing = await db.listings.findOne({
          _id: new ObjectId(id)
        });
        if (!listing) {
          throw new Error("Listing can't be found...");
        }
        if (listing.host === viewer._id) {
          throw new Error("Viewer can't book her own listing");
        }
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        if (checkOutDate < checkInDate) {
          throw new Error(
            "Checkout Date can't occur as being before Check-in Date"
          );
        }

        const bookingsIndex = resovleBookingsIndex(
          listing.bookingsIndex,
          checkIn,
          checkOut
        );

        const totalPrice =
          listing.price *
          ((checkOutDate.getTime() - checkInDate.getTime()) / 86400000 + 1);

        const host = await db.users.findOne({
          _id: listing.host
        });

        if (!host || !host.walletId) {
          throw new Error(
            "The host either can't be found or is not connected with Stripe account"
          );
        }

        // create Stripe charge on behalf of host

        // insert a new booking to bookings collection

        //update user document of host to increment income

        // update bookings field of tenant

        // update bookings field of listing document

        // return newly inserted booking
      } catch (err) {}
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
