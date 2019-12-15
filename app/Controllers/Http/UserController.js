'use strict'

const Database = use('Database')
const User = use('App/Models/User')

class UserController {
  async store ({ request }) {
    const { permissions, roles, ...data } = request.only([
      'username',
      'email',
      'password',
      'permissions',
      'roles'
    ])

    const addresses = request.input('addresses')

    const trx = await Database.beginTransaction()

    const user = await User.create(data)
    await user.addresses().createMany(addresses)

    if (roles) {
      await user.roles().attach(roles)
    }

    if (permissions) {
      await user.permissions().attach(permissions)
    }

    await trx.commit()

    await user.loadMany(['roles', 'permissions'])

    return user
  }

  async update ({ request, params }) {
    const { permissions, roles, ...data } = request.only([
      'username',
      'email',
      'password',
      'permissions',
      'roles'
    ])

    // const addresses = request.input('addresses')

    const trx = await Database.beginTransaction()

    const user = await User.findOrFail(params.id)
    user.merge(data)
    await user.save(trx)
    // await user.addresses().createMany(addresses)

    if (roles) {
      await user.roles().sync(roles, trx)
    }

    if (permissions) {
      await user.permissions().sync(permissions, trx)
    }

    await trx.commit()

    await user.loadMany(['roles', 'permissions'])

    return user
  }
}

module.exports = UserController
