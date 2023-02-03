import fs from 'fs/promises'
import nodePath from 'path'
import getFolderSize from 'get-folder-size'
import { formatInternalErrorMessage } from './utils.js'

const fileContentMap = new Map<string, Buffer>()
const fileSizeMap = new Map<string, number>()
const dirSizeMap = new Map<string, number>()
const dirSizeMapIgnoreFolderSize = new Map<string, number>()

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
          content = await fs.readFile(path)
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
          fileSize = (await fs.stat(path)).size
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
  ensureSize: (options: { ignoreFolderSize: boolean }) => Promise<number>
}

const lstatIngoreDirectorySize = async (path: string, ...rest: any[]) => {
  const lstatReturn = await fs.lstat(path, ...rest)
  if (lstatReturn.isDirectory()) {
    // typescript doesn't accept bigint for this
    lstatReturn.size = 0n as any
  }
  return lstatReturn
}

export function makeDirHandle(path: string): DirHandle {
  return {
    name: nodePath.parse(path).name,
    path,
    async ensureSize({ ignoreFolderSize }) {
      const finalDirSizeMap = ignoreFolderSize
        ? dirSizeMapIgnoreFolderSize
        : dirSizeMap
      let dirSize = finalDirSizeMap.get(path)
      if (dirSize === undefined) {
        try {
          dirSize = await (
            getFolderSize as unknown as typeof getFolderSize.default
          )
            // Seems getFolderSize has some type error
            .strict(path, {
              fs: {
                lstat: ignoreFolderSize ? lstatIngoreDirectorySize : fs.lstat,
                readdir: fs.readdir
              }
            })
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
        finalDirSizeMap.set(path, dirSize)
      }
      return dirSize
    }
  }
}
