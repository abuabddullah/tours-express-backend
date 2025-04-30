import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('bookings', (table) => {
    table.increments('id').primary();
    table.integer('tour_id').unsigned().notNullable().references('id').inTable('tours');
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users');
    table.date('booking_date').notNullable();
    table.enum('status', ['pending', 'confirmed', 'cancelled']).defaultTo('pending');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('bookings');
}
