'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('users', 'UserController.store').validator('User')
Route.put('users/:id', 'UserController.update')
Route.post('sessions', 'SessionController.store').validator('Session')

Route.post('passwords', 'ForgotPasswordController.store').validator('ForgotPassword')
Route.put('passwords', 'ForgotPasswordController.update').validator('ResetPassword')

Route.get('files/:id', 'FileController.show')

Route.group(() => {
  Route.post('files', 'FileController.store')

  Route.resource('permissions', 'PermissionController').apiOnly()

  Route.resource('roles', 'RoleController').apiOnly()

  Route.resource('projects', 'ProjectController')
    .apiOnly()
    .except(['index', 'show'])
    .validator(new Map([[['projects.store'], ['Project']]]))

  Route.resource('projects.tasks', 'TaskController')
    .apiOnly()
    .except(['index', 'show'])
    .validator(new Map([[['projects.tasks.store'], ['Task']]]))
}).middleware(['auth', 'is:(administrator || project_manager)'])

Route.get('projects', 'ProjectController.index')
  .middleware(['auth', 'can:(read_project)'])

Route.get('projects/:id', 'ProjectController.show')
  .middleware(['auth', 'can:(read_project)'])

Route.get('projects/:projects_id/tasks', 'TaskController.index')
  .middleware(['auth', 'can:read_task'])

Route.get('projects/:projects_id/tasks/:id', 'TaskController.show')
  .middleware(['auth', 'can:read_task'])
