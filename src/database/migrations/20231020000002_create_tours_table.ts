import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('tours', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('description').notNullable();
    table.decimal('price', 10, 2).notNullable();
    table.integer('duration').notNullable();
    table.integer('max_group_size').notNullable();
    table.string('difficulty').notNullable();
    table.decimal('rating_average', 3, 2).defaultTo(4.5);
    table.integer('rating_quantity').defaultTo(0);
    table.string('image_url');
    table.integer('location_id').unsigned().references('id').inTable('locations');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('tours');
}
