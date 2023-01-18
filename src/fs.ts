import fs from 'fs'
import nodePath from 'path'
import { promisify } from 'util'
import fastFolderSize from 'fast-folder-size'
import { formatInternalErrorMessage } from './utils'

const fastFolderSizeAsync = promisify(fastFolderSize)
const readFileAsync = promisify(fs.readFile)
const statAsync = promisify(fs.stat)

const fileContentMap = new Map<string, Buffer>()
const fileSizeMap = new Map<string, number>()
const dirSizeMap = new Map<string, number>()

export type FileHandle = {
  name: string
  path: string
  ensureContent: () => Promise<Buffer>
  ensureSize: () => Promise<number>
}

export function makeFileHandle(path: string): FileHandle {
  return {
    name: nodePath.parse(path).name,
    path,
    async ensureContent() {
      let content = fileContentMap.get(path)
      if (content === undefined) {
        try {
          content = await readFileAsync(path)
          fileContentMap.set(path, content)
        } catch (error) {
          console.error(error)
          throw new Error(
            formatInternalErrorMessage(
              'makeFileHandle/ensureContent',
              'read file throws error'
            )
          )
        }
      }
      return content
    },
    async ensureSize() {
      let fileSize = fileSizeMap.get(path)
      if (fileSize === undefined) {
        try {
          fileSize = (await statAsync(path)).size
          fileSizeMap.set(path, fileSize)
        } catch (error) {
          console.error(error)
          throw new Error(
            formatInternalErrorMessage(
              'makeFileHandle/ensureSize',
              'stat file throws error'
            )
          )
        }
      }
      return fileSize
    }
  }
}

export type DirHandle = {
  name: string
  path: string
  ensureSize: () => Promise<number>
}

export function makeDirHandle(path: string): DirHandle {
  return {
    name: nodePath.parse(path).name,
    path,
    async ensureSize() {
      let dirSize = dirSizeMap.get(path)
      if (dirSize === undefined) {
        try {
          dirSize = await fastFolderSizeAsync(path)
        } catch (error) {
          console.error(error)
          throw new Error(
            formatInternalErrorMessage(
              'makeDirHandle/ensureSize',
              'fastFolderSize throws error'
            )
          )
        }
        if (dirSize === undefined) {
          throw new Error(
            formatInternalErrorMessage(
              'makeDirHandle/ensureSize',
              'fastFolderSize returns undefined for ' + path
            )
          )
        }
        dirSizeMap.set(path, dirSize)
      }
      return dirSize
    }
  }
}
