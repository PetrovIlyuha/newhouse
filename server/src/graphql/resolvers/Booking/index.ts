import { IResolvers } from 'apollo-server-express';
import { Request } from 'express';
import { Stripe } from '../../../lib/api/Stripe';
import { Booking, Listing, Database, BookingsIndex } from '../../../lib/types';
import { authorize } from '../../../lib/utils';
import { CreateBookingArgs } from './types';
import { ObjectId } from 'mongodb';

const resovleBookingsIndex = (
  bookingsIndex: BookingsIndex,
  checkInDate: string,
  checkOutDate: string
): BookingsIndex => {
  let dateCursor = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const newBookingsIndex: BookingsIndex = { ...bookingsIndex };

  while (dateCursor < checkOut) {
    const year = dateCursor.getUTCFullYear();
    const month = dateCursor.getUTCMonth();
    const day = dateCursor.getUTCDay();

    if (!newBookingsIndex[year]) {
      newBookingsIndex[year] = {};
    }

    if (!newBookingsIndex[year][month]) {
      newBookingsIndex[year][month] = {};
    }

    if (!newBookingsIndex[year][month][day]) {
      newBookingsIndex[year][month][day] = true;
    } else {
      throw new Error(
        "Selected dates can't overlap the dates that have already been booked"
      );
    }

    dateCursor = new Date(dateCursor.getTime() + 86400000);
  }

  return newBookingsIndex;
};

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

        await Stripe.charge(totalPrice, source, host.walletId);

        const insertResult = await db.bookings.insertOne({
          _id: new ObjectId(),
          listing: listing._id,
          tenant: viewer._id,
          checkIn,
          checkOut
        });

        const insertedBooking: Booking = insertResult.ops[0];

        await db.users.updateOne(
          {
            _id: host._id
          },
          {
            $inc: { income: totalPrice }
          }
        );

        await db.users.updateOne(
          {
            _id: viewer._id
          },
          {
            $push: { bookings: insertedBooking._id }
          }
        );

        await db.listings.updateOne(
          {
            _id: listing._id
          },
          {
            $set: { bookingsIndex },
            $push: { bookings: insertedBooking._id }
          }
        );

        return insertedBooking;
      } catch (err) {
        throw new Error(`Failed to create a booking: ${err}`);
      }
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
    },
    tenant: (booking: Booking, _args: {}, { db }: { db: Database }) => {
      return db.users.findOne({
        _id: booking.tenant
      });
    }
  }
};
