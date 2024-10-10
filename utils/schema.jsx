import {integer, numeric, pgTable, serial, varchar, text} from 'drizzle-orm/pg-core'

// Budget Schema
export const Budgets = pgTable('budgets', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  amount: varchar('amount', { length: 255 }).notNull(),
  icon: varchar('icon', { length: 255 }),
  createdBy: varchar('createdBy', { length: 255 }).notNull(),
  });

// Income Schema

export const Income = pgTable('income', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  amount: varchar('amount', { length: 255 }).notNull(),
  icon: varchar('icon', { length: 255 }),
  createdBy: varchar('createdBy', { length: 255 }).notNull(),
})

// Expenses Schema
export const Expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  amount: varchar('amount', { length: 255 }).notNull(),
  budgetId: integer('budgetId').references(() => Budgets.id),
  createdBy: varchar('createdBy', { length: 255 }).notNull(),
  createdAt: varchar('createdAt', { length: 255 }).notNull(),
});

