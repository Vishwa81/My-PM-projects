import { pgTable, uuid, varchar, text, integer, timestamp, index, check } from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";

export const restaurants = pgTable("restaurants", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  cuisine: varchar("cuisine", { length: 255 }).notNull(),
  address: text("address"),
  imageUrl: text("image_url"),
  priceRange: varchar("price_range", { length: 50 }).default("₹₹"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    restaurantId: uuid("restaurant_id")
      .notNull()
      .references(() => restaurants.id, { onDelete: "cascade" }),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    title: varchar("title", { length: 255 }),
    comment: text("comment").notNull(),
    status: varchar("status", { length: 50 }).default("published").notNull(),
    helpfulCount: integer("helpful_count").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("restaurant_id_idx").on(table.restaurantId),
    index("customer_id_idx").on(table.customerId),
    index("rating_idx").on(table.rating),
    index("created_at_idx").on(table.createdAt),
    check("rating_range_check", sql`${table.rating} >= 1 AND ${table.rating} <= 5`),
  ]
);

export const restaurantsRelations = relations(restaurants, ({ many }) => ({
  reviews: many(reviews),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  restaurant: one(restaurants, {
    fields: [reviews.restaurantId],
    references: [restaurants.id],
  }),
  customer: one(customers, {
    fields: [reviews.customerId],
    references: [customers.id],
  }),
}));

export type Restaurant = typeof restaurants.$inferSelect;
export type NewRestaurant = typeof restaurants.$inferInsert;
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
