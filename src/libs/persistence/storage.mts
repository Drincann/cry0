import fs from 'fs/promises'
import path from 'path'
import { logger } from '../../cli/logger/index.mjs'

interface Storage<Keys extends string, DataTypes extends { [key in Keys]: any }> {
  save<K extends Keys>(key: K, data: DataTypes[K]): Promise<void>
  load<K extends Keys>(key: K): Promise<DataTypes[K]>
}

export class UserHomeJsonStorage<
  DataTypes extends { [key in Keys]: any },
  Keys extends string = Exclude<keyof DataTypes, symbol | number>
> {
  private cache?: DataTypes

  constructor() { }
  private async loadAllData(): Promise<DataTypes> {
    const storageRoot = getStorageRoot()
    await createIfNotExists(storageRoot)
    const data = {} as DataTypes

    await this.walk(storageRoot, async file => {
      const key = path.basename(file, '.json')
      try {
        const value = JSON.parse(await fs.readFile(file, 'utf-8'))
        data[key as Keys] = value
      } catch (err) {
        logger.error(`storage.mts: class UserHomeJsonStorage: Error loading data for key ${key}`)
        throw err
      }
    })

    return data
  }

  private async walk(dir: string, callback: (file: string) => Promise<void>) {
    const files = await fs.readdir(dir)

    for (const file of files) {
      const filePath = path.join(dir, file)
      const stat = await fs.stat(filePath)

      if (stat.isFile()) {
        await callback(filePath)
      } else {
        logger.warn(`storage.mts: method walk: Skipping directory ${filePath}`)
      }
    }
  }

  public async save<K extends Keys>(key: K, data: DataTypes[K]): Promise<void> {
    if (!this.cache) {
      this.cache = await this.loadAllData()
    }

    this.cache[key] = data
    const storageRoot = getStorageRoot()
    await createIfNotExists(storageRoot)
    const file = path.join(storageRoot, `${key}.json`)
    fs.writeFile(file, JSON.stringify(data))
  }

  public async load<K extends Keys>(key: K): Promise<DataTypes[K]> {
    if (!this.cache) {
      this.cache = await this.loadAllData()
    }

    return this.cache[key]
  }

}

const getStorageRoot = () => {
  return path.resolve(getUserHome(), '.cry0')
}

const createIfNotExists = async (dir: string) => {
  try {
    await fs.mkdir(dir)
  } catch (err) {
    if ((err as any)?.code !== 'EEXIST') {
      throw err
    }
  }

  return dir
}

const getUserHome = () => {
  if (process.env.HOME) {
    logger.debug('storage.mts: method getUserHome: Using HOME')
    return process.env.HOME
  }

  if (process.env.USERPROFILE) {
    logger.debug('storage.mts: method getUserHome: Using USERPROFILE')
    return process.env.USERPROFILE
  }

  throw new Error('Could not find home directory from environment variables')
}
