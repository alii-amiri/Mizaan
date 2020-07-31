const pb = require('protobufjs')
const {
    createAccountAddress,
    createProjectAddress
} = require('../addressing/address')
const { logger } = require('./logger')


class BC98State {
  constructor (context) {
    this.context = context
    this.addressCache = new Map([])
  }

  encodeFunction (payload, pathFile, pathMessage) {
    try {
      const root = pb.loadSync(pathFile)
      const file = root.lookup(pathMessage)
      let message = []
      let data = []
      payload.forEach((element, index) => {
        message.push(file.create(element))
        data[index] = file.encode(message[index]).finish()
      })
      return data
    } catch (err) {
      const message = err.message ? err.message : err
      logger.error('Something bad happened while encodeing:' + ' ' + message)
      throw new Error('Something bad happened while encodeing:' + ' ' + err)
    }
  }

    // //////////////////////////////////////////////////////////////////////
    // ########## Load and Get Messages #######################
    // /////////////////////////////////////////////////////////////////////

  loadMessage (key, pathFile, pathMessage) {
    let address
    switch (pathMessage) {
      case 'Account':
        address = createAccountAddress(key)
        break
      case 'Project':
        address = createProjectAddress(key)
        break
      default:
        logger.warn('Bad Message!')
        break
    }
    if (this.addressCache.has(address)) {
      if (this.addressCache.get(address) === null) {
        return Promise.resolve(new Map([]))
      } else {
        return Promise.resolve(
                    pb.load(pathFile)
                    .then((root) => {
                      let map = new Map([])
                      const file = root.lookup(pathMessage)
                      const dec = file.decode(this.addressCache.get(address))
                      const decObject = file.toObject(dec)
                      return map.set(address, decObject)
                    })
                    .catch((err) => {
                      const message = err.message ? err.message : err
                      logger.error(`${pathFile} is not loading!: ${message}`)
                      throw new Error(`${pathFile} is not loading!:` + ' ' + err)
                    })
                )
      }
    } else {
      return this.context.getState([address])
            .then((addressValue) => {
              if (!addressValue[address]) {
                this.addressCache.set(address, null)
                return Promise.resolve(new Map([]))
              } else {
                let data = addressValue[address]
                this.addressCache.set(address, data)
                return pb.load(pathFile)
                    .then((root) => {
                      var map = new Map([])
                      const file = root.lookup(pathMessage)
                      const dec = file.decode(data)
                      const decObject = file.toObject(dec)
                      return map.set(address, decObject)
                    })
                    .catch((err) => {
                      const message = err.message ? err.message : err
                      logger.error(`${pathFile} is not loading!: ${message}`)
                      throw new Error(`${pathFile} is not loading!:` + ' ' + err)
                    })
              }
            })
            .catch((err) => {
              const message = err.message ? err.message : err
              logger.error(`getState in blockchain is not responding!: ${message}`)
              throw new Error('getState in blockchain is not responding!:' + ' ' + err)
            })
    }
  }

  getMessage (key, pathMessage) {
    let address
    let pathFile
    switch (pathMessage) {
      case 'Account':
        address = createAccountAddress(key)
        pathFile = '../protos/account.proto'
        break
      case 'Project':
        address = createProjectAddress(key)
        pathFile = '../protos/project.proto'
      default:
        logger.warn('Bad Message!')
        break
    }
    return this.loadMessage(key, pathFile, pathMessage)
        .then((elements) => elements.get(address))
        .catch((err) => {
          const message = err.message ? err.message : err
          logger.error(`loadMessage has some problems: ${message}`)
          throw new Error('loadMessage has some problems:' + ' ' + err)
        })
  }


    // //////////////////////////////////////////////////////////////////////
    // ########## Set Accounts #######################
    // /////////////////////////////////////////////////////////////////////

  setAccount (username, pubKey) {
    try {
    const payloadAccount = {
      publickey: pubKey,
      username: username,
      balance: '0'
    }
    const dataAccount = this.encodeFunction([payloadAccount], '../protos/account.proto', 'Account')
    const addressAccount = createAccountAddress(pubKey)
    this.addressCache.set(addressAccount, dataAccount[0])

    let entries = {
      [addressAccount]: dataAccount[0]
    }
    return this.context.setState(entries)
    } catch (err) {
      const message = err.message ? err.message : err
      logger.error(`setState in setAccount has some problems: ${message}`)
      throw new Error('setState in setAccount has some problems:' + ' ' + err)
    }
  }


    // //////////////////////////////////////////////////////////////////////
    // ########## Set Charge #######################
    // /////////////////////////////////////////////////////////////////////

  setCharge (amount, pubKey) {
    return this.getMessage(pubKey, 'Account')
    .then((accountValue) => {
      if (!accountValue || accountValue.publickey !== pubKey) {
        logger.error('No Account exists in setCharge!')
        throw new Error('The Account is not valid!')
      }

      const balance = (Number(accountValue.balance) + Number(amount)).toFixed(3)

      const payloadAccount = {
        ...accountValue,
        balance
      }
      const dataAccount = this.encodeFunction([payloadAccount], '../protos/account.proto', 'UserAccount')
      const addressAccount = createAccountAddress(pubKey)

      this.addressCache.set(addressAccount, dataAccount[0])
      let entries = {
        [addressAccount]: dataAccount[0]
      }
      logger.info('The balance is changing to: ' + balance)
      return this.context.setState(entries)
    })
    .catch((err) => {
      let message = err.message ? err.message : err
      logger.error(`getAccount in blockchain is not responding!: ${message}`)
      throw new Error('getAccount in blockchain is not responding!:' + ' ' + err)
    })
  }

  setProject(name, description, goal, pubKey) {
    return this.getMessage(pubKey, 'Account')
    .then((accountValue) => {
      if (!accountValue || accountValue.publickey !== pubKey) {
        logger.error('No Account exists in setCharge!')
        throw new Error('The Account is not valid!')
      }
      try {
        const payloadProject = {
          name: name,
          description: description,
          goal: goal,
          gathered: '0',
          status: 'ungoing',
        }
        const dataProject = this.encodeFunction([payloadProject], '../protos/project.proto', 'Project')
        const addressProject = createProjectAddress(`${pubKey}:${name}`)
        this.addressCache.set(addressProject, dataProject[0])
  
        let entries = {
          [addressProject]: dataProject[0]
        }
        return this.context.setState(entries)
      } catch (err) {
        const message = err.message ? err.message : err
        logger.error(`setState in setProject has some problems: ${message}`)
        throw new Error('setState in setProject has some problems:' + ' ' + err)
      }
    })
    .catch((err) => {
      let message = err.message ? err.message : err
      logger.error(`getAccount in blockchain is not responding!: ${message}`)
      throw new Error('getAccount in blockchain is not responding!:' + ' ' + err)
    })
  
  }

  setDonation(project, amount, pubKey) {
    return this.getMessage(pubKey, 'Account')
    .then((accountValue) => {
      if (!accountValue || accountValue.publickey !== pubKey) {
        logger.error('No Account exists in setCharge!')
        throw new Error('The Account is not valid!')
      }

      const currentBalance = Number(accountValue.balance);
      if (currentBalance < Number(amount)) {
        logger.err('Insufficient funds.')
        throw new Error('Insufficient funds.')
      }
      const balance = (currentBalance - Number(amount)).toFixed(3)

      const payloadAccount = {
        ...accountValue,
        balance: balance
      }
      const dataAccount = this.encodeFunction([payloadAccount], '../protos/account.proto', 'UserAccount')
      const addressAccount = createAccountAddress(pubKey)

      return this.getMessage(project, 'Project')
        .then((projectValue) => {
          if (!projectValue || projectValue.status !== 'ungoing') {
            logger.err('Project does not exist')
            throw new Error('Project does not exist')
          }
          let status = projectValue.status;
          if (Number(projectValue.gathered) + Number(amount) >= Number(projectValue.goal)) {
            status = 'over'
          }
          const payloadProject = {
            ...projectValue,
            gathered: Number(projectValue.gathered) + Number(amount),
            status,
          }
          const dataProject = this.encodeFunction([payloadProject], '../protos/project.proto', 'Project')
          const addressProject = createProjectAddress(project)

          this.addressCache.set(addressAccount, dataAccount[0])
          this.addressCache.set(addressProject, dataProject[0])

          let entries = {
            [addressAccount]: dataAccount[0],
            [addressProject]: dataProject[0],
          }
          logger.info('The balance is changing to: ' + balance)
          return this.context.setState(entries)
        })
        .catch((err) => {
          let message = err.message ? err.message : err
          logger.error(`getProject in blockchain is not responding!: ${message}`)
          throw new Error('getProject in blockchain is not responding!:' + ' ' + err)
        })
    })
    .catch((err) => {
      let message = err.message ? err.message : err
      logger.error(`getAccount in blockchain is not responding!: ${message}`)
      throw new Error('getAccount in blockchain is not responding!:' + ' ' + err)
    })
  }
}


module.exports = {
  BC98State
}
