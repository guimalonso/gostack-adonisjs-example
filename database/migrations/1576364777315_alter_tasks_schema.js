'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterTasksSchema extends Schema {
  up () {
    this.alter('tasks', (table) => {
      table.string('type').notNullable().defaultTo('public')
    })
  }

  down () {
    this.table('tasks', (table) => {
      table.dropColumn('type')
    })
  }
}

module.exports = AlterTasksSchema
